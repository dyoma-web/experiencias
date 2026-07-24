# Banco de experiencias de gobernanza pública — PNUD ALC

Repositorio interactivo de **149 experiencias institucionales reales** de gobernanza
pública en América Latina y el Caribe, organizadas por seis aceleradores de gobernanza.
Pensado para publicarse como **mockup en línea (GitHub Pages)** para el cliente.

## Estructura

| Ruta | Qué es |
|------|--------|
| **`index.html`** | **Dashboard interactivo** (página principal del sitio). Buscador, filtros por país / dimensión / nivel / institución, mapa de cobertura y fichas detalladas con enlaces oficiales. |
| `informe-impreso/index.html` | **Página de informe imprimible (A4) en español.** Datos generales + mapa + barras + QR hacia el dashboard. **No está enlazada desde el dashboard** porque va dentro de un documento impreso → exportar a PDF con *Imprimir → Guardar como PDF*. |
| `informe-impreso/en/index.html` | **Versión en inglés** del informe imprimible. |
| `assets/` | Estilos, lógica (React vía CDN), datos y logos. |
| `assets/experiences.js` | **Datos reales** generados desde el Excel fuente (99 vinculadas al PNUD + 50 adicionales). No editar a mano. |
| `tools/xlsx_to_experiences.py` | Regenera `assets/experiences.js` desde el Excel (preserva ids y traducciones EN existentes). |
| `tools/make-qr.py` | Regenera el QR del informe con la URL pública real. |
| `Soportes/` | Fuentes originales: mockup y Excel de casos. |
| `_legacy/` | Versiones anteriores del prototipo (datos sintéticos). No se publican. |

## Datos

Los datos provienen de `Soportes/EXPERIENCIAS PNUD Y OTRAS FUENTES - ALC- 22-06-26.xlsx`
(hojas *Experiencias PNUD* y *Otras experiencias*). Para regenerarlos tras editar el Excel:

```bash
python tools/xlsx_to_experiences.py "Soportes/EXPERIENCIAS PNUD Y OTRAS FUENTES - ALC- 22-06-26.xlsx"
```

El script casa cada fila contra las entradas existentes (por país + dimensión + título)
para preservar `id` y el bloque `en`; las entradas nuevas toman su traducción EN de
`tools/en_new.json` y los "Comentarios adicionales" de `tools/comentarios_en.json`.
La versión anterior del Excel (`Soportes/Guia estrategica_ejemplos y experiencias.xlsx`,
base de los ids 1–104) se conserva como referencia.

## Publicar en GitHub Pages

1. Subir el contenido de esta carpeta a un repositorio.
2. *Settings → Pages → Deploy from branch* (rama `main`, carpeta `/root`).
3. La URL pública servirá `index.html` (el dashboard).
4. Regenerar el QR con esa URL: `python tools/make-qr.py "<URL>"` y actualizar el texto
   de la URL en `informe-impreso/index.html`.

## Notas técnicas

- Sitio **100 % estático** (sin backend). React + Babel se cargan por CDN, por lo que
  funciona directamente en GitHub Pages sin paso de build.
- Marca: logo **oficial del PNUD** (`assets/pnud-logo-blue.svg`).
