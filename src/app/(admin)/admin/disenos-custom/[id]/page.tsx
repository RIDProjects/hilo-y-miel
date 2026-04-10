"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Palette } from "lucide-react";

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
    notes: string | null;
    status: string;
  } | null;
}

const BASE_LABELS: Record<string, string> = { argolla: "Argolla", cadena: "Cadena", aro: "Aro", tejido: "Tejido", hilo_encerado: "Hilo Encerado" };
const MATERIAL_LABELS: Record<string, string> = { plata_925: "Plata 925", banado_oro: "Bañado en Oro", cobre: "Cobre", acero_inoxidable: "Acero Inoxidable", chapa_oro: "Chapa de Oro" };
const COLOR_HEX: Record<string, string> = { dorado: "#D4AF37", plateado: "#C0C0C0", rose_gold: "#B76E79", cobrizo: "#B87333", negro: "#1A1A1A", blanco: "#F5F5F5", rojo: "#C41E3A", azul: "#1E90FF", verde: "#2E8B57", morado: "#9932CC", rosa: "#FF69B4", naranja: "#FF8C00", amarillo: "#FFD700", turquesa: "#40E0D0", lavanda: "#E6E6FA", gris: "#708090" };

const cardClass = "bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6";
const labelClass = "text-sm text-[var(--color-text-muted)]";
const valueClass = "font-medium text-[var(--color-text)]";

export default function DetalleDisenoCCustomPage() {
  const router = useRouter();
  const params = useParams();
  const designId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<CustomDesign | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchDesign(); }, [designId]);

  const fetchDesign = async () => {
    try {
      const res = await fetch(`/api/admin/designs`);
      const data: CustomDesign[] = await res.json();
      setDesign(data.find(d => d.id === designId) || null);
    } catch (error) {
      console.error("Error fetching design:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: "approved" | "rejected") => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/designs/${designId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) setDesign(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error("Error updating design:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = { pending: "bg-yellow-100 text-yellow-800", approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
    const labels: Record<string, string> = { pending: "Pendiente", approved: "Aprobado", rejected: "Rechazado" };
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || "bg-[var(--color-border)] text-[var(--color-text)]"}`}>{labels[status] || status}</span>;
  };

  const backBtn = (
    <button onClick={() => router.push("/admin/disenos-custom")} className="p-2 hover:bg-[var(--color-border)] rounded-lg transition-colors">
      <ArrowLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
    </button>
  );

  if (loading) return (
    <main className="p-8">
      <div className="flex items-center gap-4 mb-8">{backBtn}<h1 className="text-3xl font-display text-[var(--brand-green)]">Detalle del Diseño</h1></div>
      <div className={`${cardClass} text-center text-[var(--color-text-muted)]`}>Cargando...</div>
    </main>
  );

  if (!design) return (
    <main className="p-8">
      <div className="flex items-center gap-4 mb-8">{backBtn}<h1 className="text-3xl font-display text-[var(--brand-green)]">Detalle del Diseño</h1></div>
      <div className={`${cardClass} text-center text-[var(--color-text-muted)]`}>Diseño no encontrado</div>
    </main>
  );

  return (
    <main className="p-8">
      <div className="flex items-center gap-4 mb-8">
        {backBtn}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display text-[var(--brand-green)]">Diseño #{design.id.slice(-6).toUpperCase()}</h1>
          {getStatusBadge(design.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Especificaciones del diseño */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-5">
              <Palette className="w-5 h-5 text-[var(--brand-green)]" />
              <h2 className="text-lg font-display text-[var(--brand-green)]">Especificaciones</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div><p className={labelClass}>Base</p><p className={valueClass}>{BASE_LABELS[design.base_type] || design.base_type}</p></div>
              <div><p className={labelClass}>Material</p><p className={valueClass}>{MATERIAL_LABELS[design.material] || design.material}</p></div>
              <div><p className={labelClass}>Tamaño</p><p className={valueClass}>{design.size ? `${design.size}cm` : "No especificado"}</p></div>
              <div>
                <p className={labelClass}>Colores</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {design.color_palette.map((color) => (
                    <span key={color} className="inline-flex items-center gap-1 text-xs text-[var(--color-text)]">
                      <span className="w-4 h-4 rounded-full border border-[var(--color-border)]" style={{ backgroundColor: COLOR_HEX[color] || "#ccc" }} title={color} />
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {design.charms.length > 0 && (
              <div className="mt-5">
                <p className={labelClass}>Dijes</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {design.charms.map((charm, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[var(--brand-cream)] text-[var(--color-text)] rounded-full text-sm">{charm}</span>
                  ))}
                </div>
              </div>
            )}

            {design.additional_notes && (
              <div className="mt-5">
                <p className={labelClass}>Notas del cliente</p>
                <p className="mt-1 text-[var(--color-text)] bg-[var(--brand-cream)] rounded-lg p-3 text-sm">{design.additional_notes}</p>
              </div>
            )}
          </div>

          {/* Datos del cliente */}
          {design.order && (
            <div className={cardClass}>
              <h2 className="text-lg font-display text-[var(--brand-green)] mb-4">Cliente</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><p className={labelClass}>Nombre</p><p className={valueClass}>{design.order.customer_name}</p></div>
                <div><p className={labelClass}>Email</p><p className={valueClass}>{design.order.customer_email}</p></div>
                <div><p className={labelClass}>Teléfono</p><p className={valueClass}>{design.order.customer_phone}</p></div>
              </div>
              {design.order.notes && (
                <div className="mt-4"><p className={labelClass}>Notas del pedido</p><p className={valueClass}>{design.order.notes}</p></div>
              )}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="space-y-4">
          <div className={cardClass}>
            <h2 className="text-lg font-display text-[var(--brand-green)] mb-4">Acciones</h2>
            <div className="space-y-3">
              {design.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus("approved")}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" />Aprobar diseño
                  </button>
                  <button
                    onClick={() => updateStatus("rejected")}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" />Rechazar diseño
                  </button>
                </>
              )}
              {design.order && (
                <Link
                  href={`/admin/pedidos/${design.order.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[var(--brand-green)] text-[var(--brand-green)] rounded-lg hover:bg-[var(--brand-green)] hover:text-white transition-colors"
                >
                  Ver pedido asociado
                </Link>
              )}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-lg font-display text-[var(--brand-green)] mb-3">Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={labelClass}>Estado:</span>
                {getStatusBadge(design.status)}
              </div>
              <div className="flex justify-between">
                <span className={labelClass}>Creado:</span>
                <span className={valueClass}>{new Date(design.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
