# Banco de experiencias de gobernanza pública — PNUD ALC

Repositorio interactivo de **104 experiencias institucionales reales** de gobernanza
pública en América Latina y el Caribe, organizadas por seis aceleradores de gobernanza.
Pensado para publicarse como **mockup en línea (GitHub Pages)** para el cliente.

## Estructura

| Ruta | Qué es |
|------|--------|
| **`index.html`** | **Dashboard interactivo** (página principal del sitio). Buscador, filtros por país / dimensión / nivel / institución, mapa de cobertura y fichas detalladas con enlaces oficiales. |
| `informe-impreso/index.html` | **Página de informe imprimible (A4) en español.** Datos generales + mapa + barras + QR hacia el dashboard. **No está enlazada desde el dashboard** porque va dentro de un documento impreso → exportar a PDF con *Imprimir → Guardar como PDF*. |
| `informe-impreso/en/index.html` | **Versión en inglés** del informe imprimible. |
| `assets/` | Estilos, lógica (React vía CDN), datos y logos. |
| `assets/experiences.js` | **Datos reales** generados desde el Excel de la guía estratégica (54 vinculadas al PNUD + 50 adicionales). No editar a mano. |
| `tools/make-qr.py` | Regenera el QR del informe con la URL pública real. |
| `Soportes/` | Fuentes originales: mockup y Excel de casos. |
| `_legacy/` | Versiones anteriores del prototipo (datos sintéticos). No se publican. |

## Datos

Los datos provienen de `Soportes/Guia estrategica_ejemplos y experiencias.xlsx`
(hojas *Experiencias PNUD* y *Otras experiencias*). Para regenerarlos tras editar el Excel:

```bash
# (script de extracción incluido en el historial; ver tools/)
python tools/make-qr.py "https://dyoma-web.github.io/experiencias/"
```

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
