"use client";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "watermark";
}

export default function Logo({ className = "", size = "md", variant = "default" }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 48 },
    md: { width: 200, height: 80 },
    lg: { width: 300, height: 120 },
    xl: { width: 500, height: 200 },
  };

  const { width, height } = sizes[size];
  
  // Opacidad para watermark
  const watermarkOpacity = variant === "watermark" ? { opacity: 0.06 } : {};

  return (
    <svg
      viewBox="0 0 200 80"
      width={width}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={watermarkOpacity}
    >
      {/* Definiciones de estilos */}
      <defs>
        <style>
          {`
            .logo-text {
              font-family: 'Great Vibes', 'Pinyon Script', cursive;
              font-size: 28px;
              fill: #2C4A2E;
            }
            .logo-ampersand {
              font-family: 'Great Vibes', 'Pinyon Script', cursive;
              font-size: 14px;
              fill: #3D6B40;
            }
            .logo-thread {
              stroke: #3D6B40;
              stroke-width: 1.5;
              stroke-linecap: round;
              fill: none;
            }
            .logo-drop {
              fill: #2C4A2E;
            }
          `}
        </style>
      </defs>

      {/* Hilo - con bucle ornamental en la H mayúscula */}
      <path
        className="logo-text"
        d="M18 28 
           C18 28 12 32 12 38 
           C12 44 18 48 24 44
           C28 41 28 36 24 34
           L24 18
           L28 18
           L28 32
           C28 32 32 28 36 32
           C40 36 40 42 36 44
           C32 46 26 44 26 40
           L26 56
           L22 56
           L22 38
           C22 38 18 42 14 38
           C10 34 10 28 14 26
           C18 24 22 26 22 28
           L22 16
           L18 16
           L18 28Z"
        fill="#2C4A2E"
      />
      <text x="32" y="38" className="logo-text" fontSize="26">i</text>
      <text x="42" y="38" className="logo-text" fontSize="26">l</text>
      <text x="52" y="38" className="logo-text" fontSize="26">o</text>

      {/* & - Ampersand pequeño centrado */}
      <text x="76" y="34" className="logo-ampersand">&</text>

      {/* Miel - con M mayúscula de bucle grande */}
      <path
        className="logo-text"
        d="M100 26
           C100 26 94 30 94 36
           C94 42 100 46 106 42
           C110 39 110 34 106 32
           L106 18
           L112 18
           L112 32
           C112 32 116 28 120 32
           C124 36 124 42 120 44
           C116 46 110 44 110 40
           L110 56
           L106 56
           L106 38
           C106 38 102 42 98 38
           C94 34 94 28 98 26
           C102 24 106 26 106 28
           L106 16
           L100 16
           L100 26Z"
        fill="#2C4A2E"
      />
      <text x="114" y="38" className="logo-text" fontSize="26">i</text>
      <text x="124" y="38" className="logo-text" fontSize="26">e</text>
      <text x="138" y="38" className="logo-text" fontSize="26">l</text>

      {/* El hilo que sale de la "o" y forma la gota */}
      {/* Trazo fino sinuoso desde la "o" de Hilo */}
      <path
        className="logo-thread"
        d="M60 40 
           C70 40 75 35 85 38 
           C95 41 100 48 110 45
           C120 42 130 35 140 40
           C150 45 155 55 158 62"
      />
      
      {/* La gota / miel */}
      <path
        className="logo-drop"
        d="M158 62
           C158 62 155 68 155 72
           C155 76 156.5 78 158 78
           C159.5 78 161 76 161 72
           C161 68 158 62 158 62Z"
      />
    </svg>
  );
}
