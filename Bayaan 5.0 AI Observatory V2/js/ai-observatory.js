/* AI Observatory — shared interaction helpers for the six review
   prototypes (ai-overview-a/b/c.html, ai-interpret-a/b/c.html).
   No framework, mirrors the vanilla-JS + localStorage conventions the
   rest of the app uses (see census-*.html's inline onclick handlers). */
(function () {
  "use strict";

  function toast(msg) {
    var el = document.getElementById("aiobsToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "aiobsToast";
      el.className = "aiobs-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(el._t);
    el._t = setTimeout(function () {
      el.classList.remove("is-visible");
    }, 2400);
  }

  function askAI(question) {
    toast("Bayaan AI: “" + question + "” — coming soon in this preview");
  }

  var activeGlanceInfo = null;

  function getGlanceInfoPop(wrap) {
    return wrap._glancePopEl || wrap.querySelector(".aiobs-info-pop");
  }

  function positionFloatingInfoPop(btn, pop) {
    var pad = 12;
    var gap = 8;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    pop.style.left = "0";
    pop.style.top = "0";
    pop.style.visibility = "hidden";

    var popW = pop.offsetWidth;
    var popH = pop.offsetHeight;
    var btnRect = btn.getBoundingClientRect();
    var left = btnRect.right - popW;

    if (left < pad) left = pad;
    if (left + popW > vw - pad) left = Math.max(pad, vw - pad - popW);

    var top = btnRect.bottom + gap;
    if (top + popH > vh - pad) top = btnRect.top - gap - popH;
    if (top < pad) top = pad;

    pop.style.left = Math.round(left) + "px";
    pop.style.top = Math.round(top) + "px";
    pop.style.visibility = "";
  }

  function showGlanceInfoPop(wrap) {
    var pop = getGlanceInfoPop(wrap);
    var btn = wrap.querySelector(".aiobs-info-btn");
    if (!pop || !btn) return;

    if (activeGlanceInfo && activeGlanceInfo !== wrap) {
      hideGlanceInfoPop(activeGlanceInfo);
    }

    if (!pop._glancePlaceholder) {
      pop._glancePlaceholder = document.createComment("aiobs-info-pop");
      wrap.insertBefore(pop._glancePlaceholder, pop);
    }
    if (pop.parentNode !== document.body) {
      document.body.appendChild(pop);
    }
    pop.setAttribute("role", "tooltip");

    wrap._glancePopEl = pop;
    pop.classList.add("aiobs-info-pop--floating");
    positionFloatingInfoPop(btn, pop);
    requestAnimationFrame(function () {
      pop.classList.add("is-visible");
    });
    activeGlanceInfo = wrap;
  }

  function hideGlanceInfoPop(wrap) {
    if (!wrap || wrap.classList.contains("is-open")) return;

    var pop = wrap._glancePopEl || wrap.querySelector(".aiobs-info-pop");
    if (!pop) return;

    pop.classList.remove("is-visible");
    pop.classList.remove("aiobs-info-pop--floating");
    pop.style.left = "";
    pop.style.top = "";
    pop.style.visibility = "";

    if (pop._glancePlaceholder && pop._glancePlaceholder.parentNode) {
      pop._glancePlaceholder.parentNode.insertBefore(pop, pop._glancePlaceholder);
      pop._glancePlaceholder.remove();
      pop._glancePlaceholder = null;
    }

    delete wrap._glancePopEl;
    if (activeGlanceInfo === wrap) activeGlanceInfo = null;
  }

  function repositionVisibleGlanceInfoPops() {
    document.querySelectorAll(".aiobs-glancecard .aiobs-info").forEach(function (wrap) {
      var pop = wrap._glancePopEl;
      if (!pop || !pop.classList.contains("is-visible")) return;
      var btn = wrap.querySelector(".aiobs-info-btn");
      if (btn) positionFloatingInfoPop(btn, pop);
    });
  }

  function initGlanceInfoPops() {
    var wraps = document.querySelectorAll(".aiobs-glancecard .aiobs-info");
    if (!wraps.length) return;

    wraps.forEach(function (wrap) {
      wrap.addEventListener("mouseenter", function () {
        showGlanceInfoPop(wrap);
      });
      wrap.addEventListener("mouseleave", function () {
        hideGlanceInfoPop(wrap);
      });
      wrap.addEventListener("focusin", function () {
        showGlanceInfoPop(wrap);
      });
      wrap.addEventListener("focusout", function (e) {
        if (!wrap.contains(e.relatedTarget)) hideGlanceInfoPop(wrap);
      });
    });

    window.addEventListener("scroll", repositionVisibleGlanceInfoPops, true);
    window.addEventListener("resize", repositionVisibleGlanceInfoPops);
  }

  function toggleInfo(btn) {
    var wrap = btn.closest(".aiobs-info");
    if (!wrap) return;
    var wasOpen = wrap.classList.contains("is-open");
    var isGlance = !!wrap.closest(".aiobs-glancecard");

    document.querySelectorAll(".aiobs-info.is-open").forEach(function (n) {
      n.classList.remove("is-open");
      if (n.closest(".aiobs-glancecard")) hideGlanceInfoPop(n);
    });

    if (!wasOpen) {
      wrap.classList.add("is-open");
      if (isGlance) showGlanceInfoPop(wrap);
    } else if (isGlance) {
      hideGlanceInfoPop(wrap);
    }
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".aiobs-info")) {
      document.querySelectorAll(".aiobs-info.is-open").forEach(function (n) {
        n.classList.remove("is-open");
        if (n.closest(".aiobs-glancecard")) hideGlanceInfoPop(n);
      });
    }
  });

  // Scroll-reveal for the editorial/story layouts (Overview C, Interpret A).
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach(function (n) { io.observe(n); });
  }

  // KPI count-up — a restrained, one-time 0→value animation for
  // [data-countup] figures (Overview's "AI at a Glance" cards). Skipped
  // entirely under prefers-reduced-motion (the server-rendered final
  // value is already correct static text, so doing nothing is the
  // correct fallback). Never re-triggers, and never runs on a loop —
  // these are statistical figures, not live counters.
  function initKpiCountUp() {
    var els = document.querySelectorAll("[data-countup]");
    if (!els.length) return;
    var reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          animateCountUp(en.target);
        });
      },
      { threshold: 0.4 }
    );
    els.forEach(function (n) { io.observe(n); });
  }

  function animateCountUp(el) {
    var raw = el.textContent.trim();
    var match = raw.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    var end = parseFloat(match[1]);
    var suffix = match[2] || "";
    var decimals = (match[1].split(".")[1] || "").length;
    var duration = 700;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (end * eased).toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = end.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  // Chapter rail: highlights the nearest [data-chapter] section and
  // supports click-to-scroll from [data-chapter-link].
  function initChapterRail() {
    var links = document.querySelectorAll("[data-chapter-link]");
    var sections = document.querySelectorAll("[data-chapter]");
    if (!links.length || !sections.length) return;

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.querySelector(
          '[data-chapter="' + link.getAttribute("data-chapter-link") + '"]'
        );
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var id = en.target.getAttribute("data-chapter");
            links.forEach(function (l) {
              l.classList.toggle("active", l.getAttribute("data-chapter-link") === id);
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach(function (s) { io.observe(s); });
  }

  // Domain tabs (Interpret's People & Skills / Economic / Infrastructure
  // split): toggles [data-domain-panel] visibility from [data-domain-tab]
  // clicks, keeps a page-supplied window.AIOBS_DOMAIN_OBSERVE_LINKS map in
  // sync on any [data-domain-observe-link] element, and resolves an
  // incoming #chapter-id hash to its owning domain via an optional
  // window.AIOBS_HASH_DOMAIN_MAP so cross-page deep links (e.g. from
  // ai-themes.html) land on a visible section, not a hidden one.
  function initDomainTabs() {
    var tabs = document.querySelectorAll("[data-domain-tab]");
    var panels = document.querySelectorAll("[data-domain-panel]");
    if (!tabs.length || !panels.length) return;

    function activate(domain, opts) {
      opts = opts || {};
      tabs.forEach(function (t) {
        var active = t.getAttribute("data-domain-tab") === domain;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach(function (p) {
        p.hidden = p.getAttribute("data-domain-panel") !== domain;
      });
      var linkMap = window.AIOBS_DOMAIN_OBSERVE_LINKS;
      if (linkMap && linkMap[domain]) {
        document.querySelectorAll("[data-domain-observe-link]").forEach(function (a) {
          a.setAttribute("href", linkMap[domain]);
        });
      }
      document.querySelectorAll("[data-domain-pathway]").forEach(function (el) {
        el.classList.toggle("is-active", el.getAttribute("data-domain-pathway") === domain);
      });
      if (opts.scrollToId) {
        var el = document.getElementById(opts.scrollToId);
        if (el) {
          window.requestAnimationFrame(function () {
            el.scrollIntoView({ behavior: opts.smooth === false ? "auto" : "smooth", block: "start" });
          });
        }
      } else if (opts.scrollTop) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    }

    var validDomains = { economic: true, people: true, infra: true };

    function setDomainParam(domain) {
      if (!validDomains[domain]) return;
      try {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", window.location.pathname + "?domain=" + domain);
        }
      } catch (e) {}
    }

    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        if (t.classList.contains("active")) return;
        var domain = t.getAttribute("data-domain-tab");
        activate(domain, { scrollTop: true });
        setDomainParam(domain);
      });
    });

    var hash = (window.location.hash || "").replace("#", "");
    var hashMap = window.AIOBS_HASH_DOMAIN_MAP;
    var domainParam = null;
    try {
      domainParam = new URLSearchParams(window.location.search).get("domain");
    } catch (e) {}
    if (hash && hashMap && hashMap[hash]) {
      // Strip the hash immediately: the target section is hidden at parse
      // time (it's inside a non-default domain panel), so the browser's
      // own fragment-scroll either no-ops or — worse — silently re-fires
      // later once the panel is unhidden and has a real layout box
      // (observed on window "load"), landing well past the target. Owning
      // the scroll entirely in JS avoids that double-scroll.
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      activate(hashMap[hash], { scrollToId: hash, smooth: false });
      setDomainParam(hashMap[hash]);
    } else if (domainParam && validDomains[domainParam]) {
      activate(domainParam, { scrollTop: true });
    }

    window.AIObsDomainTabs = { activate: activate };
  }

  // "What stands out" filter chips (Interpret C).
  function initFilters() {
    var chips = document.querySelectorAll("[data-filter-chip]");
    var cards = document.querySelectorAll("[data-filter-cat]");
    if (!chips.length || !cards.length) return;
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        var cat = chip.getAttribute("data-filter-chip");
        cards.forEach(function (card) {
          var match = cat === "all" || card.getAttribute("data-filter-cat") === cat;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  // Panel section headers: audio brief + Ask Bayaan AI (index Executive Brief order).
  var PANEL_BRIEF_SPEECH_HTML =
    '<div class="brief-speech">' +
      '<button class="brief-listen" type="button" data-state="idle" aria-label="Listen to this section brief" aria-pressed="false">' +
        '<span class="brief-listen__icon" aria-hidden="true">' +
          '<svg class="brief-listen__speaker" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<path d="M9 4L9 20" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M15 4L15 20" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M20 8L20 16" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M4 8L4 16" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>' +
          '</svg>' +
          '<i class="ti ti-player-play brief-listen__play"></i>' +
          '<i class="ti ti-player-pause brief-listen__pause"></i>' +
        '</span>' +
        '<span class="brief-listen__copy">' +
          '<span class="brief-listen__wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
          '<span class="brief-listen__text">Audio brief</span>' +
        '</span>' +
      '</button>' +
      '<span class="brief-speech__actions" aria-label="Playback options">' +
        '<button class="brief-audio-action brief-audio-action--restart" type="button" aria-label="Restart brief" title="Restart">' +
          '<i class="ti ti-refresh" aria-hidden="true"></i>' +
        '</button>' +
        '<button class="brief-audio-action brief-audio-action--stop" type="button" aria-label="Stop brief" title="Stop">' +
          '<span class="brief-stop-box" aria-hidden="true"></span>' +
        '</button>' +
      '</span>' +
    '</div>' +
    '<div class="brief-speech-status visually-hidden" role="status" aria-live="polite"></div>';

  function injectPanelBriefActions() {
    document.querySelectorAll(".aiobs-panel-hd, .itp-impact-hd").forEach(function (hd) {
      var askBtn = hd.querySelector(".aiobs-ask--icon");
      if (!askBtn || hd.querySelector(".aiobs-panel-actions")) return;
      var actions = document.createElement("div");
      actions.className = "aiobs-panel-actions";
      actions.innerHTML = PANEL_BRIEF_SPEECH_HTML;
      hd.insertBefore(actions, askBtn);
      actions.appendChild(askBtn);
      hd.classList.add("aiobs-panel-brief");
    });
  }

  // Audio brief: reuse the shared Census Executive Brief control
  function initAioBriefSpeech() {
    if (!window.initCensusExecBrief) return;
    document.querySelectorAll(".aiobs-execbrief, .aiobs-panel-brief").forEach(function (hero) {
      window.initCensusExecBrief(hero);
    });
  }

  window.AIObs = { toast: toast, askAI: askAI, toggleInfo: toggleInfo };

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initKpiCountUp();
    initChapterRail();
    initDomainTabs();
    initFilters();
    injectPanelBriefActions();
    initAioBriefSpeech();
    initGlanceInfoPops();
  });
})();
