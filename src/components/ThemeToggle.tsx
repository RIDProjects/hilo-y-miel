"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[var(--color-border)] transition-all duration-300 ${className}`}
      aria-label={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-[var(--color-text)]" />
      ) : (
        <Sun className="w-5 h-5 text-[var(--color-text)]" />
      )}
    </button>
  );
}
