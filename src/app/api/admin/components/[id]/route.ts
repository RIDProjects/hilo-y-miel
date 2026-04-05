import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, name, image_url, is_active, price_modifier, sort_order } = body;

    const component = await prisma.component.update({
      where: { id },
      data: {
        type,
        name,
        image_url: image_url || null,
        is_active,
        price_modifier,
        sort_order,
      },
    });

    return NextResponse.json(component);
  } catch (error) {
    console.error("Error updating component:", error);
    return NextResponse.json({ error: "Error updating component" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.component.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting component:", error);
    return NextResponse.json({ error: "Error deleting component" }, { status: 500 });
  }
}
