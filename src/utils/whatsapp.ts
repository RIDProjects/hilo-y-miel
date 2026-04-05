import type { CartItem } from "@/types/order";

export interface CustomDesignData {
  base_type: string;
  material: string;
  color_palette: string[];
  charms: string[];
  size: string;
  additional_notes?: string;
}

export interface OrderFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: string;
  items: CartItem[];
  customDesign?: CustomDesignData;
  isCustomDesign: boolean;
}

export function buildWhatsAppMessage(
  orderId: string,
  data: OrderFormData
): string {
  const shortId = orderId.slice(-6).toUpperCase();
  
  let message = `🧵 *Nuevo pedido — Hilo & Miel*\n\n`;
  message += `👤 Cliente: ${data.customer_name}\n`;
  message += `📧 Email: ${data.customer_email}\n`;
  message += `📱 Teléfono: ${data.customer_phone}\n\n`;

  if (data.isCustomDesign && data.customDesign) {
    const cd = data.customDesign;
    message += `✨ *DISEÑO PERSONALIZADO NUEVO:*\n`;
    message += `- Base: ${cd.base_type}\n`;
    message += `- Material: ${cd.material}\n`;
    message += `- Colores: ${cd.color_palette.join(", ")}\n`;
    message += `- Dijes: ${cd.charms.join(", ")}\n`;
    message += `- Talla: ${cd.size}\n`;
    if (cd.additional_notes) {
      message += `- Notas: ${cd.additional_notes}\n`;
    }
  } else {
    message += `📦 *Pedido estándar:*\n`;
    data.items.forEach((item) => {
      const itemTotal = item.product.price * item.quantity;
      message += `- ${item.product.name} x${item.quantity} — $${itemTotal}\n`;
    });
  }

  message += `\n💬 Notas: ${data.notes || "ninguna"}\n`;
  message += `\n✅ Pedido ID: #${shortId}`;

  return message;
}

export function buildWhatsAppURL(message: string, phoneNumber?: string): string {
  const defaultPhone = "5491167654321";
  const phone = phoneNumber || defaultPhone;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
}
