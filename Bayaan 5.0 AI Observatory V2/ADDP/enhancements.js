(function () {
  "use strict";

  // ---------------------------------------------------------------------
  // Part A: remove the district / region score colour overlay
  //
  // app.bundle.js paints four data-driven "fill" layers over the basemap
  // — district-boundaries-fill, district-boundaries-selected-fill,
  // region-boundaries-fill, region-boundaries-selected-fill — each tinted
  // from the feature's score via a red -> orange -> amber -> green ramp
  // (gray for missing scores). This strips that tint while leaving the
  // rest of the map untouched (basemap, boundary outlines, selection
  // lines, focus hatch, POIs, air-quality raster).
  //
  // maplibre-gl.js loads before this file and app.bundle.js loads after,
  // so patching the Map prototype here lands before the map is built:
  // the fill layers are still created (so the app's getLayer() /
  // setFilter() / setLayoutProperty() calls keep working) but pinned to
  // zero opacity, and their fill-color / fill-opacity can no longer be
  // set back by the app's own re-theme path (So()).
  // ---------------------------------------------------------------------
  function initRemoveScoreOverlay() {
    var ml = window.maplibregl;
    if (!ml || !ml.Map || !ml.Map.prototype || ml.Map.prototype.__bayaanNoScoreOverlay) return;

    var HIDDEN = {
      "district-boundaries-fill": true,
      "district-boundaries-selected-fill": true,
      "region-boundaries-fill": true,
      "region-boundaries-selected-fill": true
    };

    var proto = ml.Map.prototype;
    var addLayer = proto.addLayer;
    var setPaintProperty = proto.setPaintProperty;

    proto.addLayer = function (layer, beforeId) {
      if (layer && HIDDEN[layer.id]) {
        var paint = {};
        for (var k in (layer.paint || {})) paint[k] = layer.paint[k];
        paint["fill-opacity"] = 0;
        var copy = {};
        for (var p in layer) copy[p] = layer[p];
        copy.paint = paint;
        layer = copy;
      }
      return addLayer.call(this, layer, beforeId);
    };

    proto.setPaintProperty = function (id, name, value, options) {
      if (HIDDEN[id] && (name === "fill-opacity" || name === "fill-color")) return this;
      return setPaintProperty.call(this, id, name, value, options);
    };

    proto.__bayaanNoScoreOverlay = true;
  }

  // ---------------------------------------------------------------------
  // Part C: citizenship / gender distribution-bar labels
  //
  // Reads the live segment widths (already computed correctly by the app)
  // and mirrors them into percentage + category labels placed around the
  // bar, without touching the segments themselves (keeps existing hover
  // tooltip behavior intact).
  // ---------------------------------------------------------------------
  function initDistributionLabels() {
    var bars = document.querySelectorAll("[data-citizenship-bar], [data-gender-bar]");
    bars.forEach(function (bar) {
      var block = bar.closest(".citizenship-chart-block");
      if (!block) return;
      var segs = bar.querySelectorAll(".stacked-bar-seg");
      var legend = block.querySelector(".stacked-bar-legend");
      if (!legend || segs.length !== 2) return;
      var pcts = legend.querySelectorAll(".stacked-bar-legend-pct");
      if (pcts.length !== 2) return;
      var pctA = pcts[0];
      var pctB = pcts[1];

      function sync() {
        var wA = parseFloat(segs[0].style.width) || 0;
        var wB = parseFloat(segs[1].style.width) || 0;
        pctA.textContent = Math.round(wA) + "%";
        pctB.textContent = Math.round(wB) + "%";
      }

      sync();
      var mo = new MutationObserver(sync);
      segs.forEach(function (seg) {
        mo.observe(seg, { attributes: true, attributeFilter: ["style"] });
      });
    });
  }

  // ---------------------------------------------------------------------
  // Part D: hover-tooltip color fix
  //
  // The app's own hover tooltip (shown when pointing at a .stacked-bar-seg)
  // colors itself from a hardcoded map baked into app.bundle.js
  // ({is-emirati:"#f79009", is-non-emirati:"#13b473", is-male:"#267ecd",
  // is-female:"#9a95f1"}) that has nothing to do with the actual bar colors
  // (#0073F0 / #C7DCF4). Since that map is private to a closure inside the
  // minified bundle, we can't edit it directly — instead we watch the
  // tooltip element (a shared singleton the bundle creates lazily on first
  // hover) and recolor its accent bar / swatch / share value to match
  // whichever category it's currently showing, every time its content
  // changes.
  // ---------------------------------------------------------------------
  function initTooltipColorFix() {
    var COLORS = {
      "Emirati": "#0073F0",
      "Non Emirati": "#C7DCF4",
      "Non-Emirati": "#C7DCF4",
      "Male": "#0073F0",
      "Female": "#C7DCF4"
    };

    function fix(tooltip) {
      var label = tooltip.querySelector(".chart-seg-tooltip-label");
      if (!label) return;
      var color = COLORS[label.textContent.trim()];
      if (!color) return;
      var accent = tooltip.querySelector(".chart-seg-tooltip-accent");
      var swatch = tooltip.querySelector(".chart-seg-tooltip-swatch");
      if (accent) accent.style.background = color;
      if (swatch) swatch.style.background = color;
    }

    function attach(tooltip) {
      fix(tooltip);
      var mo = new MutationObserver(function () { fix(tooltip); });
      mo.observe(tooltip, { childList: true, subtree: true, characterData: true });
    }

    var existing = document.querySelector("[data-chart-tooltip]");
    if (existing) {
      attach(existing);
      return;
    }

    var bodyObserver = new MutationObserver(function () {
      var tooltip = document.querySelector("[data-chart-tooltip]");
      if (tooltip) {
        bodyObserver.disconnect();
        attach(tooltip);
      }
    });
    bodyObserver.observe(document.body, { childList: true });
  }

  // ---------------------------------------------------------------------
  // Part E: District Score gauge
  //
  // Draws the six-division arc gauge -- the app's six ranking divisions,
  // each given an equal sixth of the arc -- plus its inner tick ring and
  // its score marker, into the [data-district-gauge] shell in index.html.
  //
  // Everything -- arc segments, ticks and marker -- is generated from the
  // single pointAt() primitive below, so the marker always sits exactly on
  // the arc centreline and nothing can drift out of alignment.
  //
  // The score itself is never hardcoded. app.bundle.js animates the value
  // into [data-overall-score] and writes dataset.animValue on every frame,
  // so we observe that attribute and let the marker glide in step with the
  // counting number. The marker takes its colour from the division it
  // lands in, read back off that arc's computed stroke, so the palette
  // lives in styles.css only and the two can never disagree.
  // ---------------------------------------------------------------------
  var SVG_NS = "http://www.w3.org/2000/svg";

  // Geometry, in the SVG's 180x125 viewBox units. A shallow ~2.5:1 cap
  // (156 degrees), not a semicircle -- the ends stop above the horizontal
  // centreline, which is what leaves the lower middle open for the score.
  var G = {
    cx: 90,
    cy: 92,
    r: 82,
    start: 168,   // degrees, score 0
    sweep: 156,   // degrees swept from score 0 to score 100
    tickInner: 61,
    tickOuter: 65,
    tickCount: 25,
    tickFrom: 6,  // ticks stop short of the arc ends, as in the reference;
    tickTo: 94,   // this also lifts their lower ends clear of the score text
    gapPx: 12     // separation between adjacent divisions, before the
                  // round stroke caps eat ~4px back off each end
  };

  // The app's six ranking divisions, laid out as equal sixths of the
  // 0-100 scale. Their colours are not repeated here -- each division is
  // painted by its own --gauge-div-N custom property in styles.css.
  var DIVISIONS = 6;

  // Index (0-based) of the division a score falls in; 100 belongs to the last.
  function divisionOf(score) {
    return Math.min(DIVISIONS - 1, Math.floor(score / 100 * DIVISIONS));
  }

  // The colour of that division, resolved off the arc that paints it, as
  // [r, g, b]. Reading it back out of the DOM keeps styles.css the only
  // place the palette is written down, and gives callers the channels they
  // need to build the chip's 10% / 24% tints.
  function divisionRGB(score) {
    if (score == null) return null;
    var arc = document.querySelector('[data-gauge-arc="' + (divisionOf(score) + 1) + '"]');
    var parts = arc && window.getComputedStyle(arc).stroke.match(/[0-9.]+/g);
    return parts && parts.length >= 3 ? [parts[0], parts[1], parts[2]] : null;
  }

  function pointAt(score, radius) {
    var a = (G.start - (score / 100) * G.sweep) * Math.PI / 180;
    return {
      x: G.cx + radius * Math.cos(a),
      y: G.cy - radius * Math.sin(a)
    };
  }

  function round(n) { return Math.round(n * 100) / 100; }

  // Arc between two scores, drawn clockwise on screen (sweep-flag 1).
  function arcPath(from, to) {
    var a = pointAt(from, G.r);
    var b = pointAt(to, G.r);
    var large = Math.abs(to - from) / 100 * G.sweep > 180 ? 1 : 0;
    return "M " + round(a.x) + " " + round(a.y) +
           " A " + G.r + " " + G.r + " 0 " + large + " 1 " + round(b.x) + " " + round(b.y);
  }

  function renderGauge(host) {
    var svg = host.querySelector(".gauge-svg");
    if (!svg) return;

    // Half of the divider gap, expressed in score units.
    var gapScore = (G.gapPx / G.r) * (180 / Math.PI) / G.sweep * 100 / 2;

    var span = 100 / DIVISIONS;
    for (var d = 0; d < DIVISIONS; d++) {
      var path = svg.querySelector('[data-gauge-arc="' + (d + 1) + '"]');
      if (!path) continue;
      // Every end is pulled back by the same half-gap, including the two
      // outer tips -- otherwise the first and last divisions would paint a
      // half-gap longer than the four between them.
      path.setAttribute("d", arcPath(d * span + gapScore, (d + 1) * span - gapScore));
    }

    // Fine neutral ticks on a concentric ring inside the arc.
    var group = svg.querySelector("[data-gauge-ticks]");
    if (group) {
      while (group.firstChild) group.removeChild(group.firstChild);
      for (var i = 0; i < G.tickCount; i++) {
        var score = G.tickFrom + (i / (G.tickCount - 1)) * (G.tickTo - G.tickFrom);
        var a = pointAt(score, G.tickInner);
        var b = pointAt(score, G.tickOuter);
        var line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("class", "gauge-tick");
        line.setAttribute("x1", round(a.x));
        line.setAttribute("y1", round(a.y));
        line.setAttribute("x2", round(b.x));
        line.setAttribute("y2", round(b.y));
        group.appendChild(line);
      }
    }
  }

  function setMarker(host, score) {
    var marker = host.querySelector("[data-gauge-marker]");
    if (!marker) return;
    if (score == null) {
      marker.setAttribute("visibility", "hidden");
      return;
    }
    var p = pointAt(score, G.r);
    // The marker wears the colour of the division it sits on; the chip
    // below is tinted from the same colour, so the two always agree.
    var rgb = divisionRGB(score);
    host.style.setProperty("--gauge-marker", rgb ? "rgb(" + rgb.join(", ") + ")" : "");
    marker.removeAttribute("visibility");
    marker.setAttribute("transform", "translate(" + round(p.x) + " " + round(p.y) + ")");
  }

  // The live overall score. dataset.animValue is the per-frame value
  // written by the bundle's count-up animator; textContent ("83.18%") is
  // the fallback in case the value is ever written directly. Returns null
  // when the district has no data at all -- the bundle's "—" case.
  function readOverallScore(value) {
    var v = parseFloat(value.dataset.animValue);
    if (!isFinite(v)) v = parseFloat(value.textContent);
    if (!isFinite(v)) return null;
    return Math.min(100, Math.max(0, v));
  }

  // Run fn now, then on every frame of the count-up animation and on any
  // direct rewrite of the score.
  function onScoreChange(value, fn) {
    fn();
    new MutationObserver(fn).observe(value, {
      attributes: true,
      attributeFilter: ["data-anim-value"],
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  function initDistrictScoreGauge() {
    var host = document.querySelector("[data-district-gauge]");
    var value = document.querySelector("[data-overall-score]");
    if (!host || !value) return;

    renderGauge(host);
    onScoreChange(value, function () {
      setMarker(host, readOverallScore(value));
    });
  }

  // ---------------------------------------------------------------------
  // Part F: District Score status chip
  //
  // The band is taken from the score itself, on the app's own thresholds:
  //
  //   High   score >= 85          -> "good"
  //   Mid    70 <= score < 85     -> "risk"
  //   Low    score < 70           -> "critical"
  //   —      no data              -> chip hidden
  //
  // These are the thresholds app.bundle.js uses in Je()/In(), so the chip,
  // the "Low/Mid/High" level and the Good/Risk/Critical counts always agree.
  // Reading the score rather than the band text also means the chip is right
  // on the first paint, before the bundle has written a level at all.
  //
  // The chip is worded High / Mid / Low, and the status key rides along as
  // data-level for anything else that keys off it.
  //
  // Its colour is not taken from that key, though: it is tinted from the
  // gauge division the marker is sitting in, so the pill and the marker are
  // always the same colour. The two scales do not share boundaries -- the
  // divisions are equal sixths, the wording breaks at 70 and 85 -- so a
  // score of 83.18 shows a green pill reading "Mid".
  // ---------------------------------------------------------------------
  var BANDS = [
    { min: 85, key: "good", label: "High" },
    { min: 70, key: "risk", label: "Mid" },
    { min: -Infinity, key: "critical", label: "Low" }
  ];

  function bandOf(score) {
    if (score == null) return null;
    for (var i = 0; i < BANDS.length; i++) {
      if (score >= BANDS[i].min) return BANDS[i];
    }
    return null;
  }

  function initDistrictScoreChip() {
    var chip = document.querySelector("[data-district-score-chip]");
    var level = chip && chip.querySelector("[data-overall-level]");
    var value = document.querySelector("[data-overall-score]");
    if (!chip || !level || !value) return;

    function sync() {
      var score = readOverallScore(value);
      var band = bandOf(score);
      chip.hidden = !band;
      if (!band) {
        chip.removeAttribute("data-level");
        return;
      }
      chip.setAttribute("data-level", band.key);
      if (level.textContent !== band.label) level.textContent = band.label;

      // Tint from the marker's division. The fallbacks in styles.css cover
      // the case where the gauge is absent and there is no arc to read.
      var rgb = divisionRGB(score);
      if (!rgb) return;
      chip.style.setProperty("--chip-color", "rgb(" + rgb.join(", ") + ")");
      chip.style.setProperty("--chip-tint", "rgba(" + rgb.join(", ") + ", .1)");
      chip.style.setProperty("--chip-edge", "rgba(" + rgb.join(", ") + ", .24)");
    }

    onScoreChange(value, sync);
    // The bundle writes its own Je() band into the level element whenever
    // the district changes; re-run against the score when it does, so a
    // stale or disagreeing band never survives.
    new MutationObserver(sync).observe(level, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  // ---------------------------------------------------------------------
  // Part G: Map attribution closed state
  // ---------------------------------------------------------------------
  function initAttributionClosed() {
    var mo = new MutationObserver(function () {
      var attribs = document.querySelectorAll(".maplibregl-ctrl-attrib");
      attribs.forEach(function (attrib) {
        if (!attrib.dataset.initClosed) {
          attrib.dataset.initClosed = "true";
          if (attrib.tagName.toLowerCase() === "details") {
            attrib.removeAttribute("open");
          }
          attrib.classList.remove("maplibregl-compact-show");
          setTimeout(function() {
            if (attrib.tagName.toLowerCase() === "details") {
              attrib.removeAttribute("open");
            }
            attrib.classList.remove("maplibregl-compact-show");
          }, 50);
        }
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // ---------------------------------------------------------------------
  // Part H: Census domain tabs
  //
  // Repurposes ADDP's toolbar tab row (Essentials Index / Social
  // Resilience) as the Census Observatory's three domains — Population,
  // Labour Force, Real Estate — and mirrors each domain's confirmed 2025
  // SCAD headline (docs/census-data-reference.md) into the district-score
  // card: the total, its label, and the citizenship / gender split.
  // Emirate + region level only: the source has no district-level census
  // values, so the map and the per-district livability score are left
  // exactly as app.bundle.js computes them.
  //
  // The built bundle's own ".tab" click handler keys off
  // dataset.tab === "social" and otherwise treats the tab as "essentials";
  // with the three new data-tab values it always resolves to "essentials",
  // equals the current state, and short-circuits — so it is inert here and
  // this part owns the tab behaviour outright.
  // ---------------------------------------------------------------------
  var CENSUS_DOMAINS = {
    population: {
      card: { label: "Total Population", headerLabel: "Population", value: "4,441,550", cz: [18.4, 81.6], gd: [67.3, 32.7] }
    },
    labour: {
      card: { label: "Employed Population", headerLabel: "Employed", value: "2,976,520", cz: [11.2, 88.8], gd: [78.2, 21.8] }
    },
    realestate: {
      card: { label: "Total Units", headerLabel: "Units", value: "899,575", cz: null, gd: null }
    }
  };

  var CENSUS_TABS = [
    ["population", "Population", "users-group"],
    ["labour", "Labour Force", "briefcase"],
    ["realestate", "Real Estate", "buildings"]
  ];

  function censusSetSeg(card, segASel, segBSel, pctASel, pctBSel, pair) {
    var segA = card.querySelector(segASel), segB = card.querySelector(segBSel);
    var pctA = card.querySelector(pctASel), pctB = card.querySelector(pctBSel);
    if (segA) segA.style.width = pair[0] + "%";
    if (segB) segB.style.width = pair[1] + "%";
    if (pctA) pctA.textContent = Math.round(pair[0]) + "%";
    if (pctB) pctB.textContent = Math.round(pair[1]) + "%";
  }

  // Emirate-level view = the default selection (no district drilled into).
  function censusIsEmirateView() {
    var dv = document.querySelector("[data-district-value]");
    return !dv || /select district/i.test(dv.textContent || "");
  }

  // Best-effort mirror of the domain headline into the "District Score"
  // card. app.bundle.js re-animates these nodes on district / year change;
  // this re-applies on tab switch and whenever the selection returns to the
  // emirate level, and steps aside once a real district is chosen.
  function censusSyncCard(d) {
    var card = document.querySelector("[data-district-card]");
    if (!card || !d.card || !censusIsEmirateView()) return;
    var v = d.card;
    [].forEach.call(document.querySelectorAll("[data-population-total], [data-population-total-compact]"), function (el) {
      el.textContent = v.value;
    });
    var lab = card.querySelector(".panel-card-population-wrap .panel-card-score-label");
    if (lab) lab.textContent = v.label;
    [].forEach.call(card.querySelectorAll(".panel-card-header-stat-label"), function (el) {
      if (/population|units|employed/i.test(el.textContent)) el.textContent = v.headerLabel;
    });
    var bd = card.querySelector(".panel-card-breakdowns");
    if (v.cz) {
      if (bd) bd.style.removeProperty("display");
      censusSetSeg(card, "[data-citizenship-emirati]", "[data-citizenship-non-emirati]",
        '[data-citizenship-pct="emirati"]', '[data-citizenship-pct="non-emirati"]', v.cz);
      censusSetSeg(card, "[data-gender-male]", "[data-gender-female]",
        '[data-gender-pct="male"]', '[data-gender-pct="female"]', v.gd);
    } else if (bd) {
      bd.style.display = "none";
    }
  }

  var censusActive = "population";

  function censusRender(domain) {
    var d = CENSUS_DOMAINS[domain];
    if (!d) return;
    censusActive = domain;
    [].forEach.call(document.querySelectorAll('.tabs[data-module-only="addp"] .tab'), function (t) {
      var on = t.getAttribute("data-census-domain") === domain;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    censusSyncCard(d);
  }

  // styles.css pins .tabs to a fixed 393px (fine for the two original
  // tabs). Three longer labels overflow that box, so let the census row
  // size to its content and tighten each tab a little.
  function censusInjectTabCSS() {
    if (document.getElementById("census-tabs-css")) return;
    var s = document.createElement("style");
    s.id = "census-tabs-css";
    s.textContent =
      '.tabs[data-census-ready]{width:auto;max-width:100%}' +
      '.tabs[data-census-ready] .tab{flex:0 1 auto;padding:8px 12px;gap:6px}' +
      '.tabs[data-census-ready] .tab .icon{font-size:16px}' +
      '@media(max-width:720px){.tabs[data-census-ready]{width:100%}' +
      '.tabs[data-census-ready] .tab{flex:1 1 0;padding:6px 8px}}';
    document.head.appendChild(s);
  }

  function censusBuildTabs() {
    var row = document.querySelector('.tabs[data-module-only="addp"]');
    if (!row || row.dataset.censusReady) return !!row;
    censusInjectTabCSS();
    row.setAttribute("aria-label", "Census domain");
    row.innerHTML = CENSUS_TABS.map(function (t, i) {
      return '<button type="button" class="tab' + (i === 0 ? " is-active" : "") + '" role="tab" ' +
        'id="tab-' + t[0] + '" aria-selected="' + (i === 0 ? "true" : "false") + '" ' +
        'data-tab="' + t[0] + '" data-census-domain="' + t[0] + '">' +
        '<span class="icon" data-icon="' + t[2] + '" aria-hidden="true"></span>' + t[1] + '</button>';
    }).join("");
    row.dataset.censusReady = "1";
    row.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-census-domain]");
      if (!btn || !row.contains(btn)) return;
      e.preventDefault();
      e.stopPropagation();
      censusRender(btn.getAttribute("data-census-domain"));
    }, true);
    return true;
  }

  function initCensusDomainTabs() {
    // Drop an earlier build's info panel if it is still in the DOM.
    var stale = document.getElementById("census-panel");
    if (stale) stale.remove();
    var staleCss = document.getElementById("census-panel-css");
    if (staleCss) staleCss.remove();

    function tryBoot() {
      if (!censusBuildTabs()) return false;
      censusRender(censusActive);
      return true;
    }

    if (!tryBoot()) {
      // The toolbar row is built by app.bundle.js after this file runs —
      // wait for it to appear.
      var mo = new MutationObserver(function () {
        if (tryBoot()) mo.disconnect();
      });
      mo.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 15000);
    }

    // app.bundle.js count-up-animates the district-score card on load and
    // on every selection / year change, overwriting the mirrored figure.
    // Watch the card and re-apply once its writes go quiet (debounced), so
    // the emirate-level view always settles on the census number. The
    // "already ours" check stops this from looping on our own writes, and
    // censusSyncCard()'s own guard keeps it out of the way once a real
    // district is selected.
    var reapplyTimer = null;
    function scheduleReapply() {
      var d = CENSUS_DOMAINS[censusActive];
      if (!d || !d.card) return;
      var el = document.querySelector("[data-population-total]");
      if (el && el.textContent.trim() === d.card.value) return;
      clearTimeout(reapplyTimer);
      reapplyTimer = setTimeout(function () {
        if (CENSUS_DOMAINS[censusActive]) censusSyncCard(CENSUS_DOMAINS[censusActive]);
      }, 260);
    }
    var scoreCard = document.querySelector("[data-district-card]");
    if (scoreCard) {
      new MutationObserver(scheduleReapply).observe(scoreCard, {
        subtree: true, childList: true, characterData: true
      });
    }
    scheduleReapply();
  }

  try { initRemoveScoreOverlay(); } catch (e) { console.error("enhancements: remove score overlay failed", e); }
  try { initDistributionLabels(); } catch (e) { console.error("enhancements: distribution labels failed", e); }
  try { initTooltipColorFix(); } catch (e) { console.error("enhancements: tooltip color fix failed", e); }
  try { initDistrictScoreGauge(); } catch (e) { console.error("enhancements: district score gauge failed", e); }
  try { initDistrictScoreChip(); } catch (e) { console.error("enhancements: district score chip failed", e); }
  try { initAttributionClosed(); } catch (e) { console.error("enhancements: attribution fix failed", e); }
  try { initCensusDomainTabs(); } catch (e) { console.error("enhancements: census domain tabs failed", e); }
})();
