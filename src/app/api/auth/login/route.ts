import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Credenciales de admin no configuradas" },
        { status: 500 }
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      // Tiempo constante para evitar timing attacks
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
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
