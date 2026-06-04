/* Banco de Experiencias — main app */
function App() {
  const B = window.BANCO;
  const dimById = React.useMemo(() => { const m = {}; B.dimensions.forEach((d) => (m[d.id] = d)); return m; }, []);

  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState('recientes');
  const [filters, setFilters] = React.useState({ pais: new Set(), dimension: new Set(), nivel: new Set(), institucion: new Set() });
  const [active, setActive] = React.useState(null); // ficha

  const toggle = (key, val) => setFilters((f) => {
    const s = new Set(f[key]); s.has(val) ? s.delete(val) : s.add(val);
    return { ...f, [key]: s };
  });
  const clearAll = () => { setFilters({ pais: new Set(), dimension: new Set(), nivel: new Set(), institucion: new Set() }); setQ(''); };

  // options
  const paisOpts = React.useMemo(() => B.countries
    .filter((c) => B.byCountry[c.code] > 0)
    .map((c) => ({ value: c.code, label: c.nombre, flagCode: c.code, count: B.byCountry[c.code] }))
    .sort((a, b) => b.count - a.count), []);
  const dimOpts = B.dimensions.map((d) => ({ value: d.id, label: d.nombre, count: B.byDimension.find((x) => x.id === d.id).count }));
  const nivelOpts = B.niveles.map((n) => ({ value: n, label: n, count: B.experiences.filter((e) => e.nivel === n).length }));
  const instOpts = React.useMemo(() => {
    const m = {}; B.experiences.forEach((e) => (m[e.institucion] = (m[e.institucion] || 0) + 1));
    return Object.keys(m).sort((a, b) => m[b] - m[a]).map((k) => ({ value: k, label: k, count: m[k] }));
  }, []);

  // filtering
  const results = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = B.experiences.filter((e) => {
      if (filters.pais.size && !filters.pais.has(e.pais)) return false;
      if (filters.dimension.size && !filters.dimension.has(e.dimensionId)) return false;
      if (filters.nivel.size && !filters.nivel.has(e.nivel)) return false;
      if (filters.institucion.size && !filters.institucion.has(e.institucion)) return false;
      if (term) {
        const hay = (e.titulo + ' ' + e.institucion + ' ' + e.paisNombre + ' ' + dimById[e.dimensionId].nombre + ' ' + e.resumen).toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
    if (sort === 'recientes') out = out.slice().sort((a, b) => (b.destacada - a.destacada) || (b.anio - a.anio) || (a.id - b.id));
    else if (sort === 'alfabetico') out = out.slice().sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
    else if (sort === 'pais') out = out.slice().sort((a, b) => a.paisNombre.localeCompare(b.paisNombre, 'es') || (b.anio - a.anio));
    return out;
  }, [q, sort, filters]);

  const sortLabels = { recientes: 'Más recientes', alfabetico: 'Alfabético', pais: 'País' };
  const [sortOpen, setSortOpen] = React.useState(false);
  const sortRef = React.useRef(null);
  React.useEffect(() => {
    function onDoc(e) { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); }
    document.addEventListener('mousedown', onDoc); return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // active chips
  const chips = [];
  filters.pais.forEach((v) => chips.push({ key: 'pais', v, label: B.cName[v].nombre }));
  filters.dimension.forEach((v) => chips.push({ key: 'dimension', v, label: dimById[v].nombre }));
  filters.nivel.forEach((v) => chips.push({ key: 'nivel', v, label: v }));
  filters.institucion.forEach((v) => chips.push({ key: 'institucion', v, label: v }));

  const anyFilter = chips.length > 0 || q.trim();

  return (
    <div className="app">
      <div className="app-shell">
        {/* top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <PnudMark lg />
            <div>
              <h1>Repositorio interactivo</h1>
              <div className="sub">Banco de experiencias de gobernanza pública · América Latina y el Caribe</div>
            </div>
          </div>
          <div className="topbar-note">
            <Icon name="info" size={18} />
            <span>{B.stats.total} experiencias · {B.stats.vinculadas} vinculadas al PNUD · {B.stats.paises} países · enlaces oficiales en cada ficha</span>
          </div>
        </header>

        {/* search */}
        <div className="search">
          <Icon name="search" size={20} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por palabra clave, tema, institución…" />
        </div>

        {/* filters */}
        <div className="filters">
          <Dropdown icon="globe" label="País" options={paisOpts} selected={filters.pais} onToggle={(v) => toggle('pais', v)} />
          <Dropdown icon="grid" label="Dimensión" options={dimOpts} selected={filters.dimension} onToggle={(v) => toggle('dimension', v)} />
          <Dropdown icon="building" label="Nivel de gobierno" options={nivelOpts} selected={filters.nivel} onToggle={(v) => toggle('nivel', v)} />
          <Dropdown icon="user" label="Institución" options={instOpts} selected={filters.institucion} onToggle={(v) => toggle('institucion', v)} />
          {anyFilter && (
            <button className="clear-btn" onClick={clearAll}><Icon name="refresh" size={16} />Limpiar filtros</button>
          )}
        </div>

        {/* main */}
        <div className="main">
          {/* map */}
          <div className="map-panel">
            <h2 className="map-title">Mapa de América Latina y el Caribe</h2>
            <div className="panel-card map-box">
              <GeoMap selected={filters.pais} onToggle={(v) => toggle('pais', v)} byCountry={B.byCountry} intensity={B.intensity} />
            </div>
            <div className="map-caption">{B.stats.paises} países · {B.stats.total} experiencias · clic en un país para filtrar</div>
          </div>

          {/* results */}
          <div>
            <div className="results-head">
              <div className="count"><em>{results.length}</em> {results.length === 1 ? 'experiencia' : 'experiencias'}</div>
              <div className="sort" ref={sortRef}>
                <span>Ordenar por:</span>
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
                  <span className="chip" key={i}>{c.label}<button onClick={() => toggle(c.key, c.v)} aria-label="Quitar"><Icon name="close" size={12} /></button></span>
                ))}
              </div>
            )}

            {results.length === 0 ? (
              <div className="panel-card empty">
                <Icon name="search" size={40} />
                <h3>Sin resultados</h3>
                <p>Ajusta los filtros o el término de búsqueda para encontrar experiencias.</p>
              </div>
            ) : (
              <div className="exp-list">
                {results.map((e) => <ExpCard key={e.id} exp={e} dim={dimById[e.dimensionId]} onOpen={setActive} />)}
              </div>
            )}

            <div className="results-actions">
              <button className="btn btn-primary" onClick={downloadCSV}><Icon name="download" size={18} />Descargar base</button>
              <button className="btn btn-outline" onClick={() => results[0] && setActive(results[0])}><Icon name="external" size={18} />Ver fichas</button>
            </div>
          </div>
        </div>
      </div>

      {active && <Ficha exp={active} dim={dimById[active.dimensionId]} onClose={() => setActive(null)} />}
    </div>
  );

  function downloadCSV() {
    const rows = [['Título', 'Dimensión', 'País', 'Institución', 'Nivel', 'Año', 'Vinculada PNUD']];
    results.forEach((e) => rows.push([e.titulo, dimById[e.dimensionId].nombre, e.paisNombre, e.institucion, e.nivel, e.anio, e.vinculadaPNUD ? 'Sí' : 'No']));
    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'banco-experiencias-pnud.csv';
    a.click();
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
