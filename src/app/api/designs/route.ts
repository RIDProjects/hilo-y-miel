import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const designs = await prisma.customDesign.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: {
        order: {
          select: {
            id: true,
            customer_name: true,
            customer_email: true,
            customer_phone: true,
            created_at: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(designs);
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json({ error: "Error fetching designs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      base_type,
      material,
      color_palette,
      charms,
      size,
      additional_notes,
      preview_config,
    } = body;

    const customDesign = await prisma.customDesign.create({
      data: {
        orderId,
        base_type,
        material,
        color_palette,
        charms,
        size,
        additional_notes: additional_notes || null,
        preview_config: preview_config || null,
        status: "pending",
      },
    });

    return NextResponse.json(customDesign, { status: 201 });
  } catch (error) {
    console.error("Error creating design:", error);
    return NextResponse.json({ error: "Error creating design" }, { status: 500 });
  }
}
