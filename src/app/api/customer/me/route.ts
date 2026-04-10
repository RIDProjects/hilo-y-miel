import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCustomerToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("hilo-customer-token")?.value;
  const payload = token ? await verifyCustomerToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: payload.customerId },
    select: { id: true, email: true, name: true, phone: true, created_at: true },
  });

  if (!customer) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ customer });
}
