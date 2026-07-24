# HANDOFF — Actualización de datos del Banco de Experiencias (Excel 22-06-26)

> Documento de contexto para Claude. Generado 2026-07-24. Optimizado para retomar el trabajo
> sin re-explorar el filesystem. Leer completo antes de tocar código.
> Memoria persistente relacionada: `C:\Users\david\.claude\projects\c--wamp-3-www\memory\banco-experiencias-pnud.md`

## 1. TAREA PENDIENTE (objetivo)

Integrar la nueva versión de la fuente de datos
`C:\wamp_3\www\EXPERIENCIAS PNUD Y OTRAS FUENTES - ALC- 22-06-26.xlsx`
al producto de esta carpeta (`C:\wamp_3\www\Exp`), regenerando `assets/experiences.js`.
El usuario (david.yomayusa@innovahub.org) aún NO ha dado la orden de ejecutar; al retomar,
confirmar si procede o si solo se continúa el análisis.

## 2. PRODUCTO (esta carpeta)

- **Qué es**: "Banco de experiencias de gobernanza pública — PNUD ALC". Sitio 100% estático,
  bilingüe ES/EN, React+Babel por CDN (sin build). Target: GitHub Pages
  `https://dyoma-web.github.io/experiencias/`. Última modificación relevante: 2026-06-03.
- **Flujo de datos**: Excel fuente (ES + en-US) → script de extracción → `assets/experiences.js`
  (`window.EXPERIENCES_RAW`) → `assets/data.js` construye `window.BANCO` con agregados
  **calculados en runtime**.
- **CRÍTICO — conteos dinámicos**: KPIs del dashboard (`data.js:74-80` → `stats`) y del informe
  imprimible (`assets/report.js:16-19`) se derivan de `BANCO.stats`. Regenerar experiences.js
  actualiza TODO automáticamente. Únicos números hardcodeados: `README.md` líneas 3 y 15
  ("104 experiencias", "54 + 50") → actualizar a mano tras regenerar.
- **Informe imprimible**: `informe-impreso/index.html` (ES) y `informe-impreso/en/index.html` (EN);
  ambos cargan `../assets/experiences.js` y `../../assets/experiences.js` respectivamente.
- `_legacy/` = prototipos con datos sintéticos, no tocar, no publicar.
- Producto hermano ANTERIOR y distinto (no confundir): `C:\wamp_3\www\secure\desarrollo\dashboard-experiencias`
  (feb 2026). Copias zip en `C:\Users\david\Downloads\banco experiencias PNUD*.zip`.
- Propuesta comercial relacionada: `C:\Users\david\Downloads\Propuesta PNUD` (UNDP-COL-03053).

## 3. ESQUEMA DE `assets/experiences.js` (respetar al regenerar)

Archivo UTF-8, ~170 KB, primera línea:
`/* GENERADO (bilingue ES/EN) desde el Excel de la guia estrategica — NO editar a mano */`
seguida de `window.EXPERIENCES_RAW = [ ... ];` (JSON en una línea).

Cada entrada:
```json
{
  "id": 1,                          // secuencial estable; NO renumerar los 104 existentes, append nuevos
  "dimensionId": "anticipatoria",   // ver mapping §5
  "pais": "BO",                     // ISO2, debe existir en countries de data.js:26-39
  "nivel": "Subnacional",           // canónico: Nacional | Subnacional | Local (data.js:18)
  "anio": 2026,                     // int, para ordenar; derivar del texto de periodo
  "vinculadaPNUD": true,            // hoja "Experiencias PNUD"=true, "Otras experiencias"=false
  "destacada": false,               // dejar false; data.js:49-52 lo recalcula en runtime
  "fuentes": [{"label": {"es": "Sitio del PNUD", "en": "UNDP website"}, "url": "https://..."}],
  "es": {"titulo": "...", "resumen": "...", "buenaPractica": "...", "actores": "...",
          "nivelDetalle": "...", "anioTexto": "...", "paisDetalle": "...", "institucion": "..."},
  "en": { /* mismos campos traducidos */ }
}
```

## 4. EL EXCEL NUEVO vs EL VIEJO

