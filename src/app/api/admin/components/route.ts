import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const components = await prisma.component.findMany({
      orderBy: [
        { type: "asc" },
        { sort_order: "asc" },
      ],
    });
    return NextResponse.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json({ error: "Error fetching components" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, image_url, is_active, price_modifier, sort_order } = body;

    const component = await prisma.component.create({
      data: {
        type,
        name,
        image_url: image_url || null,
        is_active: is_active ?? true,
        price_modifier: price_modifier || 0,
        sort_order: sort_order || 0,
      },
    });

    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error("Error creating component:", error);
    return NextResponse.json({ error: "Error creating component" }, { status: 500 });
  }
}
