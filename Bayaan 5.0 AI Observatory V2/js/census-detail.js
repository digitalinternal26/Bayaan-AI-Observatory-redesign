/* ============================================================
   CENSUS OBSERVATORY — DOMAIN DETAIL PAGE RENDERER
   Shared by census-population.html / census-labour.html /
   census-real-estate.html. Each page defines a CENSUS_DOMAIN config
   object and calls renderCensusDetail(CENSUS_DOMAIN) — this file turns
   that data into the KPI row, chart cards, donut rows, bar breakdowns,
   driver chains, decision cards and explore-further grid, using
   Chart.js (already the charting library for lmo-indicator-detail.html)
   themed via BayaanTheme.chartPalette()/chartTheme() so it re-themes with
   the rest of the app on light/dark toggle.
   ============================================================ */

let censusToastTimer = null;
function censusComingSoon(label) {
  const el = document.getElementById("censusToast");
  if (!el) return;
  el.textContent = label + " is coming soon.";
  el.classList.add("is-visible");
  clearTimeout(censusToastTimer);
  censusToastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
}

function cdIcon(name) {
  return `<i class="ti ${name}" aria-hidden="true"></i>`;
}

function cdTheme() {
  const t = window.BayaanTheme ? window.BayaanTheme.chartTheme() : {};
  return {
    tick: t.tick || "#94a3b8",
    grid: t.grid || "rgba(0,0,0,0.05)",
    text: t.textSecondary || "#475569",
  };
}

function cdPalette(n) {
  if (window.BayaanTheme) return window.BayaanTheme.chartPalette(n);
  const fallback = ["#0066FF", "#059669", "#378ADD", "#f5a623", "#7c3aed", "#e5484d"];
  return Array.from({ length: n }, (_, i) => fallback[i % fallback.length]);
}

/* ── Hero + AI summary + audio brief ── */
function renderHero(cfg) {
  const root = document.getElementById("cdHero");
  if (!root) return;
  root.innerHTML = `
    ${cfg.quote ? `<p class="cd-hero-quote">${cfg.quote}</p>` : ""}
    <div class="cd-ai-row">
      <div class="cd-ai-icon">${cdIcon(cfg.heroIcon || "ti-sparkles")}</div>
      <div class="cd-ai-main">
        <div class="cd-ai-hd">
          <span>AI summary</span>
          <span class="ai-pill">${cdIcon("ti-sparkles")}AI-generated</span>
        </div>
        <div class="cd-ai-updated">Latest update · ${cfg.aiSummary.updated}</div>
        <p class="cd-ai-text" id="cdAiText">${cfg.aiSummary.text}</p>
      </div>
      <div class="cd-ai-actions">
        <button type="button" class="cen-btn cen-btn--ai" id="cdListenBtn">
          ${cdIcon("ti-player-play")} <span id="cdListenLabel">Listen to brief</span>
        </button>
        <button type="button" class="cen-btn" id="cdCopyBtn" aria-label="Copy summary" title="Copy summary">
          ${cdIcon("ti-copy")}
        </button>
      </div>
    </div>`;

  const listenBtn = document.getElementById("cdListenBtn");
  const listenLabel = document.getElementById("cdListenLabel");
  const copyBtn = document.getElementById("cdCopyBtn");
  if (listenBtn && "speechSynthesis" in window) {
    const synth = window.speechSynthesis;
    let state = "idle";
    listenBtn.addEventListener("click", () => {
      if (state === "speaking") {
        synth.cancel();
        state = "idle";
        listenLabel.textContent = "Listen to brief";
        return;
      }
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(cfg.aiSummary.text);
      utter.lang = "en-GB";
      utter.rate = 0.96;
      utter.onstart = () => {
        state = "speaking";
        listenLabel.textContent = "Pause";
      };
      utter.onend = () => {
        state = "idle";
        listenLabel.textContent = "Listen to brief";
      };
      synth.speak(utter);
    });
    window.addEventListener("beforeunload", () => synth.cancel());
  } else if (listenBtn) {
    listenBtn.hidden = true;
  }
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard?.writeText(cfg.aiSummary.text).then(
        () => censusComingSoon("Summary copied"),
        () => censusComingSoon("Copy")
      );
    });
  }
}

