# Sistema de diseño — "Instituciones Democráticas para el Futuro"

Línea gráfica del **Banco de experiencias de gobernanza pública · América Latina y el Caribe** (PNUD ALC), versión v2.
Documento de referencia para reproducir esta identidad en nuevas piezas (páginas, dashboards, informes, presentaciones).

**Esencia en una frase**: institucional pero cálido — base teal serena con acentos naranjas enérgicos, formas de píldora/cápsula completamente redondeadas, tipografía Mulish, mucho blanco y aire.

---

## 1. Paleta de color

### Colores de marca

| Token | Hex | Uso |
|---|---|---|
| Teal primario | `#3E7F7C` | Color principal de marca; fondos hero/portada; títulos de sección; iconos de UI |
| Teal claro | `#4A8D89` | Variante para hovers, iconos, elementos secundarios de marca |
| Teal profundo | `#2C5F63` | Botones oscuros, texto sobre fondos claros que necesita más peso |
| Petróleo (tinta) | `#223F4A` | Titulares, texto de máxima jerarquía, elementos gráficos oscuros |
| Naranja acento | `#E8622D` | SOLO acentos: CTA principal, tags destacados (PNUD), estado activo del selector de idioma, elementos del motivo gráfico. Nunca como color dominante ni para texto pequeño sobre blanco |
| Naranja oscuro | `#C74E1F` | Hover del naranja; texto naranja sobre fondos claros |
| Naranja suave | `#FBE9E1` | Fondo de tags/chips naranjas |

### Rampa teal completa (de oscuro a claro)

`#16333B` · `#223F4A` · `#2C5F63` · `#3E7F7C` · `#4A8D89` · `#6F9E99` · `#8FB6B1` · `#BFD8D3` · `#DDE9EA` · `#EFF4F4`

### Neutros (con matiz verdoso, nunca gris puro)

| Token | Hex | Uso |
|---|---|---|
| Tinta | `#223F4A` | Titulares |
| Texto | `#33505A` | Cuerpo de texto |
| Atenuado | `#64818B` | Texto secundario, metadatos |
| Tenue | `#91A8AF` | Placeholders, hints |
| Línea | `#DFE9E8` | Bordes de cards y divisores |
| Línea fuerte | `#CBDCDA` | Bordes de inputs y controles |
| Panel | `#EFF4F4` | Fondos suaves de superficie |
| Panel 2 | `#E4EDEC` | Hovers de superficie |
| Fondo de página | `#FFFFFF` | Blanco puro; las superficies se delimitan con borde + sombra sutil, no con fondo gris |

### Dataviz

Mapa coroplético (intensidad): alta `#24586A` · media `#7FADB3` · baja `#CFE0E3` · sin datos `#E9F0EF`. Territorios de contexto `#D9E4E3`. Trazos entre países: blanco.

Barras (ranking, de mayor a menor): `#24586A` · `#35707B` · `#4A8D89` · `#7FADB3` · `#9FC4C0` · `#CFE0E3`.

Colores categóricos por dimensión temática (tint = icono/etiqueta; soft = fondo del tile del icono):

| Categoría | Tint | Soft |
|---|---|---|
| Gobernanza anticipatoria | `#223F4A` | `#E4EBED` |
| Gobernanza colaborativa | `#4A8D89` | `#E6F1F0` |
| Gobernanza comunicacional | `#E8622D` | `#FBE9E1` |
| Gobernanza íntegra | `#1F8A7D` | `#E2F1EE` |
| Gobernanza digital | `#24586A` | `#E2EBEF` |
| Gobernanza intergeneracional | `#C74E1F` | `#FAEDE6` |

Regla: los categóricos alternan la familia teal/petróleo con dos naranjas; el naranja identifica categorías "de comunicación/personas".

## 2. Tipografía

