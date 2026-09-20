/* LMO Observe — Insights cards + Official SVs product grid */
(function () {
  const INDICATORS = window.LMO_INDICATORS || [];
  const INSIGHTS = window.LMO_INSIGHTS || [];
  const H = window.LMO_INSIGHT_HELPERS || {};
  const PAGE_SIZE = 6;
  const AXIS_YEARS = ["2020", "2021", "2022", "2023", "2024", "2025"];
  const TREND_COLOR = "#3B82F6";
  const EMPTY_MSG = '<div class="empty-msg">No indicators match your filters.</div>';
  const INSIGHT_LEGEND = H.INSIGHT_LEGEND || "";

  const CAT_META = {
    employment: { icon: "ti-briefcase", label: "Employment" },
    unemployment: { icon: "ti-user-x", label: "Unemployment" },
    wages: { icon: "ti-coin", label: "Wages & Compensation" },
    demographics: { icon: "ti-users", label: "Demographics" },
    skills: { icon: "ti-school", label: "Skills & Education" },
    sectors: { icon: "ti-building", label: "Sectors & Activity" },
    flows: { icon: "ti-arrows-exchange", label: "Flow Analysis" },
  };

  const STATUS = {
    stable: { label: "Stable", tag: "stable", color: "#2563EB" },
    watch: { label: "Watch", tag: "watch", color: "#B45309" },
    moderate: { label: "Moderate", tag: "moderate", color: "#0284C7" },
    critical: { label: "Critical", tag: "critical", color: "#DC2626" },
  };

  let activeTab = "insights";
  let currentPage = 1;
  let filteredList = [];
  const charts = {};

  function searchQuery() {
    return (document.getElementById("obs-search")?.value || "").toLowerCase();
  }

  function buildPyramidHtml(item) {
    return H.buildPyramidHtml ? H.buildPyramidHtml(item) : "";
  }

  function buildInsightCard(item) {
    const up = item.delta >= 0;
    const chgCls = up ? "up" : "dn";
    const iconClass = item.icon || "ti-shield-check";
    const body =
      item.type === "breakdown"
        ? `<div class="obs-insight-body obs-insight-body--pyramid">${buildPyramidHtml(item)}</div>`
        : `<div class="obs-insight-body obs-insight-body--chart"><canvas id="ins-${item.id}" aria-hidden="true"></canvas></div>`;
    const kpi = item.hideKpi
      ? `<div class="obs-insight-kpi obs-insight-kpi--empty" aria-hidden="true"></div>`
      : `<div class="obs-insight-kpi">
          <span class="obs-insight-headline">${item.headline}</span>
          <span class="obs-insight-delta ${chgCls}"><i class="ti ti-arrow-${up ? "up" : "down"}"></i>${Math.abs(item.delta)}% YoY</span>
        </div>`;
    const legend = item.type === "breakdown" ? INSIGHT_LEGEND : "";

    return `<article class="obs-insight-card" data-id="${item.id}" role="button" tabindex="0">
      <div class="obs-insight-top">
        <span class="obs-insight-shield"><i class="ti ${iconClass}" aria-hidden="true"></i></span>
        <h3 class="obs-insight-title">${item.title}</h3>
        <div class="obs-insight-actions">
          <i class="ti ti-download" title="Download" data-action="download"></i>
          <i class="ti ti-arrows-maximize" title="Expand" data-action="expand"></i>
        </div>
      </div>
      ${kpi}
      ${body}
      <div class="obs-insight-foot" title="${item.insight.replace(/"/g, "&quot;")}"><i class="ti ti-bulb"></i><span>${item.insight}</span></div>
      <div class="obs-insight-meta">${legend}<span class="obs-insight-date"><i class="ti ti-calendar" aria-hidden="true"></i>${item.updated}</span></div>
    </article>`;
  }

  function formatValue(ind) {
    if (ind.unit === "%") return ind.value + "%";
    return ind.value;
  }

  function favAttr(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function changeMeta(ind) {
    const sign = ind.chg > 0 ? "+" : "";
    const arrow =
      ind.dir === "up" ? "ti-arrow-up" : ind.dir === "dn" ? "ti-arrow-down" : "ti-minus";
    const cls =
      ind.dir === "up" ? "val-green" : ind.dir === "dn" ? "val-red" : "val-amber";
    const text = `${sign}${ind.chg}% ${ind.chgLbl || ""}`.trim();
    return { arrow, cls, text };
  }

  function buildCard(ind) {
    const cat = CAT_META[ind.cat] || { icon: "ti-chart-dots", label: ind.cat };
    const st = STATUS[ind.status] || STATUS.stable;
    const chg = changeMeta(ind);
    const name = ind.sub ? `${ind.title} — ${ind.sub}` : ind.title;
    const unitSuffix =
      ind.unit === "AED"
        ? ' <span class="product-unit">AED</span>'
        : ind.unit && ind.unit !== "%"
          ? ` <span class="product-unit">${ind.unit}</span>`
          : "";

    return `<article class="card product-card card-hover" data-id="${ind.id}" role="button" tabindex="0">
      <div class="product-card-toprow">
        <span class="product-cat-tag"><i class="ti ${cat.icon}"></i> <span class="product-cat-text">${cat.label}</span></span>
        <div class="product-actions">
          <button type="button" class="product-action-btn ai-sparkle-action" title="Ask Bayaan AI" aria-label="Ask Bayaan AI" data-id="${ind.id}"><i class="ti ti-sparkles"></i></button>
          <i class="ti ti-bookmark" data-fav-toggle data-fav-store="indicators" data-fav-id="lmo-obs-${favAttr(ind.id)}" data-fav-name="${favAttr(name)}" data-fav-val="${favAttr(formatValue(ind))}" data-fav-change="${favAttr(chg.text)}" data-fav-change-class="${favAttr(chg.cls)}" data-fav-cat="${favAttr(cat.label)}" data-fav-cat-icon="${favAttr(cat.icon)}" data-fav-ai="${favAttr(ind.insight)}"></i>
          <i class="ti ti-arrow-up-right" title="Open"></i>
        </div>
      </div>
      <div class="product-name-row"><div class="product-name">${name}</div></div>
      <div class="product-val">${formatValue(ind)}${unitSuffix}</div>
      <div class="product-change ${chg.cls}"><i class="ti ${chg.arrow}"></i>${chg.text}</div>
      <div class="product-viz"><canvas id="spark-${ind.id}" aria-hidden="true"></canvas></div>
      <div class="product-axis">${AXIS_YEARS.map((y) => `<span>${y}</span>`).join("")}</div>
      <div class="product-ai-row"><i class="ti ti-bulb"></i><span><span class="product-ai-lbl">AI Summary</span> <span class="product-ai-text">${ind.insight}</span></span></div>
      <div class="product-card-tags">
        <span class="product-usecase-tag" data-tag-type="${st.tag}">${st.label}</span>
      </div>
    </article>`;
  }

  function initPyrLabelTooltips(root) {
    if (!root) return;
    root.querySelectorAll(".obs-pyr-lbl").forEach((el) => {
      const full = el.dataset.full || el.textContent.trim();
      if (el.scrollWidth > el.clientWidth) {
        el.classList.add("obs-pyr-lbl--trunc");
        el.setAttribute("title", full);
      } else {
        el.classList.remove("obs-pyr-lbl--trunc");
        el.removeAttribute("title");
      }
    });
  }

  function destroyCharts() {
    Object.values(charts).forEach((c) => c.destroy());
    for (const k in charts) delete charts[k];
  }

  function chartOptions(showAxes) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: LMO.chartJsScales(showAxes, function (v) {
        const n = Number(v);
        if (n >= 1000) return (n / 1000).toFixed(1) + "K";
        return parseFloat(n.toFixed(1));
      }),
      animation: false,
    };
  }

  function renderInsightChart(item) {
    const el = document.getElementById("ins-" + item.id);
    if (!el || typeof Chart === "undefined") return;

    charts[item.id] = new Chart(el, {
      type: "line",
      data: {
        labels: item.labels,
        datasets: [
          {
            data: item.series,
            borderColor: TREND_COLOR,
            borderWidth: 2,
            pointRadius: 2,
            pointBackgroundColor: TREND_COLOR,
            tension: 0.35,
            fill: true,
            backgroundColor: TREND_COLOR + "18",
          },
        ],
      },
      options: chartOptions(true),
    });
  }

  function renderPagination(total, totalPages) {
    const bar = document.getElementById("pag-bar");
    const info = document.getElementById("pag-info");
    const ctrls = document.getElementById("pag-ctrls");
    if (!bar || !info || !ctrls) return;

    if (total <= PAGE_SIZE) {
      bar.hidden = true;
      return;
    }

    bar.hidden = false;
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(currentPage * PAGE_SIZE, total);
    info.innerHTML = `Showing <strong>${start}–${end}</strong> of <strong>${total}</strong> indicators`;

    let pages = "";
    for (let p = 1; p <= totalPages; p++) {
      pages += `<button type="button" class="pag-btn pag-num${p === currentPage ? " act" : ""}" data-page="${p}">${p}</button>`;
    }
    ctrls.innerHTML = `<button type="button" class="pag-btn pag-nav" data-page="${currentPage - 1}"${currentPage === 1 ? " disabled" : ""}>Previous</button>${pages}<button type="button" class="pag-btn pag-nav" data-page="${currentPage + 1}"${currentPage === totalPages ? " disabled" : ""}>Next</button>`;
  }

  function renderSpark(ind) {
    const el = document.getElementById("spark-" + ind.id);
    if (!el || typeof Chart === "undefined") return;

    const st = STATUS[ind.status] || STATUS.stable;
    const color = st.color;
    const labels = ind.spark.map(() => "");

    if (ind.bar) {
      charts[ind.id] = new Chart(el, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              data: ind.spark,
              backgroundColor: ind.spark.map((v) =>
                v >= 0 ? color + "99" : "#7C3AED99"
              ),
              borderRadius: 3,
              borderSkipped: false,
            },
          ],
        },
        options: chartOptions(false),
      });
      return;
    }

    charts[ind.id] = new Chart(el, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: ind.spark,
            borderColor: color,
            borderWidth: 2,
            pointRadius: ind.flow ? 0 : 2,
            pointBackgroundColor: color,
            tension: 0.35,
            fill: true,
            backgroundColor: color + "18",
          },
        ],
      },
      options: chartOptions(true),
    });
  }

  function renderGrid(resetPage) {
    const grid = document.getElementById("ind-grid");
    const pagBar = document.getElementById("pag-bar");
    if (!grid) return;

    destroyCharts();
    const q = searchQuery();

    if (activeTab === "insights") {
      const list = INSIGHTS.filter((item) => !q || item.title.toLowerCase().includes(q));
      grid.className = "products-grid products-grid--insights";
      grid.innerHTML = list.length ? list.map(buildInsightCard).join("") : EMPTY_MSG;
      if (pagBar) pagBar.hidden = true;
      requestAnimationFrame(() => {
        list.filter((i) => i.type === "trend").forEach(renderInsightChart);
        initPyrLabelTooltips(grid);
      });
      setTimeout(LMO.reportEmbedHeight, 100);
      return;
    }

    if (resetPage) currentPage = 1;
    filteredList = INDICATORS.filter(
      (ind) =>
        !q ||
        (ind.title + ind.sub + ind.subcat).toLowerCase().includes(q)
    );

    grid.className = "products-grid";

    if (!filteredList.length) {
      grid.innerHTML = EMPTY_MSG;
      if (pagBar) pagBar.hidden = true;
      setTimeout(LMO.reportEmbedHeight, 100);
      return;
    }

    const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = totalPages;

    const pageItems = filteredList.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );
    grid.innerHTML = pageItems.map(buildCard).join("");
    renderPagination(filteredList.length, totalPages);

    requestAnimationFrame(() => pageItems.forEach(renderSpark));
    setTimeout(LMO.reportEmbedHeight, 100);
  }

  function goToPage(page) {
    const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
    currentPage = Math.max(1, Math.min(page, totalPages));
    renderGrid(false);
  }

  function updateTabCounts() {
    const offEl = document.getElementById("official-count");
    const insEl = document.getElementById("insights-count");
    if (offEl) offEl.textContent = INDICATORS.length;
    if (insEl) insEl.textContent = INSIGHTS.length;
  }

  function initTabs() {
    const bar = document.getElementById("view-tabs");
    if (!bar) return;

    bar.querySelectorAll(".prod-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        activeTab = tab.dataset.tab;
        bar.querySelectorAll(".prod-tab").forEach((t) => {
          const on = t.dataset.tab === activeTab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        renderGrid(true);
      });
    });

    updateTabCounts();
  }

  function initFilters() {
    document.getElementById("obs-search")?.addEventListener("input", () =>
      renderGrid(true)
    );
  }

  function initGridEvents() {
    const grid = document.getElementById("ind-grid");
    const pag = document.getElementById("pag-ctrls");
    if (!grid) return;

    grid.addEventListener("click", (e) => {
      const download = e.target.closest("[data-action='download']");
      if (download) {
        e.stopPropagation();
        return;
      }

      const sparkle = e.target.closest(".ai-sparkle-action");
      if (sparkle) {
        e.stopPropagation();
        const ind = INDICATORS.find((i) => i.id === sparkle.dataset.id);
        if (ind) {
          openChat(
            `Analyse ${ind.title} — ${ind.sub}. Current value ${ind.value}. ${ind.insight}`,
            ind.title
          );
        }
        return;
      }

      const insightCard = e.target.closest(".obs-insight-card[data-id]");
      if (insightCard) {
        LMO.goToInsight(insightCard.dataset.id);
        return;
      }

      const card = e.target.closest(".product-card[data-id]");
      if (card) LMO.goToIndicator(card.dataset.id);
    });

    grid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const insightCard = e.target.closest(".obs-insight-card[data-id]");
      if (insightCard) {
        e.preventDefault();
        LMO.goToInsight(insightCard.dataset.id);
        return;
      }
      const card = e.target.closest(".product-card[data-id]");
      if (!card) return;
      e.preventDefault();
      LMO.goToIndicator(card.dataset.id);
    });

    pag?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-page]");
      if (!btn || btn.disabled) return;
      goToPage(parseInt(btn.dataset.page, 10));
    });
  }

  window.addEventListener("load", () => {
    LMO.initLmoEmbed();
    initTabs();
    initFilters();
    initGridEvents();
    renderGrid(true);
    setTimeout(LMO.reportEmbedHeight, 500);
  });

  window.addEventListener("resize", () => {
    setTimeout(LMO.reportEmbedHeight, 200);
    initPyrLabelTooltips(document.getElementById("ind-grid"));
  });

  LMO.onThemeChange(() => renderGrid(false));
})();
