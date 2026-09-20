/**
 * Shared header boot for standalone LMO pages (lmo/*.html).
 * Skips header when hosted inside index.html iframe or embed=1 sub-views.
 */
(function () {
  const SCREEN_ID = "screen-lmo-obs";
  const INDEX = "../index.html";

  function isHosted() {
    return window.parent !== window;
  }

  function isEmbed() {
    return new URLSearchParams(location.search).get("embed") === "1";
  }

  function shouldShowHeader() {
    return !isHosted() && !isEmbed();
  }

  function markHosted() {
    if (isHosted() && document.body) {
      document.body.classList.add("lmo-hosted");
    }
  }

  function wireStandaloneNav() {
    const nav = document.querySelector("#" + SCREEN_ID + " .topnav");
    if (!nav) return;

    const logo = nav.querySelector(".nav-logo");
    if (logo) {
      logo.setAttribute("href", INDEX);
      logo.setAttribute("onclick", "goHome(event); return false;");
    }

    nav.querySelectorAll(".nav-link[data-nav]").forEach(function (link) {
      const navId = link.dataset.nav;
      if (navId === "geo") {
        link.setAttribute("href", "../ADDP/ADDP.html");
        link.removeAttribute("onclick");
      } else if (navId === "bayaan-space") {
        link.removeAttribute("href");
        link.setAttribute("onclick", "openBayaanSpace(event)");
      } else if (navId === "products") {
        link.setAttribute("href", INDEX + "?screen=screen-products");
        link.removeAttribute("onclick");
      } else if (navId === "govdata") {
        link.setAttribute(
          "href",
          "../bayaan-entity-zone-dxp-locked.html"
        );
        link.removeAttribute("onclick");
      }
    });
  }

  function bootLmoChrome() {
    markHosted();

    if (!shouldShowHeader()) return;

    if (window.BayaanHeader) {
      BayaanHeader.setAssetPrefix("../");
      BayaanHeader.initScreenHeader(SCREEN_ID);
      BayaanHeader.syncActive(SCREEN_ID);
    }

    wireStandaloneNav();
  }

  function goTo() {}

  function openGeoView(e) {
    if (e) e.preventDefault();
    window.location.href = "../ADDP/ADDP.html";
  }

  function openBayaanSpace(e) {
    if (e) e.preventDefault();
    try {
      sessionStorage.setItem("bayaanOpenStudioGallery", "1");
    } catch (err) {}
    window.location.href = INDEX;
  }

  function openProducts(e) {
    if (e) e.preventDefault();
    window.location.href = INDEX + "?screen=screen-products";
  }

  function openObservatories(e) {
    if (e) e.preventDefault();
    window.location.href = INDEX + "?screen=screen-observatories";
  }

  function openWsDrp() {}

  function onHeaderSearchClick() {
    window.location.href = INDEX;
  }

  function toast() {}

  window.goTo = goTo;
  window.openGeoView = openGeoView;
  window.openBayaanSpace = openBayaanSpace;
  window.openProducts = openProducts;
  window.openObservatories = openObservatories;
  window.openWsDrp = openWsDrp;
  window.onHeaderSearchClick = onHeaderSearchClick;
  window.toast = toast;
  window.bootLmoChrome = bootLmoChrome;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootLmoChrome);
  } else {
    bootLmoChrome();
  }
})();
