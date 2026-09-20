/* CPI Dashboard — synced from CPI dashbord.html */
/* ── Demo data (Abu Dhabi CPI, Base 2021 = 100) ── */
const CPID_QUARTERS = [
  "2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4",
  "2025 Q1", "2025 Q2", "2025 Q3", "2025 Q4",
];
const CPID_GENERAL = [105.6, 106.3, 106.5, 106.0, 106.0, 105.8, 106.4, 107.4];
const CPID_GROWTH_Q = ["2024 Q4", "2025 Q1", "2025 Q2", "2025 Q3", "2025 Q4"];
const CPID_GROWTH_YOY = [0.7, 0.5, 0.1, 0.6, 1.3];

/* Commodity groups — colour, weight and Q4-2025 index level. Palette is a
   restrained categorical set anchored on the app accent. */
const CPID_GROUPS = [
  { name: "General Index", icon: "ti-chart-bar", color: "#0066ff", weight: "100.0%", cpi: 107.4, mom: "+0.9%", yoy: "+1.3%" },
  { name: "Food and beverages", icon: "ti-tools-kitchen-2", color: "#f5a623", weight: "12.0%", cpi: 114.6, mom: "+1.1%", yoy: "+4.7%" },
  { name: "Tobacco", icon: "ti-bottle", color: "#8a3a26", weight: "0.2%", cpi: 101.2, mom: "+0.7%", yoy: "+0.9%" },
  { name: "Clothing and footwear", icon: "ti-shirt", color: "#34c99a", weight: "4.9%", cpi: 95.7, mom: "-0.9%", yoy: "-3.6%" },
  { name: "Housing & utilities", icon: "ti-home", color: "#5b8bd9", weight: "33.6%", cpi: 108.9, mom: "+0.4%", yoy: "+2.4%" },
  { name: "Transport", icon: "ti-car", color: "#7c3aed", weight: "14.0%", cpi: 110.6, mom: "+1.4%", yoy: "+5.6%" },
  { name: "Education", icon: "ti-school", color: "#0ea5a3", weight: "7.6%", cpi: 103.9, mom: "0.0%", yoy: "-0.4%" },
  { name: "Health", icon: "ti-stethoscope", color: "#e5484d", weight: "2.2%", cpi: 107.4, mom: "-0.3%", yoy: "-1.2%" },
  { name: "Communication", icon: "ti-device-mobile", color: "#64748b", weight: "5.7%", cpi: 102.3, mom: "+0.1%", yoy: "+0.8%" },
  { name: "Recreation & culture", icon: "ti-device-tv", color: "#d97706", weight: "3.9%", cpi: 118.3, mom: "-1.2%", yoy: "-0.6%" },
  { name: "Restaurants & hotels", icon: "ti-building-store", color: "#2f9e6f", weight: "3.6%", cpi: 103.8, mom: "+0.8%", yoy: "-2.1%" },
  { name: "Personal care", icon: "ti-basket", color: "#9333ea", weight: "4.6%", cpi: 109.9, mom: "-0.1%", yoy: "+0.1%" },
  { name: "Insurance & finance", icon: "ti-coin", color: "#0891b2", weight: "1.2%", cpi: 115.4, mom: "+0.6%", yoy: "+4.6%" },
];

/* Quarterly index matrix — 14 commodity groups × 16 quarters (2022 Q1 →
   2025 Q4). Drives the CPI Over Time table and the Main Indicators
   relative-change tables (Q4'25 vs Q3'25 and vs Q4'24). */
