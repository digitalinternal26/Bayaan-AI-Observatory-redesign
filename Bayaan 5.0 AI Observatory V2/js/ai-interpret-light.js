/* AI Observatory — Interpret (light / Census-pattern direction).
   Vanilla JS: Ask Bayaan AI modal, accordion, chapter-nav scrollspy,
   filter chips (scroll-to-section), reveal-on-scroll. No backend. */
(function () {
  "use strict";

  // ── Ask Bayaan AI modal ──
  function ensureModal() {
    var bd = document.getElementById("liModalBackdrop");
    if (bd) return bd;
    bd = document.createElement("div");
    bd.id = "liModalBackdrop";
    bd.className = "li-modal-backdrop";
    bd.innerHTML =
      '<div class="li-modal" role="dialog" aria-modal="true" aria-label="Ask Bayaan AI">' +
      '<div class="li-modal-hd"><span class="li-modal-hd-ic"><i class="ti ti-sparkles"></i></span>' +
      '<div><b>Bayaan AI</b><span>AI Observatory assistant</span></div>' +
      '<button class="li-modal-close" type="button" aria-label="Close" data-li-modal-close><i class="ti ti-x"></i></button></div>' +
      '<div class="li-modal-body">' +
      '<p class="li-modal-q" id="liModalQ"></p>' +
      '<div class="li-modal-loading" id="liModalLoading"><span class="li-modal-dot"></span><span class="li-modal-dot"></span><span class="li-modal-dot"></span>&nbsp; Analysing the 2026 AI surveys…</div>' +
      '<p id="liModalAnswer" style="display:none;font-size:12.5px;line-height:1.65;color:var(--text-secondary);margin:0"></p>' +
      "</div></div>";
    document.body.appendChild(bd);
    bd.addEventListener("click", function (e) {
      if (e.target === bd || e.target.closest("[data-li-modal-close]")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
    return bd;
  }

  function closeModal() {
    var bd = document.getElementById("liModalBackdrop");
    if (bd) bd.classList.remove("is-open");
  }

  function askAI(question) {
    var bd = ensureModal();
    document.getElementById("liModalQ").textContent = "“" + question + "”";
    var loading = document.getElementById("liModalLoading");
    var answer = document.getElementById("liModalAnswer");
    loading.style.display = "flex";
    answer.style.display = "none";
    bd.classList.add("is-open");
    setTimeout(function () {
      loading.style.display = "none";
      answer.style.display = "block";
      answer.textContent =
        "This preview doesn't call a live model yet — in the full build, Bayaan AI answers this directly from the 2026 SCAD Enterprise & Individual AI Adoption Survey data, with the source indicator and definition attached.";
    }, 900);
  }

  function comingSoon(name) {
    toast(name + " — part of the next Observatory phase");
  }

  function toast(msg) {
    var el = document.getElementById("liToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "liToast";
      el.className = "gd-toast";
      el.style.cssText = "position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(12px);background:#0f172a;color:#fff;font-size:13px;font-weight:500;padding:11px 20px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.22);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:999;max-width:420px;text-align:center;";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(el._t);
    el._t = setTimeout(function () {
      el.style.opacity = "0";
      el.style.transform = "translateX(-50%) translateY(12px)";
    }, 2400);
  }

  // ── Accordion ──
  function initAccordion() {
    document.querySelectorAll("[data-li-acc-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.closest(".li-acc-item").classList.toggle("is-open");
      });
    });
  }

  // ── Filter chips: scroll to section, toggle active ──
  function initChips() {
    document.querySelectorAll("[data-li-chip]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll("[data-li-chip]").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        var target = chip.getAttribute("data-li-chip");
        if (target && target !== "all") {
          var el = document.querySelector('[data-li-section="' + target + '"]');
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  // ── Chapter scrollspy ──
  function initChapNav() {
    var links = document.querySelectorAll("[data-li-navlink]");
    var chapters = document.querySelectorAll("[data-li-chapter]");
    if (!links.length || !chapters.length) return;
    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.querySelector('[data-li-chapter="' + link.getAttribute("data-li-navlink") + '"]');
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var id = en.target.getAttribute("data-li-chapter");
            links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("data-li-navlink") === id); });
          }
        });
      },
      { threshold: 0, rootMargin: "-20% 0px -70% 0px" }
    );
    chapters.forEach(function (c) { io.observe(c); });
  }

  // ── Reveal ──
  function initReveal() {
    var items = document.querySelectorAll("[data-li-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach(function (n) { io.observe(n); });
  }

  window.LI = { askAI: askAI, comingSoon: comingSoon, toast: toast };

  document.addEventListener("DOMContentLoaded", function () {
    initAccordion();
    initChips();
    initChapNav();
    initReveal();
  });
})();
