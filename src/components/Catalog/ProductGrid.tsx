'use client'

import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  selectedProducts?: Product[]
  onToggleSelect?: (product: Product) => void
  selectionMode?: boolean
}

export function ProductGrid({
  products,
  onAddToCart,
  selectedProducts = [],
  onToggleSelect,
  selectionMode = false,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-800 p-4">
          <svg
            className="h-8 w-8 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400">No hay productos disponibles</p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Próximamente tendremos nuevos diseños
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          isSelected={selectedProducts.some((p) => p.id === product.id)}
          onToggleSelect={onToggleSelect}
          selectionMode={selectionMode}
        />
      ))}
    </div>
  )
}