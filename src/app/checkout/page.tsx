'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OrderForm } from '@/components/Checkout/OrderForm'
import { CheckoutSummary } from '@/components/Checkout/CheckoutSummary'
import { WhatsAppButton } from '@/components/Checkout/WhatsAppButton'
import { useCartStore } from '@/store/cart'
import { generateWhatsAppLink } from '@/lib/utils'
import type { CheckoutFormData } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const hasCustomDesigns = useCartStore((state) => state.hasCustomDesigns())
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#1A1F1A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2C4A2E] dark:text-[#E8E6DE] mb-4">Tu carrito está vacío</h2>
          <Link href="/" className="text-[#2C4A2E] dark:text-[#7CB97C] hover:text-[#1E3D20] dark:hover:text-[#9ACA9D]">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (formData: CheckoutFormData) => {
    setIsLoading(true)
    try {
      // Save order to database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          notes: formData.notes,
          items: items.map((item) => ({
            id: item.id,
            productId: item.productId,
            type: item.type,
            name: item.name,
            imageUrl: item.imageUrl,
            price: item.price,
            quantity: item.quantity,
            customData: item.customDesign,
          })),
        }),
      })

      if (!orderResponse.ok) {
        throw new Error('Error al guardar el pedido')
      }

      // Detect if there's a new custom design
      const customItems = items.filter((item) => item.type === 'custom')
      let isNewDesign = false
      
      for (const item of customItems) {
        if (item.customDesign?.components) {
          const detectResponse = await fetch('/api/designs/detect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              components: item.customDesign.components,
            }),
          })
          
          if (detectResponse.ok) {
            const result = await detectResponse.json()
            if (result.isNewDesign) {
              isNewDesign = true
              break
            }
          }
        }
      }

      // Generate WhatsApp link
      const whatsappLink = generateWhatsAppLink(formData, items, hasCustomDesigns, isNewDesign)
      
      // Clear cart
      clearCart()
      
      // Redirect to WhatsApp
      window.location.href = whatsappLink

    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#1A1F1A]">
      {/* Header */}
      <header className="bg-white dark:bg-[#242B24] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#2C4A2E] dark:text-[#7CB97C] hover:text-[#1E3D20] dark:hover:text-[#9ACA9D]">
              ← Volver
            </Link>
            <h1 className="text-2xl font-bold text-[#2C4A2E] dark:text-[#E8E6DE]">Checkout</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Form */}
          <div>
            <h2 className="mb-6 text-xl font-semibold text-[#2C4A2E] dark:text-[#E8E6DE]">
              Datos del Cliente
            </h2>
            <OrderForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Right: Summary */}
          <div>
            <CheckoutSummary items={items} />
          </div>
        </div>
      </main>
    </div>
  )
}