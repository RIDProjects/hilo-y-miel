import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCustomerToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("hilo-customer-token")?.value;
  const payload = token ? await verifyCustomerToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { customer_id: payload.customerId },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      customer_name: true,
      customer_phone: true,
      order_type: true,
      items: true,
      status: true,
      design_summary: true,
      created_at: true,
      notes: true,
    },
  });

  return NextResponse.json({ orders });
}