/* ── KPI row ── */
function renderKpis(cfg) {
  const root = document.getElementById("cdKpiRow");
  if (!root) return;
  root.innerHTML = cfg.kpis
    .map(
      (k) => `<div class="obs-card cd-kpi">
      <div class="cd-kpi-ic">${cdIcon(k.icon || "ti-chart-bar")}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="cd-kpi-val">${k.value}${k.unit ? `<small>${k.unit}</small>` : ""}</div>
      <div class="cd-kpi-foot">
        ${k.change ? `<span class="cen-badge cen-badge--${k.tone || k.changeDir || "up"}">${cdIcon("ti-arrow-" + (k.changeDir || "up"))}${k.change}</span>` : ""}
        <span>${k.context || ""}</span>
      </div>
    </div>`
    )
    .join("");
}

/* ── Section type: trend (bar/line combo chart + changes list or key card) ── */
function renderTrendSection(container, section, idx) {
  const chartId = `cdChart${idx}`;
  container.innerHTML = `
    <div class="cd-card-hd">${cdIcon(section.icon || "ti-chart-line")}${section.title}</div>
    <p class="cd-card-sub">${section.subtitle || ""}</p>
    <div class="cd-trend-body">
      <div class="cd-chart-box"><canvas id="${chartId}"></canvas></div>
      ${
        section.changes
          ? `<div class="cd-changes-list">${section.changes
              .map(
                (c) => `<div class="cd-change-row"><span>${c.label}</span><b>${c.value}</b></div>`
              )
              .join("")}</div>`
          : section.sideCard
            ? `<div class="cd-key-card cd-changes-list">
                <div class="cd-key-card-hd">${cdIcon("ti-sparkles")}${section.sideCard.title}</div>
                <p>${section.sideCard.text}</p>
               </div>`
            : ""
      }
    </div>`;

  const theme = cdTheme();
  const palette = cdPalette(section.chart.datasets.length);
  const canvas = document.getElementById(chartId);
  if (!canvas || !window.Chart) return;
  new Chart(canvas, {
    type: section.chart.datasets[0].type || "bar",
    data: {
      labels: section.chart.labels,
      datasets: section.chart.datasets.map((d, i) => ({
        label: d.label,
        data: d.data,
        type: d.type || "bar",
        backgroundColor: d.type === "line" ? "transparent" : palette[i] + "cc",
        borderColor: palette[i],
        borderWidth: d.type === "line" ? 2 : 0,
        borderRadius: d.type === "line" ? 0 : 6,
        yAxisID: d.axis || "y",
        tension: 0.35,
        pointRadius: d.type === "line" ? 3 : 0,
        pointBackgroundColor: palette[i],
        order: d.type === "line" ? 0 : 1,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: section.chart.datasets.length > 1,
          position: "bottom",
          labels: { color: theme.text, font: { size: 10.5 }, boxWidth: 10, padding: 10 },
        },
        tooltip: { enabled: true },
      },
      scales: buildScales(section.chart.datasets, theme),
    },
  });
}

function buildScales(datasets, theme) {
  const scales = {
    x: { grid: { display: false }, ticks: { color: theme.tick, font: { size: 10.5 } } },
    y: { grid: { color: theme.grid }, ticks: { color: theme.tick, font: { size: 10.5 } } },
  };
  if (datasets.some((d) => d.axis === "y1")) {
    scales.y1 = {
      position: "right",
      grid: { display: false },
      ticks: { color: theme.tick, font: { size: 10.5 } },
    };
  }
  return scales;
}

/* ── Section type: donuts (row of doughnut charts + optional AI insight) ── */
function renderDonutSection(container, section, idx) {
  container.innerHTML = `
    <div class="cd-card-hd">${cdIcon(section.icon || "ti-chart-donut")}${section.title}</div>
    <p class="cd-card-sub">${section.subtitle || ""}</p>
    <div class="cd-donut-row">
      ${section.donuts
        .map(
          (d, i) => `<div class="cd-donut-card">
          <div class="cd-donut-box"><canvas id="cdDonut${idx}_${i}"></canvas>
            <div class="cd-donut-center"><b>${d.centerValue || ""}</b><span>${d.centerLabel || ""}</span></div>
          </div>
          <div class="cd-donut-label">${d.label}</div>
          <div class="cd-donut-legend">${d.segments
            .map(
              (s, j) =>
                `<div class="cd-donut-legend-row"><span class="cd-donut-legend-dot" style="background:${cdPalette(d.segments.length)[j]}"></span>${s.label}<b>${s.value}%</b></div>`
            )
            .join("")}</div>
        </div>`
        )
        .join("")}
    </div>
    ${
      section.insight
        ? `<div class="cd-key-card" style="margin-top:16px">
            <div class="cd-key-card-hd">${cdIcon("ti-sparkles")}AI insight</div>
            <p>${section.insight}</p>
           </div>`
        : ""
    }`;

  section.donuts.forEach((d, i) => {
    const canvas = document.getElementById(`cdDonut${idx}_${i}`);
    if (!canvas || !window.Chart) return;
    const palette = cdPalette(d.segments.length);
    new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: d.segments.map((s) => s.label),
        datasets: [
          {
            data: d.segments.map((s) => s.value),
            backgroundColor: palette,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
      },
    });
  });
}

