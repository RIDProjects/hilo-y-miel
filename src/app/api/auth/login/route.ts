import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAdminToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña requeridos" },
        { status: 400 }
      );
    }

    let admin = await prisma.admin.findUnique({ where: { email } });

    // Fallback: si no existe ningún admin, auto-crear desde env vars
    if (!admin) {
      const envEmail = process.env.ADMIN_EMAIL;
      const envPassword = process.env.ADMIN_PASSWORD;
      if (envEmail && envPassword && email === envEmail && password === envPassword) {
        const hashed = await bcrypt.hash(password, 12);
        admin = await prisma.admin.create({ data: { email, password: hashed } });
        console.log("[auth] Admin creado desde variables de entorno");
      }
    }

    if (!admin) {
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const token = await signAdminToken(email);
    const response = NextResponse.json({ success: true });

    response.cookies.set("hilo-admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[auth/login]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
