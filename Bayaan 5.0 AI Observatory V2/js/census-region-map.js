/* ============================================================
   CENSUS REGIONAL MAP — one reusable component, shared by every
   Census Observatory page that shows the Abu Dhabi Emirate regional
   map (Interpret, Population detail, Real Estate detail).

   The coastline is real, not an invented/abstract shape: it's
   projected from the actual Abu Dhabi + Dubai boundary coordinates
   already in this project (lmo/data/uae-emirates.geojson), downsampled
   for a lightweight inline SVG. The three regions are approximate
   vertical bands clipped to that real coastline — no sub-region-level
   boundary data exists anywhere in this project to draw precise
   internal borders — coloured as a light -> vivid -> dark blue spread
   (Al Dhafra #5B9BD5, Abu Dhabi = app accent #0073F0, Al Ain #1B4F9E),
   matching the reference regional map.

   Usage:
     renderCensusRegionMap(containerEl, {
       uid: "pd",                              // unique per page, avoids clipPath id collisions
       legend: [{ label: "Population", color: "#0073F0" }],   // 0-2 items, shown above the map
       abudhabi: "<div class=\"cen-map-callout-pct\">69%</div><div class=\"cen-map-callout-name\">Abu Dhabi Region</div>",
       alain: "...",
       aldhafra: "...",
       // Optional — opt in to a clickable, selectable map (Population
       // detail's region drill-down). Omitted entirely on every other
       // page, which keeps them pixel-identical to before this option
       // existed: no cursor/hover/dim styling is applied unless the
       // wrapper carries the --interactive modifier, which only happens
       // when onSelect is actually passed.
       selected: "abudhabi",                   // region key currently selected, or null
       onSelect: (regionKey) => { ... },        // fired on click of that region's shape/label/callout
       // Optional — native SVG <title> tooltip text per region (shows on
       // hover via the browser's own tooltip, no custom tooltip UI). Omit
       // entirely to render with no <title> at all, same as before this
       // option existed.
       tooltip: { abudhabi: "Abu Dhabi Region — 2,047,185 employed (68.8%)", alain: "...", aldhafra: "..." },
     });

   Callout HTML is caller-supplied so each page can show whatever
   metric(s) it has confirmed (population-only, population+housing,
   or a toggled buildings/units value) — the map geometry, region
   colours, dot positions and callout placement are fixed and shared.
   Safe to call repeatedly on the same container (e.g. Real Estate's
   Buildings/Units toggle just re-invokes this with new callout HTML).
   ============================================================ */