/* ── Section type: bars (horizontal bar list + key message / CTA) ── */
function renderBarSection(container, section) {
  const max = Math.max(...section.bars.map((b) => b.pct));
  container.innerHTML = `
    <div class="cd-card-hd">${cdIcon(section.icon || "ti-chart-bar")}${section.title}</div>
    <p class="cd-card-sub">${section.subtitle || ""}</p>
    <div class="cd-bar-body">
      <div class="cd-bar-list">
        ${section.bars
          .map(
            (b) => `<div class="cd-bar-row">
              <span class="cd-bar-row-label">${b.label}</span>
              <span class="cd-bar-track"><span class="cd-bar-fill" style="width:${(b.pct / max) * 100}%"></span></span>
              <span><span class="cd-bar-row-val">${b.value}</span> <span class="cd-bar-row-pct">${b.pct}%</span></span>
            </div>`
          )
          .join("")}
      </div>
      <div class="cd-key-card">
        <div class="cd-key-card-hd">${cdIcon("ti-map-pin")}${section.keyMessageTitle || "Key message"}</div>
        <p>${section.keyMessage}</p>
        ${section.cta ? `<button type="button" class="cen-btn cen-btn--primary" onclick="${section.cta.onclick || `censusComingSoon('${section.cta.label}')`}">${section.cta.label} ${cdIcon("ti-arrow-right")}</button>` : ""}
      </div>
    </div>`;
}

/* ── Section type: chain (driver chain + AI analysis) ── */
function renderChainSection(container, section) {
  container.innerHTML = `
    <div class="cd-card-hd">${cdIcon(section.icon || "ti-git-branch")}${section.title}</div>
    <p class="cd-card-sub">${section.subtitle || ""}</p>
    <div class="cd-chain">
      ${section.steps
        .map(
          (s, i) =>
            `<div class="cd-chain-step"><div class="cd-chain-ic">${cdIcon(s.icon)}</div><span>${s.label}</span></div>${i < section.steps.length - 1 ? `<span class="cd-chain-arrow">${cdIcon("ti-arrow-right")}</span>` : ""}`
        )
        .join("")}
    </div>
    <div class="cd-key-card">
      <div class="cd-key-card-hd">${cdIcon("ti-sparkles")}AI analysis</div>
      <p>${section.analysis}</p>
    </div>`;
}

const SECTION_RENDERERS = {
  trend: renderTrendSection,
  donuts: renderDonutSection,
  bars: renderBarSection,
  chain: renderChainSection,
};

