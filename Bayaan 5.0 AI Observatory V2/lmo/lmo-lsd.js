/* Labor Supply–Demand Analysis module (ported from LaborMarketObservatory.html) */
(function () {
  const LSD_DATA = {
    age: {
      label: "Age group",
      supply: 3000000,
      emirati: 294800,
      nonEmirati: 2700000,
      demand: 2900000,
      gap: 112900,
      groups: [
        { name: "15–19", value: 22800 },
        { name: "20–24", value: 260000 },
        { name: "25–29", value: 474700 },
        { name: "30–34", value: 619600 },
        { name: "35–39", value: 558500 },
        { name: "40–44", value: 441800 },
        { name: "45–49", value: 301700 },
        { name: "50–54", value: 180800 },
      ],
    },
    education: {
      label: "Education level",
      placeholder: true,
      supply: 3000000,
      emirati: 294800,
      nonEmirati: 2700000,
      demand: 2900000,
      gap: 112900,
      groups: [
        { name: "Below Secondary", value: 651000 },
        { name: "Secondary", value: 861000 },
        { name: "Diploma", value: 474000 },
        { name: "Bachelor", value: 772000 },
        { name: "Postgraduate", value: 205600 },
      ],
    },
  };

  const LSD_YEARS = [
    2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  ];

  /* Per-band hues — matched to reference Sankey palette (8 age bands) */
  const LSD_BAND_COLORS = [
    "#0d3a6e",
    "#2fa6a0",
    "#4d95e0",
    "#3f51b7",
    "#5dbe89",
    "#9675cc",
    "#66afe2",
    "#2a3f7a",
  ];

  /* News — editorial image cards in a 3-up carousel, shown under the
     supply–demand analysis. Moved here from the Briefing Desk. */
  const LSD_NEWS = [
    { cat: "LABOR MARKET", date: "Jul 28 2026", title: "Abu Dhabi Private Sector Emirati Employment Surges 377% Since 2021", summary: "Emirati participation in Abu Dhabi's private sector rose from 37,500 to approximately 170,000 between 2021 and 2025,…", image: "../assets/News%201.jpg", alt: "Corporate office towers representing Abu Dhabi's private sector", url: "#", bw: true },
    { cat: "LABOR MARKET", date: "Jul 28 2026", title: "Women's Participation in Abu Dhabi Workforce Doubles Over Five Years", summary: "Women's workforce participation in Abu Dhabi more than doubled over the past five years, with a 101.9% increase and…", image: "../assets/News%202.avif", alt: "Professional woman working in a modern office", url: "#" },
    { cat: "LABOR MARKET", date: "Jul 28 2026", title: "Youth Account for 54.9% of Abu Dhabi Workforce in 2025", summary: "In 2025, young people aged 18–35 comprise 54.9% of Abu Dhabi's workforce. This demographic shift resulted from…", image: "../assets/News%203.jpg", alt: "Young professionals collaborating in a workplace", url: "#" },
  ];

  function buildSectionHdr(title, icon) {
    return `<div class="section-hdr"><h2 class="cpi-section-title"><i class="ti ${icon || "ti-circle"}" aria-hidden="true"></i>${title}</h2></div>`;
  }

  function buildNewsCard(n) {
    const bwClass = n.bw ? " lmo-news-card--bw" : "";
    return `<div class="obs-card dg-slide lmo-news-card${bwClass}"><div class="lmo-news-media" style="background-image:url('${n.image}')" role="img" aria-label="${n.alt}"></div><div class="lmo-news-shade"></div><div class="lmo-news-inner"><div class="lmo-news-top"><span class="lmo-news-badge">${n.cat}</span><span class="lmo-news-date">${n.date}</span></div><div class="lmo-news-foot"><h3 class="lmo-news-title">${n.title}</h3><p class="lmo-news-sum">${n.summary}</p><div class="lmo-news-actions"><button type="button" class="lmo-news-act"><i class="ti ti-sparkles"></i> AI Summarize</button><button type="button" class="lmo-news-act"><i class="ti ti-volume"></i> Listen</button><a class="lmo-news-more" href="${n.url}">Read more <i class="ti ti-arrow-right"></i></a></div></div></div></div>`;
  }

  /* Arrow/dot paging over a horizontally scrolling track. */
  function initDgCarousel(carousel) {
    const track = carousel.querySelector(".dg-track");
    const nav = carousel.querySelector(".dg-carousel-nav");
    if (!track || !nav) return;
    const dotsWrap = nav.querySelector(".home-carousel-dots");
    const arrows = nav.querySelectorAll(".home-carousel-arrow");
    if (!dotsWrap || arrows.length < 2) return;
    const cards = () => [...track.children];
    const gap = () => parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 14;
    const step = () => { const first = cards()[0]; return first ? first.offsetWidth + gap() : track.clientWidth; };
    const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
    const pageCount = () => { const ms = maxScroll(); return ms <= 2 ? 1 : Math.ceil(ms / step()) + 1; };
    const currentPage = () => { const s = step(); return s <= 0 ? 0 : Math.round(track.scrollLeft / s); };
    function sync() {
      const pages = pageCount();
      const page = Math.min(currentPage(), pages - 1);
      nav.classList.toggle("is-single", pages <= 1);
      const dots = dotsWrap.querySelectorAll(".home-carousel-dot");
      if (dots.length !== pages) {
        dotsWrap.innerHTML = Array.from({ length: pages }, (_, i) => `<button type="button" class="home-carousel-dot${i === page ? " active" : ""}" aria-label="Go to page ${i + 1}"></button>`).join("");
        dotsWrap.querySelectorAll(".home-carousel-dot").forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));
      } else dots.forEach((dot, i) => dot.classList.toggle("active", i === page));
      const ms = maxScroll();
      arrows[0].disabled = track.scrollLeft <= 2;
      arrows[1].disabled = ms <= 2 || track.scrollLeft >= ms - 2;
    }
    function goTo(i) {
      const pages = pageCount();
      const page = Math.max(0, Math.min(i, pages - 1));
      track.scrollTo({ left: Math.min(page * step(), maxScroll()), behavior: "smooth" });
      requestAnimationFrame(sync);
    }
    arrows[0].addEventListener("click", () => goTo(currentPage() - 1));
    arrows[1].addEventListener("click", () => goTo(currentPage() + 1));
    let tick = 0;
    track.addEventListener("scroll", () => { if (tick) return; tick = requestAnimationFrame(() => { tick = 0; sync(); }); }, { passive: true });
    window.addEventListener("resize", () => setTimeout(sync, 150));
    sync();
  }

  function lsdForYear(base, year) {
    const f = 1 - (2025 - year) * 0.032;
    const s = (v) => Math.round(v * f);
    return {
      ...base,
      supply: s(base.supply),
      emirati: s(base.emirati),
      nonEmirati: s(base.nonEmirati),
      demand: s(base.demand),
      gap: s(base.gap),
      groups: base.groups.map((g) => ({ name: g.name, value: s(g.value) })),
    };
  }

  function lsdFmt(v) {
    const t = (n) => n.toFixed(1).replace(/\.0$/, "");
    if (Math.abs(v) >= 1e6) return t(v / 1e6) + "M";
    if (Math.abs(v) >= 1e3) return t(v / 1e3) + "K";
    return String(Math.round(v));
  }

  let dgSparkId = 0;

  function dgSmoothPath(pts, fmt) {
    if (pts.length < 3) {
      return `M${pts.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join(" L")}`;
    }
    let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${fmt(c1x)} ${fmt(c1y)}, ${fmt(c2x)} ${fmt(c2y)}, ${fmt(p2[0])} ${fmt(p2[1])}`;
    }
    return d;
  }

  function buildDgSparkline(points, color) {
    const pts = points
      .trim()
      .split(/\s+/)
      .map((pair) => {
        const [x, y] = pair.split(",").map(Number);
        return [1 + (x / 100) * 82, (y / 32) * 27];
      });
    if (!pts.length) return "";
    const fmt = (n) => Math.round(n * 100) / 100;
    const line = dgSmoothPath(pts, fmt);
    const first = pts[0];
    const last = pts[pts.length - 1];
    const area = `${line} L${fmt(last[0])} 27 L${fmt(first[0])} 27 Z`;
    const gid = "dgSparkGrad" + dgSparkId++;
    return `<svg viewBox="0 0 84 30" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0.02"/>
    </linearGradient>
  </defs>
  <path fill="url(#${gid})" d="${area}"/>
  <path fill="none" stroke="${color}" stroke-width="1.75" vector-effect="non-scaling-stroke" d="${line}"/>
</svg>`;
  }

  function buildDgMultiSeriesChart(series) {
    const fmt = (n) => Math.round(n * 100) / 100;
    const W = 240;
    const H = 40;
    const pad = 4;
    const plotW = W - pad * 2;
    const plotH = H - pad * 2;
    const plotBottom = pad + plotH;
    const allVals = series.flatMap((s) => s.points);
    const rawMin = Math.min(...allVals);
    const rawMax = Math.max(...allVals);
    const yMin = Math.floor(rawMin) - 0.2;
    const yMax = Math.ceil(rawMax) + 0.2;
    const ySpan = yMax - yMin || 1;
    const toX = (i, count) => pad + (i / (count - 1)) * plotW;
    const toY = (v) => pad + plotH - ((v - yMin) / ySpan) * plotH;
    const yTickCount = 4;
    let gridHtml = "";
    for (let i = 0; i <= yTickCount; i++) {
      const val = yMin + (i / yTickCount) * ySpan;
      const y = toY(val);
      gridHtml += `<line class="cpi-chart-grid" x1="${pad}" y1="${fmt(y)}" x2="${W - pad}" y2="${fmt(y)}" stroke-width="0.75" stroke-dasharray="2 3"/>`;
    }
    const pointCount = series[0].points.length;
    for (let i = 0; i < pointCount; i++) {
      const x = toX(i, pointCount);
      gridHtml += `<line class="cpi-chart-grid" x1="${fmt(x)}" y1="${pad}" x2="${fmt(x)}" y2="${plotBottom}" stroke-width="0.75" stroke-dasharray="2 3"/>`;
    }
    const pathsHtml = series
      .map((s) => {
        const pts = s.points.map((v, i) => [toX(i, s.points.length), toY(v)]);
        const line = dgSmoothPath(pts, fmt);
        const dashAttr = s.dash ? ' stroke-dasharray="4 3"' : "";
        return `<path fill="none" stroke="${s.color}" stroke-width="1.75"${dashAttr} vector-effect="non-scaling-stroke" d="${line}"/>`;
      })
      .join("\n  ");
    const ariaLabel = series.map((s) => `${s.label} ${s.value}`).join(", ");
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${ariaLabel} line chart">
  ${gridHtml}
  ${pathsHtml}
</svg>`;
  }

  function buildDgChartLegend(series) {
    return `<div class="obs-chart-legend">${series
      .map(
        (s) => `<div class="obs-chart-legend-item">
      <span class="obs-chart-legend-line${s.dash ? " obs-chart-legend-line--dashed" : ""}" style="--legend-color:${s.color}"></span>
      <span>${s.label}</span>
    </div>`
      )
      .join("")}</div>`;
  }

  function buildOverviewHTML() {
    const d = LSD_DATA.age;
    const emiratiPct = ((d.emirati / d.supply) * 100).toFixed(1);
    const nonEmiratiPct = ((d.nonEmirati / d.supply) * 100).toFixed(1);
    const gapRate = ((d.gap / d.demand) * 100).toFixed(1);
    const topBand = d.groups.reduce((a, b) => (b.value > a.value ? b : a));

    const trendYears = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const supplyTrend = trendYears.map((y) => lsdForYear(d, y).supply / 1e6);
    const demandTrend = trendYears.map((y) => lsdForYear(d, y).demand / 1e6);

    const balanceMetrics = [
      {
        label: "Supply",
        value: lsdFmt(d.supply),
        valClass: "cpi-kpi-val--supply",
        points: supplyTrend,
        color: "#2563eb",
        dash: false,
      },
      {
        label: "Demand",
        value: lsdFmt(d.demand),
        valClass: "cpi-kpi-val--demand",
        points: demandTrend,
        color: "#7ec89a",
        dash: true,
      },
    ];

    const gapMetrics = [
      {
        label: "Surplus",
        rows: [
          { value: lsdFmt(d.gap), unit: "Gap", dir: "warn" },
          { value: `${gapRate}%`, unit: "of demand", dir: "warn" },
        ],
      },
      {
        label: "Trend",
        rows: [
          { value: "+8.2%", unit: "YoY", dir: "up" },
          { value: "+1.4%", unit: "MoM", dir: "up" },
        ],
      },
    ];

    const mixMetrics = [
      {
        label: "Emirati",
        value: lsdFmt(d.emirati),
        tier: `${emiratiPct}% supply`,
        chg: "+0.3%",
        spark: "0,22 20,19 40,17 60,14 80,11 100,8",
      },
      {
        label: "Non-Emirati",
        value: lsdFmt(d.nonEmirati),
        tier: `${nonEmiratiPct}% supply`,
        chg: "+0.1%",
        spark: "0,24 20,21 40,20 60,17 80,15 100,12",
      },
      {
        label: topBand.name,
        value: lsdFmt(topBand.value),
        tier: "Largest band",
        chg: "+2.1%",
        spark: "0,26 20,22 40,19 60,16 80,13 100,9",
      },
    ];

    const balanceCard = `<div class="obs-card kpi-card kpi-card--cpi">
  <div class="ov-card-title"><i class="ti ti-chart-bar"></i> Labor Balance</div>
  <div class="cpi-kpi-row">${balanceMetrics
    .map(
      (m) => `<div class="cpi-kpi">
    <div class="kpi-label">${m.label}</div>
    <div class="cpi-kpi-val ${m.valClass}">${m.value}</div>
  </div>`
    )
    .join("")}</div>
  <div class="cpi-chart-wrap">${buildDgMultiSeriesChart(balanceMetrics)}</div>
  ${buildDgChartLegend(balanceMetrics)}
</div>`;

    const gapCard = `<div class="obs-card kpi-card kpi-card--infl">
  <div class="ov-card-title"><i class="ti ti-trending-up"></i> Supply–Demand Gap</div>
  <div class="ov-metrics cols-2">${gapMetrics
    .map(
      (m) => `<div class="ov-metric">
    <div class="kpi-label">${m.label}</div>
    <div class="infl-rows">${m.rows
      .map(
        (r) => `<div class="infl-row infl-row--${r.dir}">
      <span class="infl-icon"><i class="ti ti-arrow-${r.dir === "down" ? "down" : "up"}"></i></span>
      <span class="infl-figure"><span class="infl-val">${r.value}</span><span class="infl-unit">${r.unit}</span></span>
    </div>`
      )
      .join("")}</div>
  </div>`
    )
    .join("")}</div>
</div>`;

    const mixCard = `<div class="obs-card kpi-card kpi-card--essentials">
  <div class="ov-card-title"><i class="ti ti-chart-pie"></i> Workforce by</div>
  <div class="cpiby-rows">${mixMetrics
    .map(
      (m) => `<div class="cpiby-row">
    <span class="cpiby-row-label">${m.label}</span>
    <span class="cpiby-row-val">${m.value}</span>
    <span class="cpiby-row-meta">${m.tier} <span class="up">${m.chg}</span></span>
    <span class="cpiby-row-spark">${buildDgSparkline(m.spark, "#2563eb")}</span>
  </div>`
    )
    .join("")}</div>
</div>`;

    return `<section class="lmo-dg-overview">
  ${buildSectionHdr("Overview", "ti-layout-grid")}
  <div class="lmo-dg-overview-grid">${balanceCard}${gapCard}${mixCard}</div>
</section>`;
  }

  function lsdSankeySVG(d) {
    const W = 1060,
      H = 340,
      sideBarW = 64,
      groupW = 92,
      natBadgeW = 88,
      minGroupH = 28,
      badgeMinH = 26,
      mL = 100,
      mR = 120,
      padT = 56,
      padB = 20,
      edgePad = 8;
    const chartH = H - padT - padB;
    const eShare = d.emirati / (d.emirati + d.nonEmirati);
    const dShare = d.demand / (d.demand + d.gap);
    const bandTone = (i) => "group-" + (i % LSD_BAND_COLORS.length);

    function insideLabel(x, y, w, h, title, value, textClass, forceTwoLine) {
      const cx = x + w / 2;
      const cls = `lsd-sankey-text ${textClass || "lsd-sankey-text--on-dark"}`;
      if (!forceTwoLine && h < 26) {
        return `<text class="${cls}" x="${cx}" y="${(y + h / 2 + 3).toFixed(1)}" text-anchor="middle">${title} ${value}</text>`;
      }
      const titleY = y + h / 2 - 4;
      const valY = y + h / 2 + 7;
      return `<text class="${cls}" x="${cx}" y="${titleY.toFixed(1)}" text-anchor="middle">${title}</text><text class="${cls}" x="${cx}" y="${valY.toFixed(1)}" text-anchor="middle">${value}</text>`;
    }

    const tipPct = (value, base) =>
      ((value / (base || 1)) * 100).toFixed(1) + "%";

    const cols = [
      [{ id: "supply", name: "Labor Supply", value: d.supply, tone: "supply" }],
      [
        { id: "emirati", name: "Emirati", value: d.emirati, tone: "emirati" },
        {
          id: "nonemirati",
          name: "Non-Emirati",
          value: d.nonEmirati,
          tone: "nonemirati",
        },
      ],
      d.groups.map((g, i) => ({
        id: "g" + i,
        name: g.name,
        value: g.value,
        tone: bandTone(i),
        groupIdx: i,
      })),
      [
        { id: "demand", name: "Demand", value: d.demand, tone: "demand" },
        { id: "gap", name: "Gap", value: d.gap, tone: "gap" },
      ],
    ];
    const chartW = W - mL - mR;
    const xs = [
      mL,
      Math.round(mL + chartW * 0.22),
      Math.round(mL + chartW * 0.42),
      mL + chartW - sideBarW,
    ];
    const gaps = [0, 28, 5, 28];
    const totals = cols.map((c) => c.reduce((s, n) => s + n.value, 0));
    const scale = (chartH * 0.88) / Math.max(...totals);
    const bandH = (n) =>
      n.groupIdx != null ? Math.max(minGroupH, n.value * scale) : Math.max(2, n.value * scale);
    const N = {};
    cols.forEach((c, ci) => {
      const g = gaps[ci];
      const stackH =
        c.reduce((s, n) => s + bandH(n), 0) +
        (c.length - 1) * g;
      let y = padT + (chartH - stackH) / 2;
      c.forEach((n) => {
        const h = bandH(n);
        N[n.id] = { ...n, x: xs[ci], y, h, outY: y, inY: y };
        y += h + g;
      });
    });
    const nodeOutX = (n) => {
      if (n.groupIdx != null) return n.x + groupW;
      if (n.tone === "emirati" || n.tone === "nonemirati") return n.x + natBadgeW;
      return n.x + sideBarW;
    };
    const links = [];
    links.push({ s: "supply", t: "emirati", v: d.emirati, tone: "emirati" });
    links.push({
      s: "supply",
      t: "nonemirati",
      v: d.nonEmirati,
      tone: "nonemirati",
    });
    d.groups.forEach((g, i) => {
      links.push({
        s: "emirati",
        t: "g" + i,
        v: g.value * eShare,
        tone: "emirati",
      });
      links.push({
        s: "nonemirati",
        t: "g" + i,
        v: g.value * (1 - eShare),
        tone: bandTone(i),
      });
    });
    d.groups.forEach((g, i) => {
      links.push({
        s: "g" + i,
        t: "demand",
        v: g.value * dShare,
        tone: bandTone(i),
      });
      links.push({
        s: "g" + i,
        t: "gap",
        v: g.value * (1 - dShare),
        tone: "gap",
      });
    });
    const linkLayouts = links.map((l) => {
      const sn = N[l.s],
        tn = N[l.t],
        h = Math.max(0.5, l.v * scale);
      const y0 = sn.outY;
      sn.outY += h;
      const y1 = tn.inY;
      tn.inY += h;
      const x0 = nodeOutX(sn),
        x1 = tn.x,
        xm = (x0 + x1) / 2;
      const dp = `M${x0},${y0.toFixed(1)} C${xm},${y0.toFixed(1)} ${xm},${y1.toFixed(1)} ${x1},${y1.toFixed(1)} L${x1},${(y1 + h).toFixed(1)} C${xm},${(y1 + h).toFixed(1)} ${xm},${(y0 + h).toFixed(1)} ${x0},${(y0 + h).toFixed(1)} Z`;
      return { l, dp, v: l.v };
    });
    const groupTotal = d.groups.reduce((s, g) => s + g.value, 0) || d.supply;
    const linkTip = (l) => {
      const sn = N[l.s],
        tn = N[l.t];
      let detail = lsdFmt(l.v);
      if (sn.tone === "emirati" || sn.tone === "nonemirati") {
        detail += ` · ${tipPct(l.v, sn.value)}`;
      } else if (tn.tone === "emirati" || tn.tone === "nonemirati") {
        detail += ` · ${tipPct(l.v, d.emirati + d.nonEmirati)}`;
      } else if (tn.tone === "demand" || tn.tone === "gap") {
        detail += ` · ${tipPct(l.v, d.demand + d.gap)}`;
      } else if (tn.groupIdx != null) {
        detail += ` · ${tipPct(l.v, groupTotal)}`;
      }
      return `${sn.name} → ${tn.name}&#10;${detail}`;
    };
    const linkSVG = linkLayouts
      .slice()
      .sort((a, b) => b.v - a.v)
      .map(
        ({ l, dp }) =>
          `<path class="lsd-link lsd-link--${l.tone}" data-s="${l.s}" data-t="${l.t}" data-tip="${linkTip(l)}" d="${dp}"></path>`
      )
      .join("");
    let nodeSVG = "",
      labelSVG = "";
    Object.values(N).forEach((n) => {
      const cy = n.y + n.h / 2;
      if (n.groupIdx != null) {
        const gi = n.groupIdx % LSD_BAND_COLORS.length;
        const share = tipPct(n.value, groupTotal);
        const badgeH = Math.max(badgeMinH, Math.min(n.h - 2, n.h * 0.92));
        const badgeY = n.y + (n.h - badgeH) / 2;
        nodeSVG += `<rect class="lsd-gnode lsd-gnode--${gi}" data-id="${n.id}" data-tip="${n.name}&#10;${lsdFmt(n.value)} · ${share}" x="${n.x}" y="${badgeY.toFixed(1)}" width="${groupW}" height="${badgeH.toFixed(1)}" rx="6"></rect>`;
        labelSVG += insideLabel(n.x, badgeY, groupW, badgeH, n.name, lsdFmt(n.value));
        return;
      }
      let tip = `${n.name}&#10;${lsdFmt(n.value)}`;
      if (n.tone === "emirati" || n.tone === "nonemirati") {
        tip += ` · ${tipPct(n.value, d.emirati + d.nonEmirati)}`;
      } else if (n.tone === "demand" || n.tone === "gap") {
        tip += ` · ${tipPct(n.value, d.demand + d.gap)}`;
      }
      if (n.tone === "supply") {
        nodeSVG += `<rect class="lsd-node lsd-node--supply" data-id="${n.id}" data-tip="${tip}" x="${n.x}" y="${n.y.toFixed(1)}" width="${sideBarW}" height="${n.h.toFixed(1)}" rx="4"></rect>`;
        labelSVG += insideLabel(n.x, n.y, sideBarW, n.h, n.name, lsdFmt(n.value));
      } else if (n.tone === "emirati" || n.tone === "nonemirati") {
        const nbH = Math.max(28, n.h);
        const nbY = cy - nbH / 2;
        nodeSVG += `<rect class="lsd-node lsd-node--${n.tone}" data-id="${n.id}" data-tip="${tip}" x="${n.x}" y="${nbY.toFixed(1)}" width="${natBadgeW}" height="${nbH.toFixed(1)}" rx="4"></rect>`;
        labelSVG += insideLabel(n.x, nbY, natBadgeW, nbH, n.name, lsdFmt(n.value), null, true);
      } else if (n.tone === "demand") {
        nodeSVG += `<rect class="lsd-node lsd-node--demand" data-id="${n.id}" data-tip="${tip}" x="${n.x}" y="${n.y.toFixed(1)}" width="${sideBarW}" height="${n.h.toFixed(1)}" rx="4"></rect>`;
        labelSVG += insideLabel(n.x, n.y, sideBarW, n.h, n.name, lsdFmt(n.value));
      } else if (n.tone === "gap") {
        const gbH = Math.max(minGroupH, n.h);
        const gbY = cy - gbH / 2;
        nodeSVG += `<rect class="lsd-node lsd-node--gap" data-id="${n.id}" data-tip="${tip}" x="${n.x}" y="${gbY.toFixed(1)}" width="${sideBarW}" height="${gbH.toFixed(1)}" rx="4"></rect>`;
        labelSVG += insideLabel(n.x, gbY, sideBarW, gbH, n.name, lsdFmt(n.value));
      }
    });
    const vbX = -edgePad;
    const vbY = -edgePad;
    const vbW = W + edgePad * 2;
    const vbH = H + edgePad * 2;
    return `<svg viewBox="${vbX} ${vbY} ${vbW} ${vbH}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Labor supply-demand Sankey by ${d.label.toLowerCase()}">${linkSVG}${nodeSVG}${labelSVG}</svg>`;
  }

  function lsdTableHTML(d) {
    const eShare = d.emirati / (d.emirati + d.nonEmirati);
    const dShare = d.demand / (d.demand + d.gap);
    const cats = [
      { name: "Emirati", icon: "ti-user-star", share: eShare },
      { name: "Non-Emirati", icon: "ti-users", share: 1 - eShare },
    ];
    const rows = cats
      .map((c) =>
        d.groups
          .map((g) => {
            const supply = g.value * c.share,
              demand = supply * dShare,
              gap = supply * (1 - dShare);
            return `<tr><td><span class="dg-cat-cell"><i class="ti ${c.icon}"></i> ${c.name}</span></td><td>${g.name}</td><td>${lsdFmt(supply)}</td><td>${lsdFmt(demand)}</td><td><span class="lmo-neg">${lsdFmt(gap)}</span></td></tr>`;
          })
          .join("")
      )
      .join("");
    return `<div class="dg-table-wrap"><table class="dg-table"><thead><tr><th>Workforce category</th><th>${d.label}</th><th>Supply</th><th>Demand</th><th>Gap</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function render() {
    const yearOptions = LSD_YEARS.map(
      (y) => `<option value="${y}"${y === 2025 ? " selected" : ""}>${y}</option>`
    ).join("");

    const lsdSection = `<section class="lmo-lsd">
  <div class="obs-card lmo-lsd-card">
    <div class="lmo-lsd-hdr">
      <h2 class="cpi-section-title"><i class="ti ti-git-fork" aria-hidden="true"></i>Labor Supply–Demand Analysis</h2>
      <div class="lmo-lsd-hdr-actions">
        <button type="button" class="home-module-sparkle" title="Ask Bayaan AI" aria-label="Ask Bayaan AI" onclick="openChat('Summarise the labour supply-demand gap patterns and flag priority cohorts','Labor Supply–Demand Analysis')"><i class="ti ti-sparkles"></i></button>
        <button type="button" class="lmo-qa" title="Download" aria-label="Download"><i class="ti ti-download"></i></button>
      </div>
    </div>
    <div class="lmo-lsd-toolbar">
      <div class="lmo-lsd-tabs" role="tablist" aria-label="Labor supply-demand dimension">
        <button type="button" class="lmo-lsd-tab active" role="tab" aria-selected="true" data-lsd-dim="age">Labor Supply-Demand Gap by Age</button>
        <button type="button" class="lmo-lsd-tab" role="tab" aria-selected="false" data-lsd-dim="education">Labor Supply-Demand Gap by Education</button>
      </div>
      <div class="lmo-lsd-controls">
        <select id="lmoLsdYear" class="lmo-lsd-year-select" aria-label="Year">${yearOptions}</select>
        <div class="dg-view-toggle lmo-lsd-viztoggle" role="group" aria-label="Visualization type">
          <button type="button" class="active" data-lsd-view="sankey" title="Sankey chart" aria-label="Sankey chart"><i class="ti ti-hierarchy-2"></i></button>
          <button type="button" data-lsd-view="table" title="Table view" aria-label="Table view"><i class="ti ti-table"></i></button>
        </div>
      </div>
    </div>
    <div class="lmo-lsd-body">
      <div class="lmo-lsd-viz" id="lmoLsdViz"></div>
    </div>
    <div class="lmo-lsd-tip" id="lmoLsdTip" role="tooltip" aria-hidden="true"></div>
  </div>
</section>`;

    const newsSection = `<section class="lmo-news">
  <div class="dg-carousel lmo-news-carousel">
    <div class="lmo-news-hdr">
      <div class="lmo-news-hdr-lead">
        ${buildSectionHdr("News", "ti-rss")}
        <p class="lmo-news-sub">Authoritative news and statistical briefings to support data-driven decisions across Abu Dhabi's labour market.</p>
      </div>
    </div>
    <div class="dg-track lmo-news-track">${LSD_NEWS.map(buildNewsCard).join("")}</div>
    <div class="dg-carousel-nav home-carousel-nav">
      <button type="button" class="home-carousel-arrow" aria-label="Previous"><i class="ti ti-chevron-left"></i></button>
      <div class="home-carousel-dots"></div>
      <button type="button" class="home-carousel-arrow" aria-label="Next"><i class="ti ti-chevron-right"></i></button>
    </div>
  </div>
</section>`;

    return buildOverviewHTML() + lsdSection + newsSection;
  }

  function init(root) {
    if (root) root.querySelectorAll(".dg-carousel").forEach(initDgCarousel);
    const sec = root && root.querySelector(".lmo-lsd");
    if (!sec) return;
    const viz = sec.querySelector("#lmoLsdViz");
    const tip = sec.querySelector("#lmoLsdTip");
    const card = sec.querySelector(".lmo-lsd-card");
    const state = { dim: "age", year: 2025, view: "sankey" };
    const setActive = (sel, el) =>
      sec.querySelectorAll(sel).forEach((b) => {
        const on = b === el;
        b.classList.toggle("active", on);
        if (b.hasAttribute("aria-selected"))
          b.setAttribute("aria-selected", on ? "true" : "false");
      });
    const note = () =>
      LSD_DATA[state.dim].placeholder
        ? `<div class="lmo-lsd-note"><i class="ti ti-info-circle"></i> Illustrative education-level split — connect the official SCAD attainment dataset to replace these values.</div>`
        : "";

    function showTip(e, el) {
      const parts = (el.getAttribute("data-tip") || "").split("\n");
      tip.innerHTML = `<b>${parts[0] || ""}</b>${parts[1] ? "<br>" + parts[1] : ""}`;
      tip.classList.add("on");
      const cr = card.getBoundingClientRect();
      tip.style.left = e.clientX - cr.left + 12 + "px";
      tip.style.top = e.clientY - cr.top + 12 + "px";
    }
    const hideTip = () => tip.classList.remove("on");

    function wireSankey() {
      const wrap = viz.querySelector(".lmo-lsd-sankey");
      const svg = wrap && wrap.querySelector("svg");
      if (!svg) return;
      const clear = () => {
        wrap.classList.remove("is-hi");
        svg.querySelectorAll(".lsd-on").forEach((x) => x.classList.remove("lsd-on"));
        hideTip();
      };
      svg.querySelectorAll(".lsd-node, .lsd-gnode").forEach((node) => {
        node.addEventListener("mouseenter", () => {
          const id = node.dataset.id;
          wrap.classList.add("is-hi");
          svg.querySelectorAll(".lsd-link").forEach((l) =>
            l.classList.toggle("lsd-on", l.dataset.s === id || l.dataset.t === id)
          );
        });
        node.addEventListener("mousemove", (e) => showTip(e, node));
        node.addEventListener("mouseleave", clear);
      });
      svg.querySelectorAll(".lsd-link").forEach((link) => {
        link.addEventListener("mouseenter", () => {
          wrap.classList.add("is-hi");
          link.classList.add("lsd-on");
        });
        link.addEventListener("mousemove", (e) => showTip(e, link));
        link.addEventListener("mouseleave", clear);
      });
    }

    function renderViz() {
      const d = lsdForYear(LSD_DATA[state.dim], state.year);
      if (state.view === "sankey") {
        viz.innerHTML = `<div class="lmo-lsd-sankey">${lsdSankeySVG(d)}</div>${note()}`;
        wireSankey();
      } else {
        viz.innerHTML = lsdTableHTML(d) + note();
      }
      if (window.LMO && LMO.reportEmbedHeight) {
        setTimeout(LMO.reportEmbedHeight, 80);
      }
    }

    sec.querySelectorAll("[data-lsd-dim]").forEach((b) =>
      b.addEventListener("click", () => {
        state.dim = b.dataset.lsdDim;
        setActive("[data-lsd-dim]", b);
        renderViz();
      })
    );
    const yearSelect = sec.querySelector("#lmoLsdYear");
    if (yearSelect) {
      yearSelect.addEventListener("change", () => {
        state.year = +yearSelect.value;
        renderViz();
      });
    }
    sec.querySelectorAll("[data-lsd-view]").forEach((b) =>
      b.addEventListener("click", () => {
        state.view = b.dataset.lsdView;
        setActive("[data-lsd-view]", b);
        renderViz();
      })
    );
    renderViz();
    if (window.LMO && LMO.onThemeChange) {
      LMO.onThemeChange(renderViz);
    }
  }

  window.LMO_LSD = { render, init };
})();
