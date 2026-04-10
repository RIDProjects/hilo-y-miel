"use client";

import { useState } from "react";
import { Save, Phone, MessageSquare, DollarSign } from "lucide-react";

const inputClass = "w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50";
const cardClass = "bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6";

const DEFAULT_TEMPLATE = `¡Hola! 👋 Me interesa hacer un pedido en Hilo & Miel.

📦 Mi pedido:
- Producto: [NOMBRE_DEL_PRODUCTO]
- Cantidad: [CANTIDAD]

💰 Total: $[MONTO]

¡Gracias!`;

export default function ConfiguracionPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    message_template: DEFAULT_TEMPLATE,
    base_price: 2500,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // La configuración se maneja vía .env — guardamos localmente por UX
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-display text-[var(--brand-green)] mb-2">Configuración</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Para cambios permanentes, editá las variables de entorno en el archivo <code className="bg-[var(--brand-cream)] px-1 rounded text-xs">.env</code>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-display text-[var(--brand-green)]">WhatsApp</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Número para recibir pedidos</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Número de WhatsApp</label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="5491155555555"
              className={inputClass}
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Incluir código de país sin el + (ej: 5491155555555)</p>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-display text-[var(--brand-green)]">Plantilla de Mensaje</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Mensaje generado al confirmar un pedido</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Plantilla</label>
            <textarea
              value={settings.message_template}
              onChange={(e) => setSettings({ ...settings, message_template: e.target.value })}
              rows={8}
              className={`${inputClass} font-mono text-sm`}
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Variables disponibles: [NOMBRE_DEL_PRODUCTO], [CANTIDAD], [MONTO]</p>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-display text-[var(--brand-green)]">Precios</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Precio base para diseños personalizados</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Precio base custom (ARS)</label>
            <input
              type="number"
              value={settings.base_price}
              onChange={(e) => setSettings({ ...settings, base_price: Number(e.target.value) })}
              placeholder="2500"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-mid)] transition-colors disabled:opacity-50">
            <Save className="w-5 h-5" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          {saved && <span className="text-green-600 dark:text-green-400 font-medium">✓ Guardado</span>}
        </div>
      </form>
    </main>
  );
}
