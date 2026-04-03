// Tipos para el proyecto Hilo y Miel

// Tipos de componentes del diseño
export type TipoPieza = 'aros' | 'collar' | 'pulsera' | 'dije'
export type Material = 'plata' | 'oro' | 'acero' | 'bisuteria'
export type Color = 'dorado' | 'plateado' | 'rosegold' | 'cobrizo' | 'negro'
export type Piedra = 'ninguna' | 'circonia' | 'nacar' | 'jade' | 'turquesa' | 'coral'
export type Tamanho = 'chico' | 'mediano' | 'grande'
export type Estilo = 'clasico' | 'moderno' | 'bohemio' | 'minimalista'

export interface DesignComponents {
  tipoPieza: TipoPieza
  material: Material
  color: Color
  piedra: Piedra
  tamanho: Tamanho
  estilo: Estilo
  descripcionManual?: string
}

// Tipos de producto
export type Category = 'AROS' | 'COLLARES' | 'PULSERAS' | 'DIJES' | 'SETS'

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl: string
  category: Category
  isCustomDesign: boolean
  components?: DesignComponents
  componentsHash?: string
  isActive: boolean
  needsReview?: boolean
  createdAt: string
  updatedAt: string
}

// Tipos de item en carrito
export type CartItemType = 'catalog' | 'custom'

export interface CustomDesignData {
  imageDataUrl: string
  description: string
  components: DesignComponents
}

export interface CartItem {
  id: string
  productId?: string
  type: CartItemType
  name: string
  imageUrl: string
  price: number
  quantity: number
  customDesign?: CustomDesignData
}

// Tipos de pedido
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export interface OrderItem {
  id: string
  productId?: string
  type: CartItemType
  name: string
  imageUrl: string
  price: number
  quantity: number
  customData?: CustomDesignData
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes?: string
  items: OrderItem[]
  status: OrderStatus
  isCustomDesign: boolean
  createdAt: string
  updatedAt: string
}

// Tipos para formulario de checkout
export interface CheckoutFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  notes?: string
}

// Tipos para detección de diseños
export interface DesignDetectionResult {
  isNewDesign: boolean
  matchedProductId?: string
  matchedProductName?: string
  message: string
}

// Opciones de componentes (para UI)
export const TIPO_PIEZA_OPTIONS: { value: TipoPieza; label: string }[] = [
  { value: 'aros', label: 'Aros' },
  { value: 'collar', label: 'Collar' },
  { value: 'pulsera', label: 'Pulsera' },
  { value: 'dije', label: 'Dijes' },
]

export const MATERIAL_OPTIONS: { value: Material; label: string }[] = [
  { value: 'plata', label: 'Plata' },
  { value: 'oro', label: 'Oro' },
  { value: 'acero', label: 'Acero Inoxidable' },
  { value: 'bisuteria', label: 'Bisutería' },
]

export const COLOR_OPTIONS: { value: Color; label: string }[] = [
  { value: 'dorado', label: 'Dorado' },
  { value: 'plateado', label: 'Plateado' },
  { value: 'rosegold', label: 'Rose Gold' },
  { value: 'cobrizo', label: 'Cobrizo' },
  { value: 'negro', label: 'Negro' },
]

export const PIEDRA_OPTIONS: { value: Piedra; label: string }[] = [
  { value: 'ninguna', label: 'Sin Piedra' },
  { value: 'circonia', label: 'Circonia' },
  { value: 'nacar', label: 'Nácar' },
  { value: 'jade', label: 'Jade' },
  { value: 'turquesa', label: 'Turquesa' },
  { value: 'coral', label: 'Coral' },
]

export const TAMANHO_OPTIONS: { value: Tamanho; label: string }[] = [
  { value: 'chico', label: 'Chico' },
  { value: 'mediano', label: 'Mediano' },
  { value: 'grande', label: 'Grande' },
]

export const ESTILO_OPTIONS: { value: Estilo; label: string }[] = [
  { value: 'clasico', label: 'Clásico' },
  { value: 'moderno', label: 'Moderno' },
  { value: 'bohemio', label: 'Bohemio' },
  { value: 'minimalista', label: 'Minimalista' },
]

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'AROS', label: 'Aros' },
  { value: 'COLLARES', label: 'Collares' },
  { value: 'PULSERAS', label: 'Pulseras' },
  { value: 'DIJES', label: 'Dijes' },
  { value: 'SETS', label: 'Sets' },
]