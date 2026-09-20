/* Favourites page — reads the shared favourites snapshot written by
   index.html (see FAVOURITES_STORAGE_KEY / persistFavouritesSnapshot there)
   and renders it using the same card/tab/empty-state classes the "My
   Favourites" module on Home already uses, so styling comes entirely from
   style.css / css/theme.css — this file only builds markup + wires clicks. */
(function () {
  "use strict";

  const STORAGE_KEY = "bayaanFavourites";
  const TABS = ["indicators", "dashboards", "observatory", "frequent"];
  const SCREEN_ID = "favouritesPage";
  let activeTab = "indicators";
  let searchQuery = "";
  let store = { indicators: [], dashboards: [], observatory: [], frequent: [] };

  // Mirrors the default "EL" workspace seed index.html writes via
  // initHomeFavouritesStore()/persistFavouritesSnapshot() the first time it
  // ever runs in a browser. If someone lands on favourites.html before
  // index.html has had a chance to seed localStorage (a fresh browser, a
  // direct link, a different tab/profile), this page would otherwise show
  // "No favourites yet" even though the Home "My Favourites" widget shows
  // these four cards as already bookmarked — so we seed the same default
  // here too, once, on a genuinely first-ever visit only.
  const DEFAULT_SEED = {
    indicators: [
      { cat: "Economy", catIcon: "ti-trending-up", name: "Consumer price index by main expenditure group - Clothing and footwear", val: "3.92M", change: "▼ 0.31 (2.0%) Yearly", changeClass: "val-red", aiSummary: "Clothing & footwear CPI is easing year-over-year; track whether this deflation offsets housing and food-led pressures.", baiCtx: "el-product-cpi", baiTitle: "CPI — Clothing and Footwear", baiIcon: "ti-shirt", idx: 0, favId: "indicators-consumer-price-index-by-main-expenditure-group-clothing-and-footwear" },
      { cat: "Economy", catIcon: "ti-trending-up", name: "Population distribution by gender", val: "3.92M", change: "▲ 0.31 (2.0%) Yearly", changeClass: "val-green", aiSummary: "Gender distribution is stable with modest growth; watch changes in working-age balance that drive labour supply and demand.", baiCtx: "el-product-population", baiTitle: "Population Distribution by Gender", baiIcon: "ti-users", idx: 1, favId: "indicators-population-distribution-by-gender" },
      { cat: "Economy", catIcon: "ti-trending-up", name: "Cost of construction index", val: "3.92M", change: "▲ 0.31 (2.0%) Yearly", changeClass: "val-green", aiSummary: "Construction costs are trending upward; rising input prices can flow into rents and capex, lifting inflation risk.", baiCtx: "el-product-construction", baiTitle: "Cost of Construction Index", baiIcon: "ti-building", idx: 2, favId: "indicators-cost-of-construction-index" },
      { cat: "Economy", catIcon: "ti-trending-up", name: "Gross domestic product by institutional sector at current prices", val: "3.92M", change: "▲ 0.31 (2.0%) Yearly", changeClass: "val-green", aiSummary: "Institutional-sector GDP shows which parts of the economy drive growth; compare quarter shifts to spot structural change.", baiCtx: "el-product-gdp", baiTitle: "GDP by Institutional Sector", baiIcon: "ti-chart-bar", idx: 3, favId: "indicators-gross-domestic-product-by-institutional-sector-at-current-prices" },
    ],
    dashboards: [
      { idx: 2, cat: "Economy", catIcon: "ti-chart-bar", name: "Consumer Price Index (CPI) Dashboard", val: "106.3", unit: "Index", desc: "Consumer Price Index (CPI) Dashboard", aiSummary: "Headline inflation is modest; essential-basket movements drive most month-to-month change.", updated: "01/04/2024", classification: "CONFIDENTIAL", vizType: "dashboard-thumb", favId: "dashboards-consumer-price-index-cpi-dashboard" },
      { idx: 0, cat: "Economy", catIcon: "ti-chart-bar", name: "Annual GDP", val: "154.82", unit: "Index", desc: "Annual Gross Domestic Product", aiSummary: "Annual output growth is holding firm; compare sector mix against quarterly shifts before mid-year planning.", updated: "30/06/2026", classification: "CONFIDENTIAL", vizType: "dashboard-thumb", favId: "dashboards-annual-gdp" },
      { idx: 1, cat: "Economy", catIcon: "ti-chart-bar", name: "COLI Dashboard", val: "1", unit: "Index", desc: "Cost of Living Index", aiSummary: "Cost of living is stable; housing and transport sub-indexes are the early signals to watch.", updated: "01/01/2024", classification: "CONFIDENTIAL", vizType: "dashboard-thumb", favId: "dashboards-coli-dashboard" },
      { idx: 3, cat: "Economy", catIcon: "ti-chart-bar", name: "Foreign Trade", val: "20.5K", unit: "Million AED", desc: "A dashboard that presents abudhabi foreign trade statistics", aiSummary: "Trade flows stay balanced; monitor partner-country shifts for supply-chain and export risk.", updated: "01/12/2025", classification: "CONFIDENTIAL", vizType: "dashboard-thumb", favId: "dashboards-foreign-trade" },
    ],
    observatory: [
      { iconClass: "cpi", icon: "ti-shopping-cart", name: "Consumer Price Index", desc: "The AI-enabled Abu Dhabi CPI provides automated narratives and actionable recommendations on inflation.", onClick: "openCpiObservatory(event)", kpis: [{ label: "Overall", value: "109.86", change: "▲ +1.08 (1.0%) Monthly", chgClass: "up" }, { label: "Essential CPI", value: "111.2", change: "▲ +0.42 (0.4%) Monthly", chgClass: "up" }], favId: "observatory-consumer-price-index" },
      { iconClass: "crisis", icon: "ti-shield", name: "Crisis Intelligence", desc: "Monitors geopolitical, economic, and supply-chain risks with real-time alerts and scenario modelling.", onClick: "openCrisisObservatory(event)", kpis: [{ label: "Risk Score", value: "42.6", change: "▼ -3.20 (-7.0%) Monthly", chgClass: "down" }, { label: "Active Alerts", value: "7", change: "▲ +2.00 Monthly", chgClass: "up" }], favId: "observatory-crisis-intelligence" },
      { iconClass: "social", icon: "ti-scale", name: "Social", desc: "Tracks social development indicators across Abu Dhabi's communities, covering education, health, and housing.", kpis: [{ label: "Well-being Index", value: "74.3", change: "▲ +1.8 (2.5%) Quarterly", chgClass: "up" }, { label: "Education Rate", value: "91.2%", change: "▲ 0.40% Quarterly", chgClass: "up" }], favId: "observatory-social" },
      { iconClass: "household", icon: "ti-home", name: "Household Income and Expenditure", desc: "Analyses income distribution and spending patterns across Abu Dhabi households.", kpis: [{ label: "Avg. Monthly Income", value: "AED 21.4K", change: "▲ +1.2K (5.9%) Yearly", chgClass: "up" }, { label: "Avg. Expenditure", value: "AED 14.8K", change: "▲ +0.6K (4.2%) Yearly", chgClass: "up" }], favId: "observatory-household-income-and-expenditure" },
    ],
    frequent: [
      { name: "Q2 Labour Market Dashboard", date: "Last opened 2 hours ago — 4 visits this week", ico: "ti-layout-dashboard", bg: "#fef9c3", co: "#ca8a04", onClick: "resumeDashboardBuild()" },
      { name: "Non-oil GDP — Quarterly Trend", date: "Viewed yesterday — exploration unfinished", ico: "ti-chart-line", bg: "#dbeafe", co: "#2563eb" },
      { name: "Construction Cost Inflation — Policy Brief", date: "Draft generated by AI Agent — opened 3 times this week", ico: "ti-file-text", bg: "#e0f2fe", co: "#0284c7" },
      { name: "CPI Essential Basket Widget", date: "Pinned widget — last visit today 09:14", ico: "ti-shopping-cart", bg: "#ede9fe", co: "#7c3aed" },
    ],
  };

  // Boot the shared navbar (js/header.js builds the markup but expects the
  // host page to wire it up + provide these nav handlers — same pattern
  // lmo/lmo-chrome.js already uses for the other standalone pages in this
  // app, just without the "../" asset prefix since this page sits at the
  // repo root next to index.html).
  function bootHeaderChrome() {
    if (window.BayaanHeader) {
      window.BayaanHeader.initScreenHeader(SCREEN_ID);
      window.BayaanHeader.syncActive(SCREEN_ID);
    }
  }

  function goTo() {}
  function openWsDrp() {}
  function onHeaderSearchClick() {
    window.location.href = "index.html";
  }
  function openGeoView(e) {
    if (e) e.preventDefault();
    window.location.href = "ADDP/ADDP.html";
  }
  function openProducts(e) {
    if (e) e.preventDefault();
    window.location.href = "index.html?screen=screen-products";
  }
  function openBayaanSpace(e) {
    if (e) e.preventDefault();
    try {
      sessionStorage.setItem("bayaanOpenStudioGallery", "1");
    } catch (err) {}
    window.location.href = "index.html";
  }
  window.goTo = goTo;
  window.openWsDrp = openWsDrp;
  window.onHeaderSearchClick = onHeaderSearchClick;
  window.openGeoView = openGeoView;
  window.openProducts = openProducts;
  window.openBayaanSpace = openBayaanSpace;

  function toast(icon, text, onUndo) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<i class="ti ${icon || "ti-check"}" aria-hidden="true"></i><span>${esc(
      text,
    )}</span>${onUndo ? `<button type="button" class="toast-undo-btn">Undo</button>` : ""}`;
    container.appendChild(el);
    const dismissAfter = onUndo ? 5000 : 2600;
    const timer = setTimeout(() => el.remove(), dismissAfter);
    if (onUndo) {
      const undoBtn = el.querySelector(".toast-undo-btn");
      undoBtn.addEventListener("click", () => {
        clearTimeout(timer);
        el.remove();
        onUndo();
      });
    }
  }
  window.toast = toast;

  // Demo pin: these 4 indicators always show up in the Indicators tab, in
  // this exact order, even across refreshes and even if someone removes one
  // — they get re-added in their original position on the next load, rather
  // than tacked onto the end. Anything else the user favourites is kept,
  // ordered after the pinned set.
  function ensurePinnedIndicators() {
    const pinnedIds = DEFAULT_SEED.indicators.map((p) => p.favId);
    const extras = store.indicators.filter((it) => !pinnedIds.includes(it.favId));
    const rebuilt = DEFAULT_SEED.indicators.map((pinned) => {
      const existing = store.indicators.find((it) => it.favId === pinned.favId);
      return existing || JSON.parse(JSON.stringify(pinned));
    }).concat(extras);
    const changed = JSON.stringify(rebuilt) !== JSON.stringify(store.indicators);
    store.indicators = rebuilt;
    return changed;
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw == null) {
        // Genuinely first-ever visit on this browser — nothing has seeded
        // localStorage yet (not even index.html). Seed the same defaults
        // index.html would have, so this page isn't out of sync with what
        // Home's "My Favourites" widget shows as already bookmarked.
        store = JSON.parse(JSON.stringify(DEFAULT_SEED));
        saveStore();
        return;
      }
      const saved = JSON.parse(raw);
      if (saved && typeof saved === "object") {
        TABS.forEach((k) => {
          store[k] = Array.isArray(saved[k]) ? saved[k] : [];
        });
      }
    } catch (e) {}
    if (ensurePinnedIndicators()) saveStore();
  }

  function saveStore() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/"/g, "&quot;");
  }

  function buildEmptyHTML() {
    if (searchQuery) {
      return `<div class="home-favourites-empty">
        <i class="ti ti-bookmark card-bookmark is-static" aria-hidden="true"></i>
        <p>No matches for &quot;${esc(searchQuery)}&quot;</p>
        <span class="home-favourites-empty-hint">Try a different search term.</span>
      </div>`;
    }
    return `<div class="home-favourites-empty">
      <i class="ti ti-bookmark card-bookmark is-static" aria-hidden="true"></i>
      <p>No favourites yet</p>
      <span class="home-favourites-empty-hint">Save important items to quickly access them here.</span>
    </div>`;
  }

  function buildBookmarkHTML(favId, variant) {
    const cls = variant === "obs" ? "obs-list-bookmark is-saved" : "ti ti-bookmark card-bookmark is-saved";
    const tag = variant === "obs" ? "button" : "i";
    const extra = variant === "obs" ? ' type="button"' : ' role="button" tabindex="0"';
    const iconInner = variant === "obs" ? '<i class="ti ti-bookmark"></i>' : "";
    return `<${tag}${extra} class="${cls}" data-fav-remove data-fav-id="${esc(favId)}" onclick="event.stopPropagation();FavPage.remove('${esc(favId)}')" title="Remove from favourites" aria-label="Remove from favourites">${iconInner}</${tag}>`;
  }

  function buildProductCardHTML(p) {
    const isDashboard = p.vizType === "dashboard-thumb" || activeTab === "dashboards";
    const safeName = esc(p.name);
    const useCaseTag = p.useCaseTag
      ? `<span class="product-usecase-tag" data-tag-type="${esc(
          String(p.useCaseTag).toLowerCase().replace(/\s+/g, "-"),
        )}">${esc(p.useCaseTag)}</span>`
      : "";
    if (isDashboard) {
      return `<div class="card product-card product-card--dashboard card-hover" data-fav-id="${esc(p.favId)}" onclick="FavPage.open('${esc(p.favId)}')">
        <div class="obs-list-hd">
          <div class="obs-list-icon"><i class="ti ${esc(p.catIcon || "ti-chart-bar")}"></i></div>
          <div class="obs-list-actions">${buildBookmarkHTML(p.favId, "obs")}</div>
        </div>
        <div class="product-name">${safeName}</div>
        <div class="product-val-row">
          <span class="product-val">${esc(p.val || "")}</span>
          <span class="product-unit">${esc(p.unit || "")}</span>
        </div>
        ${
          p.aiSummary
            ? `<div class="product-ai-row product-ai-row--dashboard">
          <i class="ti ti-bulb product-ai-bulb-glow" aria-hidden="true"></i>
          <span class="product-ai-text">${esc(p.aiSummary)}</span>
        </div>`
            : ""
        }
        <div class="product-card-footer">
          <span class="product-confidential-tag">Confidential</span>
        </div>
      </div>`;
    }
    const axis = p.axis || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return `<div class="card product-card card-hover" data-fav-id="${esc(p.favId)}" data-fav-idx="${esc(p.idx != null ? p.idx : 0)}" onclick="FavPage.open('${esc(p.favId)}')">
      <div class="product-card-toprow">
        <span class="product-cat-tag"><i class="ti ${esc(p.catIcon || "ti-trending-up")}"></i> <span class="product-cat-text">${esc(p.cat || "Economy")}</span></span>
        <div class="product-actions">${buildBookmarkHTML(p.favId)}</div>
      </div>
      <div class="product-name-row">
        <div class="product-name">${safeName}</div>
      </div>
      <div class="product-val">${esc(p.val || "")}</div>
      <div class="product-change ${esc(p.changeClass || "")}">${esc(p.change || "")}</div>
      <div class="product-viz"></div>
      <div class="product-axis">${axis.map((m) => `<span>${esc(m)}</span>`).join("")}</div>
      <div class="product-ai-row">
        <i class="ti ti-bulb"></i>
        <span><span class="product-ai-lbl">AI Summary</span> <span class="product-ai-text">${esc(p.aiSummary || "")}</span></span>
      </div>
      <div class="product-card-tags">
        <span class="product-confidential-tag">Confidential</span>
        ${useCaseTag}
      </div>
      <div class="product-card-footer-actions">
        <button type="button" class="product-card-download" title="Download" aria-label="Download data" onclick="event.stopPropagation();FavPage.download('${esc(p.favId)}')"><i class="ti ti-download"></i></button>
        <i class="ti ti-sparkles ai-sparkle-action" title="AI Summary" onclick="event.stopPropagation()"></i>
      </div>
    </div>`;
  }

  // ── Product-card chart rendering — ported from index.html's
  // HOME_PRODUCT_CHART_PRESETS / mountProductHighchart / initProductChartsInGrid
  // so favourited indicator cards get the same live Highcharts sparkline as
  // the Home "My Favourites" widget, keyed the same way (idx % presets.length
  // when the item has no explicit p.chart config). ──
  const PRODUCT_CHART_BASE_COLOR = "#0066FF";
  const PRODUCT_CHART_PRESETS = [
    { type: "area", data: [42, 45, 44, 50, 49, 55], categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    { type: "column", data: [32, 42, 36, 50, 40, 46], categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    { type: "area", data: [38, 34, 42, 46, 40, 54], categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    { type: "area", data: [40, 46, 42, 52, 48, 56], categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    { type: "column", data: [38, 46, 34, 42, 48, 36], categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    { type: "area", data: [44, 40, 48, 44, 52, 46], categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    { type: "area", data: [48, 42, 50, 44, 54, 48], categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    { type: "column", data: [30, 44, 38, 48, 34, 42], categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
  ];

  function buildAreaZoneFill(color) {
    return {
      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      stops: [
        [0, Highcharts.color(color).setOpacity(0.22).get("rgba")],
        [1, Highcharts.color(color).setOpacity(0).get("rgba")],
      ],
    };
  }

  function mountProductHighchart(viz, cfg, categories) {
    if (!viz || typeof Highcharts === "undefined") return null;
    const cats = categories || cfg.categories || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const isColumn = cfg.type === "column" || cfg.type === "bar";
    const lineColor = cfg.lineColor || cfg.baseColor || PRODUCT_CHART_BASE_COLOR;
    const pointData = (cfg.data || []).map((v) => ({
      y: typeof v === "object" && v != null ? v.y : v,
      color: lineColor,
    }));
    if (viz._hc) {
      try {
        viz._hc.destroy();
      } catch (e) {}
      viz._hc = null;
    }
    viz.innerHTML = "";
    const chart = Highcharts.chart(viz, {
      chart: {
        type: isColumn ? "column" : "areaspline",
        backgroundColor: "transparent",
        margin: [6, 2, 22, 2],
        height: 92,
        style: { fontFamily: "Inter, sans-serif" },
      },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      tooltip: {
        enabled: true,
        outside: true,
        headerFormat: '<span style="font-size:11px">{point.key}</span><br/>',
        pointFormat: "<b>{point.y}</b>",
      },
      xAxis: {
        categories: cats,
        lineWidth: 0,
        tickLength: 0,
        tickWidth: 0,
        gridLineWidth: 0,
        labels: {
          enabled: true,
          style: { fontSize: "9.5px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" },
          y: 14,
          autoRotation: false,
          overflow: "allow",
        },
      },
      yAxis: { visible: false, title: { text: null }, gridLineWidth: 0 },
      plotOptions: {
        series: { animation: false, enableMouseTracking: true, states: { hover: { enabled: true } } },
        column: { borderWidth: 0, borderRadius: 3, pointPadding: 0.12, groupPadding: 0.08, colorByPoint: true },
        areaspline: {
          fillOpacity: 0.18,
          lineWidth: 2,
          marker: { enabled: false, radius: 3, lineWidth: 0, states: { hover: { enabled: true, radius: 4 } } },
        },
      },
      series: [
        isColumn
          ? { type: "column", data: pointData, name: "Value" }
          : {
              type: "areaspline",
              data: pointData.map((p) => ({ y: p.y, marker: { enabled: false } })),
              color: lineColor,
              fillColor: buildAreaZoneFill(lineColor),
            },
      ],
    });
    viz._hc = chart;
    return chart;
  }

  function initProductChartsInGrid(grid) {
    if (!grid) return;
    grid.querySelectorAll(".product-card[data-fav-id] .product-viz").forEach((viz) => {
      const card = viz.closest(".product-card");
      const idx = parseInt(card.getAttribute("data-fav-idx"), 10) || 0;
      const cfg = PRODUCT_CHART_PRESETS[((idx % PRODUCT_CHART_PRESETS.length) + PRODUCT_CHART_PRESETS.length) % PRODUCT_CHART_PRESETS.length];
      if (!cfg) return;
      const axisEl = card.querySelector(".product-axis");
      const categories = axisEl
        ? Array.from(axisEl.querySelectorAll("span")).map((s) => s.textContent)
        : cfg.categories;
      if (typeof Highcharts !== "undefined") {
        mountProductHighchart(viz, cfg, categories);
        if (axisEl) axisEl.style.display = "none";
      }
    });
  }

  function buildObsCardHTML(o) {
    const kpis = (o.kpis || [])
      .map(
        (k) => `<div class="obs-kpi-box">
      <div class="obs-kpi-lbl">${esc(k.label)}</div>
      <div class="obs-kpi-num">${esc(k.value)}</div>
      <div class="obs-kpi-chg ${esc(k.chgClass || "")}">${esc(k.change)}</div>
    </div>`,
      )
      .join("");
    return `<article class="obs-list-card" onclick="FavPage.open('${esc(o.favId)}')">
    <div class="obs-list-top">
      <div class="obs-list-hd">
        <div class="obs-list-icon ${esc(o.iconClass || "")}"><i class="ti ${esc(o.icon || "ti-binoculars")}"></i></div>
        <div class="obs-list-actions">${buildBookmarkHTML(o.favId, "obs")}</div>
      </div>
      <div class="obs-list-name">${esc(o.name)}</div>
      <p class="obs-list-desc">${esc(o.desc || "")}</p>
    </div>
    <div class="obs-list-kpis">${kpis}</div>
  </article>`;
  }

  function buildArtCardHTML(a) {
    return `<div class="art-card" onclick="FavPage.open('${esc(a.favId)}')">
    <div class="art-thumb" style="background:${esc(a.bg || "#eff6ff")}"><i class="ti ${esc(a.ico || "ti-clock")}" style="color:${esc(a.co || "#2563eb")}"></i></div>
    <div class="art-info">
      <div class="art-name">${esc(a.name)}</div>
      <div class="art-meta">${esc(a.date || "")}</div>
      <div class="art-card-actions">
        <button type="button" class="art-card-btn" onclick="event.stopPropagation();FavPage.open('${esc(a.favId)}')">Continue</button>
      </div>
    </div>
  </div>`;
  }

  function renderPanel() {
    const panel = document.getElementById("favPanel");
    if (!panel) return;
    const all = store[activeTab] || [];
    const q = searchQuery.trim().toLowerCase();
    const items = q
      ? all.filter((it) => String(it.name || "").toLowerCase().includes(q))
      : all;
    if (!items.length) {
      panel.className = "home-favourites-panel home-favourites-panel--empty";
      panel.innerHTML = buildEmptyHTML();
      return;
    }
    if (activeTab === "indicators" || activeTab === "dashboards") {
      panel.className = "home-favourites-panel home-favourites-panel--products";
      panel.innerHTML = `<div class="products-grid">${items.map(buildProductCardHTML).join("")}</div>`;
      initProductChartsInGrid(panel.querySelector(".products-grid"));
      return;
    }
    if (activeTab === "observatory") {
      panel.className = "home-favourites-panel home-favourites-panel--obs";
      panel.innerHTML = `<div class="obs-carousel">${items.map(buildObsCardHTML).join("")}</div>`;
      return;
    }
    panel.className = "home-favourites-panel home-favourites-panel--frequent";
    panel.innerHTML = `<div class="art-grid home-favourites-frequent-list">${items.map(buildArtCardHTML).join("")}</div>`;
  }

  function setActiveTab(tab) {
    if (!TABS.includes(tab)) return;
    activeTab = tab;
    document.querySelectorAll("#favTabs .prod-browse-toggle").forEach((el) => {
      el.classList.toggle("active", el.dataset.favTab === tab);
    });
    renderPanel();
  }

  function initTabs() {
    document.querySelectorAll("#favTabs .prod-browse-toggle").forEach((el) => {
      el.addEventListener("click", () => setActiveTab(el.dataset.favTab));
    });
  }

  function updateTabCounts() {
    const ids = {
      indicators: "favCountIndicators",
      dashboards: "favCountDashboards",
      observatory: "favCountObservatory",
      frequent: "favCountFrequent",
    };
    TABS.forEach((tab) => {
      const el = document.getElementById(ids[tab]);
      if (el) el.textContent = String((store[tab] || []).length);
    });
  }

  // Public API used by the inline onclick handlers in the card templates
  // above (kept as plain onclick strings — same convention this app's own
  // card templates already use for their onclick attributes).
  window.FavPage = {
    open(favId) {
      const item = (store[activeTab] || []).find((it) => it.favId === favId);
      if (!item) return;
      window.location.href =
        "index.html?openFavourite=" + encodeURIComponent(activeTab) + ":" + encodeURIComponent(favId);
    },
    remove(favId) {
      const list = store[activeTab];
      if (!list) return;
      const idx = list.findIndex((it) => it.favId === favId);
      if (idx === -1) return;
      const removedItem = list[idx];
      const removedTab = activeTab;
      list.splice(idx, 1);
      saveStore();
      renderPanel();
      updateTabCounts();
      toast("ti-bookmark", "Removed from My Favourites", () => {
        const undoList = store[removedTab];
        if (!undoList) return;
        const stillMissing = !undoList.some((it) => it.favId === removedItem.favId);
        if (stillMissing) undoList.splice(Math.min(idx, undoList.length), 0, removedItem);
        saveStore();
        if (activeTab === removedTab) renderPanel();
        updateTabCounts();
        toast("ti-bookmark", "Added back to My Favourites");
      });
    },
    search(value) {
      searchQuery = value || "";
      renderPanel();
    },
    download(favId) {
      const item = (store[activeTab] || []).find((it) => it.favId === favId);
      if (!item) return;
      const rows = [
        ["Name", "Value", "Change", "Category"],
        [item.name || "", item.val || "", item.change || "", item.cat || ""],
      ];
      const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (item.name || "favourite").replace(/[^\w\s-]/g, "").trim() + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    bootHeaderChrome();
    if (window.initBayaanFooter) initBayaanFooter();
    loadStore();
    initTabs();
    updateTabCounts();
    renderPanel();
  });
})();
