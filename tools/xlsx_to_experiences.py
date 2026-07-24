# -*- coding: utf-8 -*-
"""Regenera assets/experiences.js desde el Excel fuente (bilingüe ES/EN).

Pipeline:
  1. Lee las hojas "Experiencias PNUD" y "Otras experiencias" del Excel.
  2. Casa cada fila contra las entradas ya existentes en assets/experiences.js
     por clave (país ISO2, dimensionId, vinculadaPNUD, título normalizado) para
     preservar `id` y el bloque `en` ya traducido. Filas sin match reciben ids
     nuevos (max_id+1 en adelante, en orden de aparición en el Excel).
  3. Los bloques EN de entradas nuevas y las traducciones EN de la columna
     "Comentarios adicionales" se leen de tools/en_new.json y
     tools/comentarios_en.json (mantenidos junto a este script).
  4. Emite assets/experiences.js (una línea JSON, UTF-8 sin BOM).

Uso:
  python tools/xlsx_to_experiences.py "Soportes/EXPERIENCIAS PNUD Y OTRAS FUENTES - ALC- 22-06-26.xlsx"
  python tools/xlsx_to_experiences.py <excel> --dump-pending <dir>   # exporta ES pendiente de traducir
"""
import json
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import urlparse

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'experiences.js'
EN_NEW = Path(__file__).resolve().parent / 'en_new.json'
COMENT_EN = Path(__file__).resolve().parent / 'comentarios_en.json'

HEADER = '/* GENERADO (bilingue ES/EN) desde el Excel de la guia estrategica — NO editar a mano */'

DIM = {'1': 'anticipatoria', '2': 'colaborativa', '3': 'comunicacional',
       '4': 'integra', '5': 'digital', '6': 'intergeneracional'}

PAIS = {'mexico': 'MX', 'guatemala': 'GT', 'belice': 'BZ', 'el salvador': 'SV',
        'honduras': 'HN', 'nicaragua': 'NI', 'costa rica': 'CR', 'panama': 'PA',
        'cuba': 'CU', 'rep dominicana': 'DO', 'republica dominicana': 'DO',
        'haiti': 'HT', 'jamaica': 'JM', 'trinidad y tobago': 'TT', 'colombia': 'CO',
        'venezuela': 'VE', 'guyana': 'GY', 'ecuador': 'EC', 'peru': 'PE',
        'bolivia': 'BO', 'brasil': 'BR', 'paraguay': 'PY', 'chile': 'CL',
        'argentina': 'AR', 'uruguay': 'UY', 'regional': 'UN'}


def clean(s):
    if s is None:
        return ''
    s = str(s).replace('​', '').replace('\xa0', ' ')
    s = re.sub(r'\s+', ' ', s).strip()
    return '' if s == '0' else s


def norm(s):
    s = unicodedata.normalize('NFKD', clean(s))
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]+', ' ', s.lower()).strip()


def pais_id(raw):
    code = PAIS.get(norm(re.sub(r'\(.*?\)', ' ', raw)))
    if code is None:
        raise ValueError(f'País no mapeado: {raw!r}')
    return code


def dim_id(raw):
    m = re.match(r'\s*(\d)\s*\.\s*-?', raw)
    if not m or m.group(1) not in DIM:
        raise ValueError(f'Dimensión no mapeada: {raw!r}')
    return DIM[m.group(1)]


def nivel_canonico(raw):
    n = norm(raw)
    if n.startswith('nacional') or n.startswith('binacional') or n.startswith('global'):
        return 'Nacional'
    if n.startswith(('regional', 'subnacional', 'departamental', 'estadual')):
        return 'Subnacional'
    return 'Local'


def parse_anio(texto):
    years = [int(y) for y in re.findall(r'(?:19|20)\d{2}', texto)]
    if not years:
        raise ValueError(f'Sin año parseable: {texto!r}')
    return max(years)


def parse_fuentes(texto):
    urls = re.findall(r'https?://[^\s;,)​]+', texto)
    fuentes = []
    for u in urls:
        u = u.rstrip('.,;')
        host = urlparse(u).netloc.lower().replace('www.', '')
        if host.endswith('undp.org'):
            label = {'es': 'Sitio del PNUD', 'en': 'UNDP website'}
        else:
            label = {'es': host, 'en': host}
        fuentes.append({'label': label, 'url': u})
    return fuentes


