import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetail from "./ProductDetail";
import type { Metadata } from "next";
import type { Product } from "@/types/product";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { id: true } });
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true },
  });
  if (!product) return {};
  return {
    title: `${product.name} | Hilo & Miel`,
    description: product.description ?? "Bisutería artesanal hecha a mano.",
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const raw = await prisma.product.findUnique({ where: { id } });
  if (!raw) notFound();
  // Prisma tipifica campos Json? como JsonValue; el cast es seguro porque la
  // estructura en runtime es idéntica al tipo Product del dominio.
  const product = raw as unknown as Product;
  return <ProductDetail product={product} />;
}
