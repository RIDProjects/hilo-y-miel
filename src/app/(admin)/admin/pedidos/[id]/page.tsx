"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Palette, CheckCircle, XCircle, Clock, Truck, Send } from "lucide-react";

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
  };
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
  { value: "pending", label: "Pendiente", color: "yellow", icon: Clock },
  { value: "confirmed", label: "Confirmado", color: "blue", icon: CheckCircle },
  { value: "processing", label: "Procesando", color: "purple", icon: Package },
  { value: "shipped", label: "Enviado", color: "indigo", icon: Truck },
  { value: "delivered", label: "Entregado", color: "green", icon: CheckCircle },
  { value: "cancelled", label: "Cancelado", color: "red", icon: XCircle },
];

export default function DetallePedidoPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
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
      if (res.ok) {
        setOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const getBaseTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      argolla: "Argolla", cadena: "Cadena", aro: "Aro", tejido: "Tejido", hilo_encerado: "Hilo Encerado",
    };
    return labels[type] || type;
  };

  const getMaterialLabel = (material: string) => {
    const labels: Record<string, string> = {
      plata_925: "Plata 925", banado_oro: "Bañado en Oro", cobre: "Cobre",
      acero_inoxidable: "Acero Inoxidable", chapa_oro: "Chapa de Oro",
    };
    return labels[material] || material;
  };

  if (loading) {
    return (
      <main className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push("/admin/pedidos")} className="p-2 hover:bg-brand-cream rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-display text-brand-green">Detalle del Pedido</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-8 text-center text-gray-500">Cargando...</div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push("/admin/pedidos")} className="p-2 hover:bg-brand-cream rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-display text-brand-green">Detalle del Pedido</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-8 text-center text-gray-500">Pedido no encontrado</div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push("/admin/pedidos")} className="p-2 hover:bg-brand-cream rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-3xl font-display text-brand-green">
          Pedido #{order.id.slice(-6).toUpperCase()}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
            <h2 className="text-lg font-display text-brand-green mb-4">Datos del cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium text-gray-900">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-900">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.created_at).toLocaleDateString("es-AR", {
                    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            {order.notes && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Notas</p>
                <p className="font-medium text-gray-900">{order.notes}</p>
              </div>
            )}
          </div>

          {order.order_type === "custom" && order.customDesign ? (
            <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-brand-green" />
                <h2 className="text-lg font-display text-brand-green">Diseño Custom</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Base</p>
                  <p className="font-medium text-gray-900">{getBaseTypeLabel(order.customDesign.base_type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Material</p>
                  <p className="font-medium text-gray-900">{getMaterialLabel(order.customDesign.material)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Colores</p>
                  <p className="font-medium text-gray-900">{order.customDesign.color_palette.join(", ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tamaño</p>
                  <p className="font-medium text-gray-900">{order.customDesign.size || "No especificado"}</p>
                </div>
              </div>
              {order.customDesign.charms.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Dijes</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {order.customDesign.charms.map((charm, idx) => (
                      <span key={idx} className="px-2 py-1 bg-brand-cream text-brand-green-dark rounded text-xs">{charm}</span>
                    ))}
                  </div>
                </div>
              )}
              {order.customDesign.additional_notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Notas adicionales</p>
                  <p className="font-medium text-gray-900">{order.customDesign.additional_notes}</p>
                </div>
              )}
            </div>
          ) : order.items && order.items.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-brand-green" />
                <h2 className="text-lg font-display text-brand-green">Productos</h2>
              </div>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-brand-cream overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-full h-full p-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity} × ${item.price}</p>
                    </div>
                    <p className="font-medium text-gray-900">${(item.quantity * item.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
            <h2 className="text-lg font-display text-brand-green mb-4">Estado del pedido</h2>
            <select
              value={order.status}
              onChange={(e) => updateStatus(e.target.value)}
              className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
            >
              {STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {order.order_type === "custom" && (
            <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
              <h2 className="text-lg font-display text-brand-green mb-4">Resumen</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipo:</span>
                  <span className="font-medium">Diseño personalizado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado:</span>
                  <span className="font-medium capitalize">{order.customDesign?.status}</span>
                </div>
              </div>
            </div>
          )}

          {order.order_type !== "custom" && order.items && order.items.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
              <h2 className="text-lg font-display text-brand-green mb-4">Total</h2>
              <p className="text-3xl font-display text-brand-green">
                ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
