# -*- coding: utf-8 -*-
"""Genera las versiones standalone (HTML autocontenidos) en standalone/.

Produce archivos que funcionan sin servidor ni conexión (doble clic):
  standalone/index.html                  — dashboard v1 (línea azul PNUD)
  standalone/informe-impreso[-en].html   — informes v1
  standalone/v2/index.html               — dashboard v2 (línea teal/naranja)
  standalone/v2/portada.html             — portada v2
  standalone/v2/informe-impreso[-en].html— informes v2

Cómo: parte de los HTML de desarrollo e inserta inline el CSS, los datos,
los scripts, React/ReactDOM (UMD producción), los JSX precompilados con
Babel (vía Node), y logos/QR/banderas como data-URIs. La única dependencia
externa restante son las fuentes de Google (si no hay red, caen a system-ui).

Requiere: Python 3, Node, y red la primera vez (descarga vendor a
tools/vendor/, que queda cacheado y no se versiona).

Uso:  python tools/build_standalone.py
"""
import base64
import json
import re
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VENDOR = Path(__file__).resolve().parent / 'vendor'
OUT_DIR = ROOT / 'standalone'

VENDOR_JS = {
    'react.js': 'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
    'react-dom.js': 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
    'babel.js': 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
}
FLAG_CODES = ['mx', 'gt', 'bz', 'sv', 'hn', 'ni', 'cr', 'pa', 'cu', 'do', 'ht', 'jm',
              'tt', 'co', 've', 'gy', 'ec', 'pe', 'bo', 'br', 'py', 'cl', 'ar', 'uy', 'un']

PAGES = [
    # (html de desarrollo, salida bajo standalone/)
    ('index.html', 'index.html'),
    ('informe-impreso/index.html', 'informe-impreso.html'),
    ('informe-impreso/en/index.html', 'informe-impreso-en.html'),
    ('v2/index.html', 'v2/index.html'),
    ('v2/portada.html', 'v2/portada.html'),
    ('v2/informe-impreso/index.html', 'v2/informe-impreso.html'),
    ('v2/informe-impreso/en/index.html', 'v2/informe-impreso-en.html'),
]


def fetch(url, dest):
    if dest.exists() and dest.stat().st_size > 0:
        return
    print(f'  descargando {url}')
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    dest.write_bytes(urllib.request.urlopen(req, timeout=60).read())


def ensure_vendor():
    VENDOR.mkdir(exist_ok=True)
    (VENDOR / 'flags').mkdir(exist_ok=True)
    for name, url in VENDOR_JS.items():
        fetch(url, VENDOR / name)
    for code in FLAG_CODES:
        fetch(f'https://flagcdn.com/w40/{code}.png', VENDOR / 'flags' / f'{code}.png')


def js_inline(code):
    # evita cerrar el <script> contenedor si el JS contiene "</script" en strings
    return code.replace('</script', '<\\/script')


def data_uri(path):
    mime = 'image/svg+xml' if path.suffix == '.svg' else 'image/png'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()


def compile_jsx(path):
    """Compila un .jsx a JS plano con @babel/standalone vía Node."""
    runner = (
        "const fs=require('fs');"
        f"const Babel=require({json.dumps(str(VENDOR / 'babel.js'))});"
        f"const src=fs.readFileSync({json.dumps(str(path))},'utf8');"
        "const out=Babel.transform(src,{presets:[['env',{modules:false}],'react']}).code;"
        "process.stdout.write(out);"
    )
    r = subprocess.run(['node', '-e', runner], capture_output=True, encoding='utf-8')
    if r.returncode != 0:
        raise SystemExit(f'Babel falló con {path.name}:\n{r.stderr}')
    return r.stdout


def resources_script(base):
    """window.__resources para logo y banderas (usado por Flag y PnudMark)."""
    res = {'pnud_logo': data_uri(ROOT / 'assets' / 'pnud-logo-blue.svg')}
    for code in FLAG_CODES:
        res[f'flag_{code}'] = data_uri(VENDOR / 'flags' / f'{code}.png')
    return 'window.__resources = ' + json.dumps(res) + ';'


def build_page(src_rel, out_rel):
    src = ROOT / src_rel
    base = src.parent
    html = src.read_text(encoding='utf-8')
    uses_react = 'unpkg.com/react' in html

    # hojas de estilo locales → <style> inline
    def repl_css(m):
        href = m.group(1)
        if href.startswith('http'):
            return m.group(0)
        css = (base / href).resolve().read_text(encoding='utf-8')
        return '<style>\n' + css + '\n</style>'
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)" />', repl_css, html)

    # imágenes y favicon locales (svg/png) → data-URI
    def repl_img(m):
        attr, p = m.group(1), m.group(2)
        if p.startswith(('http', 'data:')):
            return m.group(0)
        return f'{attr}="{data_uri((base / p).resolve())}"'
    html = re.sub(r'(href|src)="([^"]+\.(?:svg|png))"', repl_img, html)

    if uses_react:
        react = js_inline((VENDOR / 'react.js').read_text(encoding='utf-8'))
        react_dom = js_inline((VENDOR / 'react-dom.js').read_text(encoding='utf-8'))
        html = re.sub(r'<script src="https://unpkg\.com/react@[^"]+"[^>]*></script>',
                      lambda m: '<script>\n' + react + '\n</script>', html)
        html = re.sub(r'<script src="https://unpkg\.com/react-dom@[^"]+"[^>]*></script>',
                      lambda m: '<script>\n' + react_dom + '\n</script>\n  <script>\n' + resources_script(base) + '\n</script>', html)
        html = re.sub(r'\s*<script src="https://unpkg\.com/@babel/[^"]+"[^>]*></script>', '', html)

    # scripts locales → inline (compilando los .jsx)
    def repl_script(m):
        p = m.group(1)
        f = (base / p).resolve()
        code = compile_jsx(f) if f.suffix == '.jsx' else f.read_text(encoding='utf-8')
        return '<script>\n' + js_inline(code) + '\n</script>'
    html = re.sub(r'<script(?: type="text/babel")? src="((?!https?://)[^"]+)"></script>', repl_script, html)

    assert not re.search(r'(?:src|href)="(?!https?://|data:|#)[^"]*\.(?:js|jsx|css|svg|png)"', html), \
        f'quedaron referencias locales en {out_rel}'
    assert 'unpkg.com' not in html, f'queda CDN en {out_rel}'

    out = OUT_DIR / out_rel
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding='utf-8', newline='\n')
    print(f'OK → standalone/{out_rel} ({len(html) // 1024} KB)')


if __name__ == '__main__':
    ensure_vendor()
    OUT_DIR.mkdir(exist_ok=True)
    for src_rel, out_rel in PAGES:
        build_page(src_rel, out_rel)
    print('Standalone regenerado. Recuerda re-ejecutar este script tras cambios en el desarrollo.')
