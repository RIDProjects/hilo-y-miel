"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Eye, Clock, CheckCircle, XCircle, Truck, Package } from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: string;
  status: string;
  created_at: Date;
  items: unknown[];
}

const STATUSES = [
  { value: "pending", label: "Pendiente", icon: Clock },
  { value: "confirmed", label: "Confirmado", icon: CheckCircle },
  { value: "processing", label: "Procesando", icon: Package },
  { value: "shipped", label: "Enviado", icon: Truck },
  { value: "delivered", label: "Entregado", icon: CheckCircle },
  { value: "cancelled", label: "Cancelado", icon: XCircle },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const inputClass = "px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50";

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, dateFrom, dateTo]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchOrders(); }, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const getStatusBadge = (status: string) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status] || "bg-[var(--color-border)] text-[var(--color-text)]"}`}>
      {STATUSES.find(s => s.value === status)?.label || status}
    </span>
  );

  return (
    <main className="p-8">
      <h1 className="text-3xl font-display text-[var(--brand-green)] mb-8">Gestión de Pedidos</h1>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
            <option value="">Todos los estados</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={inputClass}>
            <option value="">Todos los tipos</option>
            <option value="standard">Estándar</option>
            <option value="custom">Custom</option>
          </select>
          <div className="flex items-center gap-2">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} />
            <span className="text-[var(--color-text-muted)]">-</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--brand-cream)]">
              <tr>
                {["ID", "Cliente", "Tipo", "Fecha", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--color-text-muted)]">Cargando...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--color-text-muted)]">No hay pedidos</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--brand-cream)] transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-[var(--color-text)]">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-[var(--color-text)]">{order.customer_name}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{order.customer_email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {order.order_type === "custom" ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Custom</span>
                      ) : (
                        <span className="px-2 py-1 bg-[var(--color-border)] text-[var(--color-text-muted)] rounded-full text-xs font-medium">Estándar</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                      {new Date(order.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50 ${STATUS_COLORS[order.status]}`}
                      >
                        {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Link href={`/admin/pedidos/${order.id}`} className="inline-flex items-center gap-1 text-sm text-[var(--brand-green)] hover:text-[var(--brand-green-mid)] transition-colors">
                        <Eye className="w-4 h-4" />Ver
                      </Link>
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