const CPID_OT_YEARS = ["2022", "2023", "2024", "2025"];
const CPID_OT = [
  { name: "General Index", v: [102.6,106.5,107.6,105.5, 104.8,105.1,106.1,106.2, 105.6,106.3,106.5,106.0, 106.0,105.8,106.4,107.4] },
  { name: "Food and beverages", v: [104.4,107.4,109.7,111.5, 110.2,111.9,111.7,111.5, 111.7,112.2,113.7,114.0, 112.7,111.9,112.8,114.6] },
  { name: "Tobacco", v: [100.0,99.5,99.8,99.8, 99.6,98.7,99.1,99.1, 98.7,99.5,100.5,100.5, 100.5,100.4,101.3,101.2] },
  { name: "Clothing and footwear", v: [100.1,100.5,101.2,103.6, 101.9,102.7,104.0,102.8, 106.8,107.3,107.8,108.4, 108.0,105.6,98.7,95.7] },
  { name: "Housing, water, electricity, gas and other fuels", v: [99.7,99.6,99.5,99.7, 99.3,99.6,100.6,101.1, 100.2,100.0,101.0,101.6, 101.9,102.5,103.6,105.4] },
  { name: "Furnishings, household equipment and routine household maintenance", v: [98.4,98.5,98.5,100.1, 98.7,99.1,100.3,101.6, 101.9,98.3,98.0,97.7, 97.7,97.6,101.8,103.0] },
  { name: "Health", v: [104.5,106.1,106.1,106.1, 106.1,106.1,112.1,112.1, 112.4,112.4,112.4,112.4, 112.4,112.4,112.4,112.4] },
  { name: "Transport", v: [111.9,133.1,139.6,120.5, 114.0,115.4,120.2,118.5, 113.6,119.7,114.5,107.2, 108.3,105.0,108.3,107.5] },
  { name: "Communication", v: [100.4,100.2,100.1,100.1, 100.8,100.6,100.7,100.6, 99.8,99.7,100.0,100.1, 100.1,99.7,99.9,100.6] },
  { name: "Recreation and culture", v: [102.3,114.5,110.4,105.4, 110.9,106.1,98.5,102.0, 102.3,103.4,108.8,112.9, 109.8,113.9,106.4,110.4] },
  { name: "Education", v: [101.6,101.5,102.6,102.6, 103.3,103.2,104.4,104.4, 104.4,104.4,104.4,104.4, 104.4,104.4,104.4,104.4] },
  { name: "Restaurants and hotels", v: [107.1,107.9,109.5,115.0, 123.5,123.2,122.7,122.5, 124.1,123.0,123.1,124.4, 123.9,127.0,126.1,126.9] },
  { name: "Insurance and financial services", v: [98.6,97.8,95.9,95.9, 97.5,95.5,95.9,99.7, 99.3,99.5,103.6,103.7, 108.0,110.3,110.5,110.5] },
  { name: "Personal care, social protection and miscellaneous goods", v: [101.1,101.3,101.8,102.3, 103.1,103.8,103.5,104.2, 106.0,106.0,108.9,110.7, 111.0,110.4,112.2,113.8] },
];

/* Per-row icon + colour for the commodity tables, in CPID_OT order. */
const CPID_OT_META = [
  { icon: "ti-chart-line", color: "#0066ff" },
  { icon: "ti-tools-kitchen-2", color: "#f5a623" },
  { icon: "ti-bottle", color: "#8a3a26" },
  { icon: "ti-shirt", color: "#34c99a" },
  { icon: "ti-home", color: "#5b8bd9" },
  { icon: "ti-sofa", color: "#7c5cff" },
  { icon: "ti-stethoscope", color: "#e5484d" },
  { icon: "ti-car", color: "#7c3aed" },
  { icon: "ti-wifi", color: "#64748b" },
  { icon: "ti-device-tv", color: "#d97706" },
  { icon: "ti-school", color: "#0ea5a3" },
  { icon: "ti-building-store", color: "#2f9e6f" },
  { icon: "ti-coin", color: "#0891b2" },
  { icon: "ti-basket", color: "#9333ea" },
];

/* Annual growth rate (YoY %), Abu Dhabi Emirate — 2023 Q1 → 2025 Q4.
   Positive tones red, negative green (the CPI observatory convention). */
const CPID_GR_YEARS = ["2023", "2024", "2025"];
const CPID_GR_BARS = [2.9, -0.2, -0.2, 1.2, 0.9, 1.4, 1.6, 1.2, 1.2, 1.0, 0.1, 0.7];

/* Chart.js shared theme — Inter, app tooltip/grid styling (matches the
   GCC trend chart in index.html). */
