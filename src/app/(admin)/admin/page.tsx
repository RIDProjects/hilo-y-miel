import { getDashboardMetrics, getRecentOrders, getOrdersLast30Days } from "@/lib/dashboard";
import Link from "next/link";
import {
  ShoppingCart,
  Calendar,
  Clock,
  AlertCircle,
  Palette,
  Package,
  Eye,
  ArrowRight
} from "lucide-react";
import OrdersChartClient from "./OrdersChartClient";

async function MetricCard({
  title,
  value,
  icon: Icon,
  actionHref,
  actionLabel
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-muted)] font-body">{title}</p>
          <p className="text-3xl font-display text-[var(--brand-green)] mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-[var(--brand-green)]/10 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-[var(--brand-green)]" />
        </div>
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center text-sm text-[var(--brand-green)] hover:text-[var(--brand-green-mid)] transition-colors"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      )}
    </div>
  );
}

async function RecentOrdersTable({ orders }: { orders: Awaited<ReturnType<typeof getRecentOrders>> }) {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      processing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    const labels: Record<string, string> = {
      pending: "Pendiente", confirmed: "Confirmado", processing: "Procesando",
      shipped: "Enviado", delivered: "Entregado", cancelled: "Cancelado",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-[var(--color-border)] text-[var(--color-text)]"}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="p-6 border-b border-[var(--color-border)]">
        <h2 className="text-xl font-display text-[var(--brand-green)]">Últimos Pedidos</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--brand-cream)]">
            <tr>
              {["ID", "Cliente", "Tipo", "Fecha", "Estado", "Acciones"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-[var(--color-text-muted)]">No hay pedidos aún</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--brand-cream)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[var(--color-text)]">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                    {order.order_type === "custom" ? "Custom" : "Estándar"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                    {new Date(order.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/pedidos/${order.id}`} className="inline-flex items-center text-sm text-[var(--brand-green)] hover:text-[var(--brand-green-mid)] transition-colors">
                      <Eye className="w-4 h-4 mr-1" />Ver
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const [metrics, recentOrders, chartData] = await Promise.all([
    getDashboardMetrics(),
    getRecentOrders(5),
    getOrdersLast30Days(),
  ]);

  return (
    <main className="p-8">
      <h1 className="text-4xl font-display text-[var(--brand-green)] mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Pedidos hoy" value={metrics.ordersToday} icon={ShoppingCart} />
        <MetricCard title="Pedidos esta semana" value={metrics.ordersWeek} icon={Calendar} />
        <MetricCard title="Pedidos este mes" value={metrics.ordersMonth} icon={Clock} />
        <MetricCard title="Pedidos pendientes" value={metrics.pendingOrders} icon={AlertCircle} actionHref="/admin/pedidos?status=pending" actionLabel="Ver pedidos pendientes" />
        <MetricCard title="Diseños custom sin revisar" value={metrics.pendingDesigns} icon={Palette} actionHref="/admin/disenos-custom" actionLabel="Ver diseños" />
        <MetricCard title="Productos sin stock" value={metrics.outOfStockProducts} icon={Package} actionHref="/admin/productos?stock=out" actionLabel="Ver productos" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrdersTable orders={recentOrders} />
        <OrdersChartClient data={chartData} />
      </div>
    </main>
  );
}
