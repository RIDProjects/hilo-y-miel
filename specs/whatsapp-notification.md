# WhatsApp Notification Specification

## Purpose

El sistema de notificación por WhatsApp genera un enlace wa.me con el mensaje pre-formateado del pedido y lo envía al vendedor.

## Requirements

### Requirement: WhatsApp Link Generation

El sistema DEBE generar un enlace válido de WhatsApp con el mensaje.

- GIVEN un pedido confirmado con todos los datos
- WHEN se genera el enlace
- THEN el formato es: `https://wa.me/{NUMERO_VENDEDOR}?text={MENSAJE_URL_ENCODED}`
- AND el número del vendedor está configurado en variables de entorno
- AND el mensaje tiene formato UTF-8

### Requirement: Message Formatting

El sistema DEBE formatear el mensaje de manera clara y legible.

- GIVEN un pedido con productos y diseños
- WHEN se genera el mensaje
- THEN usa Markdown/Bold para headers
- AND emojis para identificación visual
- AND saltos de línea claros

### Requirement: Phone Number Format

El sistema DEBE formatear correctamente el número del vendedor.

- GIVEN el número del vendedor es "5491112345678"
- WHEN se genera el enlace
- THEN el enlace es: `https://wa.me/5491112345678?text=...`
- AND NO incluye el prefijo + (Plus se reemplaza por nothing)

### Requirement: Custom Design Message

El sistema DEBE incluir la imagen y descripción del diseño personalizado en el mensaje.

- GIVEN el pedido incluye un diseño personalizado
- WHEN se genera el mensaje
- THEN incluye:
  - Título "DISEÑO PERSONALIZADO"
  - Descripción completa de componentes
  - Notas del cliente
  - Indicador si es nuevo o ya existente en catálogo

### Requirement: WhatsApp URL Encoding

El sistema DEBE codificar correctamente el mensaje para URL.

- GIVEN el mensaje contiene caracteres especiales (ñ, á, é, í, ó, ú, emojis)
- WHEN se codifica
- THEN usa encodeURIComponent()
- AND los emojis se preservan correctamente

### Requirement: Fallback for No WhatsApp

El sistema DEBE manejar el caso cuando WhatsApp no está disponible.

- GIVEN el usuario no tiene WhatsApp instalado
- WHEN hace clic en el enlace
- THEN abre WhatsApp Web en el navegador
- AND si no hay conexión, muestra opción de copiar mensaje

## Configuration

```typescript
interface WhatsAppConfig {
  vendorPhone: string; // "5491112345678" (sin +)
  storeName: string; // "Hilo y Miel"
  responseTime: string; // "24hs"
}
```

## Environment Variables

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| NEXT_PUBLIC_WHATSAPP_VENDOR | Número del vendedor con código país | 5491112345678 |
| NEXT_PUBLIC_STORE_NAME | Nombre de la tienda | Hilo y Miel |

## Message Template

```
🛍️ *NUEVO PEDIDO - {STORE_NAME}*

*Datos del cliente:*
👤 Nombre: {CUSTOMER_NAME}
📧 Email: {CUSTOMER_EMAIL}
📱 Teléfono: {CUSTOMER_PHONE}
{ NOTAS_ADICIONALES }

*Resumen del pedido:*
━━━━━━━━━━━━━━━━━━━━━
{ITEMS}

*Total items: {COUNT}*
*Estado: Pendiente de confirmación*
━━━━━━━━━━━━━━━━━━━━━

📱 Respuesta esperada en {RESPONSE_TIME}
```

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Número de vendedor inválido | Mostrar error de configuración |
| Mensaje muy largo (>4096 chars) | Truncar o dividir en múltiples mensajes |
| Caracteres especiales | Usar encodeURIComponent |
| Emoji no soportado | Usar alternativas de texto |
