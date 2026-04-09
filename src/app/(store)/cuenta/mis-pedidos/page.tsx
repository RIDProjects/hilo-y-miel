"use client";

import { useEffect, useState } from "react";
import { useCustomer } from "@/contexts/CustomerContext";
import { Package, Clock, CheckCircle, XCircle, MessageCircle } from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: string;
  items: unknown;
  status: string;
  design_summary: string | null;
  created_at: string;
  notes: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400" },
  confirmed: { label: "Confirmado", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" },
  in_progress: { label: "En producción", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400" },
  ready: { label: "Listo para entregar", color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400" },
  delivered: { label: "Entregado", color: "text-[var(--color-text-muted)] bg-[var(--color-border)]" },
  cancelled: { label: "Cancelado", color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] ?? { label: status, color: "text-[var(--color-text-muted)] bg-[var(--color-border)]" };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>
      {s.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MisPedidosPage() {
  const { customer, isLoading: customerLoading } = useCustomer();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491155555555";

  useEffect(() => {
    if (customerLoading) return;
    fetch("/api/customer/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [customerLoading]);

  if (customerLoading || isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-[var(--color-border)] rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-[var(--brand-green)] mb-1">
          Mis pedidos
        </h1>
        {customer?.name && (
          <p className="text-[var(--color-text-muted)] text-sm">
            Hola, {customer.name}
          </p>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
          <Package className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4 opacity-40" />
          <p className="text-[var(--color-text-muted)]">
            Todavía no tenés pedidos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">
                    {formatDate(order.created_at)}
                  </p>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {order.order_type === "custom"
                      ? "Diseño personalizado"
                      : "Pedido de catálogo"}
                  </p>
                  {order.design_summary && (
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      {order.design_summary}
                    </p>
                  )}
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)]">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hola! Quiero consultar el estado de mi pedido #${order.id.slice(-8).toUpperCase()}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[var(--brand-green)] hover:underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
