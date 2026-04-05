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
        order: true,
      },
    });

    return NextResponse.json(designs);
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json({ error: "Error fetching designs" }, { status: 500 });
  }
}
