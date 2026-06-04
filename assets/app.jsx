/* Banco de Experiencias — app principal (bilingüe ES/EN) */
function App() {
  const B = window.BANCO;
  const dimById = React.useMemo(() => { const m = {}; B.dimensions.forEach((d) => (m[d.id] = d)); return m; }, []);

  const [lang, setLangState] = React.useState(() => {
    try { const s = localStorage.getItem('banco-lang'); if (s === 'es' || s === 'en') return s; } catch (e) {}
    return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  });
  const setLang = (l) => { setLangState(l); try { localStorage.setItem('banco-lang', l); } catch (e) {} };
  React.useEffect(() => { document.documentElement.lang = lang; document.title = B.strings[lang].title + ' · PNUD'; }, [lang]);
  const t = B.strings[lang];

  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState('recientes');
  const [filters, setFilters] = React.useState({ pais: new Set(), dimension: new Set(), nivel: new Set(), institucion: new Set() });
  const [active, setActive] = React.useState(null); // ficha

  const toggle = (key, val) => setFilters((f) => {
    const s = new Set(f[key]); s.has(val) ? s.delete(val) : s.add(val);
    return { ...f, [key]: s };
  });
  const clearAll = () => { setFilters({ pais: new Set(), dimension: new Set(), nivel: new Set(), institucion: new Set() }); setQ(''); };

  const cn = (code) => (B.cName[code] ? B.cName[code].nombre[lang] : code);

  // options
  const paisOpts = React.useMemo(() => B.countries
    .filter((c) => B.byCountry[c.code] > 0)
    .map((c) => ({ value: c.code, label: c.nombre[lang], flagCode: c.code, count: B.byCountry[c.code] }))
    .sort((a, b) => b.count - a.count), [lang]);
  const dimOpts = B.dimensions.map((d) => ({ value: d.id, label: d.nombre[lang], count: B.byDimension.find((x) => x.id === d.id).count }));
  const nivelOpts = B.niveles.map((n) => ({ value: n, label: B.nivelLabels[lang][n], count: B.experiences.filter((e) => e.nivel === n).length }));
  // instituciones: clave canónica = nombre ES (estable entre idiomas); etiqueta = idioma actual
  const instInfo = React.useMemo(() => {
    const m = {};
    B.experiences.forEach((e) => { const k = e.es.institucion; if (!m[k]) m[k] = { count: 0, label: {} }; m[k].count++; m[k].label.es = e.es.institucion; m[k].label.en = e.en.institucion; });
    return m;
  }, []);
  const instOpts = Object.keys(instInfo)
    .sort((a, b) => instInfo[b].count - instInfo[a].count)
    .map((k) => ({ value: k, label: instInfo[k].label[lang] || k, count: instInfo[k].count }));

  // filtering
  const results = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = B.experiences.filter((e) => {
      if (filters.pais.size && !filters.pais.has(e.pais)) return false;
      if (filters.dimension.size && !filters.dimension.has(e.dimensionId)) return false;
      if (filters.nivel.size && !filters.nivel.has(e.nivel)) return false;
      if (filters.institucion.size && !filters.institucion.has(e.es.institucion)) return false;
      if (term) {
        const L = e[lang] || e.es;
        const hay = (L.titulo + ' ' + L.institucion + ' ' + cn(e.pais) + ' ' + dimById[e.dimensionId].nombre[lang] + ' ' + L.resumen).toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
    if (sort === 'recientes') out = out.slice().sort((a, b) => (b.destacada - a.destacada) || (b.anio - a.anio) || (a.id - b.id));
    else if (sort === 'alfabetico') out = out.slice().sort((a, b) => (a[lang] || a.es).titulo.localeCompare((b[lang] || b.es).titulo, lang));
    else if (sort === 'pais') out = out.slice().sort((a, b) => cn(a.pais).localeCompare(cn(b.pais), lang) || (b.anio - a.anio));
    return out;
  }, [q, sort, filters, lang]);

  const sortLabels = { recientes: t.sortRecent, alfabetico: t.sortAlpha, pais: t.sortCountry };
  const [sortOpen, setSortOpen] = React.useState(false);
  const sortRef = React.useRef(null);
  React.useEffect(() => {
    function onDoc(e) { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); }
    document.addEventListener('mousedown', onDoc); return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // active chips
  const chips = [];
  filters.pais.forEach((v) => chips.push({ key: 'pais', v, label: cn(v) }));
  filters.dimension.forEach((v) => chips.push({ key: 'dimension', v, label: dimById[v].nombre[lang] }));
  filters.nivel.forEach((v) => chips.push({ key: 'nivel', v, label: B.nivelLabels[lang][v] }));
  filters.institucion.forEach((v) => chips.push({ key: 'institucion', v, label: (instInfo[v] && instInfo[v].label[lang]) || v }));

  const anyFilter = chips.length > 0 || q.trim();

  return (
    <I18N.Provider value={{ lang, setLang, t, B }}>
    <div className="app">
      <div className="app-shell">
        {/* top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <PnudMark lg />
            <div>
              <h1>{t.title}</h1>
              <div className="sub">{t.subtitle}</div>
            </div>
          </div>
          <div className="topbar-right">
            <LangSwitch />
            <div className="topbar-note">
              <Icon name="info" size={18} />
              <span>{t.topbarNote(B.stats)}</span>
            </div>
          </div>
        </header>

        {/* search */}
        <div className="search">
          <Icon name="search" size={20} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} />
        </div>

        {/* filters */}
        <div className="filters">
          <Dropdown icon="globe" label={t.fPais} options={paisOpts} selected={filters.pais} onToggle={(v) => toggle('pais', v)} />
          <Dropdown icon="grid" label={t.fDim} options={dimOpts} selected={filters.dimension} onToggle={(v) => toggle('dimension', v)} />
          <Dropdown icon="building" label={t.fNivel} options={nivelOpts} selected={filters.nivel} onToggle={(v) => toggle('nivel', v)} />
          <Dropdown icon="user" label={t.fInst} options={instOpts} selected={filters.institucion} onToggle={(v) => toggle('institucion', v)} />
          {anyFilter && (
            <button className="clear-btn" onClick={clearAll}><Icon name="refresh" size={16} />{t.clear}</button>
          )}
        </div>

        {/* main */}
        <div className="main">
          {/* map */}
          <div className="map-panel">
            <h2 className="map-title">{t.mapTitle}</h2>
            <div className="panel-card map-box">
              <GeoMap selected={filters.pais} onToggle={(v) => toggle('pais', v)} byCountry={B.byCountry} intensity={B.intensity} />
            </div>
            <div className="map-caption">{t.mapCaption(B.stats)}</div>
          </div>

          {/* results */}
          <div>
            <div className="results-head">
              <div className="count"><em>{results.length}</em> {results.length === 1 ? t.expS : t.expP}</div>
              <div className="sort" ref={sortRef}>
                <span>{t.sortBy}</span>
                <div className="filter" style={{ position: 'relative' }}>
                  <button className="filter-btn" aria-expanded={sortOpen} onClick={() => setSortOpen((o) => !o)}>
                    <span>{sortLabels[sort]}</span><Icon name="chevron" size={16} className="chev" />
                  </button>
                  {sortOpen && (
                    <div className="menu" style={{ left: 'auto', right: 0, minWidth: 170 }}>
                      {Object.keys(sortLabels).map((k) => (
                        <button key={k} className={'menu-item' + (sort === k ? ' sel' : '')} onClick={() => { setSort(k); setSortOpen(false); }}>
                          <span className="check">{sort === k && <Icon name="check" size={11} />}</span>{sortLabels[k]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {chips.length > 0 && (
              <div className="chips">
                {chips.map((c, i) => (
                  <span className="chip" key={i}>{c.label}<button onClick={() => toggle(c.key, c.v)} aria-label={t.remove}><Icon name="close" size={12} /></button></span>
                ))}
              </div>
            )}

            {results.length === 0 ? (
              <div className="panel-card empty">
                <Icon name="search" size={40} />
                <h3>{t.noResultsT}</h3>
                <p>{t.noResultsB}</p>
              </div>
            ) : (
              <div className="exp-list">
                {results.map((e) => <ExpCard key={e.id} exp={e} dim={dimById[e.dimensionId]} onOpen={setActive} />)}
              </div>
            )}

            <div className="results-actions">
              <button className="btn btn-primary" onClick={downloadCSV}><Icon name="download" size={18} />{t.download}</button>
              <button className="btn btn-outline" onClick={() => results[0] && setActive(results[0])}><Icon name="external" size={18} />{t.viewFichas}</button>
            </div>
          </div>
        </div>
      </div>

      {active && <Ficha exp={active} dim={dimById[active.dimensionId]} onClose={() => setActive(null)} />}
    </div>
    </I18N.Provider>
  );

  function downloadCSV() {
    const rows = [t.csvHead.slice()];
    results.forEach((e) => { const L = e[lang] || e.es; rows.push([L.titulo, dimById[e.dimensionId].nombre[lang], cn(e.pais), L.institucion, B.nivelLabels[lang][e.nivel], e.anio, e.vinculadaPNUD ? t.csvYes : t.csvNo]); });
    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'banco-experiencias-pnud-' + lang + '.csv';
    a.click();
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
