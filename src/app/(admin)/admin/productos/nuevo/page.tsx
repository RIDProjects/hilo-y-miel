"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, X } from "lucide-react";

const CATEGORIES = ["collar", "pulsera", "arete", "aros", "tobillera", "amuleto"];

interface ProductForm {
  name: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  is_available: boolean;
  is_custom: boolean;
  featured: boolean;
  tags: string[];
}

const inputClass = "w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50";
const labelClass = "block text-sm font-medium text-[var(--color-text)] mb-1";
const cardClass = "bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [formData, setFormData] = useState<ProductForm>({
    name: "", description: "", category: "", price: 0,
    images: [], is_available: true, is_custom: false, featured: false, tags: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) router.push("/admin/productos");
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  const addImage = () => {
    const url = imageInput.trim();
    if (url && !formData.images.includes(url)) {
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
      setImageInput("");
    }
  };

  const removeImage = (url: string) => setFormData(prev => ({ ...prev, images: prev.images.filter(i => i !== url) }));

  return (
    <main className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push("/admin/productos")} className="p-2 hover:bg-[var(--color-border)] rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
        </button>
        <h1 className="text-3xl font-display text-[var(--brand-green)]">Nuevo Producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={cardClass}>
          <h2 className="text-lg font-display text-[var(--brand-green)] mb-4">Información básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Categoría *</label>
              <select value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} className={inputClass} required>
                <option value="">Seleccionar...</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Precio (ARS) *</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))} className={inputClass} required min={0} />
            </div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_available} onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm text-[var(--color-text)]">Disponible</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm text-[var(--color-text)]">Destacado</span>
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Descripción</label>
            <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={4} className={inputClass} />
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-display text-[var(--brand-green)] mb-4">Imágenes</h2>
          <div className="flex gap-2 mb-4">
            <input type="url" value={imageInput} onChange={(e) => setImageInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }} placeholder="https://..." className={inputClass} />
            <button type="button" onClick={addImage} className="px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-mid)] transition-colors whitespace-nowrap">Agregar</button>
          </div>
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Imagen ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border border-[var(--color-border)]" />
                  <button type="button" onClick={() => removeImage(img)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-display text-[var(--brand-green)] mb-4">Etiquetas</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Agregar etiqueta..." className={inputClass} />
            <button type="button" onClick={addTag} className="px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-mid)] transition-colors whitespace-nowrap">Agregar</button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-[var(--brand-cream)] text-[var(--color-text)] rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-mid)] transition-colors disabled:opacity-50">
            <Save className="w-5 h-5" />
            {saving ? "Guardando..." : "Crear producto"}
          </button>
          <button type="button" onClick={() => router.push("/admin/productos")} className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}
