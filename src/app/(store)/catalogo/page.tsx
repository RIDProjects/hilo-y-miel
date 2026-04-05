"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import FilterSidebar, { FilterToggle, type FilterState } from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import MiniCartDrawer from "@/components/MiniCartDrawer";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/order";

const defaultFilters: FilterState = {
  category: "",
  availableOnly: true,
  customOnly: false,
  search: "",
  sort: "newest",
};

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.availableOnly) params.set("available", "true");
      if (filters.customOnly) params.set("custom", "true");
      if (filters.search) params.set("search", filters.search);
      if (filters.sort) params.set("sort", filters.sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToOrder = (product: Product) => {
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
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/confirmar-pedido");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-[var(--color-text)] mb-2">
          Catálogo
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8">
          Explora nuestra colección completa
        </p>

        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <FilterToggle onClick={() => setIsFilterOpen(true)} />
              <p className="text-sm text-[var(--color-text-muted)]">
                {products.length} productos
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-[var(--brand-cream-dark)] rounded-xl aspect-square"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToOrder={addToOrder}
                    onViewDetail={(p) => router.push(`/producto/${p.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-[var(--color-text-muted)]">
                  No se encontraron productos
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                  Probá cambiando los filtros
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <MiniCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
