/* LMO Insight detail page logic */
(function () {
  const INSIGHTS = window.LMO_INSIGHTS || [];
  const FILTER_DEFS = window.LMO_INSIGHT_FILTER_DEFS || {};
  const H = window.LMO_INSIGHT_HELPERS || {};
  const TREND_COLOR = "#0066FF";
  const EMI_COLOR = "#5347CD";
  const NON_COLOR = "#4583FD";

  let currentItem = null;
  let mainChart = null;
  let chartMode = "line";

  function chartTooltip(extra) {
    return Object.assign({}, LMO.chartJsTooltip(), extra || {});
  }

  function verticalChartScales(item) {
    const ax = LMO.chartAxes();
    return {
      x: { grid: { display: false }, ticks: { color: ax.tick, font: { size: 10 } } },
      y: {
        grid: { color: ax.grid },
        ticks: {
          color: ax.tick,
          font: { size: 10 },
          callback: (v) => fmtChartVal(v, item),
        },
      },
    };
  }

  function horizontalBarScales(item) {
    const ax = LMO.chartAxes();
    return {
      x: {
        grid: { color: ax.grid },
        ticks: {
          color: ax.tick,
          font: { size: 11 },
          callback: (v) => (H.fmtBar ? H.fmtBar(v, item.fmt) : v),
        },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: ax.tick,
          font: { size: 12, weight: "500" },
          autoSkip: false,
          crossAlign: "far",
        },
      },
    };
  }
  let filterState = {};
  let activeStake = "policy";

  function $(id) {
    return document.getElementById(id);
  }

  function escHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function defaultFilterValue(def) {
    return def.options[0];
  }

  function initFilterState(item) {
    filterState = {};
    (item.filters || []).forEach((key) => {
      const def = FILTER_DEFS[key];
      if (def) filterState[key] = defaultFilterValue(def);
    });
  }

  function countAppliedFilters() {
    let n = 0;
    Object.keys(filterState).forEach((key) => {
      const def = FILTER_DEFS[key];
      if (def && filterState[key] !== def.options[0]) n++;
    });
    return n;
  }

  function syncFilterCount() {
    const n = countAppliedFilters();
    const el = $("filter-count");
    if (el) el.textContent = n === 1 ? "1 filter applied" : n + " filters applied";
    const reset = $("filter-reset");
    if (reset) reset.disabled = n === 0;
  }

  function filterContextLine() {
    const parts = Object.keys(filterState).map((k) => filterState[k]);
    const years =
      currentItem && currentItem.labels
        ? currentItem.labels[0] + "—" + currentItem.labels[currentItem.labels.length - 1]
        : "";
    return parts.join(" · ") + (years ? " · " + years : "");
  }

  function buildFilterDropdown(key, def) {
    const uid = "lid-f-" + key;
    const options = def.options
      .map(
        (opt) =>
          `<button type="button" class="prod-filter-dd-option${filterState[key] === opt ? " is-active" : ""}" data-filter-key="${key}" data-filter-value="${escHtml(opt)}" role="option">${escHtml(opt)} <i class="ti ti-check" aria-hidden="true"></i></button>`
      )
      .join("");

    return `<div class="lid-filter-item">
      <label for="${uid}-trigger">${escHtml(def.label)}</label>
      <div class="prod-filter-dd" data-filter-dd="${key}">
        <button type="button" class="prod-filter-dd-trigger" id="${uid}-trigger" aria-expanded="false" aria-controls="${uid}-menu">
          <i class="ti ${def.icon} prod-filter-dd-lead" aria-hidden="true"></i>
          <span data-dd-label>${escHtml(filterState[key])}</span>
          <i class="ti ti-chevron-down prod-filter-arrow" aria-hidden="true"></i>
        </button>
        <div class="prod-filter-dd-menu" id="${uid}-menu" role="listbox" hidden>${options}</div>
      </div>
    </div>`;
  }

  function renderFilters(item) {
    const row = $("filter-row");
    if (!row) return;
    row.innerHTML = (item.filters || [])
      .map((key) => {
        const def = FILTER_DEFS[key];
        return def ? buildFilterDropdown(key, def) : "";
      })
      .join("");
    syncFilterCount();
  }

  function closeAllDropdowns(except) {
    document.querySelectorAll(".prod-filter-dd-trigger.is-open").forEach((btn) => {
      if (except && btn === except) return;
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      const menu = btn.parentElement.querySelector(".prod-filter-dd-menu");
      if (menu) menu.hidden = true;
    });
  }

  function initFilterEvents() {
    const row = $("filter-row");
    if (!row) return;

    row.addEventListener("click", (e) => {
      const opt = e.target.closest(".prod-filter-dd-option");
      if (opt) {
        const key = opt.dataset.filterKey;
        const val = opt.dataset.filterValue;
        filterState[key] = val;
        const dd = opt.closest(".prod-filter-dd");
        dd.querySelector("[data-dd-label]").textContent = val;
        dd.querySelectorAll(".prod-filter-dd-option").forEach((o) =>
          o.classList.toggle("is-active", o.dataset.filterValue === val)
        );
        closeAllDropdowns();
        $("chart-context").textContent = filterContextLine();
        syncFilterCount();
        return;
      }

      const trigger = e.target.closest(".prod-filter-dd-trigger");
      if (trigger) {
        const open = trigger.classList.contains("is-open");
        closeAllDropdowns();
        if (!open) {
          trigger.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          trigger.parentElement.querySelector(".prod-filter-dd-menu").hidden = false;
        }
        return;
      }
    });

    $("filter-reset")?.addEventListener("click", () => {
      if (!currentItem) return;
      initFilterState(currentItem);
      renderFilters(currentItem);
      $("chart-context").textContent = filterContextLine();
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".prod-filter-dd")) closeAllDropdowns();
    });
  }

  function destroyChart() {
    if (mainChart) {
      mainChart.destroy();
      mainChart = null;
    }
  }

  function fmtChartVal(v, item) {
    if (item.type === "trend") {
      if (item.headline && String(item.headline).includes("%")) return v.toFixed(1) + "%";
      if (v >= 1) return v.toFixed(2) + "M";
      return v.toFixed(2);
    }
    return H.fmtBar ? H.fmtBar(v, item.fmt) : v;
  }

  function buildLineChart(item) {
    destroyChart();
    $("chart-wrap").hidden = false;
    $("pyramid-wrap").hidden = true;
    $("data-table").hidden = true;
    const canvas = $("main-chart");
    if (!canvas || typeof Chart === "undefined") return;

    mainChart = new Chart(canvas, {
      type: "line",
      data: {
        labels: item.labels,
        datasets: [
          {
            data: item.series,
            borderColor: TREND_COLOR,
            borderWidth: 2.6,
            pointRadius: 4,
            pointBackgroundColor: TREND_COLOR,
            tension: 0.35,
            fill: true,
            backgroundColor: TREND_COLOR + "22",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: chartTooltip({
            callbacks: { label: (ctx) => fmtChartVal(ctx.raw, item) },
          }),
        },
        scales: verticalChartScales(item),
      },
    });
  }

  function buildBarChart(item) {
    if (item.type === "trend") {
      destroyChart();
      $("chart-wrap").hidden = false;
      $("pyramid-wrap").hidden = true;
      $("data-table").hidden = true;
      const canvas = $("main-chart");
      if (!canvas || typeof Chart === "undefined") return;

      mainChart = new Chart(canvas, {
        type: "bar",
        data: {
          labels: item.labels,
          datasets: [
            {
              data: item.series,
              backgroundColor: TREND_COLOR + "99",
              borderRadius: 4,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: verticalChartScales(item),
        },
      });
      return;
    }

    destroyChart();
    $("chart-wrap").hidden = false;
    $("pyramid-wrap").hidden = true;
    $("data-table").hidden = true;
    const canvas = $("main-chart");
    if (!canvas || typeof Chart === "undefined") return;

    mainChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: item.labels,
        datasets: [
          {
            label: "Emirati",
            data: item.a,
            backgroundColor: EMI_COLOR + "99",
            borderRadius: 4,
          },
          {
            label: "Non-Emirati",
            data: item.b,
            backgroundColor: NON_COLOR + "99",
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { left: 4, right: 12, top: 4, bottom: 4 } },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: { boxWidth: 10, font: { size: 11 }, padding: 16, color: LMO.chartAxes().tick },
          },
          tooltip: chartTooltip({
            callbacks: {
              label: (ctx) =>
                ctx.dataset.label +
                ": " +
                (H.fmtBar ? H.fmtBar(ctx.raw, item.fmt) : ctx.raw),
            },
          }),
        },
        scales: horizontalBarScales(item),
      },
    });
  }

  function buildTable(item) {
    destroyChart();
    $("chart-wrap").hidden = true;
    $("pyramid-wrap").hidden = true;
    const tableEl = $("data-table");
    tableEl.hidden = false;

    if (item.type === "trend") {
      tableEl.innerHTML =
        "<table><thead><tr><th>Period</th><th>Value</th></tr></thead><tbody>" +
        item.labels
          .map(
            (lbl, i) =>
              `<tr><td>${escHtml(lbl)}</td><td>${escHtml(fmtChartVal(item.series[i], item))}</td></tr>`
          )
          .join("") +
        "</tbody></table>";
      return;
    }

    tableEl.innerHTML =
      "<table><thead><tr><th>Segment</th><th>Emirati</th><th>Non-Emirati</th></tr></thead><tbody>" +
      item.labels
        .map(
          (lbl, i) =>
            `<tr><td>${escHtml(lbl)}</td><td>${escHtml(H.fmtBar(item.a[i], item.fmt))}</td><td>${escHtml(H.fmtBar(item.b[i], item.fmt))}</td></tr>`
        )
        .join("") +
      "</tbody></table>";
  }

  function buildPyramidView(item) {
    destroyChart();
    $("chart-wrap").hidden = true;
    $("data-table").hidden = true;
    const wrap = $("pyramid-wrap");
    wrap.hidden = false;
    wrap.innerHTML = H.buildPyramidHtml ? H.buildPyramidHtml(item) : "";
  }

  function renderChart(item) {
    if (chartMode === "table") {
      buildTable(item);
      return;
    }
    if (item.type === "breakdown" && chartMode === "line") {
      buildPyramidView(item);
      return;
    }
    if (chartMode === "bar") buildBarChart(item);
    else buildLineChart(item);
  }

  function renderMetricRow(item) {
    const row = $("metric-row");
    if (!row) return;
    if (item.hideKpi) {
      row.hidden = true;
      return;
    }
    row.hidden = false;
    $("metric-value").textContent = item.headline || "—";
    $("metric-label").textContent = item.type === "trend" ? "latest value" : "peak segment";
    const deltaEl = $("metric-delta");
    const up = (item.delta || 0) >= 0;
    deltaEl.className = "lid-delta" + (up ? "" : " dn");
    deltaEl.innerHTML = `<i class="ti ti-arrow-${up ? "up" : "down"}"></i> ${Math.abs(item.delta || 0)}% YoY`;
  }

  function renderSignalStrip(item) {
    const sig = H.signalMetrics ? H.signalMetrics(item) : {};
    const yoyColor = sig.yoy && sig.yoy.startsWith("+") ? "good" : "";
    $("signal-strip").innerHTML = `
      <div class="lid-signal">
        <div class="lid-sig-icon"><i class="ti ti-chart-line"></i></div>
        <div class="lid-sig-copy"><small>Latest</small><b>${escHtml(sig.latest)}</b></div>
      </div>
      <div class="lid-signal">
        <div class="lid-sig-icon ${yoyColor}"><i class="ti ti-trending-up"></i></div>
        <div class="lid-sig-copy"><small>Year-on-year change</small><b style="color:${yoyColor ? "#14946e" : "inherit"}">${escHtml(sig.yoy)}</b></div>
      </div>
      <div class="lid-signal">
        <div class="lid-sig-icon longterm"><i class="ti ti-history"></i></div>
        <div class="lid-sig-copy"><small>${escHtml(sig.sinceLabel || "Since baseline")}</small><b>${escHtml(sig.since)}</b></div>
      </div>`;
  }

  function renderStakeholderText(item) {
    const copy = item.stakeholders || {};
    const overview =
      "<strong>Overview:</strong> " + item.insight;
    const map = { policy: copy.policy || overview, employers: copy.employers || overview, seekers: copy.seekers || overview };
    $("stakeholder-text").innerHTML = map[activeStake] || overview;
  }

  function renderInsight(item) {
    currentItem = item;
    initFilterState(item);

    document.title = item.title + " — LMO Observe · Bayaan";
    $("bc-ind").textContent = item.title;
    $("page-title").textContent = item.title;
    $("page-subtitle").textContent = item.subtitle || "";
    $("page-updated").textContent = "Updated " + item.updated;
    $("analysis-icon").className = "ti " + (item.icon || "ti-chart-line");
    $("analysis-summary").textContent = item.chartSummary || item.insight;
    $("chart-context").textContent = filterContextLine();
    $("chart-leg-label").textContent = item.title;

    $("meta-name").textContent = item.title;
    $("meta-category").textContent = item.category || "Employment";
    $("meta-desc").textContent = item.description || item.title;
    $("meta-updated").textContent = item.updated;

    renderFilters(item);
    renderMetricRow(item);
    renderSignalStrip(item);
    renderStakeholderText(item);
    renderChart(item);

    const rangeCtrl = $("range-control");
    if (rangeCtrl) rangeCtrl.hidden = item.type !== "trend";

    document.querySelectorAll(".lid-chart-btn").forEach((btn) => {
      const mode = btn.dataset.chart;
      if (item.type === "breakdown" && mode === "line") {
        btn.querySelector("span").textContent = "Pyramid";
      } else if (mode === "line") {
        btn.querySelector("span").textContent = "Trend";
      }
    });
  }

  function showNotFound() {
    $("page-content").innerHTML = `
      <div class="ind-detail-not-found">
        <h2>Insight not found</h2>
        <p>The requested insight indicator does not exist.</p>
        <p style="margin-top:16px"><a href="#" id="not-found-back">← Back to Observe</a></p>
      </div>`;
    document.getElementById("not-found-back").addEventListener("click", (e) => LMO.goToObserve(e));
  }

  function initChartSwitch() {
    document.querySelectorAll(".lid-chart-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".lid-chart-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        chartMode = btn.dataset.chart;
        if (currentItem) renderChart(currentItem);
      });
    });
  }

  function initRangeButtons() {
    document.querySelectorAll(".lid-range-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".lid-range-btn").forEach((b) => b.classList.remove("act", "active"));
        btn.classList.add("act", "active");
      });
    });
  }

  function initStakeholderTabs() {
    document.querySelectorAll(".lid-stake").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".lid-stake").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeStake = btn.dataset.stake;
        if (currentItem) renderStakeholderText(currentItem);
      });
    });
  }

  function initDisplayPanel() {
    $("btn-display")?.addEventListener("click", (e) => {
      e.stopPropagation();
      $("display-panel").classList.toggle("open");
    });
    document.querySelectorAll(".lid-toggle").forEach((t) => {
      t.addEventListener("click", () => t.classList.toggle("on"));
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".lid-viz-actions")) $("display-panel")?.classList.remove("open");
    });
    $("btn-download")?.addEventListener("click", () => {
      const toast = $("toast");
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1800);
    });
  }

  function initFromUrl() {
    const id = new URLSearchParams(location.search).get("id");
    const item = H.findInsight ? H.findInsight(id) : INSIGHTS.find((i) => i.id === id);
    if (!item) {
      showNotFound();
      return;
    }
    renderInsight(item);
  }

  window.addEventListener("load", () => {
    LMO.initLmoEmbed();
    $("bc-observe")?.addEventListener("click", (e) => LMO.goToObserve(e));
    initFilterEvents();
    initChartSwitch();
    initRangeButtons();
    initStakeholderTabs();
    initDisplayPanel();
    initFromUrl();
    setTimeout(LMO.reportEmbedHeight, 100);
    LMO.onThemeChange(() => {
      if (currentItem) renderChart(currentItem);
    });
  });

  window.addEventListener("resize", () => setTimeout(LMO.reportEmbedHeight, 200));
})();
