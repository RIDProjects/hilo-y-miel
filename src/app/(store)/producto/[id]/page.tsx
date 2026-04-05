"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import Gallery from "@/components/Gallery";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/order";

export default function ProductoPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchProduct = useCallback(async () => {
    if (!params.id) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/products/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const extractMaterials = (components: Record<string, unknown> | null): string[] => {
    if (!components) return [];
    const materials: string[] = [];
    
    if (components.materials && Array.isArray(components.materials)) {
      materials.push(...(components.materials as string[]));
    }
    if (components.material && typeof components.material === "string") {
      materials.push(components.material);
    }
    if (components.threads && Array.isArray(components.threads)) {
      (components.threads as { name: string }[]).forEach((t) => {
        if (t.name) materials.push(t.name);
      });
    }
    if (components.base && typeof components.base === "object") {
      const base = components.base as { material?: string; name?: string };
      if (base.material) materials.push(base.material);
      if (base.name) materials.push(base.name);
    }
    
    return Array.from(new Set(materials));
  };

  const extractFeatures = (components: Record<string, unknown> | null): string[] => {
    if (!components) return [];
    const features: string[] = [];
    
    if (components.size && typeof components.size === "string") {
      features.push(`Tamaño: ${components.size}`);
    }
    if (components.charm && typeof components.charm === "object") {
      const charm = components.charm as { type?: string };
      if (charm.type) features.push(`Dije: ${charm.type}`);
    }
    if (components.colors && Array.isArray(components.colors)) {
      const colors = (components.colors as { name: string }[]).map((c) => c.name);
      if (colors.length > 0) features.push(`Colores: ${colors.join(", ")}`);
    }
    if (components.finish && typeof components.finish === "string") {
      features.push(`Acabado: ${components.finish}`);
    }
    if (components.embroidery && typeof components.embroidery === "string") {
      features.push(` bordado: ${components.embroidery}`);
    }
    
    return features;
  };

  const addToOrder = () => {
    if (!product) return;
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-[var(--brand-cream-dark)] rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-[var(--brand-cream-dark)] rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-[var(--brand-cream-dark)] rounded w-3/4" />
                <div className="h-6 bg-[var(--brand-cream-dark)] rounded w-24" />
                <div className="h-20 bg-[var(--brand-cream-dark)] rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-display text-[var(--color-text)] mb-4">
            Producto no encontrado
          </h1>
          <Link
            href="/catalogo"
            className="text-[var(--brand-green)] hover:underline"
          >
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  const materials = extractMaterials(product.components);
  const features = extractFeatures(product.components);

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
          <div>
            <Gallery images={product.images} productName={product.name} />
          </div>

          <div className="space-y-6">
            <div>
              {product.is_custom && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full mb-3">
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
              <div className="prose prose-sm max-w-none text-[var(--color-text-muted)]">
                <p>{product.description}</p>
              </div>
            )}

            {product.is_custom && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Este diseño nació de una creación personalizada.</strong>{" "}
                  Cada pieza es única y feita con dedicación especialmente para vos.
                </p>
              </div>
            )}

            {materials.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-[var(--color-text)] mb-2">
                  Materiales
                </h2>
                <div className="flex flex-wrap gap-2">
                  {materials.map((material, index) => (
                    <span
                      key={index}
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
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-[var(--color-text-muted)]"
                    >
                      <span className="w-1.5 h-1.5 bg-[var(--brand-green)] rounded-full" />
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
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed font-medium text-lg"
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
