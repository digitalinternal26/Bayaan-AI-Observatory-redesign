/* ============================================================
   CENSUS OBSERVATORY — GLOBAL FILTER
   One reusable component, shared by every Census Observatory page
   (Interpret, Population, Labour Force, Real Estate, Benchmark,
   Observe, Forecast) — the Census equivalent of the Labour Market
   Observatory's global filter (lmo/lmo-sidenav.js). Same structure,
   interaction pattern and CSS class family (".cgf-*", defined in
   css/pages/obs-sidebar.css right below the LMO filter's own rules),
   ported rather than duplicated so both Observatories share one
   filter pattern instead of two divergent ones.

   STATUS — UI/UX ONLY. Selecting a filter updates this module's own
   state (and its visible pill/badge states), and localStorage, and
   fires a "census-filter-change" event — but nothing on any Census
   Observatory page actually reads that state to filter numbers,
   charts, maps or tables yet. That's the deliberate seam: a later
   pass can call CensusGlobalFilter.getState()/.onChange(fn) from a
   page's own render functions to make specific sections responsive,
   without needing to touch this module or its markup again.

   Usage — one line inside each page's own <div class="sidebar-rail">,
   as a sibling placed BEFORE that page's own <aside class="sidebar">
   (which keeps its existing hand-authored nav items untouched):
     <div class="sidebar-rail">
       <div id="census-global-filter-mount"></div>
       <aside class="sidebar" aria-label="Census Observatory views">
         ...page's own nav items, unchanged...
       </aside>
     </div>
   then, once the DOM is ready:
     <script src="js/census-global-filter.js"></script>
     ...
     if (window.CensusGlobalFilter) CensusGlobalFilter.mount();
   ============================================================ */
