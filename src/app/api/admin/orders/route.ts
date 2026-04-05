import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  try {
    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (type) where.order_type = type;

    if (dateFrom || dateTo) {
      where.created_at = {};
      if (dateFrom) {
        (where.created_at as Record<string, Date>).gte = new Date(dateFrom);
      }
      if (dateTo) {
        (where.created_at as Record<string, Date>).lte = new Date(dateTo);
      }
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: {
        orderItems: {
          include: { product: true },
        },
        customDesign: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
  }
}