function renderBreakdownSections(cfg) {
  const root = document.getElementById("cdSections");
  if (!root) return;
  root.innerHTML = cfg.sections
    .map(
      (s) =>
        `<div class="obs-card ${s.full ? "cd-section-grid--full" : ""}" style="grid-column:${s.full ? "1 / -1" : "auto"}" data-cd-section></div>`
    )
    .join("");
  const cards = root.querySelectorAll("[data-cd-section]");
  cfg.sections.forEach((s, i) => {
    const renderer = SECTION_RENDERERS[s.type];
    if (renderer) renderer(cards[i], s, i);
  });
}

/* ── Regional summary ── */
function renderRegional(cfg) {
  const root = document.getElementById("cdRegional");
  if (!root || !cfg.regional) return;
  const r = cfg.regional;
  const max = Math.max(...r.bars.map((b) => b.pct));
  root.innerHTML = `
    <div class="cd-card-hd">${cdIcon("ti-map-pin")}${r.title}</div>
    <p class="cd-card-sub">${r.subtitle || ""}</p>
    <div class="cd-bar-body">
      <div class="cd-bar-list">
        ${r.bars
          .map(
            (b) => `<div class="cd-bar-row">
              <span class="cd-bar-row-label">${b.name}</span>
              <span class="cd-bar-track"><span class="cd-bar-fill" style="width:${(b.pct / max) * 100}%"></span></span>
              <span><span class="cd-bar-row-val">${b.value}</span> <span class="cd-bar-row-pct">${b.pct}%</span></span>
            </div>`
          )
          .join("")}
      </div>
      <div class="cd-key-card">
        <div class="cd-key-card-hd">${cdIcon("ti-sparkles")}Key message</div>
        <p>${r.message}</p>
        <button type="button" class="cen-btn cen-btn--primary" onclick="window.location.href='${r.exploreHref || "census-observe.html"}'">Explore regional detail ${cdIcon("ti-arrow-right")}</button>
      </div>
    </div>`;
}

/* ── Decision cards + Explore further (static-shaped grids) ── */
function renderMiniGrid(rootId, group, options) {
  const root = document.getElementById(rootId);
  if (!root || !group) return;
  const opts = options || {};
  document.getElementById(rootId + "Title").textContent = group.title;
  document.getElementById(rootId + "Sub").textContent = group.subtitle || "";
  root.innerHTML = group.cards
    .map((c) => {
      const tag = c.href ? "a" : "div";
      const href = c.href ? ` href="${c.comingSoon ? "#" : c.href}"` : "";
      const onclick = c.comingSoon
        ? ` onclick="censusComingSoon('${c.title}'); return false;"`
        : "";
      return `<${tag} class="obs-card cd-mini-card${c.href ? " cd-explore-card" : ""}"${href}${onclick}>
        <div class="cd-mini-ic">${cdIcon(c.icon)}</div>
        <div class="cd-mini-title">${c.title}</div>
        <p>${c.text}</p>
        ${c.href ? `<span class="cd-explore-arrow">Go ${cdIcon("ti-arrow-right")}</span>` : ""}
      </${tag}>`;
    })
    .join("");
  if (opts.threeUp) root.classList.add("cd-3up");
}

function renderCensusDetail(cfg) {
  document.title = `Census Observatory — ${cfg.title} · Bayaan`;
  const bc = document.getElementById("cdBreadcrumbCurrent");
  if (bc) bc.textContent = cfg.breadcrumbLabel || cfg.title;
  const titleEl = document.getElementById("cdTitle");
  if (titleEl) titleEl.textContent = cfg.title;
  const subEl = document.getElementById("cdSubtitle");
  if (subEl) subEl.textContent = cfg.subtitle || "";
  const descEl = document.getElementById("cdDescription");
  if (descEl) descEl.textContent = cfg.description || "";

  renderHero(cfg);
  renderKpis(cfg);
  renderBreakdownSections(cfg);
  renderRegional(cfg);
  renderMiniGrid("cdDecisions", cfg.decisions, { threeUp: (cfg.decisions?.cards || []).length === 3 });
  renderMiniGrid("cdExplore", { title: "Explore further", subtitle: "Continue your analysis with related views", cards: cfg.explore }, {});
}
