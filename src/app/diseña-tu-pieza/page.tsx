'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ComponentSelector } from '@/components/Builder/ComponentSelector'
import { ManualDescription } from '@/components/Builder/ManualDescription'
import { DesignSummary } from '@/components/Builder/DesignSummary'
import { useCartStore } from '@/store/cart'
import { generateId, generateCombinedDescription } from '@/lib/utils'
import type { DesignComponents } from '@/types'

// Steps for the builder
const STEPS = [
  { id: 1, name: 'Base', description: 'Elige la estructura' },
  { id: 2, name: 'Material', description: 'Selecciona el material' },
  { id: 3, name: 'Colores', description: 'Paleta de colores' },
  { id: 4, name: 'Dijes', description: 'Adornos y charms' },
  { id: 5, name: 'Tamaño', description: 'Talla o longitud' },
]

const initialComponents: DesignComponents = {
  tipoPieza: 'aros',
  material: 'plata',
  color: 'dorado',
  piedra: 'ninguna',
  tamanho: 'mediano',
  estilo: 'moderno',
}

export default function DesignBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1)
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

  // Generate preview image
  const generatePreview = (): string => {
    const canvas = canvasRef.current
    if (!canvas) return ''
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

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

    ctx.fillStyle = fillColor
    ctx.strokeStyle = fillColor
    ctx.lineWidth = 3

    // Draw based on tipoPieza
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
      chica: 'Chico',
      mediana: 'Mediano',
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

    return canvas.toDataURL('image/png')
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      const previewImage = generatePreview()
      const description = generateCombinedDescription(components)

      addItem({
        id: generateId(),
        type: 'custom',
        name: `Diseño Personalizado - ${components.tipoPieza}`,
        imageUrl: previewImage || '/placeholder.svg',
        price: 0,
        quantity: 1,
        customDesign: {
          imageDataUrl: previewImage,
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

  const goToNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
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
      <header className="bg-white dark:bg-[#1C271C] shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-[#2C4A2E] dark:text-[#F0EDE6] hover:text-[#D4A853]">
              ← Volver
            </Link>
            <h1 className="text-xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6]" style={{ fontFamily: 'var(--font-display)' }}>
              Diseña tu pieza
            </h1>
            <div className="w-8" />
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="bg-white dark:bg-[#1C271C] border-b border-[#D8D3C9] dark:border-[#2A362A]">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="stepper-container justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`step-circle ${
                    currentStep === step.id
                      ? 'active'
                      : currentStep > step.id
                      ? 'completed'
                      : 'pending'
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.id ? 'bg-[#2C4A2E] dark:bg-[#5E9060]' : 'step-line'}`} />
                )}
              </div>
            ))}
          </div>
          {/* Step labels */}
          <div className="flex justify-between mt-2 text-xs text-center">
            {STEPS.map((step) => (
              <div key={step.id} className="flex-1">
                <span className={currentStep >= step.id ? 'text-[#2C4A2E] dark:text-[#5E9060]' : 'text-[#5A7A5C] dark:text-[#A8B5A4]'}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Current step content */}
          <div className="bg-surface dark:bg-[#1C271C] rounded-2xl p-6 shadow-lg">
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Elige la estructura de tu pieza
                </h2>
                <ComponentSelector
                  components={components}
                  onChange={setComponents}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Selecciona el material
                </h2>
                <ComponentSelector
                  components={components}
                  onChange={setComponents}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Elige la paleta de colores
                </h2>
                <ComponentSelector
                  components={components}
                  onChange={setComponents}
                />
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Agrega dijes y adornos (opcional)
                </h2>
                <ComponentSelector
                  components={components}
                  onChange={setComponents}
                />
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Selecciona la talla
                </h2>
                <ComponentSelector
                  components={components}
                  onChange={setComponents}
                />
              </div>
            )}
          </div>

          {/* Additional notes */}
          <div>
            <ManualDescription
              description={components.descripcionManual || ''}
              onChange={(desc) => setComponents({ ...components, descripcionManual: desc })}
            />
          </div>

          {/* Preview & Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Preview */}
            <div className="bg-surface dark:bg-[#1C271C] rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-4">
                Vista previa
              </h3>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAFAF7] dark:bg-[#121A12]">
                <img
                  src={generatePreview()}
                  alt="Preview de tu diseño"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <DesignSummary components={components} />
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between gap-4">
            <button
              onClick={goToPrevStep}
              disabled={currentStep === 1}
              className="btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            
            {currentStep === STEPS.length ? (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50"
              >
                {isAdding ? 'Generando...' : 'Agregar al pedido'}
              </button>
            ) : (
              <button
                onClick={goToNextStep}
                className="btn-primary px-8 py-3"
              >
                Siguiente →
              </button>
            )}
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-[#5A7A5C] dark:text-[#A8B5A4] hover:text-[#2C4A2E] dark:hover:text-[#F0EDE6]"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}