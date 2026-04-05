"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, Upload, X } from "lucide-react";

const CATEGORIES = ["collar", "pulsera", "arete", "aros", "tobillera", "amuleto"];

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
}

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "",
    price: 0,
    images: [],
    is_available: true,
    is_custom: false,
    featured: false,
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (productId && productId !== "nuevo") {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const endpoint = productId === "nuevo" 
        ? "/api/admin/products" 
        : `/api/admin/products/${productId}`;
      const method = productId === "nuevo" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/productos");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  const addImage = (url: string) => {
    if (url && !formData.images?.includes(url)) {
      setFormData({ ...formData, images: [...(formData.images || []), url] });
    }
  };

  const removeImage = (url: string) => {
    setFormData({ ...formData, images: formData.images?.filter(i => i !== url) });
  };

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-display text-brand-green mb-8">
          {productId === "nuevo" ? "Nuevo Producto" : "Editar Producto"}
        </h1>
        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-8 text-center text-gray-500">
          Cargando...
        </div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/admin/productos")}
          className="p-2 hover:bg-brand-cream rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-3xl font-display text-brand-green">
          {productId === "nuevo" ? "Nuevo Producto" : "Editar Producto"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
          <h2 className="text-lg font-display text-brand-green mb-4">Información básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                required
              >
                <option value="">Seleccionar...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                required
              />
            </div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                />
                <span className="text-sm text-gray-700">Disponible</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                />
                <span className="text-sm text-gray-700">Destacado</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
          <h2 className="text-lg font-display text-brand-green mb-4">Imágenes</h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              placeholder="URL de imagen..."
              className="flex-1 px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  addImage(input.value);
                  input.value = "";
                }
              }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images?.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={img} alt={`Imagen ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
          <h2 className="text-lg font-display text-brand-green mb-4">Etiquetas</h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Agregar etiqueta..."
              className="flex-1 px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-mid transition-colors"
            >
              Agregar
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-brand-cream text-brand-green-dark rounded-full text-sm flex items-center gap-2">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-lg hover:bg-brand-green-mid transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Guardando..." : "Guardar producto"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/productos")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}
