"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Palette
} from "lucide-react";

interface CustomDesign {
  id: string;
  base_type: string;
  material: string;
  color_palette: string[];
  charms: string[];
  size: string | null;
  additional_notes: string | null;
  status: string;
  created_at: Date;
  order: {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    status: string;
  } | null;
}

export default function DisenosCustomPage() {
  const [designs, setDesigns] = useState<CustomDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");

  const fetchDesigns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/designs?${params}`);
      const data = await res.json();
      setDesigns(data);
    } catch (error) {
      console.error("Error fetching designs:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDesigns();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDesigns]);

  const updateDesignStatus = async (designId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/designs/${designId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setDesigns(prev => prev.map(d => d.id === designId ? { ...d, status: newStatus } : d));
      }
    } catch (error) {
      console.error("Error updating design:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels: Record<string, string> = {
      pending: "Pendiente",
      approved: "Aprobado",
      rejected: "Rechazado",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getBaseTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      argolla: "Argolla",
      cadena: "Cadena",
      aro: "Aro",
      tejido: "Tejido",
      hilo_encerado: "Hilo Encerado",
    };
    return labels[type] || type;
  };

  const getMaterialLabel = (material: string) => {
    const labels: Record<string, string> = {
      plata_925: "Plata 925",
      banado_oro: "Bañado en Oro",
      cobre: "Cobre",
      acero_inoxidable: "Acero Inoxidable",
      chapa_oro: "Chapa de Oro",
    };
    return labels[material] || material;
  };

  const filteredDesigns = designs.filter(d => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      d.order?.customer_name.toLowerCase().includes(searchLower) ||
      d.order?.customer_email.toLowerCase().includes(searchLower) ||
      d.base_type.toLowerCase().includes(searchLower) ||
      d.material.toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="p-8">
      <h1 className="text-3xl font-display text-brand-green mb-8">Diseños Custom</h1>

      <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar diseños..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>
          <button
            onClick={() => fetchDesigns()}
            className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-mid transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-8 text-center text-gray-500">
            Cargando...
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-8 text-center text-gray-500">
            <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            No hay diseños custom {statusFilter && statusFilter !== "pending" ? statusFilter : ""}
          </div>
        ) : (
          filteredDesigns.map((design) => (
            <div
              key={design.id}
              className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-mono text-gray-500">
                      #{design.id.slice(-6).toUpperCase()}
                    </span>
                    {getStatusBadge(design.status)}
                  </div>
                  
                  {design.order && (
                    <div className="mb-4">
                      <p className="font-medium text-gray-900">{design.order.customer_name}</p>
                      <p className="text-sm text-gray-500">{design.order.customer_email}</p>
                      <p className="text-sm text-gray-500">{design.order.customer_phone}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Base</p>
                      <p className="font-medium text-gray-900">{getBaseTypeLabel(design.base_type)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Material</p>
                      <p className="font-medium text-gray-900">{getMaterialLabel(design.material)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Colores</p>
                      <p className="font-medium text-gray-900">{design.color_palette.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tamaño</p>
                      <p className="font-medium text-gray-900">{design.size || "No especificado"}</p>
                    </div>
                  </div>

                  {design.charms.length > 0 && (
                    <div className="mt-4">
                      <p className="text-gray-500 text-sm">Dijes</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {design.charms.map((charm, idx) => (
                          <span key={idx} className="px-2 py-1 bg-brand-cream text-brand-green-dark rounded text-xs">
                            {charm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {design.additional_notes && (
                    <div className="mt-4">
                      <p className="text-gray-500 text-sm">Notas adicionales</p>
                      <p className="text-gray-900">{design.additional_notes}</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-4">
                    Creado: {new Date(design.created_at).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {design.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateDesignStatus(design.id, "approved")}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => updateDesignStatus(design.id, "rejected")}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </button>
                    </>
                  )}
                  {design.order && (
                    <Link
                      href={`/admin/pedidos/${design.order.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-green text-brand-green rounded-lg hover:bg-brand-green hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Pedido
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
