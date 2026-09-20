/**
 * Shared helpers for standalone Government Data Hub entity-zone pages.
 */
(function () {
  function bootEntityZoneChrome() {
    if (window.initCommonTopnav) initCommonTopnav();
    if (window.BayaanHeader) BayaanHeader.syncActive("screen-govdata");
    var nav = document.querySelector("#screen-govdata .topnav");
    if (nav) {
      var logo = nav.querySelector(".nav-logo");
      if (logo) {
        logo.setAttribute("href", "index.html");
        logo.removeAttribute("onclick");
      }
      nav.querySelectorAll(".nav-link[data-nav]").forEach(function (link) {
        if (link.dataset.nav === "govdata") return;
        link.setAttribute(
          "href",
          link.dataset.nav === "geo" ? "ADDP/ADDP.html" : "index.html"
        );
        link.removeAttribute("onclick");
      });
    }
    if (window.initBayaanFooter) initBayaanFooter();
  }

  function openEntityZoneEmptyState() {
    window.location.href = "bayaan-entity-zone-empty-state.html";
  }

  function openGovDataHub() {
    window.location.href = "index.html?screen=screen-govdata";
  }

  function openBayaanSpace() {
    try {
      sessionStorage.setItem("bayaanOpenStudioGallery", "1");
    } catch (e) {}
    window.location.href = "index.html";
  }

  window.openEntityZoneEmptyState = openEntityZoneEmptyState;
  window.openGovDataHub = openGovDataHub;
  window.openBayaanSpace = openBayaanSpace;
  window.openWsDrp = window.openWsDrp || function () {};
  window.onHeaderSearchClick = window.onHeaderSearchClick || function () {
    window.location.href = "index.html";
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootEntityZoneChrome);
  } else {
    bootEntityZoneChrome();
  }
})();