def read_excel(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    rows = []
    for sheet, pnud in (('Experiencias PNUD', True), ('Otras experiencias', False)):
        ws = wb[sheet]
        for r in ws.iter_rows(min_row=3, max_col=11, values_only=True):
            vals = [clean(v) for v in r]
            if not vals[1] and not vals[4]:  # sin país ni título → fila de formato
                continue
            rows.append({'pnud': pnud, 'cols': vals})
    return rows


def read_existing():
    src = OUT.read_text(encoding='utf-8')
    m = re.search(r'window\.EXPERIENCES_RAW\s*=\s*(\[.*\]);', src, re.S)
    return json.loads(m.group(1)) if m else []


def build(excel_path, dump_pending=None):
    rows = read_excel(excel_path)
    existing = read_existing()
    en_new = json.loads(EN_NEW.read_text(encoding='utf-8')) if EN_NEW.exists() else {}
    coment_en = json.loads(COMENT_EN.read_text(encoding='utf-8')) if COMENT_EN.exists() else {}

    ex_by_key = {}
    for e in existing:
        k = (e['pais'], e['dimensionId'], e['vinculadaPNUD'], norm(e['es']['titulo'])[:60])
        ex_by_key.setdefault(k, []).append(e)

    next_id = max((e['id'] for e in existing), default=0) + 1
    out, pending_en, pending_com = [], {}, {}

    for row in rows:
        c = row['cols']
        pais, dim = pais_id(c[1]), dim_id(c[0])
        titulo = clean(c[4])
        comentario = clean(c[10])
        es = {
            'titulo': titulo, 'resumen': clean(c[5]), 'buenaPractica': clean(c[6]),
            'actores': clean(c[8]), 'nivelDetalle': clean(c[3]), 'anioTexto': clean(c[7]),
            'paisDetalle': clean(c[1]), 'institucion': clean(c[2]),
        }
        if comentario:
            es['comentarios'] = comentario

        key = (pais, dim, row['pnud'], norm(titulo)[:60])
        prev = ex_by_key[key].pop(0) if ex_by_key.get(key) else None

        if prev:
            entry = dict(prev)
            # el contenido ES del Excel manda; conservar id, en y fuentes curadas
            entry['es'] = {**prev['es'], **es}
            en = dict(prev['en'])
        else:
            entry = {
                'id': next_id, 'dimensionId': dim, 'pais': pais,
                'nivel': nivel_canonico(c[3]), 'anio': parse_anio(c[7]),
                'vinculadaPNUD': row['pnud'], 'destacada': False,
                'fuentes': parse_fuentes(c[9]),
            }
            next_id += 1
            en = en_new.get(str(entry['id']))
            if en is None:
                pending_en[entry['id']] = es
                en = {}
            en = dict(en)

        if comentario:
            trad = coment_en.get(str(entry['id'])) or en.get('comentarios')
            if trad:
                en['comentarios'] = trad
            elif entry['id'] not in pending_en:
                pending_com[entry['id']] = comentario
        else:
            en.pop('comentarios', None)

        entry['es'], entry['en'] = es, en
        entry['destacada'] = False  # data.js lo recalcula en runtime
        out.append(entry)

    sobrantes = [e['id'] for lst in ex_by_key.values() for e in lst]
    if sobrantes:
        raise SystemExit(f'ERROR: entradas existentes sin fila en el Excel: {sobrantes}')

    out.sort(key=lambda e: e['id'])

    if dump_pending is not None:
        d = Path(dump_pending)
        d.mkdir(parents=True, exist_ok=True)
        (d / 'pending_en.json').write_text(json.dumps(pending_en, ensure_ascii=False, indent=1), encoding='utf-8')
        (d / 'pending_comentarios.json').write_text(json.dumps(pending_com, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f'Pendientes de traducción: {len(pending_en)} entradas nuevas, {len(pending_com)} comentarios → {d}')
        return

    if pending_en or pending_com:
        raise SystemExit(f'ERROR: faltan traducciones EN — entradas {sorted(pending_en)} / comentarios {sorted(pending_com)}. '
                         'Completa tools/en_new.json y tools/comentarios_en.json (o usa --dump-pending).')

    body = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
    OUT.write_text(HEADER + '\nwindow.EXPERIENCES_RAW = ' + body + ';\n', encoding='utf-8', newline='\n')

    pnud = sum(1 for e in out if e['vinculadaPNUD'])
    print(f'OK → {OUT}  total={len(out)} vinculadas={pnud} adicionales={len(out) - pnud}')


if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        raise SystemExit(__doc__)
    excel = args[0]
    dump = args[args.index('--dump-pending') + 1] if '--dump-pending' in args else None
    build(excel, dump)
