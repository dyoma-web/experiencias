# -*- coding: utf-8 -*-
"""Genera la versión standalone (HTML autocontenidos) en standalone/.

Produce tres archivos que funcionan sin servidor ni conexión (doble clic):
  standalone/index.html               — dashboard interactivo
  standalone/informe-impreso.html     — informe imprimible ES
  standalone/informe-impreso-en.html  — informe imprimible EN

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
import sys
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
    p = ROOT / 'assets' / path
    mime = 'image/svg+xml' if p.suffix == '.svg' else 'image/png'
    return f'data:{mime};base64,' + base64.b64encode(p.read_bytes()).decode()


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


def resources_script():
    res = {'pnud_logo': data_uri('pnud-logo-blue.svg')}
    for code in FLAG_CODES:
        b = (VENDOR / 'flags' / f'{code}.png').read_bytes()
        res[f'flag_{code}'] = 'data:image/png;base64,' + base64.b64encode(b).decode()
    return 'window.__resources = ' + json.dumps(res) + ';'


def inline_tag(kind, content):
    if kind == 'style':
        return '<style>\n' + content + '\n</style>'
    return '<script>\n' + js_inline(content) + '\n</script>'


def build_dashboard():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    css = (ROOT / 'assets' / 'styles.css').read_text(encoding='utf-8')

    html = re.sub(r'<link rel="stylesheet" href="assets/styles\.css" />', lambda m: inline_tag('style', css), html)
    html = html.replace('href="assets/pnud-logo-blue.svg"', f'href="{data_uri("pnud-logo-blue.svg")}"')

    # CDN → vendor inline (React producción; Babel ya no hace falta en el navegador)
    react = js_inline((VENDOR / 'react.js').read_text(encoding='utf-8'))
    react_dom = js_inline((VENDOR / 'react-dom.js').read_text(encoding='utf-8'))
    html = re.sub(r'<script src="https://unpkg\.com/react@[^"]+"[^>]*></script>',
                  lambda m: '<script>\n' + react + '\n</script>', html)
    html = re.sub(r'<script src="https://unpkg\.com/react-dom@[^"]+"[^>]*></script>',
                  lambda m: '<script>\n' + react_dom + '\n</script>\n  <script>\n' + resources_script() + '\n</script>', html)
    html = re.sub(r'\s*<script src="https://unpkg\.com/@babel/[^"]+"[^>]*></script>', '', html)

    def repl_asset(m):
        name = m.group(1)
        p = ROOT / 'assets' / name
        code = compile_jsx(p) if p.suffix == '.jsx' else p.read_text(encoding='utf-8')
        return inline_tag('script', code)

    html = re.sub(r'<script(?: type="text/babel")? src="assets/([^"]+)"></script>', repl_asset, html)

    assert 'src="assets/' not in html and 'unpkg.com' not in html, 'quedaron referencias externas en el dashboard'
    (OUT_DIR / 'index.html').write_text(html, encoding='utf-8', newline='\n')
    print(f'OK → standalone/index.html ({len(html) // 1024} KB)')


def build_informe(src_rel, out_name, depth):
    html = (ROOT / src_rel).read_text(encoding='utf-8')
    pre = '../' * depth
    css = (ROOT / 'assets' / 'styles.css').read_text(encoding='utf-8')
    html = html.replace(f'<link rel="stylesheet" href="{pre}assets/styles.css" />', inline_tag('style', css))
    for img in ('pnud-logo-blue.svg', 'qr-dashboard.svg'):
        html = html.replace(f'{pre}assets/{img}', data_uri(img))

    def repl_asset(m):
        code = (ROOT / 'assets' / m.group(1)).read_text(encoding='utf-8')
        return inline_tag('script', code)

    html = re.sub(r'<script src="' + re.escape(pre) + r'assets/([^"]+)"></script>', repl_asset, html)

    assert not re.search(r'(?:src|href)="[^"]*assets/', html), f'quedaron referencias externas en {out_name}'
    (OUT_DIR / out_name).write_text(html, encoding='utf-8', newline='\n')
    print(f'OK → standalone/{out_name} ({len(html) // 1024} KB)')


if __name__ == '__main__':
    ensure_vendor()
    OUT_DIR.mkdir(exist_ok=True)
    build_dashboard()
    build_informe('informe-impreso/index.html', 'informe-impreso.html', 1)
    build_informe('informe-impreso/en/index.html', 'informe-impreso-en.html', 2)
    print('Standalone regenerado. Recuerda re-ejecutar este script tras cambios en el desarrollo.')
