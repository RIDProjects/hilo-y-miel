# Catalog Persistence Specification

## Purpose

El sistema de persistencia del catálogo permite guardar diseños personalizados creados por usuarios en la base de datos PostgreSQL, haciéndolos disponibles en el catálogo público.

## Requirements

### Requirement: Save Custom Design to Database

El sistema DEBE guardar diseños personalizados en la base de datos.

- GIVEN un usuario crea un diseño personalizado en el builder
- WHEN confirma que quiere guardar el diseño
- THEN se crea un nuevo registro en la tabla products con:
  - name: generado automáticamente o editable
  - description: descripción combinada
  - price: 0 (a definir por el admin luego)
  - imageUrl: imagen del diseño (guardada en Cloudinary o storage)
  - category: según tipo de pieza seleccionada
  - isCustomDesign: true
  - components: JSON con componentes seleccionados
  - componentsHash: hash para detección
  - isActive: false (inactivo hasta que el admin lo active)

### Requirement: Image Storage

El sistema DEBE guardar la imagen del diseño en almacenamiento permanente.

- GIVEN el usuario confirma guardar el diseño
- WHEN se procesa la imagen del canvas
- THEN:
  - Convierte dataURL a blob
  - Sube a Cloudinary (o storage configurado)
  - Guarda la URL en el registro del producto

### Requirement: Pending Review Status

El sistema DEBE marcar diseños nuevos como "pendientes de revisión".

- GIVEN se guarda un nuevo diseño personalizado
- WHEN se completa el guardado
- THEN isActive: false
- AND el diseño NO aparece en el catálogo público
- AND el admin debe activarlo manualmente

### Requirement: Link to Order

El sistema DEBE asociar el diseño guardado con el pedido original.

- GIVEN un diseño nuevo se guarda como producto
- WHEN se crea el registro
- THEN se guarda también:
  - orderId: ID del pedido donde se creó
  - customerEmail: email del cliente (para referencia)
  - createdFromOrder: true

### Requirement: Admin Notification

El sistema DEBE notificar al admin cuando se guarda un nuevo diseño.

- GIVEN un usuario guarda un diseño personalizado
- WHEN se completa el guardado
- THEN el diseño aparece en el panel admin como "pendiente"
- AND el admin recibe notificación visual en el panel

### Requirement: Fetch Custom Designs (Public)

El sistema DEBE poder obtener diseños personalizados guardados para el catálogo público.

- GIVEN un diseño personalizado fue guardado y activado por el admin
- WHEN el usuario carga el catálogo
- THEN el diseño aparece junto con los demás productos
- AND behaves como cualquier otro producto del catálogo

### Requirement: Update Custom Design Price

El sistema DEBE permitir al admin definir el precio de diseños personalizados.

- GIVEN un diseño personalizado está en estado "pendiente"
- WHEN el admin lo revisa y define precio
- THEN puede:
  - Establecer precio (y activar)
  - O rechazar el diseño (mantener inactivo)

## Data Model Extension

```typescript
interface Product {
  // ... campos existentes ...
  
  // Campos específicos para diseños personalizados
  isCustomDesign: boolean;
  components: JSON; // { tipoPieza, material, color, piedra, tamanho, estilo }
  componentsHash: string; // "aros-plata-dorado-circonia-mediano-moderno"
  
  // Campos de trazabilidad
  createdFromOrder?: boolean;
  orderId?: UUID;
  customerEmail?: string; // email del cliente que lo creó
  
  // Estado
  needsReview: boolean; // true si es nuevo y requiere revisión
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/products | Crear producto (incluye diseño personalizado) |
| PUT | /api/products/:id/activate | Activar diseño personalizado |
| PUT | /api/products/:id/price | Definir precio de diseño personalizado |

## User Flow for Saving Design

```
1. Usuario completa diseño en builder
2. Hacer click "Guardar Diseño"
3. Sistema pregunta nombre para el diseño (o auto-genera)
4. Sistema genera imagen y la sube a storage
5. Se guarda en DB como pending review
6. Notificación al vendedor en WhatsApp incluye "NUEVO DISEÑO PENDIENTE"
7. Admin revisa en panel → activa o rechaza
```

## Configuration

```typescript
interface CatalogConfig {
  autoActivateCustomDesigns: boolean; // false por defecto
  customDesignPrefix: string; // "Diseño #"
  storageProvider: 'cloudinary' | 'local'; // cloudinary por defecto
}
```

## Environment Variables

| Variable | Descripción |
|----------|-------------|
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | Cloud name de Cloudinary |
| NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET | Upload preset para diseños |
