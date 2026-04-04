'use client'

import { useState } from 'react'
import type { CheckoutFormData } from '@/types'

interface OrderFormProps {
  onSubmit: (data: CheckoutFormData) => void
  isLoading?: boolean
}

export function OrderForm({ onSubmit, isLoading }: OrderFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre es requerido'
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'El correo electrónico es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Ingresa un correo electrónico válido'
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'El teléfono es requerido'
    } else if (!/^\d{10}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
      newErrors.customerPhone = 'Ingresa un teléfono de 10 dígitos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label htmlFor="customerName" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre *
        </label>
        <input
          type="text"
          id="customerName"
          value={formData.customerName}
          onChange={(e) => handleChange('customerName', e.target.value)}
          className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 bg-white dark:bg-[#1C271C] text-gray-900 dark:text-gray-100 ${
            errors.customerName
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-primary/30 dark:border-[#7CB97C]/30 focus:border-primary dark:focus:border-[#7CB97C] focus:ring-primary dark:focus:ring-[#7CB97C]'
          }`}
          placeholder="Tu nombre completo"
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="customerEmail" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Correo electrónico *
        </label>
        <input
          type="email"
          id="customerEmail"
          value={formData.customerEmail}
          onChange={(e) => handleChange('customerEmail', e.target.value)}
          className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 bg-white dark:bg-[#1C271C] text-gray-900 dark:text-gray-100 ${
            errors.customerEmail
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-primary/30 dark:border-[#7CB97C]/30 focus:border-primary dark:focus:border-[#7CB97C] focus:ring-primary dark:focus:ring-[#7CB97C]'
          }`}
          placeholder="tu@email.com"
        />
        {errors.customerEmail && (
          <p className="mt-1 text-sm text-red-500">{errors.customerEmail}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="customerPhone" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Teléfono (10 dígitos) *
        </label>
        <input
          type="tel"
          id="customerPhone"
          value={formData.customerPhone}
          onChange={(e) => handleChange('customerPhone', e.target.value)}
          className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 bg-white dark:bg-[#1C271C] text-gray-900 dark:text-gray-100 ${
            errors.customerPhone
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-primary/30 dark:border-[#7CB97C]/30 focus:border-primary dark:focus:border-[#7CB97C] focus:ring-primary dark:focus:ring-[#7CB97C]'
          }`}
          placeholder="1123456789"
          maxLength={10}
        />
        {errors.customerPhone && (
          <p className="mt-1 text-sm text-red-500">{errors.customerPhone}</p>
        )}
      </div>

      {/* Notas */}
      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notas adicionales (opcional)
        </label>
        <textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-primary/30 dark:border-[#7CB97C]/30 p-3 bg-white dark:bg-[#1C271C] text-gray-900 dark:text-gray-100 focus:border-primary dark:focus:border-[#7CB97C] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-[#7CB97C]"
          placeholder="Alguna instrucción especial para el pedido..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white hover:bg-primary-light disabled:bg-primary/50"
      >
        {isLoading ? 'Procesando...' : 'Confirmar Pedido'}
      </button>
    </form>
  )
}