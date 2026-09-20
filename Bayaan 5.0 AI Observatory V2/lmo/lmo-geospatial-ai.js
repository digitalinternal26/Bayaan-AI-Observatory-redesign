/* LMO Geospatial AI — inline map insights, explore panel, history */
(function () {
  "use strict";

  var REGION_ID_TO_NAME = {
    abudhabi: "Abu Dhabi",
    alain: "Al Ain",
    aldhafra: "Al Dhafra"
  };

  var SUGGESTIONS = [
    { label: "Compare Al Ain vs Abu Dhabi", icon: "ti-arrows-left-right", query: "Compare Al Ain and Abu Dhabi workforce" },
    { label: "Emirati jobseekers by district", icon: "ti-map-pin", query: "Show Emirati jobseekers by district" },
    { label: "Employment decline", icon: "ti-help-circle", query: "Why did employment decline in Al Dhafra?" },
    { label: "Workforce growth", icon: "ti-trending-up", query: "Workforce growth in Abu Dhabi City" }
  ];

  var LMO_AI_RESPONSES = {
    compare: {
      text: "Comparing <b>Al Ain</b> and <b>Abu Dhabi</b> workforce: Abu Dhabi City holds the larger employed base at 1.89M, while Al Ain shows faster year-on-year growth at 4.8%. Both regions are highlighted on the map.",
      regions: ["alain", "abudhabi"],
      chart: {
        type: "bar",
        labels: ["Abu Dhabi", "Al Ain", "Al Dhafra"],
        data: [1890, 620, 252],
        colors: ["var(--accent)", "#5a9eb5", "#1a4a5c"],
        unit: "k employed"
      },
      insightLine: "Al Ain has outpaced Abu Dhabi City on employment growth for two consecutive quarters.",
      factors: [
        { icon: "ti-building-factory-2", text: "New industrial hiring in Al Ain eastern districts lifted manufacturing employment." },
        { icon: "ti-briefcase", text: "Abu Dhabi City services sector remains the largest absolute employer." }
      ],
      comparison: [
        { name: "Abu Dhabi", color: "var(--accent)", metrics: [["Employed", "1.89M"], ["Growth", "+3.2%"], ["Emirati share", "11.2%"]] },
        { name: "Al Ain", color: "#5a9eb5", metrics: [["Employed", "620k"], ["Growth", "+4.8%"], ["Emirati share", "14.6%"]] }
      ]
    },
    decline: {
      text: "Employment in <b>Al Dhafra</b> dipped 1.4% quarter-on-quarter, mainly in construction and support services. Seasonal project completions and a pause in new industrial contracts contributed to the short-term decline.",
      regions: ["aldhafra"],
      chart: {
        type: "line",
        labels: ["Q1", "Q2", "Q3", "Q4"],
        data: [258, 256, 254, 252],
        colors: ["var(--red, #e2483d)"],
        unit: "k employed"
      },
      insightLine: "The decline is concentrated in temporary construction roles rather than permanent hires.",
      factors: [
        { icon: "ti-building", text: "Three major construction projects reached completion this quarter." },
        { icon: "ti-truck", text: "Support services contracts paused pending new infrastructure awards." }
      ],
      comparison: null
    },
    growth: {
      text: "<b>Abu Dhabi City</b> recorded 3.2% workforce growth year-on-year, led by administrative services and manufacturing. Yas Island and Al Reem Island account for the strongest district-level gains.",
      regions: ["abudhabi"],
      chart: {
        type: "bar",
        labels: ["Yas Island", "Al Reem", "Khalifa City", "Al Danah"],
        data: [42, 38, 29, 24],
        colors: ["var(--accent)", "var(--accent)", "var(--accent)", "var(--accent)"],
        unit: "k new jobs"
      },
      insightLine: "Yas Island alone contributed over 35% of net new employment in Abu Dhabi City this year.",
      factors: [
        { icon: "ti-building-skyscraper", text: "Hospitality and retail hiring on Yas Island surged ahead of peak season." },
        { icon: "ti-home-2", text: "Residential completions on Al Reem Island drew new service-sector jobs." }
      ],
      comparison: null
    },
    jobseekers: {
      text: "There are <b>18,030 Emirati jobseekers</b> across Abu Dhabi emirate. Secondary-educated candidates dominate in Al Ain and Central District, while Abu Dhabi City has the highest concentration of above-secondary graduates seeking work.",
      regions: ["abudhabi"],
      chart: {
        type: "bar",
        labels: ["Al Danah", "Al Jimi", "Central District", "Khalifa City"],
        data: [4.2, 3.8, 3.1, 2.4],
        colors: ["var(--accent)", "var(--accent)", "var(--accent)", "var(--accent)"],
        unit: "k jobseekers"
      },
      insightLine: "25–34 year-olds make up 38% of all active Emirati jobseekers emirate-wide.",
      factors: [
        { icon: "ti-school", text: "Above-secondary graduates are concentrated in Abu Dhabi City and Al Reem Island." },
        { icon: "ti-users", text: "Youth cohorts (18–24) show the fastest rise in active jobseeker registrations." }
      ],
      comparison: null
    },
    districts: {
      text: "District-level workforce is strongest in <b>Al Danah</b> and <b>Al Reem Island</b>, together accounting for 14% of emirate-wide employment. I've focused the map on Abu Dhabi City where these districts are concentrated.",
      regions: ["abudhabi"],
      chart: {
        type: "bar",
        labels: ["Al Danah", "Al Reem", "Al Manhal", "Khalifa City"],
        data: [218, 186, 142, 128],
        colors: ["var(--accent)", "var(--accent)", "var(--accent)", "var(--accent)"],
        unit: "k employed"
      },
      insightLine: "Administrative and support services dominate employment in Al Danah and Al Reem Island.",
      factors: [
        { icon: "ti-map-2", text: "Al Danah leads on financial and professional services employment." },
        { icon: "ti-building-community", text: "Al Reem Island continues to attract mixed-use and retail hiring." }
      ],
      comparison: null
    },
    emirati: {
      text: "Emirati workers total <b>300,225</b> across the emirate — 10.9% of all employed. Al Ain has the highest Emirati workforce share at 14.6%, compared with 11.2% in Abu Dhabi City.",
      regions: ["alain", "abudhabi"],
      chart: {
        type: "bar",
        labels: ["Abu Dhabi", "Al Ain", "Al Dhafra"],
        data: [11.2, 14.6, 9.8],
        colors: ["var(--accent)", "#5a9eb5", "#1a4a5c"],
        unit: "% Emirati"
      },
      insightLine: "Government and education sectors drive the highest Emirati employment rates in Al Ain.",
      factors: [
        { icon: "ti-building-bank", text: "Public sector hiring programmes disproportionately benefit Al Ain districts." },
        { icon: "ti-school", text: "Education sector Emiratisation is strongest in Al Ain and Abu Dhabi City." }
      ],
      comparison: [
        { name: "Al Ain", color: "var(--accent)", metrics: [["Emirati employed", "90.5k"], ["Share", "14.6%"], ["Jobseekers", "4.2k"]] },
        { name: "Abu Dhabi", color: "#5a9eb5", metrics: [["Emirati employed", "211.7k"], ["Share", "11.2%"], ["Jobseekers", "10.1k"]] }
      ]
    },
    default: {
      text: "Across Abu Dhabi emirate, <b>2,762,715</b> people are employed as of Sep 2024. Abu Dhabi City holds the largest share, followed by Al Ain and Al Dhafra. I've updated the map focus to show the regional split.",
      regions: ["abudhabi"],
      chart: {
        type: "bar",
        labels: ["Abu Dhabi", "Al Ain", "Al Dhafra"],
        data: [68, 22, 10],
        colors: ["var(--accent)", "#5a9eb5", "#1a4a5c"],
        unit: "% share"
      },
      insightLine: "Non-Emirati workers account for 89.1% of total employment emirate-wide.",
      factors: [],
      comparison: null
    }
  };

  var chartCounter = 0;
  var conversationHistory = [];
  var lastMapCardContext = null;
  var exploreChatBusy = false;
  var chartRegistry = {};
  var CHARTS_ENABLED = false;

  var valueLabelPlugin = {
    id: "valueLabel",
    afterDatasetsDraw: function (chart) {
      var ctx = chart.ctx;
      ctx.save();
      ctx.font = "700 10.5px 'Inter', system-ui, sans-serif";
      ctx.fillStyle = "rgba(100,116,139,.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      chart.data.datasets.forEach(function (ds, dsIndex) {
        var meta = chart.getDatasetMeta(dsIndex);
        meta.data.forEach(function (bar, i) {
          var raw = ds.data[i];
          if (raw == null || !bar || typeof bar.x !== "number") return;
          ctx.fillText(formatChartValue(raw), bar.x, bar.y - 6);
        });
      });
      ctx.restore();
    }
  };

  function initChartLibrary() {
    if (typeof Chart === "undefined") return false;
    var ax =
      window.LMO && typeof LMO.chartAxes === "function"
        ? LMO.chartAxes()
        : {
            tick: "rgba(100,116,139,.9)",
            tooltipBg: "#0A0F1E",
            tooltipTitle: "#fff",
            tooltipBody: "rgba(255,255,255,.88)",
          };
    Chart.defaults.font.family = "'Inter', system-ui, -apple-system, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = ax.tick;
    Chart.defaults.plugins.tooltip.backgroundColor = ax.tooltipBg;
    Chart.defaults.plugins.tooltip.titleColor = ax.tooltipTitle;
    Chart.defaults.plugins.tooltip.bodyColor = ax.tooltipBody;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.titleFont = { weight: "700", size: 11.5 };
    Chart.defaults.plugins.tooltip.bodyFont = { size: 11.5 };
    Chart.defaults.plugins.tooltip.displayColors = false;
    return true;
  }

  function formatChartValue(v) {
    if (typeof v !== "number") return v;
    if (Math.abs(v) >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + "k";
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  }

  function resolveCssVar(c) {
    if (typeof c === "string" && c.indexOf("var(") === 0) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(c.slice(4, -1))
        .trim();
    }
    return c;
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function destroyChart(id) {
    var el = document.getElementById(id);
    if (chartRegistry[id]) {
      chartRegistry[id].destroy();
      delete chartRegistry[id];
    }
    if (el && typeof Chart !== "undefined") {
      var existing = Chart.getChart(el);
      if (existing) existing.destroy();
    }
  }

  function finalizeChart(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var chart = chartRegistry[id] || (typeof Chart !== "undefined" ? Chart.getChart(el) : null);
    if (!chart) return;
    chart.resize();
    chart.update("none");
  }

  function chartHostReady(canvasId) {
    if (!canvasId) return false;
    var el = document.getElementById(canvasId);
    if (!el || el.tagName !== "CANVAS" || !el.isConnected) return false;
    var host = el.closest(
      ".ai-map-card-chart, .explore-chart-wrap, .explore-chat-chart-wrap, .ai-response-chart"
    );
    if (!host) return false;
    var rect = host.getBoundingClientRect();
    return rect.width >= 32 && rect.height >= 16 && !!el.getContext("2d");
  }

  function scheduleChartRender(renderFn, canvasId) {
    if (!CHARTS_ENABLED) return;
    var attempts = 0;
    function tick() {
      if (!chartHostReady(canvasId)) {
        if (attempts < 30) {
          attempts++;
          setTimeout(tick, attempts < 6 ? 40 : 80);
          return;
        }
        return;
      }
      try { renderFn(); } catch (err) { console.warn("Chart render failed:", err); }
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (canvasId) finalizeChart(canvasId);
        });
      });
    }
    tick();
  }

  function colorWithAlpha(color, opacity) {
    var c = resolveCssVar(color);
    if (!c) return "rgba(0,143,196," + opacity + ")";
    if (c.indexOf("#") === 0) {
      var hex = c.slice(1);
      if (hex.length === 3) hex = hex.split("").map(function (ch) { return ch + ch; }).join("");
      if (hex.length === 8) hex = hex.slice(0, 6);
      var a = Math.round(Math.max(0, Math.min(1, opacity)) * 255).toString(16);
      if (a.length < 2) a = "0" + a;
      return "#" + hex + a;
    }
    var rgb = c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
    if (rgb) return "rgba(" + rgb[1] + "," + rgb[2] + "," + rgb[3] + "," + opacity + ")";
    return c;
  }

  function createChartAreaGradient(ctx, height, color, topOpacity) {
    topOpacity = topOpacity || 0.18;
    var g = ctx.createLinearGradient(0, 0, 0, height || 90);
    g.addColorStop(0, colorWithAlpha(color, topOpacity));
    g.addColorStop(1, colorWithAlpha(color, 0));
    return g;
  }

  function buildAIChart(id, cfg) {
    if (!CHARTS_ENABLED || !cfg) return;
    var canvas = document.getElementById(id);
    if (!canvas || canvas.tagName !== "CANVAS" || !canvas.isConnected) return;

    var host = canvas.closest(
      ".ai-map-card-chart, .explore-chart-wrap, .explore-chat-chart-wrap, .ai-response-chart"
    );
    if (!host) return;
    var rect = host.getBoundingClientRect();
    if (rect.width < 32 || rect.height < 16) return;

    destroyChart(id);
    var context = canvas.getContext("2d");
    if (!context) return;
    var resolveColor = resolveCssVar;

    try {
      if (cfg.type === "radar") {
        chartRegistry[id] = new Chart(canvas, {
          type: "radar",
          data: {
            labels: cfg.labels,
            datasets: cfg.datasets.map(function (d) {
              return {
                label: d.label,
                data: d.data,
                borderColor: resolveColor(d.color),
                backgroundColor: resolveColor(d.color) + "1F",
                pointBackgroundColor: resolveColor(d.color),
                pointBorderColor:
                  window.LMO && LMO.chartAxes
                    ? LMO.chartAxes().pointBorder
                    : "#fff",
                pointBorderWidth: 1.5,
                pointRadius: 3,
                borderWidth: 2.25
              };
            })
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 6 },
            plugins: { legend: { position: "bottom", labels: { boxWidth: 10, padding: 12, font: { size: 10.5 } } } },
            scales: {
              r: {
                ticks: { display: false },
                grid: { color: "rgba(148,163,184,.22)" },
                angleLines: { color: "rgba(148,163,184,.22)" },
                pointLabels: { font: { size: 10 } }
              }
            }
          }
        });
        finalizeChart(id);
        return;
      }

      if (cfg.type === "line") {
        var lastIdx = cfg.data.length - 1;
        chartRegistry[id] = new Chart(canvas, {
          type: "line",
          data: {
            labels: cfg.labels,
            datasets: [{
              data: cfg.data,
              borderColor: resolveColor(cfg.colors[0]),
              backgroundColor: function (c) {
                var h = (c.chart.chartArea && c.chart.chartArea.bottom) || c.chart.height || 90;
                return createChartAreaGradient(c.chart.ctx, h, cfg.colors[0]);
              },
              borderWidth: 2.5,
              cubicInterpolationMode: "monotone",
              fill: true,
              pointRadius: cfg.data.map(function (_, i) { return i === lastIdx ? 4 : 0; }),
              pointHoverRadius: 5,
              pointBackgroundColor: resolveColor(cfg.colors[0]),
              pointBorderColor:
                window.LMO && LMO.chartAxes
                  ? LMO.chartAxes().pointBorder
                  : "#fff",
              pointBorderWidth: 2,
              segment: cfg.dashedFrom !== undefined ? {
                borderDash: function (c2) { return c2.p0DataIndex >= cfg.dashedFrom ? [5, 4] : []; }
              } : undefined
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: "index" },
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: function (c) { return " " + formatChartValue(c.parsed.y) + " " + (cfg.unit || ""); } } }
            },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 0 } },
              y: { grid: { color: "rgba(148,163,184,.15)" }, ticks: { font: { size: 10 } }, title: { display: true, text: cfg.unit, font: { size: 10 } } }
            }
          }
        });
        finalizeChart(id);
        return;
      }

      chartRegistry[id] = new Chart(canvas, {
        type: "bar",
        data: {
          labels: cfg.labels,
          datasets: [{
            data: cfg.data,
            backgroundColor: cfg.colors.map(resolveColor),
            borderRadius: 8,
            borderSkipped: false,
            categoryPercentage: 0.62,
            barPercentage: 0.9,
            maxBarThickness: 42
          }]
        },
        plugins: [valueLabelPlugin],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { top: 22 } },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: function (c) { return " " + formatChartValue(c.parsed.y) + " " + (cfg.unit || ""); } } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 0, autoSkip: true } },
            y: { display: false, grid: { display: false }, beginAtZero: true }
          }
        }
      });
      finalizeChart(id);
    } catch (err) {
      console.warn("AI chart failed:", id, err);
    }
  }

  function classifyQuery(q) {
    var s = q.toLowerCase();
    if (s.indexOf("compare") >= 0 || s.indexOf("vs") >= 0 || s.indexOf("al ain and abu dhabi") >= 0) return "compare";
    if (s.indexOf("decline") >= 0 || s.indexOf("why") >= 0 || s.indexOf("dip") >= 0) return "decline";
    if (s.indexOf("growth") >= 0 || s.indexOf("growing") >= 0) return "growth";
    if (s.indexOf("jobseeker") >= 0 || s.indexOf("job seeker") >= 0 || s.indexOf("unemployed") >= 0) return "jobseekers";
    if (s.indexOf("district") >= 0 || s.indexOf("distribution") >= 0) return "districts";
    if (s.indexOf("emirati") >= 0 || s.indexOf("national") >= 0) return "emirati";
    return "default";
  }

  function resolveAIResponse(query) {
    return LMO_AI_RESPONSES[classifyQuery(query)] || LMO_AI_RESPONSES.default;
  }

  function applyAIResponse(query, data) {
    if (window.LmoGeo && LmoGeo.applyAIRegions) {
      LmoGeo.applyAIRegions(data.regions || []);
    }

    var entry = { id: "c" + Date.now(), query: query, data: data, ts: Date.now() };
    conversationHistory.unshift(entry);
    if (conversationHistory.length > 50) conversationHistory.pop();
    renderHistoryList();
    lastMapCardContext = { query: query, data: data };
  }

  function removeMapInsightCard() {
    var existing = document.getElementById("aiMapCard");
    if (existing) existing.remove();
  }

  function positionMapCardDocked(cardEl) {
    var stage = document.getElementById("mapStage");
    if (!stage || !cardEl) return;
    var stageRect = stage.getBoundingClientRect();
    var topMargin = 76;
    var bottomMargin = 100;
    var cardHeight = cardEl.offsetHeight || 320;

    cardEl.style.left = "auto";
    cardEl.style.right = "56px";

    var top = (stageRect.height - cardHeight) / 2;
    top = Math.max(topMargin, Math.min(top, stageRect.height - bottomMargin - cardHeight));
    cardEl.style.top = top + "px";
    cardEl.style.transform = "none";
  }

  function showMapInsightCard(query, data) {
    removeMapInsightCard();
    chartCounter++;
    var chartId = "aiChart" + chartCounter;
    var stage = document.getElementById("mapStage");
    var regionId = data.regions[0];
    var regionName = REGION_ID_TO_NAME[regionId] || "Abu Dhabi Emirate";

    lastMapCardContext = { query: query, data: data };

    var card = document.createElement("div");
    card.className = "ai-map-card";
    card.id = "aiMapCard";
    card.innerHTML =
      '<div class="ai-map-card-eyebrow">' +
        '<span class="ai-map-card-badge"><i class="ti ti-sparkles"></i> AI Insight</span>' +
        '<button type="button" class="ai-map-card-close" title="Close"><i class="ti ti-x"></i></button>' +
      "</div>" +
      '<div class="ai-map-card-text">' + data.text + "</div>" +
      (data.insightLine
        ? '<div class="ai-map-card-highlight"><i class="ti ti-bulb"></i>' + data.insightLine + "</div>"
        : "") +
      '<div class="ai-map-card-chart"><canvas id="' + chartId + '" width="280" height="120"></canvas></div>' +
      '<div class="ai-map-card-foot">' +
        '<span class="ai-map-card-region"><i class="ti ti-map-pin"></i> ' + escapeHtml(regionName) + "</span>" +
        '<button type="button" class="ai-map-card-link" id="aiMapExploreBtn"><i class="ti ti-sparkles"></i> Explore<i class="ti ti-arrow-right"></i></button>' +
      "</div>";

    stage.appendChild(card);
    card.querySelector(".ai-map-card-close").addEventListener("click", removeMapInsightCard);
    card.querySelector("#aiMapExploreBtn").addEventListener("click", openExplorePanel);
    positionMapCardDocked(card);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        scheduleChartRender(function () { buildAIChart(chartId, data.chart); }, chartId);
      });
    });
    setTimeout(function () { positionMapCardDocked(card); }, 350);
  }

  function addFallbackResponseCard(query, data) {
    chartCounter++;
    var chartId = "aiChart" + chartCounter;
    var stack = document.getElementById("aiResponseStack");
    if (!stack) return;

    while (stack.children.length >= 2) stack.removeChild(stack.lastChild);

    lastMapCardContext = { query: query, data: data };

    var card = document.createElement("div");
    card.className = "ai-response-card";
    card.innerHTML =
      '<div class="ai-response-head">' +
        '<div class="ai-response-avatar"><i class="ti ti-sparkles"></i></div>' +
        '<div class="ai-response-text">' + data.text + "</div>" +
        '<button type="button" class="ai-response-close" title="Close"><i class="ti ti-x"></i></button>' +
      "</div>" +
      '<div class="ai-response-chart"><canvas id="' + chartId + '" width="560" height="150"></canvas></div>' +
      '<div class="ai-map-card-foot" style="margin:8px -2px -2px;border-top:1px solid var(--border-md);padding-top:10px;">' +
        "<span></span>" +
        '<button type="button" class="ai-map-card-link" id="aiFallbackExploreBtn"><i class="ti ti-sparkles"></i> Explore<i class="ti ti-arrow-right"></i></button>' +
      "</div>";

    stack.prepend(card);
    card.querySelector(".ai-response-close").addEventListener("click", function () { card.remove(); });
    card.querySelector("#aiFallbackExploreBtn").addEventListener("click", openExplorePanel);
    scheduleChartRender(function () { buildAIChart(chartId, data.chart); }, chartId);
  }

  function addResponseCard(query, data) {
    if (data.regions && data.regions.length) {
      showMapInsightCard(query, data);
    } else {
      addFallbackResponseCard(query, data);
    }
  }

  function sendAIQuery() {
    var input = document.getElementById("aiInput");
    var sendBtn = document.getElementById("aiSendBtn");
    if (!input) return;
    var query = input.value.trim();
    if (!query) return;

    var data = resolveAIResponse(query);
    applyAIResponse(query, data);

    input.value = "";
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    var stack = document.getElementById("aiResponseStack");
    var typingId = "typing-" + Date.now();
    var typingCard = document.createElement("div");
    typingCard.className = "ai-response-card";
    typingCard.id = typingId;
    typingCard.innerHTML =
      '<div class="ai-response-head">' +
        '<div class="ai-response-avatar"><i class="ti ti-sparkles"></i></div>' +
        '<div class="ai-typing"><span></span><span></span><span></span></div>' +
      "</div>";
    if (stack) stack.prepend(typingCard);

    setTimeout(function () {
      if (typingCard.parentNode) typingCard.remove();
      addResponseCard(query, data);
      input.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
    }, 900);
  }

  function askAI(query) {
    if (!query) return;
    var input = document.getElementById("aiInput");
    if (input) input.value = query;
    sendAIQuery();
  }

  function getExploreChatMsgs() {
    return document.getElementById("exploreChatMsgs");
  }

  function autoResizeExploreInput(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
  }

  function scrollExploreToBottom() {
    var scroll = document.querySelector("#exploreDrawer .explore-scroll");
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
  }

  function openExplorePanel() {
    if (!lastMapCardContext) return;
    document.getElementById("exploreDrawer").classList.add("open");
    document.getElementById("exploreBackdrop").classList.add("open");
    renderExplorePanel(lastMapCardContext);
    var canvasId = document.querySelector("#exploreBody canvas");
    if (canvasId) setTimeout(function () { finalizeChart(canvasId.id); }, 320);
    setTimeout(function () {
      var inp = document.getElementById("exploreChatInput");
      if (inp) inp.focus();
    }, 320);
  }

  function closeExplorePanel() {
    document.getElementById("exploreDrawer").classList.remove("open");
    document.getElementById("exploreBackdrop").classList.remove("open");
  }

  function renderExplorePanel(context) {
    var query = context.query;
    var data = context.data;

    document.getElementById("exploreSub").textContent = "Workforce · Abu Dhabi Emirate";

    var chatMsgs = getExploreChatMsgs();
    if (chatMsgs) chatMsgs.innerHTML = "";

    chartCounter++;
    var chartId = "aiChart" + chartCounter;

    var heroBlock =
      '<div class="explore-hero">' +
        '<div class="explore-hero-icon"><i class="ti ti-briefcase"></i></div>' +
        "<div>" +
          '<div class="explore-hero-value">2,762,715</div>' +
          '<div class="explore-hero-label">Total employed · Sep 2024</div>' +
        "</div>" +
      "</div>";

    var factorsBlock =
      data.factors && data.factors.length
        ? '<hr class="explore-divider" /><div>' +
            '<div class="explore-section-label"><i class="ti ti-list-details"></i> Contributing factors</div>' +
            '<div class="explore-factors">' +
              data.factors
                .map(function (f) {
                  return (
                    '<div class="explore-factor">' +
                      '<div class="explore-factor-icon"><i class="ti ' + f.icon + '"></i></div>' +
                      "<div>" + f.text + "</div>" +
                    "</div>"
                  );
                })
                .join("") +
            "</div></div>"
        : "";

    var comparisonBlock =
      data.comparison && data.comparison.length
        ? '<hr class="explore-divider" /><div>' +
            '<div class="explore-section-label"><i class="ti ti-arrows-left-right"></i> Region comparison</div>' +
            '<div class="region-compare">' +
              data.comparison
                .map(function (it) {
                  return (
                    '<div class="region-tile highlight">' +
                      '<div class="region-tile-name"><span class="dot" style="background:' +
                      resolveCssVar(it.color) +
                      '"></span>' +
                      escapeHtml(it.name) +
                      "</div>" +
                      it.metrics
                        .map(function (m) {
                          return '<div class="region-metric"><span>' + m[0] + '</span><span class="v">' + m[1] + "</span></div>";
                        })
                        .join("") +
                    "</div>"
                  );
                })
                .join("") +
            "</div></div>"
        : "";

    var followupItems = SUGGESTIONS.filter(function (s) { return s.query !== query; }).slice(0, 4);
    var followupBlock = followupItems.length
      ? '<hr class="explore-divider" /><div>' +
          '<div class="explore-section-label"><i class="ti ti-sparkles"></i> Continue exploring</div>' +
          '<div class="explore-followup" id="exploreFollowups"></div>' +
        "</div>"
      : "";

    document.getElementById("exploreBody").innerHTML =
      heroBlock +
      "<div>" +
        '<div class="explore-section-label"><i class="ti ti-message-circle"></i> Focus area: ' +
        escapeHtml(query || "Map insight") +
        "</div>" +
        '<div class="explore-narrative">' + data.text + "</div>" +
        (data.insightLine
          ? '<div class="ai-map-card-highlight" style="margin:12px 0 0;"><i class="ti ti-bulb"></i>' + data.insightLine + "</div>"
          : "") +
      "</div>" +
      '<div class="explore-chart-card"><div class="explore-chart-wrap"><canvas id="' + chartId + '" width="360" height="200"></canvas></div></div>' +
      factorsBlock +
      comparisonBlock +
      followupBlock;

    var followupsHost = document.getElementById("exploreFollowups");
    if (followupsHost) {
      followupItems.forEach(function (s) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "ai-chip";
        chip.innerHTML = '<i class="ti ' + s.icon + '"></i> ' + escapeHtml(s.label);
        chip.addEventListener("click", function () { askExploreAI(s.query); });
        followupsHost.appendChild(chip);
      });
    }

    scheduleChartRender(function () { buildAIChart(chartId, data.chart); }, chartId);
  }

  function appendExploreAIMessage(data) {
    var c = getExploreChatMsgs();
    if (!c || !window.StudioChat) return;
    chartCounter++;
    var chartId = "aiChart" + chartCounter;
    var insight = data.insightLine
      ? '<div class="ai-map-card-highlight" style="margin:10px 0 0;"><i class="ti ti-bulb"></i>' + data.insightLine + "</div>"
      : "";
    var chartBlock = data.chart
      ? '<div class="explore-chat-chart"><div class="explore-chat-chart-wrap"><canvas id="' + chartId + '" width="320" height="150"></canvas></div></div>'
      : "";
    StudioChat.appendAiMsg(c, '<div class="bubble">' + data.text + insight + "</div>" + chartBlock);
    if (data.chart) scheduleChartRender(function () { buildAIChart(chartId, data.chart); }, chartId);
    scrollExploreToBottom();
  }

  function askExploreAI(query) {
    if (!query) return;
    var input = document.getElementById("exploreChatInput");
    if (input) input.value = query;
    sendExploreQuery();
  }

  function sendExploreQuery() {
    var input = document.getElementById("exploreChatInput");
    var sendBtn = document.getElementById("exploreSendBtn");
    var query = input && input.value.trim();
    if (!query || exploreChatBusy) return;

    var data = resolveAIResponse(query);
    applyAIResponse(query, data);

    input.value = "";
    input.style.height = "auto";
    exploreChatBusy = true;
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    if (window.StudioChat) {
      StudioChat.appendUserMsg(getExploreChatMsgs(), query);
      scrollExploreToBottom();
      StudioChat.showTypingIndicator(getExploreChatMsgs(), function () {
        appendExploreAIMessage(data);
        exploreChatBusy = false;
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        input.focus();
        scrollExploreToBottom();
      });
    } else {
      appendExploreAIMessage(data);
      exploreChatBusy = false;
      input.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
    }
    scrollExploreToBottom();
  }

  function relativeTime(ts) {
    var diffSec = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (diffSec < 60) return "just now";
    var diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return diffMin + (diffMin === 1 ? " min ago" : " mins ago");
    var diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return diffHr + (diffHr === 1 ? " hour ago" : " hours ago");
    var diffDay = Math.round(diffHr / 24);
    return diffDay + (diffDay === 1 ? " day ago" : " days ago");
  }

  function toggleHistoryDrawer(forceState) {
    var drawer = document.getElementById("historyDrawer");
    var backdrop = document.getElementById("historyBackdrop");
    if (!drawer || !backdrop) return;
    var next = typeof forceState === "boolean" ? forceState : !drawer.classList.contains("open");
    drawer.classList.toggle("open", next);
    backdrop.classList.toggle("open", next);
    if (next) renderHistoryList();
  }

  function renderHistoryList(filterText) {
    var badge = document.getElementById("aiHistoryBadge");
    if (badge) {
      badge.textContent = String(conversationHistory.length);
      badge.style.display = conversationHistory.length ? "flex" : "none";
    }

    var list = document.getElementById("historyList");
    if (!list) return;

    if (!conversationHistory.length) {
      list.innerHTML =
        '<div class="history-empty"><i class="ti ti-message-circle"></i><p>No questions yet. Try asking the map something below.</p></div>';
      return;
    }

    var term = (filterText || "").trim().toLowerCase();
    var filtered = term
      ? conversationHistory.filter(function (e) { return e.query.toLowerCase().indexOf(term) >= 0; })
      : conversationHistory;

    if (!filtered.length) {
      list.innerHTML =
        '<div class="history-empty"><i class="ti ti-search-off"></i><p>No past questions match "' +
        escapeHtml(term) +
        '".</p></div>';
      return;
    }

    list.innerHTML = "";
    filtered.forEach(function (entry) {
      var item = document.createElement("div");
      item.className = "history-item";
      item.innerHTML =
        '<div class="history-item-q"><i class="ti ti-corner-down-right"></i> ' +
        escapeHtml(entry.query) +
        "</div>" +
        '<div class="history-item-time">' +
        relativeTime(entry.ts) +
        " · Workforce Geospatial</div>";
      item.addEventListener("click", function () { replayHistoryEntry(entry.id); });
      list.appendChild(item);
    });
  }

  function replayHistoryEntry(id) {
    var entry = conversationHistory.find(function (e) { return e.id === id; });
    if (!entry) return;

    if (window.LmoGeo && LmoGeo.applyAIRegions) {
      LmoGeo.applyAIRegions(entry.data.regions || []);
    }

    addResponseCard(entry.query, entry.data);
    toggleHistoryDrawer(false);
  }

  function clearHistory() {
    conversationHistory = [];
    renderHistoryList();
  }

  function init() {
    CHARTS_ENABLED = initChartLibrary();

    var input = document.getElementById("aiInput");
    var sendBtn = document.getElementById("aiSendBtn");
    var historyBtn = document.getElementById("aiHistoryBtn");
    var historyClose = document.getElementById("historyCloseBtn");
    var historyClear = document.getElementById("historyClearBtn");
    var historySearch = document.getElementById("historySearchInput");
    var historyBackdrop = document.getElementById("historyBackdrop");
    var exploreClose = document.getElementById("exploreCloseBtn");
    var exploreBackdrop = document.getElementById("exploreBackdrop");
    var exploreSend = document.getElementById("exploreSendBtn");
    var exploreInput = document.getElementById("exploreChatInput");

    if (sendBtn) sendBtn.addEventListener("click", sendAIQuery);
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") sendAIQuery();
      });
    }
    if (historyBtn) historyBtn.addEventListener("click", function () { toggleHistoryDrawer(); });
    if (historyClose) historyClose.addEventListener("click", function () { toggleHistoryDrawer(false); });
    if (historyClear) historyClear.addEventListener("click", clearHistory);
    if (historyBackdrop) historyBackdrop.addEventListener("click", function () { toggleHistoryDrawer(false); });
    if (historySearch) {
      historySearch.addEventListener("input", function () { renderHistoryList(historySearch.value); });
    }
    if (exploreClose) exploreClose.addEventListener("click", closeExplorePanel);
    if (exploreBackdrop) exploreBackdrop.addEventListener("click", closeExplorePanel);
    if (exploreSend) exploreSend.addEventListener("click", sendExploreQuery);
    if (exploreInput) {
      exploreInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendExploreQuery();
        }
      });
      exploreInput.addEventListener("input", function () { autoResizeExploreInput(exploreInput); });
    }

    window.addEventListener("resize", function () {
      var card = document.getElementById("aiMapCard");
      if (card) positionMapCardDocked(card);
      if (window.LmoGeo && LmoGeo.resizeMap) LmoGeo.resizeMap();
    });

    renderHistoryList();
    if (window.LMO && LMO.onThemeChange) {
      LMO.onThemeChange(function () {
        initChartLibrary();
      });
    }
  }

  window.LmoGeoAI = {
    init: init,
    sendAIQuery: sendAIQuery,
    askAI: askAI,
    openExplorePanel: openExplorePanel,
    closeExplorePanel: closeExplorePanel,
    removeMapInsightCard: removeMapInsightCard,
    toggleHistoryDrawer: toggleHistoryDrawer
  };

  if (window.__lmoGeoAiInit) return;
  window.__lmoGeoAiInit = true;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
