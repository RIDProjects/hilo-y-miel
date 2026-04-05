"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/providers";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { Moon, Sun, Menu } from "lucide-react";
import { useState } from "react";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
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
              className={`text-[var(--color-text)] hover:text-[var(--brand-green)] transition-colors ${pathname === '/catalogo' ? 'text-[var(--brand-green)]' : ''}`}
            >
              Catálogo
            </Link>
            <Link 
              href="/disena-tu-pieza" 
              className={`text-[var(--color-text)] hover:text-[var(--brand-green)] transition-colors ${pathname === '/disena-tu-pieza' ? 'text-[var(--brand-green)]' : ''}`}
            >
              Diseña tu pieza
            </Link>
          </nav>

          {/* Right side - Theme toggle + Mobile menu */}
          <div className="flex items-center gap-4">
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
            </nav>
          </div>
        )}
      </header>

      {/* Main content with top padding for fixed header */}
      <main className="pt-20">
        {children}
      </main>

      <Footer />
    </div>
  );
}