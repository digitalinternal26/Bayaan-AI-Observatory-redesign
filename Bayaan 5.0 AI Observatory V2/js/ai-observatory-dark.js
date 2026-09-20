/* AI Observatory — approved dark/gold direction. Shared interaction
   helpers for ai-overview.html and ai-interpret.html. Vanilla JS, no
   framework — consistent with the rest of the app. */
(function () {
  "use strict";

  function toast(msg) {
    var el = document.getElementById("gdToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "gdToast";
      el.className = "gd-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("is-visible"); }, 2600);
  }

  function askAI(question) {
    toast("Bayaan AI: “" + question + "” — coming soon in this preview");
  }

  function comingSoon(name) {
    toast(name + " — part of the next Observatory phase");
  }

  function toggleInfo(btn) {
    var wrap = btn.closest(".gd-info");
    if (!wrap) return;
    var wasOpen = wrap.classList.contains("is-open");
    document.querySelectorAll(".gd-info.is-open").forEach(function (n) { n.classList.remove("is-open"); });
    if (!wasOpen) wrap.classList.add("is-open");
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".gd-info")) {
      document.querySelectorAll(".gd-info.is-open").forEach(function (n) { n.classList.remove("is-open"); });
    }
  });

  // Sidebar collapse toggle.
  function initCollapse() {
    var btn = document.querySelector("[data-gd-collapse]");
    var sidebar = document.querySelector(".gd-sidebar");
    if (!btn || !sidebar) return;
    btn.addEventListener("click", function () {
      sidebar.classList.toggle("is-collapsed");
    });
  }

  // Hero story-nav: cycles quote/emphasis slides. Each slide element
  // carries data-hero-slide="N" — both the left-column statement and
  // the right-column quote for step N share the same N, so they must
  // be matched by value, not by their combined position in the NodeList
  // (two independent columns interleaved would otherwise only ever
  // activate one element total per show() call).
  function initHero() {
    var dots = document.querySelectorAll("[data-hero-dot]");
    var slides = document.querySelectorAll("[data-hero-slide]");
    if (!dots.length || !slides.length) return;
    var count = dots.length;
    var idx = 0;
    var timer;

    function show(i) {
      idx = (i + count) % count;
      slides.forEach(function (s) {
        s.classList.toggle("active", Number(s.getAttribute("data-hero-slide")) === idx);
      });
      dots.forEach(function (d, n) { d.classList.toggle("active", n === idx); });
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { show(idx + 1); }, 7000);
    }

    dots.forEach(function (d, n) {
      d.addEventListener("click", function () { show(n); restart(); });
    });
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    if (prev) prev.addEventListener("click", function () { show(idx - 1); restart(); });
    if (next) next.addEventListener("click", function () { show(idx + 1); restart(); });

    show(0);
    restart();
  }

  // Scroll reveal.
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  // Story chapter rail (Interpret).
  function initChapterRail() {
    var dots = document.querySelectorAll("[data-story-dot]");
    var chapters = document.querySelectorAll("[data-chapter]");
    if (!dots.length || !chapters.length) return;
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var target = document.querySelector('[data-chapter="' + dot.getAttribute("data-story-dot") + '"]');
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.getAttribute("data-chapter");
          dots.forEach(function (d) { d.classList.toggle("active", d.getAttribute("data-story-dot") === id); });
        }
      });
    }, { threshold: 0.5 });
    chapters.forEach(function (c) { io.observe(c); });
  }

  window.GDObs = { toast: toast, askAI: askAI, comingSoon: comingSoon, toggleInfo: toggleInfo };

  document.addEventListener("DOMContentLoaded", function () {
    initCollapse();
    initHero();
    initReveal();
    initChapterRail();
  });
})();
