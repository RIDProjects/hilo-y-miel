"use client";

interface LogoProps {
  className?: string;
  variant?: "default" | "watermark";
}

export default function Logo({ className = "", variant = "default" }: LogoProps) {
  const opacity = variant === "watermark" ? 1 : 1;

  return (
    <svg
      viewBox="0 0 320 215"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Hilo & Miel"
      style={{ opacity }}
    >
      {/* Hilo */}
      <text
        x="12"
        y="88"
        style={{
          fontFamily: "var(--font-great-vibes), cursive",
          fontSize: "75px",
          fill: "var(--logo-color)",
        }}
      >
        Hilo
      </text>

      {/* & */}
      <text
        x="132"
        y="116"
        style={{
          fontFamily: "var(--font-great-vibes), cursive",
          fontSize: "28px",
          fill: "var(--logo-color-mid)",
        }}
      >
        &amp;
      </text>

      {/* Miel */}
      <text
        x="50"
        y="172"
        style={{
          fontFamily: "var(--font-great-vibes), cursive",
          fontSize: "75px",
          fill: "var(--logo-color)",
        }}
      >
        Miel
      </text>

      {/* Hilo sinuoso — sale de la "o" de Hilo, curva a la derecha y baja a la gota */}
      <path
        d="M 174 62 C 205 48 248 65 264 92 C 276 112 272 132 268 144"
        style={{
          stroke: "var(--logo-color-mid)",
          strokeWidth: "1.5",
          strokeLinecap: "round",
          fill: "none",
        }}
      />

      {/* Gota de miel */}
      <path
        d="M 268 144 C 268 144 260 158 260 167 C 260 175 264 179 268 179 C 272 179 276 175 276 167 C 276 158 268 144 268 144 Z"
        style={{ fill: "var(--logo-drop)" }}
      />
    </svg>
  );
}