function renderCensusRegionMap(container, opts) {
  if (!container) return;
  const uid = opts.uid || "default";
  const legend = opts.legend || [];
  const selected = opts.selected || null;
  const interactive = typeof opts.onSelect === "function";
  const legendHtml = legend.length
    ? `<div class="cen-region-legend">${legend
        .map((l) => `<span><span class="cen-region-legend-dot" style="background:${l.color}"></span>${l.label}</span>`)
        .join("")}</div>`
    : "";

  // Selected/dimmed state only ever applies to the three coloured region
  // shapes (not the text labels or callouts, which stay fully legible
  // regardless of selection) — keeps the "which region is active" signal
  // clear without hurting readability of the others.
  function regionShapeCls(key) {
    let cls = "cen-map-region";
    if (selected === key) cls += " is-selected";
    else if (selected) cls += " is-dimmed";
    return cls;
  }
  const tooltip = opts.tooltip || {};
  function regionTitle(key) {
    return tooltip[key] ? `<title>${tooltip[key]}</title>` : "";
  }

  container.innerHTML = `
    ${legendHtml}
    <div class="cen-map-wrap${interactive ? " cen-map-wrap--interactive" : ""}">
      <svg class="cen-map-svg" viewBox="0 0 500 290" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of Abu Dhabi Emirate showing Abu Dhabi, Al Ain and Al Dhafra regions">
        <defs>
          <clipPath id="cenAdShape-${uid}">
            <polygon points="284.9,277.3 10,116.9 10.8,116.3 10.2,110.8 9.2,107.2 10.5,105.6 13.9,111.2 14.3,114.9 14.8,122.7 17.8,120.9 17,113.2 18.4,114.4 20.5,120.1 23.8,122.2 24.5,117 27.1,115.1 29.5,118.8 29.3,125.3 30,134.7 30,139.4 40,147.7 39.4,148.5 43.5,148.1 46.1,150.4 47.4,146.1 48.5,145.1 54.8,147.3 55.3,146.4 60.3,150.1 63.6,151.4 64.4,149.1 65.5,149 81.1,147.5 97.4,140 105.2,134.7 113.2,130.1 113.5,126.9 115.5,124.8 120.6,126.1 124.3,130.5 128,129.8 131.4,130.2 132.3,130.1 135.5,132 149.2,130.3 156.7,129.7 163,131.4 168.5,131.6 177.5,128.1 190.4,136.8 192.9,132.8 195.5,134.5 202.7,133.4 208.8,132.9 210.3,134.8 211.9,134 217.6,136.9 230.2,140.1 234.3,137.7 243,138.3 256.8,137.7 268.9,131.3 269.6,128.5 274.7,129.7 281.7,126.6 284.1,123.9 281.4,123.3 278.1,120.8 278,120.5 278.3,118.6 277.6,117.6 276.9,113.5 284.6,115.6 288.9,117.4 285.3,113.3 290.4,108.7 296.7,115.6 290.7,115.4 294.4,119.9 299.3,118.7 304.2,117.6 315.1,113.2 316.5,112.6 317.6,111.9 314.3,108.9 318.2,104.8 319.2,104 317.7,104.1 322.1,100 326,98.9 333.2,93.6 332.8,91.3 330,89.5 334.3,83.3 338.3,74.7 335.8,70.8 336.1,69.8 333.4,68.8 333.8,67.3 337.9,65.2 338.2,64.1 334.3,60.3 341,59.2 345.4,61 346.4,62.3 347.8,59.5 348.4,55.9 349.1,55.7 349.8,55.1 351.5,54.1 353.4,53.6 355,51.3 360.9,54.9 356.4,52 356.5,50.8 358.3,50.4 371.1,52.1 438,69.3 459.1,61.3 460.9,74.4 460.6,110 454.5,120.5 473.4,121.7 479.6,136 463,142.9 450.6,139.4 423.5,151.6 428.8,161.9 432.8,184.5 419.5,202.8 396.7,239.4 395.4,251.6 395.9,263.2 394.6,282.5" />
            <polygon points="313.8,98.5 315.6,99.5 317,100.6 317.5,101.8 316.6,103 314.5,103.1 314,102.9 315.2,102.6 313.4,101.7 310.4,101 313.6,102.8 310,101.3 308.9,101.3 308.2,100.5 306.2,99.8 308.1,100.5 306.2,100.4 304.7,99.8 302.1,97.6 300.8,97.8 299.7,97.1 298.6,97.4 297.8,95.9 299.1,96.3 299.4,95.4 299.6,94.9 300.2,94.4 300.7,94.8 301,95.8 303.1,93.3 305.6,90.7 304.3,89.9 306.4,88.2 306.4,89.3 307.8,90.4 308.2,90.4 306.8,91.6 306.2,92.3 306.8,93.3 307.8,94.3 309.1,95.3 309.2,95.8 309.1,97.8 312.8,98.1" />
            <polygon points="252.1,117.4 250.5,118.5 252.5,121.5 255.7,122.8 258.2,122.7 260.7,123.7 262.1,125.6 262.5,126.9 261.6,127.9 262.2,129.2 260.6,130.7 257.7,131.5 254.9,130.7 250.2,129.2 251.6,128.6 248.9,125.8 248.1,128.8 242.9,131.6 239.1,131.8 236.1,130.6 232.2,128.3 229.3,129.1 225.7,127.6 229.8,125.3 237.2,120.6 241.6,120.9 246.4,118.8 245.6,120.5 247.3,118.9 249.4,117.3 252.2,117.2" />
          </clipPath>
        </defs>
        <polygon points="390,26.9 396,19.7 400.2,13.7 403,9.8 408.4,15.4 411.6,8 448,66.3 430.7,74.9 367.1,51 361.6,46.4 370.8,42.5 370.4,41 368.2,39.2 372.4,37.2 374.7,40.4 378.4,41.5 380.7,36.3 386.2,30.9 385.3,26.6 387.6,26" fill="#EEF2F7" stroke="#dbe4f0" stroke-width="0.75" />
        <text x="405" y="35" class="cen-map-label cen-map-label--muted">Dubai</text>
        <g clip-path="url(#cenAdShape-${uid})">
          <rect data-region="aldhafra" class="${regionShapeCls("aldhafra")}" x="0" y="0" width="235" height="290" fill="#5B9BD5">${regionTitle("aldhafra")}</rect>
          <rect data-region="abudhabi" class="${regionShapeCls("abudhabi")}" x="235" y="0" width="140" height="290" fill="#0073F0">${regionTitle("abudhabi")}</rect>
          <rect data-region="alain" class="${regionShapeCls("alain")}" x="375" y="0" width="125" height="290" fill="#1B4F9E">${regionTitle("alain")}</rect>
        </g>
        <text data-region="aldhafra" x="100" y="196" class="cen-map-label">Al Dhafra</text>
        <text data-region="abudhabi" x="300" y="170" class="cen-map-label cen-map-label--on-dark">Abu Dhabi</text>
        <text data-region="alain" x="440" y="114" class="cen-map-label">Al Ain</text>
        <line class="cen-map-line" x1="300" y1="155" x2="300" y2="75" />
        <line class="cen-map-line" x1="440" y1="100" x2="465" y2="45" />
        <line class="cen-map-line" x1="100" y1="180" x2="65" y2="235" />
        <circle class="cen-map-dot" cx="300" cy="155" r="5" />
        <circle class="cen-map-dot" cx="440" cy="100" r="5" />
        <circle class="cen-map-dot" cx="100" cy="180" r="5" />
        <g class="cen-map-compass" transform="translate(468,28)">
          <text x="0" y="-8" text-anchor="middle">N</text>
          <polygon points="0,-2 4,10 0,6.5 -4,10" />
        </g>
        <g class="cen-map-scale" transform="translate(20,266)">
          <line x1="0" y1="0" x2="120" y2="0" />
          <line x1="0" y1="-3" x2="0" y2="3" />
          <line x1="30" y1="-3" x2="30" y2="3" />
          <line x1="60" y1="-3" x2="60" y2="3" />
          <line x1="120" y1="-3" x2="120" y2="3" />
          <text x="0" y="14" text-anchor="middle">0</text>
          <text x="30" y="14" text-anchor="middle">50</text>
          <text x="60" y="14" text-anchor="middle">100</text>
          <text x="120" y="14" text-anchor="middle">200 km</text>
        </g>
      </svg>
      <div data-region="abudhabi" class="cen-map-callout" style="top:25.9%;left:60%">${opts.abudhabi || ""}</div>
      <div data-region="alain" class="cen-map-callout" style="top:15.5%;left:93%">${opts.alain || ""}</div>
      <div data-region="aldhafra" class="cen-map-callout cen-map-callout--below" style="top:81%;left:13%">${opts.aldhafra || ""}</div>
    </div>
  `;

  if (interactive) {
    container.querySelector(".cen-map-wrap").addEventListener("click", function (e) {
      const el = e.target.closest("[data-region]");
      if (el) opts.onSelect(el.dataset.region);
    });
  }
}