function cpidTheme() {
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    tick: dark ? "#8b93a7" : "#9aa0b0",
    grid: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
    border: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
    tipBg: dark ? "#141a26" : "#fff",
    tipBorder: dark ? "rgba(255,255,255,0.12)" : "#e0e3ec",
    tipTitle: dark ? "#e6eaf2" : "#0f1117",
    tipBody: dark ? "#aab2c2" : "#5a6070",
  };
}
if (typeof Chart !== "undefined") {
  Chart.defaults.font.family = "Inter, system-ui, sans-serif";
  Chart.defaults.font.size = 11;
}
const cpidTip = (extra = {}) => {
  const t = cpidTheme();
  return {
    backgroundColor: t.tipBg,
    borderColor: t.tipBorder,
    borderWidth: 1,
    titleColor: t.tipTitle,
    bodyColor: t.tipBody,
    padding: 10,
    cornerRadius: 8,
    displayColors: false,
    ...extra,
  };
};
/* Vertical gradient fill under a line (top-down fade) — same idiom as the
   app's area sparklines. */
function cpidAreaFill(ctx, color) {
  const { chartArea } = ctx.chart;
  if (!chartArea) return "transparent";
  const g = ctx.chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  g.addColorStop(0, color + "3d");
  g.addColorStop(1, color + "05");
  return g;
}

const cpidCharts = {};
const CPID_EASE = { duration: 850, easing: "easeInOutCubic" };

/* Resolve a Tabler icon class (e.g. "ti-home") to its font glyph + family
   so it can be painted onto a canvas. Reads the ::before content the same
   way the CSS does, so it stays correct across Tabler versions. Cached. */
const cpidIconCache = {};
function cpidIconGlyph(cls) {
  if (cpidIconCache[cls]) return cpidIconCache[cls];
  const probe = document.createElement("i");
  probe.className = "ti " + cls;
  probe.style.cssText = "position:absolute;left:-9999px;visibility:hidden";
  document.body.appendChild(probe);
  const cs = getComputedStyle(probe, "::before");
  const raw = (cs.content || "").replace(/^["']|["']$/g, "");
  const glyph = { ch: raw === "none" ? "" : raw, fam: cs.fontFamily || "tabler-icons" };
  document.body.removeChild(probe);
  cpidIconCache[cls] = glyph;
  return glyph;
}

function cpidLineChart(id, labels, data, color, opts = {}) {
  const el = document.getElementById(id);
  if (!el || cpidCharts[id]) return;
  const t = cpidTheme();
  cpidCharts[id] = new Chart(el.getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: opts.label || "",
        data,
        borderColor: color,
        borderWidth: 2.5,
        fill: true,
        backgroundColor: (c) => cpidAreaFill(c, color),
        tension: 0.4,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointBorderWidth: 1.5,
        pointRadius: opts.pointRadius ?? 3,
        pointHoverRadius: 5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: CPID_EASE,
      interaction: { mode: "index", intersect: false },
      layout: { padding: { top: 4 } },
      plugins: {
        legend: { display: false },
        tooltip: cpidTip({ callbacks: { label: (c) => "  " + c.parsed.y.toFixed(opts.dp ?? 1) + (opts.suffix || "") } }),
      },
      scales: {
        x: {
          grid: { display: false, drawTicks: false },
          border: { color: t.border },
          ticks: { color: t.tick, font: { size: 10 }, padding: 6, maxRotation: 0, autoSkipPadding: 12 },
        },
        y: {
          display: opts.showY ?? true,
          grid: { color: t.grid, drawTicks: false },
          border: { display: false },
          ticks: { color: t.tick, font: { size: 10 }, padding: 8, maxTicksLimit: 6, callback: (v) => v + (opts.suffix || "") },
        },
      },
    },
  });
}

