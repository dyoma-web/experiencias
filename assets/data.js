/* Banco de Experiencias de Gobernanza Pública — capa de datos (bilingüe ES/EN).
   Construye window.BANCO a partir de los 104 casos REALES cargados en
   assets/experiences.js (generado desde el Excel ES + en-US de la guía estratégica).
   Los agregados (KPIs, mapa, barras) se calculan dinámicamente y son
   independientes del idioma; los textos se resuelven por locale en la UI. */
(function () {
  // ---- 6 aceleradores de gobernanza (orden oficial de la guía) ----
  const dimensions = [
    { id: 'anticipatoria', n: 1, nombre: { es: 'Gobernanza anticipatoria', en: 'Anticipatory governance' }, icon: 'anticipatoria', tint: '#3091A6', soft: '#E4F2F5' },
    { id: 'colaborativa', n: 2, nombre: { es: 'Gobernanza colaborativa', en: 'Collaborative governance' }, icon: 'colaborativa', tint: '#1E8FB0', soft: '#E3F2F6' },
    { id: 'comunicacional', n: 3, nombre: { es: 'Gobernanza comunicacional', en: 'Communicational governance' }, icon: 'comunicacional', tint: '#2C7BD0', soft: '#E8F0FB' },
    { id: 'integra', n: 4, nombre: { es: 'Gobernanza íntegra', en: 'Governance with integrity' }, icon: 'integra', tint: '#1F9C8F', soft: '#E2F4F1' },
    { id: 'digital', n: 5, nombre: { es: 'Gobernanza digital', en: 'Digital governance' }, icon: 'digital', tint: '#1F6FC2', soft: '#E7EFFA' },
    { id: 'intergeneracional', n: 6, nombre: { es: 'Gobernanza intergeneracional', en: 'Intergenerational governance' }, icon: 'intergeneracional', tint: '#3E73C9', soft: '#E9EFFB' },
  ];

  // niveles: claves canónicas (idioma-neutras); las etiquetas se traducen en nivelLabels
  const niveles = ['Nacional', 'Subnacional', 'Local'];
  const nivelLabels = {
    es: { Nacional: 'Nacional', Subnacional: 'Subnacional', Local: 'Local' },
    en: { Nacional: 'National', Subnacional: 'Subnational', Local: 'Local' },
  };

  // ---- catálogo de países LAC (nombre bilingüe, bandera) ----
  const C = (code, es, en, flag) => ({ code, nombre: { es, en }, flag });
  const countries = [
    C('MX', 'México', 'Mexico', '🇲🇽'), C('GT', 'Guatemala', 'Guatemala', '🇬🇹'),
    C('BZ', 'Belice', 'Belize', '🇧🇿'), C('SV', 'El Salvador', 'El Salvador', '🇸🇻'),
    C('HN', 'Honduras', 'Honduras', '🇭🇳'), C('NI', 'Nicaragua', 'Nicaragua', '🇳🇮'),
    C('CR', 'Costa Rica', 'Costa Rica', '🇨🇷'), C('PA', 'Panamá', 'Panama', '🇵🇦'),
    C('CU', 'Cuba', 'Cuba', '🇨🇺'), C('DO', 'R. Dominicana', 'Dominican Rep.', '🇩🇴'),
    C('HT', 'Haití', 'Haiti', '🇭🇹'), C('JM', 'Jamaica', 'Jamaica', '🇯🇲'),
    C('TT', 'Trinidad y Tobago', 'Trinidad and Tobago', '🇹🇹'), C('CO', 'Colombia', 'Colombia', '🇨🇴'),
    C('VE', 'Venezuela', 'Venezuela', '🇻🇪'), C('GY', 'Guyana', 'Guyana', '🇬🇾'),
    C('EC', 'Ecuador', 'Ecuador', '🇪🇨'), C('PE', 'Perú', 'Peru', '🇵🇪'),
    C('BO', 'Bolivia', 'Bolivia', '🇧🇴'), C('BR', 'Brasil', 'Brazil', '🇧🇷'),
    C('PY', 'Paraguay', 'Paraguay', '🇵🇾'), C('CL', 'Chile', 'Chile', '🇨🇱'),
    C('AR', 'Argentina', 'Argentina', '🇦🇷'), C('UY', 'Uruguay', 'Uruguay', '🇺🇾'),
    // pseudo-país para experiencias regionales ALC (sin geografía en el mapa)
    C('UN', 'Regional (ALC)', 'Regional (LAC)', '🇺🇳'),
  ];
  const cName = {}; countries.forEach((c) => (cName[c.code] = c));

  // ---- experiencias REALES (cada una con sub-objetos .es y .en) ----
  const experiences = (window.EXPERIENCES_RAW || []).map((e) => ({
    ...e,
    flag: (cName[e.pais] || {}).flag || '',
  }));

  // marcar como destacada la experiencia PNUD más reciente de cada dimensión
  dimensions.forEach((d) => {
    const inDim = experiences.filter((e) => e.dimensionId === d.id && e.vinculadaPNUD);
    if (inDim.length) inDim.sort((a, b) => b.anio - a.anio || a.id - b.id)[0].destacada = true;
  });

  // ---- agregados (idioma-neutros) ----
  const byDimension = dimensions.map((d) => ({
    ...d, count: experiences.filter((e) => e.dimensionId === d.id).length,
  }));
  const total = experiences.length;
  byDimension.forEach((d) => (d.pct = total ? Math.round((d.count / total) * 100) : 0));

  const byCountry = {};
  countries.forEach((c) => (byCountry[c.code] = 0));
  experiences.forEach((e) => { if (byCountry[e.pais] != null) byCountry[e.pais]++; });
  const maxCountry = Math.max(1, ...Object.values(byCountry));

  function intensity(code) {
    const v = byCountry[code] || 0;
    if (v === 0) return 'none';
    if (v >= maxCountry * 0.62) return 'alta';
    if (v >= maxCountry * 0.3) return 'media';
    return 'baja';
  }

  const stats = {
    total,
    vinculadas: experiences.filter((e) => e.vinculadaPNUD).length,
    adicionales: experiences.filter((e) => !e.vinculadaPNUD).length,
    dimensiones: dimensions.length,
    paises: countries.filter((c) => c.code !== 'UN' && byCountry[c.code] > 0).length,
  };

  // ---- diccionario de cadenas de interfaz ----
  const strings = {
    es: {
      title: 'Repositorio interactivo',
      subtitle: 'Banco de experiencias de gobernanza pública · América Latina y el Caribe',
      topbarNote: (s) => `${s.total} experiencias · ${s.vinculadas} vinculadas al PNUD · ${s.paises} países · enlaces oficiales en cada ficha`,
      searchPlaceholder: 'Buscar por palabra clave, tema, institución…',
      fPais: 'País', fDim: 'Dimensión', fNivel: 'Nivel de gobierno', fInst: 'Institución',
      clear: 'Limpiar filtros',
      mapTitle: 'Mapa de América Latina y el Caribe',
      mapCaption: (s) => `${s.paises} países · ${s.total} experiencias · clic en un país para filtrar`,
      sortBy: 'Ordenar por:', sortRecent: 'Más recientes', sortAlpha: 'Alfabético', sortCountry: 'País',
      expS: 'experiencia', expP: 'experiencias',
      noResultsT: 'Sin resultados', noResultsB: 'Ajusta los filtros o el término de búsqueda para encontrar experiencias.',
      download: 'Descargar base', viewFichas: 'Ver fichas',
      legAlta: 'Alta', legMedia: 'Media', legBaja: 'Baja',
      pnudTag: 'PNUD',
      fhPais: 'País', fhNivel: 'Nivel de gobierno', fhInst: 'Institución', fhAnio: 'Año o período',
      fhDesc: 'Descripción', fhBP: 'Buena práctica', fhActores: 'Actores principales', fhLinks: 'Enlaces de consulta',
      fhComentarios: 'Comentarios adicionales',
      remove: 'Quitar', close: 'Cerrar', zoomIn: 'Acercar', zoomOut: 'Alejar',
      csvHead: ['Título', 'Dimensión', 'País', 'Institución', 'Nivel', 'Año', 'Vinculada PNUD'], csvYes: 'Sí', csvNo: 'No',
    },
    en: {
      title: 'Interactive repository',
      subtitle: 'Public governance experience bank · Latin America and the Caribbean',
      topbarNote: (s) => `${s.total} experiences · ${s.vinculadas} linked to UNDP · ${s.paises} countries · official links in every record`,
      searchPlaceholder: 'Search by keyword, topic, institution…',
      fPais: 'Country', fDim: 'Dimension', fNivel: 'Level of government', fInst: 'Institution',
      clear: 'Clear filters',
      mapTitle: 'Map of Latin America and the Caribbean',
      mapCaption: (s) => `${s.paises} countries · ${s.total} experiences · click a country to filter`,
      sortBy: 'Sort by:', sortRecent: 'Most recent', sortAlpha: 'Alphabetical', sortCountry: 'Country',
      expS: 'experience', expP: 'experiences',
      noResultsT: 'No results', noResultsB: 'Adjust the filters or search term to find experiences.',
      download: 'Download dataset', viewFichas: 'View records',
      legAlta: 'High', legMedia: 'Medium', legBaja: 'Low',
      pnudTag: 'UNDP',
      fhPais: 'Country', fhNivel: 'Level of government', fhInst: 'Institution', fhAnio: 'Year or period',
      fhDesc: 'Description', fhBP: 'Best practice', fhActores: 'Key actors', fhLinks: 'Reference links',
      fhComentarios: 'Additional comments',
      remove: 'Remove', close: 'Close', zoomIn: 'Zoom in', zoomOut: 'Zoom out',
      csvHead: ['Title', 'Dimension', 'Country', 'Institution', 'Level', 'Year', 'UNDP-linked'], csvYes: 'Yes', csvNo: 'No',
    },
  };

  window.BANCO = { dimensions, byDimension, niveles, nivelLabels, countries, cName, experiences, byCountry, maxCountry, intensity, stats, strings };
})();
