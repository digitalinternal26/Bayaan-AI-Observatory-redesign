/* Shared LMO embed navigation + breadcrumb (used across all LMO pages) */
(function () {
  function applyLmoTheme(theme) {
    var t = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
    if (document.body) document.body.setAttribute("data-theme", t);
    try {
      window.dispatchEvent(
        new CustomEvent("bayaan-theme-change", { detail: { theme: t } })
      );
    } catch (e) {}
  }

  function isLmoDarkTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  function lmoChartAxes() {
    if (window.BayaanTheme && typeof window.BayaanTheme.chartTheme === "function") {
      var ct = window.BayaanTheme.chartTheme();
      var dark = isLmoDarkTheme();
      return {
        tick: ct.tick || (dark ? "#9DAAC1" : "#94A3B8"),
        grid: dark ? "rgba(255,255,255,0.06)" : "rgba(148,163,184,.12)",
        pointBorder: ct.surface || (dark ? "#141E32" : "#ffffff"),
        tooltipBg: dark ? "rgba(15,23,42,.92)" : "rgba(15,23,42,.9)",
        tooltipTitle: "#ffffff",
        tooltipBody: dark ? "#CBD5E1" : "#E2E8F0",
        tooltipBorder: dark ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.08)",
        hcLabel: dark ? "#9DAAC1" : "#9CA3AF",
      };
    }
    var dark = isLmoDarkTheme();
    return {
      tick: dark ? "#9DAAC1" : "#94A3B8",
      grid: dark ? "rgba(255,255,255,0.06)" : "rgba(148,163,184,.12)",
      pointBorder: dark ? "#141E32" : "#ffffff",
      tooltipBg: dark ? "rgba(15,23,42,.92)" : "rgba(15,23,42,.9)",
      tooltipTitle: "#ffffff",
      tooltipBody: dark ? "#CBD5E1" : "#E2E8F0",
      tooltipBorder: dark ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.08)",
      hcLabel: dark ? "#9DAAC1" : "#9CA3AF",
    };
  }

  function lmoChartJsScales(showAxes, yCallback) {
    var ax = lmoChartAxes();
    return {
      x: {
        display: showAxes,
        grid: { display: false },
        ticks: { color: ax.tick, font: { size: 11 }, maxTicksLimit: 4 },
      },
      y: {
        display: showAxes,
        grid: { color: ax.grid },
        ticks: {
          color: ax.tick,
          font: { size: 11 },
          maxTicksLimit: 4,
          callback: yCallback || undefined,
        },
      },
    };
  }

  function lmoChartJsTooltip() {
    var ax = lmoChartAxes();
    return {
      backgroundColor: ax.tooltipBg,
      titleColor: ax.tooltipTitle,
      bodyColor: ax.tooltipBody,
      borderColor: ax.tooltipBorder,
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
    };
  }

  function onLmoThemeChange(fn) {
    window.addEventListener("bayaan-theme-change", fn);
  }

  try {
    applyLmoTheme(localStorage.getItem("bayaan-theme") || "light");
  } catch (e) {}

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "bayaan-theme") applyLmoTheme(e.data.theme);
  });

  window.addEventListener("storage", function (e) {
    if (e.key === "bayaan-theme") applyLmoTheme(e.newValue || "light");
  });

  const EMBED_QS = new URLSearchParams(location.search).get("embed") === "1";

  /* Apply embed class before first paint so nested iframe sidebars never flash */
  if (EMBED_QS) {
    document.documentElement.classList.add("lmo-embed");
    if (document.body) document.body.classList.add("embed");
    else
      document.addEventListener("DOMContentLoaded", () =>
        document.body.classList.add("embed")
      );
  }

  if (window.parent !== window && document.body) {
    document.body.classList.add("lmo-hosted");
  }

  const LMO_PAGES = {
    briefing: "lmo-briefing-desk.html",
    observe: "lmo-observe.html",
    geospatial: "lmo-geospatial.html",
    diagnose: "lmo-diagnose.html",
    forecasting: "lmo-forecasting_v2.html",
    simulation: "lmo-simulation.html",
  };

  function isEmbed() {
    /* Only nested sub-views (observe/diagnose/forecast in briefing iframes).
       The main LMO shell stays in index.html's iframe but keeps its sidebar. */
    return new URLSearchParams(location.search).get("embed") === "1";
  }

  function postToHost(data) {
    if (window.parent !== window) window.parent.postMessage(data, "*");
  }

  function lmoGoHome(e) {
    if (e) e.preventDefault();
    if (window.parent !== window) {
      postToHost({ type: "lmo-breadcrumb", target: "home" });
      return;
    }
    location.href = "../index.html";
  }

  function lmoGoObservatory(e) {
    if (e) e.preventDefault();
    if (window.parent !== window) {
      postToHost({ type: "lmo-breadcrumb", target: "observatory" });
      return;
    }
    location.href = "../index.html?screen=screen-observatories";
  }

  function initLmoNav() {
    document.querySelectorAll("[data-lmo-nav]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const view = btn.dataset.lmoNav;
        if (window.parent !== window) {
          postToHost({ type: "lmo-nav", view });
        } else if (LMO_PAGES[view]) {
          location.href = LMO_PAGES[view];
        }
      });
    });
  }

  function initLmoBreadcrumb() {
    document.querySelectorAll("[data-lmo-bc]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = link.dataset.lmoBc;
        if (target === "home") lmoGoHome(e);
        else if (target === "observatory") lmoGoObservatory(e);
      });
    });
  }

  let lastEmbedHeight = 0;

  function measureEmbedHeight() {
    const wrap = document.querySelector("body.lmo .wrap");
    if (wrap) return Math.ceil(wrap.getBoundingClientRect().bottom);
    const page = document.querySelector("body.lmo .page");
    if (page) return Math.ceil(page.getBoundingClientRect().bottom);
    return Math.ceil(document.body.offsetHeight);
  }

  function reportEmbedHeight() {
    if (!document.body.classList.contains("embed") || window.parent === window)
      return;
    const h = measureEmbedHeight();
    if (Math.abs(h - lastEmbedHeight) < 2) return;
    lastEmbedHeight = h;
    postToHost({
      type: "lmo-embed-resize",
      height: h,
    });
  }

  function notifyEmbedHeight() {
    requestAnimationFrame(() => {
      reportEmbedHeight();
      setTimeout(reportEmbedHeight, 350);
    });
  }

  function embedQuery() {
    const params = new URLSearchParams();
    if (isEmbed()) params.set("embed", "1");
    const qs = params.toString();
    return qs ? "?" + qs : "";
  }

  function goToObserve(e) {
    if (e) e.preventDefault();
    location.href = "lmo-observe.html" + embedQuery();
  }

  function goToIndicator(id) {
    const params = new URLSearchParams();
    if (isEmbed()) params.set("embed", "1");
    params.set("id", id);
    location.href = "lmo-indicator-detail.html?" + params.toString();
  }

  function goToInsight(id) {
    const params = new URLSearchParams();
    if (isEmbed()) params.set("embed", "1");
    params.set("id", id);
    location.href = "lmo-insight-detail.html?" + params.toString();
  }

  function stripHostedChrome() {
    if (window.parent === window) return;
    document.body.classList.add("lmo-hosted");
    document
      .querySelectorAll(
        "#screen-lmo-obs .topnav-outer, #screen-lmo-obs [data-bayaan-header]"
      )
      .forEach((el) => el.remove());
  }

  function stripEmbedChrome() {
    if (!isEmbed()) return;
    document.querySelectorAll(".sidebar-rail, .nav").forEach((el) => el.remove());
    document
      .querySelectorAll(
        "#screen-lmo-obs .topnav-outer, #screen-lmo-obs [data-bayaan-header]"
      )
      .forEach((el) => el.remove());
  }

  function initLmoSidenav() {
    if (!window.LMO_Sidenav) return;
    const mountEl = document.getElementById("lmo-sidenav-mount");
    if (!mountEl) return;
    const active =
      (document.body && document.body.dataset.lmoActive) ||
      LMO_Sidenav.inferActiveFromPath() ||
      "briefing";
    const mode =
      (document.body && document.body.dataset.lmoNavMode) || "page";
    const aiOnClick =
      document.body && document.body.dataset.lmoAiOnclick;
    LMO_Sidenav.mount({
      active,
      mode,
      aiOnClick: aiOnClick || undefined,
    });
  }

  function shouldShowSiteFooter() {
    return window.parent === window && !isEmbed();
  }

  function initLmoFooter() {
    if (!shouldShowSiteFooter()) return;

    function mountAndInit() {
      if (!window.initBayaanFooter) return;
      const wrap = document.querySelector("body.lmo .wrap");
      const screen = document.getElementById("screen-lmo-obs");
      const parent = wrap || screen;
      if (!parent || parent.querySelector("[data-bayaan-footer]")) return;

      const mount = document.createElement("div");
      mount.setAttribute("data-bayaan-footer", "");
      parent.appendChild(mount);
      initBayaanFooter();
    }

    if (window.initBayaanFooter) {
      mountAndInit();
    } else {
      const s = document.createElement("script");
      s.src = "../js/footer.js";
      s.onload = mountAndInit;
      document.head.appendChild(s);
    }
  }

  function initLmoEmbed() {
    stripHostedChrome();
    if (isEmbed()) {
      document.documentElement.classList.add("lmo-embed");
      document.body.classList.add("embed");
      stripEmbedChrome();
    }
    initLmoSidenav();
    initLmoNav();
    initLmoBreadcrumb();
    initLmoFooter();
  }

  function escAttr(s) {
    return String(s ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, "&quot;");
  }

  function AIB(ctx, title) {
    return `<button type="button" class="ai-btn" title="Ask Bayaan AI" aria-label="Ask Bayaan AI" onclick="event.stopPropagation();openChat('${escAttr(ctx)}','${escAttr(title)}')"><i class="ti ti-sparkles" aria-hidden="true"></i></button>`;
  }

  function initDgCarousel(carousel) {
    const track = carousel.querySelector(".dg-track");
    const nav = carousel.querySelector(".dg-carousel-nav");
    if (!track || !nav) return;
    const dotsWrap = nav.querySelector(".home-carousel-dots");
    const arrows = nav.querySelectorAll(".home-carousel-arrow");
    if (!dotsWrap || arrows.length < 2) return;

    const gap = () =>
      parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 14;
    const step = () => {
      const first = track.firstElementChild;
      return first ? first.offsetWidth + gap() : track.clientWidth;
    };
    const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
    const pageCount = () => {
      const ms = maxScroll();
      return ms <= 2 ? 1 : Math.ceil(ms / step()) + 1;
    };
    const currentPage = () => {
      const s = step();
      return s <= 0 ? 0 : Math.round(track.scrollLeft / s);
    };

    function sync() {
      const pages = pageCount();
      const page = Math.min(currentPage(), pages - 1);
      nav.classList.toggle("is-single", pages <= 1);
      const dots = dotsWrap.querySelectorAll(".home-carousel-dot");
      if (dots.length !== pages) {
        dotsWrap.innerHTML = Array.from(
          { length: pages },
          (_, i) =>
            `<button type="button" class="home-carousel-dot${i === page ? " active" : ""}" aria-label="Go to page ${i + 1}"></button>`
        ).join("");
        dotsWrap.querySelectorAll(".home-carousel-dot").forEach((dot, i) =>
          dot.addEventListener("click", () => goTo(i))
        );
      } else {
        dots.forEach((dot, i) => dot.classList.toggle("active", i === page));
      }
      const ms = maxScroll();
      arrows[0].disabled = track.scrollLeft <= 2;
      arrows[1].disabled = ms <= 2 || track.scrollLeft >= ms - 2;
    }

    function goTo(i) {
      const pages = pageCount();
      const page = Math.max(0, Math.min(i, pages - 1));
      track.scrollTo({
        left: Math.min(page * step(), maxScroll()),
        behavior: "smooth",
      });
      requestAnimationFrame(sync);
    }

    arrows[0].addEventListener("click", () => goTo(currentPage() - 1));
    arrows[1].addEventListener("click", () => goTo(currentPage() + 1));
    let tick = 0;
    track.addEventListener(
      "scroll",
      () => {
        if (tick) return;
        tick = requestAnimationFrame(() => {
          tick = 0;
          sync();
        });
      },
      { passive: true }
    );
    carousel._sync = sync;
    sync();
  }

  window.escAttr = escAttr;
  window.AIB = AIB;

  window.LMO = {
    isEmbed,
    initLmoEmbed,
    initLmoBreadcrumb,
    initDgCarousel,
    reportEmbedHeight,
    notifyEmbedHeight,
    lmoGoHome,
    lmoGoObservatory,
    goToObserve,
    goToIndicator,
    goToInsight,
    isDarkTheme: isLmoDarkTheme,
    chartAxes: lmoChartAxes,
    chartJsScales: lmoChartJsScales,
    chartJsTooltip: lmoChartJsTooltip,
    onThemeChange: onLmoThemeChange,
  };
})();
