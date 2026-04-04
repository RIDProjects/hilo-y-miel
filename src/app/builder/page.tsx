'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ComponentSelector } from '@/components/Builder/ComponentSelector'
import { ManualDescription } from '@/components/Builder/ManualDescription'
import { DesignSummary } from '@/components/Builder/DesignSummary'
import { useCartStore } from '@/store/cart'
import { generateId, generateCombinedDescription } from '@/lib/utils'
import type { DesignComponents } from '@/types'

const initialComponents: DesignComponents = {
  tipoPieza: 'aros',
  material: 'plata',
  color: 'dorado',
  piedra: 'ninguna',
  tamanho: 'mediano',
  estilo: 'moderno',
}

export default function BuilderPage() {
  const [components, setComponents] = useState<DesignComponents>(initialComponents)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Capture canvas as image
  const captureCanvas = (): string => {
    const canvas = canvasRef.current
    if (!canvas) return ''
    return canvas.toDataURL('image/png')
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      // Generate canvas image
      const canvas = canvasRef.current
      if (!canvas) {
        alert('Error al generar el diseño')
        return
      }

      // Draw on canvas
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Background
      ctx.fillStyle = '#f9f9f9'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Color mapping
      const colorMap: Record<string, string> = {
        dorado: '#FFD700',
        plateado: '#C0C0C0',
        rosegold: '#B76E79',
        cobrizo: '#B87333',
        negro: '#1C1C1C',
      }
      const fillColor = colorMap[components.color] || '#C0C0C0'

      // Draw based on tipoPieza
      ctx.fillStyle = fillColor
      ctx.strokeStyle = fillColor
      ctx.lineWidth = 3

      switch (components.tipoPieza) {
        case 'aros':
          ctx.beginPath()
          ctx.arc(130, 180, 40, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(270, 180, 40, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          if (components.piedra !== 'ninguna') {
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(130, 180, 12, 0, Math.PI * 2)
            ctx.fill()
            ctx.beginPath()
            ctx.arc(270, 180, 12, 0, Math.PI * 2)
            ctx.fill()
          }
          break
        case 'collar':
          ctx.beginPath()
          ctx.moveTo(100, 50)
          ctx.quadraticCurveTo(200, 20, 300, 50)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(200, 80)
          ctx.lineTo(200, 200)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(160, 200)
          ctx.lineTo(200, 280)
          ctx.lineTo(240, 200)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
          if (components.piedra !== 'ninguna') {
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(200, 240, 15, 0, Math.PI * 2)
            ctx.fill()
          }
          break
        case 'pulsera':
          ctx.beginPath()
          ctx.ellipse(200, 200, 120, 40, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.globalAlpha = 0.3
          ctx.fill()
          ctx.globalAlpha = 1
          ctx.beginPath()
          ctx.arc(280, 200, 20, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          if (components.piedra !== 'ninguna') {
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(280, 200, 10, 0, Math.PI * 2)
            ctx.fill()
          }
          break
        case 'dije':
          ctx.beginPath()
          ctx.moveTo(200, 100)
          ctx.lineTo(280, 170)
          ctx.lineTo(250, 280)
          ctx.lineTo(150, 280)
          ctx.lineTo(120, 170)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
          if (components.piedra !== 'ninguna') {
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(200, 200, 25, 0, Math.PI * 2)
            ctx.fill()
          }
          break
      }

      // Labels
      ctx.fillStyle = '#666666'
      ctx.font = '14px system-ui'
      ctx.textAlign = 'center'
      
      const sizeLabels: Record<string, string> = {
        chico: 'Chico',
        mediano: 'Mediano',
        grande: 'Grande',
      }
      ctx.fillText(sizeLabels[components.tamanho], canvas.width / 2, 350)

      const styleLabels: Record<string, string> = {
        clasico: 'Clásico',
        moderno: 'Moderno',
        bohemio: 'Bohemio',
        minimalista: 'Minimalista',
      }
      ctx.fillText(styleLabels[components.estilo], canvas.width / 2, 375)

      // Capture image
      const imageData = captureCanvas()
      const description = generateCombinedDescription(components)

      addItem({
        id: generateId(),
        type: 'custom',
        name: `Diseño Personalizado - ${components.tipoPieza}`,
        imageUrl: imageData || '/placeholder.svg',
        price: 0,
        quantity: 1,
        customDesign: {
          imageDataUrl: imageData,
          description,
          components,
        },
      })

      alert('Diseño agregado al carrito')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error al agregar al carrito')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#121A12]">
      {/* Hidden canvas for image generation */}
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="hidden"
      />

      {/* Header */}
      <header className="bg-white dark:bg-[#1C271C] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[#2C4A2E] dark:text-[#7CB97C] hover:text-[#1E3D20] dark:hover:text-[#9ACA9D]">
                ← Volver
              </Link>
              <h1 className="text-2xl font-bold text-[#2C4A2E] dark:text-[#F0EDE6]">Crear Diseño Personalizado</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Component Selector */}
          <div>
            <h2 className="mb-6 text-xl font-semibold text-[#2C4A2E] dark:text-[#F0EDE6]">
              Configura tu diseño
            </h2>
            <ComponentSelector
              components={components}
              onChange={setComponents}
            />
          </div>

          {/* Manual Description */}
          <div>
            <ManualDescription
              description={components.descripcionManual || ''}
              onChange={(desc) => setComponents({ ...components, descripcionManual: desc })}
            />
          </div>

          {/* Design Summary */}
          <DesignSummary components={components} />

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full rounded-lg bg-[#2C4A2E] dark:bg-[#7CB97C] px-6 py-4 text-lg font-medium text-white hover:bg-[#1E3D20] dark:hover:bg-[#9ACA9D] disabled:opacity-50 transition-colors"
          >
            {isAdding ? 'Generando...' : 'Agregar al Carrito'}
          </button>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-[#2C4A2E]/60 dark:text-[#A8B5A4] hover:text-[#2C4A2E] dark:hover:text-[#F0EDE6]"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}