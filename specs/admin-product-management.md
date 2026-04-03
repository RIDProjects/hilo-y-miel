# Admin Product Management Specification

## Purpose

El sistema de gestión de productos permite al administrador crear, leer, actualizar y eliminar productos del catálogo (incluyendo diseños personalizados guardados).

## Requirements

### Requirement: List Products (Admin)

El sistema DEBE mostrar todos los productos para administración.

- GIVEN el admin accede al panel de administración
- WHEN se cargan los productos
- THEN muestra todos los productos (activos e inactivos)
- AND incluye columnas: ID, Imagen, Nombre, Precio, Categoría, Tipo, Estado, Acciones

### Requirement: Create Product

El sistema DEBE permitir crear nuevos productos.

- GIVEN el admin está en el panel de admin
- WHEN hace clic en "Nuevo Producto"
- THEN muestra formulario con campos:
  - Nombre (requerido)
  - Descripción (opcional)
  - Precio (requerido, número)
  - Imagen (requerido, URL o upload)
  - Categoría (requerido, select)
  - ¿Es diseño personalizado? (checkbox)
  - Si es personalizado: componentes (JSON)
  - ¿Activo? (checkbox)

### Requirement: Edit Product

El sistema DEBE permitir editar productos existentes.

- GIVEN un producto existe en el catálogo
- WHEN el admin hace clic en "Editar"
- THEN muestra formulario con datos actuales
- AND permite modificar cualquier campo
- AND al guardar actualiza en la base de datos

### Requirement: Delete Product

El sistema DEBE permitir eliminar (soft-delete) productos.

- GIVEN un producto existe
- WHEN el admin hace clic en "Eliminar"
- THEN pregunta confirmación
- AND marca el producto como inactivo (soft delete)
- AND no aparece en el catálogo público

### Requirement: Upload Image

El sistema DEBE permitir subir imágenes de productos.

- GIVEN el admin está creando/editando producto
- WHEN sube una imagen
- THEN:
  - Si hay Cloudinary configurado → sube a Cloudinary
  - Si no → guarda como URL externa
- AND muestra preview de la imagen

### Requirement: Manage Custom Designs

El sistema DEBE permitir gestionar diseños personalizados guardados.

- GIVEN un diseño personalizado se creó desde el builder
- WHEN el admin lo visualiza
- THEN muestra:
  - Imagen renderizada
  - Componentes seleccionados
  - Descripción auto-generada
  - Historial de pedidos con este diseño
- AND permite editar nombre, precio, categoría

## Data Model

```typescript
interface Product {
  id: UUID (PK)
  name: string (required, max 100)
  description?: string (max 500)
  price: decimal (required, >= 0)
  imageUrl: string (required)
  category: enum ('aros', 'collares', 'pulseras', 'dijes', 'sets')
  isCustomDesign: boolean (default false)
  components?: JSON // Si es diseño personalizado
  componentsHash?: string // Para detección
  isActive: boolean (default true)
  createdAt: datetime
  updatedAt: datetime
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/products | Listar todos los productos (admin) |
| GET | /api/admin/products/:id | Obtener producto por ID |
| POST | /api/admin/products | Crear producto |
| PUT | /api/admin/products/:id | Actualizar producto |
| DELETE | /api/admin/products/:id | Eliminar (soft-delete) producto |

## UI Components (Admin)

| Componente | Descripción |
|------------|-------------|
| ProductTable | Tabla con todos los productos |
| ProductForm | Formulario crear/editar |
| ProductImageUpload | Componente de upload |
| CategorySelect | Dropdown de categorías |
| CustomDesignViewer | Ver componentes de diseño |

## Access Control

Por ahora (MVP):
- Sin autenticación real
- Ruta `/admin` accesible públicamente
- Idealmente luego agregar contraseña simple o auth básico

## Security Considerations

| Consideración | Manejo |
|--------------|--------|
| Upload malicioso | Validar tipo de archivo (jpg, png, webp) |
| URLs externas | Validar que sean URLs válidas |
| SQL Injection | Usar Prisma (ORM) |
| XSS | Sanitizar inputs |
