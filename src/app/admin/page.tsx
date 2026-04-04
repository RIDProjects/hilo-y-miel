'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatPrice } from '@/lib/utils'
import type { Product, Category } from '@/types'

// Types
interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string | null
  items: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  isCustomDesign: boolean
  createdAt: string
  updatedAt: string
}

interface CategoryOption {
  value: Category
  label: string
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'AROS', label: 'Aros' },
  { value: 'COLLARES', label: 'Collares' },
  { value: 'PULSERAS', label: 'Pulseras' },
  { value: 'DIJES', label: 'Dijes' },
  { value: 'SETS', label: 'Sets' },
]

// Mock data
const MOCK_ADMIN_PRODUCTS: Product[] = [
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
    name: 'Diseño Personalizado - aros plata',
    description: 'Diseño creado por cliente - pendiente de revisión',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
    category: 'AROS',
    isCustomDesign: true,
    isActive: false,
    needsReview: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    customerName: 'María García',
    customerEmail: 'maria@email.com',
    customerPhone: '1234567890',
    notes: 'Lo necesito para regalo de cumpleaños',
    items: JSON.stringify([
      { name: 'Aros Dorados Clásicos', price: 4500, quantity: 2, type: 'catalog' }
    ]),
    status: 'PENDING',
    isCustomDesign: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    customerName: 'Juan Pérez',
    customerEmail: 'juan@email.com',
    customerPhone: '9876543210',
    notes: 'Diseño personalizado',
    items: JSON.stringify([
      { name: 'Collar Plata', price: 0, quantity: 1, type: 'custom', customDesign: { tipoPieza: 'collar' } }
    ]),
    status: 'CONFIRMED',
    isCustomDesign: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories' | 'designs'>('products')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  
  // Product form state
  const [showProductForm, setShowProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'AROS' as Category,
    imageUrl: '',
  })
  const [isUploading, setIsUploading] = useState(false)
  
  const queryClient = useQueryClient()

  // Fetch products
  const { data: products = [], isLoading: productsLoading, refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      if (!process.env.DATABASE_URL) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return MOCK_ADMIN_PRODUCTS
      }
      const res = await fetch('/api/admin/products')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    enabled: isAuthenticated,
  })

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      if (!process.env.DATABASE_URL) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return MOCK_ORDERS
      }
      const res = await fetch('/api/admin/orders')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    enabled: isAuthenticated,
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'hiloymiel2026') {
      setIsAuthenticated(true)
    } else {
      alert('Contraseña incorrecta')
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    if (!process.env.DATABASE_URL) {
      alert('Modo desarrollo: función no disponible sin base de datos')
      return
    }
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      refetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!process.env.DATABASE_URL) {
      alert('Modo desarrollo: función no disponible sin base de datos')
      return
    }
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
      refetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price || !newProduct.imageUrl) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    if (!process.env.DATABASE_URL) {
      alert('Modo desarrollo: función no disponible sin base de datos')
      return
    }

    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          category: newProduct.category,
          imageUrl: newProduct.imageUrl,
        }),
      })
      setShowProductForm(false)
      setNewProduct({ name: '', description: '', price: '', category: 'AROS', imageUrl: '' })
      refetchProducts()
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Error al subir imagen')
        return
      }

      const data = await res.json()
      setNewProduct({ ...newProduct, imageUrl: data.url })
    } catch (error) {
      alert('Error al subir imagen')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#121A12] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-surface dark:bg-[#1C271C] p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-brand-drop dark:text-cream mb-6 text-center">Admin - Hilo y Miel</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa la contraseña"
            className="w-full border border-brand-green/30 dark:border-[#5E9060]/30 rounded-lg p-3 mb-4 focus:border-brand-green dark:focus:border-[#5E9060] focus:outline-none bg-white dark:bg-[#1C271C] text-brand-drop dark:text-cream"
          />
          <button
            type="submit"
            className="w-full bg-brand-green dark:bg-[#5E9060] text-white py-3 rounded-lg hover:bg-brand-green-mid dark:hover:bg-[#7CB97C]"
          >
            Ingresar
          </button>
          <Link href="/" className="block text-center mt-4 text-brand-green dark:text-[#5E9060] hover:text-brand-green-mid dark:hover:text-[#7CB97C]">
            Volver al inicio
          </Link>
        </form>
      </div>
    )
  }

  const filteredProducts = products.filter((p) => {
    if (filter === 'active') return p.isActive
    if (filter === 'inactive') return !p.isActive
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-[#F0EDE6] dark:bg-[#121A12]">
      {/* Header */}
      <header className="bg-white dark:bg-[#1C271C] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[#2C4A2E] dark:text-[#7CB97C] hover:text-[#1E3D20] dark:hover:text-[#9ACA9D]">
                ← Volver
              </Link>
              <h1 className="text-2xl font-bold text-[#2C4A2E] dark:text-[#F0EDE6]">Panel de Administración</h1>
              {!process.env.DATABASE_URL && (
                <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">MODO DESARROLLO</span>
              )}
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-sm text-[#2C4A2E]/60 dark:text-[#A8B5A4] hover:text-[#2C4A2E] dark:hover:text-[#F0EDE6]"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#1C271C] border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-[#2C4A2E] dark:border-[#7CB97C] text-[#2C4A2E] dark:text-[#7CB97C]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-[#2C4A2E] dark:hover:text-[#7CB97C]'
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-[#2C4A2E] dark:border-[#7CB97C] text-[#2C4A2E] dark:text-[#7CB97C]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-[#2C4A2E] dark:hover:text-[#7CB97C]'
              }`}
            >
              Pedidos
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-[#2C4A2E] dark:border-[#7CB97C] text-[#2C4A2E] dark:text-[#7CB97C]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-[#2C4A2E] dark:hover:text-[#7CB97C]'
              }`}
            >
              Categorías
            </button>
            <button
              onClick={() => setActiveTab('designs')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'designs'
                  ? 'border-[#2C4A2E] dark:border-[#7CB97C] text-[#2C4A2E] dark:text-[#7CB97C]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-[#2C4A2E] dark:hover:text-[#7CB97C]'
              }`}
            >
              Diseños Personalizados
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            {/* Add Product Button */}
            <div className="mb-6 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === 'all' ? 'bg-[#2C4A2E] dark:bg-[#7CB97C] text-white' : 'bg-white dark:bg-[#1C271C] text-[#2C4A2E] dark:text-[#F0EDE6] border border-[#2C4A2E]/20 dark:border-[#7CB97C]/20'
                  }`}
                >
                  Todos ({products.length})
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === 'active' ? 'bg-[#2C4A2E] dark:bg-[#7CB97C] text-white' : 'bg-white dark:bg-[#1C271C] text-[#2C4A2E] dark:text-[#F0EDE6] border border-[#2C4A2E]/20 dark:border-[#7CB97C]/20'
                  }`}
                >
                  Activos ({products.filter(p => p.isActive).length})
                </button>
                <button
                  onClick={() => setFilter('inactive')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === 'inactive' ? 'bg-[#2C4A2E] dark:bg-[#7CB97C] text-white' : 'bg-white dark:bg-[#1C271C] text-[#2C4A2E] dark:text-[#F0EDE6] border border-[#2C4A2E]/20 dark:border-[#7CB97C]/20'
                  }`}
                >
                  Inactivos ({products.filter(p => !p.isActive).length})
                </button>
              </div>
              <button
                onClick={() => setShowProductForm(true)}
                className="px-4 py-2 rounded-lg bg-[#2C4A2E] dark:bg-[#7CB97C] text-white text-sm font-medium hover:bg-[#1E3D20] dark:hover:bg-[#9ACA9D]"
              >
                + Agregar Producto
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-lg rounded-lg bg-white dark:bg-[#1C271C] p-6">
                  <h2 className="text-xl font-bold text-[#2C4A2E] dark:text-[#F0EDE6] mb-4">Nuevo Producto</h2>
                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-[#2D352D] text-gray-900 dark:text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-[#2D352D] text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio *</label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-[#2D352D] text-gray-900 dark:text-gray-100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría *</label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as Category })}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-[#2D352D] text-gray-900 dark:text-gray-100"
                        >
                          {CATEGORY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen del Producto *</label>
                      <div className="space-y-2">
                        {newProduct.imageUrl ? (
                          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                            <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setNewProduct({ ...newProduct, imageUrl: '' })}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#2C4A2E] dark:hover:border-[#7CB97C] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-500">Click para subir imagen</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={isUploading}
                              className="hidden"
                            />
                          </label>
                        )}
                        {isUploading && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-4 h-4 border-2 border-[#2C4A2E] border-t-transparent rounded-full animate-spin"></div>
                            Subiendo imagen...
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 rounded-lg bg-[#2C4A2E] dark:bg-[#7CB97C] text-white hover:bg-[#1E3D20] dark:hover:bg-[#9ACA9D]"
                      >
                        Crear Producto
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProductForm(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products Table */}
            {productsLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2C4A2E] dark:border-[#7CB97C] border-t-transparent"></div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#2C4A2E]/20 dark:border-[#7CB97C]/20 bg-white dark:bg-[#1C271C]">
                <table className="w-full">
                  <thead className="bg-[#F0EDE6] dark:bg-[#2D352D]">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#2C4A2E]/60 dark:text-[#A8B5A4]">Imagen</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#2C4A2E]/60 dark:text-[#A8B5A4]">Nombre</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#2C4A2E]/60 dark:text-[#A8B5A4]">Categoría</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#2C4A2E]/60 dark:text-[#A8B5A4]">Precio</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#2C4A2E]/60 dark:text-[#A8B5A4]">Tipo</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#2C4A2E]/60 dark:text-[#A8B5A4]">Estado</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#2C4A2E]/60 dark:text-[#A8B5A4]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C4A2E]/10 dark:divide-[#7CB97C]/10">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-[#F0EDE6]/50 dark:hover:bg-[#2D352D]/50">
                        <td className="px-4 py-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded">
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="48px" />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs truncate font-medium text-[#2C4A2E] dark:text-[#F0EDE6]">{product.name}</div>
                          {product.needsReview && <span className="text-xs text-[#D4A853]">⚠️ Pendiente revisión</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#2C4A2E]/60 dark:text-[#A8B5A4]">{product.category}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#D4A853]">{formatPrice(Number(product.price))}</td>
                        <td className="px-4 py-3">
                          {product.isCustomDesign ? (
                            <span className="rounded-full bg-[#D4A853]/20 px-2 py-1 text-xs font-medium text-[#2C4A2E] dark:text-[#F0EDE6]">Personalizado</span>
                          ) : (
                            <span className="rounded-full bg-[#2C4A2E]/10 dark:bg-[#7CB97C]/20 px-2 py-1 text-xs font-medium text-[#2C4A2E]/60 dark:text-[#A8B5A4]">Catálogo</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {product.isActive ? <span className="text-green-600 dark:text-green-400">Activo</span> : <span className="text-[#2C4A2E]/40 dark:text-[#A8B5A4]">Inactivo</span>}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleProductStatus(product.id, product.isActive)} className="text-sm text-[#2C4A2E] dark:text-[#7CB97C] hover:text-[#1E3D20] dark:hover:text-[#9ACA9D]">
                            {product.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredProducts.length === 0 && !productsLoading && (
              <p className="text-center text-[#2C4A2E]/60 dark:text-[#A8B5A4] py-8">No hay productos</p>
            )}
          </>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <>
            <div className="mb-6 flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-[#2C4A2E] dark:bg-[#7CB97C] text-white text-sm font-medium">
                Todos ({orders.length})
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2C4A2E] dark:border-[#7CB97C] border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
                  return (
                    <div key={order.id} className="rounded-lg border border-[#2C4A2E]/20 dark:border-[#7CB97C]/20 bg-white dark:bg-[#1C271C] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-semibold text-[#2C4A2E] dark:text-[#F0EDE6]">{order.customerName}</h3>
                          <p className="text-sm text-[#2C4A2E]/60 dark:text-[#A8B5A4]">{order.customerEmail} • {order.customerPhone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status === 'PENDING' && 'Pendiente'}
                            {order.status === 'CONFIRMED' && 'Confirmado'}
                            {order.status === 'COMPLETED' && 'Completado'}
                            {order.status === 'CANCELLED' && 'Cancelado'}
                          </span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-[#2D352D] text-gray-700 dark:text-gray-300"
                          >
                            <option value="PENDING">Pendiente</option>
                            <option value="CONFIRMED">Confirmado</option>
                            <option value="COMPLETED">Completado</option>
                            <option value="CANCELLED">Cancelado</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <h4 className="text-sm font-medium text-[#2C4A2E]/60 dark:text-[#A8B5A4] mb-2">Items:</h4>
                        <div className="space-y-1">
                          {items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-700 dark:text-gray-300">
                                {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                                {item.type === 'custom' && <span className="ml-2 text-[#D4A853]">(Personalizado)</span>}
                              </span>
                              <span className="text-[#D4A853] font-medium">
                                {item.price === 0 ? 'A confirmar' : formatPrice(item.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-[#2C4A2E]/60 dark:text-[#A8B5A4]">
                            <span className="font-medium">Notas:</span> {order.notes}
                          </p>
                        </div>
                      )}

                      <p className="mt-3 text-xs text-[#2C4A2E]/40 dark:text-[#A8B5A4]">
                        Creado: {new Date(order.createdAt).toLocaleDateString('es-ES', { 
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            {orders.length === 0 && !ordersLoading && (
              <p className="text-center text-[#2C4A2E]/60 dark:text-[#A8B5A4] py-8">No hay pedidos</p>
            )}
          </>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#2C4A2E] dark:text-[#F0EDE6] mb-4">Gestionar Categorías</h2>
              <p className="text-sm text-[#2C4A2E]/60 dark:text-[#A8B5A4] mb-4">
                Las categorías determinan cómo se agrupan los productos en el catálogo.
              </p>
            </div>

            {/* Add new category form */}
            <div className="mb-6 p-4 rounded-lg border border-[#2C4A2E]/20 dark:border-[#7CB97C]/20 bg-white dark:bg-[#1C271C]">
              <h3 className="font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-3">Agregar Nueva Categoría</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const label = formData.get('label') as string
                if (label) {
                  const value = label.toUpperCase().replace(/ /g, '_')
                  // Agregar dinámicamente (solo en memoria para desarrollo)
                  const newCat = { value: value as Category, label }
                  // @ts-ignore
                  if (!CATEGORY_OPTIONS.find(c => c.value === value)) {
                    // En producción esto guardaría en DB
                    alert('Categoría agregada (en desarrollo solo se muestra)')
                  }
                }
              }} className="flex gap-2">
                <input
                  type="text"
                  name="label"
                  placeholder="Nombre de categoría"
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-[#2D352D] text-gray-900 dark:text-gray-100"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2C4A2E] dark:bg-[#7CB97C] text-white hover:bg-[#1E3D20] dark:hover:bg-[#9ACA9D]"
                >
                  Agregar
                </button>
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORY_OPTIONS.map((cat) => {
                const productCount = products.filter(p => p.category === cat.value).length
                return (
                  <div key={cat.value} className="rounded-lg border border-[#2C4A2E]/20 dark:border-[#7CB97C]/20 bg-white dark:bg-[#1C271C] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-[#2C4A2E] dark:text-[#F0EDE6]">{cat.label}</h3>
                        <p className="text-sm text-[#2C4A2E]/60 dark:text-[#A8B5A4]">{productCount} producto(s)</p>
                      </div>
                      <span className="text-xs bg-[#2C4A2E]/10 dark:bg-[#7CB97C]/20 text-[#2C4A2E]/60 dark:text-[#A8B5A4] px-2 py-1 rounded">
                        {cat.value}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* DESIGNS TAB */}
        {activeTab === 'designs' && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#2C4A2E] dark:text-[#F0EDE6] mb-4">Diseños Personalizados</h2>
              <p className="text-sm text-[#2C4A2E]/60 dark:text-[#A8B5A4] mb-4">
                Aquí se gestionan los diseños personalizados creados por clientes que fueron guardados en el catálogo.
                Puedes revisar, editar, aprobar o eliminar diseños pendientes.
              </p>
            </div>

            {/* Designs from products that are custom designs */}
            {(() => {
              const customDesigns = products.filter(p => p.isCustomDesign)
              const pendingReview = customDesigns.filter(p => p.needsReview)
              const approved = customDesigns.filter(p => !p.needsReview && p.isActive)

              return (
                <div className="space-y-6">
                  {/* Pending Review */}
                  <div>
                    <h3 className="text-md font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-3">
                      Pendientes de Revisión ({pendingReview.length})
                    </h3>
                    {pendingReview.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No hay diseños pendientes</p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {pendingReview.map((product) => (
                          <div key={product.id} className="rounded-lg border border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-900/10 p-4">
                            <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden bg-gray-100">
                              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            </div>
                            <h4 className="font-medium text-[#2C4A2E] dark:text-[#F0EDE6]">{product.name}</h4>
                            <p className="text-sm text-[#2C4A2E]/60 dark:text-[#A8B5A4] line-clamp-2">{product.description}</p>
                            {product.components && (
                              <div className="mt-2 text-xs text-[#2C4A2E]/60 dark:text-[#A8B5A4]">
                                <p>Tipo: {product.components.tipoPieza}</p>
                                <p>Material: {product.components.material} | Color: {product.components.color}</p>
                              </div>
                            )}
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => toggleProductStatus(product.id, product.isActive)}
                                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600"
                              >
                                Aprobar
                              </button>
                              <button
                                onClick={() => toggleProductStatus(product.id, false)}
                                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Approved Designs */}
                  <div>
                    <h3 className="text-md font-medium text-[#2C4A2E] dark:text-[#F0EDE6] mb-3">
                      Aprobados ({approved.length})
                    </h3>
                    {approved.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No hay diseños aprobados</p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {approved.map((product) => (
                          <div key={product.id} className="rounded-lg border border-[#2C4A2E]/20 dark:border-[#7CB97C]/20 bg-white dark:bg-[#1C271C] p-4">
                            <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden bg-gray-100">
                              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            </div>
                            <h4 className="font-medium text-[#2C4A2E] dark:text-[#F0EDE6]">{product.name}</h4>
                            <p className="text-sm text-[#D4A853] font-medium">{formatPrice(Number(product.price))}</p>
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => toggleProductStatus(product.id, false)}
                                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                Desactivar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </>
        )}
      </main>
    </div>
  )
}