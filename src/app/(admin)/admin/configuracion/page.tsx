"use client";

import { useState, useEffect } from "react";
import { Save, Phone, MessageSquare, DollarSign } from "lucide-react";

interface Settings {
  whatsapp_number: string;
  message_template: string;
  base_price: number;
}

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    whatsapp_number: "",
    message_template: "",
    base_price: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings({
        whatsapp_number: data.whatsapp_number || "",
        message_template: data.message_template || "",
        base_price: data.base_price || 0,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const defaultTemplate = `¡Hola! 👋 Me interesa hacer un pedido en Hilo & Miel.

📦 Mi pedido:
- Producto: [NOMBRE_DEL_PRODUCTO]
- Cantidad: [CANTIDAD]

💰 Total: $[MONTO]

📅 Disponible para retirar/envío a partir de mañana.

¡Gracias!`;

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-display text-brand-green mb-8">Configuración</h1>
        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-8 text-center text-gray-500">
          Cargando...
        </div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-display text-brand-green mb-8">Configuración</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-display text-brand-green">WhatsApp</h2>
              <p className="text-sm text-gray-500">Configuración para pedidos por WhatsApp</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de WhatsApp
            </label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="+5491155555555"
              className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Incluir código de país sin el +
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-display text-brand-green">Plantilla de Mensaje</h2>
              <p className="text-sm text-gray-500">Plantilla usada para generar el mensaje de WhatsApp</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plantilla de mensaje
            </label>
            <textarea
              value={settings.message_template}
              onChange={(e) => setSettings({ ...settings, message_template: e.target.value })}
              placeholder={defaultTemplate}
              rows={8}
              className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Usa [NOMBRE_DEL_PRODUCTO], [CANTIDAD], [MONTO] como variables
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-display text-brand-green">Precios</h2>
              <p className="text-sm text-gray-500">Configuración de precios base</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio base para diseños custom
            </label>
            <input
              type="number"
              value={settings.base_price}
              onChange={(e) => setSettings({ ...settings, base_price: Number(e.target.value) })}
              placeholder="2500"
              className="w-full px-4 py-2 border border-brand-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Precio base en pesos argentinos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-lg hover:bg-brand-green-mid transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          {saved && (
            <span className="text-green-600 font-medium">
              ✓ Configuración guardada
            </span>
          )}
        </div>
      </form>
    </main>
  );
}
