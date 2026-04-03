# Design Detection Specification

## Purpose

El sistema de detección de diseños determina si un diseño personalizado creado por el usuario ya existe en el catálogo o si es un diseño nuevo que debe agregarse.

## Requirements

### Requirement: Compare with Existing Designs

El sistema DEBE comparar el diseño personalizado con los existentes en el catálogo.

- GIVEN el usuario crea un diseño personalizado
- WHEN se va a guardar/enviar el pedido
- THEN el sistema compara con diseños existentes en la base de datos
- AND determina si es "existente" o "nuevo"

### Requirement: Detection Algorithm

El sistema DEBE usar los componentes del diseño para comparar.

- GIVEN diseño con componentes: tipo=aros, material=plata, color=dorado, piedra=circonia, tamanho=mediano, estilo=moderno
- WHEN se compara con catálogo
- THEN busca coincidencias exactas en todos los campos
- AND si todos los componentes coinciden → "existente"
- AND si al menos uno difiere → "nuevo"

### Requirement: Detection Result

El sistema DEBE indicar claramente el resultado de la detección.

- GIVEN el diseño coincide con uno existente
- WHEN se detecta
- THEN el resultado incluye:
  - isNewDesign: false
  - matchedProductId: ID del producto coincidente
  - matchedProductName: nombre del producto

- GIVEN el diseño no coincide con ninguno existente
- WHEN se detecta
- THEN el resultado incluye:
  - isNewDesign: true
  - matchedProductId: null
  - message: "Diseño personalizado nuevo"

### Requirement: Include in WhatsApp Message

El sistema DEBE incluir el resultado de detección en el mensaje al vendedor.

- GIVEN diseño nuevo detectado
- WHEN se genera mensaje WhatsApp
- THEN incluye: "🎨 DISEÑO PERSONALIZADO (NUEVO)"
- AND el vendedor sabe que debe agregar este diseño al catálogo

- GIVEN diseño existente detectado
- WHEN se genera mensaje WhatsApp
- THEN incluye: "🎨 DISEÑO PERSONALIZADO (#{matchedProductId})"
- AND el vendedor sabe que es un diseño ya conocido

### Requirement: Auto-Add Option

El sistema DEBE ofrecer opción de agregar diseños nuevos al catálogo.

- GIVEN diseño nuevo detectado
- WHEN el usuario confirma el pedido
- THEN pregunta "¿Deseas agregar este diseño al catálogo?"
- AND si el usuario confirma → se guarda como nuevo producto
- AND si no → solo se usa para el pedido actual

### Requirement: Design Components Hash

El sistema DEBE generar un hash único para los componentes del diseño.

- GIVEN componentes del diseño
- WHEN se genera el hash
- THEN crea un string único basado en todos los componentes
- AND este hash se usa para comparación rápida en DB

## Algorithm

```
function detectDesign(components):
  // Generar hash de componentes
  hash = generateHash(components)
  
  // Buscar en DB por hash exacto
  existing = db.products.findOne({
    isCustomDesign: true,
    componentsHash: hash
  })
  
  if existing:
    return { isNewDesign: false, matchedProduct: existing }
  else:
    return { isNewDesign: true, matchedProduct: null }
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/designs/detect | Detectar si diseño es nuevo o existente |

## Request/Response

```typescript
// POST /api/designs/detect
interface DetectRequest {
  components: DesignComponents;
}

interface DetectResponse {
  isNewDesign: boolean;
  matchedProductId?: string;
  matchedProductName?: string;
  message: string;
}
```

## Detection Criteria

| Campo | Comparación |
|-------|-------------|
| tipoPieza | exacta |
| material | exacta |
| color | exacta |
| piedra | exacta |
| tamanho | exacta |
| estilo | exacta |

Todos los campos deben coincidir para considerarse "existente".
