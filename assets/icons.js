/* Banco de Experiencias — line icon set. Each is an inline SVG string using currentColor. */
(function () {
  const w = (body, sw) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

  const ICONS = {
    /* --- dimension icons --- */
    digital: w('<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/>'),
    comunicacional: w('<path d="M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1Z"/><path d="M16.5 8.5a4 4 0 0 1 0 7"/><path d="M19 6a7 7 0 0 1 0 12"/>'),
    colaborativa: w('<circle cx="9" cy="8" r="2.6"/><circle cx="16.5" cy="9.5" r="2.1"/><path d="M4.5 18.5a4.5 4.5 0 0 1 9 0"/><path d="M14 18.5a3.6 3.6 0 0 1 5.8-2.6"/>'),
    integra: w('<path d="M12 3 5 6v5c0 4.2 2.9 7.7 7 9 4.1-1.3 7-4.8 7-9V6l-7-3Z"/><path d="m9 11.5 2 2 4-4"/>'),
    anticipatoria: w('<circle cx="12" cy="12" r="8.5"/><path d="m14.8 9.2-2 4.6-4.6 2 2-4.6 4.6-2Z"/>'),
    intergeneracional: w('<circle cx="8" cy="7" r="2.4"/><path d="M4 19a4 4 0 0 1 8 0"/><circle cx="16.5" cy="9" r="1.9"/><path d="M13.2 19a3.4 3.4 0 0 1 6.8 0"/>'),

    /* --- report stat icons --- */
    statPeople: w('<circle cx="12" cy="7.5" r="2.5"/><path d="M7.4 18.5a4.6 4.6 0 0 1 9.2 0"/><circle cx="4.8" cy="9.5" r="1.9"/><path d="M1.8 17.4a3.1 3.1 0 0 1 4.3-2.7"/><circle cx="19.2" cy="9.5" r="1.9"/><path d="M22.2 17.4a3.1 3.1 0 0 0-4.3-2.7"/>'),
    statLinked: w('<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a3 3 0 0 0-4.2 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5.8 5.8 0 0 1 7.1-.9l.5.3a2 2 0 0 0 1.4.2L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>', 1.6),
    statAdd: w('<path d="M3.5 7.2a1.6 1.6 0 0 1 1.6-1.6h3.5a1.2 1.2 0 0 1 .9.4l1.2 1.3a1.2 1.2 0 0 0 .9.4h6.3a1.6 1.6 0 0 1 1.6 1.6v8.5a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6Z"/><path d="m9.6 12.4 1.7 1.7 3.3-3.3"/>'),
    statPie: w('<path d="M12 3a9 9 0 1 0 9 9h-9Z"/><path d="M12 3v9h9A9 9 0 0 0 12 3Z"/>'),

    /* --- ui icons --- */
    search: w('<circle cx="10.5" cy="10.5" r="6"/><path d="m20 20-5.2-5.2"/>'),
    globe: w('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.3 3.8 5.4 3.8 8.5S14.4 18.2 12 20.5C9.6 18.2 8.2 15.1 8.2 12S9.6 5.8 12 3.5Z"/>'),
    grid: w('<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>'),
    building: w('<path d="M5 21V6l7-3 7 3v15"/><path d="M3.5 21h17"/><path d="M9 9h0M9 13h0M9 17h0M15 9h0M15 13h0M15 17h0"/>', 1.7),
    user: w('<circle cx="12" cy="8" r="3.2"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>'),
    refresh: w('<path d="M20 11a8 8 0 1 0-1.5 5.5"/><path d="M20 5v5h-5"/>'),
    download: w('<path d="M12 3.5v11"/><path d="m7.5 10.5 4.5 4 4.5-4"/><path d="M5 19.5h14"/>'),
    external: w('<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>'),
    info: w('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><path d="M12 7.6h0"/>'),
    plus: w('<path d="M12 6v12M6 12h12"/>', 1.9),
    minus: w('<path d="M6 12h12"/>', 1.9),
    close: w('<path d="m6 6 12 12M18 6 6 18"/>'),
    chevron: w('<path d="m6 9 6 6 6-6"/>'),
    calendar: w('<rect x="4" y="5" width="16" height="15" rx="1.6"/><path d="M4 9h16M8 3.5v3M16 3.5v3"/>'),
    link: w('<path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1"/><path d="M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1"/>'),
    menu: w('<path d="M4 7h16M4 12h16M4 17h16"/>', 1.9),
    pin: w('<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
    target: w('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.6"/>'),
    arrowRight: w('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    sliders: w('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
  };

  window.ICONS = ICONS;
})();