| Fuente | Hoja PNUD | Hoja Otras | Total |
|---|---|---|---|
| `Soportes/Guia estrategica_ejemplos y experiencias.xlsx` (base actual del producto) | 54 | 50 | 104 |
| `C:\wamp_3\www\EXPERIENCIAS PNUD Y OTRAS FUENTES - ALC- 22-06-26.xlsx` (NUEVO) | 99 | 50 | **149** |

- **+45 experiencias, todas en hoja "Experiencias PNUD"; hoja "Otras" sin cambios; nada eliminado.**
- Estructura de ambos: fila 1 = título decorativo, fila 2 = headers, datos desde fila 3.
  Columnas A-J iguales al viejo: DIMENSIÓN-ACELERADOR | País | Institución | Nivel de gobierno |
  Nombre experiencia | Breve descripción | Buena práctica | Año o período | Actores | Links.
- **Columna K NUEVA en ambas hojas: "Comentarios adicionales"** (el viejo no la tenía).
  Decisión pendiente del usuario: ¿incluirla en la ficha? Si sí → nuevo campo (p.ej. `comentarios`)
  en es/en + label `fhComentarios` en `data.js` strings (es/en) + render en `components.jsx` (ficha).
- Hay una columna basura "Columna1" (L) — ignorar. Hoja PNUD tiene dims fantasma hasta XEZ (celdas
  vacías con formato) — iterar con `max_col=11` y filtrar filas sin país+título (col B y E).
- El Excel nuevo es SOLO ESPAÑOL. El pipeline original usaba también
  `Soportes/Guia estrategica_ejemplos y experiencias en-US.xlsx`. **No existe versión en-US del
  nuevo** → los 45 nuevos requieren traducción EN durante la generación (yo la hago) o pedir
  el en-US al usuario. Los 104 existentes ya tienen EN en experiences.js → reutilizar, no retraducir.
