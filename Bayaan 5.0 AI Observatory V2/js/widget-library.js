/**
 * Shared widget library — persists widgets built in Widget Studio
 * and renders previews for the home page widget picker.
 */
(function (global) {
  const STORAGE_KEY = "bayaan_widget_library_v1";
  const LIBRARY_CHANGE_EVENT = "bayaan-widget-library-change";
  const ID_PREFIX = "built-";

  const PANEL_LABELS = {
    kpi: "KPIs",
    chart: "Chart",
    map: "Map",
    table: "Table",
    forecast: "Forecast",
    narrative: "AI Narrative",
  };

  const KPI_TONE_COLORS = {
    success: "#059669",
    accent: "#0066FF",
    warn: "#D97706",
    purple: "#7C3AED",
    teal: "#0D9488",
    neutral: "#475569",
  };

  const KPI_STUDIO_TONE_VARS = {
    success: "var(--success)",
    accent: "var(--accent)",
    warn: "var(--warn)",
    purple: "var(--purple)",
    teal: "var(--teal)",
    neutral: "var(--text2)",
  };

  /** Pre-published catalog widgets shipped with Widget Studio. */
  const SEED_WIDGETS = [
    {
      id: "built-seed-al-ain-employment-pulse",
      title: "Al Ain Employment Pulse",
      description:
        "Employment index, GDP contribution, and manufacturing share for Al Ain — Q2 2026.",
      status: "published",
      meta: "Al Ain · Q2 2026",
      publishedAt: "2026-06-23T08:00:00.000Z",
      updatedAt: "2026-06-23T08:00:00.000Z",
      createdAt: "2026-03-01T08:00:00.000Z",
      previewKpis: [
        { label: "Index", value: "74.3", tone: "success" },
        { label: "GDP", value: "48.2B", tone: "accent" },
        { label: "Mfg", value: "31%", tone: "warn" },
      ],
      state: {
        title: "Al Ain Employment Pulse",
        components: {
          kpi: true,
          chart: true,
          map: true,
          table: true,
          forecast: false,
          narrative: false,
        },
        chartType: "bar",
        tone: "Executive Brief",
        sources: ["employment", "gdp"],
      },
    },
    {
      id: "built-seed-regional-gdp-scorecard",
      title: "Regional GDP Scorecard",
      description:
        "Regional GDP growth, job creation, and SME participation across Abu Dhabi.",
      status: "published",
      meta: "Abu Dhabi · Q1 2026",
      publishedAt: "2026-06-20T08:00:00.000Z",
      updatedAt: "2026-06-20T08:00:00.000Z",
      createdAt: "2026-01-15T08:00:00.000Z",
      previewKpis: [
        { label: "GDP", value: "+3.8%", tone: "accent" },
        { label: "Jobs", value: "+12K", tone: "success" },
        { label: "SME", value: "62%", tone: "purple" },
      ],
      state: {
        title: "Regional GDP Scorecard",
        components: {
          kpi: true,
          chart: true,
          table: true,
          forecast: false,
          map: false,
          narrative: false,
        },
        chartType: "bar",
        tone: "Executive Brief",
        sources: ["gdp_growth", "business_licenses"],
      },
    },
    {
      id: "built-seed-manufacturing-trends",
      title: "Manufacturing Trends",
      description:
        "Manufacturing output, firm count, and employment trends in Al Ain.",
      status: "draft",
      meta: "Al Ain · Private",
      updatedAt: "2026-06-18T08:00:00.000Z",
      createdAt: "2026-05-10T08:00:00.000Z",
      previewKpis: [
        { label: "Output", value: "↑ 5.2%", tone: "teal" },
        { label: "Firms", value: "842", tone: "neutral" },
        { label: "Jobs", value: "+4.1%", tone: "success" },
      ],
      state: {
        title: "Manufacturing Trends",
        components: {
          kpi: true,
          chart: true,
          forecast: false,
          map: false,
          table: false,
          narrative: false,
        },
        chartType: "line",
        tone: "Executive Brief",
        sources: ["gdp", "business_licenses"],
      },
    },
  ];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeRecord(record) {
    return {
      ...record,
      status: record.status || "published",
    };
  }

  function loadAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((w) => w && w.id).map(normalizeRecord)
        : [];
    } catch (e) {
      return [];
    }
  }

  function saveAll(widgets) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
      notifyChange();
    } catch (e) {
      /* storage unavailable */
    }
  }

  function notifyChange() {
    try {
      global.dispatchEvent(new CustomEvent(LIBRARY_CHANGE_EVENT));
    } catch (e) {
      /* unavailable */
    }
  }

  function createId() {
    return (
      ID_PREFIX +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 7)
    );
  }

  function isBuiltId(id) {
    return typeof id === "string" && id.startsWith(ID_PREFIX);
  }

  function isPublished(record) {
    return record?.status === "published";
  }

  function getSeeds() {
    return SEED_WIDGETS.map(normalizeRecord);
  }

  function getCatalog() {
    const stored = loadAll();
    const storedIds = new Set(stored.map((w) => w.id));
    return [...stored, ...getSeeds().filter((seed) => !storedIds.has(seed.id))];
  }

  function getPublished() {
    return getCatalog().filter(isPublished);
  }

  function findById(id) {
    return getCatalog().find((w) => w.id === id) || null;
  }

  function findByTitle(title) {
    const needle = String(title || "").trim().toLowerCase();
    return getCatalog().find((w) => w.title.toLowerCase() === needle) || null;
  }

  function buildKpiPreviewHtml(kpis, colorMap = KPI_TONE_COLORS) {
    const cells = kpis
      .map((kpi) => {
        const color = colorMap[kpi.tone] || colorMap.neutral;
        return `<div class="widget-preview-kpi"><div class="widget-preview-kpi__label">${escapeHtml(kpi.label)}</div><div class="widget-preview-kpi__value" style="color:${color}">${escapeHtml(kpi.value)}</div></div>`;
      })
      .join("");
    return `<div class="widget-preview-kpis">${cells}</div>`;
  }

  function buildStudioKpiPreviewHtml(kpis) {
    const cells = kpis
      .map((kpi) => {
        const color =
          KPI_STUDIO_TONE_VARS[kpi.tone] || KPI_STUDIO_TONE_VARS.neutral;
        return `<div class="widget-card-kpi"><div class="wk-label">${escapeHtml(kpi.label)}</div><div class="wk-val" style="color:${color}">${escapeHtml(kpi.value)}</div></div>`;
      })
      .join("");
    return `<div class="widget-card-kpis">${cells}</div>`;
  }

  const DONUT_LABELS = [
    "Manufacturing",
    "Services",
    "Logistics",
    "Construction",
    "Other",
  ];
  const DONUT_DATA = [31.4, 24.8, 18.2, 14.1, 11.5];
  const DONUT_COLORS = ["#0066FF", "#7C3AED", "#10B981", "#D97706", "#94A3B8"];

  function wrapPickerPreview(html) {
    return `<div class="home-built-picker-scale"><div class="home-built-picker-fit">${html}</div></div>`;
  }

  function wrapStudioPreview(html) {
    return `<div class="home-built-studio-scale"><div class="home-built-studio-fit">${html}</div></div>`;
  }

  function buildPickerPreviewHtml(record) {
    if (record.homeHtml) return wrapPickerPreview(record.homeHtml);
    return buildPreviewHtml(record);
  }

  function buildStudioPreviewHtml(record) {
    if (record.previewKpis?.length) {
      return buildStudioKpiPreviewHtml(record.previewKpis);
    }
    if (record.homeHtml) return wrapStudioPreview(record.homeHtml);
    return buildPreviewHtml(record);
  }

  function initHomeCharts(root) {
    if (!root || typeof Chart === "undefined") return;
    root.querySelectorAll('canvas[id^="donutChart-"]').forEach((el) => {
      if (el.dataset.chartReady) return;
      el.dataset.chartReady = "1";
      new Chart(el, {
        type: "doughnut",
        data: {
          labels: DONUT_LABELS,
          datasets: [
            {
              data: DONUT_DATA,
              backgroundColor: DONUT_COLORS,
              borderWidth: 2.5,
              borderColor: "#FFF",
              hoverOffset: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
        },
      });
    });
  }

  function panelCount(state) {
    const c = state?.components || {};
    return Object.keys(PANEL_LABELS).filter((key) => c[key]).length;
  }

  function snapshotFromState(state, meta = {}) {
    const now = new Date().toISOString();
    const status = meta.status || "draft";
    const existing = meta.id ? findById(meta.id) : null;
    return {
      id: meta.id || createId(),
      title: (meta.title || state.title || "Untitled widget").trim(),
      description: (meta.description || "").trim(),
      status,
      createdAt: meta.createdAt || existing?.createdAt || now,
      updatedAt: now,
      publishedAt:
        status === "published" ? meta.publishedAt || now : meta.publishedAt || null,
      homeHtml:
        meta.homeHtml !== undefined ? meta.homeHtml : existing?.homeHtml || null,
      state: {
        title: state.title,
        components: { ...(state.components || {}) },
        chartType: state.chartType,
        tone: state.tone,
        sources: [...(state.sources || [])],
      },
    };
  }

  function saveWidget(record) {
    const widgets = loadAll();
    const idx = widgets.findIndex((w) => w.id === record.id);
    if (idx >= 0) widgets[idx] = record;
    else widgets.unshift(record);
    saveAll(widgets);
    return record;
  }

  function isStored(id) {
    return loadAll().some((w) => w.id === id);
  }

  function deleteWidget(id) {
    if (!isStored(id)) return false;
    saveAll(loadAll().filter((w) => w.id !== id));
    return true;
  }

  let pendingDeleteId = null;

  function refreshAfterDelete(label) {
    if (typeof global.toast === "function") {
      global.toast(`"${label}" deleted`, "ti-trash");
    } else if (typeof global.showToast === "function") {
      global.showToast(`"${label}" deleted`, "Removed from library");
    }
    if (typeof global.renderIndexWidgetLibrary === "function") {
      global.renderIndexWidgetLibrary();
    }
    if (typeof global.renderWidgetLibrary === "function") {
      global.renderWidgetLibrary();
    }
  }

  function ensureDeleteModal() {
    if (document.getElementById("widgetDeleteModal")) return;
    if (!document.getElementById("widgetDeleteModalStyles")) {
      const style = document.createElement("style");
      style.id = "widgetDeleteModalStyles";
      style.textContent =
        ".widget-delete-modal{position:fixed;inset:0;z-index:5000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(15,23,42,.45);backdrop-filter:blur(2px)}" +
        ".widget-delete-modal.show{display:flex}" +
        ".widget-delete-modal__box{background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:14px;box-shadow:0 12px 40px rgba(15,23,42,.15);max-width:400px;width:100%;padding:22px}" +
        ".widget-delete-modal__icon{width:44px;height:44px;border-radius:12px;background:#fef2f2;color:#dc2626;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px}" +
        ".widget-delete-modal__title{font-size:16px;font-weight:700;margin-bottom:6px;color:#0f172a}" +
        ".widget-delete-modal__text{font-size:13px;line-height:1.55;color:#64748b;margin-bottom:20px}" +
        ".widget-delete-modal__actions{display:flex;justify-content:flex-end;gap:8px}" +
        ".widget-delete-modal__btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;font:500 13px Inter,sans-serif;cursor:pointer;border:1px solid transparent}" +
        ".widget-delete-modal__btn--ghost{background:#f1f5f9;color:#475569;border-color:rgba(15,23,42,.08)}" +
        ".widget-delete-modal__btn--ghost:hover{background:#e2e8f0}" +
        ".widget-delete-modal__btn--danger{background:#dc2626;color:#fff;border-color:#dc2626}" +
        ".widget-delete-modal__btn--danger:hover{background:#b91c1c}" +
        'html[data-theme="dark"] .widget-delete-modal__box{background:#1e293b;border-color:rgba(255,255,255,.08)}' +
        'html[data-theme="dark"] .widget-delete-modal__title{color:#f8fafc}' +
        'html[data-theme="dark"] .widget-delete-modal__text{color:#94a3b8}' +
        'html[data-theme="dark"] .widget-delete-modal__btn--ghost{background:#334155;color:#e2e8f0;border-color:rgba(255,255,255,.08)}';
      document.head.appendChild(style);
    }
    const modal = document.createElement("div");
    modal.id = "widgetDeleteModal";
    modal.className = "widget-delete-modal";
    modal.innerHTML =
      '<div class="widget-delete-modal__box" role="dialog" aria-labelledby="widgetDeleteModalTitle" aria-modal="true">' +
      '<div class="widget-delete-modal__icon"><i class="ti ti-trash"></i></div>' +
      '<div class="widget-delete-modal__title" id="widgetDeleteModalTitle">Delete widget?</div>' +
      '<div class="widget-delete-modal__text">Delete <strong id="widgetDeleteModalName"></strong>? This cannot be undone.</div>' +
      '<div class="widget-delete-modal__actions">' +
      '<button type="button" class="widget-delete-modal__btn widget-delete-modal__btn--ghost" onclick="closeWidgetDeleteModal()">Cancel</button>' +
      '<button type="button" class="widget-delete-modal__btn widget-delete-modal__btn--danger" onclick="confirmWidgetDelete()"><i class="ti ti-trash"></i> Delete</button>' +
      "</div></div>";
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeWidgetDeleteModal();
    });
    document.body.appendChild(modal);
  }

  global.closeWidgetDeleteModal = function closeWidgetDeleteModal() {
    pendingDeleteId = null;
    document.getElementById("widgetDeleteModal")?.classList.remove("show");
  };

  global.confirmWidgetDelete = function confirmWidgetDelete() {
    const id = pendingDeleteId;
    const nameEl = document.getElementById("widgetDeleteModalName");
    const label = nameEl?.textContent || "Widget";
    global.closeWidgetDeleteModal();
    if (!id || !deleteWidget(id)) return;
    refreshAfterDelete(label);
  };

  global.deleteBuiltWidget = function deleteBuiltWidget(id) {
    const record = findById(id);
    if (!record || !isStored(id)) return;
    ensureDeleteModal();
    pendingDeleteId = id;
    const nameEl = document.getElementById("widgetDeleteModalName");
    if (nameEl) nameEl.textContent = record.title || "Widget";
    document.getElementById("widgetDeleteModal")?.classList.add("show");
  };

  function buildPreviewHtml(record) {
    if (record.previewKpis?.length) {
      return `<div class="widget-preview-mock widget-preview-mock--kpis">${buildKpiPreviewHtml(record.previewKpis)}</div>`;
    }

    const c = record.state?.components || {};
    const rows = [];

    if (c.kpi) {
      rows.push(
        '<div class="widget-preview-mock__blocks"><span class="widget-preview-mock__block"></span><span class="widget-preview-mock__block"></span><span class="widget-preview-mock__block"></span></div>',
      );
    }
    if (c.chart) {
      rows.push(
        '<div class="widget-preview-mock--gmi"><div class="widget-preview-mock__cols"><span class="widget-preview-mock__col-bar"></span><span class="widget-preview-mock__col-bar"></span><span class="widget-preview-mock__col-bar"></span></div></div>',
      );
    }
    if (c.map) {
      rows.push(
        '<span class="widget-preview-mock--foryou"><span></span><span></span></span>',
      );
    }
    if (c.table || c.forecast) {
      rows.push(
        '<div class="widget-preview-mock--actions"><div class="widget-preview-mock__bar"></div><div class="widget-preview-mock__bar"></div></div>',
      );
    }
    if (c.narrative) {
      rows.push(
        '<div class="widget-preview-mock__line widget-preview-mock__line--sm"></div>',
      );
    }
    if (!rows.length) {
      rows.push(
        '<div class="widget-preview-mock__line"></div><div class="widget-preview-mock__line widget-preview-mock__line--sm"></div>',
      );
    }

    return `<div class="widget-preview-mock widget-preview-mock--custom">${rows.join("")}</div>`;
  }

  function buildHomeModuleHtml(record) {
    if (record.homeHtml) {
      return `<div class="home-built-widget-live">${record.homeHtml}</div>`;
    }

    const title = escapeHtml(record.title);
    const c = record.state?.components || {};
    const chips = Object.keys(PANEL_LABELS)
      .filter((key) => c[key])
      .map(
        (key) =>
          `<span class="home-built-widget-chip">${escapeHtml(PANEL_LABELS[key])}</span>`,
      )
      .join("");

    return `<div class="card card-pad home-module home-built-widget-module">
      <div class="home-module-header">
        <div class="home-module-header-left">
          <h3 class="home-module-title"><span class="home-module-title-icon home-module-title-icon--custom" aria-hidden="true"><i class="ti ti-layout-grid-add"></i></span> ${title}</h3>
        </div>
        <span class="home-built-widget-badge"><i class="ti ti-layout-grid-add"></i> Custom</span>
      </div>
      ${chips ? `<div class="home-built-widget-chips">${chips}</div>` : ""}
      <div class="home-built-widget-preview">${buildPreviewHtml(record)}</div>
    </div>`;
  }

  function buildSlotInnerHtml(id, record) {
    const safeTitle = escapeHtml(record.title);
    return `<button type="button" class="home-widget-remove" onclick="removeHomeWidget('${id}')" aria-label="Remove ${safeTitle}"><i class="ti ti-x"></i></button>${buildHomeModuleHtml(record)}`;
  }

  function toRegistryEntry(record) {
    return {
      title: record.title,
      description:
        record.description ||
        "Custom widget created with the Widget Builder.",
      previewHtml: buildPickerPreviewHtml(record),
      built: true,
    };
  }

  function syncRegistry(registry) {
    const published = getPublished();
    const publishedIds = new Set(published.map((w) => w.id));

    Object.keys(registry).forEach((id) => {
      if (isBuiltId(id) && !publishedIds.has(id)) delete registry[id];
    });

    published.forEach((record) => {
      registry[record.id] = toRegistryEntry(record);
    });
  }

  function formatStudioDate(iso) {
    if (!iso) return "Recently updated";
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days <= 0) return "Updated today";
    if (days === 1) return "Updated yesterday";
    if (days < 7) return `Updated ${days} days ago`;
    return `Updated ${new Date(iso).toLocaleDateString()}`;
  }

  function buildStudioCardHtml(record) {
    const title = escapeHtml(record.title);
    const count = panelCount(record.state);
    const published = isPublished(record);
    const statusPill = published
      ? '<span class="pill pill-success" style="font-size:9px">Published</span>'
      : '<span class="pill pill-gray" style="font-size:9px">Draft</span>';
    const statusLine = published
      ? `<i class="ti ti-eye"></i> ${escapeHtml(formatStudioDate(record.publishedAt || record.updatedAt))}`
      : '<i class="ti ti-pencil"></i> Draft — not published';
    const preview = buildStudioPreviewHtml(record);
    const previewClass = record.homeHtml
      ? "widget-card-preview widget-card-preview--live"
      : record.previewKpis?.length
        ? "widget-card-preview"
        : "widget-card-preview widget-card-preview--custom";
    const metaLine = record.meta
      ? `<span>${escapeHtml(record.meta)}</span><span>·</span>`
      : "";
    const safeId = escapeHtml(record.id);
    const deleteBtn = isStored(record.id)
      ? `<button class="btn btn-ghost btn-xs widget-card-delete" onclick="event.stopPropagation();deleteBuiltWidget('${safeId}')" title="Delete"><i class="ti ti-trash"></i></button>`
      : "";

    return `<div class="widget-card" data-built-id="${safeId}" onclick="openBuiltWidget('${safeId}')">
      <div class="${previewClass}">${preview}</div>
      <div class="widget-card-body">
        <div class="widget-card-name">${title}</div>
        <div class="widget-card-meta">
          ${statusPill}
          ${metaLine}
          <span>${count} panel${count === 1 ? "" : "s"}</span>
        </div>
      </div>
      <div class="widget-card-footer">
        <div class="widget-card-status">${statusLine}</div>
        <div class="widget-card-actions">
          <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();openBuiltWidget('${safeId}')"><i class="ti ti-edit"></i> Edit</button>
          ${deleteBtn}
        </div>
      </div>
    </div>`;
  }

  global.BayaanWidgetLibrary = {
    STORAGE_KEY,
    LIBRARY_CHANGE_EVENT,
    ID_PREFIX,
    loadAll,
    getCatalog,
    getPublished,
    saveWidget,
    deleteWidget,
    isStored,
    snapshotFromState,
    isBuiltId,
    isPublished,
    panelCount,
    buildPreviewHtml,
    buildHomeModuleHtml,
    buildSlotInnerHtml,
    buildStudioCardHtml,
    buildPickerPreviewHtml,
    initHomeCharts,
    syncRegistry,
    findById,
    findByTitle,
    escapeHtml,
    notifyChange,
  };
})(window);
