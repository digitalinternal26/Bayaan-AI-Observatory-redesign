/* Shared LMO floating sidebar — single source for all LMO pages */
(function () {
  const ICONS = {
    briefing: '<i class="ti ti-layout-dashboard"></i>',
    observe: '<i class="ti ti-eye"></i>',
    diagnose: '<i class="ti ti-search"></i>',
    forecasting: '<i class="ti ti-chart-line"></i>',
    simulation: '<i class="ti ti-stack-2"></i>',
    geospatial: '<i class="ti ti-map-2"></i>',
  };

  const LMO_NAV_ITEMS = [
    { id: "briefing", label: "Briefing" },
    { id: "observe", label: "Observe" },
    { id: "geospatial", label: "Geospatial" },
    { id: "diagnose", label: "Diagnose" },
    { id: "forecasting", label: "Forecast" },
    { id: "simulation", label: "Simulations" },
  ];

  const FILTER_STORAGE_KEY = "lmo-sidenav-filters";

  const FILTER_DEFAULTS = {
    emirate: "Abu Dhabi",
    regions: [],
    citizenship: "All",
    gender: "All",
  };

  const FILTER_SECTIONS = [
    {
      id: "emirate",
      label: "Emirate",
      icon: "ti-map-pin",
      multi: false,
      options: [{ value: "Abu Dhabi", icon: "ti-flag" }],
    },
    {
      id: "regions",
      label: "Regions",
      icon: "ti-map-2",
      multi: true,
      options: [
        { value: "Abu Dhabi", icon: "ti-map-pin" },
        { value: "Al Ain", icon: "ti-map-pin" },
        { value: "Al Dhafra", icon: "ti-map-pin" },
      ],
    },
    {
      id: "citizenship",
      label: "Citizenship",
      icon: "ti-world",
      multi: false,
      options: [
        { value: "All", icon: "ti-users-group" },
        { value: "Emirati", icon: "ti-users" },
        { value: "Non-Emirati", icon: "ti-users" },
      ],
    },
    {
      id: "gender",
      label: "Gender",
      icon: "ti-gender-bigender",
      multi: false,
      options: [
        { value: "All", icon: "ti-users-group" },
        { value: "Male", icon: "ti-gender-male" },
        { value: "Female", icon: "ti-gender-female" },
      ],
    },
  ];

  const DEFAULT_AI_ONCLICK =
    "openChat('Give me a full briefing on Abu Dhabi labour market Q2 2025','Labour Market Overview')";

  let filterState = loadFilters();
  let filterOpen = false;
  let railEl = null;

  function loadFilters() {
    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) return { ...FILTER_DEFAULTS, ...JSON.parse(saved) };
    } catch (e) {}
    return { ...FILTER_DEFAULTS, regions: [] };
  }

  function saveFilters() {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filterState));
    } catch (e) {}
  }

  function countApplied() {
    let n = filterState.regions.length;
    if (filterState.citizenship !== FILTER_DEFAULTS.citizenship) n++;
    if (filterState.gender !== FILTER_DEFAULTS.gender) n++;
    if (filterState.emirate !== FILTER_DEFAULTS.emirate) n++;
    return n;
  }

  function isSelected(section, value) {
    const current = filterState[section.id];
    return section.multi ? current.includes(value) : current === value;
  }

  function optionPill(section, opt) {
    const sel = isSelected(section, opt.value);
    return (
      '<button type="button" class="lsb-fp-pill' +
      (sel ? " act" : "") +
      '" data-lmo-fp-section="' +
      section.id +
      '" data-lmo-fp-value="' +
      opt.value +
      '" data-lmo-fp-multi="' +
      (section.multi ? "1" : "0") +
      '"><i class="ti ' +
      opt.icon +
      '"></i><span>' +
      opt.value +
      "</span></button>"
    );
  }

  function filterPanelHTML() {
    const sections = FILTER_SECTIONS.map(function (section) {
      const pills = section.options
        .map(function (opt) {
          return optionPill(section, opt);
        })
        .join("");
      return (
        '<div class="lsb-fp-section">' +
        '<div class="lsb-fp-section-hd">' +
        '<i class="ti ' +
        section.icon +
        '"></i><span>' +
        section.label +
        "</span></div>" +
        '<div class="lsb-fp-pills">' +
        pills +
        "</div></div>"
      );
    }).join("");

    const n = countApplied();
    const countLabel = n === 1 ? "1 filter applied" : n + " filters applied";

    return (
      '<aside class="lsb-filter-panel" id="lsbFilterPanel" aria-hidden="true">' +
      '<div class="lsb-fp-head">' +
      '<strong class="lsb-fp-title">Filter</strong>' +
      '<button type="button" class="lsb-fp-close" data-lmo-fp-close aria-label="Close filters"><i class="ti ti-x"></i></button>' +
      "</div>" +
      '<div class="lsb-fp-body">' +
      sections +
      "</div>" +
      '<div class="lsb-fp-foot">' +
      '<span class="lsb-fp-count" data-lmo-fp-count' +
      (n ? "" : ' hidden') +
      ">" +
      countLabel +
      "</span>" +
      '<button type="button" class="lsb-fp-reset" data-lmo-fp-reset' +
      (n ? "" : " disabled") +
      '><i class="ti ti-rotate-2"></i> Reset All</button>' +
      "</div></aside>"
    );
  }

  function navButtonHTML(item, active, mode) {
    const isActive = item.id === active;
    const activeClass = isActive ? " active" : "";
    const icon = ICONS[item.id] || "";
    let attrs = `type="button" class="sidebar-item${activeClass}"`;

    if (mode === "shell") {
      attrs += ` data-view="${item.id}" onclick="switchView('${item.id}')"`;
    } else if (!isActive) {
      attrs += ` data-lmo-nav="${item.id}"`;
    }

    return `<button ${attrs}><div class="sidebar-icon">${icon}</div><span class="sidebar-label">${item.label}</span></button>`;
  }

  function syncFilterUI() {
    if (!railEl) return;
    const n = countApplied();
    const panel = railEl.querySelector("#lsbFilterPanel");
    const toggle = railEl.querySelector("[data-lmo-fp-toggle]");
    const badge = railEl.querySelector("[data-lmo-fp-badge]");
    const countEl = railEl.querySelector("[data-lmo-fp-count]");
    const resetBtn = railEl.querySelector("[data-lmo-fp-reset]");

    if (toggle) {
      toggle.classList.toggle("active", filterOpen || n > 0);
      toggle.setAttribute("aria-expanded", filterOpen ? "true" : "false");
    }
    if (badge) {
      badge.hidden = n === 0;
      badge.textContent = String(n);
    }
    if (panel) {
      panel.classList.toggle("open", filterOpen);
      panel.setAttribute("aria-hidden", filterOpen ? "false" : "true");
    }
    if (countEl) {
      countEl.hidden = n === 0;
      countEl.textContent =
        n === 1 ? "1 filter applied" : n + " filters applied";
    }
    if (resetBtn) resetBtn.disabled = n === 0;

    railEl.querySelectorAll("[data-lmo-fp-section]").forEach(function (btn) {
      const section = FILTER_SECTIONS.find(function (s) {
        return s.id === btn.dataset.lmoFpSection;
      });
      if (!section) return;
      btn.classList.toggle("act", isSelected(section, btn.dataset.lmoFpValue));
    });
  }

  function emitFilterChange() {
    document.dispatchEvent(
      new CustomEvent("lmo-filter-change", {
        detail: { ...filterState, appliedCount: countApplied() },
      })
    );
  }

  function setFilterOpen(open) {
    filterOpen = open;
    syncFilterUI();
  }

  function applyFilter(sectionId, value, multi) {
    if (multi) {
      const arr = filterState[sectionId];
      const idx = arr.indexOf(value);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(value);
    } else {
      filterState[sectionId] = value;
    }
    saveFilters();
    syncFilterUI();
    emitFilterChange();
  }

  function resetFilters() {
    filterState = { ...FILTER_DEFAULTS, regions: [] };
    saveFilters();
    syncFilterUI();
    emitFilterChange();
  }

  function bindFilterEvents() {
    if (!railEl || railEl.dataset.lmoFpBound) return;
    railEl.dataset.lmoFpBound = "1";

    railEl.addEventListener("click", function (e) {
      if (e.target.closest("[data-lmo-fp-toggle]")) {
        setFilterOpen(!filterOpen);
        return;
      }
      if (e.target.closest("[data-lmo-fp-close]")) {
        setFilterOpen(false);
        return;
      }
      if (e.target.closest("[data-lmo-fp-reset]")) {
        resetFilters();
        return;
      }
      const pill = e.target.closest("[data-lmo-fp-section]");
      if (pill) {
        applyFilter(
          pill.dataset.lmoFpSection,
          pill.dataset.lmoFpValue,
          pill.dataset.lmoFpMulti === "1"
        );
      }
    });

    document.addEventListener("click", function (e) {
      if (!filterOpen || !railEl) return;
      if (railEl.contains(e.target)) return;
      setFilterOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && filterOpen) setFilterOpen(false);
    });
  }

  function mount(options) {
    const mountEl = document.getElementById("lmo-sidenav-mount");
    if (!mountEl) return;

    const opts = options || {};
    const active =
      opts.active ||
      (document.body && document.body.dataset.lmoActive) ||
      "briefing";
    const mode = opts.mode || "page";
    const aiOnClick = opts.aiOnClick || DEFAULT_AI_ONCLICK;

    const navButtons = LMO_NAV_ITEMS.map((item) =>
      navButtonHTML(item, active, mode)
    ).join("");

    mountEl.innerHTML =
      '<div class="sidebar-rail">' +
      '<div class="lmo-filter-wrap">' +
      '<button type="button" class="lmo-filter-toggle" data-lmo-fp-toggle aria-expanded="false" aria-controls="lsbFilterPanel" title="Filters">' +
      '<div class="lmo-filter-icon"><i class="ti ti-adjustments-horizontal"></i></div>' +
      '<span class="lmo-filter-label">Filter</span>' +
      '<span class="lmo-filter-badge" data-lmo-fp-badge hidden>0</span></button>' +
      filterPanelHTML() +
      "</div>" +
      '<aside class="sidebar" aria-label="LMO views">' +
      '<button type="button" class="sidebar-item sidebar-item--ai" onclick="' +
      aiOnClick +
      '"><div class="sidebar-icon"><i class="ti ti-sparkles"></i></div><span class="sidebar-label">LMO AI</span></button>' +
      '<span class="sidebar-divider" aria-hidden="true"></span>' +
      navButtons +
      "</aside></div>";

    railEl = mountEl.querySelector(".sidebar-rail");
    filterOpen = false;
    bindFilterEvents();
    syncFilterUI();
  }

  function inferActiveFromPath() {
    const path = location.pathname.split("/").pop() || "";
    if (path.includes("observe")) return "observe";
    if (path.includes("geospatial")) return "geospatial";
    if (path.includes("diagnose")) return "diagnose";
    if (path.includes("forecast")) return "forecasting";
    if (path.includes("simulation")) return "simulation";
    if (path.includes("briefing")) return "briefing";
    if (path.includes("indicator-detail") || path.includes("insight-detail")) return "observe";
    return null;
  }

  window.LMO_Sidenav = {
    mount,
    inferActiveFromPath,
    NAV_ITEMS: LMO_NAV_ITEMS,
    getFilters: function () {
      return { ...filterState, appliedCount: countApplied() };
    },
    resetFilters,
  };
})();
