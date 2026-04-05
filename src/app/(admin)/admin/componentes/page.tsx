"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Package,
  GripVertical,
  Save,
  X
} from "lucide-react";

interface Component {
  id: string;
  type: string;
  name: string;
  image_url: string | null;
  is_active: boolean;
  price_modifier: number;
  sort_order: number;
}

const COMPONENT_TYPES = [
  { value: "base", label: "Base" },
  { value: "material", label: "Material" },
  { value: "charm", label: "Charm" },
  { value: "color", label: "Color" },
  { value: "size", label: "Tamaño" },
];

export default function ComponentesPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [formData, setFormData] = useState({
    type: "charm",
    name: "",
    image_url: "",
    is_active: true,
    price_modifier: 0,
    sort_order: 0,
  });

  const fetchComponents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/components");
      const data = await res.json();
      setComponents(data);
    } catch (error) {
      console.error("Error fetching components:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingComponent 
        ? `/api/admin/components/${editingComponent.id}`
        : "/api/admin/components";
      const method = editingComponent ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchComponents();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving component:", error);
    }
  };

  const updateComponent = async (id: string, updates: Partial<Component>) => {
    try {
      const res = await fetch(`/api/admin/components/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setComponents(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      }
    } catch (error) {
      console.error("Error updating component:", error);
    }
  };

  const deleteComponent = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este componente?")) return;
    try {
      const res = await fetch(`/api/admin/components/${id}`, { method: "DELETE" });
      if (res.ok) {
        setComponents(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Error deleting component:", error);
    }
  };

  const editComponent = (component: Component) => {
    setEditingComponent(component);
    setFormData({
      type: component.type,
      name: component.name,
      image_url: component.image_url || "",
      is_active: component.is_active,
      price_modifier: component.price_modifier,
      sort_order: component.sort_order,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingComponent(null);
    setFormData({
      type: "charm",
      name: "",
      image_url: "",
      is_active: true,
      price_modifier: 0,
      sort_order: 0,
    });
  };

  const filteredComponents = components.filter(c => {
    if (typeFilter && c.type !== typeFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const groupedComponents = filteredComponents.reduce((acc, comp) => {
    if (!acc[comp.type]) acc[comp.type] = [];
    acc[comp.type].push(comp);
    return acc;
  }, {} as Record<string, Component[]>);

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-brand-green">Gestión de Componentes</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-mid transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Componente
        </button>
      </div>

      {isEditing && (
        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6 mb-6">
          <h2 className="text-xl font-display text-brand-green mb-4">
            {editingComponent ? "Editar Componente" : "Nuevo Componente"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                  required
                >
                  {COMPONENT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio adicional</label>
                <input
                  type="number"
                  value={formData.price_modifier}
                  onChange={(e) => setFormData({ ...formData, price_modifier: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">Activo</label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-mid transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar componentes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
          >
            <option value="">Todos los tipos</option>
            {COMPONENT_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-8 text-center text-gray-500">
          Cargando...
        </div>
      ) : Object.keys(groupedComponents).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-8 text-center text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          No hay componentes
        </div>
      ) : (
        Object.entries(groupedComponents).map(([type, comps]) => (
          <div key={type} className="mb-6">
            <h2 className="text-lg font-display text-brand-green mb-3 capitalize">
              {COMPONENT_TYPES.find(t => t.value === type)?.label || type}
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark overflow-hidden">
              <table className="w-full">
                <thead className="bg-brand-cream/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-dark">
                  {comps.map((comp) => (
                    <tr key={comp.id} className="hover:bg-brand-cream/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-cream overflow-hidden">
                          {comp.image_url ? (
                            <img src={comp.image_url} alt={comp.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-full h-full p-2 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{comp.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {comp.price_modifier > 0 ? `+$${comp.price_modifier}` : "-"}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => updateComponent(comp.id, { is_active: !comp.is_active })}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            comp.is_active 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {comp.is_active ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => editComponent(comp)}
                            className="p-2 text-gray-500 hover:text-brand-green transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteComponent(comp.id)}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