- **Familia única**: [Mulish](https://fonts.google.com/specimen/Mulish) (Google Fonts), fallback `system-ui, sans-serif`. Monoespaciada (código/cifras técnicas): IBM Plex Mono.
- Pesos: 400 cuerpo · 600 semibold (labels) · 700 bold (títulos de componente, botones) · 800 extrabold (titulares) · 900 solo cifras KPI.
- Escala de referencia: titular hero 66px/1.12 (peso 800, letter-spacing −0.5px) · titular de página 23–27px (800) · título de card 16px (700) · cuerpo 14–15.5px/1.6 · metadatos 12–13px · eyebrow/overline 12px MAYÚSCULAS con letter-spacing 0.8–3px.
- Los titulares grandes van en Petróleo `#223F4A` (no en teal); el teal se reserva para títulos de sección menores y énfasis.

## 3. Forma y geometría

- **Píldora (border-radius 999px)**: buscadores, filtros, botones, chips, selector de idioma, cápsulas decorativas. Es el rasgo formal distintivo de la línea.
- Radios para superficies: cards 12–16px · paneles/modales 16–22px · tiles de icono 12–14px.
- Bordes: 1–1.5px en color Línea/Línea fuerte. Nada de bordes duros ni esquinas rectas en elementos interactivos.
- Sombras (elevación sutil, tinte petróleo, nunca negro puro):
  - sm: `0 1px 2px rgba(24,48,55,.06), 0 1px 1px rgba(24,48,55,.04)`
  - md: `0 6px 22px rgba(24,48,55,.10), 0 2px 6px rgba(24,48,55,.06)`
  - lg: `0 24px 60px rgba(16,44,52,.20)`

## 4. Motivo gráfico de marca (portada / piezas hero)

Sobre fondo Teal primario `#3E7F7C`:

1. **Cápsulas verticales** (rectángulos con radius 999px) de alturas variadas dispuestas en columnas, como un ecualizador orgánico. Colores permitidos: `#E8622D`, `#223F4A`, `#F4F8F8`, `#DDE9EA`, `#BFD8D3`, `#FFFFFF`.
2. **Trama de puntos**: algunas cápsulas llevan patrón de puntos blancos semitransparentes — CSS: `radial-gradient(circle, rgba(255,255,255,.55) 2.5px, transparent 3px) 0 0 / 14px 14px` sobre el color base.
3. **Círculos concéntricos** de línea blanca `rgba(255,255,255,0.28)`, grosor 1.2px, radios en incrementos de 32px, anclados a una esquina y sangrando fuera del lienzo.
4. Titular en Petróleo sobre el teal; texto secundario en blanco MAYÚSCULAS con letter-spacing amplio.
5. Logo institucional (PNUD) en versión blanca sobre teal; versión azul oficial solo sobre blanco.

## 5. Componentes (especificación)

- **Búsqueda**: input píldora blanco, borde 1.5px Línea fuerte, icono lupa a la izquierda, padding vertical 15px; focus = borde teal claro + halo `0 0 0 4px #EFF4F4`.
- **Filtros**: botones píldora blancos con icono teal a la izquierda y chevron; activo = fondo `#EFF4F4`, borde teal, texto Teal profundo; contador en píldora teal con texto blanco.
- **Cards de contenido**: fondo blanco, borde 1px Línea, radius 12–16px, sombra sm; hover = borde `#8FB6B1`, sombra md, elevación −1px. Estructura: tile de icono (soft + tint de su categoría) · título 16/700 petróleo · metadatos atenuados · tags abajo.
- **Tags**: píldora pequeña 11.5px/600; neutra = fondo Panel 2 + texto atenuado; destacada (PNUD) = fondo Naranja suave + texto Naranja oscuro.
- **Botones**: píldora; primario = fondo Teal profundo, texto blanco, hover Petróleo; secundario = blanco con borde y texto teal. CTA de máxima jerarquía (hero) = fondo Naranja, hover Naranja oscuro.
- **Selector de idioma (ES/EN)**: píldora contenedora blanca; opción activa = fondo Naranja, texto blanco.
- **Modal/ficha lateral**: panel blanco deslizante desde la derecha, 540px, sombra lg, overlay `rgba(12,30,55,.42)`; cabecera con tile de icono grande + eyebrow teal MAYÚSCULAS + título 22/700; secciones con h4 overline atenuado.
- **Tooltip**: fondo Petróleo, texto blanco, radius 7px; solo visible durante hover.
- **Leyenda de mapa**: tarjeta blanca flotante con swatches cuadrados 14px radius 3px.

## 6. Layout y espaciado

- Contenedor máximo 1320px centrado; padding lateral 30px (16px móvil).
- Grid principal asimétrico: columna fija ~392px (mapa/aside) + columna fluida (contenido).
- Separaciones: 12px entre cards · 22px entre bloques · 26px padding de paneles.
- Fondo de página blanco; la jerarquía se construye con borde + sombra, no con franjas de color.

## 7. Iconografía

- Iconos de línea (stroke 2px, esquinas redondeadas, sin relleno), 16–20px en UI.
- Cada categoría temática tiene icono semántico propio (brújula, personas, altavoz, escudo, monitor, generaciones) coloreado con su tint sobre su soft — no un icono genérico repetido.
- Banderas de país: rectángulo 21×15px, radius 2.5px, halo `0 0 0 1px rgba(20,35,61,.1)`.

## 8. Accesibilidad

- El Naranja `#E8622D` sobre blanco NO cumple AA en texto pequeño: usarlo solo en texto ≥19px bold, sobre fondos claros usar `#C74E1F`, o como fondo con texto blanco.
- Texto de cuerpo siempre ≥ `#33505A` sobre blanco; metadatos ≥ `#64818B`.
- Focus visible: anillo 2px Teal profundo (`outline-offset` 1–2px) solo en navegación por teclado (`:focus-visible`); nunca outline en clic de ratón.
- Todos los controles con área táctil ≥ 40px de alto.

## 9. Reglas rápidas (Do / Don't)

**Sí**: blanco generoso · píldoras en todo lo interactivo · teal como voz principal y naranja como exclamación puntual · neutros verdosos · sombras suaves con tinte petróleo · Mulish siempre.

**No**: grises fríos o negro puro · esquinas rectas en controles · naranja como color de fondo dominante o en texto pequeño · más de un CTA naranja por vista · degradados llamativos (solo el degradado sutil `#EEF5F4→#E3EDEC` en el contenedor del mapa) · mezclar otras familias tipográficas.

## 10. Tokens listos para copiar (CSS)

```css
:root {
  /* marca */
  --teal-900: #16333B; --teal-800: #223F4A; --teal-700: #2C5F63;
  --teal-600: #3E7F7C; --teal-500: #4A8D89; --teal-400: #6F9E99;
  --teal-300: #8FB6B1; --teal-200: #BFD8D3; --teal-100: #DDE9EA; --teal-50: #EFF4F4;
  --accent: #E8622D; --accent-dark: #C74E1F; --accent-soft: #FBE9E1;
  /* neutros */
  --ink: #223F4A; --text: #33505A; --muted: #64818B; --faint: #91A8AF;
  --line: #DFE9E8; --line-strong: #CBDCDA; --panel: #EFF4F4; --panel-2: #E4EDEC;
  /* dataviz */
  --map-alta: #24586A; --map-media: #7FADB3; --map-baja: #CFE0E3; --map-none: #E9F0EF;
  /* forma */
  --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 22px; --r-pill: 999px;
  --shadow-sm: 0 1px 2px rgba(24,48,55,.06), 0 1px 1px rgba(24,48,55,.04);
  --shadow-md: 0 6px 22px rgba(24,48,55,.10), 0 2px 6px rgba(24,48,55,.06);
  --shadow-lg: 0 24px 60px rgba(16,44,52,.20);
  /* tipografía */
  --sans: 'Mulish', system-ui, -apple-system, sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, monospace;
}
```

```html
<link href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
```

---

*Fuente viva: `v2/assets/styles.css`, `v2/assets/data.js` y `v2/portada.html` de este repositorio; referentes originales del cliente en `refentes/`.*
