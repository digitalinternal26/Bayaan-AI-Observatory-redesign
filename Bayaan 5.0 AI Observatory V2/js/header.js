/**
 * Shared Bayaan workspace header — topnav shell, nav items, profile menu.
 * Used across all ws-screen pages in index.html (injected via data-bayaan-header).
 */
(function () {
  const HOME_SCREEN_ID = "screen-home";
  const HEADER_FLUSH_MOD = "header-flush";

  const COMMON_TOPNAV_SCREENS = [
    HOME_SCREEN_ID,
    "screen-manage",
    "screen-editor",
    "screen-products",
    "screen-geo-view",
    "screen-govdata",
    "screen-indicator-detail",
    "screen-dashboard-view",
    "screen-topic",
    "screen-cpi-obs",
    "screen-cpi-dashboard",
    "screen-crisis-obs",
    "screen-lmo-obs",
    "screen-bayaan-search",
    "screen-operational-dashboards",
    "s-landing",
    "s-app",
  ];

  /** Nav order: Products, Geo View, Bayaan Space, Government Data Hub (Home reachable via logo) */
  const NAV_ITEMS = [
    {
      id: "products",
      label: "Products",
      icon: "ti-list",
      onclick: "openProducts(event)",
    },
    {
      id: "geo",
      label: "Spatial Analytics",
      icon: "ti-world",
      onclick: "openGeoView(event)",
    },
    {
      id: "bayaan-space",
      label: "Bayaan Space",
      icon: "ti-sparkles",
      onclick: "openBayaanSpace(event)",
      extraClass: "nav-link-studio",
    },
    {
      id: "govdata",
      label: "Government Data Hub",
      icon: "ti-building-bank",
      onclick: "window.location.href='bayaan-entity-zone-dxp-locked.html'; return false;",
    },
  ];

  const TOPNAV_ACTIVE_MAP = {
    [HOME_SCREEN_ID]: "home",
    "screen-products": "products",
    "screen-geo-view": "geo",
    "screen-govdata": "govdata",
    "screen-indicator-detail": "products",
    "screen-dashboard-view": "products",
    "screen-topic": "products",
    "screen-cpi-obs": "products",
    "screen-cpi-dashboard": "products",
    "screen-crisis-obs": "products",
    "screen-lmo-obs": "products",
    "bayaan-space": "bayaan-space",
    "s-landing": "",
    "s-app": "",
  };

  const LANG_KEY = "bayaan-lang";
  const DEFAULT_LANG = "en";

  let assetPrefix = "";

  function setAssetPrefix(prefix) {
    assetPrefix = prefix || "";
  }

  function assetUrl(path) {
    return assetPrefix + path;
  }

  const NOTIFICATIONS = [
    {
      id: "notif-cpi-alert",
      type: "alert",
      iconClass: "nav-notif-icon--red",
      icon: "ti-alert-triangle",
      cat: "Alert",
      catClass: "nav-notif-cat--alert",
      title: "CPI above 2.4% policy band — intervention needed",
      desc: "Headline inflation at 3.71% YoY; housing and food categories are the primary drivers requiring urgent policy response.",
      time: "2h ago",
      read: false,
    },
    {
      id: "notif-import-tax",
      type: "risk",
      iconClass: "nav-notif-icon--amber",
      icon: "ti-receipt-tax",
      cat: "Risk",
      catClass: "nav-notif-cat--risk",
      title: "Reduce import tax on essential commodities by 5%",
      desc: "Targeted reduction could ease food price pressure and bring headline inflation closer to the 2.4% policy target within two quarters.",
      time: "5h ago",
      read: false,
    },
    {
      id: "notif-emiratisation",
      type: "risk",
      iconClass: "nav-notif-icon--amber",
      icon: "ti-users",
      cat: "Risk",
      catClass: "nav-notif-cat--risk",
      title: "Accelerate Emiratisation in private sector services",
      desc: "Sector-specific hiring incentives and training pathways can close the 0.6pp gap against the annual Emiratisation target.",
      time: "Yesterday",
      read: true,
    },
    {
      id: "notif-non-oil-gdp",
      type: "opportunity",
      iconClass: "nav-notif-icon--green",
      icon: "ti-chart-pie",
      cat: "Opportunity",
      catClass: "nav-notif-cat--opportunity",
      title: "Non-oil GDP share reaches 56.3% — structural milestone",
      desc: "Abu Dhabi is #1 in GCC for non-oil diversification, +1.8pp YoY, reaching this milestone ahead of Vision 2030 targets.",
      time: "Yesterday",
      read: true,
    },
    {
      id: "notif-fdi",
      type: "opportunity",
      iconClass: "nav-notif-icon--green",
      icon: "ti-building-bank",
      cat: "Opportunity",
      catClass: "nav-notif-cat--opportunity",
      title: "FDI inflows at AED 47.88B — strongest Q1 in six years",
      desc: "+11.2% YoY; high USD rates expected to ease import costs and sustain FDI return expectations into Q2.",
      time: "3d ago",
      read: false,
    },
    {
      id: "notif-tvet",
      type: "key-action",
      iconClass: "nav-notif-icon--blue",
      icon: "ti-school",
      cat: "Key Action",
      catClass: "nav-notif-cat--key-action",
      title: "Expand TVET pathways aligned to non-oil growth sectors",
      desc: "Align technical education output with FDI inflows and non-oil GDP expansion to sustain the structural shift beyond 56% contribution.",
      time: "4d ago",
      read: false,
    },
    {
      id: "notif-lmo-report",
      type: "opportunity",
      iconClass: "nav-notif-icon--green",
      icon: "ti-report-analytics",
      cat: "Opportunity",
      catClass: "nav-notif-cat--opportunity",
      title: "Labour Market Observatory monthly brief published",
      desc: "March edition highlights services-sector hiring momentum and updated Emiratisation benchmarks across Abu Dhabi entities.",
      time: "1w ago",
      read: true,
    },
    {
      id: "notif-gdp-revision",
      type: "alert",
      iconClass: "nav-notif-icon--red",
      icon: "ti-trending-up",
      cat: "Alert",
      catClass: "nav-notif-cat--alert",
      title: "Q1 GDP flash estimate revised upward to 4.2%",
      desc: "Non-oil activity contributed 1.8pp of the revision; construction and financial services led the upside surprise.",
      time: "2w ago",
      read: true,
    },
  ];

  function getProfileLang() {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === "ar" ? "ar" : DEFAULT_LANG;
  }

  function applyProfileLang(lang) {
    const normalized = lang === "ar" ? "ar" : DEFAULT_LANG;
    const root = document.documentElement;
    root.lang = normalized === "ar" ? "ar" : "en";
    // root.dir = normalized === "ar" ? "rtl" : "ltr";
    localStorage.setItem(LANG_KEY, normalized);
  }

  function getProfileTheme() {
    return window.BayaanTheme?.getTheme?.() || "light";
  }

  const sessionReadNotificationIds = new Set(
    NOTIFICATIONS.filter((n) => n.read).map((n) => n.id),
  );

  function isNotificationRead(item) {
    return sessionReadNotificationIds.has(item.id);
  }

  function markNotificationRead(id) {
    sessionReadNotificationIds.add(id);
    syncNotificationPanels();
  }

  function markAllNotificationsRead() {
    NOTIFICATIONS.forEach((n) => sessionReadNotificationIds.add(n.id));
    syncNotificationPanels();
  }

  function getUnreadNotificationCount() {
    return NOTIFICATIONS.filter((n) => !isNotificationRead(n)).length;
  }

  function buildNotificationItemHTML(item) {
    const read = isNotificationRead(item);
    return `<button type="button" class="nav-notif-item${read ? " nav-notif-item--read" : ""}" data-notif-id="${item.id}" onclick="onNotificationExplore(event, '${item.id}')">
      <span class="nav-notif-icon ${item.iconClass}" aria-hidden="true"><i class="ti ${item.icon}"></i></span>
      <span class="nav-notif-title">${item.title}</span>
      <span class="nav-notif-time">${item.time}</span>
      ${read ? "" : '<span class="nav-notif-unread-dot" aria-hidden="true"></span>'}
    </button>`;
  }

  function buildNotificationsListHTML() {
    return NOTIFICATIONS.map(buildNotificationItemHTML).join("");
  }

  function syncNotificationBadge() {
    const count = getUnreadNotificationCount();
    document.querySelectorAll(".js-nav-notif-badge").forEach((badge) => {
      badge.textContent = count > 9 ? "9+" : String(count);
      badge.hidden = count === 0;
    });
  }

  function syncNotificationPanels() {
    document.querySelectorAll(".js-nav-notif-list").forEach((list) => {
      list.innerHTML = buildNotificationsListHTML();
    });
    syncNotificationBadge();
  }

  function buildProfileSegmentHTML(label, icon, groupLabel, options, optClass, dataAttr) {
    const buttons = options
      .map(
        (opt) =>
          `<button type="button" class="nav-profile-segment-btn ${optClass}" ${dataAttr}="${opt.value}" aria-pressed="false">${opt.label}</button>`,
      )
      .join("");
    return `<div class="nav-profile-menu-control">
      <span class="nav-profile-menu-control-label"><i class="ti ${icon}"></i> ${label}</span>
      <div class="nav-profile-segment" role="group" aria-label="${groupLabel}">${buttons}</div>
    </div>`;
  }

  function buildProfileMenuActionsHTML() {
    const themeSegment = buildProfileSegmentHTML(
      "Theme",
      "ti-moon",
      "Theme",
      [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
      ],
      "js-nav-theme-opt",
      "data-theme-opt",
    );
    const langSegment = buildProfileSegmentHTML(
      "Language",
      "ti-language",
      "Language",
      [
        { value: "en", label: "EN" },
        { value: "ar", label: "AR" },
      ],
      "js-nav-lang-opt",
      "data-lang-opt",
    );
    return `${themeSegment}
          ${langSegment}
          <button type="button" class="nav-profile-menu-item" role="menuitem" onclick="onProfileOperationalDashboards()">
            <i class="ti ti-layout-dashboard"></i> Bayaan admin space
          </button>
          <button type="button" class="nav-profile-menu-item" role="menuitem" onclick="onProfileUserPreferences()">
            <i class="ti ti-settings"></i> User preferences
          </button>
          <div class="nav-profile-menu-divider" aria-hidden="true"></div>
          <button type="button" class="nav-profile-menu-item nav-profile-menu-item--logout" role="menuitem" onclick="onProfileLogout()">
            <i class="ti ti-logout"></i> Log out
          </button>`;
  }

  function syncProfileMenuPrefs() {
    const theme = getProfileTheme();
    const lang = getProfileLang();
    document.querySelectorAll(".js-nav-theme-opt").forEach((btn) => {
      const active = btn.dataset.themeOpt === theme;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    document.querySelectorAll(".js-nav-lang-opt").forEach((btn) => {
      const active = btn.dataset.langOpt === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setProfileTheme(theme) {
    if (window.BayaanTheme?.setTheme) {
      window.BayaanTheme.setTheme(theme);
    }
    syncProfileMenuPrefs();
  }

  function setProfileLang(lang) {
    applyProfileLang(lang);
    syncProfileMenuPrefs();
  }

  function getActiveAiScreen() {
    const land = document.getElementById("s-landing");
    const app = document.getElementById("s-app");
    if (app?.classList.contains("active")) return app;
    if (land?.classList.contains("active")) return land;
    return null;
  }

  function getActiveScreenEl(selector) {
    const screen =
      document.querySelector(".ws-screen.active") ||
      (document.body.classList.contains("mode-ai") ? getActiveAiScreen() : null) ||
      document.querySelector(".screen.active");
    return (
      screen?.querySelector(selector) || document.querySelector(selector)
    );
  }

  function buildNavLinkHTML(item) {
    const cls = ["nav-link", item.extraClass].filter(Boolean).join(" ");
    const hrefAttr = item.href != null ? ` href="${item.href}"` : "";
    const iconAttr =
      item.id === "bayaan-space" ? ' aria-hidden="true"' : "";
    return `<a class="${cls}" data-nav="${item.id}"${hrefAttr} onclick="${item.onclick}" style="cursor:pointer;"><i class="ti ${item.icon}"${iconAttr}></i> ${item.label}</a>`;
  }

  function goHome(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (
      typeof goTo === "function" &&
      document.getElementById(HOME_SCREEN_ID)
    ) {
      goTo(HOME_SCREEN_ID);
      return;
    }
    window.location.href = assetUrl("index.html");
  }

  function openFavourites(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.location.href = assetUrl("favourites.html");
  }

  function getCommonTopnavInnerHTML() {
    const navLinks = NAV_ITEMS.map(buildNavLinkHTML).join("\n      ");
    const homeHref = assetUrl("index.html");
    return `<a class="nav-logo" href="${homeHref}" onclick="goHome(event); return false;" title="Home">
      <img src="${assetUrl("assets/bayaan-logo.svg")}" alt="Bayaan" class="logo-img logo-img--light">
      <img src="${assetUrl("assets/bayaan-logo-white.svg")}" alt="Bayaan" class="logo-img logo-img--dark">
    </a>
    <div class="nav-links">
      ${navLinks}
    </div>
    <div class="nav-right">
      <button type="button" class="nav-ws-chip nav-icon-btn js-nav-ws-chip" onclick="openWsDrp()" title="Switch workspace" aria-label="Switch workspace">
        <i class="ti ti-building" aria-hidden="true"></i>
        <i class="ti ti-chevron-down nav-ws-chevron" aria-hidden="true"></i>
      </button>
      <span class="nav-right-divider" aria-hidden="true"></span>
      <span class="nav-search-reveal">
        <button type="button" class="nav-search-btn" title="Search" onclick="onHeaderSearchClick()"><img src="${assetUrl("assets/ai-search-icon.svg")}" alt="Search"></button>
      </span>
      <span class="nav-right-divider" aria-hidden="true"></span>
      <div class="nav-profile-wrap js-nav-profile-wrap">
        <button type="button" class="nav-avatar nav-profile-btn js-nav-profile-btn" onclick="toggleProfileMenu(event)" title="Profile" aria-haspopup="menu" aria-expanded="false">MM</button>
        <div class="nav-profile-menu js-nav-profile-menu" role="menu">
          <div class="nav-profile-menu-head">
            <div class="nav-profile-menu-user">
              <span class="nav-profile-menu-user-icon" aria-hidden="true"><i class="ti ti-user"></i></span>
              <div>
                <div class="nav-profile-menu-name">Muhammed</div>
                <div class="nav-profile-menu-role">Senior Data Analyst</div>
              </div>
            </div>
          </div>
          <div class="nav-profile-menu-divider" aria-hidden="true"></div>
          <div class="nav-profile-menu-actions">
            ${buildProfileMenuActionsHTML()}
          </div>
        </div>
      </div>
      <button type="button" class="nav-icon-btn nav-fav-btn js-nav-fav-btn" onclick="openFavourites(event)" title="Favourites" aria-label="Favourites">
        <i class="ti ti-bookmark" aria-hidden="true"></i>
      </button>
      <div class="nav-notif-wrap js-nav-notif-wrap">
        <button type="button" class="nav-icon-btn nav-notif-btn js-nav-notif-btn" onclick="toggleNotificationsMenu(event)" title="Notifications" aria-haspopup="true" aria-expanded="false">
          <i class="ti ti-bell" aria-hidden="true"></i>
          <span class="nav-notif-badge js-nav-notif-badge" hidden>0</span>
        </button>
        <div class="nav-notif-panel js-nav-notif-panel" role="dialog" aria-label="Notifications">
          <div class="nav-notif-panel-head">
            <span class="nav-notif-panel-title"><i class="ti ti-bell" aria-hidden="true"></i> Notifications</span>
            <button type="button" class="nav-notif-mark-all js-nav-notif-mark-all" onclick="markAllNotificationsRead()">Mark all read</button>
          </div>
          <div class="nav-notif-list js-nav-notif-list">${buildNotificationsListHTML()}</div>
        </div>
      </div>
    </div>`;
  }

  function getScreenHeaderShellHTML() {
    return `<div class="topnav-outer">
  <div class="container">
    <nav class="topnav" aria-label="Main navigation"></nav>
  </div>
</div>`;
  }

  function getScreenHeaderRoot(screenId) {
    const screen = document.getElementById(screenId);
    if (!screen) return null;
    if (screenId === "screen-indicator-detail") {
      return screen.querySelector(".ind-root") || screen;
    }
    if (screenId === "s-app" || screenId === "s-landing") {
      return screen;
    }
    return screen;
  }

  function getScreenTopnavOuter(screenId) {
    const root = getScreenHeaderRoot(screenId);
    return root
      ? root.querySelector(":scope > .topnav-outer") ||
          root.querySelector(".topnav-outer")
      : null;
  }

  function getScreenTopnav(screenId) {
    const root = getScreenHeaderRoot(screenId);
    if (!root) return null;
    return (
      root.querySelector(".topnav-outer .topnav") ||
      root.querySelector(":scope > .topnav") ||
      root.querySelector(".topnav")
    );
  }

  function ensureScreenHeader(screenId) {
    const root = getScreenHeaderRoot(screenId);
    if (!root || root.querySelector(".topnav-outer")) return;

    const placeholder = root.querySelector(":scope > [data-bayaan-header]");
    if (placeholder) {
      placeholder.outerHTML = getScreenHeaderShellHTML();
      return;
    }

    const nav =
      root.querySelector(":scope > .topnav") || root.querySelector(".topnav");
    if (!nav) return;
    const outer = document.createElement("div");
    outer.className = "topnav-outer";
    const container = document.createElement("div");
    container.className = "container";
    nav.parentNode.insertBefore(outer, nav);
    outer.appendChild(container);
    container.appendChild(nav);
    if (!nav.getAttribute("aria-label")) {
      nav.setAttribute("aria-label", "Main navigation");
    }
  }

  function applyHeaderLayout(screenId) {
    if (screenId === "s-app" || screenId === "s-landing") return;
    document.getElementById(screenId)?.classList.add(HEADER_FLUSH_MOD);
  }

  function initScreenHeader(screenId) {
    ensureScreenHeader(screenId);
    applyHeaderLayout(screenId);
    const nav = getScreenTopnav(screenId);
    if (nav) nav.innerHTML = getCommonTopnavInnerHTML();
  }

  function initCommonTopnav() {
    COMMON_TOPNAV_SCREENS.forEach(initScreenHeader);
    syncProfileMenuPrefs();
    syncNotificationPanels();
  }

  function syncTopnavActive(screenId) {
    const active = TOPNAV_ACTIVE_MAP[screenId] || "";
    document.querySelectorAll(".topnav .nav-link[data-nav]").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === active);
    });
  }

  function toggleProfileMenu(e) {
    e.stopPropagation();
    closeNotificationsMenu();
    const wrap = getActiveScreenEl(".js-nav-profile-wrap");
    const btn = wrap?.querySelector(".js-nav-profile-btn");
    if (!wrap) return;
    const open = !wrap.classList.contains("open");
    document
      .querySelectorAll(".js-nav-profile-wrap.open")
      .forEach((el) => el.classList.remove("open"));
    wrap.classList.toggle("open", open);
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) syncProfileMenuPrefs();
  }

  function toggleNotificationsMenu(e) {
    e.stopPropagation();
    closeProfileMenu();
    const wrap = getActiveScreenEl(".js-nav-notif-wrap");
    const btn = wrap?.querySelector(".js-nav-notif-btn");
    if (!wrap) return;
    const open = !wrap.classList.contains("open");
    document
      .querySelectorAll(".js-nav-notif-wrap.open")
      .forEach((el) => el.classList.remove("open"));
    wrap.classList.toggle("open", open);
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) syncNotificationPanels();
  }

  function closeNotificationsMenu() {
    document
      .querySelectorAll(".js-nav-notif-wrap.open")
      .forEach((el) => el.classList.remove("open"));
    document
      .querySelectorAll(".js-nav-notif-btn")
      .forEach((btn) => btn.setAttribute("aria-expanded", "false"));
  }

  function onNotificationExplore(e, id) {
    e.stopPropagation();
    markNotificationRead(id);
    closeNotificationsMenu();
    if (typeof goTo === "function") {
      goTo("screen-home");
    }
  }

  function closeProfileMenu() {
    document
      .querySelectorAll(".js-nav-profile-wrap.open")
      .forEach((el) => el.classList.remove("open"));
    document
      .querySelectorAll(".js-nav-profile-btn")
      .forEach((btn) => btn.setAttribute("aria-expanded", "false"));
  }

  function onProfileOperationalDashboards() {
    closeProfileMenu();
    window.location.href = assetUrl("operational-dashboards.html");
  }

  function onProfileUserPreferences() {
    closeProfileMenu();
    window.location.href = "bayaan-welcome-screen.html";
  }

  function onProfileLogout() {
    closeProfileMenu();
    if (typeof toast === "function") {
      toast("You have been logged out", "ti-logout");
    }
  }

  document.addEventListener("click", (e) => {
    const themeBtn = e.target.closest(".js-nav-theme-opt");
    if (themeBtn) {
      e.stopPropagation();
      setProfileTheme(themeBtn.dataset.themeOpt);
      return;
    }
    const langBtn = e.target.closest(".js-nav-lang-opt");
    if (langBtn) {
      e.stopPropagation();
      setProfileLang(langBtn.dataset.langOpt);
      return;
    }
    if (!e.target.closest(".js-nav-profile-wrap")) closeProfileMenu();
    if (!e.target.closest(".js-nav-notif-wrap")) closeNotificationsMenu();
  });

  window.addEventListener("bayaan-theme-change", syncProfileMenuPrefs);
  applyProfileLang(getProfileLang());

  window.COMMON_TOPNAV_SCREENS = COMMON_TOPNAV_SCREENS;
  window.goHome = goHome;
  window.openFavourites = openFavourites;
  window.getScreenHeaderRoot = getScreenHeaderRoot;
  window.getScreenTopnavOuter = getScreenTopnavOuter;
  window.getScreenTopnav = getScreenTopnav;
  window.initCommonTopnav = initCommonTopnav;
  window.syncTopnavActive = syncTopnavActive;
  window.toggleProfileMenu = toggleProfileMenu;
  window.closeProfileMenu = closeProfileMenu;
  window.toggleNotificationsMenu = toggleNotificationsMenu;
  window.closeNotificationsMenu = closeNotificationsMenu;
  window.markNotificationRead = markNotificationRead;
  window.markAllNotificationsRead = markAllNotificationsRead;
  window.onNotificationExplore = onNotificationExplore;
  window.onProfileOperationalDashboards = onProfileOperationalDashboards;
  window.onProfileUserPreferences = onProfileUserPreferences;
  window.onProfileLogout = onProfileLogout;
  window.setProfileTheme = setProfileTheme;
  window.setProfileLang = setProfileLang;
  window.BayaanHeader = {
    HOME_SCREEN_ID,
    HEADER_FLUSH_MOD,
    SCREENS: COMMON_TOPNAV_SCREENS,
    NAV_ITEMS,
    getShellHTML: getScreenHeaderShellHTML,
    getTopnavHTML: getCommonTopnavInnerHTML,
    ensureScreenHeader,
    applyHeaderLayout,
    initScreenHeader,
    init: initCommonTopnav,
    syncActive: syncTopnavActive,
    setAssetPrefix,
    assetUrl,
    openFavourites,
  };
})();
