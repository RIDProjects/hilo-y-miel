import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, product_id } = body;

    const updateData: Record<string, unknown> = { status };
    if (product_id) updateData.product_id = product_id;

    const design = await prisma.customDesign.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(design);
  } catch (error) {
    console.error("Error updating design:", error);
    return NextResponse.json({ error: "Error updating design" }, { status: 500 });
  }
}
