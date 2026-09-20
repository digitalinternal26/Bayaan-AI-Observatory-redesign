/* Shared "add to favourites" wiring for standalone pages (LMO, etc.) that
   render product/indicator cards with a static bookmark icon. Reads and
   writes the same "bayaanFavourites" localStorage snapshot that index.html
   and favourites.html already use (see FAVOURITES_STORAGE_KEY in index.html
   and js/favourites-page.js), so anything favourited here shows up on
   favourites.html and vice versa.

   Usage: give a bookmark icon `data-fav-toggle`, `data-fav-store` (one of
   indicators/dashboards/observatory/frequent), `data-fav-id` and the
   `data-fav-*` fields matching the favourites-page.js card renderer (name,
   val, unit, change, change-class, cat, cat-icon, ai, viz). This script
   handles the click, the localStorage read/write, the is-saved icon state,
   and a toast — nothing else needs to change on the page. */
(function () {
  "use strict";

  var STORAGE_KEY = "bayaanFavourites";
  var TABS = ["indicators", "dashboards", "observatory", "frequent"];

  function loadStore() {
    var store = { indicators: [], dashboards: [], observatory: [], frequent: [] };
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") {
        TABS.forEach(function (k) {
          store[k] = Array.isArray(saved[k]) ? saved[k] : [];
        });
      }
    } catch (e) {}
    return store;
  }

  function saveStore(store) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {}
  }

  function isSaved(storeKey, favId) {
    if (!favId) return false;
    var store = loadStore();
    return (store[storeKey] || []).some(function (it) {
      return it.favId === favId;
    });
  }

  function ensureToastContainer() {
    var el = document.getElementById("toast-container");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast-container";
      document.body.appendChild(el);
    }
    return el;
  }

  function showToast(icon, text) {
    var container = ensureToastContainer();
    var el = document.createElement("div");
    el.className = "toast";
    var i = document.createElement("i");
    i.className = "ti " + (icon || "ti-check");
    i.setAttribute("aria-hidden", "true");
    var span = document.createElement("span");
    span.textContent = text;
    el.appendChild(i);
    el.appendChild(span);
    container.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 2600);
  }

  function readItem(el) {
    var storeKey = el.getAttribute("data-fav-store") || "indicators";
    return {
      storeKey: storeKey,
      item: {
        favId: el.getAttribute("data-fav-id") || "",
        name: el.getAttribute("data-fav-name") || "",
        val: el.getAttribute("data-fav-val") || "",
        unit: el.getAttribute("data-fav-unit") || "",
        change: el.getAttribute("data-fav-change") || "",
        changeClass: el.getAttribute("data-fav-change-class") || "",
        cat: el.getAttribute("data-fav-cat") || "",
        catIcon: el.getAttribute("data-fav-cat-icon") || "",
        aiSummary: el.getAttribute("data-fav-ai") || "",
        vizType: el.getAttribute("data-fav-viz") || "",
      },
    };
  }

  function applyState(el, saved) {
    el.classList.toggle("is-saved", saved);
    el.setAttribute("title", saved ? "Remove from favourites" : "Save");
    el.setAttribute("aria-label", saved ? "Remove from favourites" : "Add to favourites");
    el.setAttribute("aria-pressed", saved ? "true" : "false");
  }

  function toggle(el) {
    if (!el) return;
    var parsed = readItem(el);
    var storeKey = parsed.storeKey;
    var favId = parsed.item.favId;
    if (!favId) return;
    var store = loadStore();
    var list = store[storeKey] || (store[storeKey] = []);
    var idx = list.findIndex(function (it) {
      return it.favId === favId;
    });
    if (idx > -1) {
      list.splice(idx, 1);
      saveStore(store);
      applyState(el, false);
      showToast("ti-bookmark", "Removed from My Favourites");
      return false;
    }
    list.push(parsed.item);
    saveStore(store);
    applyState(el, true);
    showToast("ti-bookmark", "Added to My Favourites");
    return true;
  }

  function wire(el) {
    if (!el || el.__favWired) return;
    el.__favWired = true;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    applyState(el, isSaved(el.getAttribute("data-fav-store") || "indicators", el.getAttribute("data-fav-id")));
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      toggle(el);
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        toggle(el);
      }
    });
  }

  function wireAll(root) {
    (root || document).querySelectorAll("[data-fav-toggle]").forEach(wire);
  }

  // Cards on these pages are rendered by page-specific scripts well after
  // this file loads (carousels, tab switches, search re-renders, etc.), so
  // rather than requiring every render call site to remember to re-wire, a
  // MutationObserver picks up any bookmark icon as soon as it lands in the
  // DOM — wiring is a no-op once `__favWired` is set.
  function observe() {
    var target = document.documentElement;
    if (!target || typeof MutationObserver === "undefined") return;
    var mo = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue;
          if (node.matches && node.matches("[data-fav-toggle]")) wire(node);
          if (node.querySelectorAll) wireAll(node);
        }
      }
    });
    mo.observe(target, { childList: true, subtree: true });
  }

  window.BayaanFav = {
    toggle: toggle,
    init: wireAll,
    isSaved: isSaved,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      wireAll(document);
      observe();
    });
  } else {
    wireAll(document);
    observe();
  }
})();
