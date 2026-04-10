"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Package,
  Eye,
  EyeOff
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  images: string[];
  is_available: boolean;
  is_custom: boolean;
  featured: boolean;
  tags: string[];
  created_at: Date;
}

const CATEGORIES = ["collar", "pulsera", "arete", "aros", "tobillera", "amuleto"];

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availableFilter, setAvailableFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryFilter) params.set("category", categoryFilter);

      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const duplicateProduct = async (product: Product) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${product.name} (copia)`,
          description: product.description,
          category: product.category,
          price: product.price,
          images: product.images,
          tags: product.tags,
          is_available: product.is_available,
          is_custom: product.is_custom,
          featured: false,
        }),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error duplicating product:", error);
    }
  };

  const filteredProducts = products.filter(p => {
    if (availableFilter === "available" && !p.is_available) return false;
    if (availableFilter === "unavailable" && p.is_available) return false;
    if (featuredFilter === "featured" && !p.featured) return false;
    if (featuredFilter === "not-featured" && p.featured) return false;
    return true;
  });

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-[var(--brand-green)]">Gestión de Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-mid transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-brand-green/50"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-brand-green/50"
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <select
            value={availableFilter}
            onChange={(e) => setAvailableFilter(e.target.value)}
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-brand-green/50"
          >
            <option value="">Disponibilidad</option>
            <option value="available">Disponible</option>
            <option value="unavailable">Sin stock</option>
          </select>
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-brand-green/50"
          >
            <option value="">Destacados</option>
            <option value="featured">Destacados</option>
            <option value="not-featured">No destacados</option>
          </select>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--brand-cream)]/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Imagen</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Categoría</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Precio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Destacado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[var(--color-text-muted)]">Cargando...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[var(--color-text-muted)]">No hay productos</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[var(--brand-cream)]/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--brand-cream)] overflow-hidden">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-full h-full p-2 text-[var(--color-text-muted)]" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-[var(--color-text)]">{product.name}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{product.category}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[var(--color-text-muted)] capitalize">{product.category}</td>
                    <td className="px-4 py-4 text-sm font-medium text-[var(--color-text)]">${product.price.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => updateProduct(product.id, { is_available: !product.is_available })}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          product.is_available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.is_available ? (
                          <><Eye className="w-3 h-3" /> Disponible</>
                        ) : (
                          <><EyeOff className="w-3 h-3" /> Sin stock</>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => updateProduct(product.id, { featured: !product.featured })}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.featured
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-[var(--color-border)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        {product.featured ? "★ Destacado" : "○ Normal"}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/productos/${product.id}`}
                          className="p-2 text-[var(--color-text-muted)] hover:text-[var(--brand-green)] transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => duplicateProduct(product)}
                          className="p-2 text-[var(--color-text-muted)] hover:text-blue-600 transition-colors"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-[var(--color-text-muted)] hover:text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
