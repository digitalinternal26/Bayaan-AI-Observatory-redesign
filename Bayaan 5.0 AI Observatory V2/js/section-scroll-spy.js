/**
 * Shared section scrollspy + dot navigation (ported from home page).
 */
(function (global) {
  "use strict";

  const DEFAULT_CONFIG = {
    anchorRatio: 0.32,
    topThreshold: 24,
    bottomThreshold: 24,
    scrollOffset: 28,
    sameRowTolerance: 16,
    heroId: null,
  };

  function escHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isPageScrollRoot(root) {
    if (!root) return true;
    return (
      root === document.body ||
      root === document.documentElement ||
      root === document.scrollingElement
    );
  }

  function resolveScrollRoot(rootInput) {
    if (typeof rootInput === "string") {
      const el = document.querySelector(rootInput);
      return el || document.scrollingElement || document.documentElement;
    }
    if (rootInput && !isPageScrollRoot(rootInput)) return rootInput;
    return document.scrollingElement || document.documentElement;
  }

  function getScrollTop(root) {
    if (isPageScrollRoot(root)) return window.scrollY || document.documentElement.scrollTop || 0;
    return root.scrollTop || 0;
  }

  function getScrollMetrics(root) {
    if (isPageScrollRoot(root)) {
      return {
        scrollTop: getScrollTop(root),
        clientHeight: window.innerHeight,
        scrollHeight: Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        ),
        rootRect: { top: 0, height: window.innerHeight },
      };
    }
    return {
      scrollTop: root.scrollTop,
      clientHeight: root.clientHeight,
      scrollHeight: root.scrollHeight,
      rootRect: root.getBoundingClientRect(),
    };
  }

  function scrollRootTo(root, top, behavior = "smooth") {
    const nextTop = Math.max(0, top);
    if (isPageScrollRoot(root)) {
      window.scrollTo({ top: nextTop, behavior });
      return;
    }
    root.scrollTo({ top: nextTop, behavior });
  }

  function scrollSectionIntoRoot(root, el, offset = 0) {
    if (!root || !el) return;

    if (isPageScrollRoot(root)) {
      const top = window.scrollY + el.getBoundingClientRect().top - offset;
      scrollRootTo(root, top);
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const top = root.scrollTop + (elRect.top - rootRect.top) - offset;
    scrollRootTo(root, top);
  }

  function createSectionScrollSpy(config) {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    let root = null;
    let sections = [];
    let onActive = null;
    let scrollHandler = null;
    let usesWindowScroll = false;

    function resolveActiveId() {
      if (!sections.length || !root) return null;

      const { scrollTop, clientHeight, scrollHeight, rootRect } =
        getScrollMetrics(root);
      if (scrollTop < cfg.topThreshold) return sections[0].id;

      if (scrollTop + clientHeight >= scrollHeight - cfg.bottomThreshold) {
        return sections[sections.length - 1].id;
      }

      const anchorY = rootRect.top + rootRect.height * cfg.anchorRatio;
      let activeId = sections[0].id;
      let activeTop = null;

      sections.forEach((section) => {
        const rect = section.el.getBoundingClientRect();
        if (rect.top > anchorY + 4 || rect.bottom <= rootRect.top + 8) {
          return;
        }
        if (
          activeTop != null &&
          Math.abs(rect.top - activeTop) < cfg.sameRowTolerance
        ) {
          return;
        }
        activeId = section.id;
        activeTop = rect.top;
      });

      return activeId;
    }

    function sync() {
      const id = resolveActiveId();
      if (id != null) onActive?.(id);
    }

    function bind(nextRoot, nextSections, nextOnActive) {
      destroy();
      root = nextRoot;
      sections = nextSections;
      onActive = nextOnActive;
      if (!root || sections.length < 2) return;

      scrollHandler = () => sync();
      usesWindowScroll = isPageScrollRoot(root);
      if (usesWindowScroll) {
        window.addEventListener("scroll", scrollHandler, { passive: true });
      } else {
        root.addEventListener("scroll", scrollHandler, { passive: true });
      }
      sync();
    }

    function destroy() {
      if (scrollHandler) {
        if (usesWindowScroll) {
          window.removeEventListener("scroll", scrollHandler);
        } else if (root) {
          root.removeEventListener("scroll", scrollHandler);
        }
      }
      usesWindowScroll = false;
      scrollHandler = null;
      root = null;
      sections = [];
      onActive = null;
    }

    return { bind, destroy, sync };
  }

  /**
   * Mount dot navigation for a page.
   * @param {object} options
   * @param {string} options.navId - Element id of the nav container
   * @param {Element|string|null} options.root - Scroll container (Element or selector)
   * @param {Array<{id:string,label:string,el:Element}>} options.sections
   * @param {object} [options.config] - Spy config overrides
   * @param {string} [options.scrollFnName] - Global function name for onclick
   * @returns {{ destroy: Function, sync: Function, scrollTo: Function }}
   */
  function mountSectionDots(options) {
    const {
      navId,
      root: rootInput,
      sections = [],
      config = {},
      scrollFnName = "scrollToSectionDot",
    } = options;

    const nav = document.getElementById(navId);
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const spy = createSectionScrollSpy(cfg);

    const resolvedRoot = resolveScrollRoot(rootInput);

    const items = sections.filter((item) => item?.el && item?.id);

    function setActiveDot(id) {
      if (!nav) return;
      nav.querySelectorAll(".home-module-dots__item").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.moduleId === id);
      });
    }

    function scrollTo(id) {
      const section = items.find((item) => item.id === id);
      if (!section || !resolvedRoot) return;

      if (cfg.heroId && id === cfg.heroId) {
        resolvedRoot.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        scrollSectionIntoRoot(resolvedRoot, section.el, cfg.scrollOffset);
      }
      setActiveDot(id);
    }

    function render() {
      if (!nav) {
        return { destroy: () => spy.destroy(), sync: () => spy.sync(), scrollTo };
      }

      if (items.length < 2) {
        nav.hidden = true;
        nav.innerHTML = "";
        spy.destroy();
        return { destroy: () => spy.destroy(), sync: () => spy.sync(), scrollTo };
      }

      nav.hidden = false;
      nav.innerHTML = items
        .map(({ id, label }) => {
          const safeLabel = escHtml(label);
          const safeId = escHtml(id);
          return `<button type="button" class="home-module-dots__item" data-module-id="${safeId}" aria-label="${safeLabel}" onclick="${scrollFnName}('${safeId}')">
              <span class="home-module-dots__dot" aria-hidden="true"></span>
              <span class="home-module-dots__tip">${safeLabel}</span>
            </button>`;
        })
        .join("");

      spy.bind(resolvedRoot, items, setActiveDot);

      return {
        destroy: () => {
          spy.destroy();
          nav.hidden = true;
          nav.innerHTML = "";
        },
        sync: () => spy.sync(),
        scrollTo,
      };
    }

    const api = render();
    global[scrollFnName] = scrollTo;

    return api;
  }

  global.BayaanSectionScrollSpy = {
    DEFAULT_CONFIG,
    escHtml,
    isPageScrollRoot,
    resolveScrollRoot,
    scrollSectionIntoRoot,
    createSectionScrollSpy,
    mountSectionDots,
  };
})(typeof window !== "undefined" ? window : globalThis);
