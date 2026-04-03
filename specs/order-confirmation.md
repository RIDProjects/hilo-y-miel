# Order Confirmation Specification

## Purpose

El sistema de confirmación de pedido recopila los datos del cliente (nombre, correo, teléfono) y prepara el resumen del pedido para enviar al vendedor vía WhatsApp.

## Requirements

### Requirement: Customer Data Form

El sistema DEBE mostrar un formulario con campos obligatorios.

- GIVEN el usuario accede a la página de checkout
- WHEN se renderiza el formulario
- THEN muestra los siguientes campos:
  - **Nombre** (obligatorio): texto, mínimo 2 caracteres
  - **Correo electrónico** (obligatorio): formato email válido
  - **Teléfono** (obligatorio): formato de teléfono argentino (10 dígitos)
  - **Notas adicionales** (opcional): textarea para comentarios

### Requirement: Form Validation

El sistema DEBE validar los campos obligatorios antes de procesar.

- GIVEN el usuario intenta enviar el formulario con campos vacíos
- WHEN hace clic en "Confirmar Pedido"
- THEN muestra errores en los campos obligatorios vacíos
- AND impide el envío hasta corregir

- GIVEN el usuario ingresa datos inválidos
- WHEN pierde el focus del campo
- THEN muestra error de validación específico
- AND el campo se marca en rojo

### Requirement: Order Summary Display

El sistema DEBE mostrar el resumen del pedido en el checkout.

- GIVEN el usuario tiene items en el carrito
- WHEN accede al checkout
- THEN muestra:
  - Lista de productos seleccionados con imágenes
  - Diseños personalizados con preview
  - Total de items
  - Nota sobre precios a confirmar

### Requirement: Submit Order

El sistema DEBE procesar el pedido al confirmar.

- GIVEN el formulario está válido
- WHEN el usuario hace clic en "Confirmar Pedido"
- THEN:
  1. Guarda el pedido en la base de datos
  2. Genera el mensaje de WhatsApp
  3. Redirige a wa.me con mensaje pre-formateado

### Requirement: Order Data Model

El pedido DEBE guardar toda la información necesaria.

- GIVEN se confirma el pedido
- WHEN se guarda en la base de datos
- THEN se almacenan:
  - Datos del cliente (nombre, email, teléfono)
  - Items del pedido (productos y/o diseños personalizados)
  - Estado inicial: "pendiente"
  - Fecha de creación
  - Identificador único

### Requirement: WhatsApp Message Generation

El sistema DEBE generar un mensaje de WhatsApp formateado.

- GIVEN pedido confirmado con:
  - Cliente: "Juan Pérez", Tel: "1123456789"
  - Items: 2 productos catálogo + 1 diseño personalizado
- WHEN se genera el mensaje
- THEN el mensaje incluye:
```
🛍️ *NUEVO PEDIDO - Hilo y Miel*

*Datos del cliente:*
👤 Nombre: Juan Pérez
📧 Email: juan@email.com
📱 Teléfono: 1123456789

*Resumen del pedido:*
━━━━━━━━━━━━━━━━━━━━━
1. ✨ Aros Dorados - $4.500
2. 💫 Collar Cristal - $6.000
3. 🎨 DISEÑO PERSONALIZADO
   - Aros de plata color dorado con circonia
   - Notas: Quiero que sea para regalo de cumpleaños

*Total items: 3*
*Estado: Pendiente de confirmación*
━━━━━━━━━━━━━━━━━━━━━

📱 Respuesta esperada en 24hs
```

### Requirement: Design Type Detection in Message

El mensaje DEBE indicar claramente si el diseño es existente o nuevo.

- GIVEN el pedido incluye un diseño personalizado
- WHEN se genera el mensaje
- THEN indica:
  - "🎨 DISEÑO PERSONALIZADO (NUEVO)" si el diseño NO existe en catálogo
  - "🎨 DISEÑO PERSONALIZADO" si el diseño YA fue guardado en catálogo

### Requirement: WhatsApp Redirect

El sistema DEBE redirigir a WhatsApp Web/App con el mensaje.

- GIVEN el pedido está listo para enviar
- WHEN se confirma
- THEN abre: `https://wa.me/NUMERO_VENDEDOR?text=MENSAJE_ENCODED`
- AND el mensaje está URI-encoded

## Data Model

```typescript
interface Order {
  id: UUID (PK)
  customerName: string (required)
  customerEmail: string (required)
  customerPhone: string (required)
  notes?: string
  items: JSON (array de OrderItem)
  status: Enum ('pending', 'confirmed', 'completed', 'cancelled')
  whatsappMessage: string
  isCustomDesign: Boolean (si hay al menos 1 diseño personalizado)
  createdAt: DateTime
  updatedAt: DateTime
}

interface OrderItem {
  id: string
  productId?: string
  type: 'catalog' | 'custom'
  name: string
  imageUrl: string
  price: number
  quantity: number
  customDesignData?: {
    imageDataUrl: string
    description: string
    components: DesignComponents
  }
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Crear nuevo pedido |
| GET | /api/orders/:id | Obtener pedido por ID |

## Validation Rules

| Campo | Reglas |
|-------|--------|
| nombre | required, min 2 chars, max 100 chars |
| email | required, valid email format |
| teléfono | required, 10 dígitos (sin +54 ni 15) |
| notas | optional, max 500 chars |
