import type { 
  CartItem, 
  DesignComponents, 
  CheckoutFormData 
} from '@/types'

// Formatear precio en pesos argentinos
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(price)
}

// Generar hash único para componentes del diseño
export function generateComponentsHash(components: DesignComponents): string {
  const str = `${components.tipoPieza}-${components.material}-${components.color}-${components.piedra}-${components.tamanho}-${components.estilo}`
  // Simple hash function
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16)
}

// Generar descripción auto-generada del diseño
export function generateAutoDescription(components: DesignComponents): string {
  const tipoPiezaMap: Record<string, string> = {
    aros: 'Aros',
    collar: 'Collar',
    pulsera: 'Pulsera',
    dije: 'Dijes',
  }

  const materialMap: Record<string, string> = {
    plata: 'plata',
    oro: 'oro',
    acero: 'acero inoxidable',
    bisuteria: 'bisutería',
  }

  const colorMap: Record<string, string> = {
    dorado: 'dorado',
    plateado: 'plateado',
    rosegold: 'rose gold',
    cobrizo: 'cobrizo',
    negro: 'negro',
  }

  const piedraMap: Record<string, string> = {
    ninguna: '',
    circonia: 'con circonia',
    nacar: 'con nácar',
    jade: 'con jade',
    turquesa: 'con turquesa',
    coral: 'con coral',
  }

  const tamanhoMap: Record<string, string> = {
    chica: 'chico',
    mediano: 'mediano',
    grande: 'grande',
  }

  const estiloMap: Record<string, string> = {
    clasico: 'clásico',
    moderno: 'moderno',
    bohemio: 'bohemio',
    minimalista: 'minimalista',
  }

  const tipo = tipoPiezaMap[components.tipoPieza] || components.tipoPieza
  const material = materialMap[components.material] || components.material
  const color = colorMap[components.color] || components.color
  const piedra = piedraMap[components.piedra] || ''
  const tamanho = tamanhoMap[components.tamanho] || components.tamanho
  const estilo = estiloMap[components.estilo] || components.estilo

  let description = `${tipo} de ${material} color ${color}`
  
  if (piedra) {
    description += ` ${piedra}`
  }
  
  description += `, tamaño ${tamanho}, estilo ${estilo}`

  return description
}

// Generar descripción combinada (auto-generada + manual)
export function generateCombinedDescription(components: DesignComponents): string {
  const autoDesc = generateAutoDescription(components)
  
  if (components.descripcionManual) {
    return `${autoDesc}\n---\nNotas del cliente: ${components.descripcionManual}`
  }
  
  return autoDesc
}

// Generar mensaje de WhatsApp
export function generateWhatsAppMessage(
  formData: CheckoutFormData,
  items: CartItem[],
  hasCustomDesigns: boolean,
  isNewDesign: boolean = false
): string {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Hilo y Miel'
  const responseTime = '24hs'
  
  let message = `🛍️ *NUEVO PEDIDO - ${storeName}*\n\n`
  message += `*Datos del cliente:*\n`
  message += `👤 Nombre: ${formData.customerName}\n`
  message += `📧 Email: ${formData.customerEmail}\n`
  message += `📱 Teléfono: ${formData.customerPhone}\n`
  
  if (formData.notes) {
    message += `\n📝 Notas: ${formData.notes}\n`
  }
  
  message += `\n*Resumen del pedido:*\n`
  message += `━━━━━━━━━━━━━━━━━━━━━\n`
  
  items.forEach((item, index) => {
    const itemNum = index + 1
    if (item.type === 'custom') {
      const designLabel = isNewDesign ? 'DISEÑO PERSONALIZADO (NUEVO)' : 'DISEÑO PERSONALIZADO'
      message += `${itemNum}. ✨ *${designLabel}*\n`
      message += `   - ${item.customDesign?.description || 'Diseño personalizado'}\n`
    } else {
      message += `${itemNum}. ${item.name} - ${formatPrice(item.price)}\n`
    }
  })
  
  message += `━━━━━━━━━━━━━━━━━━━━━\n`
  message += `\n*Total items: ${items.length}*\n`
  message += `*Estado: Pendiente de confirmación*\n\n`
  message += `📱 Respuesta esperada en ${responseTime}`
  
  return encodeURIComponent(message)
}

// Generar link de WhatsApp
export function generateWhatsAppLink(
  formData: CheckoutFormData,
  items: CartItem[],
  hasCustomDesigns: boolean,
  isNewDesign: boolean = false
): string {
  const vendorPhone = process.env.NEXT_PUBLIC_WHATSAPP_VENDOR || ''
  const message = generateWhatsAppMessage(formData, items, hasCustomDesigns, isNewDesign)
  
  return `https://wa.me/${vendorPhone}?text=${message}`
}

// Generar ID único
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar teléfono argentino (10 dígitos)
export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length === 10
}

// Formatear teléfono argentino
export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 10) {
    return `549${clean}`
  }
  return clean
}