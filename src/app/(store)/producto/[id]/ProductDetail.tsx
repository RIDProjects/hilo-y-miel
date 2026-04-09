"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import Gallery from "@/components/Gallery";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/order";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
}

function extractMaterials(components: Record<string, unknown> | null): string[] {
  if (!components) return [];
  const materials: string[] = [];
  if (components.materials && Array.isArray(components.materials))
    materials.push(...(components.materials as string[]));
  if (components.material && typeof components.material === "string")
    materials.push(components.material);
  if (components.base && typeof components.base === "object") {
    const base = components.base as { material?: string; name?: string };
    if (base.material) materials.push(base.material);
    if (base.name) materials.push(base.name);
  }
  return Array.from(new Set(materials));
}

function extractFeatures(components: Record<string, unknown> | null): string[] {
  if (!components) return [];
  const features: string[] = [];
  if (components.size && typeof components.size === "string")
    features.push(`Tamaño: ${components.size}`);
  if (components.charm && typeof components.charm === "object") {
    const charm = components.charm as { type?: string };
    if (charm.type) features.push(`Dije: ${charm.type}`);
  }
  if (components.colors && Array.isArray(components.colors)) {
    const colors = (components.colors as { name: string }[]).map((c) => c.name);
    if (colors.length > 0) features.push(`Colores: ${colors.join(", ")}`);
  }
  if (components.finish && typeof components.finish === "string")
    features.push(`Acabado: ${components.finish}`);
  return features;
}

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToOrder = () => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    router.push("/confirmar-pedido");
  };

  const materials = extractMaterials(product.components as Record<string, unknown> | null);
  const features = extractFeatures(product.components as Record<string, unknown> | null);

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--color-text)] transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/catalogo" className="hover:text-[var(--color-text)] transition-colors">
            Catálogo
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--color-text)]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <Gallery images={product.images} productName={product.name} />

          <div className="space-y-6">
            <div>
              {product.is_custom && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[rgba(44,74,46,0.1)] text-[var(--brand-green)] text-sm font-medium rounded-full mb-3">
                  <Sparkles className="w-4 h-4" />
                  Diseño custom
                </span>
              )}
              <h1 className="text-3xl lg:text-4xl font-display text-[var(--color-text)]">
                {product.name}
              </h1>
              <p className="text-2xl lg:text-3xl font-medium text-[var(--brand-green)] mt-2">
                {formatPrice(product.price)}
              </p>
            </div>

            {product.description && (
              <p className="text-[var(--color-text-muted)]">{product.description}</p>
            )}

            {product.is_custom && (
              <div className="p-4 bg-[rgba(44,74,46,0.06)] border border-[rgba(44,74,46,0.15)] rounded-lg">
                <p className="text-sm text-[var(--color-text)]">
                  <strong>Este diseño nació de una creación personalizada.</strong>{" "}
                  Cada pieza es única, hecha con dedicación especialmente para vos.
                </p>
              </div>
            )}

            {materials.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-[var(--color-text)] mb-2">
                  Materiales
                </h2>
                <div className="flex flex-wrap gap-2">
                  {materials.map((material, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[var(--brand-cream-dark)] text-[var(--color-text)] rounded-full text-sm"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {features.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-[var(--color-text)] mb-2">
                  Características
                </h2>
                <ul className="space-y-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-[var(--color-text-muted)]">
                      <span className="w-1.5 h-1.5 bg-[var(--brand-green)] rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4">
              {product.is_available ? (
                <button
                  onClick={addToOrder}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-[#FAFAF7] rounded-lg hover:bg-[var(--brand-green-mid)] transition-colors font-medium text-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Agregar al pedido
                </button>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-border)] text-[var(--color-text-muted)] rounded-lg cursor-not-allowed font-medium text-lg"
                >
                  Agotado
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
