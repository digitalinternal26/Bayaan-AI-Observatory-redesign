(function () {
  var THEME_KEY = "bayaan-theme";

  function appWindow() {
    /* file:// documents are unique origins — never touch window.top.document. */
    if (location.protocol === "file:") return window;
    try {
      return window.top && window.top.document ? window.top : window;
    } catch (e) {
      return window;
    }
  }

  function appDocument() {
    return appWindow().document;
  }

  function cssVar(name) {
    return getComputedStyle(appDocument().documentElement)
      .getPropertyValue(name)
      .trim();
  }

  function resolveColor(color) {
    if (!color) return color;
    if (color.indexOf("var(") === 0) {
      var m = color.match(/var\((--[^)]+)\)/);
      return m ? cssVar(m[1]) : color;
    }
    if (color.charAt(0) === "-" && color.charAt(1) === "-") return cssVar(color);
    return color;
  }

  function colorAlpha(color, alphaHex) {
    var c = resolveColor(color);
    if (!c || c.indexOf("var(") === 0) return "transparent";
    if (c.charAt(0) === "#") {
      var h = c.slice(1);
      if (h.length === 3)
        h = h
          .split("")
          .map(function (x) {
            return x + x;
          })
          .join("");
      if (h.length === 6) return "#" + h + alphaHex;
      if (h.length === 8) return "#" + h.slice(0, 6) + alphaHex;
    }
    return c;
  }

  function normalizeTheme(theme) {
    return theme === "dark" ? "dark" : "light";
  }

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || "light";
  }

  function applyThemeToDocument(doc, theme) {
    if (!doc || !doc.documentElement) return;
    var normalized = normalizeTheme(theme);
    doc.documentElement.setAttribute("data-theme", normalized);
    if (doc.body) doc.body.setAttribute("data-theme", normalized);
  }

  var EMBED_FRAME_IDS = ["lmoObsFrame", "geoObsFrame"];

  function syncEmbedIframes(theme, rootDoc) {
    if (location.protocol === "file:") return;
    var doc = rootDoc || appDocument();
    EMBED_FRAME_IDS.forEach(function (id) {
      var frame = doc.getElementById(id);
      if (!frame) return;
      try {
        if (frame.contentDocument) {
          applyThemeToDocument(frame.contentDocument, theme);
        }
      } catch (e) {}
    });
  }

  function bindEmbedFrameThemeSync(rootDoc) {
    var doc = rootDoc || appDocument();
    EMBED_FRAME_IDS.forEach(function (id) {
      var frame = doc.getElementById(id);
      if (!frame || frame._bayaanThemeBound) return;
      frame._bayaanThemeBound = true;
      frame.addEventListener("load", function () {
        syncEmbedIframes(getTheme(), doc);
      });
    });
  }

  function applyTheme(theme) {
    var normalized = normalizeTheme(theme);
    var rootDoc = appDocument();
    applyThemeToDocument(rootDoc, normalized);
    syncEmbedIframes(normalized, rootDoc);
    try {
      appWindow().dispatchEvent(
        new CustomEvent("bayaan-theme-change", { detail: { theme: normalized } })
      );
    } catch (e) {
      window.dispatchEvent(
        new CustomEvent("bayaan-theme-change", { detail: { theme: normalized } })
      );
    }
  }

  function setTheme(theme) {
    var normalized = normalizeTheme(theme);
    localStorage.setItem(THEME_KEY, normalized);
    applyTheme(normalized);
    try {
      if (window.top && window.top !== window) {
        window.top.postMessage({ type: "bayaan-theme", theme: normalized }, "*");
      }
    } catch (e) {}
  }

  function chartTheme() {
    return {
      surface: cssVar("--surface") || "#FFFFFF",
      textPrimary: cssVar("--text-primary") || "#0F172A",
      textSecondary: cssVar("--text-secondary") || "#475569",
      border: cssVar("--border-solid") || "#E5E7EB",
      tick: cssVar("--text-tertiary") || "#94A3B8",
      grid: cssVar("--surface2") || "#F1F5F9",
    };
  }

  function chartColor(n) {
    return cssVar("--chart-" + n) || cssVar("--accent");
  }

  function chartPalette(count) {
    var out = [];
    for (var i = 1; i <= (count || 8); i++) {
      out.push(chartColor(i));
    }
    return out;
  }

  window.BayaanTheme = {
    cssVar: cssVar,
    resolveColor: resolveColor,
    colorAlpha: colorAlpha,
    getTheme: getTheme,
    setTheme: setTheme,
    applyTheme: applyTheme,
    chartTheme: chartTheme,
    chartColor: chartColor,
    chartPalette: chartPalette,
  };

  applyTheme(getTheme());
  bindEmbedFrameThemeSync(appDocument());

  if (appDocument().readyState === "loading") {
    appDocument().addEventListener("DOMContentLoaded", function () {
      bindEmbedFrameThemeSync(appDocument());
    });
  }

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "bayaan-theme") {
      localStorage.setItem(THEME_KEY, normalizeTheme(e.data.theme));
      applyTheme(e.data.theme);
    }
  });

  window.addEventListener("storage", function (e) {
    if (e.key === THEME_KEY) {
      applyTheme(e.newValue || "light");
    }
  });
})();
