"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Package, Palette, CheckCircle, XCircle, Clock, Truck } from "lucide-react";

interface OrderItem {
  id: string;
  product: { id: string; name: string; images: string[]; price: number };
  quantity: number;
  price: number;
}

interface CustomDesign {
  id: string;
  base_type: string;
  material: string;
  color_palette: string[];
  charms: string[];
  size: string | null;
  additional_notes: string | null;
  status: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: string;
  status: string;
  notes: string | null;
  design_summary: string | null;
  created_at: Date;
  items: OrderItem[];
  customDesign: CustomDesign | null;
}

const STATUSES = [
  { value: "pending", label: "Pendiente", icon: Clock },
  { value: "confirmed", label: "Confirmado", icon: CheckCircle },
  { value: "processing", label: "Procesando", icon: Package },
  { value: "shipped", label: "Enviado", icon: Truck },
  { value: "delivered", label: "Entregado", icon: CheckCircle },
  { value: "cancelled", label: "Cancelado", icon: XCircle },
];

const BASE_LABELS: Record<string, string> = { argolla: "Argolla", cadena: "Cadena", aro: "Aro", tejido: "Tejido", hilo_encerado: "Hilo Encerado" };
const MATERIAL_LABELS: Record<string, string> = { plata_925: "Plata 925", banado_oro: "Bañado en Oro", cobre: "Cobre", acero_inoxidable: "Acero Inoxidable", chapa_oro: "Chapa de Oro" };

const cardClass = "bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6";
const labelClass = "text-sm text-[var(--color-text-muted)]";
const valueClass = "font-medium text-[var(--color-text)]";
const selectClass = "w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50";

export default function DetallePedidoPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => { fetchOrder(); }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (res.ok) setOrder(await res.json());
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) setOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const backBtn = (
    <button onClick={() => router.push("/admin/pedidos")} className="p-2 hover:bg-[var(--color-border)] rounded-lg transition-colors">
      <ArrowLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
    </button>
  );

  if (loading) return (
    <main className="p-8">
      <div className="flex items-center gap-4 mb-8">{backBtn}<h1 className="text-3xl font-display text-[var(--brand-green)]">Detalle del Pedido</h1></div>
      <div className={`${cardClass} text-center text-[var(--color-text-muted)]`}>Cargando...</div>
    </main>
  );

  if (!order) return (
    <main className="p-8">
      <div className="flex items-center gap-4 mb-8">{backBtn}<h1 className="text-3xl font-display text-[var(--brand-green)]">Detalle del Pedido</h1></div>
      <div className={`${cardClass} text-center text-[var(--color-text-muted)]`}>Pedido no encontrado</div>
    </main>
  );

  return (
    <main className="p-8">
      <div className="flex items-center gap-4 mb-8">
        {backBtn}
        <h1 className="text-3xl font-display text-[var(--brand-green)]">Pedido #{order.id.slice(-6).toUpperCase()}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={cardClass}>
            <h2 className="text-lg font-display text-[var(--brand-green)] mb-4">Datos del cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className={labelClass}>Nombre</p><p className={valueClass}>{order.customer_name}</p></div>
              <div><p className={labelClass}>Email</p><p className={valueClass}>{order.customer_email}</p></div>
              <div><p className={labelClass}>Teléfono</p><p className={valueClass}>{order.customer_phone}</p></div>
              <div>
                <p className={labelClass}>Fecha</p>
                <p className={valueClass}>{new Date(order.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
            {order.notes && (
              <div className="mt-4"><p className={labelClass}>Notas</p><p className={valueClass}>{order.notes}</p></div>
            )}
          </div>

          {order.order_type === "custom" && order.customDesign ? (
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-[var(--brand-green)]" />
                <h2 className="text-lg font-display text-[var(--brand-green)]">Diseño Custom</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className={labelClass}>Base</p><p className={valueClass}>{BASE_LABELS[order.customDesign.base_type] || order.customDesign.base_type}</p></div>
                <div><p className={labelClass}>Material</p><p className={valueClass}>{MATERIAL_LABELS[order.customDesign.material] || order.customDesign.material}</p></div>
                <div><p className={labelClass}>Colores</p><p className={valueClass}>{order.customDesign.color_palette.join(", ")}</p></div>
                <div><p className={labelClass}>Tamaño</p><p className={valueClass}>{order.customDesign.size || "No especificado"}</p></div>
              </div>
              {order.customDesign.charms.length > 0 && (
                <div className="mt-4">
                  <p className={labelClass}>Dijes</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {order.customDesign.charms.map((charm, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[var(--brand-cream)] text-[var(--color-text)] rounded text-xs">{charm}</span>
                    ))}
                  </div>
                </div>
              )}
              {order.customDesign.additional_notes && (
                <div className="mt-4"><p className={labelClass}>Notas adicionales</p><p className={valueClass}>{order.customDesign.additional_notes}</p></div>
              )}
            </div>
          ) : order.items && order.items.length > 0 ? (
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[var(--brand-green)]" />
                <h2 className="text-lg font-display text-[var(--brand-green)]">Productos</h2>
              </div>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[var(--brand-cream)] overflow-hidden flex-shrink-0">
                      {item.product.images?.[0]
                        ? <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        : <Package className="w-full h-full p-3 text-[var(--color-text-muted)]" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className={valueClass}>{item.product.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">Cantidad: {item.quantity} × ${item.price}</p>
                    </div>
                    <p className={valueClass}>${(item.quantity * item.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className={cardClass}>
            <h2 className="text-lg font-display text-[var(--brand-green)] mb-4">Estado del pedido</h2>
            <select value={order.status} onChange={(e) => updateStatus(e.target.value)} className={selectClass}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {order.order_type === "custom" && (
            <div className={cardClass}>
              <h2 className="text-lg font-display text-[var(--brand-green)] mb-4">Resumen</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={labelClass}>Tipo:</span>
                  <span className={valueClass}>Diseño personalizado</span>
                </div>
                <div className="flex justify-between">
                  <span className={labelClass}>Estado:</span>
                  <span className={`${valueClass} capitalize`}>{order.customDesign?.status}</span>
                </div>
              </div>
            </div>
          )}

          {order.order_type !== "custom" && order.items && order.items.length > 0 && (
            <div className={cardClass}>
              <h2 className="text-lg font-display text-[var(--brand-green)] mb-4">Total</h2>
              <p className="text-3xl font-display text-[var(--brand-green)]">
                ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
