/* Banco de Experiencias — componentes de presentación (React + Babel), bilingüe ES/EN */

/* ---------- Contexto de idioma ---------- */
const I18N = React.createContext({ lang: 'es', setLang: () => {}, t: {}, B: null });
const useI18N = () => React.useContext(I18N);

/* ---------- Icon ---------- */
function Icon({ name, size = 20, className = '', style = {} }) {
  const raw = (window.ICONS && window.ICONS[name]) || '';
  const svg = raw.replace('<svg ', `<svg width="${size}" height="${size}" style="display:block" `);
  return <span className={'ic ' + className} style={{ display: 'inline-flex', lineHeight: 0, ...style }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

/* ---------- Flag image (renders reliably cross-platform) ---------- */
function Flag({ code, className = '' }) {
  if (!code) return null;
  const k = code.toLowerCase();
  const src = (window.__resources && window.__resources['flag_' + k]) || `https://flagcdn.com/w40/${k}.png`;
  return <img className={'flag-img ' + className} src={src} alt="" loading="lazy" />;
}

/* ---------- Brand mark (official PNUD logo) ---------- */
function PnudMark({ lg }) {
  return (
    <img
      className={'pnud-logo' + (lg ? ' lg' : '')}
      src="assets/pnud-logo-blue.svg"
      alt="PNUD · Programa de las Naciones Unidas para el Desarrollo"
    />
  );
}

/* ---------- Language switch ---------- */
function LangSwitch() {
  const { lang, setLang } = useI18N();
  return (
    <div className="lang-switch" role="group" aria-label="Idioma / Language">
      <button className={lang === 'es' ? 'on' : ''} aria-pressed={lang === 'es'} onClick={() => setLang('es')}>ES</button>
      <button className={lang === 'en' ? 'on' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
    </div>
  );
}

/* ---------- Multi-select dropdown ---------- */
function Dropdown({ icon, label, options, selected, onToggle, align = 'left' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);
  const n = selected.size;
  return (
    <div className="filter" ref={ref}>
      <button className={'filter-btn' + (n ? ' active' : '')} aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((o) => !o)}>
        {icon && <Icon name={icon} size={17} className="lead" />}
        <span>{label}</span>
        {n > 0 && <span className="count-pill">{n}</span>}
        <Icon name="chevron" size={16} className="chev" />
      </button>
      {open && (
        <div className="menu scroll" role="listbox" aria-multiselectable="true" style={align === 'right' ? { left: 'auto', right: 0 } : null}>
          {options.map((o) => {
            const sel = selected.has(o.value);
            return (
              <button key={o.value} role="option" aria-selected={sel} className={'menu-item' + (sel ? ' sel' : '')} onClick={() => onToggle(o.value)}>
                <span className="check">{sel && <Icon name="check" size={11} />}</span>
                {o.flagCode ? <Flag code={o.flagCode} /> : (o.flag && <span className="flag">{o.flag}</span>)}
                <span>{o.label}</span>
                {o.count != null && <span className="mi-count">{o.count}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* check icon (not in shared set) */
window.ICONS.check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>';

/* ---------- Real geographic map of LAC (Robinson projection) ---------- */
const INTENSITY_COLOR = { alta: 'var(--map-alta)', media: 'var(--map-media)', baja: 'var(--map-baja)', none: 'var(--map-none)' };

function GeoMap({ selected, onToggle, byCountry, intensity, interactive = true, minHeight = 400, showLegend = true }) {
  const { lang, t } = useI18N();
  const [zoom, setZoom] = React.useState(1);
  const [tip, setTip] = React.useState(null);
  const wrapRef = React.useRef(null);
  const G = window.GEO, B = window.BANCO;
  const [vx, vy, vw, vh] = G.viewBox.split(' ').map(Number);
  const zw = vw / zoom, zh = vh / zoom;
  const vb = `${vx + (vw - zw) / 2} ${vy + (vh - zh) / 2} ${zw} ${zh}`;
  const isData = (code) => !!B.cName[code];

  function move(e, code) {
    if (!interactive || !isData(code)) { setTip(null); return; }
    const r = wrapRef.current.getBoundingClientRect();
    const c = B.cName[code];
    setTip({ name: c.nombre[lang], count: byCountry[code] || 0, code, x: e.clientX - r.left, y: e.clientY - r.top });
  }

  return (
    <div className="geomap" ref={wrapRef} style={{ minHeight }}>
      {interactive && (
        <div className="map-zoom">
          <button onClick={() => setZoom((z) => Math.min(3.4, +(z + 0.45).toFixed(2)))} aria-label={t.zoomIn}><Icon name="plus" size={16} /></button>
          <button onClick={() => setZoom((z) => Math.max(1, +(z - 0.45).toFixed(2)))} aria-label={t.zoomOut}><Icon name="minus" size={16} /></button>
        </div>
      )}
      <svg viewBox={vb} className="geomap-svg" preserveAspectRatio="xMidYMid meet" onMouseLeave={() => setTip(null)} role="img" aria-label={t.mapTitle}>
        {G.context.map((code) => <path key={code} d={G.shapes[code]} className="geo-ctx" vectorEffect="non-scaling-stroke" />)}
        {G.lac.map((code) => {
          const data = isData(code);
          const inten = data ? intensity(code) : 'none';
          const sel = selected && selected.has(code);
          const name = data ? B.cName[code].nombre[lang] : '';
          return (
            <path key={code} d={G.shapes[code]}
              className={'geo-c' + (data ? '' : ' faint') + (sel ? ' sel' : '') + (data && interactive ? ' clk' : '')}
              style={{ fill: INTENSITY_COLOR[inten] }}
              vectorEffect="non-scaling-stroke"
              role={data && interactive ? 'button' : undefined}
              tabIndex={data && interactive ? 0 : undefined}
              aria-label={data ? `${name}: ${byCountry[code] || 0} ${(byCountry[code] === 1 ? t.expS : t.expP)}` : undefined}
              aria-pressed={data && interactive ? !!sel : undefined}
              onClick={() => interactive && data && onToggle(code)}
              onKeyDown={(e) => { if (interactive && data && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onToggle(code); } }}
              onMouseMove={(e) => move(e, code)} />
          );
        })}
      </svg>
      {tip && (
        <div className="geo-tip" style={{ left: tip.x, top: tip.y }}>
          <b><Flag code={tip.code} /> {tip.name}</b>
          <span>{tip.count} {tip.count === 1 ? t.expS : t.expP}</span>
        </div>
      )}
      {showLegend && (
        <div className="geo-legend">
          <div className="legend-row"><span className="legend-sw" style={{ background: 'var(--map-alta)' }} />{t.legAlta}</div>
          <div className="legend-row"><span className="legend-sw" style={{ background: 'var(--map-media)' }} />{t.legMedia}</div>
          <div className="legend-row"><span className="legend-sw" style={{ background: 'var(--map-baja)' }} />{t.legBaja}</div>
        </div>
      )}
    </div>
  );
}

/* ---------- Experience card ---------- */
function ExpCard({ exp, dim, onOpen }) {
  const { lang, t, B } = useI18N();
  const loc = exp[lang] || exp.es;
  return (
    <button className="exp-card" onClick={() => onOpen(exp)}>
      <span className="exp-ic" style={{ background: dim.soft, color: dim.tint }}>
        <Icon name={dim.icon} size={25} />
      </span>
      <span className="exp-body">
        <span className="exp-title">{loc.titulo}</span>
        <span className="exp-meta">
          <span className="dim">{dim.nombre[lang]}</span>
          <span className="dot" />
          <span>{B.nivelLabels[lang][exp.nivel]}</span>
        </span>
      </span>
      <span className="exp-right">
        <span className="exp-country"><Flag code={exp.pais} />{B.cName[exp.pais] ? B.cName[exp.pais].nombre[lang] : ''}</span>
        <span className="exp-inst">{loc.institucion}</span>
      </span>
    </button>
  );
}

/* ---------- Ficha (slide-over) ---------- */
function Ficha({ exp, dim, onClose }) {
  const { lang, t, B } = useI18N();
  const [mounted, setMounted] = React.useState(false);
  const panelRef = React.useRef(null);
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey);
    const tf = setTimeout(() => { const c = panelRef.current && panelRef.current.querySelector('.ficha-close'); if (c) c.focus(); }, 60);
    return () => { cancelAnimationFrame(raf); clearTimeout(tf); document.removeEventListener('keydown', onKey); };
  }, []);
  if (!exp) return null;
  const loc = exp[lang] || exp.es;
  return (
    <>
      <div className={'overlay' + (mounted ? ' open' : '')} onClick={onClose} />
      <aside ref={panelRef} className={'ficha' + (mounted ? ' open' : '')} role="dialog" aria-modal="true" aria-label={loc.titulo}>
        <div className="ficha-head">
          <span className="exp-ic" style={{ background: dim.soft, color: dim.tint }}><Icon name={dim.icon} size={28} /></span>
          <div>
            <div className="ficha-eyebrow">{dim.nombre[lang]}</div>
            <h2 className="ficha-title">{loc.titulo}</h2>
          </div>
          <button className="ficha-close" onClick={onClose} aria-label={t.close}><Icon name="close" size={18} /></button>
        </div>
        <div className="ficha-body scroll">
          <div className="ficha-grid">
            <div className="cell"><div className="l">{t.fhPais}</div><div className="v"><Flag code={exp.pais} className="big" />{loc.paisDetalle || (B.cName[exp.pais] && B.cName[exp.pais].nombre[lang])}</div></div>
            <div className="cell"><div className="l">{t.fhNivel}</div><div className="v" style={{ fontSize: 13.5 }}>{loc.nivelDetalle || B.nivelLabels[lang][exp.nivel]}</div></div>
            <div className="cell"><div className="l">{t.fhInst}</div><div className="v" style={{ fontSize: 13.5 }}>{loc.institucion}</div></div>
            <div className="cell"><div className="l">{t.fhAnio}</div><div className="v" style={{ fontSize: 13.5 }}>{loc.anioTexto || exp.anio}{exp.vinculadaPNUD && <span className="tag pnud" style={{ marginLeft: 6 }}>{t.pnudTag}</span>}</div></div>
          </div>

          <h4>{t.fhDesc}</h4>
          <p className="desc">{loc.resumen}</p>

          {loc.buenaPractica && (<>
            <h4>{t.fhBP}</h4>
            <p className="desc">{loc.buenaPractica}</p>
          </>)}

          {loc.actores && (<>
            <h4>{t.fhActores}</h4>
            <p className="desc">{loc.actores}</p>
          </>)}

          {loc.comentarios && (<>
            <h4>{t.fhComentarios}</h4>
            <p className="desc">{loc.comentarios}</p>
          </>)}

          {exp.fuentes && exp.fuentes.length > 0 && (<>
            <h4>{t.fhLinks}</h4>
            <div className="ficha-sources">
              {exp.fuentes.map((f, i) => (
                <a className="source-link" key={i} href={f.url} target="_blank" rel="noopener noreferrer">
                  <Icon name="link" size={17} />
                  <span>{(f.label && f.label[lang]) || f.label}</span>
                  <Icon name="external" size={15} className="ext" />
                </a>
              ))}
            </div>
          </>)}
        </div>
      </aside>
    </>
  );
}

Object.assign(window, { I18N, useI18N, Icon, Flag, PnudMark, LangSwitch, Dropdown, GeoMap, ExpCard, Ficha, INTENSITY_COLOR });
