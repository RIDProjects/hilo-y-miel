'use client'

import { useEffect, useRef } from 'react'
import type { DesignComponents } from '@/types'

interface DesignPreviewProps {
  components: DesignComponents
}

export function DesignPreview({ components }: DesignPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background
    ctx.fillStyle = '#f9f9f9'
    if (document.documentElement.classList.contains('dark')) {
      ctx.fillStyle = '#2D352D'
    }
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
    const drawShape = () => {
      ctx.fillStyle = fillColor
      ctx.strokeStyle = fillColor
      ctx.lineWidth = 3

      switch (components.tipoPieza) {
        case 'aros':
          // Left earring
          ctx.beginPath()
          ctx.arc(130, 180, 40, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()

          // Right earring
          ctx.beginPath()
          ctx.arc(270, 180, 40, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()

          // Stones
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
          // Chain
          ctx.beginPath()
          ctx.moveTo(100, 50)
          ctx.quadraticCurveTo(200, 20, 300, 50)
          ctx.stroke()

          // Pendant
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

          // Stone
          if (components.piedra !== 'ninguna') {
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(200, 240, 15, 0, Math.PI * 2)
            ctx.fill()
          }
          break

        case 'pulsera':
          // Bracelet
          ctx.beginPath()
          ctx.ellipse(200, 200, 120, 40, 0, 0, Math.PI * 2)
          ctx.stroke()

          // Fill
          ctx.globalAlpha = 0.3
          ctx.fill()
          ctx.globalAlpha = 1

          // Charm
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
          // Main shape
          ctx.beginPath()
          ctx.moveTo(200, 100)
          ctx.lineTo(280, 170)
          ctx.lineTo(250, 280)
          ctx.lineTo(150, 280)
          ctx.lineTo(120, 170)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()

          // Stone
          if (components.piedra !== 'ninguna') {
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(200, 200, 25, 0, Math.PI * 2)
            ctx.fill()
          }
          break
      }
    }

    drawShape()

    // Add size indicator
    ctx.fillStyle = '#666666'
    ctx.font = '14px system-ui'
    ctx.textAlign = 'center'
    
    const sizeLabels: Record<string, string> = {
      chico: 'Chico',
      mediano: 'Mediano',
      grande: 'Grande',
    }
    ctx.fillText(sizeLabels[components.tamanho], canvas.width / 2, 350)

    // Add style label
    const styleLabels: Record<string, string> = {
      clasico: 'Clásico',
      moderno: 'Moderno',
      bohemio: 'Bohemio',
      minimalista: 'Minimalista',
    }
    ctx.fillText(styleLabels[components.estilo], canvas.width / 2, 375)

  }, [components])

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-card dark:bg-[#1C271C] p-4">
      <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">Vista Previa</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="max-w-full rounded"
          style={{ maxHeight: '300px' }}
        />
      </div>
    </div>
  )
}