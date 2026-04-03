# Design Renderer Specification

## Purpose

El sistema de renderizado de diseños genera dinámicamente una imagen PNG del diseño personalizado creado por el usuario, acompañada de una descripción detallada basada en los componentes seleccionados.

## Requirements

### Requirement: Image Generation

El sistema DEBE generar una imagen PNG del diseño personalizado.

- GIVEN el usuario completó la selección de componentes en el builder
- WHEN solicita generar la imagen del diseño
- THEN se crea una imagen en formato PNG
- AND la imagen representa visualmente los componentes seleccionados:
  - Tipo de pieza (aros/collar/pulsera/dije)
  - Color y material
  - Piedra (si seleccionó)
  - Tamaño relativo

### Requirement: Canvas Rendering

El sistema DEBE usar Canvas API o html2canvas para renderizar el diseño.

- GIVEN componentes del diseño seleccionados
- WHEN se inicia el renderizado
- THEN se crea un canvas invisible con dimensiones 400x400px
- AND se dibujan los elementos según los componentes
- AND se exporta como data URL (base64 PNG)

### Requirement: Auto-Generated Description

El sistema DEBE generar una descripción automática basada en componentes.

- GIVEN componentes seleccionados: tipo=aros, material=plata, color=dorado, piedra=circonia, tamanho=mediano, estilo=moderno
- WHEN se genera la descripción
- THEN la descripción es: "Aros de plata color dorado con circonia, tamaño mediano, estilo moderno."
- AND sigue el formato: "[Tipo] de [material] color [color], [piedra si aplica], tamaño [tamaño], estilo [estilo]."

### Requirement: Combined Description

El sistema DEBE combinar descripción auto-generada con descripción manual del usuario.

- GIVEN componentes seleccionados y descripción manual="Quiero que sea para regalo de cumpleaños"
- WHEN se genera la descripción final
- THEN la descripción incluye:
  - Descripción auto-generada
  - Separador "---"
  - "Notas del cliente: [descripción manual]"

- GIVEN descripción manual vacía
- WHEN se genera la descripción final
- THEN solo se incluye la descripción auto-generada

### Requirement: Preview Display

El sistema DEBE mostrar la imagen generada en el preview del builder.

- GIVEN la imagen fue generada exitosamente
- WHEN se completa el renderizado
- THEN la imagen se muestra en el área de preview
- AND tiene un tamaño máximo de 300x300px en pantalla

### Requirement: Export for Cart

El sistema DEBE proporcionar la imagen en formato utilizable para el carrito.

- GIVEN el usuario guarda el diseño en el carrito
- WHEN se exporta para el carrito
- THEN se incluye:
  - imageDataUrl: string base64 de la imagen PNG
  - description: descripción combinada
  - components: objeto con componentes seleccionados
  - isCustomDesign: true

### Requirement: Fallback Rendering

El sistema DEBE manejar casos donde el renderizado falla.

- GIVEN hay un error al generar la imagen
- WHEN falla el canvas o html2canvas
- THEN se muestra un mensaje de error en el preview
- AND se permite intentar nuevamente
- AND el diseño se puede guardar sin imagen (solo descripción)

## Technical Implementation

### Canvas Drawing Rules

| Componente | Representación Visual |
|------------|----------------------|
| Tipo aros | Dos círculos pequenos (izquierdo/derecho) |
| Tipo collar | Línea vertical con colgante |
| Tipo pulsera | Óvalo horizontal |
| Tipo dije | Forma de corazón/diamante central |
| Color dorado | #FFD700 |
| Color plateado | #C0C0C0 |
| Color rose gold | #B76E79 |
| Color cobrizo | #B87333 |
| Color negro | #1C1C1C |
| Piedra circonia | Círculo pequeño brillante |
| Piedra nácar | Círculo blanco nácar |
| Piedra jade | Círculo verde |

### Description Template

```
[TipoPieza] de [material] color [color]
[PiedraText]
Tamaño [tamanho]
Estilo [estilo]
---
Notas del cliente: [descripcionManual]
```

## API Integration

El renderizado ocurre en el cliente (navegador) usando:
- Canvas API nativa o
- html2canvas library para captura del DOM

No requiere endpoint de API para generación de imagen.

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Navegador sin soporte canvas | Mostrar mensaje de error, permitir guardar solo con descripción |
| Componentes no válidos | Validar antes de renderizar |
| Imagen muy grande (>2MB) | Comprimir o reducir calidad |
| Renderizado lento (>5s) | Mostrar loading state |
