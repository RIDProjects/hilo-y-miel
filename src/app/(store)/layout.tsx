"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/app/providers";
import { useCustomer, CustomerProvider } from "@/contexts/CustomerContext";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { Moon, Sun, Menu, User, LogOut } from "lucide-react";
import { useState } from "react";

function StoreNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { customer, isLoading, logout } = useCustomer();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-sm border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo className="h-12 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/catalogo"
            className={`text-[var(--color-text)] hover:text-[var(--brand-green)] transition-colors ${pathname === "/catalogo" ? "text-[var(--brand-green)]" : ""}`}
          >
            Catálogo
          </Link>
          <Link
            href="/disena-tu-pieza"
            className={`text-[var(--color-text)] hover:text-[var(--brand-green)] transition-colors ${pathname === "/disena-tu-pieza" ? "text-[var(--brand-green)]" : ""}`}
          >
            Diseña tu pieza
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-[var(--color-text)]" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>

          {/* Account button */}
          {!isLoading && (
            <div className="relative">
              {customer ? (
                <div>
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-border)] transition-colors"
                    aria-label="Mi cuenta"
                  >
                    <User className="w-5 h-5 text-[var(--brand-green)]" />
                    <span className="hidden sm:block text-sm font-medium text-[var(--brand-green)] max-w-[120px] truncate">
                      {customer.name ?? customer.email}
                    </span>
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg py-1 z-50">
                      <Link
                        href="/cuenta/mis-pedidos"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
                      >
                        Mis pedidos
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 w-full text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/cuenta/login"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--brand-green)] border border-[var(--brand-green)] rounded-lg hover:bg-[var(--brand-green)] hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">Mi cuenta</span>
                </Link>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-border)]"
          >
            <Menu className="w-5 h-5 text-[var(--color-text)]" />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="/catalogo"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-border)] rounded-lg"
            >
              Catálogo
            </Link>
            <Link
              href="/disena-tu-pieza"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-border)] rounded-lg"
            >
              Diseña tu pieza
            </Link>
            {customer ? (
              <>
                <Link
                  href="/cuenta/mis-pedidos"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-[var(--brand-green)] hover:bg-[var(--color-border)] rounded-lg"
                >
                  Mis pedidos
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/cuenta/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 text-[var(--brand-green)] hover:bg-[var(--color-border)] rounded-lg"
              >
                Mi cuenta
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerProvider>
      <div className="min-h-screen bg-[var(--color-bg)]">
        <StoreNav />
        <main className="pt-20">{children}</main>
        <Footer />
      </div>
    </CustomerProvider>
  );
}
