"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Package, Sparkles, Send, Loader2 } from "lucide-react";
import { z } from "zod";
import { buildWhatsAppMessage, buildWhatsAppURL, formatPrice } from "@/utils/whatsapp";
import type { CartItem } from "@/types/order";
import type { Product } from "@/types/product";

const contactSchema = z.object({
  customer_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede exceder 80 caracteres"),
  customer_email: z
    .string()
    .email("Ingresa un correo electrónico válido"),
  customer_phone: z
    .string()
    .regex(/^\+?[0-9]{8,15}$/, "El teléfono debe tener entre 8 y 15 dígitos (podés incluir el +)"),
  notes: z
    .string()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface CustomDesignData {
  base_type: string;
  material: string;
  color_palette: string[];
  charms: string[];
  size: string;
  additional_notes?: string;
}

function ConfirmarPedidoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customDesign, setCustomDesign] = useState<CustomDesignData | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    notes: "",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedDesign = localStorage.getItem("pendingCustomDesign");
    if (savedDesign) {
      setCustomDesign(JSON.parse(savedDesign));
    } else {
      const savedDesignBuilder = localStorage.getItem("hilo-y-miel-design");
      if (savedDesignBuilder) {
        const designData = JSON.parse(savedDesignBuilder);
        if (designData.base && designData.material && designData.colors && designData.size) {
          setCustomDesign({
            base_type: designData.base,
            material: designData.material,
            color_palette: designData.colors,
            charms: designData.charms || [],
            size: designData.size || "",
            additional_notes: designData.notes || "",
          });
        }
      }
    }
  }, []);

  const isCustomOrder = customDesign !== null;
  const hasItems = cart.length > 0 || isCustomOrder;

  const validateField = (field: keyof ContactFormData, value: string) => {
    const fieldSchema = contactSchema.shape[field];
    const result = fieldSchema.safeParse(value);
    if (!result.success) {
      const error = result.error.errors[0]?.message;
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleBlur = (field: keyof ContactFormData) => {
    validateField(field, formData[field] || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items: cart,
        customDesign,
        isCustomDesign: isCustomOrder,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Error creating order");

      const data = await res.json();
      const newOrderId = data.orderId;
      setOrderId(newOrderId);

      const message = buildWhatsAppMessage(newOrderId, {
        ...orderData,
        customDesign: orderData.customDesign || undefined,
      });
      const waUrl = buildWhatsAppURL(message);
      window.open(waUrl, "_blank");

      localStorage.removeItem("cart");
      localStorage.removeItem("pendingCustomDesign");

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[var(--brand-green)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display text-[var(--color-text)] mb-4">
            ¡Tu pedido fue enviado!
          </h1>
          <p className="text-[var(--color-text-muted)] mb-2">
            Recibirás respuesta en las próximas horas
          </p>
          {orderId && (
            <p className="text-sm text-[var(--color-text-muted)] mb-8">
              ID de pedido: #{orderId.slice(-6).toUpperCase()}
            </p>
          )}
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-[var(--brand-green)] text-white rounded-md hover:bg-[var(--brand-green-mid)] transition-colors"
          >
            Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <Package className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
          <h1 className="text-2xl font-display text-[var(--color-text)] mb-4">
            No hay productos en tu pedido
          </h1>
          <p className="text-[var(--color-text-muted)] mb-6">
            Agrega productos del catálogo o crea un diseño personalizado
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/catalogo")}
              className="px-6 py-3 bg-[var(--brand-green)] text-white rounded-md hover:bg-[var(--brand-green-mid)] transition-colors"
            >
              Ver catálogo
            </button>
            <button
              onClick={() => router.push("/disena-tu-pieza")}
              className="px-6 py-3 border border-[var(--brand-green)] text-[var(--brand-green)] rounded-md hover:bg-[var(--brand-green)] hover:text-white transition-colors"
            >
              Diseñar pieza
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display text-[var(--color-text)] mb-2">
          Confirmar Pedido
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8">
          Completá tus datos y enviá tu pedido por WhatsApp
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-[var(--brand-cream)] rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                {isCustomOrder ? (
                  <>
                    <Sparkles className="w-5 h-5 text-[var(--brand-gold)]" />
                    <span className="font-display text-[var(--color-text)]">
                      ✦ Diseño personalizado
                    </span>
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5 text-[var(--brand-green)]" />
                    <span className="font-display text-[var(--color-text)]">
                      ✦ Pedido estándar
                    </span>
                  </>
                )}
              </div>

              {isCustomOrder && customDesign && (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-[var(--color-text-muted)]">Base:</span>
                    <p className="text-[var(--color-text)]">{customDesign.base_type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-[var(--color-text-muted)]">Material:</span>
                    <p className="text-[var(--color-text)]">{customDesign.material}</p>
                  </div>
                  <div>
                    <span className="text-sm text-[var(--color-text-muted)]">Colores:</span>
                    <p className="text-[var(--color-text)]">
                      {customDesign.color_palette.join(", ")}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-[var(--color-text-muted)]">Dijes:</span>
                    <p className="text-[var(--color-text)]">
                      {customDesign.charms.join(", ")}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-[var(--color-text-muted)]">Talla:</span>
                    <p className="text-[var(--color-text)]">{customDesign.size}</p>
                  </div>
                </div>
              )}

              {!isCustomOrder && cart.length > 0 && (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-14 h-14 relative rounded-md overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--brand-cream-dark)]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--color-text)] truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          x{item.quantity} — {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange("customer_name", e.target.value)}
                  onBlur={() => handleBlur("customer_name")}
                  className="w-full px-4 py-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent"
                  placeholder="Tu nombre"
                />
                {errors.customer_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => handleInputChange("customer_email", e.target.value)}
                  onBlur={() => handleBlur("customer_email")}
                  className="w-full px-4 py-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent"
                  placeholder="tu@email.com"
                />
                {errors.customer_email && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => {
                    // Permite dígitos y + solo al inicio
                    const raw = e.target.value;
                    const cleaned = raw.startsWith("+")
                      ? "+" + raw.slice(1).replace(/\D/g, "")
                      : raw.replace(/\D/g, "");
                    handleInputChange("customer_phone", cleaned);
                  }}
                  onBlur={() => handleBlur("customer_phone")}
                  className="w-full px-4 py-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent"
                  placeholder="54911xxxxxxxx"
                />
                {errors.customer_phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  onBlur={() => handleBlur("notes")}
                  className="w-full px-4 py-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Instrucciones especiales, regalo, etc."
                />
                {errors.notes && (
                  <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[var(--brand-green)] text-white rounded-md hover:bg-[var(--brand-green-mid)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar pedido por WhatsApp
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="hidden md:block">
            <div className="sticky top-8 bg-[var(--brand-cream)] rounded-lg p-6">
              <h2 className="font-display text-lg text-[var(--color-text)] mb-4">
                Resumen del pedido
              </h2>

              {isCustomOrder && customDesign && (
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Tipo:</span>
                    <span className="text-[var(--color-text)]">Diseño personalizado</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Base:</span>
                    <span className="text-[var(--color-text)]">{customDesign.base_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Material:</span>
                    <span className="text-[var(--color-text)]">{customDesign.material}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Talla:</span>
                    <span className="text-[var(--color-text)]">{customDesign.size}</span>
                  </div>
                </div>
              )}

              {!isCustomOrder && cart.length > 0 && (
                <div className="space-y-2 mb-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="text-[var(--color-text)]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-[var(--color-border)] pt-4">
                <div className="flex justify-between">
                  <span className="font-display text-[var(--color-text)]">Total</span>
                  <span className="font-display text-xl text-[var(--brand-green)]">
                    {isCustomOrder ? "A consultar" : formatPrice(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmarPedidoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-green)]" />
      </div>
    }>
      <ConfirmarPedidoContent />
    </Suspense>
  );
}