(function () {
  const STORAGE_KEY = "census-global-filter";

  const DEFAULTS = { emirate: "Abu Dhabi", regions: [], citizenship: "All", gender: "All" };

  const SECTIONS = [
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

  let state = load();
  let open = false;
  let wrapEl = null;
  const changeListeners = [];

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Object.assign({}, DEFAULTS, parsed, { regions: parsed.regions || [] });
      }
    } catch (e) {}
    return Object.assign({}, DEFAULTS, { regions: [] });
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function countApplied() {
    let n = state.regions.length;
    if (state.citizenship !== DEFAULTS.citizenship) n++;
    if (state.gender !== DEFAULTS.gender) n++;
    if (state.emirate !== DEFAULTS.emirate) n++;
    return n;
  }

  function isSelected(section, value) {
    const current = state[section.id];
    return section.multi ? current.indexOf(value) !== -1 : current === value;
  }

  function optionPill(section, opt) {
    const sel = isSelected(section, opt.value);
    return (
      '<button type="button" class="cgf-pill' +
      (sel ? " act" : "") +
      '" data-cgf-section="' +
      section.id +
      '" data-cgf-value="' +
      opt.value +
      '" data-cgf-multi="' +
      (section.multi ? "1" : "0") +
      '"><i class="ti ' +
      opt.icon +
      '"></i><span>' +
      opt.value +
      "</span></button>"
    );
  }

  function panelHTML() {
    const sections = SECTIONS.map(function (section) {
      const pills = section.options.map(function (opt) { return optionPill(section, opt); }).join("");
      return (
        '<div class="cgf-section">' +
        '<div class="cgf-section-hd"><i class="ti ' + section.icon + '"></i><span>' + section.label + "</span></div>" +
        '<div class="cgf-pills">' + pills + "</div></div>"
      );
    }).join("");

    const n = countApplied();
    const countLabel = n === 1 ? "1 filter applied" : n + " filters applied";

    return (
      '<aside class="cgf-panel" id="cenGlobalFilterPanel" aria-hidden="true">' +
      '<div class="cgf-panel-hd">' +
      '<strong class="cgf-panel-title">Filter</strong>' +
      '<button type="button" class="cgf-panel-close" data-cgf-close aria-label="Close filters"><i class="ti ti-x"></i></button>' +
      "</div>" +
      '<div class="cgf-panel-body">' + sections + "</div>" +
      '<div class="cgf-panel-foot">' +
      '<span class="cgf-count" data-cgf-count' + (n ? "" : " hidden") + ">" + countLabel + "</span>" +
      '<button type="button" class="cgf-reset" data-cgf-reset' + (n ? "" : " disabled") + '><i class="ti ti-rotate-2"></i> Reset All</button>' +
      "</div></aside>"
    );
  }

  function panelEl() {
    // Looked up by id (not wrapEl.querySelector) because isMobileSheet()
    // moves this node to <body> while open — see setOpen().
    return document.getElementById("cenGlobalFilterPanel");
  }

  function isMobileSheet() {
    return window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
  }

  function syncUI() {
    if (!wrapEl) return;
    const n = countApplied();
    const panel = panelEl();
    const toggle = wrapEl.querySelector("[data-cgf-toggle]");
    const badge = wrapEl.querySelector("[data-cgf-badge]");

    if (toggle) {
      toggle.classList.toggle("active", open || n > 0);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (badge) {
      badge.hidden = n === 0;
      badge.textContent = String(n);
    }
    if (!panel) return;
    const countEl = panel.querySelector("[data-cgf-count]");
    const resetBtn = panel.querySelector("[data-cgf-reset]");

    panel.classList.toggle("open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    if (countEl) {
      countEl.hidden = n === 0;
      countEl.textContent = n === 1 ? "1 filter applied" : n + " filters applied";
    }
    if (resetBtn) resetBtn.disabled = n === 0;

    panel.querySelectorAll("[data-cgf-section]").forEach(function (btn) {
      const section = SECTIONS.find(function (s) { return s.id === btn.dataset.cgfSection; });
      if (!section) return;
      btn.classList.toggle("act", isSelected(section, btn.dataset.cgfValue));
    });
  }

  function emitChange() {
    const detail = Object.assign({}, state, { appliedCount: countApplied() });
    document.dispatchEvent(new CustomEvent("census-filter-change", { detail: detail }));
    changeListeners.forEach(function (fn) {
      try { fn(detail); } catch (e) {}
    });
  }

  function setOpen(v) {
    open = v;
    // .cgf-wrap and its ancestor .sidebar-rail both use `transform:
    // translate(...)` to centre the rail vertically, which — per the CSS
    // spec — makes them a containing block for `position: fixed`
    // descendants too, not just `absolute` ones. The mobile bottom-sheet
    // variant of .cgf-panel relies on `position: fixed` resolving
    // against the real viewport, so on narrow screens it's moved up to
    // be a direct child of #screen-cpi-obs (escaping that containing
    // block — #screen-cpi-obs itself carries no transform) while open,
    // and moved back into .cgf-wrap on close so desktop's
    // `position: absolute; left: calc(100% + 14px)` (anchored to
    // .cgf-wrap) keeps working once the viewport widens again. It has
    // to stay under #screen-cpi-obs rather than <body> — every ".cgf-*"
    // rule (css/pages/obs-sidebar.css) is scoped "#screen-cpi-obs .cgf-*"
    // and simply wouldn't match outside it.
    const panel = panelEl();
    const screenRoot = document.getElementById("screen-cpi-obs");
    if (panel && wrapEl) {
      if (v && isMobileSheet() && screenRoot) {
        if (panel.parentElement !== screenRoot) screenRoot.appendChild(panel);
      } else if (panel.parentElement !== wrapEl) {
        wrapEl.appendChild(panel);
      }
    }
    syncUI();
  }

  function applyFilter(sectionId, value, multi) {
    if (multi) {
      const arr = state[sectionId];
      const idx = arr.indexOf(value);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(value);
    } else {
      state[sectionId] = value;
    }
    save();
    syncUI();
    emitChange();
  }

  function reset() {
    state = Object.assign({}, DEFAULTS, { regions: [] });
    save();
    syncUI();
    emitChange();
  }

  let eventsBound = false;
  function bindEvents() {
    // Delegated on document (not wrapEl) because the panel can live
    // outside wrapEl at times — see setOpen()'s mobile portal — so a
    // listener scoped to wrapEl would stop seeing clicks on its pills
    // once it's moved to <body>. Bound once for the module's lifetime;
    // mount() only ever runs once per page anyway.
    if (eventsBound) return;
    eventsBound = true;

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-cgf-toggle]")) {
        setOpen(!open);
        return;
      }
      if (e.target.closest("[data-cgf-close]")) {
        setOpen(false);
        return;
      }
      if (e.target.closest("[data-cgf-reset]")) {
        reset();
        return;
      }
      const pill = e.target.closest("[data-cgf-section]");
      if (pill) {
        applyFilter(pill.dataset.cgfSection, pill.dataset.cgfValue, pill.dataset.cgfMulti === "1");
        return;
      }
      // Outside click closes the drawer — anything inside the toggle
      // button, or inside the panel (wherever it currently lives), is
      // "inside" for this purpose.
      if (!open || !wrapEl) return;
      const panel = panelEl();
      if (wrapEl.contains(e.target) || (panel && panel.contains(e.target))) return;
      setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) setOpen(false);
    });
  }

  function mount(mountId) {
    const mountEl = document.getElementById(mountId || "census-global-filter-mount");
    if (!mountEl) return;

    mountEl.innerHTML =
      '<div class="cgf-wrap">' +
      '<button type="button" class="cgf-toggle" data-cgf-toggle aria-expanded="false" aria-controls="cenGlobalFilterPanel" title="Filters">' +
      '<div class="cgf-icon"><i class="ti ti-adjustments-horizontal"></i></div>' +
      '<span class="cgf-label">Filter</span>' +
      '<span class="cgf-badge" data-cgf-badge hidden>0</span></button>' +
      panelHTML() +
      "</div>";

    wrapEl = mountEl.querySelector(".cgf-wrap");
    open = false;
    bindEvents();
    syncUI();
  }

  window.CensusGlobalFilter = {
    mount: mount,
    getState: function () {
      return Object.assign({}, state, { appliedCount: countApplied() });
    },
    reset: reset,
    onChange: function (fn) {
      if (typeof fn === "function") changeListeners.push(fn);
    },
  };
})();
