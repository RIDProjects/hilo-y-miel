import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const available = searchParams.get("available");
  const isCustom = searchParams.get("custom");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");

  try {
    const where: Record<string, unknown> = {};

    if (category) where.category = category;
    if (featured === "true") where.featured = true;
    if (available === "true") where.is_available = true;
    if (isCustom === "true") where.is_custom = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    let orderBy: Record<string, string> = { created_at: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "featured") orderBy = { featured: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: 100,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}
