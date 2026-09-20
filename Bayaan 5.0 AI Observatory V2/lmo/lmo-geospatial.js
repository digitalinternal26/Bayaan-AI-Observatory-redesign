/* LMO Geospatial — ArcGIS map, filters, sidebar, AI bar */
(function () {
  "use strict";

  /* Optional: paste an ArcGIS API key for production basemaps */
  var ARCGIS_API_KEY = "";

  var MAP_CENTER = [54.37, 24.45];
  var MAP_ZOOM = 8;
  var SELECTED_REGION = "Abu Dhabi";
  var SUB_REGION_MIN_ZOOM = 7.5;
  var SUB_REGION_LABEL_MIN_ZOOM = 8;

  var SUB_REGION_VIEWS = {
    abudhabi: { center: [54.38, 24.46], zoom: 9.2 },
    alain: { center: [55.76, 24.21], zoom: 10.2 },
    aldhafra: { center: [53.85, 23.72], zoom: 9.4 }
  };

  var REGION_ID_TO_FILTER = {
    abudhabi: "Abu Dhabi",
    alain: "Al Ain",
    aldhafra: "Al Dhafra"
  };
  var FILTER_TO_REGION_ID = {
    "Abu Dhabi": "abudhabi",
    "Al Ain": "alain",
    "Al Dhafra": "aldhafra"
  };
  var EMIRATES_GEOJSON_URL = new URL(
    "data/uae-emirates.geojson",
    window.location.href
  ).href;
  var ABU_DHABI_REGIONS_GEOJSON_URL = new URL(
    "data/abu-dhabi-regions.geojson",
    window.location.href
  ).href;

  var emiratesLayer = null;
  var emiratesLayerView = null;
  var abuDhabiRegionsLayer = null;
  var abuDhabiRegionsLayerView = null;
  var regionLabelsLayer = null;
  var selectionHighlight = null;
  var subRegionHighlights = [];

  var EMIRATE_NAMES = [
    "Abu Dhabi",
    "Ajman",
    "Dubai",
    "Fujairah",
    "Ras Al Khaimah",
    "Sharjah",
    "Umm Al Quwain"
  ];

  var FILTER_CATALOG = {
    regions: ["Abu Dhabi", "Al Ain", "Al Dhafra"],
    years: ["2023", "2024", "2025"],
    citizens: ["Emirati", "Non-Emirati"],
    gender: ["Male", "Female"],
    marital: ["Never Married", "Married", "Divorced", "Widowed"],
    attainment: ["Below Secondary", "Secondary", "Above Secondary"],
    districts: [
      "Al Danah", "Al Manhal", "Al Reem Island", "Al Khalidiyah", "Khalifa City",
      "Yas Island", "Al Jimi", "Central District", "Al Ain International Airport",
      "Al Dhafra City", "Madinat Zayed", "Liwa"
    ]
  };

  var FILTER_DEFAULTS = {
    region: "Abu Dhabi",
    year: "2024",
    districts: [],
    other: { citizens: [], gender: [], marital: [], attainment: [] },
    openSection: null
  };

  var SECTION_META = {
    region: { icon: "ti-map-pin", hint: "Focus the map on one emirate." },
    districts: { icon: "ti-map-2", hint: "Select districts to narrow results." },
    year: { icon: "ti-calendar", hint: "Pick a reference year." },
    other: { icon: "ti-users-group", hint: "Add demographic filters." }
  };

  var filterState = JSON.parse(JSON.stringify(FILTER_DEFAULTS));
  var filterPanelOpen = false;
  var geoView = null;
  var sidebarWidthKey = "lmoGeoSidebarWidth";

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function resizeMap() {
    if (!geoView || typeof geoView.resize !== "function") return;
    geoView.resize();
  }

  /* ── Sidebar ── */
  function updateSidebarToggle(collapsed) {
    var btn = document.getElementById("sidebarToggle");
    if (!btn) return;
    btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
    btn.title = collapsed ? "Expand panel" : "Collapse panel";
    btn.setAttribute("aria-label", btn.title);
  }

  function toggleSidebar(forceState) {
    var sidebar = document.getElementById("sidebar");
    if (!sidebar) return;
    var collapsed =
      typeof forceState === "boolean"
        ? forceState
        : !sidebar.classList.contains("collapsed");
    sidebar.classList.toggle("collapsed", collapsed);
    updateSidebarToggle(collapsed);
    requestAnimationFrame(resizeMap);
  }

  function setSidebarWidth(px) {
    var sidebar = document.getElementById("sidebar");
    if (!sidebar) return px;
    var w = Math.min(480, Math.max(300, px));
    sidebar.style.setProperty("--sidebar-width", w + "px");
    return w;
  }

  function initSidebarResize() {
    var sidebar = document.getElementById("sidebar");
    var resizer = document.getElementById("sidebarResizer");
    if (!sidebar || !resizer) return;

    var saved = parseInt(localStorage.getItem(sidebarWidthKey) || "", 10);
    setSidebarWidth(Number.isFinite(saved) ? saved : 430);

    var startX = 0;
    var startW = 0;

    function onMove(e) {
      setSidebarWidth(startW + (e.clientX - startX));
      resizeMap();
    }

    function onEnd() {
      resizer.classList.remove("dragging");
      sidebar.classList.remove("resizing");
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      localStorage.setItem(sidebarWidthKey, String(sidebar.offsetWidth));
    }

    resizer.addEventListener("mousedown", function (e) {
      if (sidebar.classList.contains("collapsed")) return;
      e.preventDefault();
      startX = e.clientX;
      startW = sidebar.offsetWidth;
      resizer.classList.add("dragging");
      sidebar.classList.add("resizing");
      document.body.style.cursor = "col-resize";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
    });
  }

  function initWorkforceTabs() {
    var tabs = document.getElementById("wfTabs");
    if (!tabs) return;
    tabs.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-wf-tab]");
      if (!btn) return;
      tabs.querySelectorAll(".geo-tab").forEach(function (t) {
        var active = t === btn;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
    });
  }

  /* ── Filters ── */
  function countOtherSelected() {
    var o = filterState.other;
    return (
      o.citizens.length +
      o.gender.length +
      o.marital.length +
      o.attainment.length
    );
  }

  function activeFilterCount() {
    var n = 0;
    if (filterState.region !== FILTER_DEFAULTS.region) n++;
    if (filterState.year !== FILTER_DEFAULTS.year) n++;
    n += filterState.districts.length;
    n += countOtherSelected();
    return n;
  }

  function updateFilterBadge() {
    var badge = document.getElementById("geoFilterBadge");
    var btn = document.getElementById("geoFilterToggle");
    if (!badge || !btn) return;
    var n = activeFilterCount();
    badge.hidden = n === 0;
    badge.textContent = String(n);
    btn.classList.toggle("active", filterPanelOpen || n > 0);
  }

  function filterControl(selected, type) {
    var cls = "geo-filter-control geo-filter-" + type + (selected ? " checked" : "");
    if (type === "radio") return '<span class="' + cls + '" aria-hidden="true"></span>';
    return (
      '<span class="' +
      cls +
      '" aria-hidden="true">' +
      (selected ? '<i class="ti ti-check"></i>' : "") +
      "</span>"
    );
  }

  function renderOptions(sectionId, options, selected, multi) {
    return options
      .map(function (opt) {
        var isSel = multi ? selected.indexOf(opt) >= 0 : selected === opt;
        return (
          '<button type="button" class="geo-filter-option' +
          (isSel ? " selected" : "") +
          '" data-filter-section="' +
          esc(sectionId) +
          '" data-filter-value="' +
          esc(opt) +
          '" data-filter-multi="' +
          (multi ? "1" : "0") +
          '">' +
          "<span>" +
          esc(opt) +
          "</span>" +
          filterControl(isSel, multi ? "checkbox" : "radio") +
          "</button>"
        );
      })
      .join("");
  }

  function renderSection(id, label, valueHtml, bodyHtml) {
    var meta = SECTION_META[id];
    var open = filterState.openSection === id;
    return (
      '<div class="geo-filter-section' +
      (open ? " open" : "") +
      '">' +
      '<button type="button" class="geo-filter-section-trigger" data-filter-toggle="' +
      esc(id) +
      '" aria-expanded="' +
      (open ? "true" : "false") +
      '">' +
      '<div class="geo-filter-section-head">' +
      '<span class="geo-filter-section-icon"><i class="ti ' +
      meta.icon +
      '"></i></span>' +
      '<div><div class="geo-filter-section-label">' +
      esc(label) +
      '</div><div class="geo-filter-section-value">' +
      valueHtml +
      "</div></div></div>" +
      '<i class="ti ti-chevron-down geo-filter-section-chev"></i>' +
      "</button>" +
      '<div class="geo-filter-section-body">' +
      '<div class="geo-filter-section-hint">' +
      esc(meta.hint) +
      "</div>" +
      bodyHtml +
      "</div></div>"
    );
  }

  function queueRenderFilterPanel() {
    requestAnimationFrame(renderFilterPanel);
  }

  function renderFilterPanel() {
    var host = document.getElementById("geoFilterSections");
    if (!host) return;

    var districtLabel =
      filterState.districts.length === 0
        ? "All districts"
        : filterState.districts.length === 1
          ? filterState.districts[0]
          : filterState.districts.length + " selected";

    var otherCount = countOtherSelected();
    var otherLabel = otherCount ? otherCount + " selected" : "None";

    var otherBody =
      '<div class="geo-filter-other-group"><div class="geo-filter-other-label">Citizenship</div><div class="geo-filter-options">' +
      renderOptions("citizens", FILTER_CATALOG.citizens, filterState.other.citizens, true) +
      '</div></div><div class="geo-filter-other-group"><div class="geo-filter-other-label">Gender</div><div class="geo-filter-options">' +
      renderOptions("gender", FILTER_CATALOG.gender, filterState.other.gender, true) +
      '</div></div><div class="geo-filter-other-group"><div class="geo-filter-other-label">Marital status</div><div class="geo-filter-options">' +
      renderOptions("marital", FILTER_CATALOG.marital, filterState.other.marital, true) +
      '</div></div><div class="geo-filter-other-group"><div class="geo-filter-other-label">Education</div><div class="geo-filter-options">' +
      renderOptions("attainment", FILTER_CATALOG.attainment, filterState.other.attainment, true) +
      "</div></div>";

    host.innerHTML =
      renderSection(
        "region",
        "Region",
        esc(filterState.region) + " emirate",
        '<div class="geo-filter-options">' +
          renderOptions("region", FILTER_CATALOG.regions, filterState.region, false) +
          "</div>"
      ) +
      renderSection(
        "districts",
        "Districts",
        esc(districtLabel),
        '<div class="geo-filter-options">' +
          renderOptions("districts", FILTER_CATALOG.districts, filterState.districts, true) +
          "</div>"
      ) +
      renderSection(
        "year",
        "Year",
        esc(filterState.year),
        '<div class="geo-filter-options">' +
          renderOptions("year", FILTER_CATALOG.years, filterState.year, false) +
          "</div>"
      ) +
      renderSection("other", "Demographics", esc(otherLabel), otherBody);

    updateFilterBadge();
  }

  function toggleFilterPanel(force) {
    var panel = document.getElementById("geoFilterPanel");
    var btn = document.getElementById("geoFilterToggle");
    if (!panel || !btn) return;
    filterPanelOpen = typeof force === "boolean" ? force : !filterPanelOpen;
    panel.classList.toggle("open", filterPanelOpen);
    panel.setAttribute("aria-hidden", filterPanelOpen ? "false" : "true");
    btn.setAttribute("aria-expanded", filterPanelOpen ? "true" : "false");
    if (filterPanelOpen) renderFilterPanel();
    updateFilterBadge();
  }

  function setFilterValue(sectionId, value, multi) {
    if (sectionId === "region") {
      filterState.region = value;
      var regionId = FILTER_TO_REGION_ID[value];
      if (regionId) goToSubRegion(regionId);
      queueRenderFilterPanel();
      return;
    } else if (sectionId === "year") {
      filterState.year = value;
    } else if (sectionId === "districts") {
      var idx = filterState.districts.indexOf(value);
      if (idx >= 0) filterState.districts.splice(idx, 1);
      else filterState.districts.push(value);
    } else if (filterState.other[sectionId]) {
      var arr = filterState.other[sectionId];
      var i = arr.indexOf(value);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(value);
    }
    queueRenderFilterPanel();
  }

  function resetFilters() {
    filterState = JSON.parse(JSON.stringify(FILTER_DEFAULTS));
    queueRenderFilterPanel();
  }

  function initFilters() {
    var toggle = document.getElementById("geoFilterToggle");
    var reset = document.getElementById("geoFilterReset");
    var sections = document.getElementById("geoFilterSections");
    var panel = document.getElementById("geoFilterPanel");

    if (toggle) toggle.addEventListener("click", function () { toggleFilterPanel(); });
    if (reset) reset.addEventListener("click", resetFilters);

    if (panel) {
      panel.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    if (sections) {
      sections.addEventListener("click", function (e) {
        var toggleBtn = e.target.closest("[data-filter-toggle]");
        if (toggleBtn) {
          var id = toggleBtn.dataset.filterToggle;
          filterState.openSection = filterState.openSection === id ? null : id;
          queueRenderFilterPanel();
          return;
        }
        var opt = e.target.closest("[data-filter-section]");
        if (opt) {
          setFilterValue(
            opt.dataset.filterSection,
            opt.dataset.filterValue,
            opt.dataset.filterMulti === "1"
          );
        }
      });
    }

    document.addEventListener("click", function (e) {
      if (!filterPanelOpen) return;
      if (e.target.closest("#geoFilterPanel, #geoFilterToggle")) return;
      toggleFilterPanel(false);
    });

    updateFilterBadge();
  }

  /* ── ArcGIS map ── */
  var GEO_TEAL = [126, 200, 222, 0.72];
  var GEO_TEAL_FILL = [126, 200, 222, 0.22];
  var OTHER_EMIRATE_FILL = [186, 219, 232, 0.2];
  var OTHER_EMIRATE_OUTLINE = [148, 184, 200, 0.55];
  var SUB_REGION_OUTLINE = [255, 255, 255, 0.72];
  var SUB_REGION_OUTLINE_WIDTH = 1;

  var SUB_REGION_LABELS = [
    { regionId: "abudhabi", text: "Abu Dhabi", lon: 54.45, lat: 24.35 },
    { regionId: "alain", text: "Al Ain", lon: 55.55, lat: 24.35 },
    { regionId: "aldhafra", text: "Al Dhafra", lon: 53.15, lat: 23.55 }
  ];

  function emiratesRenderer() {
    return {
      type: "unique-value",
      field: "name",
      uniqueValueInfos: [
        {
          value: "Abu Dhabi",
          symbol: {
            type: "simple-fill",
            color: GEO_TEAL_FILL,
            outline: { color: GEO_TEAL, width: 1 }
          }
        }
      ],
      defaultSymbol: {
        type: "simple-fill",
        color: OTHER_EMIRATE_FILL,
        outline: { color: OTHER_EMIRATE_OUTLINE, width: 0.75 }
      }
    };
  }

  function abuDhabiRegionsRenderer() {
    return {
      type: "unique-value",
      field: "regionId",
      uniqueValueInfos: [
        {
          value: "abudhabi",
          symbol: {
            type: "simple-fill",
            color: [126, 200, 222, 0.26],
            outline: { color: SUB_REGION_OUTLINE, width: SUB_REGION_OUTLINE_WIDTH }
          }
        },
        {
          value: "alain",
          symbol: {
            type: "simple-fill",
            color: [26, 74, 92, 0.22],
            outline: { color: SUB_REGION_OUTLINE, width: SUB_REGION_OUTLINE_WIDTH }
          }
        },
        {
          value: "aldhafra",
          symbol: {
            type: "simple-fill",
            color: [184, 228, 240, 0.3],
            outline: { color: SUB_REGION_OUTLINE, width: SUB_REGION_OUTLINE_WIDTH }
          }
        }
      ]
    };
  }

  function escapeWhereValue(value) {
    return String(value).replace(/'/g, "''");
  }

  function updateRegionEyebrow(name, subRegion) {
    var el = document.getElementById("geoRegionEyebrow");
    if (!el) return;
    if (subRegion) {
      el.textContent = name;
    } else {
      el.textContent = name + " Emirate";
    }
  }

  function syncFilterRegion(name) {
    if (FILTER_CATALOG.regions.indexOf(name) < 0) return;
    filterState.region = name;
    updateFilterBadge();
    if (filterPanelOpen) queueRenderFilterPanel();
  }

  function clearSubRegionHighlight() {
    subRegionHighlights.forEach(function (h) {
      h.remove();
    });
    subRegionHighlights = [];
  }

  function highlightSubRegions(regionIds) {
    if (!abuDhabiRegionsLayer || !abuDhabiRegionsLayerView || !regionIds.length) {
      return Promise.resolve();
    }
    clearSubRegionHighlight();
    return Promise.all(
      regionIds.map(function (regionId) {
        return abuDhabiRegionsLayer
          .queryFeatures({
            where: "regionId = '" + escapeWhereValue(regionId) + "'",
            outFields: ["OBJECTID"],
            returnGeometry: false
          })
          .then(function (result) {
            var oid =
              result.features &&
              result.features[0] &&
              result.features[0].attributes &&
              result.features[0].attributes.OBJECTID;
            if (oid == null) return;
            subRegionHighlights.push(abuDhabiRegionsLayerView.highlight(oid));
          });
      })
    );
  }

  function updateSubRegionVisibility() {
    if (!geoView) return;
    var showRegions = geoView.zoom >= SUB_REGION_MIN_ZOOM;
    var showLabels = geoView.zoom >= SUB_REGION_LABEL_MIN_ZOOM;
    if (abuDhabiRegionsLayer) abuDhabiRegionsLayer.visible = showRegions;
    if (regionLabelsLayer) regionLabelsLayer.visible = showLabels;
  }

  function goToSubRegion(regionId) {
    var view = SUB_REGION_VIEWS[regionId];
    if (!view || !geoView) return Promise.resolve();
    var filterName = REGION_ID_TO_FILTER[regionId];
    if (filterName) {
      syncFilterRegion(filterName);
      updateRegionEyebrow(filterName, true);
    }
    applyRegionSelection("Abu Dhabi");
    highlightSubRegions([regionId]);
    return geoView.goTo({ center: view.center, zoom: view.zoom }).then(function () {
      updateSubRegionVisibility();
    });
  }

  function applyAIRegions(regionIds) {
    if (!regionIds || !regionIds.length) return Promise.resolve();
    highlightSubRegions(regionIds);
    var first = regionIds[0];
    var view = SUB_REGION_VIEWS[first];
    if (!view || !geoView) return Promise.resolve();
    var filterName = REGION_ID_TO_FILTER[first];
    if (filterName) {
      syncFilterRegion(filterName);
      updateRegionEyebrow(filterName, true);
    }
    applyRegionSelection("Abu Dhabi");
    return geoView.goTo({ center: view.center, zoom: view.zoom }).then(function () {
      updateSubRegionVisibility();
    });
  }

  function clearSelectionHighlight() {
    if (selectionHighlight) {
      selectionHighlight.remove();
      selectionHighlight = null;
    }
  }

  function applyRegionSelection(name) {
    if (EMIRATE_NAMES.indexOf(name) === -1) return;
    SELECTED_REGION = name;
    updateRegionEyebrow(name, name === "Abu Dhabi" ? false : undefined);
    if (name !== "Abu Dhabi") clearSubRegionHighlight();
    if (!emiratesLayer || !emiratesLayerView) return;

    clearSelectionHighlight();

    emiratesLayer
      .queryFeatures({
        where: "name = '" + escapeWhereValue(name) + "'",
        outFields: ["OBJECTID", "name"],
        returnGeometry: false
      })
      .then(function (result) {
        var oid =
          result.features &&
          result.features[0] &&
          result.features[0].attributes &&
          result.features[0].attributes.OBJECTID;
        if (oid == null) return;
        selectionHighlight = emiratesLayerView.highlight(oid);
      })
      .catch(function (err) {
        console.error("LmoGeo selection failed:", err);
      });
  }

  function getEmirateNameFromGraphic(graphic) {
    if (!graphic || !graphic.attributes) return "";
    return graphic.attributes.name || graphic.attributes.NAME || "";
  }

  function getSubRegionIdFromGraphic(graphic) {
    if (!graphic || !graphic.attributes) return "";
    return graphic.attributes.regionId || "";
  }

  function bindMapInteractions() {
    if (!geoView || !emiratesLayer) return;

    geoView.on("click", function (event) {
      geoView.hitTest(event).then(function (response) {
        if (abuDhabiRegionsLayer && geoView.zoom >= SUB_REGION_MIN_ZOOM) {
          var subHit = response.results.find(function (r) {
            return r.graphic && r.graphic.layer === abuDhabiRegionsLayer;
          });
          if (subHit) {
            var regionId = getSubRegionIdFromGraphic(subHit.graphic);
            var filterName = REGION_ID_TO_FILTER[regionId];
            if (filterName) {
              syncFilterRegion(filterName);
              updateRegionEyebrow(filterName, true);
              highlightSubRegions([regionId]);
              applyRegionSelection("Abu Dhabi");
            }
            return;
          }
        }

        var hit = response.results.find(function (r) {
          return r.graphic && r.graphic.layer === emiratesLayer;
        });
        if (!hit) return;
        var name = getEmirateNameFromGraphic(hit.graphic);
        if (name) applyRegionSelection(name);
      });
    });

    geoView.on("pointer-move", function (event) {
      geoView.hitTest(event).then(function (response) {
        var overSub =
          abuDhabiRegionsLayer &&
          geoView.zoom >= SUB_REGION_MIN_ZOOM &&
          response.results.some(function (r) {
            return r.graphic && r.graphic.layer === abuDhabiRegionsLayer;
          });
        var overEmirate = response.results.some(function (r) {
          return r.graphic && r.graphic.layer === emiratesLayer;
        });
        geoView.container.style.cursor = overSub || overEmirate ? "pointer" : "default";
      });
    });

    geoView.watch("zoom", updateSubRegionVisibility);
  }

  function initEmiratesLayerView() {
    return geoView.whenLayerView(emiratesLayer).then(function (layerView) {
      emiratesLayerView = layerView;
      emiratesLayerView.highlightOptions = {
        color: [126, 200, 222, 1],
        fillOpacity: 0.18,
        haloColor: [126, 200, 222, 1],
        haloOpacity: 0.4
      };
      applyRegionSelection(SELECTED_REGION);
    });
  }

  function initAbuDhabiRegionsLayerView() {
    if (!abuDhabiRegionsLayer) return Promise.resolve();
    return geoView.whenLayerView(abuDhabiRegionsLayer).then(function (layerView) {
      abuDhabiRegionsLayerView = layerView;
      abuDhabiRegionsLayerView.highlightOptions = {
        color: [255, 255, 255, 1],
        fillOpacity: 0.12,
        haloColor: [126, 200, 222, 1],
        haloOpacity: 0.5
      };
      updateSubRegionVisibility();
      return highlightSubRegions(["abudhabi"]);
    });
  }

  function prepareGeoJSONFeatures(geojson) {
    geojson.features.forEach(function (f, i) {
      f.properties = f.properties || {};
      f.properties.OBJECTID = i + 1;
    });
    return geojson;
  }

  function loadEmiratesGeoJSON() {
    if (window.UAE_EMIRATES_GEOJSON) {
      return Promise.resolve(
        prepareGeoJSONFeatures(JSON.parse(JSON.stringify(window.UAE_EMIRATES_GEOJSON)))
      );
    }

    if (window.location.protocol === "file:") {
      return Promise.reject(
        new Error("UAE emirates GeoJSON is unavailable on file:// pages.")
      );
    }

    return fetch(EMIRATES_GEOJSON_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("GeoJSON fetch failed: " + res.status);
        return res.json();
      })
      .then(prepareGeoJSONFeatures);
  }

  function loadAbuDhabiRegionsGeoJSON() {
    if (window.ABU_DHABI_REGIONS_GEOJSON) {
      return Promise.resolve(
        prepareGeoJSONFeatures(
          JSON.parse(JSON.stringify(window.ABU_DHABI_REGIONS_GEOJSON))
        )
      );
    }

    if (window.location.protocol === "file:") {
      return Promise.reject(
        new Error("Abu Dhabi regions GeoJSON is unavailable on file:// pages.")
      );
    }

    return fetch(ABU_DHABI_REGIONS_GEOJSON_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("Abu Dhabi regions GeoJSON fetch failed: " + res.status);
        return res.json();
      })
      .then(prepareGeoJSONFeatures);
  }

  function geojsonToBlobUrl(geojson) {
    return URL.createObjectURL(
      new Blob([JSON.stringify(geojson)], { type: "application/json" })
    );
  }

  function createRegionLabelsLayer(GraphicsLayer, Graphic, TextSymbol) {
    var isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    var layer = new GraphicsLayer({ listMode: "hide", title: "Region labels" });
    SUB_REGION_LABELS.forEach(function (pt) {
      layer.add(
        new Graphic({
          geometry: {
            type: "point",
            longitude: pt.lon,
            latitude: pt.lat
          },
          symbol: new TextSymbol({
            text: pt.text,
            color: isDark ? [230, 240, 245, 0.95] : [15, 36, 43, 0.92],
            haloColor: isDark ? [15, 26, 34, 0.92] : [255, 255, 255, 0.95],
            haloSize: 1.5,
            font: { size: 11, weight: "bold", family: "Inter" }
          })
        })
      );
    });
    return layer;
  }

  function refreshMapTheme() {
    if (!geoView) return;
    var isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    if (geoView.map) {
      geoView.map.basemap = isDark ? "dark-gray-vector" : "streets-vector";
    }
    if (!regionLabelsLayer || !window.__lmoEsriModules) return;
    var mods = window.__lmoEsriModules;
    var map = geoView.map;
    var wasVisible = regionLabelsLayer.visible;
    map.remove(regionLabelsLayer);
    regionLabelsLayer = createRegionLabelsLayer(
      mods.GraphicsLayer,
      mods.Graphic,
      mods.TextSymbol
    );
    regionLabelsLayer.visible = wasVisible;
    map.add(regionLabelsLayer);
    window.__lmoRegionLabelsLayer = regionLabelsLayer;
  }

  function createEmiratesMap(
    geojson,
    regionsGeojson,
    Map,
    MapView,
    GeoJSONLayer,
    GraphicsLayer,
    Graphic,
    TextSymbol
  ) {
    if (geoView) return Promise.resolve();

    emiratesLayer = new GeoJSONLayer({
      url: geojsonToBlobUrl(geojson),
      title: "UAE Emirates",
      objectIdField: "OBJECTID",
      fields: [
        { name: "OBJECTID", type: "oid" },
        { name: "name", type: "string" }
      ],
      outFields: ["name", "OBJECTID"],
      popupEnabled: false,
      renderer: emiratesRenderer()
    });

    abuDhabiRegionsLayer = new GeoJSONLayer({
      url: geojsonToBlobUrl(regionsGeojson),
      title: "Abu Dhabi Regions",
      objectIdField: "OBJECTID",
      fields: [
        { name: "OBJECTID", type: "oid" },
        { name: "name", type: "string" },
        { name: "regionId", type: "string" }
      ],
      outFields: ["name", "regionId", "OBJECTID"],
      popupEnabled: false,
      renderer: abuDhabiRegionsRenderer()
    });

    regionLabelsLayer = createRegionLabelsLayer(
      GraphicsLayer,
      Graphic,
      TextSymbol
    );

    var map = new Map({
      basemap:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark-gray-vector"
          : "streets-vector",
      layers: [emiratesLayer, abuDhabiRegionsLayer, regionLabelsLayer]
    });

    geoView = new MapView({
      container: "geoMapView",
      map: map,
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      ui: { components: [] },
      constraints: { snapToZoom: false }
    });

    return Promise.all([
      emiratesLayer.when(function () {
        return emiratesLayer.load();
      }),
      abuDhabiRegionsLayer.when(function () {
        return abuDhabiRegionsLayer.load();
      })
    ]);
  }

  var mapLoadPromise = null;
  var ESRI_MODULE_IDS = [
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/symbols/TextSymbol"
  ];

  function waitForRequireFn(resolve, reject) {
    var attempts = 0;
    (function tick() {
      if (typeof require === "function") {
        resolve();
        return;
      }
      if (++attempts > 120) {
        reject(new Error("ArcGIS require() did not become available."));
        return;
      }
      setTimeout(tick, 50);
    })();
  }

  function ensureArcGISLoaded() {
    if (typeof require === "function") {
      return Promise.resolve();
    }
    if (window.__lmoArcgisLoadPromise) {
      return window.__lmoArcgisLoadPromise;
    }

    window.__lmoArcgisLoadPromise = new Promise(function (resolve, reject) {
      var existing =
        document.querySelector('script[data-lmo-arcgis="1"]') ||
        document.querySelector('script[src*="js.arcgis.com"]');
      if (existing) {
        existing.setAttribute("data-lmo-arcgis", "1");
        if (existing.getAttribute("data-loaded") === "1" || typeof require === "function") {
          waitForRequireFn(resolve, reject);
          return;
        }
        existing.addEventListener("load", function () {
          existing.setAttribute("data-loaded", "1");
          waitForRequireFn(resolve, reject);
        });
        existing.addEventListener("error", function () {
          window.__lmoArcgisLoadPromise = null;
          reject(new Error("Failed to load ArcGIS API."));
        });
        return;
      }

      var script = document.createElement("script");
      script.src = "https://js.arcgis.com/4.29/";
      script.setAttribute("data-lmo-arcgis", "1");
      script.onload = function () {
        script.setAttribute("data-loaded", "1");
        waitForRequireFn(resolve, reject);
      };
      script.onerror = function () {
        window.__lmoArcgisLoadPromise = null;
        reject(new Error("Failed to load ArcGIS API."));
      };
      document.head.appendChild(script);
    });

    return window.__lmoArcgisLoadPromise;
  }

  function loadEsriModules() {
    if (window.__lmoEsriModules) {
      return Promise.resolve(window.__lmoEsriModules);
    }
    if (mapLoadPromise) return mapLoadPromise;

    mapLoadPromise = ensureArcGISLoaded()
      .then(function () {
        if (window.__lmoEsriModules) return window.__lmoEsriModules;
        if (window.__lmoEsriRequireStarted) {
          return new Promise(function (resolve, reject) {
            var attempts = 0;
            (function waitModules() {
              if (window.__lmoEsriModules) {
                resolve(window.__lmoEsriModules);
                return;
              }
              if (++attempts > 120) {
                reject(new Error("ArcGIS modules did not finish loading."));
                return;
              }
              setTimeout(waitModules, 50);
            })();
          });
        }

        window.__lmoEsriRequireStarted = true;

        return new Promise(function (resolve, reject) {
          require(
            ["esri/config"],
            function (esriConfig) {
              require(
                ESRI_MODULE_IDS,
                function (
                  Map,
                  MapView,
                  GeoJSONLayer,
                  GraphicsLayer,
                  Graphic,
                  TextSymbol
                ) {
                  window.__lmoEsriModules = {
                    esriConfig: esriConfig,
                    Map: Map,
                    MapView: MapView,
                    GeoJSONLayer: GeoJSONLayer,
                    GraphicsLayer: GraphicsLayer,
                    Graphic: Graphic,
                    TextSymbol: TextSymbol
                  };
                  resolve(window.__lmoEsriModules);
                },
                reject
              );
            },
            reject
          );
        });
      })
      .catch(function (err) {
        if (!window.__lmoEsriModules) mapLoadPromise = null;
        throw err;
      });

    return mapLoadPromise;
  }

  function initMap() {
    if (geoView) return;
    if (window.__lmoGeoMapInitScheduled) return;
    window.__lmoGeoMapInitScheduled = true;

    if (window.__lmoGeoView) {
      geoView = window.__lmoGeoView;
      emiratesLayer = window.__lmoEmiratesLayer;
      emiratesLayerView = window.__lmoEmiratesLayerView;
      abuDhabiRegionsLayer = window.__lmoAbuDhabiRegionsLayer;
      abuDhabiRegionsLayerView = window.__lmoAbuDhabiRegionsLayerView;
      regionLabelsLayer = window.__lmoRegionLabelsLayer;
      resizeMap();
      return;
    }

    function startMapInit() {
      loadEsriModules()
      .then(function (mods) {
        if (geoView) return;
        if (ARCGIS_API_KEY) mods.esriConfig.apiKey = ARCGIS_API_KEY;
        return Promise.all([
          loadEmiratesGeoJSON(),
          loadAbuDhabiRegionsGeoJSON()
        ]).then(function (results) {
          return createEmiratesMap(
            results[0],
            results[1],
            mods.Map,
            mods.MapView,
            mods.GeoJSONLayer,
            mods.GraphicsLayer,
            mods.Graphic,
            mods.TextSymbol
          );
        });
      })
      .then(function () {
        if (!geoView) return;
        window.__lmoGeoView = geoView;
        window.__lmoEmiratesLayer = emiratesLayer;
        window.__lmoAbuDhabiRegionsLayer = abuDhabiRegionsLayer;
        window.__lmoRegionLabelsLayer = regionLabelsLayer;
        bindMapInteractions();
        return initEmiratesLayerView();
      })
      .then(function () {
        if (!geoView) return;
        window.__lmoEmiratesLayerView = emiratesLayerView;
        return initAbuDhabiRegionsLayerView();
      })
      .then(function () {
        if (!geoView) return;
        window.__lmoAbuDhabiRegionsLayerView = abuDhabiRegionsLayerView;
        return geoView.when(function () {
          updateSubRegionVisibility();
          resizeMap();
        });
      })
      .catch(function (err) {
        console.error("LmoGeo map init failed:", err);
      });
    }

    if (document.readyState === "complete") {
      startMapInit();
    } else {
      window.addEventListener("load", startMapInit, { once: true });
    }
  }

  function zoomMap(delta) {
    if (!geoView) return;
    geoView.goTo({ zoom: geoView.zoom + delta });
  }

  function resetMapView() {
    if (!geoView) return;
    clearSubRegionHighlight();
    updateRegionEyebrow("Abu Dhabi", false);
    syncFilterRegion("Abu Dhabi");
    geoView.goTo({ center: MAP_CENTER, zoom: MAP_ZOOM }).then(function () {
      updateSubRegionVisibility();
      applyRegionSelection("Abu Dhabi");
      highlightSubRegions(["abudhabi"]);
    });
  }

  /* ── Fullscreen ── */
  function toggleFullscreen() {
    var main = document.getElementById("geoMain");
    if (!main) return;
    if (document.fullscreenElement === main) {
      document.exitFullscreen();
    } else {
      main.requestFullscreen().catch(function () {});
    }
  }

  function initFullscreen() {
    var main = document.getElementById("geoMain");
    document.addEventListener("fullscreenchange", function () {
      if (!main) return;
      main.classList.toggle("is-fullscreen", document.fullscreenElement === main);
      resizeMap();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.fullscreenElement) resizeMap();
    });
  }

  /* ── Map tools ── */
  function initMapTools() {
    var zoomIn = document.getElementById("geoZoomIn");
    var zoomOut = document.getElementById("geoZoomOut");
    var reset = document.getElementById("geoResetView");
    var fs = document.getElementById("geoFullscreen");

    if (zoomIn) zoomIn.addEventListener("click", function () { zoomMap(1); });
    if (zoomOut) zoomOut.addEventListener("click", function () { zoomMap(-1); });
    if (reset) reset.addEventListener("click", resetMapView);
    if (fs) fs.addEventListener("click", toggleFullscreen);
  }

  function boot() {
    if (window.__lmoGeoBooted) return;
    window.__lmoGeoBooted = true;

    if (window.LMO && LMO.initLmoEmbed) LMO.initLmoEmbed();
    initSidebarResize();
    var sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", function () {
        toggleSidebar();
      });
    }
    initWorkforceTabs();
    initFilters();
    initMapTools();
    initFullscreen();
    initMap();
    window.addEventListener("resize", resizeMap);
    if (window.LMO && LMO.onThemeChange) {
      LMO.onThemeChange(refreshMapTheme);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.LmoGeo = {
    toggleSidebar: toggleSidebar,
    toggleFullscreen: toggleFullscreen,
    goToSubRegion: goToSubRegion,
    applyAIRegions: applyAIRegions,
    applyRegionSelection: applyRegionSelection,
    syncFilterRegion: syncFilterRegion,
    getGeoView: function () { return geoView; },
    resizeMap: resizeMap,
    SUB_REGION_VIEWS: SUB_REGION_VIEWS,
    REGION_ID_TO_FILTER: REGION_ID_TO_FILTER,
    FILTER_TO_REGION_ID: FILTER_TO_REGION_ID
  };
})();