function cpidInit() {
  /* Overview — CPI Quarterly sparkline-style line. */
  cpidLineChart("cpidCpiLine", CPID_QUARTERS, CPID_GENERAL, "#0066ff", { dp: 1, label: "CPI" });

  /* Overview — Annual growth rate line. */
  cpidLineChart("cpidGrowthLine", CPID_GROWTH_Q, CPID_GROWTH_YOY, "#0066ff", { dp: 1, suffix: "%", label: "Annual Growth Rate" });

  /* Overview — General Index quarterly bars (last quarter emphasised). */
  (function () {
    const el = document.getElementById("cpidGeneralBar");
    if (!el || cpidCharts.cpidGeneralBar) return;
    const t = cpidTheme();
    const colors = CPID_GENERAL.map((_, i) => (i === CPID_GENERAL.length - 1 ? "#0066ff" : "#99c2ff"));
    cpidCharts.cpidGeneralBar = new Chart(el.getContext("2d"), {
      type: "bar",
      data: {
        labels: CPID_QUARTERS,
        datasets: [{
          data: CPID_GENERAL,
          backgroundColor: colors,
          borderRadius: 6,
          maxBarThickness: 30,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: CPID_EASE,
        layout: { padding: { top: 14 } },
        plugins: {
          legend: { display: false },
          tooltip: cpidTip({ callbacks: { label: (c) => "  " + c.parsed.y.toFixed(1) } }),
        },
        scales: {
          x: {
            grid: { display: false, drawTicks: false },
            border: { color: t.border },
            ticks: { color: t.tick, font: { size: 10 }, padding: 6, maxRotation: 0 },
          },
          y: {
            min: 100,
            suggestedMax: 110,
            grid: { color: t.grid },
            border: { display: false },
            ticks: { color: t.tick, font: { size: 10 }, padding: 8, stepSize: 2 },
          },
        },
      },
      plugins: [{
        id: "cpidGeneralLabels",
        afterDatasetsDraw(chart) {
          const { ctx, scales: { x, y } } = chart;
          const last = CPID_GENERAL.length - 1;
          ctx.save();
          ctx.textAlign = "center";
          ctx.font = "700 11px Inter, sans-serif";
          CPID_GENERAL.forEach((v, i) => {
            ctx.fillStyle = i === last ? "#0066ff" : (t.tick === "#9aa0b0" ? "#475569" : t.tick);
            ctx.fillText(v.toFixed(1), x.getPixelForValue(i), y.getPixelForValue(v) - 8);
          });
          ctx.restore();
        },
      }],
    });
  })();

  /* Overview — CPI by group horizontal bars (top 8 by index level). */
  (function () {
    const el = document.getElementById("cpidGroupBar");
    if (!el || cpidCharts.cpidGroupBar) return;
    const t = cpidTheme();
    const groups = CPID_GROUPS.slice(0, 8);
    /* Horizontal blue gradient (dark → light, left → right) shared by all
       bars — longer bars reach the lighter end, as in the reference. */
    const groupBarFill = (c) => {
      const { chartArea } = c.chart;
      if (!chartArea) return "#3b82f6";
      const g = c.chart.ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
      g.addColorStop(0, "#1d4ed8");
      g.addColorStop(1, "#7cb2f7");
      return g;
    };
    cpidCharts.cpidGroupBar = new Chart(el.getContext("2d"), {
      type: "bar",
      data: {
        labels: groups.map((g) => g.name),
        datasets: [{
          data: groups.map((g) => g.cpi),
          backgroundColor: (c) => groupBarFill(c),
          borderRadius: 6,
          maxBarThickness: 14,
        }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        animation: CPID_EASE,
        layout: { padding: { right: 42, left: 150 } },
        datasets: {
          bar: {
            categoryPercentage: 0.52,
            barPercentage: 0.72,
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: cpidTip({ callbacks: { label: (c) => "  " + c.parsed.x.toFixed(1) } }),
        },
        scales: {
          x: {
            min: 90,
            suggestedMax: 120,
            grid: { color: t.grid },
            border: { display: false },
            ticks: { color: t.tick, font: { size: 10 }, padding: 6 },
          },
          y: {
            grid: { display: false, drawTicks: false },
            border: { color: t.border },
            ticks: { display: false },
          },
        },
      },
      plugins: [{
        id: "cpidGroupLabels",
        afterDatasetsDraw(chart) {
          const { ctx, scales: { x, y } } = chart;
          ctx.save();
          ctx.textBaseline = "middle";
          /* Value labels at the end of each bar. */
          ctx.textAlign = "left";
          ctx.font = "700 11px Inter, sans-serif";
          ctx.fillStyle = t.tick === "#9aa0b0" ? "#334155" : t.tick;
          groups.forEach((g, i) => {
            ctx.fillText(g.cpi.toFixed(1), x.getPixelForValue(g.cpi) + 8, y.getPixelForValue(i));
          });
          /* Left column: blue category icon, then the left-aligned label
             name, both painted in the reserved left gutter so every icon
             lines up in a clean vertical column. */
          const iconX = 6;
          const textX = 30;
          ctx.textAlign = "left";
          groups.forEach((g, i) => {
            const py = y.getPixelForValue(i);
            const glyph = cpidIconGlyph(g.icon);
            if (glyph.ch) {
              ctx.font = "15px " + glyph.fam;
              ctx.fillStyle = "#0066ff";
              ctx.fillText(glyph.ch, iconX, py);
            }
            ctx.font = "500 10.5px Inter, system-ui, sans-serif";
            ctx.fillStyle = t.tick === "#9aa0b0" ? "#475569" : t.tick;
            ctx.fillText(g.name, textX, py);
          });
          ctx.restore();
        },
      }],
    });
  })();

  /* Growth Rate — quarterly YoY bars, red up / green down, with a value
     label + arrow drawn over each bar and vertical year separators. */
  cpidBuildGrowthBars();

  /* CPI Over Time matrix + Main Indicators tables (pure DOM). */
  cpidBuildOverTimeMatrix();
  cpidBuildMainIndicators();
}

/* Growth Rate bar chart. Standard convention — a rise is green, a fall is
   red; soft rounded bars with a +/- label above positives and below
   negatives, horizontal gridlines and an emphasised zero baseline. The
   year band above the canvas is laid out to match the 3 groups. */
function cpidBuildGrowthBars() {
  const el = document.getElementById("cpidGrowthBars");
  if (!el || cpidCharts.cpidGrowthBars) return;
  const t = cpidTheme();
  /* Soft green / red tones matching the reference. */
  const POS = "#2fbf83", NEG = "#f26a63";
  const labels = [];
  CPID_GR_YEARS.forEach((y) => ["Q1", "Q2", "Q3", "Q4"].forEach((q) => labels.push(y + " " + q)));

  const years = document.getElementById("cpidGrYears");
  if (years && !years.childElementCount) {
    years.innerHTML = CPID_GR_YEARS.map((y) => `<span>${y}</span>`).join("");
  }

  cpidCharts.cpidGrowthBars = new Chart(el.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: CPID_GR_BARS,
        backgroundColor: CPID_GR_BARS.map((v) => (v >= 0 ? POS : NEG)),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 34,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: CPID_EASE,
      layout: { padding: { top: 22, bottom: 22, left: 4, right: 4 } },
      plugins: {
        legend: { display: false },
        tooltip: cpidTip({ callbacks: { label: (c) => "  " + (c.parsed.y >= 0 ? "+" : "-") + Math.abs(c.parsed.y).toFixed(1) + "%" } }),
      },
      scales: {
        x: {
          grid: { display: false, drawTicks: false },
          border: { color: t.border },
          ticks: { color: t.tick, font: { size: 10 }, padding: 4, maxRotation: 0, callback: (v, i) => labels[i].slice(5) },
        },
        y: {
          display: true,
          suggestedMin: Math.min(...CPID_GR_BARS) - 0.6,
          suggestedMax: Math.max(...CPID_GR_BARS) + 0.8,
          border: { display: false },
          grid: {
            drawTicks: false,
            color: (c) => (c.tick.value === 0 ? (t.tick === "#9aa0b0" ? "#c2ccd8" : t.border) : t.grid),
            lineWidth: (c) => (c.tick.value === 0 ? 1.5 : 1),
          },
          ticks: { display: false },
        },
      },
    },
    plugins: [{
      id: "cpidGrLabels",
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        ctx.save();
        ctx.textAlign = "center";
        ctx.font = "700 11px Inter, sans-serif";
        CPID_GR_BARS.forEach((v, i) => {
          const px = x.getPixelForValue(i);
          const py = y.getPixelForValue(v);
          ctx.fillStyle = v >= 0 ? POS : NEG;
          const txt = (v >= 0 ? "+" : "-") + Math.abs(v).toFixed(1) + "%";
          ctx.fillText(txt, px, v >= 0 ? py - 10 : py + 16);
        });
        /* Year separators at the group boundaries (after Q4 of each year). */
        ctx.strokeStyle = t.grid;
        ctx.lineWidth = 1;
        [3.5, 7.5].forEach((b) => {
          const px = x.getPixelForValue(b);
          ctx.beginPath();
          ctx.moveTo(px, chart.chartArea.top);
          ctx.lineTo(px, chart.chartArea.bottom);
          ctx.stroke();
        });
        ctx.restore();
      },
    }],
  });
}

/* CPI Over Time — year-grouped matrix (2022–2025 × Q1–Q4). */
function cpidBuildOverTimeMatrix() {
  const head = document.getElementById("cpidMatrixHead");
  const body = document.getElementById("cpidMatrixBody");
  if (!head || !body || head.dataset.ready) return;
  head.dataset.ready = "1";
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  head.innerHTML = `
    <tr>
      <th class="cpid-matrix-groupcol" rowspan="2">Group Of Commodities</th>
      ${CPID_OT_YEARS.map((y) => `<th class="cpid-yr" colspan="4">${y}</th>`).join("")}
    </tr>
    <tr>
      ${CPID_OT_YEARS.map(() => quarters.map((q, i) => `<th${i === 0 ? ' class="cpid-yr"' : ""}>${q}</th>`).join("")).join("")}
    </tr>`;
  body.innerHTML = CPID_OT.map((row) => `<tr>
    <td>${row.name}</td>
    ${row.v.map((val, i) => `<td${i % 4 === 0 ? ' class="cpid-qtr-first"' : ""}>${val.toFixed(1)}</td>`).join("")}
  </tr>`).join("");
}

/* Main Indicators — region list + two relative-change tables derived from
   the same matrix data (Q4'25 vs Q3'25, and Q4'25 vs Q4'24). */
function cpidBuildMainIndicators() {
  const relCell = (diff) => {
    const tone = diff > 0.05 ? "up" : diff < -0.05 ? "down" : "flat";
    const icon = tone === "up" ? "ti-trending-up" : tone === "down" ? "ti-caret-down-filled" : "ti-minus";
    return `<span class="cpid-rel cpid-rel--${tone}"><i class="ti ${icon}"></i>${diff > 0 ? "+" : ""}${diff.toFixed(1)}</span>`;
  };
  const fill = (id, compareIdx) => {
    const tb = document.getElementById(id);
    if (!tb || tb.dataset.ready) return;
    tb.dataset.ready = "1";
    tb.innerHTML = CPID_OT.map((row, i) => {
      const cur = row.v[15];
      const cmp = row.v[compareIdx];
      const m = CPID_OT_META[i] || {};
      return `<tr>
        <td><span class="cpid-rel-cat"><i class="ti ${m.icon || "ti-point"}" style="color:var(--accent)"></i>${row.name}</span></td>
        <td>${cur.toFixed(1)}</td>
        <td>${cmp.toFixed(1)}</td>
        <td>${relCell(Math.round((cur - cmp) * 10) / 10)}</td>
      </tr>`;
    }).join("");
  };
  fill("cpidRelQoq", 14); /* vs Q3 2025 */
  fill("cpidRelYoy", 11); /* vs Q4 2024 */

  /* Region KPI cards — clickable selector; reflects the selected region in
     both panel headers. (Demo data stays Abu Dhabi Emirate.) */
  const tabs = document.querySelectorAll(".cpid-region-card");
  if (tabs.length && !tabs[0].dataset.bound) {
    tabs.forEach((tab) => {
      tab.dataset.bound = "1";
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        document.querySelectorAll("#cpid-content [data-region-name]").forEach((el) => {
          el.textContent = tab.dataset.region;
        });
      });
    });
  }
}

