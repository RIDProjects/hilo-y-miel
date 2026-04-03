'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { ProductGrid } from '@/components/Catalog/ProductGrid'
import { CategoryFilter } from '@/components/Catalog/CategoryFilter'
import { useCartStore } from '@/store/cart'
import { useTheme } from '@/app/providers'
import { generateId } from '@/lib/utils'
import type { Product, Category } from '@/types'

// Mock products para desarrollo
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aros Dorados Clásicos',
    description: 'Aros de bisutería dorada con acabado brillante',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
    category: 'AROS',
    isCustomDesign: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Collar Cristal Swarovski',
    description: 'Collar con cristales Swarovski - diseño exclusivo',
    price: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    category: 'COLLARES',
    isCustomDesign: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Pulsera Plata y Piedras',
    description: 'Pulsera de plata con piedras naturales',
    price: 6200,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
    category: 'PULSERAS',
    isCustomDesign: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Dijes Artesanales',
    description: 'Set de 3 dijes artesanales',
    price: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    category: 'DIJES',
    isCustomDesign: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Set Aros + Collar',
    description: 'Combo especial aros y collar',
    price: 11000,
    imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
    category: 'SETS',
    isCustomDesign: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Aros Rose Gold',
    description: 'Aros con acabado rose gold y piedras',
    price: 5800,
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400',
    category: 'AROS',
    isCustomDesign: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const addItem = useCartStore((state) => state.addItem)
  const itemCount = useCartStore((state) => state.getTotalItems())
  const { isDark, toggle } = useTheme()

  // Fetch products - usa mock en desarrollo
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      // En desarrollo sin DB, usar mock data
      // En producción, esto fetchearía de /api/products
      if (!process.env.DATABASE_URL) {
        // Modo desarrollo sin DB
        await new Promise(resolve => setTimeout(resolve, 500)) // Simular delay
        let filtered = MOCK_PRODUCTS
        if (selectedCategory) {
          filtered = MOCK_PRODUCTS.filter(p => p.category === selectedCategory)
        }
        return filtered
      }
      // Production: fetch from API
      const params = selectedCategory ? `?category=${selectedCategory}` : ''
      const res = await fetch(`/api/products${params}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      return res.json()
    },
  })

  const handleAddToCart = (product: Product) => {
    addItem({
      id: generateId(),
      productId: product.id,
      type: 'catalog',
      name: product.name,
      imageUrl: product.imageUrl,
      price: Number(product.price),
      quantity: 1,
    })
  }

  const handleToggleSelect = (product: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      if (exists) {
        return prev.filter((p) => p.id !== product.id)
      }
      return [...prev, product]
    })
  }

  const handleAddSelected = () => {
    selectedProducts.forEach((product) => {
      addItem({
        id: generateId(),
        productId: product.id,
        type: 'catalog',
        name: product.name,
        imageUrl: product.imageUrl,
        price: Number(product.price),
        quantity: 1,
      })
    })
    setSelectedProducts([])
    setSelectionMode(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Logo - Full area - subtle watermark effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.02]">
          <div className="w-full h-full scale-150">
            <Image
              src="/logo.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-[#242B24] shadow-sm relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
              {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="Hilo y Miel - Volver al inicio">
              <div className="relative h-12 w-16">
                <Image
                  src="/logo.png"
                  alt="Hilo y Miel"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggle}
                className="rounded-lg p-2 text-[#2C4A2E] dark:text-[#E8E6DE] hover:bg-[#F0EDE6] dark:hover:bg-[#2D352D] transition-colors"
                aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <Link
                href="/builder"
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#2C4A2E] dark:text-[#E8E6DE] hover:bg-[#F0EDE6] dark:hover:bg-[#2D352D] transition-colors"
              >
                Crear Diseño
              </Link>
              <Link
                href="/checkout"
                className="relative rounded-lg bg-[#2C4A2E] dark:bg-[#7CB97C] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E3D20] dark:hover:bg-[#9ACA9D] transition-colors"
                aria-label={`Ver carrito con ${itemCount} productos`}
              >
                Carrito
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A853] text-xs font-bold">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Selection mode toggle */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectionMode(!selectionMode)
              if (selectionMode) setSelectedProducts([])
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectionMode
                ? 'bg-[#2C4A2E] dark:bg-[#7CB97C] text-white'
                : 'bg-white dark:bg-[#242B24] text-[#2C4A2E] dark:text-[#E8E6DE] border border-[#2C4A2E] dark:border-[#7CB97C]'
            }`}
          >
            {selectionMode ? '✕ Cancelar Selección' : '☑ Seleccionar Productos'}
          </button>
        </div>

        {/* Add selected button */}
        {selectionMode && selectedProducts.length > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-[#D4A853]/20 p-4">
            <span className="text-[#2C4A2E] dark:text-[#E8E6DE] font-medium">
              {selectedProducts.length} producto(s) seleccionado(s)
            </span>
            <button
              onClick={handleAddSelected}
              className="rounded-lg bg-[#2C4A2E] dark:bg-[#7CB97C] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E3D20] dark:hover:bg-[#9ACA9D]"
            >
              Agregar Seleccionados
            </button>
          </div>
        )}

        {/* Category filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Products */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2C4A2E] dark:border-[#7CB97C] border-t-transparent"></div>
          </div>
        ) : (
          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            selectedProducts={selectedProducts}
            onToggleSelect={handleToggleSelect}
            selectionMode={selectionMode}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#242B24] py-6 relative z-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-[#2C4A2E]/60 dark:text-[#A8B5A4] sm:px-6 lg:px-8">
          <p>© 2026 Hilo y Miel | Bisutería Artesanal</p>
        </div>
      </footer>
    </div>
  )
}