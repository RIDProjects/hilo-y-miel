'use client'

import { useState } from 'react'
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
    featured: true,
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
    featured: true,
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
    featured: false,
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
    featured: true,
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
    featured: true,
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
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// How it works steps
const STEPS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
    title: 'Elige tu pieza',
    description: 'Explora nuestro catálogo de piezas únicas o diseña la tuya',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: 'Personaliza',
    description: 'Selecciona materiales, colores y dijes para crear tu diseño único',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Recibe tu pedido',
    description: 'Te notificamos cuando tu pieza esté lista y la enviamos a tu puerta',
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
      if (!process.env.DATABASE_URL) {
        await new Promise(resolve => setTimeout(resolve, 500))
        let filtered = MOCK_PRODUCTS
        if (selectedCategory) {
          filtered = MOCK_PRODUCTS.filter(p => p.category === selectedCategory)
        }
        return filtered
      }
      const params = selectedCategory ? `?category=${selectedCategory}` : ''
      const res = await fetch(`/api/products${params}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      return res.json()
    },
  })

  // Featured products for hero section
  const featuredProducts = products.filter((p: Product) => p.featured).slice(0, 4)

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
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-cream dark:bg-[#121A12] paper-texture">
        {/* Logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="logo-watermark w-[800px] h-[800px] opacity-50 scale-150">
            <Image
              src="/logo.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero text */}
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                <span className="text-[#2C4A2E] dark:text-[#F0EDE6]">Bisutería </span>
                <span className="text-[#D4A853] dark:text-[#E8C97A]">hecha</span>
                <br />
                <span className="italic text-[#2C4A2E] dark:text-[#F0EDE6]">con intención</span>
              </h1>
              
              <p className="text-xl text-[#5A7A5C] dark:text-[#A8B5A4] max-w-md">
                Piezas únicas diseñadas por ti o elegidas de nuestra colección exclusiva
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/catalogo"
                  className="btn-primary text-center text-lg"
                >
                  Ver colección
                </Link>
                <Link
                  href="/diseña-tu-pieza"
                  className="btn-secondary text-center text-lg"
                >
                  Diseña tu pieza
                </Link>
              </div>
            </div>

            {/* Hero images grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div 
                  key={product.id}
                  className={`relative aspect-square rounded-2xl overflow-hidden shadow-lg animate-fade-in-up stagger-${index + 1}`}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-white/80 text-sm">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="py-16 bg-surface dark:bg-[#1C271C]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6]" style={{ fontFamily: 'var(--font-display)' }}>
              Piezas Destacadas
            </h2>
            <p className="mt-2 text-[#5A7A5C] dark:text-[#A8B5A4]">
              Nuestra selección especial de piezas artesanales
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="card-product p-3 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-square mb-3 rounded-xl overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <h3 className="font-medium text-[#1E3820] dark:text-[#F0EDE6]">{product.name}</h3>
                <p className="text-[#D4A853] font-semibold">${product.price}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/catalogo" className="btn-secondary">
              Ver todas las piezas
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-16 bg-cream dark:bg-[#121A12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6]" style={{ fontFamily: 'var(--font-display)' }}>
              ¿Cómo funciona?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, index) => (
              <div 
                key={index}
                className="text-center p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2C4A2E]/10 dark:bg-[#5E9060]/20 flex items-center justify-center text-[#2C4A2E] dark:text-[#5E9060]">
                  {step.icon}
                </div>
                <h3 className="text-lg font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#5A7A5C] dark:text-[#A8B5A4] text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CATALOG PREVIEW ==================== */}
      <section className="py-16 bg-surface dark:bg-[#1C271C]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h2 className="text-2xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6]" style={{ fontFamily: 'var(--font-display)' }}>
              Nuestro Catálogo
            </h2>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2C4A2E] dark:border-[#5E9060] border-t-transparent"></div>
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
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white dark:bg-[#1C271C] py-12 border-t border-[#D8D3C9] dark:border-[#2A362A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Logo */}
            <div className="text-center md:text-left">
              <div className="relative h-16 w-20 mx-auto md:mx-0">
                <Image
                  src="/logo.svg"
                  alt="Hilo & Miel"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-sm text-[#5A7A5C] dark:text-[#A8B5A4]">
                Bisutería artesanal feita com intención
              </p>
            </div>

            {/* Links */}
            <div className="text-center">
              <div className="flex justify-center gap-6">
                <Link href="/catalogo" className="text-[#2C4A2E] dark:text-[#F0EDE6] hover:text-[#D4A853]">
                  Catálogo
                </Link>
                <Link href="/diseña-tu-pieza" className="text-[#2C4A2E] dark:text-[#F0EDE6] hover:text-[#D4A853]">
                  Diseñar
                </Link>
                <Link href="/admin" className="text-[#2C4A2E]/50 dark:text-[#F0EDE6]/50 text-sm">
                  Admin
                </Link>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="text-center md:text-right">
              <button
                onClick={toggle}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2C4A2E]/20 dark:border-[#5E9060]/30 text-[#2C4A2E] dark:text-[#F0EDE6] hover:bg-[#2C4A2E]/5 dark:hover:bg-[#5E9060]/10 transition-colors"
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
                <span className="text-sm">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#D8D3C9] dark:border-[#2A362A] text-center">
            <p className="text-sm text-[#5A7A5C] dark:text-[#A8B5A4]">
              © 2026 Hilo & Miel | Bisutería Artesanal
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Import useQuery
import { useQuery } from '@tanstack/react-query'