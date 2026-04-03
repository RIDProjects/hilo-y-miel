# Design Builder Specification

## Purpose

El sistema de construcción de diseños permite al usuario crear piezas de bisutería personalizadas combinando componentes visuales (aros, collares, pulseras, dijes, colores, materiales).

## Requirements

### Requirement: Component Selection

El sistema DEBE proporcionar un panel de componentes para seleccionar.

- GIVEN el usuario accede al builder de diseños
- WHEN se cargan los componentes disponibles
- THEN se muestran las categorías de componentes:
  - **Tipo de pieza**: aros, collar, pulsera, dije
  - **Material**: plata, oro, acero inoxidable, bisutería
  - **Color/acabado**: dorado, plateado, rose gold, cobrizo, negro
  - **Piedras**: sin piedra, circonia, nácar, jade, turquesa, coral
  - **Tamaño**: Chico, Mediano, Grande
  - **Estilo**: clásico, moderno, bohemio, minimalista

### Requirement: Real-time Preview

El sistema DEBE mostrar una previsualización en tiempo real del diseño mientras el usuario selecciona componentes.

- GIVEN el usuario selecciona componentes en el builder
- WHEN cambia cualquier componente
- THEN la previsualización se actualiza inmediatamente
- AND la previsualización muestra:
  - Representación visual de la pieza
  - Colores y acabados seleccionados
  - Tamaño relativo

### Requirement: Component Configuration

Cada componente DEBE tener opciones configurables.

- GIVEN el usuario está configurando un componente
- WHEN selecciona una opción
- THEN se guarda la selección
- AND la previsualización refleja el cambio
- AND el resumen del diseño se actualiza

### Requirement: Manual Description

El sistema DEBE permitir al usuario agregar una descripción manual para aclarar preferencias específicas.

- GIVEN el usuario está en el builder de diseños
- WHEN escribe en el campo de descripción
- THEN el texto se guarda tal cual
- AND se incluye en la descripción final del diseño
- AND el vendedor recibe esta descripción en el WhatsApp

- GIVEN campo de descripción vacío
- WHEN el usuario envía el diseño
- THEN se usa solo la descripción auto-generada

### Requirement: Builder Navigation

El sistema DEBE permitir navegar entre pasos del builder.

- GIVEN el usuario inicia el builder
- WHEN avanza entre pasos (Selección → Configuración → Preview → Guardar)
- THEN cada paso muestra contenido relevante
- AND puede volver al paso anterior
- AND los componentes seleccionados persisten

### Requirement: Design Summary

El sistema DEBE generar un resumen del diseño creado.

- GIVEN el usuario completó la selección de componentes
- WHEN solicita ver el resumen
- THEN muestra:
  - Lista de componentes seleccionados
  - Descripción auto-generada
  - Descripción manual del usuario (si existe)
  - Imagen preview del diseño

## Data Structures

```typescript
interface DesignComponents {
  tipoPieza: 'aros' | 'collar' | 'pulsera' | 'dije';
  material: 'plata' | 'oro' | 'acero' | 'bisuteria';
  color: 'dorado' | 'plateado' | 'rosegold' | 'cobrizo' | 'negro';
  piedra: 'ninguna' | 'circonia' | 'nacar' | 'jade' | 'turquesa' | 'coral';
  tamanho: 'chico' | 'mediano' | 'grande';
  estilo: 'clasico' | 'moderno' | 'bohemio' | 'minimalista';
  descripcionManual?: string;
}

interface DesignPreview {
  components: DesignComponents;
  imageDataUrl: string;
  description: string;
  createdAt: Date;
}
```

## Component Options Reference

| Categoría | Opciones |
|-----------|----------|
| Tipo de pieza | aros, collar, pulsera, dije |
| Material | plata, oro, acero inoxidable, bisutería |
| Color/Acabado | dorado, plateado, rose gold, cobrizo, negro |
| Piedra | sin piedra, circonia, nácar, jade, turquesa, coral |
| Tamaño | Chico, Mediano, Grande |
| Estilo | clásico, moderno, bohemio, minimalista |

## User Flow

```
1. Acceder al Builder
   ↓
2. Seleccionar Tipo de Pieza (aros/collar/pulsera/dije)
   ↓
3. Seleccionar Material
   ↓
4. Seleccionar Color/Acabado
   ↓
5. Seleccionar Piedra (opcional)
   ↓
6. Seleccionar Tamaño
   ↓
7. Seleccionar Estilo
   ↓
8. Agregar Descripción Manual (opcional)
   ↓
9. Ver Preview Final
   ↓
10. Agregar al Carrito o Guardar al Catálogo
```