/* ── View switching — driven by the floating sidebar. Reveal the panel,
   then (re)size its charts. ── */
function cpidActivateTab(name) {
  document.querySelectorAll("#screen-cpi-dashboard .cpid-view-tab[data-tab]").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === name);
  });
  document.querySelectorAll("#screen-cpi-dashboard #cpid-content section[data-panel]").forEach((s) => {
    s.hidden = s.dataset.panel !== name;
  });
  /* Charts drawn while hidden have no size — resize the freshly shown ones. */
  requestAnimationFrame(() => {
    Object.values(cpidCharts).forEach((c) => c && c.resize());
  });
}

/* ── Standard filter dropdowns (.prod-filter-dd) — same behaviour as the
   Benchmark / Products filter bar: one open at a time, click-away and
   Escape close, selection updates the trigger label. ── */
function cpidToggleDd(which, force) {
  const dd = document.querySelector(`#screen-cpi-dashboard .prod-filter-dd[data-dd="${which}"]`);
  if (!dd) return;
  const menu = dd.querySelector(".prod-filter-dd-menu");
  const trigger = dd.querySelector(".prod-filter-dd-trigger");
  const open = typeof force === "boolean" ? force : menu.hasAttribute("hidden");
  if (open) {
    document.querySelectorAll("#screen-cpi-dashboard .prod-filter-dd[data-dd]").forEach((other) => {
      if (other !== dd) cpidToggleDd(other.dataset.dd, false);
    });
  }
  menu.hidden = !open;
  trigger.setAttribute("aria-expanded", open ? "true" : "false");
  trigger.classList.toggle("is-open", open);
}

