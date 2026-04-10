"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Eye, CheckCircle, XCircle, Palette } from "lucide-react";

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
  order: { id: string; customer_name: string; customer_email: string; customer_phone: string; status: string } | null;
}

const BASE_LABELS: Record<string, string> = { argolla: "Argolla", cadena: "Cadena", aro: "Aro", tejido: "Tejido", hilo_encerado: "Hilo Encerado" };
const MATERIAL_LABELS: Record<string, string> = { plata_925: "Plata 925", banado_oro: "Bañado en Oro", cobre: "Cobre", acero_inoxidable: "Acero Inoxidable", chapa_oro: "Chapa de Oro" };

const inputClass = "px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50";

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
      setDesigns(await res.json());
    } catch (error) {
      console.error("Error fetching designs:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchDesigns(); }, 300);
    return () => clearTimeout(timer);
  }, [fetchDesigns]);

  const updateDesignStatus = async (designId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/designs/${designId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) setDesigns(prev => prev.map(d => d.id === designId ? { ...d, status: newStatus } : d));
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
    const labels: Record<string, string> = { pending: "Pendiente", approved: "Aprobado", rejected: "Rechazado" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-[var(--color-border)] text-[var(--color-text)]"}`}>
        {labels[status] || status}
      </span>
    );
  };

  const filteredDesigns = designs.filter(d => {
    if (!search) return true;
    const s = search.toLowerCase();
    return d.order?.customer_name.toLowerCase().includes(s) || d.order?.customer_email.toLowerCase().includes(s) || d.base_type.toLowerCase().includes(s) || d.material.toLowerCase().includes(s);
  });

  return (
    <main className="p-8">
      <h1 className="text-3xl font-display text-[var(--brand-green)] mb-8">Diseños Custom</h1>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Buscar diseños..." value={search} onChange={(e) => setSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50`} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>
          <button onClick={() => fetchDesigns()} className="px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-mid)] transition-colors">
            Actualizar
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-8 text-center text-[var(--color-text-muted)]">Cargando...</div>
        ) : filteredDesigns.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-8 text-center text-[var(--color-text-muted)]">
            <Palette className="w-12 h-12 mx-auto mb-4 text-[var(--color-border)]" />
            No hay diseños custom
          </div>
        ) : (
          filteredDesigns.map((design) => (
            <div key={design.id} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-mono text-[var(--color-text-muted)]">#{design.id.slice(-6).toUpperCase()}</span>
                    {getStatusBadge(design.status)}
                  </div>
                  {design.order && (
                    <div className="mb-4">
                      <p className="font-medium text-[var(--color-text)]">{design.order.customer_name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{design.order.customer_email}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{design.order.customer_phone}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><p className="text-[var(--color-text-muted)]">Base</p><p className="font-medium text-[var(--color-text)]">{BASE_LABELS[design.base_type] || design.base_type}</p></div>
                    <div><p className="text-[var(--color-text-muted)]">Material</p><p className="font-medium text-[var(--color-text)]">{MATERIAL_LABELS[design.material] || design.material}</p></div>
                    <div><p className="text-[var(--color-text-muted)]">Colores</p><p className="font-medium text-[var(--color-text)]">{design.color_palette.join(", ")}</p></div>
                    <div><p className="text-[var(--color-text-muted)]">Tamaño</p><p className="font-medium text-[var(--color-text)]">{design.size || "No especificado"}</p></div>
                  </div>
                  {design.charms.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[var(--color-text-muted)] text-sm">Dijes</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {design.charms.map((charm, idx) => (
                          <span key={idx} className="px-2 py-1 bg-[var(--brand-cream)] text-[var(--color-text)] rounded text-xs">{charm}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {design.additional_notes && (
                    <div className="mt-4"><p className="text-[var(--color-text-muted)] text-sm">Notas adicionales</p><p className="text-[var(--color-text)]">{design.additional_notes}</p></div>
                  )}
                  <p className="text-xs text-[var(--color-text-muted)] mt-4">
                    Creado: {new Date(design.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {design.status === "pending" && (
                    <>
                      <button onClick={() => updateDesignStatus(design.id, "approved")} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <CheckCircle className="w-4 h-4" />Aprobar
                      </button>
                      <button onClick={() => updateDesignStatus(design.id, "rejected")} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <XCircle className="w-4 h-4" />Rechazar
                      </button>
                    </>
                  )}
                  {design.order && (
                    <Link href={`/admin/pedidos/${design.order.id}`} className="flex items-center justify-center gap-2 px-4 py-2 border border-[var(--brand-green)] text-[var(--brand-green)] rounded-lg hover:bg-[var(--brand-green)] hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />Ver Pedido
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
