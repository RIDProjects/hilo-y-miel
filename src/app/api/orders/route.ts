import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      notes,
      items,
      customDesign,
      isCustomDesign,
    } = body;

    const order = await prisma.order.create({
      data: {
        customer_name,
        customer_email,
        customer_phone,
        notes: notes || null,
        order_type: isCustomDesign ? "custom" : "standard",
        items: items as unknown as any,
        design_summary: isCustomDesign
          ? `${customDesign.base_type} - ${customDesign.material} - ${customDesign.size}`
          : null,
        customDesign: isCustomDesign
          ? {
              create: {
                base_type: customDesign.base_type,
                material: customDesign.material,
                color_palette: customDesign.color_palette,
                charms: customDesign.charms,
                size: customDesign.size,
                additional_notes: customDesign.additional_notes || null,
              },
            }
          : undefined,
      },
    });

    if (!isCustomDesign && items && items.length > 0) {
      for (const item of items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          },
        });
      }
    }

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}