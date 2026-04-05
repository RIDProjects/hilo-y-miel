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
    <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-body">{title}</p>
          <p className="text-3xl font-display text-brand-green mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-green" />
        </div>
      </div>
      {actionHref && actionLabel && (
        <Link 
          href={actionHref} 
          className="mt-4 inline-flex items-center text-sm text-brand-green hover:text-brand-green-mid transition-colors"
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
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      processing: "Procesando",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark overflow-hidden">
      <div className="p-6 border-b border-brand-cream-dark">
        <h2 className="text-xl font-display text-brand-green">Últimos Pedidos</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-brand-cream/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-cream-dark">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No hay pedidos aún
                </td>
              </tr>
            ) : (
              orders.map((order: { id: string; customer_name: string; order_type: string; created_at: Date; status: string }) => (
                <tr key={order.id} className="hover:bg-brand-cream/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.order_type === "custom" ? "Custom" : "Estándar"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/admin/pedidos/${order.id}`}
                      className="inline-flex items-center text-sm text-brand-green hover:text-brand-green-mid transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
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
      <h1 className="text-4xl font-display text-brand-green mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard 
          title="Pedidos hoy" 
          value={metrics.ordersToday} 
          icon={ShoppingCart} 
        />
        <MetricCard 
          title="Pedidos esta semana" 
          value={metrics.ordersWeek} 
          icon={Calendar} 
        />
        <MetricCard 
          title="Pedidos este mes" 
          value={metrics.ordersMonth} 
          icon={Clock} 
        />
        <MetricCard 
          title="Pedidos pendientes" 
          value={metrics.pendingOrders} 
          icon={AlertCircle}
          actionHref="/admin/pedidos?status=pending"
          actionLabel="Ver pedidos pendientes"
        />
        <MetricCard 
          title="Diseños custom sin revisar" 
          value={metrics.pendingDesigns} 
          icon={Palette}
          actionHref="/admin/disenos-custom"
          actionLabel="Ver diseños"
        />
        <MetricCard 
          title="Productos sin stock" 
          value={metrics.outOfStockProducts} 
          icon={Package}
          actionHref="/admin/productos?stock=out"
          actionLabel="Ver productos"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrdersTable orders={recentOrders} />
        <OrdersChartClient data={chartData} />
      </div>
    </main>
  );
}
