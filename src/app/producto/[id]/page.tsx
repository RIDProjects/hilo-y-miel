'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { useCartStore } from '@/store/cart'
import { generateId, formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

// Mock products (same as other pages)
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aros Dorados Clásicos',
    description: 'Aros de bisutería dorada con acabado brillante. Estos aros artesanales combinan elegancia y versatilidad, perfectos para complementar cualquier outfit. El acabado dorado de alta calidad garantiza durabilidad y un brillo duradero.',
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
]

interface Props {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: Props) {
  const { id } = use(params)
  const addItem = useCartStore((state) => state.addItem)
  const itemCount = useCartStore((state) => state.getTotalItems())

  // Fetch product
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!process.env.DATABASE_URL) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const found = MOCK_PRODUCTS.find((p) => p.id === id)
        if (!found) throw new Error('Product not found')
        return found
      }
      const res = await fetch(`/api/products/${id}`)
      if (!res.ok) throw new Error('Product not found')
      return res.json()
    },
  })

  const handleAddToCart = () => {
    if (!product) return
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#121A12] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2C4A2E] dark:border-[#5E9060] border-t-transparent"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#121A12] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6]">Producto no encontrado</h1>
          <Link href="/catalogo" className="mt-4 text-[#D4A853] hover:underline">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const categoryLabel: Record<string, string> = {
    AROS: 'Aros',
    COLLARES: 'Collares',
    PULSERAS: 'Pulseras',
    DIJES: 'Dijes',
    SETS: 'Sets',
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#121A12]">
      {/* Header */}
      <header className="bg-white dark:bg-[#1C271C] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/catalogo" className="text-[#2C4A2E] dark:text-[#F0EDE6] hover:text-[#D4A853]">
              ← Volver
            </Link>
            <Link
              href="/checkout"
              className="relative text-[#2C4A2E] dark:text-[#F0EDE6] hover:text-[#D4A853]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A853] text-xs font-bold text-white">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-[#5A7A5C] dark:text-[#A8B5A4]">
            <li>
              <Link href="/" className="hover:text-[#2C4A2E] dark:hover:text-[#F0EDE6]">Inicio</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/catalogo" className="hover:text-[#2C4A2E] dark:hover:text-[#F0EDE6]">Catálogo</Link>
            </li>
            <li>/</li>
            <li className="text-[#2C4A2E] dark:text-[#F0EDE6]">{product.name}</li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAFAF7] dark:bg-[#1C271C]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && <span className="badge-new">Nuevo</span>}
                {product.isCustomDesign && <span className="badge-custom">Diseño custom</span>}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-[#5A7A5C] dark:text-[#A8B5A4]">
                {categoryLabel[product.category]}
              </span>
              <h1 className="text-3xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                {product.name}
              </h1>
              <p className="text-2xl font-semibold text-[#D4A853] mt-2">
                {formatPrice(product.price)}
              </p>
            </div>

            {product.isCustomDesign && (
              <div className="bg-[#D4A853]/10 dark:bg-[#D4A853]/5 border border-[#D4A853]/20 rounded-lg p-4">
                <p className="text-sm text-[#8B6914] dark:text-[#D4A853]">
                  ✦ Este diseño nació de una creación personalizada
                </p>
              </div>
            )}

            <div className="prose prose-sm text-[#5A7A5C] dark:text-[#A8B5A4]">
              <p>{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-[#2C4A2E]/5 dark:bg-[#5E9060]/10 text-[#2C4A2E] dark:text-[#5E9060] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.isActive}
                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.isActive ? 'Agregar al pedido' : 'Producto agotado'}
              </button>
              <Link href="/diseña-tu-pieza" className="block w-full btn-secondary py-4 text-lg text-center">
                Personalizar este diseño
              </Link>
            </div>

            {/* Custom design note */}
            <div className="text-sm text-[#5A7A5C] dark:text-[#A8B5A4] space-y-1">
              <p>✓ Envío seguro con seguimiento</p>
              <p>✓ Embalaje artesanal personalizado</p>
              <p>✓ Garantía de calidad</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            También te puede gustar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MOCK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((related) => (
                <Link
                  key={related.id}
                  href={`/producto/${related.id}`}
                  className="card-product p-2"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                    <Image
                      src={related.imageUrl}
                      alt={related.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                  <p className="text-sm font-medium text-[#1E3820] dark:text-[#F0EDE6] truncate">
                    {related.name}
                  </p>
                  <p className="text-sm text-[#D4A853]">{formatPrice(related.price)}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}