# Tasks: Hilo y Miel - E-commerce Bisutería

## Phase 1: Infrastructure (Setup + Database)

- [x] 1.1 Crear proyecto Next.js 14 con TypeScript y Tailwind
- [x] 1.2 Instalar dependencias: prisma, zustand, @tanstack/react-query, html2canvas
- [x] 1.3 Inicializar Prisma con schema.prisma (Product, Order, Category, OrderStatus)
- [x] 1.4 Crear archivo src/lib/prisma.ts con singleton del cliente Prisma
- [x] 1.5 Configurar .env con DATABASE_URL, NEXT_PUBLIC_WHATSAPP_VENDOR
- [ ] 1.6 Ejecutar primera migración: `npx prisma migrate dev` (requiere DATABASE_URL)

## Phase 2: Core - State & Types

- [x] 2.1 Crear tipos TypeScript en src/types/index.ts
- [x] 2.2 Crear Zustand store en src/store/cart.ts con persistencia localStorage
- [x] 2.3 Crear utility functions en src/lib/utils.ts
- [x] 2.4 Configurar Providers en src/app/providers.tsx

## Phase 3: API Routes

- [x] 3.1 GET /api/products - listar productos activos
- [x] 3.2 GET /api/products/[id] - obtener producto por ID
- [x] 3.3 POST /api/orders - crear pedido
- [x] 3.4 GET /api/orders - listar pedidos (admin)
- [x] 3.5 POST /api/designs/detect - detectar diseño nuevo/existente

## Phase 4: Components - Catalog

- [x] 4.1 ProductCard.tsx - tarjeta de producto
- [x] 4.2 CategoryFilter.tsx - filtros de categoría
- [x] 4.3 ProductGrid.tsx - grilla de productos
- [x] 4.4 src/app/page.tsx - página principal con catálogo

## Phase 5: Components - Design Builder

- [x] 5.1 ComponentSelector.tsx - selector de componentes
- [x] 5.2 DesignPreview.tsx - preview en tiempo real
- [x] 5.3 ManualDescription.tsx - campo de descripción manual
- [x] 5.4 DesignSummary.tsx - resumen del diseño
- [x] 5.5 src/app/builder/page.tsx - página del builder

## Phase 6: Components - Canvas Renderer

- [x] 6.1 Canvas rendering en DesignPreview.tsx
- [x] 6.2 Funciones de dibujo (aros, collar, pulsera, dije)
- [x] 6.3 generateDescription() en utils.ts
- [x] 6.4 Captura de imagen via toDataURL()

## Phase 7: Components - Cart

- [x] 7.1 CartIcon.tsx - icono con contador
- [x] 7.2 CartDrawer.tsx - panel lateral
- [x] 7.3 CartItem.tsx - item del carrito
- [x] 7.4 CartSummary.tsx - resumen con totales
- [x] 7.5 Integración con Zustand store

## Phase 8: Components - Checkout

- [x] 8.1 OrderForm.tsx - formulario con validación
- [x] 8.2 CheckoutSummary.tsx - resumen del pedido
- [x] 8.3 WhatsAppButton.tsx - botón de WhatsApp
- [x] 8.4 src/app/checkout/page.tsx - página de checkout
- [x] 8.5 Validación de formulario

## Phase 9: Admin Panel

- [x] 9.1 src/app/admin/page.tsx - panel de administración
- [x] 9.2 Tabla de productos con activar/desactivar
- [x] 9.3 Funcionalidad básica de gestión
- [x] 9.4 Password protection simple
- [x] 9.5 PUT /api/products/[id]

## Phase 10: Testing & Verification

- [ ] 10.1 Verificar catálogo muestra productos
- [ ] 10.2 Verificar selección múltiple
- [ ] 10.3 Verificar builder
- [ ] 10.4 Verificar imágenes canvas
- [ ] 10.5 Verificar checkout
- [ ] 10.6 Verificar WhatsApp link

## Phase 11: Deployment

- [ ] 11.1 Configurar Railway PostgreSQL
- [ ] 11.2 Deploy a Vercel
- [ ] 11.3 Configurar variables de entorno
- [ ] 11.4 Verificar producción