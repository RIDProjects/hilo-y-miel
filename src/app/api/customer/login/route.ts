import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signCustomerToken } from "@/lib/jwt";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const customer = await prisma.customer.findUnique({ where: { email } });

    // Tiempo constante para evitar timing attacks
    const passwordMatch = customer
      ? await bcrypt.compare(password, customer.password)
      : await bcrypt.compare(password, "$2b$12$invalidhashfortimingattackprevention");

    if (!customer || !passwordMatch) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const role = (customer.role as "customer" | "admin") || "customer";

    const token = await signCustomerToken({
      customerId: customer.id,
      email: customer.email,
      role,
    });

    const response = NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        role,
      },
    });

    response.cookies.set("hilo-customer-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[customer/login] Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
