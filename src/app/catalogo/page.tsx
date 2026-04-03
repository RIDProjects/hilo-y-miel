'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { useCartStore } from '@/store/cart'
import { useTheme } from '@/app/providers'
import { generateId, formatPrice } from '@/lib/utils'
import type { Product, Category } from '@/types'

// Mock products (same as home)
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aros Dorados Clásicos',
    description: 'Aros de bisutería dorada con acabado brillante - perfectos para cualquier ocasión',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    category: 'AROS',
    isCustomDesign: false,
    isActive: true,
    featured: true,
    tags: ['dorado', 'clasico', 'aro'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Collar Cristal Swarovski',
    description: 'Collar con cristales Swarovski - diseño exclusivo con piedras de alta calidad',
    price: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    category: 'COLLARES',
    isCustomDesign: false,
    isActive: true,
    featured: true,
    tags: ['cristal', 'collar', 'elegante'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Pulsera Plata y Piedras',
    description: 'Pulsera de plata con piedras naturales - diseño artesanal único',
    price: 6200,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    category: 'PULSERAS',
    isCustomDesign: false,
    isActive: true,
    featured: false,
    tags: ['plata', 'pulsera', 'piedras'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Dijes Artesanales',
    description: 'Set de 3 dijes artesanales - ideales para personalizar tus piezas',
    price: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    category: 'DIJES',
    isCustomDesign: false,
    isActive: true,
    featured: true,
    tags: ['dije', 'set', 'artesanal'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Set Aros + Collar',
    description: 'Combo especial aros y collar - conjunto coordinado en tono dorado',
    price: 11000,
    imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800',
    category: 'SETS',
    isCustomDesign: false,
    isActive: true,
    featured: true,
    tags: ['set', 'aros', 'collar', 'dorado'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Aros Rose Gold',
    description: 'Aros con acabado rose gold y piedras - tendencia moderna',
    price: 5800,
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800',
    category: 'AROS',
    isCustomDesign: false,
    isActive: true,
    featured: false,
    tags: ['rose gold', 'aros', 'moderno'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Collar Perlas Naturales',
    description: 'Collar con perlas naturales de agua dulce - elegancia clásica',
    price: 9500,
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800',
    category: 'COLLARES',
    isCustomDesign: false,
    isActive: true,
    featured: false,
    tags: ['perlas', 'collar', 'clasico'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Pulsera Cascada',
    description: 'Pulsera tipo cascada con múltiples hileras -look sofisticado',
    price: 4800,
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
    category: 'PULSERAS',
    isCustomDesign: false,
    isActive: true,
    featured: false,
    tags: ['pulsera', 'cascada', 'dorado'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Categories
const CATEGORIES: { value: Category | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'AROS', label: 'Aros' },
  { value: 'COLLARES', label: 'Collares' },
  { value: 'PULSERAS', label: 'Pulseras' },
  { value: 'DIJES', label: 'Dijes' },
  { value: 'SETS', label: 'Sets' },
]

// Sort options
const SORT_OPTIONS = [
  { value: 'newest', label: 'Más nuevos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'featured', label: 'Destacados' },
]

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { isDark } = useTheme()

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      if (!process.env.DATABASE_URL) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return MOCK_PRODUCTS
      }
      const params = selectedCategory !== 'ALL' ? `?category=${selectedCategory}` : ''
      const res = await fetch(`/api/products${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  // Filter and sort
  const filteredProducts = products
    .filter((p) => {
      // Category filter
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
        )
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
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

  return (
    <div className="min-h-screen bg-cream dark:bg-[#121A12]">
      {/* Header */}
      <header className="bg-white dark:bg-[#1C271C] shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-[#2C4A2E] dark:text-[#F0EDE6] hover:text-[#D4A853]">
              ← Volver
            </Link>
            <h1 className="text-xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6]" style={{ fontFamily: 'var(--font-display)' }}>
              Catálogo
            </h1>
            <div className="w-8" /> {/* Spacer */}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="input-field w-full"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-3">
                  Categoría
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.value
                          ? 'bg-[#2C4A2E] text-white dark:bg-[#5E9060]'
                          : 'text-[#5A7A5C] dark:text-[#A8B5A4] hover:bg-[#2C4A2E]/5 dark:hover:bg-[#5E9060]/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-sm font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-3">
                  Ordenar por
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field w-full"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters Toggle */}
            <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === cat.value
                      ? 'bg-[#2C4A2E] text-white dark:bg-[#5E9060]'
                      : 'bg-white dark:bg-[#1C271C] border border-[#2C4A2E]/20 dark:border-[#5E9060]/30 text-[#2C4A2E] dark:text-[#F0EDE6]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div className="mb-4 text-sm text-[#5A7A5C] dark:text-[#A8B5A4]">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2C4A2E] dark:border-[#5E9060] border-t-transparent"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#5A7A5C] dark:text-[#A8B5A4]">No se encontraron productos</p>
                <button
                  onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
                  className="mt-4 text-[#2C4A2E] dark:text-[#5E9060] hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="card-product overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Image */}
                    <Link href={`/producto/${product.id}`}>
                      <div className="relative aspect-square">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          {product.featured && (
                            <span className="badge-new">Nuevo</span>
                          )}
                          {product.isCustomDesign && (
                            <span className="badge-custom">Diseño custom</span>
                          )}
                        </div>
                        {!product.isActive && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="badge-soldout">Agotado</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-4">
                      <Link href={`/producto/${product.id}`}>
                        <h3 className="font-medium text-[#1E3820] dark:text-[#F0EDE6] hover:text-[#D4A853] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[#D4A853] font-semibold mt-1">
                        {formatPrice(product.price)}
                      </p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.isActive}
                        className="mt-3 w-full btn-secondary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {product.isActive ? 'Agregar al pedido' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}