function cpidInitFilters() {
  const resultLabel = document.getElementById("cpidResultLabel");
  const statusText = document.getElementById("cpidStatusText");
  const resetAll = document.getElementById("cpidResetAll");
  const current = { year: "2025", quarter: "Q4" };
  const syncResult = () => {
    const label = `${current.quarter} ${current.year}`;
    if (resultLabel) resultLabel.textContent = label;
    if (statusText) statusText.textContent = label;
  };

  /* The default (first) option of every dropdown, and the default
     frequency — the baseline the reset controls return to. */
  const dds = [...document.querySelectorAll("#screen-cpi-dashboard .prod-filter-dd[data-dd]")];

  /* Apply a dropdown option: mark active, sync trigger label + lead icon,
     update the results caption. Does not open/close the menu. */
  function applyOption(dd, opt) {
    const label = dd.querySelector("[data-dd-label]");
    const lead = dd.querySelector("[data-dd-lead]");
    dd.querySelectorAll(".prod-filter-dd-option").forEach((o) => o.classList.remove("is-active"));
    opt.classList.add("is-active");
    const val = opt.textContent.trim();
    if (label) label.textContent = val;
    if (lead && opt.dataset.icon) lead.className = `ti ${opt.dataset.icon} prod-filter-dd-lead`;
    const which = dd.dataset.dd;
    if (which === "year" || which === "quarter") { current[which] = val; syncResult(); }
  }

  /* A filter is "changed" when its active option isn't the first one; the
     frequency is changed when Monthly is selected. Toggle the per-dropdown
     reset (disabled at default) and the global tertiary reset (hidden
     until something moved). */
  function refreshFilterState() {
    let anyChanged = false;
    dds.forEach((dd) => {
      const opts = [...dd.querySelectorAll(".prod-filter-dd-option")];
      const atDefault = opts.length && opts[0].classList.contains("is-active");
      if (!atDefault) anyChanged = true;
      const reset = dd.querySelector("[data-dd-reset]");
      if (reset) reset.disabled = atDefault;
    });
    const monthly = document.querySelector('.bm-seg-btn[data-freq="monthly"]');
    if (monthly && monthly.classList.contains("is-active")) anyChanged = true;
    if (resetAll) resetAll.hidden = !anyChanged;
  }

  dds.forEach((dd) => {
    const which = dd.dataset.dd;
    dd.querySelectorAll(".prod-filter-dd-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        applyOption(dd, opt);
        cpidToggleDd(which, false);
        refreshFilterState();
      });
    });
    /* In-menu reset — return this dropdown to its default option. */
    const reset = dd.querySelector("[data-dd-reset]");
    if (reset) reset.addEventListener("click", () => {
      const first = dd.querySelector(".prod-filter-dd-option");
      if (first) applyOption(dd, first);
      cpidToggleDd(which, false);
      refreshFilterState();
    });
  });

  /* Frequency switch — visual state + participates in the changed check.
     Scoped to the filter bar so the CPI Over Time toggle is independent. */
  const freqSeg = document.querySelector("#screen-cpi-dashboard .cpid-filters .bm-region-seg");
  if (freqSeg) freqSeg.querySelectorAll(".bm-seg-btn").forEach((b) => {
    b.addEventListener("click", () => {
      freqSeg.querySelectorAll(".bm-seg-btn").forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
      refreshFilterState();
    });
  });

  /* CPI Over Time frequency toggle — visual only. */
  document.querySelectorAll("#screen-cpi-dashboard .cpid-ot-seg .bm-seg-btn").forEach((b) => {
    b.addEventListener("click", () => {
      b.closest(".cpid-ot-seg").querySelectorAll(".bm-seg-btn").forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
    });
  });

  /* Global tertiary reset — every dropdown back to default + Quarterly. */
  if (resetAll) resetAll.addEventListener("click", () => {
    dds.forEach((dd) => {
      const first = dd.querySelector(".prod-filter-dd-option");
      if (first) applyOption(dd, first);
    });
    const seg = freqSeg ? freqSeg.querySelectorAll(".bm-seg-btn") : [];
    seg.forEach((x) => x.classList.remove("is-active"));
    if (seg[0]) seg[0].classList.add("is-active");
    refreshFilterState();
  });

  /* Click-away and Escape close, as on the Products filter bar. */
  document.addEventListener("click", (e) => {
    if (e.target.closest(".prod-filter-dd")) return;
    dds.forEach((dd) => cpidToggleDd(dd.dataset.dd, false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") dds.forEach((dd) => cpidToggleDd(dd.dataset.dd, false));
  });

  refreshFilterState();
}

function cpidDestroyCharts() {
  if (typeof cpidCharts === "undefined") return;
  Object.keys(cpidCharts).forEach(function (k) {
    try { if (cpidCharts[k]) cpidCharts[k].destroy(); } catch (e) {}
    delete cpidCharts[k];
  });
  var head = document.getElementById("cpidMatrixHead");
  if (head) delete head.dataset.ready;
  ["cpidRelQoq", "cpidRelYoy"].forEach(function (id) {
    var tb = document.getElementById(id);
    if (tb) delete tb.dataset.ready;
  });
  document.querySelectorAll("#screen-cpi-dashboard .cpid-region-card").forEach(function (tab) {
    delete tab.dataset.bound;
  });
  var years = document.getElementById("cpidGrYears");
  if (years) years.innerHTML = "";
}

function initCpiDashboardScreen() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js not loaded — CPI dashboard charts skipped");
    return;
  }
  Chart.defaults.font.family = "Inter, system-ui, sans-serif";
  Chart.defaults.font.size = 11;
  cpidDestroyCharts();
  cpidInit();
  document.querySelectorAll("#screen-cpi-dashboard .cpid-view-tab[data-tab]").forEach(function (b) {
    if (b.dataset.cpidBound) return;
    b.dataset.cpidBound = "1";
    b.addEventListener("click", function () { cpidActivateTab(b.dataset.tab); });
  });
  if (!window._cpidFiltersInited) {
    window._cpidFiltersInited = true;
    cpidInitFilters();
  }
  if (!window._cpidThemeObs) {
    window._cpidThemeObs = new MutationObserver(function () {
      var screen = document.getElementById("screen-cpi-dashboard");
      if (!screen || !screen.classList.contains("active")) return;
      cpidDestroyCharts();
      cpidInit();
      var active = document.querySelector("#screen-cpi-dashboard .cpid-view-tab[data-tab].active");
      if (active) cpidActivateTab(active.dataset.tab);
    });
    window._cpidThemeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
  var active = document.querySelector("#screen-cpi-dashboard .cpid-view-tab[data-tab].active");
  if (active) cpidActivateTab(active.dataset.tab);
}
window.initCpiDashboardScreen = initCpiDashboardScreen;
window.cpidActivateTab = cpidActivateTab;
window.cpidToggleDd = cpidToggleDd;
