#!/usr/bin/env python
"""Genera el código QR del informe imprimible apuntando al dashboard público.

Uso:
    python tools/make-qr.py "https://TU-ORG.github.io/TU-REPO/"

Si no se pasa URL, usa la PLACEHOLDER de abajo. Reemplázala por la URL real
de GitHub Pages cuando la tengas y vuelve a ejecutar el script.
"""
import sys, segno

PLACEHOLDER = "https://dyoma-web.github.io/experiencias/"  # URL pública (GitHub Pages)

url = sys.argv[1] if len(sys.argv) > 1 else PLACEHOLDER
qr = segno.make(url, error="m")
out = "assets/qr-dashboard.svg"
qr.save(out, kind="svg", scale=1, border=2, dark="#14233d", light=None)
print(f"QR generado -> {out}\nURL codificada: {url}")
if url == PLACEHOLDER:
    print("AVISO: estás usando la URL placeholder. Edita PLACEHOLDER o pasa la URL real.")
