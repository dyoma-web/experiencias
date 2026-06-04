/* Banco de Experiencias de Gobernanza Pública — capa de datos.
   Construye window.BANCO a partir de los 104 casos REALES cargados en
   assets/experiences.js (generado desde el Excel de la guía estratégica).
   Los agregados (KPIs, mapa de cobertura, barras por dimensión) se calculan
   dinámicamente a partir de los datos reales. */
(function () {
  // ---- 6 aceleradores de gobernanza (orden oficial de la guía) ----
  const dimensions = [
    { id: 'anticipatoria', n: 1, nombre: 'Gobernanza anticipatoria', icon: 'anticipatoria', tint: '#3091A6', soft: '#E4F2F5' },
    { id: 'colaborativa', n: 2, nombre: 'Gobernanza colaborativa', icon: 'colaborativa', tint: '#1E8FB0', soft: '#E3F2F6' },
    { id: 'comunicacional', n: 3, nombre: 'Gobernanza comunicacional', icon: 'comunicacional', tint: '#2C7BD0', soft: '#E8F0FB' },
    { id: 'integra', n: 4, nombre: 'Gobernanza íntegra', icon: 'integra', tint: '#1F9C8F', soft: '#E2F4F1' },
    { id: 'digital', n: 5, nombre: 'Gobernanza digital', icon: 'digital', tint: '#1F6FC2', soft: '#E7EFFA' },
    { id: 'intergeneracional', n: 6, nombre: 'Gobernanza intergeneracional', icon: 'intergeneracional', tint: '#3E73C9', soft: '#E9EFFB' },
  ];

  const niveles = ['Nacional', 'Subnacional', 'Local'];

  // ---- catálogo de países LAC (para nombres, banderas y mapa) ----
  const countries = [
    { code: 'MX', nombre: 'México', flag: '🇲🇽' },
    { code: 'GT', nombre: 'Guatemala', flag: '🇬🇹' },
    { code: 'BZ', nombre: 'Belice', flag: '🇧🇿' },
    { code: 'SV', nombre: 'El Salvador', flag: '🇸🇻' },
    { code: 'HN', nombre: 'Honduras', flag: '🇭🇳' },
    { code: 'NI', nombre: 'Nicaragua', flag: '🇳🇮' },
    { code: 'CR', nombre: 'Costa Rica', flag: '🇨🇷' },
    { code: 'PA', nombre: 'Panamá', flag: '🇵🇦' },
    { code: 'CU', nombre: 'Cuba', flag: '🇨🇺' },
    { code: 'DO', nombre: 'R. Dominicana', flag: '🇩🇴' },
    { code: 'HT', nombre: 'Haití', flag: '🇭🇹' },
    { code: 'JM', nombre: 'Jamaica', flag: '🇯🇲' },
    { code: 'TT', nombre: 'Trinidad y Tobago', flag: '🇹🇹' },
    { code: 'CO', nombre: 'Colombia', flag: '🇨🇴' },
    { code: 'VE', nombre: 'Venezuela', flag: '🇻🇪' },
    { code: 'GY', nombre: 'Guyana', flag: '🇬🇾' },
    { code: 'EC', nombre: 'Ecuador', flag: '🇪🇨' },
    { code: 'PE', nombre: 'Perú', flag: '🇵🇪' },
    { code: 'BO', nombre: 'Bolivia', flag: '🇧🇴' },
    { code: 'BR', nombre: 'Brasil', flag: '🇧🇷' },
    { code: 'PY', nombre: 'Paraguay', flag: '🇵🇾' },
    { code: 'CL', nombre: 'Chile', flag: '🇨🇱' },
    { code: 'AR', nombre: 'Argentina', flag: '🇦🇷' },
    { code: 'UY', nombre: 'Uruguay', flag: '🇺🇾' },
  ];
  const cName = {}; countries.forEach((c) => (cName[c.code] = c));

  // ---- experiencias REALES ----
  const experiences = (window.EXPERIENCES_RAW || []).map((e) => ({
    ...e,
    flag: (cName[e.pais] || {}).flag || '',
  }));

  // marcar como destacada la experiencia PNUD más reciente de cada dimensión
  dimensions.forEach((d) => {
    const inDim = experiences.filter((e) => e.dimensionId === d.id && e.vinculadaPNUD);
    if (inDim.length) {
      inDim.sort((a, b) => b.anio - a.anio || a.id - b.id)[0].destacada = true;
    }
  });

  // ---- agregados ----
  const byDimension = dimensions.map((d) => ({
    ...d,
    count: experiences.filter((e) => e.dimensionId === d.id).length,
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
    paises: Object.values(byCountry).filter((v) => v > 0).length,
  };

  window.BANCO = { dimensions, byDimension, niveles, countries, cName, experiences, byCountry, maxCountry, intensity, stats };
})();
