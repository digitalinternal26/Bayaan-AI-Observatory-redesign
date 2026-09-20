/* ══════════════════════════════════════════════════════════════
   NEW REQUESTS — approval workspace for submitted artifacts
   ──────────────────────────────────────────────────────────────
   Queue of artifacts other users submitted for approval, plus the
   full-page review experience (preview, metadata, comments,
   activity, decision actions).

   Lifecycle:
     unassigned → in-review → approved   (published into Artifacts)
                            → returned   (creator revises)
                            → rejected

   State is in-memory, mirroring the ARTS array in index.html.
   Publishing goes through window.publishApprovedArtifact().
   ══════════════════════════════════════════════════════════════ */

(function (global) {
  "use strict";

  /* ── The signed-in approver. Matches the "MM" avatar rendered by
        js/header.js so the review reads as the same person. ── */
  var CURRENT_USER = { name: "Mariam Al Mansoori", initials: "MM" };

  var DAY = 86400000;
  function daysAgo(n) {
    return Date.now() - n * DAY;
  }

  /* ── Per-type icon/colour convention, identical to ARTS ─────── */
  var TYPE_STYLE = {
    report: { ico: "ti-file-analytics", bg: "#EEF0FF", co: "#4F63FF" },
    dashboard: { ico: "ti-layout-dashboard", bg: "#F0FDF4", co: "#10B981" },
    scenario: { ico: "ti-chart-arrows", bg: "#F5F3FF", co: "#7C3AED" },
    table: { ico: "ti-table", bg: "#EFF6FF", co: "#2563EB" },
    kpi: { ico: "ti-chart-line", bg: "#ECFDF5", co: "#059669" },
    dataset: { ico: "ti-database", bg: "#FFF1F2", co: "#EF4444" },
  };

  /* ── Status vocabulary ───────────────────────────────────────
        Colour modifiers map onto the .gd-action-status--* family. */
  var STATUS = {
    unassigned: { label: "Unassigned", cls: "art-tag--amber" },
    "in-review": { label: "In review", cls: "art-tag--blue" },
    mine: { label: "Needs your review", cls: "art-tag--blue" },
    returned: { label: "Returned", cls: "art-tag--orange" },
    approved: { label: "Approved", cls: "art-tag--green" },
    rejected: { label: "Rejected", cls: "art-tag--red" },
  };

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ── Reviewers assignable via "Assign to someone else" — the same
        cast of colleagues already surfaced as submitters/sharees. ── */
  var REVIEWERS = [
    { name: "Layla Al Ameri", initials: "LA" },
    { name: "Omar Al Shamsi", initials: "OS" },
    { name: "Yasmin Abdelrahman", initials: "YA" },
    { name: "Ahmad Nadheem", initials: "AN" },
    { name: "Khalid Al Dhaheri", initials: "KD" },
  ];

  /* ══ FIXTURE ═══════════════════════════════════════════════ */

  var REQUESTS = [
    {
      id: "req-01",
      type: "kpi",
      name: "Employee productivity (% of GDP at constant prices)",
      tags: ["Economy", "Productivity"],
      catIcon: "ti-trending-up",
      submittedBy: { name: "Ahmad Nadheem", initials: "AN" },
      submittedAt: daysAgo(3),
      entity: "Abu Dhabi Executive Office (ADEO)",
      asset: "Economy and Investment",
      product: "Environmental data",
      source: "SCAD National Accounts",
      refresh: "Quarterly",
      period: "Jan – Dec 2025",
      coverage: "Emirate of Abu Dhabi",
      summary:
        "Measures the economic output generated per employee, adjusted for inflation, as a percentage of GDP. Submitted for approval so it can be published to the Government Data Hub.",
      status: "unassigned",
      reviewer: null,
      sharedWith: [
        { name: "Yasmin Abdelrahman", initials: "YA" },
        { name: "Omar Al Shamsi", initials: "OS" },
        { name: "Layla Al Ameri", initials: "LA" },
      ],
      preview: {
        kind: "chart",
        chartType: "line",
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        series: [
          { name: "Total GDP", data: [21, 34, 41, 38, 46, 44, 52, 58, 74, 62, 68, 71] },
          { name: "Agriculture", data: [26, 39, 36, 30, 44, 38, 40, 43, 44, 47, 55, 61] },
          { name: "Industry", data: [58, 66, 44, 32, 40, 55, 47, 36, 44, 51, 46, 43] },
        ],
        note: "Preview of the submitted indicator — Industry, Agriculture and Total GDP series.",
      },
      comments: [
        {
          kind: "approval",
          text: "Submitted for approval by Ahmad Nadheem. Awaiting reviewer assignment.",
          time: "3 days ago",
        },
      ],
    },
    {
      id: "req-02",
      type: "kpi",
      name: "Consumer price index by main expenditure group",
      tags: ["Expenditure", "CPI"],
      catIcon: "ti-receipt",
      submittedBy: { name: "Layla Al Ameri", initials: "LA" },
      submittedAt: daysAgo(1),
      entity: "Abu Dhabi Executive Office (ADEO)",
      asset: "Expenditure",
      product: "Price statistics",
      source: "SCAD Price Statistics",
      refresh: "Monthly",
      period: "Feb 2026",
      coverage: "Emirate of Abu Dhabi",
      summary:
        "Tracks the change in the price of a fixed basket of consumer goods and services, broken down by the twelve main expenditure groups.",
      status: "in-review",
      reviewer: CURRENT_USER,
      sharedWith: [{ name: "Ahmad Nadheem", initials: "AN" }],
      preview: {
        kind: "chart",
        chartType: "bar",
        labels: ["Food", "Housing", "Transport", "Education", "Health", "Recreation"],
        series: [{ name: "YoY change (%)", data: [2.4, 1.1, 3.6, 0.8, 1.9, 2.2] }],
        note: "Year-on-year price change by expenditure group, Feb 2026.",
      },
      comments: [
        {
          kind: "approval",
          text: "Submitted for approval by Layla Al Ameri.",
          time: "1 day ago",
        },
        {
          kind: "comment",
          side: "left",
          author: "Layla Al Ameri",
          initials: "LA",
          text: "Housing weights were revised this cycle to match the 2025 household survey. Flagging it so the change is expected.",
          time: "1 day ago",
        },
      ],
    },
    {
      id: "req-03",
      type: "scenario",
      name: "Oil Price Shock Simulation",
      tags: ["Economy", "Forecast"],
      catIcon: "ti-trending-up",
      submittedBy: { name: "Omar Al Shamsi", initials: "OS" },
      submittedAt: daysAgo(6),
      entity: "Department of Economic Development",
      asset: "Economy and Investment",
      product: "Macro modelling",
      source: "Bayaan Scenario Engine",
      refresh: "On demand",
      period: "2026 – 2029",
      coverage: "Emirate of Abu Dhabi",
      summary:
        "Models the effect of a sustained 20% fall in Brent crude on real GDP, fiscal balance and non-oil employment over four quarters.",
      status: "unassigned",
      reviewer: null,
      sharedWith: [{ name: "Mariam Al Mansoori", initials: "MM" }],
      preview: {
        kind: "chart",
        chartType: "line",
        labels: ["Q1 26", "Q2 26", "Q3 26", "Q4 26", "Q1 27", "Q2 27"],
        series: [
          { name: "Baseline GDP", data: [3.8, 3.9, 3.7, 3.8, 3.9, 4.0] },
          { name: "Shock scenario", data: [3.8, 3.1, 2.4, 2.0, 2.3, 2.9] },
        ],
        note: "Real GDP growth, baseline against the 20% price-shock scenario.",
      },
      comments: [
        {
          kind: "approval",
          text: "Submitted for approval by Omar Al Shamsi.",
          time: "6 days ago",
        },
      ],
    },
    {
      id: "req-04",
      type: "table",
      name: "Non-oil balance of trade by sections of the HS",
      tags: ["Non-Oil Trade Products", "Trade"],
      catIcon: "ti-ship",
      submittedBy: { name: "Yasmin Abdelrahman", initials: "YA" },
      submittedAt: daysAgo(2),
      entity: "Abu Dhabi Executive Office (ADEO)",
      asset: "Non-Oil Trade Products",
      product: "Trade statistics",
      source: "Federal Customs Authority",
      refresh: "Quarterly",
      period: "Q4 2025",
      coverage: "Emirate of Abu Dhabi",
      summary:
        "Non-oil imports, exports and re-exports classified by Harmonised System section, with the resulting trade balance per section.",
      status: "in-review",
      reviewer: CURRENT_USER,
      sharedWith: [],
      preview: {
        kind: "table",
        columns: ["HS section", "Exports", "Imports", "Balance"],
        rows: [
          ["Machinery & electrical", "18.4", "31.2", "-12.8"],
          ["Base metals", "22.9", "9.7", "+13.2"],
          ["Chemicals", "14.1", "11.6", "+2.5"],
          ["Plastics & rubber", "8.7", "6.4", "+2.3"],
          ["Transport equipment", "5.2", "17.8", "-12.6"],
        ],
        note: "AED billions, Q4 2025. Five of twenty-one sections shown.",
      },
      comments: [
        {
          kind: "approval",
          text: "Submitted for approval by Yasmin Abdelrahman.",
          time: "2 days ago",
        },
      ],
    },
    {
      id: "req-05",
      type: "dashboard",
      name: "Water Transmission Availability Dashboard",
      tags: ["Water Transmission", "Infrastructure"],
      catIcon: "ti-droplet",
      submittedBy: { name: "Khalid Al Dhaheri", initials: "KD" },
      submittedAt: daysAgo(9),
      entity: "Department of Energy",
      asset: "Water Transmission",
      product: "Utilities data",
      source: "TRANSCO operational feed",
      refresh: "Daily",
      period: "Rolling 12 months",
      coverage: "Emirate of Abu Dhabi",
      summary:
        "Availability of the water transmission network, with outage duration and unserved demand by transmission zone.",
      status: "unassigned",
      reviewer: null,
      sharedWith: [
        { name: "Omar Al Shamsi", initials: "OS" },
        { name: "Layla Al Ameri", initials: "LA" },
      ],
      preview: {
        kind: "chart",
        chartType: "line",
        labels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
        series: [{ name: "Availability (%)", data: [98.2, 97.6, 98.9, 99.1, 98.4, 97.7] }],
        note: "Network availability, last six months.",
      },
      comments: [
        {
          kind: "approval",
          text: "Submitted for approval by Khalid Al Dhaheri.",
          time: "9 days ago",
        },
      ],
    },
    {
      id: "req-06",
      type: "report",
      name: "Emiratisation Analysis Report",
      tags: ["Labour", "Policy"],
      catIcon: "ti-users",
      submittedBy: { name: "Ahmad Nadheem", initials: "AN" },
      submittedAt: daysAgo(4),
      entity: "Abu Dhabi Executive Office (ADEO)",
      asset: "Labour Market",
      product: "Labour statistics",
      source: "Labour Market Observatory",
      refresh: "Quarterly",
      period: "Q1 2026",
      coverage: "Emirate of Abu Dhabi",
      summary:
        "Assesses progress against private-sector Emiratisation targets by firm size and sector, with a projection to the end of the target period.",
      status: "in-review",
      reviewer: CURRENT_USER,
      sharedWith: [{ name: "Yasmin Abdelrahman", initials: "YA" }],
      preview: {
        kind: "text",
        paragraphs: [
          "Private-sector Emiratisation reached <strong>6.2%</strong> of the skilled workforce in Q1 2026, up 0.9 points year on year and ahead of the interim 6.0% checkpoint.",
          "Firms with 50–199 employees account for most of the gain. Firms above 500 employees remain 1.4 points below their sector benchmark, concentrated in construction and logistics.",
          "On the current trajectory the end-of-period target is met in eleven of fourteen sectors. The report recommends targeted support for the remaining three.",
        ],
        note: "Report excerpt — three of eighteen sections.",
      },
      comments: [
        {
          kind: "approval",
          text: "Submitted for approval by Ahmad Nadheem.",
          time: "4 days ago",
        },
        {
          kind: "comment",
          side: "left",
          author: "Ahmad Nadheem",
          initials: "AN",
          text: "Section 4 uses the revised establishment register. Happy to walk through the methodology if that helps the review.",
          time: "4 days ago",
        },
        {
          kind: "comment",
          side: "right",
          author: CURRENT_USER.name,
          initials: CURRENT_USER.initials,
          text: "Thanks — reviewing now. The sector split is clear, no questions on methodology so far.",
          time: "2 days ago",
        },
      ],
    },
    {
      id: "req-07",
      type: "dataset",
      name: "Growth rate of non-oil re-exports through the ports",
      tags: ["Non-Oil Trade Products", "Ports"],
      catIcon: "ti-ship",
      submittedBy: { name: "Yasmin Abdelrahman", initials: "YA" },
      submittedAt: daysAgo(7),
      entity: "Abu Dhabi Ports",
      asset: "Non-Oil Trade Products",
      product: "Trade statistics",
      source: "AD Ports operational returns",
      refresh: "Monthly",
      period: "Jan 2024 – Feb 2026",
      coverage: "Khalifa, Zayed and Musaffah ports",
      summary:
        "Monthly growth rate of non-oil re-exports moving through Abu Dhabi ports, by port and commodity group.",
      status: "in-review",
      reviewer: { name: "Layla Al Ameri", initials: "LA" },
      sharedWith: [],
      preview: {
        kind: "table",
        columns: ["Port", "Volume", "MoM", "YoY"],
        rows: [
          ["Khalifa Port", "4.82", "+3.1%", "+15.6%"],
          ["Zayed Port", "1.19", "-0.8%", "+4.2%"],
          ["Musaffah Port", "0.74", "+1.6%", "+9.1%"],
        ],
        note: "Million tonnes, Feb 2026.",
      },
      comments: [
        {
          kind: "approval",
          text: "Submitted for approval by Yasmin Abdelrahman.",
          time: "7 days ago",
        },
      ],
    },
    {
      id: "req-09",
      type: "table",
      name: "Non-oil foreign trade through the ports",
      tags: ["Non-Oil Trade Products", "Trade"],
      catIcon: "ti-ship",
      submittedBy: { name: "Omar Al Shamsi", initials: "OS" },
      submittedAt: daysAgo(5),
      entity: "Abu Dhabi Ports",
      asset: "Non-Oil Trade Products",
      product: "Trade statistics",
      source: "Federal Customs Authority",
      refresh: "Quarterly",
      period: "Q4 2025",
      coverage: "Emirate of Abu Dhabi",
      summary:
        "Value of non-oil imports, exports and re-exports passing through Abu Dhabi ports, with quarter-on-quarter movement.",
      status: "unassigned",
      reviewer: null,
      sharedWith: [{ name: "Yasmin Abdelrahman", initials: "YA" }],
      preview: {
        kind: "table",
        columns: ["Flow", "Q3 2025", "Q4 2025", "Change"],
        rows: [
          ["Imports", "38.4", "41.2", "+7.3%"],
          ["Exports", "27.1", "29.6", "+9.2%"],
          ["Re-exports", "11.8", "12.4", "+5.1%"],
        ],
        note: "AED billions.",
      },
      comments: [
        {
          kind: "approval",
          text: "Submitted for approval by Omar Al Shamsi.",
          time: "5 days ago",
        },
      ],
    },
  ];

  /* ══ VIEW STATE ════════════════════════════════════════════ */

  var state = {
    filter: "all",
    sort: "waiting",
    query: "",
    openId: null,
    loaded: false,
    scrollTop: 0,
  };

  var chartInstance = null;
  var pendingReason = null; // "return" | "reject"

  var SORTS = [
    { key: "waiting", label: "Longest waiting" },
    { key: "newest", label: "Newest first" },
    { key: "name", label: "Artifact name" },
  ];

  var FILTERS = [
    { key: "all", label: "All" },
    { key: "mine", label: "Needs my review" },
    { key: "unassigned", label: "Unassigned" },
  ];

  /* ══ HELPERS ═══════════════════════════════════════════════ */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function isMine(r) {
    return r.status === "in-review" && r.reviewer && r.reviewer.initials === CURRENT_USER.initials;
  }

  /* The state a card/chip should display — "Needs your review"
     is a personalised reading of in-review, not a stored status. */
  function displayStatus(r) {
    if (isMine(r)) return "mine";
    return r.status;
  }

  function isOpen(r) {
    return r.status === "unassigned" || r.status === "in-review";
  }

  function daysWaiting(r) {
    return Math.max(0, Math.floor((Date.now() - r.submittedAt) / DAY));
  }

  function waitingLabel(r) {
    var d = daysWaiting(r);
    if (d === 0) return "Today";
    if (d === 1) return "1 day";
    return d + " days";
  }

  function relativeTime(ts) {
    var d = Math.max(0, Math.floor((Date.now() - ts) / DAY));
    if (d === 0) return "today";
    if (d === 1) return "yesterday";
    if (d < 30) return d + " days ago";
    var m = Math.floor(d / 30);
    return m === 1 ? "1 month ago" : m + " months ago";
  }

  function formatDate(ts) {
    var d = new Date(ts);
    return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function get(id) {
    for (var i = 0; i < REQUESTS.length; i++) {
      if (REQUESTS[i].id === id) return REQUESTS[i];
    }
    return null;
  }

  function style(r) {
    return TYPE_STYLE[r.type] || TYPE_STYLE.report;
  }

  function avatar(person, size) {
    var cls = "req-av" + (size ? " req-av--" + size : "");
    return (
      '<span class="' +
      cls +
      '" title="' +
      esc(person.name) +
      '" aria-hidden="true">' +
      esc(person.initials) +
      "</span>"
    );
  }

  function statusChip(r) {
    var key = displayStatus(r);
    var s = STATUS[key] || STATUS.unassigned;
    var label = s.label;
    if (key === "in-review" && r.reviewer) label = "In review · " + r.reviewer.name.split(" ")[0];
    return (
      '<span class="art-tag art-tag--status ' +
      s.cls +
      '"><span class="req-dot"></span>' +
      esc(label) +
      "</span>"
    );
  }

  function notify(msg, icon) {
    if (typeof global.toast === "function") global.toast(msg, icon || "ti-check");
  }

  /* ══ FILTERING / SORTING ═══════════════════════════════════ */

  function matchesFilter(r, key) {
    switch (key) {
      case "all":
        return true;
      case "mine":
        return isMine(r);
      case "unassigned":
        return r.status === "unassigned";
      case "returned":
        return r.status === "returned";
      case "approved":
        return r.status === "approved";
      case "rejected":
        return r.status === "rejected";
      default:
        return true;
    }
  }

  function matchesQuery(r) {
    if (!state.query) return true;
    var q = state.query.toLowerCase();
    return (
      r.name.toLowerCase().indexOf(q) !== -1 ||
      r.submittedBy.name.toLowerCase().indexOf(q) !== -1 ||
      r.entity.toLowerCase().indexOf(q) !== -1 ||
      (r.tags || []).join(" ").toLowerCase().indexOf(q) !== -1
    );
  }

  function visibleList() {
    var list = REQUESTS.filter(function (r) {
      return matchesFilter(r, state.filter) && matchesQuery(r);
    });
    var sorted = list.slice();
    if (state.sort === "waiting") {
      sorted.sort(function (a, b) {
        return a.submittedAt - b.submittedAt;
      });
    } else if (state.sort === "newest") {
      sorted.sort(function (a, b) {
        return b.submittedAt - a.submittedAt;
      });
    } else {
      sorted.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
    return sorted;
  }

  function countFor(key) {
    return REQUESTS.filter(function (r) {
      return matchesFilter(r, key);
    }).length;
  }

  /* Requests that want the approver's attention: unassigned, plus
     anything sitting in their own review queue. */
  function attentionCount() {
    return REQUESTS.filter(function (r) {
      return r.status === "unassigned" || isMine(r);
    }).length;
  }

  /* ══ RAIL BADGE ════════════════════════════════════════════ */

  function renderBadge() {
    var count = attentionCount();
    var nodes = document.querySelectorAll(".js-req-badge");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = count > 9 ? "9+" : String(count);
      nodes[i].hidden = count === 0;
    }
  }

  /* ══ QUEUE RENDERING ═══════════════════════════════════════ */

  function renderFilters() {
    var wrap = byId("reqFilters");
    if (!wrap) return;
    wrap.innerHTML = FILTERS.map(function (f) {
      var n = countFor(f.key);
      return (
        '<button type="button" class="req-filter' +
        (state.filter === f.key ? " active" : "") +
        '" data-req-filter="' +
        f.key +
        '" onclick="reqSetFilter(\'' +
        f.key +
        "')\">" +
        esc(f.label) +
        '<span class="req-filter-count">' +
        n +
        "</span></button>"
      );
    }).join("");
  }

  function renderSort() {
    var trigger = byId("reqSortLabel");
    if (trigger) {
      var active = SORTS.filter(function (s) {
        return s.key === state.sort;
      })[0];
      trigger.textContent = active ? active.label : SORTS[0].label;
    }
    var menu = byId("reqSortMenu");
    if (!menu) return;
    menu.innerHTML = SORTS.map(function (s) {
      return (
        '<button type="button" class="prod-filter-dd-option' +
        (state.sort === s.key ? " is-active" : "") +
        '" onclick="reqSetSort(\'' +
        s.key +
        "')\">" +
        (state.sort === s.key
          ? '<i class="ti ti-check" aria-hidden="true"></i>'
          : '<i class="ti" aria-hidden="true" style="width:14px"></i>') +
        esc(s.label) +
        "</button>"
      );
    }).join("");
  }

  /* "Assign to" — a compact dropdown reusing the .prod-filter-dd
     menu component (same one that backs the sort/status filters),
     just triggered by the small ghost button the card already used
     for "Assign to me". Replaces that single action. */
  function assignControlHTML(r) {
    return (
      '<div class="prod-filter-dd req-assign-dd" data-req-assign-dd="' +
      r.id +
      '">' +
      '<button type="button" class="ag-btn ag-btn-ghost ag-btn-xs" onclick="event.stopPropagation();reqToggleAssignDd(event,\'' +
      r.id +
      '\')"><i class="ti ti-user-plus" aria-hidden="true"></i> Assign to<i class="ti ti-chevron-down" aria-hidden="true"></i></button>' +
      '<div class="prod-filter-dd-menu" id="reqAssignMenu-' +
      r.id +
      '" style="display:none">' +
      '<button type="button" class="prod-filter-dd-option" onclick="event.stopPropagation();reqAssignToMe(\'' +
      r.id +
      '\')"><i class="ti ti-user-check" aria-hidden="true"></i>Assign to me</button>' +
      '<button type="button" class="prod-filter-dd-option" onclick="event.stopPropagation();reqOpenAssignPicker(\'' +
      r.id +
      '\')"><i class="ti ti-users" aria-hidden="true"></i>Assign to someone else…</button>' +
      "</div></div>"
    );
  }

  function cardHTML(r) {
    var st = style(r);
    var d = daysWaiting(r);
    var overdue = isOpen(r) && d >= 5;
    var dateHTML = isOpen(r)
      ? '<span class="req-age' +
        (overdue ? " req-age--overdue" : "") +
        '"><i class="ti ti-clock-hour-4" aria-hidden="true"></i>' +
        esc(waitingLabel(r)) +
        " waiting</span>"
      : '<span class="req-age">' + esc(formatDate(r.submittedAt)) + "</span>";

    var footer = r.status === "unassigned" ? '<div class="req-card-actions">' + assignControlHTML(r) + "</div>" : "";

    return (
      '<div class="art-card card-hover req-card" data-req-id="' +
      r.id +
      "\" onclick=\"reqOpenReview('" +
      r.id +
      '\')">' +
      '<div class="art-card-hd"><div class="art-card-hd-left">' +
      '<div class="art-card-icon" style="background:' +
      st.bg +
      ";color:" +
      st.co +
      '"><i class="ti ' +
      st.ico +
      '" aria-hidden="true"></i></div>' +
      ((r.tags || [])[0]
        ? '<span class="product-cat-tag"><i class="ti ' +
          (r.catIcon || "ti-trending-up") +
          '" aria-hidden="true"></i> <span class="product-cat-text">' +
          esc(r.tags[0]) +
          "</span></span>"
        : "") +
      "</div>" +
      '<div class="art-card-actions"><i class="ti ti-arrow-up-right art-card-icon-btn" title="Open" aria-label="Open ' +
      esc(r.name) +
      '" onclick="event.stopPropagation();reqOpenReview(\'' +
      r.id +
      "')\"></i></div>" +
      "</div>" +
      '<div class="art-name">' +
      esc(r.name) +
      "</div>" +
      '<div class="req-meta-row">' +
      avatar(r.submittedBy) +
      '<span class="req-meta-name">' +
      esc(r.submittedBy.name) +
      "</span>" +
      '<span class="req-meta-sep">·</span><span class="req-meta-type">' +
      esc(r.type) +
      "</span>" +
      "</div>" +
      '<div class="req-card-divider"></div>' +
      '<div class="req-status-row">' +
      statusChip(r) +
      dateHTML +
      "</div>" +
      (footer ? '<div class="art-card-footer">' + footer + "</div>" : "") +
      "</div>"
    );
  }

  function emptyHTML() {
    var copy = {
      mine: {
        icon: "ti-checks",
        title: "You are all caught up",
        text: "Nothing is assigned to you for review right now. Unassigned requests are waiting in the queue if you want to pick one up.",
      },
      unassigned: {
        icon: "ti-inbox",
        title: "No unassigned requests",
        text: "Every submitted artifact has a reviewer. New submissions will appear here as soon as they arrive.",
      },
      all: {
        icon: "ti-inbox",
        title: "No requests yet",
        text: "Artifacts submitted for approval will appear here for review before they become publicly available.",
      },
    };
    var c = copy[state.filter] || {
      icon: "ti-filter-off",
      title: "Nothing matches this view",
      text: "No requests match the current filter or search. Try a different state, or clear what you have typed.",
    };
    if (state.query) {
      c = {
        icon: "ti-search-off",
        title: "No matching requests",
        text: 'Nothing matches "' + esc(state.query) + '". Try a different artifact name, submitter or entity.',
      };
    }
    var showClear = state.query || state.filter !== "all";
    return (
      '<div class="search-empty-state visible">' +
      '<div class="search-empty-icon"><i class="ti ' +
      c.icon +
      '" aria-hidden="true"></i></div>' +
      '<div class="search-empty-title">' +
      c.title +
      "</div>" +
      '<div class="search-empty-text">' +
      c.text +
      "</div>" +
      (showClear
        ? '<button type="button" class="search-empty-clear" onclick="reqClearFilters()">Show all requests</button>'
        : "") +
      "</div>"
    );
  }

  function skeletonHTML() {
    var out = "";
    for (var i = 0; i < 8; i++) out += '<div class="req-sk-card"></div>';
    return out;
  }

  function renderGrid() {
    var grid = byId("reqGrid");
    if (!grid) return;
    var list = visibleList();
    grid.innerHTML = list.length ? list.map(cardHTML).join("") : emptyHTML();
  }

  function renderQueue() {
    renderFilters();
    renderSort();
    renderGrid();
    renderBadge();
  }

  /* ══ ENTRY POINT ═══════════════════════════════════════════ */

  function renderRequests() {
    var queue = byId("reqQueue");
    var review = byId("reqReview");
    if (!queue) return;
    queue.classList.remove("is-hidden");
    if (review) {
      review.classList.add("is-hidden");
      review.innerHTML = "";
    }
    destroyChart();
    state.openId = null;

    if (!state.loaded) {
      var grid = byId("reqGrid");
      renderFilters();
      renderSort();
      renderBadge();
      if (grid) grid.innerHTML = skeletonHTML();
      setTimeout(function () {
        state.loaded = true;
        renderQueue();
      }, 450);
      return;
    }
    renderQueue();
  }

  /* ══ QUEUE INTERACTIONS ════════════════════════════════════ */

  function setFilter(key) {
    state.filter = key;
    renderFilters();
    renderGrid();
  }

  function setSort(key) {
    state.sort = key;
    closeSortMenu();
    renderSort();
    renderGrid();
  }

  function clearFilters() {
    state.filter = "all";
    state.query = "";
    var input = byId("reqSearch");
    if (input) input.value = "";
    renderFilters();
    renderGrid();
  }

  function search(value) {
    state.query = (value || "").trim();
    renderGrid();
  }

  function toggleSortMenu(event) {
    if (event) event.stopPropagation();
    var menu = byId("reqSortMenu");
    var trigger = byId("reqSortTrigger");
    if (!menu) return;
    var open = menu.style.display === "block";
    menu.style.display = open ? "none" : "block";
    if (trigger) trigger.classList.toggle("is-open", !open);
  }

  function closeSortMenu() {
    var menu = byId("reqSortMenu");
    var trigger = byId("reqSortTrigger");
    if (menu) menu.style.display = "none";
    if (trigger) trigger.classList.remove("is-open");
  }

  document.addEventListener("click", function (e) {
    var sort = byId("reqSort");
    if (sort && !sort.contains(e.target)) closeSortMenu();
  });

  /* ══ ASSIGNMENT ════════════════════════════════════════════ */

  var assignPicker = { id: null, query: "", selected: null };

  function assign(id, person) {
    var r = get(id);
    if (!r || r.status !== "unassigned") return;
    var who = person || CURRENT_USER;
    var toSelf = who.initials === CURRENT_USER.initials;
    r.status = "in-review";
    r.reviewer = who;
    r.comments.push({
      kind: "comment",
      side: "right",
      author: CURRENT_USER.name,
      initials: CURRENT_USER.initials,
      text: toSelf
        ? "Assigned this request to myself for review."
        : "Assigned this request to " + who.name + " for review.",
      time: "just now",
    });
    notify(
      toSelf ? "Assigned to you — " + shortName(r.name) : "Assigned to " + who.name + " — " + shortName(r.name),
      "ti-user-plus"
    );
    if (state.openId === id) {
      renderReview(r);
    } else {
      renderQueue();
    }
    renderBadge();
  }

  function assignToMe(id) {
    closeAssignMenus();
    assign(id, CURRENT_USER);
  }

  function shortName(name) {
    return name.length > 42 ? name.slice(0, 40).trim() + "…" : name;
  }

  /* ── "Assign to" per-card dropdown — same open/close mechanics
        as the sort menu, just one instance per unassigned card. ── */
  function closeAssignMenus() {
    var menus = document.querySelectorAll(".req-assign-dd .prod-filter-dd-menu");
    for (var i = 0; i < menus.length; i++) menus[i].style.display = "none";
  }

  function toggleAssignDd(event, id) {
    if (event) event.stopPropagation();
    var menu = byId("reqAssignMenu-" + id);
    if (!menu) return;
    var open = menu.style.display === "block";
    closeAssignMenus();
    closeSortMenu();
    menu.style.display = open ? "none" : "block";
  }

  document.addEventListener("click", function (e) {
    var dds = document.querySelectorAll(".req-assign-dd");
    for (var i = 0; i < dds.length; i++) {
      if (!dds[i].contains(e.target)) {
        var menu = dds[i].querySelector(".prod-filter-dd-menu");
        if (menu) menu.style.display = "none";
      }
    }
  });

  /* ── "Assign to someone else" — search/select/confirm popup ── */

  function assignablePeople() {
    var q = assignPicker.query.trim().toLowerCase();
    return REVIEWERS.filter(function (p) {
      return !q || p.name.toLowerCase().indexOf(q) !== -1;
    });
  }

  function assignResultsHTML() {
    var people = assignablePeople();
    if (!people.length) {
      return '<div class="req-assign-empty">No one matches your search.</div>';
    }
    return people
      .map(function (p) {
        var active = assignPicker.selected && assignPicker.selected.initials === p.initials;
        return (
          '<button type="button" class="req-assign-result' +
          (active ? " is-active" : "") +
          '" onclick="reqSelectAssignPerson(\'' +
          p.initials +
          '\')">' +
          avatar(p, "sm") +
          '<span class="req-assign-result-name">' +
          esc(p.name) +
          "</span>" +
          (active ? '<i class="ti ti-check" aria-hidden="true"></i>' : "") +
          "</button>"
        );
      })
      .join("");
  }

  function openAssignPicker(id) {
    var r = get(id);
    if (!r || r.status !== "unassigned") return;
    closeAssignMenus();
    assignPicker = { id: id, query: "", selected: null };
    var modal = byId("reqAssignModal");
    if (!modal) return;
    var st = style(r);
    modal.querySelector(".modal").innerHTML =
      '<div class="modal-head"><h2>Assign to someone else</h2><p>Search for a colleague to hand this request to.</p></div>' +
      '<div class="modal-body">' +
      '<div class="req-modal-target"><div class="art-card-icon" style="background:' +
      st.bg +
      ";color:" +
      st.co +
      '"><i class="ti ' +
      st.ico +
      '" aria-hidden="true"></i></div><div class="req-modal-target-name">' +
      esc(r.name) +
      "</div></div>" +
      '<label class="req-modal-label" for="reqAssignSearch">Search people</label>' +
      '<div class="art-search-wrap req-assign-search-wrap"><i class="ti ti-search" aria-hidden="true"></i>' +
      '<input type="text" class="art-search" id="reqAssignSearch" placeholder="Search by name…" aria-label="Search people" oninput="reqAssignSearchChanged(this.value)" /></div>' +
      '<div class="req-assign-results" id="reqAssignResults">' +
      assignResultsHTML() +
      "</div>" +
      "</div>" +
      '<div class="req-modal-foot">' +
      '<button type="button" class="ag-btn ag-btn-ghost ag-btn-sm" onclick="reqCloseAssignPicker()">Cancel</button>' +
      '<button type="button" class="ag-btn ag-btn-primary ag-btn-sm" id="reqAssignConfirm" disabled onclick="reqConfirmAssignPicker()">Assign</button>' +
      "</div>";
    modal.classList.add("show", "open");
    var input = byId("reqAssignSearch");
    if (input) setTimeout(function () { input.focus(); }, 60);
  }

  function assignSearchChanged(value) {
    assignPicker.query = value || "";
    assignPicker.selected = null;
    var wrap = byId("reqAssignResults");
    if (wrap) wrap.innerHTML = assignResultsHTML();
    var btn = byId("reqAssignConfirm");
    if (btn) btn.disabled = true;
  }

  function selectAssignPerson(initials) {
    var p = REVIEWERS.filter(function (x) {
      return x.initials === initials;
    })[0];
    if (!p) return;
    assignPicker.selected = p;
    var wrap = byId("reqAssignResults");
    if (wrap) wrap.innerHTML = assignResultsHTML();
    var btn = byId("reqAssignConfirm");
    if (btn) btn.disabled = false;
  }

  function closeAssignPicker(event) {
    if (event && event.target !== event.currentTarget) return;
    var modal = byId("reqAssignModal");
    if (modal) modal.classList.remove("show", "open");
    assignPicker = { id: null, query: "", selected: null };
  }

  function confirmAssignPicker() {
    if (!assignPicker.id || !assignPicker.selected) return;
    var id = assignPicker.id;
    var person = assignPicker.selected;
    closeAssignPicker();
    assign(id, person);
  }

  /* ══ REVIEW PAGE ═══════════════════════════════════════════ */

  function openReview(id) {
    var r = get(id);
    if (!r) return;
    var queue = byId("reqQueue");
    var inner = queue ? queue.querySelector(".req-inner") : null;
    if (inner) state.scrollTop = inner.scrollTop;
    state.openId = id;
    if (queue) queue.classList.add("is-hidden");
    renderReview(r);
  }

  function backToQueue() {
    destroyChart();
    state.openId = null;
    var review = byId("reqReview");
    if (review) {
      review.classList.add("is-hidden");
      review.innerHTML = "";
    }
    var queue = byId("reqQueue");
    if (queue) queue.classList.remove("is-hidden");
    renderQueue();
    var inner = queue ? queue.querySelector(".req-inner") : null;
    if (inner) inner.scrollTop = state.scrollTop;
  }

  function previewHTML(r) {
    var p = r.preview || {};
    var body = "";
    if (p.kind === "chart") {
      body = '<div class="req-preview-canvas-wrap"><canvas id="reqPreviewChart"></canvas></div>';
    } else if (p.kind === "table") {
      body =
        '<table class="req-preview-table"><thead><tr>' +
        (p.columns || [])
          .map(function (c, i) {
            return "<th" + (i ? ' class="num"' : "") + ">" + esc(c) + "</th>";
          })
          .join("") +
        "</tr></thead><tbody>" +
        (p.rows || [])
          .map(function (row) {
            return (
              "<tr>" +
              row
                .map(function (cell, i) {
                  return "<td" + (i ? ' class="num"' : "") + ">" + esc(cell) + "</td>";
                })
                .join("") +
              "</tr>"
            );
          })
          .join("") +
        "</tbody></table>";
    } else {
      body =
        '<div class="req-preview-text">' +
        (p.paragraphs || [])
          .map(function (t) {
            return "<p>" + t + "</p>";
          })
          .join("") +
        "</div>";
    }
    return (
      '<div class="req-preview">' +
      body +
      "</div>" +
      (p.note
        ? '<div class="req-preview-note"><i class="ti ti-info-circle" aria-hidden="true"></i>' +
          esc(p.note) +
          "</div>"
        : "")
    );
  }

  function metaHTML(r) {
    var rows = [
      ["Product", r.product],
      ["Asset", r.asset],
      ["Type", r.type.charAt(0).toUpperCase() + r.type.slice(1)],
      ["Source", r.source],
      ["Refresh", r.refresh],
      ["Reference period", r.period],
      ["Coverage", r.coverage],
      ["Submitted", formatDate(r.submittedAt)],
    ];
    return (
      '<div class="req-meta-grid">' +
      rows
        .map(function (row) {
          return (
            "<div><div class=\"req-meta-k\">" +
            esc(row[0]) +
            '</div><div class="req-meta-v">' +
            esc(row[1] || "—") +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  /* Comment thread — chat bubbles for people, .gd-action-status
     blocks for workflow events. */
  function commentHTML(c) {
    if (c.kind === "comment") {
      var right = c.side === "right";
      return (
        '<div class="msg ' +
        (right ? "user" : "ai") +
        ' req-thread-item">' +
        (right ? "" : avatar({ name: c.author, initials: c.initials }, "sm")) +
        '<div class="msg-body"><div class="req-msg-meta">' +
        esc(c.author) +
        " · " +
        esc(c.time) +
        '</div><div class="bubble">' +
        esc(c.text) +
        "</div></div>" +
        (right ? avatar({ name: c.author, initials: c.initials }, "sm") : "") +
        "</div>"
      );
    }
    var pill = {
      approval: { icon: "ti-clock-hour-4", label: "Submitted" },
      changes: { icon: "ti-edit", label: "Returned" },
      rejected: { icon: "ti-circle-x", label: "Rejected" },
      approved: { icon: "ti-circle-check", label: "Approved" },
    }[c.kind] || { icon: "ti-message-dots", label: "Update" };
    return (
      '<div class="gd-action-status gd-action-status--' +
      c.kind +
      ' req-thread-item">' +
      '<span class="gd-action-status-pill"><i class="ti ' +
      pill.icon +
      '" aria-hidden="true"></i> ' +
      pill.label +
      '</span><span class="gd-action-status-msg">' +
      esc(c.text) +
      "</span></div>"
    );
  }

  function commentCount(r) {
    return r.comments.filter(function (c) {
      return c.kind === "comment";
    }).length;
  }

  /* Activity stepper — the existing .at-* component. */
  function activityHTML(r) {
    var decided = r.status === "approved" || r.status === "rejected" || r.status === "returned";
    var steps = [
      {
        state: "done",
        title: "Submitted",
        sub: r.submittedBy.name + " sent this for approval",
        time: formatDate(r.submittedAt),
      },
      {
        state: r.status === "unassigned" ? "wait" : decided ? "done" : "active",
        title: "Under Review",
        sub:
          r.status === "unassigned"
            ? "Waiting for a reviewer to pick this up"
            : r.reviewer
              ? "Assigned to " + r.reviewer.name
              : "In progress",
        time: r.status === "unassigned" ? "" : "",
      },
      {
        state: decided ? "done" : "wait",
        title: "Decision",
        sub: decided
          ? STATUS[r.status].label + " by " + (r.reviewer ? r.reviewer.name : CURRENT_USER.name)
          : "Approved, returned or rejected by the reviewer",
        time: "",
      },
      {
        state: r.status === "approved" ? "done" : "wait",
        title: "Published",
        sub:
          r.status === "approved"
            ? "Available in Artifacts and the Government Data Hub"
            : "Becomes publicly available once approved",
        time: "",
      },
    ];
    var icons = { done: "ti-check", active: "ti-clock", wait: "ti-circle" };
    return (
      '<div class="at-card"><div class="at-steps">' +
      steps
        .map(function (s, i) {
          return (
            '<div class="at-step"><div class="at-step-l"><div class="at-dot ' +
            s.state +
            '"><i class="ti ' +
            icons[s.state] +
            '" aria-hidden="true"></i></div>' +
            (i < steps.length - 1 ? '<div class="at-line"></div>' : "") +
            '</div><div class="at-body"><div class="at-step-title">' +
            esc(s.title) +
            '</div><div class="at-step-sub">' +
            esc(s.sub) +
            "</div>" +
            (s.time ? '<div class="at-step-time">' + esc(s.time) + "</div>" : "") +
            "</div></div>"
          );
        })
        .join("") +
      "</div></div>"
    );
  }

  function actionbarHTML(r) {
    if (!isOpen(r)) {
      var s = STATUS[r.status];
      return (
        '<div class="req-actionbar">' +
        '<div class="req-actionbar-note req-actionbar-note--ok"><i class="ti ti-circle-check" aria-hidden="true"></i>' +
        "This request was " +
        s.label.toLowerCase() +
        (r.reviewer ? " by " + esc(r.reviewer.name) : "") +
        ". No further action is needed." +
        "</div>" +
        '<div class="req-actionbar-actions">' +
        '<button type="button" class="ag-btn ag-btn-ghost ag-btn-sm" onclick="reqBackToQueue()">Back to New Requests</button>' +
        "</div></div>"
      );
    }
    var gated = r.status === "unassigned";
    return (
      '<div class="req-actionbar">' +
      '<div class="req-actionbar-note"><i class="ti ' +
      (gated ? "ti-lock" : "ti-info-circle") +
      '" aria-hidden="true"></i>' +
      (gated
        ? "Assign this request to yourself to review it."
        : "Approving publishes this artifact and makes it available in Artifacts.") +
      "</div>" +
      '<div class="req-actionbar-actions">' +
      '<button type="button" class="ag-btn ag-btn-ghost ag-btn-sm" id="reqBtnReturn"' +
      (gated ? " disabled" : "") +
      ' onclick="reqAskReason(\'return\')"><i class="ti ti-arrow-back-up" aria-hidden="true"></i> Return</button>' +
      '<button type="button" class="ag-btn ag-btn-danger ag-btn-sm" id="reqBtnReject"' +
      (gated ? " disabled" : "") +
      ' onclick="reqAskReason(\'reject\')"><i class="ti ti-circle-x" aria-hidden="true"></i> Reject</button>' +
      '<button type="button" class="ag-btn ag-btn-primary ag-btn-sm" id="reqBtnApprove"' +
      (gated ? " disabled" : "") +
      ' onclick="reqApprove()"><i class="ti ti-check" aria-hidden="true"></i> Approve</button>' +
      "</div></div>"
    );
  }

  function renderReview(r) {
    var host = byId("reqReview");
    if (!host) return;
    var st = style(r);
    var gated = r.status === "unassigned";

    host.classList.remove("is-hidden");
    host.innerHTML =
      '<div class="req-review-top">' +
      '<button type="button" class="ag-btn ag-btn-ghost ag-btn-sm req-back" onclick="reqBackToQueue()">' +
      '<i class="ti ti-arrow-left" aria-hidden="true"></i> Back to New Requests</button>' +
      '<div class="req-crumb">New Requests <i class="ti ti-chevron-right" aria-hidden="true"></i> ' +
      esc(r.asset) +
      ' <i class="ti ti-chevron-right" aria-hidden="true"></i> <strong>' +
      esc(r.entity) +
      "</strong></div>" +
      "</div>" +
      '<div class="req-review-body"><div class="req-review-cols">' +
      /* ── main column ── */
      '<div class="req-main">' +
      '<div class="req-panel">' +
      '<div class="req-detail-hd">' +
      '<div class="req-detail-icon" style="background:' +
      st.bg +
      ";color:" +
      st.co +
      '"><i class="ti ' +
      st.ico +
      '" aria-hidden="true"></i></div>' +
      "<div><div class=\"req-detail-title\">" +
      esc(r.name) +
      '</div><div class="req-detail-tagline">' +
      statusChip(r) +
      '<span class="product-cat-tag"><i class="ti ' +
      (r.catIcon || "ti-trending-up") +
      '" aria-hidden="true"></i> <span class="product-cat-text">' +
      esc((r.tags || [])[0] || r.asset) +
      "</span></span>" +
      (r.tags || [])
        .slice(1)
        .map(function (t) {
          return '<span class="art-tag">' + esc(t) + "</span>";
        })
        .join("") +
      "</div></div></div>" +
      '<div class="req-summary">' +
      esc(r.summary) +
      "</div>" +
      previewHTML(r) +
      "</div>" +
      '<div class="req-panel"><div class="req-rail-h">Metadata</div>' +
      metaHTML(r) +
      "</div>" +
      "</div>" +
      /* ── rail ── */
      '<aside class="req-rail">' +
      '<div class="req-panel"><div class="req-rail-h">Status</div>' +
      statusChip(r) +
      '<div class="req-assign-line">' +
      (r.reviewer
        ? '<i class="ti ti-user-check" aria-hidden="true"></i>Reviewer: ' +
          esc(isMine(r) ? "You" : r.reviewer.name)
        : '<i class="ti ti-user-question" aria-hidden="true"></i>No reviewer assigned') +
      "</div>" +
      (isOpen(r) ? '<div class="req-assign-line"><i class="ti ti-clock-hour-4" aria-hidden="true"></i>' +
        esc(waitingLabel(r)) +
        " in the queue</div>" : "") +
      (gated
        ? '<div style="margin-top:12px"><button type="button" class="ag-btn ag-btn-primary ag-btn-sm" onclick="reqAssign(\'' +
          r.id +
          '\')"><i class="ti ti-user-plus" aria-hidden="true"></i> Assign to me</button></div>'
        : "") +
      "</div>" +
      '<div class="req-panel"><div class="req-rail-h">Submitted by</div>' +
      '<div class="req-person">' +
      avatar(r.submittedBy, "md") +
      "<div><div class=\"req-person-name\">" +
      esc(r.submittedBy.name) +
      '</div><div class="req-person-sub">' +
      esc(relativeTime(r.submittedAt)) +
      " · " +
      esc(r.entity) +
      "</div></div></div>" +
      (r.sharedWith && r.sharedWith.length
        ? '<div class="req-rail-divider"></div><div class="req-rail-h" style="margin-bottom:8px">Shared with</div>' +
          '<div class="req-shared-row"><span class="req-av-stack">' +
          r.sharedWith
            .slice(0, 3)
            .map(function (p) {
              return avatar(p, "sm");
            })
            .join("") +
          "</span>" +
          '<span class="req-av-more">' +
          esc(
            r.sharedWith.length > 3
              ? r.sharedWith[0].name + " and " + (r.sharedWith.length - 1) + " others"
              : r.sharedWith
                  .map(function (p) {
                    return p.name.split(" ")[0];
                  })
                  .join(", "),
          ) +
          "</span></div>"
        : "") +
      "</div>" +
      '<div class="req-panel"><div class="req-rail-h">Comments<span class="req-rail-count">' +
      commentCount(r) +
      '</span></div><div class="req-thread" id="reqThread">' +
      r.comments.map(commentHTML).join("") +
      "</div>" +
      (isOpen(r)
        ? '<div class="req-composer">' +
          '<textarea id="reqCommentInput" placeholder="Type your comment here" oninput="reqCommentChanged()"' +
          (gated ? " disabled" : "") +
          "></textarea>" +
          '<div class="req-composer-actions">' +
          '<button type="button" class="ag-btn ag-btn-ghost ag-btn-xs" onclick="reqClearComment()">Cancel</button>' +
          '<button type="button" class="ag-btn ag-btn-primary ag-btn-xs" id="reqCommentSubmit" disabled onclick="reqSubmitComment()">Submit</button>' +
          "</div></div>"
        : "") +
      "</div>" +
      '<div class="req-panel"><div class="req-rail-h">Activity</div>' +
      activityHTML(r) +
      "</div>" +
      "</aside>" +
      "</div></div>" +
      actionbarHTML(r);

    destroyChart();
    if (r.preview && r.preview.kind === "chart") drawChart(r);
    scrollThread();
  }

  function scrollThread() {
    var t = byId("reqThread");
    if (t) t.scrollTop = t.scrollHeight;
  }

  /* ══ CHART PREVIEW ═════════════════════════════════════════ */

  function destroyChart() {
    if (chartInstance) {
      try {
        chartInstance.destroy();
      } catch (e) {
        /* canvas already gone */
      }
      chartInstance = null;
    }
  }

  function drawChart(r) {
    var canvas = byId("reqPreviewChart");
    if (!canvas || typeof global.Chart === "undefined") return;
    var theme =
      global.BayaanTheme && global.BayaanTheme.chartTheme
        ? global.BayaanTheme.chartTheme()
        : { tick: "#94A3B8", grid: "#F1F5F9", textSecondary: "#475569" };
    var palette =
      global.BayaanTheme && global.BayaanTheme.chartPalette
        ? global.BayaanTheme.chartPalette(6)
        : ["#0066FF", "#059669", "#378ADD", "#1D9E75", "#BA7517", "#7C3AED"];
    var p = r.preview;
    var bar = p.chartType === "bar";

    chartInstance = new global.Chart(canvas.getContext("2d"), {
      type: bar ? "bar" : "line",
      data: {
        labels: p.labels,
        datasets: p.series.map(function (s, i) {
          return {
            label: s.name,
            data: s.data,
            borderColor: palette[i % palette.length],
            backgroundColor: bar ? palette[i % palette.length] : "transparent",
            borderWidth: bar ? 0 : 2,
            borderRadius: bar ? 6 : 0,
            tension: 0.4,
            pointRadius: bar ? 0 : 3,
            pointBackgroundColor: palette[i % palette.length],
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: {
            display: p.series.length > 1,
            position: "bottom",
            labels: {
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: "circle",
              color: theme.textSecondary,
              font: { size: 11, family: "Inter" },
              padding: 14,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: theme.grid },
            ticks: { color: theme.tick, font: { size: 10, family: "Inter" } },
          },
          y: {
            grid: { color: theme.grid },
            border: { display: false },
            ticks: { color: theme.tick, font: { size: 10, family: "Inter" } },
          },
        },
      },
    });
  }

  /* Re-theme the open preview when light/dark flips. */
  global.addEventListener("bayaan-theme-change", function () {
    if (!state.openId) return;
    var r = get(state.openId);
    if (r && r.preview && r.preview.kind === "chart") {
      destroyChart();
      drawChart(r);
    }
  });

  /* ══ COMMENTS ══════════════════════════════════════════════ */

  function commentChanged() {
    var input = byId("reqCommentInput");
    var btn = byId("reqCommentSubmit");
    if (input && btn) btn.disabled = !input.value.trim();
  }

  function clearComment() {
    var input = byId("reqCommentInput");
    if (input) input.value = "";
    commentChanged();
  }

  function submitComment() {
    var r = get(state.openId);
    var input = byId("reqCommentInput");
    if (!r || !input || !input.value.trim()) return;
    r.comments.push({
      kind: "comment",
      side: "right",
      author: CURRENT_USER.name,
      initials: CURRENT_USER.initials,
      text: input.value.trim(),
      time: "just now",
    });
    var thread = byId("reqThread");
    if (thread) thread.insertAdjacentHTML("beforeend", commentHTML(r.comments[r.comments.length - 1]));
    var count = byId("reqReview").querySelector(".req-rail-count");
    if (count) count.textContent = commentCount(r);
    input.value = "";
    commentChanged();
    scrollThread();
    notify("Comment added", "ti-message-circle");
  }

  /* ══ DECISIONS ═════════════════════════════════════════════ */

  function setBusy(btnId, label) {
    var btn = byId(btnId);
    if (!btn) return null;
    var prev = btn.innerHTML;
    btn.innerHTML = '<i class="ti ti-loader-2 req-spin" aria-hidden="true"></i> ' + label;
    ["reqBtnApprove", "reqBtnReject", "reqBtnReturn"].forEach(function (id) {
      var b = byId(id);
      if (b) b.disabled = true;
    });
    return prev;
  }

  function showActionError(message, retry) {
    var review = byId("reqReview");
    var bar = review ? review.querySelector(".req-actionbar") : null;
    if (!bar) return;
    var existing = review.querySelector(".req-error-bar");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.className = "req-error-bar";
    el.innerHTML =
      '<i class="ti ti-alert-triangle" aria-hidden="true"></i><span>' +
      esc(message) +
      '</span><button type="button" class="ag-btn ag-btn-ghost ag-btn-xs">Try again</button>';
    el.querySelector("button").addEventListener("click", function () {
      el.remove();
      retry();
    });
    bar.parentNode.insertBefore(el, bar);
    ["reqBtnApprove", "reqBtnReject", "reqBtnReturn"].forEach(function (id) {
      var b = byId(id);
      if (b) b.disabled = false;
    });
  }

  /* Publish an approved request into the Artifacts library. */
  function publish(r) {
    var st = style(r);
    if (typeof global.publishApprovedArtifact !== "function") return;
    global.publishApprovedArtifact({
      type: r.type,
      name: r.name,
      date: formatDate(Date.now()),
      tags: r.tags,
      catIcon: r.catIcon,
      ico: st.ico,
      bg: st.bg,
      co: st.co,
    });
  }

  function decide(id, outcome, reason) {
    var r = get(id);
    if (!r) return;
    if (outcome === "approve") {
      r.status = "approved";
      r.comments.push({
        kind: "approved",
        text: "Approved by " + CURRENT_USER.name + " — published to Artifacts and the Government Data Hub.",
        time: "just now",
      });
      publish(r);
      notify("Approved — " + shortName(r.name) + " is now in Artifacts", "ti-shield-check");
    } else if (outcome === "return") {
      r.status = "returned";
      r.comments.push({
        kind: "changes",
        text: "Returned by " + CURRENT_USER.name + " — " + reason,
        time: "just now",
      });
      notify("Returned to " + r.submittedBy.name.split(" ")[0] + " with your notes", "ti-arrow-back-up");
    } else {
      r.status = "rejected";
      r.comments.push({
        kind: "rejected",
        text: "Rejected by " + CURRENT_USER.name + " — " + reason,
        time: "just now",
      });
      notify("Rejected — " + shortName(r.name), "ti-circle-x");
    }
    backToQueue();
    markLeaving(id);
  }

  /* If the decided card no longer belongs in the active filter,
     let it collapse out rather than vanish between frames. */
  function markLeaving(id) {
    var r = get(id);
    if (!r || matchesFilter(r, state.filter)) return;
    var grid = byId("reqGrid");
    var card = grid ? grid.querySelector('[data-req-id="' + id + '"]') : null;
    if (card) {
      card.classList.add("req-card--leaving");
      setTimeout(function () {
        renderGrid();
      }, 260);
    }
  }

  /* Approve runs straight through — no confirmation dialog. */
  function approve() {
    var r = get(state.openId);
    if (!r || !isOpen(r) || r.status === "unassigned") return;
    var id = r.id;
    setBusy("reqBtnApprove", "Approving…");
    setTimeout(function () {
      if (global.__reqForceFailure) {
        global.__reqForceFailure = false;
        var btn = byId("reqBtnApprove");
        if (btn) btn.innerHTML = '<i class="ti ti-check" aria-hidden="true"></i> Approve';
        showActionError("Could not submit your decision. Nothing was changed.", approve);
        return;
      }
      decide(id, "approve");
    }, 600);
  }

  /* Return and Reject both need a written reason. */
  function askReason(kind) {
    var r = get(state.openId);
    if (!r || r.status === "unassigned") return;
    pendingReason = kind;
    var isReject = kind === "reject";
    var st = style(r);
    var modal = byId("reqReasonModal");
    if (!modal) return;
    modal.querySelector(".modal").innerHTML =
      '<div class="modal-head"><h2>' +
      (isReject ? "Reject this request" : "Return for changes") +
      "</h2><p>" +
      (isReject
        ? "The artifact will not be published. Tell the creator why so the record is clear."
        : "The creator can revise and resubmit. Explain what needs to change.") +
      "</p></div>" +
      '<div class="modal-body">' +
      '<div class="req-modal-target"><div class="art-card-icon" style="background:' +
      st.bg +
      ";color:" +
      st.co +
      '"><i class="ti ' +
      st.ico +
      '" aria-hidden="true"></i></div><div class="req-modal-target-name">' +
      esc(r.name) +
      "</div></div>" +
      '<label class="req-modal-label" for="reqReasonText">' +
      (isReject ? "Reason for rejection" : "What needs to change") +
      "</label>" +
      '<textarea id="reqReasonText" placeholder="' +
      (isReject
        ? "e.g. the end-use split cannot be derived from this source"
        : "e.g. restate Q3 to include the planned maintenance window") +
      '" oninput="reqReasonChanged()"></textarea>' +
      "</div>" +
      '<div class="req-modal-foot">' +
      '<button type="button" class="ag-btn ag-btn-ghost ag-btn-sm" onclick="reqCloseReason()">Cancel</button>' +
      '<button type="button" class="ag-btn ' +
      (isReject ? "ag-btn-danger" : "ag-btn-primary") +
      ' ag-btn-sm" id="reqReasonConfirm" disabled onclick="reqConfirmReason()">' +
      (isReject ? "Reject request" : "Return request") +
      "</button></div>";
    modal.classList.add("show", "open");
    var ta = byId("reqReasonText");
    if (ta) setTimeout(function () { ta.focus(); }, 60);
  }

  function reasonChanged() {
    var ta = byId("reqReasonText");
    var btn = byId("reqReasonConfirm");
    if (ta && btn) btn.disabled = !ta.value.trim();
  }

  function closeReason(event) {
    if (event && event.target !== event.currentTarget) return;
    var modal = byId("reqReasonModal");
    if (modal) modal.classList.remove("show", "open");
    pendingReason = null;
  }

  function confirmReason() {
    var ta = byId("reqReasonText");
    if (!ta || !ta.value.trim() || !pendingReason) return;
    var kind = pendingReason;
    var reason = ta.value.trim();
    var id = state.openId;
    var btn = byId("reqReasonConfirm");
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="ti ti-loader-2 req-spin" aria-hidden="true"></i> Submitting…';
    }
    setTimeout(function () {
      closeReason();
      decide(id, kind, reason);
    }, 550);
  }

  /* ══ EXPORTS ═══════════════════════════════════════════════ */

  global.renderRequests = renderRequests;
  global.reqSetFilter = setFilter;
  global.reqSetSort = setSort;
  global.reqToggleSort = toggleSortMenu;
  global.reqClearFilters = clearFilters;
  global.reqSearch = search;
  global.reqAssign = assign;
  global.reqToggleAssignDd = toggleAssignDd;
  global.reqAssignToMe = assignToMe;
  global.reqOpenAssignPicker = openAssignPicker;
  global.reqAssignSearchChanged = assignSearchChanged;
  global.reqSelectAssignPerson = selectAssignPerson;
  global.reqCloseAssignPicker = closeAssignPicker;
  global.reqConfirmAssignPicker = confirmAssignPicker;
  global.reqOpenReview = openReview;
  global.reqBackToQueue = backToQueue;
  global.reqApprove = approve;
  global.reqAskReason = askReason;
  global.reqReasonChanged = reasonChanged;
  global.reqCloseReason = closeReason;
  global.reqConfirmReason = confirmReason;
  global.reqCommentChanged = commentChanged;
  global.reqClearComment = clearComment;
  global.reqSubmitComment = submitComment;
  global.BayaanRequests = { data: REQUESTS, state: state, user: CURRENT_USER, refresh: renderQueue };

  /* Seed the rail badge as soon as the shell exists. */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderBadge);
  } else {
    renderBadge();
  }
})(window);
