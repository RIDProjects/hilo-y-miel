# Shopping Cart Specification

## Purpose

El sistema de carrito de compras permite al usuario seleccionar múltiples productos del catálogo y diseños personalizados, mantenerlos durante la sesión, y proceder al checkout.

## Requirements

### Requirement: Add Product to Cart

El sistema DEBE permitir agregar productos del catálogo al carrito.

- GIVEN el usuario selecciona un producto del catálogo
- WHEN hace clic en "Agregar al Carrito"
- THEN el producto se agrega al carrito
- AND el contador del carrito se incrementa
- AND se muestra toast de confirmación

### Requirement: Add Multiple Products

El sistema DEBE permitir agregar múltiples productos seleccionados al carrito.

- GIVEN el usuario seleccionó varios productos en el catálogo
- WHEN hace clic en "Agregar Seleccionados"
- THEN todos los productos seleccionados se agregan al carrito
- AND la selección se limpia después de agregar
- AND se muestra cantidad agregada en el toast

### Requirement: Add Custom Design to Cart

El sistema DEBE permitir agregar diseños personalizados al carrito.

- GIVEN el usuario completó un diseño en el builder
- WHEN hace clic en "Agregar al Carrito"
- THEN el diseño se agrega con:
  - imageDataUrl (imagen PNG del diseño)
  - description (descripción combinada)
  - components (componentes seleccionados)
  - isCustomDesign: true
  - price: 0 (precio a definir por el vendedor)

### Requirement: View Cart

El sistema DEBE mostrar todos los items en el carrito.

- GIVEN hay productos en el carrito
- WHEN el usuario abre el carrito
- THEN se muestra lista de items con:
  - Imagen del producto/diseño
  - Nombre/descripción
  - Precio (o "A confirmar" para diseños personalizados)
  - Cantidad (por ahora 1 por item)
  - Botón para eliminar

### Requirement: Remove from Cart

El sistema DEBE permitir eliminar items del carrito.

- GIVEN hay items en el carrito
- WHEN el usuario hace clic en eliminar en un item
- THEN el item se elimina del carrito
- AND el contador se actualiza
- AND si el carrito queda vacío, mostrar mensaje

### Requirement: Cart Persistence

El sistema DEBE persistir el carrito durante la sesión.

- GIVEN el usuario tiene items en el carrito
- WHEN refresca la página
- THEN el carrito mantiene los items (usando localStorage o Zustand persist)

### Requirement: Cart Summary

El sistema DEBE mostrar un resumen del carrito.

- GIVEN hay items en el carrito
- WHEN se muestra el carrito
- THEN incluye:
  - Total de items
  - Subtotal (solo para productos con precio definido)
  - Nota sobre diseños personalizados ("Precio a confirmar")

### Requirement: Proceed to Checkout

El sistema DEBE permitir proceder al checkout desde el carrito.

- GIVEN el usuario tiene al menos 1 item en el carrito
- WHEN hace clic en "Continuar"
- THEN navega a la página de checkout
- AND pasa los items del carrito

## Data Structure

```typescript
interface CartItem {
  id: string; // unique id para el item en carrito
  productId?: string; // si es producto del catálogo
  type: 'catalog' | 'custom';
  name: string;
  imageUrl: string;
  price: number; // 0 para diseños personalizados
  quantity: number;
  // Solo para diseños personalizados
  customDesign?: {
    imageDataUrl: string;
    description: string;
    components: DesignComponents;
  };
}

interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}
```

## API Endpoints

No hay endpoints específicos para el carrito (se maneja en cliente con Zustand/localStorage).

## UI Components

| Componente | Descripción |
|------------|-------------|
| CartIcon | Icono del carrito con contador |
| CartDrawer | Panel lateral con items |
| CartItem | Item individual en el carrito |
| CartSummary | Resumen con totales |
| CheckoutButton | Botón para proceder |

## Cart Item Actions

| Action | Behavior |
|--------|----------|
| Eliminar | Remove item, update count |
| Imagen | Click abre preview更大 |
| Editar (solo custom) | Regresa al builder con datos |
