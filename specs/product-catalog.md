# Product Catalog Specification

## Purpose

El sistema de catálogo de productos muestra los productos de bisutería disponibles para compra. Los productos pueden ser diseños pre-existentes creados por el admin o diseños personalizados guardados en el catálogo.

## Requirements

### Requirement: List Products

El sistema DEBE mostrar una lista de productos disponibles obtenidos de la base de datos PostgreSQL.

- GIVEN un catálogo con productos en la base de datos
- WHEN el usuario accede a la página del catálogo
- THEN se muestran todos los productos activos con su imagen, nombre, precio y categoría
- AND los productos se agrupan por categoría

### Requirement: Product Display

Cada producto en el catálogo DEBE mostrar:
- Imagen del producto (URL de Cloudinary o storage)
- Nombre del producto
- Precio en pesos argentinos
- Categoría (aros, collares, pulseras, dijes, sets)
- Indicador si es un diseño "estándar" o "personalizado guardado"

- GIVEN un producto en el catálogo
- WHEN se renderiza la tarjeta del producto
- THEN muestra imagen, nombre, precio y categoría
- AND el precio se muestra con formato "$X.XXX,XX ARS"

### Requirement: Filter by Category

El sistema DEBE permitir filtrar productos por categoría.

- GIVEN productos en múltiples categorías
- WHEN el usuario selecciona una categoría del filtro
- THEN solo se muestran productos de esa categoría
- AND las demás categorías se ocultan temporalmente

### Requirement: Add to Cart

El sistema DEBE permitir agregar productos al carrito desde el catálogo.

- GIVEN el usuario visualiza un producto en el catálogo
- WHEN hace clic en "Agregar al Carrito"
- THEN el producto se agrega al carrito
- AND se muestra una confirmación visual (toast/feedback)
- AND el contador del carrito se actualiza

### Requirement: Product Selection Mode

El sistema DEBE permitir selección múltiple de productos.

- GIVEN el usuario está en el catálogo
- WHEN hace clic en productos para seleccionar
- THEN cada clic alterna el estado seleccionado del producto
- AND los productos seleccionados muestran indicador visual
- AND el botón "Agregar Seleccionados" aparece cuando hay al menos 1 seleccionado

## Data Model

```
Product {
  id: UUID (PK)
  name: String (required, max 100 chars)
  description: String (optional, max 500 chars)
  price: Decimal (required, >= 0)
  imageUrl: String (required, URL válida)
  category: Enum (aros, collares, pulseras, dijes, sets)
  isCustomDesign: Boolean (default false)
  components: JSON (optional, array de componentes si es diseño guardado)
  isActive: Boolean (default true)
  createdAt: DateTime
  updatedAt: DateTime
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Listar todos los productos activos |
| GET | /api/products?category=X | Listar productos por categoría |
| GET | /api/products/:id | Obtener producto por ID |
