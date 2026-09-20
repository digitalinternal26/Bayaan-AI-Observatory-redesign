/**
 * Shared header boot for the standalone ADDP map page (ADDP/ADDP.html).
 * Mirrors js/lmo-chrome.js: wires in the shared Bayaan topnav with
 * "Geo View" marked active, and points every other nav item back at the
 * matching screen in index.html.
 */
(function () {
  const SCREEN_ID = "screen-geo-view";
  const INDEX = "../index.html";

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
        // Already on the Geo View destination — leave header.js's default
        // onclick="openGeoView(event)" in place; openGeoView() below is a
        // no-op so the active item doesn't navigate anywhere.
      } else if (navId === "bayaan-space") {
        link.removeAttribute("href");
        link.setAttribute("onclick", "openBayaanSpace(event)");
      } else if (navId === "products") {
        link.setAttribute("href", INDEX + "?screen=screen-products");
        link.removeAttribute("onclick");
      } else if (navId === "govdata") {
        link.setAttribute("href", "../bayaan-entity-zone-dxp-locked.html");
        link.removeAttribute("onclick");
      }
    });
  }

  function bootAddpChrome() {
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

  function openWsDrp() {}

  function onHeaderSearchClick() {
    window.location.href = INDEX;
  }

  function toast() {}

  window.goTo = goTo;
  window.openGeoView = openGeoView;
  window.openBayaanSpace = openBayaanSpace;
  window.openProducts = openProducts;
  window.openWsDrp = openWsDrp;
  window.onHeaderSearchClick = onHeaderSearchClick;
  window.toast = toast;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAddpChrome);
  } else {
    bootAddpChrome();
  }
})();
