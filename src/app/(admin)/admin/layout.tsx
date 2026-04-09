"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/providers";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Palette,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Moon,
  Sun,
  Hexagon,
} from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/disenos-custom", label: "Diseños Custom", icon: Palette },
  { href: "/admin/componentes", label: "Componentes", icon: Settings },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [pendingDesignsCount, setPendingDesignsCount] = useState(0);

  useEffect(() => {
    fetch("/api/orders?status=pending")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setPendingOrdersCount(data.orders.length);
      })
      .catch(() => {});

    fetch("/api/admin/designs?status=pending")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPendingDesignsCount(data.length);
        else if (data.designs) setPendingDesignsCount(data.designs.length);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--color-surface)] rounded-lg shadow-md border border-[var(--color-border)]"
      >
        <Menu className="w-6 h-6 text-[var(--brand-green)]" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--color-surface)] shadow-xl z-50 transform transition-transform duration-300 lg:translate-x-0 border-r border-[var(--color-border)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--brand-green)] rounded-full flex items-center justify-center flex-shrink-0">
              <Hexagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl text-[var(--brand-green)]">
                Hilo &amp; Miel
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-6 right-6 p-1"
          >
            <X className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[var(--brand-green)] text-white"
                    : "text-[var(--color-text)] hover:bg-[var(--color-border)]"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
                {item.href === "/admin/pedidos" && pendingOrdersCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingOrdersCount}
                  </span>
                )}
                {item.href === "/admin/disenos-custom" && pendingDesignsCount > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingDesignsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64">
        <header className="bg-[var(--color-surface)] shadow-sm border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <div className="lg:hidden w-10" />

          <div className="flex items-center gap-4 ml-auto">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-[var(--brand-green)] border border-[var(--brand-green)] rounded-lg hover:bg-[var(--brand-green)] hover:text-white transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver tienda</span>
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-[var(--color-text-muted)]" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
