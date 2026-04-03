# Design: Hilo y Miel - E-commerce Bisutería

## Technical Approach

Este diseño especifica la implementación completa de una tienda de bisutería con Next.js 14, PostgreSQL y WhatsApp. El sistema permite catálogo de productos, construcción de diseños personalizados con generación dinámica de imágenes, carrito multi-item, checkout con validación, y notificación via wa.me link.

## Architecture Decisions

### Decision: Tech Stack

| Alternativa | Elección | Rationale |
|-------------|----------|-----------|
| React + Vite | **Next.js 14 App Router** | SSR para SEO de productos, API routes integradas, deployment simple a Vercel |
| Redux | **Zustand** | Simpler para estado del carrito, menos boilerplate, persistencia fácil |
| CSS Modules | **Tailwind CSS** | Desarrollo rápido, consistencia, fácil responsive |
| Prisma | **Prisma ORM** | Type-safe, migrations simples, buena integración con PostgreSQL |
| Cloudinary | **Cloudinary** | Transformaciones de imagen, CDN, upload desde cliente |

### Decision: State Management

| Opción | Decisión | Rationale |
|--------|----------|-----------|
| Context API | Zustand | Mejor performance, menos re-renders, API de persistencia integrada |
| Server State | **TanStack Query** | Cacheo, refetch on focus, loading states automáticos |

### Decision: Image Storage for Custom Designs

| Opción | Decisión | Rationale |
|--------|----------|-----------|
| Base64 en DB | ❌ | PostgreSQL tiene límites, performance degrade |
| Archivos locales | ❌ | Hosting efímero en Vercel |
| **Cloudinary** | ✅ | CDN, transformación, storage persistente |

### Decision: WhatsApp Integration

| Opción | Decisión | Rationale |
|--------|----------|-----------|
| WhatsApp Business API | Overkill | Requiere approval, costos, complejo |
| wa.me link | ✅ | Sin API key, funciona en desktop/mobile, gratuito |

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   Catalog   │───▶│    Cart      │───▶│  Checkout    │     │
│  │   Page      │    │   (Zustand)  │    │   Page       │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│        │                                        │              │
│        ▼                                        ▼              │
│  ┌──────────────┐                       ┌──────────────┐      │
│  │ Design       │                       │   WhatsApp   │      │
│  │ Builder      │                       │   Link       │      │
│  └──────────────┘                       └──────────────┘      │
│        │                                                          │
│        ▼                                                          │
│  ┌──────────────┐                                                │
│  │   Canvas    │                                                │
│  │   Renderer  │                                                │
│  └──────────────┘                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
           │                        ▲
           ▼                        │
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (API Routes)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GET /api/products ──▶ Prisma ──▶ PostgreSQL (Railway)          │
│  POST /api/orders  ──▶ Prisma ──▶ PostgreSQL                    │
│  POST /api/designs/detect ──▶ Hash + Prisma                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## File Changes

### New Files

| File | Description |
|------|-------------|
| `prisma/schema.prisma` | Modelos Product, Order, OrderItem |
| `src/lib/prisma.ts` | Singleton Prisma Client |
| `src/store/cart.ts` | Zustand store para carrito |
| `src/components/Catalog/` | ProductGrid, ProductCard, CategoryFilter |
| `src/components/Builder/` | ComponentSelector, Preview, DesignSummary |
| `src/components/Canvas/` | DesignRenderer (canvas logic) |
| `src/components/Cart/` | CartDrawer, CartItem, CartSummary |
| `src/components/Checkout/` | OrderForm, OrderSummary |
| `src/app/page.tsx` | Página principal con catálogo |
| `src/app/builder/page.tsx` | Página del builder |
| `src/app/checkout/page.tsx` | Página de checkout |
| `src/app/api/products/route.ts` | API CRUD productos |
| `src/app/api/orders/route.ts` | API crear pedidos |
| `src/app/api/designs/detect/route.ts` | API detección diseños |
| `src/app/admin/page.tsx` | Panel admin (MVP) |

### Modified Files

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Agregar Provider de Zustand |
| `.env` | Agregar DATABASE_URL, CLOUDINARY keys, WHATSAPP_VENDOR |

## Interfaces / Contracts

### Prisma Schema

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id            String   @id @default(uuid())
  name          String
  description   String?
  price         Decimal  @db.Decimal(10, 2)
  imageUrl      String
  category      Category
  isCustomDesign Boolean @default(false)
  components    Json?
  componentsHash String?
  isActive      Boolean @default(true)
  needsReview   Boolean @default(false)
  createdFromOrder Boolean @default(false)
  orderId       String?
  customerEmail String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Order {
  id              String      @id @default(uuid())
  customerName    String
  customerEmail   String
  customerPhone   String
  notes           String?
  items           Json
  status          OrderStatus @default(PENDING)
  isCustomDesign  Boolean     @default(false)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum Category {
  AROS
  COLLARES
  PULSERAS
  DIJES
  SETS
}

enum OrderStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

### Cart Store Interface

```typescript
interface CartItem {
  id: string;
  productId?: string;
  type: 'catalog' | 'custom';
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  customDesign?: {
    imageDataUrl: string;
    description: string;
    components: DesignComponents;
  };
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}
```

### WhatsApp Message Generator

```typescript
interface WhatsAppMessageParams {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  notes?: string;
  hasCustomDesigns: boolean;
  isNewDesign: boolean;
}

function generateWhatsAppMessage(params: WhatsAppMessageParams): string {
  // Genera mensaje formateado
  // Retorna: "🛍️ *NUEVO PEDIDO - Hilo y Miel*\n..."
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Utils, formatters, components | Vitest + React Testing Library |
| Integration | API routes, Prisma queries | Vitest + test DB |
| E2E | Full user flow | Playwright |

### Priority Tests
1. Cart add/remove items
2. Design builder component selection
3. Canvas renderer output
4. WhatsApp message formatting
5. Form validation

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="xxx"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="xxx"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_VENDOR="5491112345678"
NEXT_PUBLIC_STORE_NAME="Hilo y Miel"
```

## Migration / Rollout

### Phase 1: Backend Setup
1. Crear proyecto Next.js
2. Configurar Prisma + PostgreSQL en Railway
3. Crear modelos y migración inicial

### Phase 2: Frontend Core
1. Implementar catálogo y API
2. Implementar Zustand store
3. Implementar Builder + Canvas

### Phase 3: Checkout + WhatsApp
1. Formulario de checkout
2. Integración wa.me link
3. Guardar pedidos en DB

### Phase 4: Admin
1. Panel admin básico
2. Activar/desactivar productos

### Rollback
- Vercel: Rollback desde dashboard
- Railway: Restore from backup
- DB: Migration down si es necesario

## Open Questions

- [ ] ¿El admin necesita autenticación real o contraseña simple?
- [ ] ¿Las imágenes de productos se cargan via URL externa o upload directo?
- [ ] ¿Precio de diseños personalizados = 0 o "a confirmar" en UI?

**Recomendación**: Autenticación básica con password en env por ahora. Upload directo a Cloudinary desde cliente. UI muestra "Precio a confirmar" para diseños.
