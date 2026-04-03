# Proposal: Hilo y Miel - E-commerce Bisutería

## Intent

Crear una tienda de bisutería online con catálogo de productos donde los usuarios pueden:
1. Seleccionar diseños pre-existentes del catálogo
2. Crear diseños personalizados combinando componentes
3. Agregar productos al carrito (selección múltiple)
4. Confirmar pedido con datos del cliente
5. Recibir notificación WhatsApp al vendedor con resumen

## Scope

### In Scope
- Frontend Next.js con catálogo de productos
- Panel de компоненты para crear diseños personalizados
- Carrito de compras con selección múltiple
- Formulario de confirmación (nombre, correo, teléfono)
- Integración WhatsApp wa.me con mensaje pre-formateado
- Backend API con PostgreSQL (Railway)
- Sistema de detección de diseños nuevos vs existentes
- Panel admin para gestionar productos (CRUD)
- Sistema de guardado de nuevos diseños en catálogo

### Out of Scope
- Pasarela de pagos (solo pedido Pendiente)
- Sistema de usuarios/autenticación
- Historial de pedidos
- Dashboard admin completo (MVP básico)

## Capabilities

### New Capabilities
- `product-catalog`: Catálogo de productos con imágenes, precios, categorías
- `design-builder`: Constructor visual para crear diseños personalizados con previsualización dinámica
- `design-renderer`: Generador de imagen dinámica del diseño personalizado + descripción detallada
- `shopping-cart`: Carrito con selección múltiple de productos/diseños
- `order-confirmation`: Formulario de datos del cliente
- `whatsapp-notification`: Envío de resumen por wa.me link
- `design-detection`: Sistema para detectar diseño nuevo vs existente
- `admin-product-management`: CRUD de productos para admin
- `catalog-persistence`: Guardar nuevos diseños en PostgreSQL

## Approach

**Arquitectura Full-stack Next.js:**
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL en Railway
- **WhatsApp**: Link wa.me con mensaje pre-formateado (sin API)
- **Imágenes productos**: Almacenamiento en Cloudinary o similar
- **Imágenes diseños personalizados**: Generación dinámica via html2canvas o canvas API

**Sistema de Generación de Imágenes de Diseños:**

Los diseños personalizados del usuario se generan de forma dinámica combinando:
1. **Componentes visuales**: El usuario selecciona componentes (aros, collares, pulseras, dijes, colores, materiales)
2. **Preview en tiempo real**: El navegador renderiza una previsualización usando canvas/SVG
3. **Generación de imagen**: Se convierte el diseño a imagen (PNG) para mostrar en carrito y pedido
4. **Descripción detallada**: Auto-generada basada en los componentes seleccionados + campo para descripción manual del usuario

**Flujo Principal:**
1. GET /products → fetch catálogo desde PostgreSQL
2. Usuario selecciona productos → store en Zustand/Context
3. Usuario crea diseño → builder visual con componentes → preview dinámico
4. Checkout → formulario validación
5. Submit → POST /orders → wa.me link dinámico

**Descripción del Diseño Personalizado:**
La descripción incluye:
- Lista de componentes seleccionados
- Materiales y colores
- Talla/tamaño seleccionado
- Campo de descripción manual del usuario (para aclarar preferencias específicas)
- Esta descripción acompaña la imagen en el WhatsApp al vendedor

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app` | New | Next.js App Router pages |
| `src/components` | New | UI components (Catalog, Builder, Cart, Checkout) |
| `src/lib` | New | Database connection, Prisma client |
| `prisma/schema.prisma` | New | Database models |
| `src/app/api` | New | API routes para products, orders |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Imágenes del admin | Med | Sistema upload básico o URLs externas |
| Concurrencia pedidos | Low | PostgreSQL maneja bien |
| WhatsApp spam | Low | Rate limiting en API |

## Rollback Plan

- Revertir deploy en Vercel
- Hacer dump de PostgreSQL si hay datos críticos
- Mantener código en branch feature

## Dependencies

- Prisma ORM
- Cloudinary (uploads) o storage externo
- Vercel (frontend)
- Railway (backend/DB)

## Success Criteria

- [ ] Catálogo muestra productos desde DB
- [ ] Usuario puede agregar múltiples items al carrito
- [ ] Builder permite crear diseños con componentes
- [ ] Checkout valida nombre, correo, teléfono
- [ ] WhatsApp link se genera con resumen correcto
- [ ] Diseños nuevos se guardan en PostgreSQL
- [ ] Deploy exitoso en Vercel + Railway
