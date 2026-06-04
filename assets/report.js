/* Banco de Experiencias — report page population (vanilla) */
(function () {
  const B = window.BANCO, I = window.ICONS;
  const LANG = window.INFORME_LANG === 'en' || (new URLSearchParams(location.search).get('lang') === 'en') ? 'en' : 'es';
  const icon = (name, size, color) => {
    const raw = (I[name] || '').replace('<svg ', `<svg width="${size}" height="${size}" style="display:block${color ? ';color:' + color : ''}" `);
    return raw;
  };

  /* ---- stat cards ---- */
  const CARDLBL = {
    es: ['experiencias', 'vinculadas al PNUD', 'experiencias adicionales', 'dimensiones'],
    en: ['experiences', 'linked to UNDP', 'additional experiences', 'dimensions'],
  }[LANG];
  const cards = [
    { icon: 'statPeople', num: B.stats.total, lbl: CARDLBL[0], teal: false },
    { icon: 'statLinked', num: B.stats.vinculadas, lbl: CARDLBL[1], teal: false },
    { icon: 'statAdd', num: B.stats.adicionales, lbl: CARDLBL[2], teal: true },
    { icon: 'statPie', num: B.stats.dimensiones, lbl: CARDLBL[3], teal: false },
  ];
  document.getElementById('stats').innerHTML = cards.map((c) => `
    <div class="stat-card${c.teal ? ' teal' : ''}">
      <div class="ic-wrap">${icon(c.icon, 30)}</div>
      <div class="num">${c.num}</div>
      <div class="lbl">${c.lbl}</div>
    </div>`).join('');

  /* ---- coverage map (real geography) ---- */
  const G = window.GEO;
  const COLOR = { alta: '#1668c2', media: '#74a6dd', baja: '#c3d8f1', none: '#e9eff6' };
  let paths = '';
  G.context.forEach((code) => { paths += `<path d="${G.shapes[code]}" fill="#d7e0ea" stroke="#fff" stroke-width=".7"/>`; });
  G.lac.forEach((code) => {
    const data = !!B.cName[code];
    const inten = data ? B.intensity(code) : 'none';
    paths += `<path d="${G.shapes[code]}" fill="${COLOR[inten]}" stroke="#fff" stroke-width=".8"/>`;
  });
  document.getElementById('cov-map').innerHTML =
    `<svg viewBox="${G.viewBox}" preserveAspectRatio="xMidYMid meet" class="cov-svg">${paths}</svg>`;

  /* ---- bar chart ---- */
  const shades = ['var(--map-alta)', '#2f7fce', '#5b9bdb', '#86b8e6', '#a9ccef', '#c8ddf5'];
  const ranked = B.byDimension.slice().sort((a, b) => b.count - a.count);
  const maxPct = ranked[0].pct;
  document.getElementById('bars').innerHTML = ranked.map((d, i) => `
    <div class="bar-row">
      <div class="bar-label">${i + 1}. ${d.nombre[LANG]}</div>
      <div class="bar-track">
        <div class="bar-fill-wrap"><div class="bar-fill" style="width:${Math.round((d.pct / maxPct) * 100)}%;background:${shades[i]}"></div></div>
        <div class="bar-pct">${d.pct}%</div>
      </div>
    </div>`).join('');

  /* ---- QR (decorative / faux) ---- */
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const r = rng(7);
  const N = 25;
  const grid = Array.from({ length: N }, () => Array(N).fill(0));
  function finder(ox, oy) {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const edge = x === 0 || y === 0 || x === 6 || y === 6;
      const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
      grid[oy + y][ox + x] = (edge || core) ? 1 : 0;
    }
  }
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  function inFinder(x, y) {
    return (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
  }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (inFinder(x, y)) continue;
    grid[y][x] = r() > 0.52 ? 1 : 0;
  }
  let rects = '';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (grid[y][x]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="#14233d"/>`;
  }
  var qrEl = document.getElementById('qr'); if (qrEl) qrEl.innerHTML = rects; // QR decorativo (solo páginas antiguas)

  /* ---- inline icons (guarded) ---- */
  var qi = document.getElementById('qr-icon'); if (qi) qi.innerHTML = icon('pin', 24, '#fff');
  var qa = document.getElementById('qr-arrow'); if (qa) qa.innerHTML = icon('arrowRight', 15);
  var na = document.getElementById('nav-arrow'); if (na) na.innerHTML = icon('arrowRight', 14, '#fff');
})();