- **El script de extracción original NO está en el repo** (README línea 26: "incluido en el
  historial" = perdido). Hay que reescribirlo. Sugerencia: crearlo en `tools/xlsx_to_experiences.py`
  y dejarlo versionado esta vez.
- Análisis diff completo ejecutado con: scratchpad `analiza_exp.py` (sesión edb4ad3d; regenerable
  trivialmente con openpyxl, disponible en el python del sistema).

## 5. MAPPINGS Y NORMALIZACIONES OBLIGATORIAS

Dimensión (col A → dimensionId):
```
1.- GOBERNANZA ANTICIPATORIA        → anticipatoria
2.- GOBERNANZA COLABORATIVA         → colaborativa
3.- GOBERNANZA COMUNICACIONAL       → comunicacional
4.- GOBERNANZA ÍNTEGRA              → integra
5.- GOBERNANZA DIGITAL              → digital
6.- GOBERNANZA INTERGENERACIONAL    → intergeneracional   # OJO: 4 filas usan "6. - " (espacio extra) → normalizar con regex ^\s*6\s*\.\s*-\s*
```

Suciedad detectada en col País del nuevo (normalizar antes de mapear a ISO2):

| Valor en Excel | ISO2 |
|---|---|
| `Rep. Dominicana ` (con espacio final) y `República Dominicana` | DO |
| `México (CDMX)`, `México (Guanajuato)` | MX (mover el paréntesis a `paisDetalle`/`nivelDetalle`) |
| `Argentina (CABA)` | AR (ídem) |
| `Regional` (1 fila: "JUSTINA – Asistente Inteligente para Justicia y Seguridad") | SIN ISO2 — **decisión pendiente**: data.js no tiene código regional; opciones: (a) excluir del mapa pero incluir en cards con pais especial, (b) pedir al usuario país ancla. El mapa (`byCountry`, data.js:61-64) ignora códigos desconocidos sin romper, pero `flag` quedaría vacío y el filtro País no la mostraría. |

Otros defectos de datos a limpiar en generación:
- Títulos con saltos de línea y zero-width space (U+200B): p.ej. "Proyecto Promoción del Diálogo y\nConsolidación del Acuerdo Nacional\u200b" → colapsar whitespace, strip U+200B.
- "Pontes para Convergências" (Brasil) aparece 2 veces en el diff → verificar si son dimensiones distintas (legítimo, decisión de mantener ambas) o duplicado real.
- `anio`: parsear del texto libre de col H ("Enero–febrero 2026", "2022 – vigente") → tomar el año MÁS RECIENTE mencionado, igual que hace el dataset actual (verificable comparando anioTexto vs anio en entradas existentes).
- Trims generales; celdas None → cadena vacía.

Distribución esperada tras integrar (para validar el resultado):
países=22 crudos → ~19-20 ISO2 tras normalizar; por dimensión (crudo, ya sumadas las variantes "6.-"):
digital 39, colaborativa 33, comunicacional 26, anticipatoria 21, integra 18, intergeneracional 12.
`stats` esperado: total=149, vinculadas=99, adicionales=50.

## 6. PLAN DE EJECUCIÓN (cuando el usuario apruebe)

1. Resolver las 3 decisiones pendientes con el usuario (o decidir por defecto si autoriza):
   (a) columna "Comentarios adicionales" ¿se muestra? (b) fila "Regional" ¿cómo se trata?
   (c) traducción EN de los 45 nuevos ¿la genero yo o llega en-US oficial?
2. Copiar el Excel nuevo a `Soportes/` (conservar el viejo; es la base de los IDs 1-104).
3. Escribir `tools/xlsx_to_experiences.py`: lee ambas hojas del nuevo, aplica §5, casa filas
   contra los 104 existentes por clave (país normalizado + título normalizado) para preservar
   `id` y bloque `en` existente; asigna ids 105+ a los nuevos; emite experiences.js con el
   mismo header y formato (una línea, ensure_ascii=False, UTF-8 sin BOM).
4. Regenerar, luego validar: (a) `python -c` conteos sobre EXPERIENCES_RAW == §5;
   (b) abrir dashboard local (WAMP sirve C:\wamp_3\www → http://localhost/Exp/) y ver KPIs=149/99/50,
   mapa, filtros, fichas nuevas; (c) informe-impreso ES y EN.
5. Actualizar README.md (104→149, 54→99) y este handoff (marcar hecho).
6. QR/URL no cambian — no regenerar salvo cambio de URL de publicación.
7. Si se publica: push a repo GitHub Pages (ver README §Publicar).

## 7. ESTADO — COMPLETADO 2026-07-24

- [x] Fuente nueva localizada y analizada; diff completo (45 altas, 0 bajas)
- [x] Carpeta de producto confirmada: `C:\wamp_3\www\Exp`
- [x] Pipeline y esquema documentados (este archivo)
- [x] Decisiones §6.1 (defaults autorizados por el usuario con "haz los ajustes necesarios"):
  - (a) "Comentarios adicionales" SÍ se incluye: campo `comentarios` en es/en (solo si hay texto;
    '0' se trata como vacío), label `fhComentarios`, render en la ficha tras Actores.
  - (b) Fila "Regional" (JUSTINA): pseudo-país `UN` ("Regional (ALC)" / "Regional (LAC)", bandera ONU
    vía flagcdn `un.png`). Aparece en cards y filtro País; excluida del conteo `stats.paises`
    y sin geografía en el mapa.
  - (c) Traducción EN de los 45 nuevos + comentarios generada por Claude
    (versionada en `tools/en_new.json` y `tools/comentarios_en.json`).
- [x] Script de extracción reescrito y versionado: `tools/xlsx_to_experiences.py`.
  Clave de matching final: (país ISO2, dimensionId, vinculadaPNUD, título normalizado[:60]) —
  el título solo no basta (hay títulos repetidos legítimos entre dimensiones y hojas).
  Los 2 "Pontes para Convergências" son legítimos (colaborativa + intergeneracional, descripciones distintas).
  Contenido ES de las 104 existentes: 0 diffs vs el Excel nuevo → bloques EN reutilizados tal cual.
- [x] experiences.js regenerado y validado (total=149, vinculadas=99, adicionales=50; ids 1-104 preservados, nuevos 105-149)
- [x] README actualizado (149, 99+50, pipeline documentado); Excel copiado a `Soportes/`
