/**
 * Sync CPI Dashboard markup, CSS, and JS from CPI dashbord.html into index.html.
 *
 * Usage: node scripts/update-cpi-dashboard-section.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const REF_FILE = path.join(ROOT, "CPI dashbord.html");
const INDEX_FILE = path.join(ROOT, "index.html");
const CSS_FILE = path.join(ROOT, "css/pages/cpi-dashboard.css");
const JS_FILE = path.join(ROOT, "js/cpi-dashboard.js");
const PARTIAL_FILE = path.join(ROOT, "partials/cpi-dashboard-main.html");
const SCREEN_ID = "screen-cpi-dashboard";

const ref = fs.readFileSync(REF_FILE, "utf8");

function extractMainBlock(html) {
  const match = html.match(/<main class="main">([\s\S]*?)<\/main>/);
  if (!match) throw new Error('Could not find <main class="main"> in reference file');
  return match[0];
}


function adaptCssForIndexEmbed(css) {
  return css
    .replace(
      /\/\* (?:Sidebar removed — content spans the full width with normal gutters\.|index\.html embed — topic sidebar \+ main content) \*\/[\s\S]*?#screen-cpi-dashboard #cpid-content \{ padding-left: 0; padding-right: 0; \}/,
      `/* index.html embed — topic sidebar + main content */
#${SCREEN_ID} .crisis-scroll > .container {
  padding-inline: var(--page-gutter);
}
#${SCREEN_ID} .page-wrap {
  padding-inline: 0;
  align-items: start;
}
#${SCREEN_ID} .obs-ai-split {
  display: flex;
  flex: 1;
  min-width: 0;
  width: 100%;
  overflow: visible;
}
#${SCREEN_ID} .obs-ai-split > .main {
  flex: 1;
  min-width: 0;
  padding: 0 var(--page-gutter) 32px 24px !important;
  box-sizing: border-box;
}
#${SCREEN_ID} .cpi-page-header {
  padding: 24px 0 0;
}
#${SCREEN_ID} #cpid-content {
  padding-top: 32px;
}`
    )
    .replace(
      `#${SCREEN_ID} .cpi-page-header { padding: 24px var(--page-gutter) 0; }`,
      `#${SCREEN_ID} .cpi-page-header { padding: 24px 0 0; }`
    )
    .replace(
      `#${SCREEN_ID} .cpi-page-header { padding: 8px 0 0; }`,
      `#${SCREEN_ID} .cpi-page-header { padding: 24px 0 0; }`
    );
}

function patchIndexHtml(indexHtml, mainBlock) {
  const re = new RegExp(
    `(<div id="${SCREEN_ID}"[\\s\\S]*?<div class="obs-ai-split">\\s*)<main[\\s\\S]*?</main>`,
    "m"
  );
  if (!re.test(indexHtml)) {
    throw new Error(`Could not locate <main> inside #${SCREEN_ID} .obs-ai-split in index.html`);
  }
  return indexHtml.replace(re, `$1${mainBlock}`);
}

function extractStyleBlock(html) {
  const match = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!match) throw new Error("Could not find <style> block in reference file");
  return match[1];
}

function extractScriptBlock(html) {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  const block = scripts.find((m) => m[1].includes("CPID_QUARTERS"));
  if (!block) throw new Error("Could not find CPI dashboard <script> block in reference file");
  return block[1];
}

function normalizeCss(raw) {
  return raw
    .replace(/#screen-cpi-obs/g, `#${SCREEN_ID}`)
    .replace(/^      /gm, "")
    .trim();
}

function mainInnerHtml(mainBlock) {
  return mainBlock.replace(/^<main class="main">\s*/i, "").replace(/\s*<\/main>\s*$/i, "").trim();
}

function adaptJsForIndex(raw) {
  let js = raw
    .replace(/^      /gm, "")
    .replace(/#screen-cpi-obs/g, `#${SCREEN_ID}`)
    .trim();

  js = js.replace(
    /\/\* =+\s*\n\s*Standalone stubs[\s\S]*?function toast\(\) \{\}\s*\n\s*/m,
    ""
  );

  js = js.replace(
    /\/\* ── Boot ── \*\/[\s\S]*?document\.addEventListener\("DOMContentLoaded"[\s\S]*?\n\}\);\s*/m,
    ""
  );

  js = js.replace(
    /document\.querySelectorAll\("\.prod-filter-dd\[data-dd\]"\)/g,
    `document.querySelectorAll("#${SCREEN_ID} .prod-filter-dd[data-dd]")`
  );
  js = js.replace(
    /document\.querySelector\("\.cpid-filters \.bm-region-seg"\)/g,
    `document.querySelector("#${SCREEN_ID} .cpid-filters .bm-region-seg")`
  );
  js = js.replace(
    /document\.querySelectorAll\("\.cpid-ot-seg \.bm-seg-btn"\)/g,
    `document.querySelectorAll("#${SCREEN_ID} .cpid-ot-seg .bm-seg-btn")`
  );
  js = js.replace(
    /document\.querySelectorAll\("\.cpid-region-card\[role=\"tab\"\]"\)/g,
    `document.querySelectorAll("#${SCREEN_ID} .cpid-region-card[role=\\"tab\\"]")`
  );
  js = js.replace(
    /const dd = document\.querySelector\(`\.prod-filter-dd\[data-dd="\$\{which\}"\]`\)/g,
    `const dd = document.querySelector(\`#${SCREEN_ID} .prod-filter-dd[data-dd="\${which}"]\`)`
  );
  js = js.replace(
    /document\.querySelectorAll\("\.cpid-view-tab\[data-tab\]"\)/g,
    `document.querySelectorAll("#${SCREEN_ID} .cpid-view-tab[data-tab]")`
  );
  js = js.replace(
    /document\.querySelectorAll\("#cpid-content section\[data-panel\]"\)/g,
    `document.querySelectorAll("#${SCREEN_ID} #cpid-content section[data-panel]")`
  );

  const wrapper = `
function cpidDestroyCharts() {
  if (typeof cpidCharts === "undefined") return;
  Object.keys(cpidCharts).forEach(function (k) {
    try { if (cpidCharts[k]) cpidCharts[k].destroy(); } catch (e) {}
    delete cpidCharts[k];
  });
  var head = document.getElementById("cpidMatrixHead");
  if (head) delete head.dataset.ready;
  ["cpidRelQoq", "cpidRelYoy"].forEach(function (id) {
    var tb = document.getElementById(id);
    if (tb) delete tb.dataset.ready;
  });
  document.querySelectorAll("#${SCREEN_ID} .cpid-region-card").forEach(function (tab) {
    delete tab.dataset.bound;
  });
  var years = document.getElementById("cpidGrYears");
  if (years) years.innerHTML = "";
}

function initCpiDashboardScreen() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js not loaded — CPI dashboard charts skipped");
    return;
  }
  Chart.defaults.font.family = "Inter, system-ui, sans-serif";
  Chart.defaults.font.size = 11;
  cpidDestroyCharts();
  cpidInit();
  document.querySelectorAll("#${SCREEN_ID} .cpid-view-tab[data-tab]").forEach(function (b) {
    if (b.dataset.cpidBound) return;
    b.dataset.cpidBound = "1";
    b.addEventListener("click", function () { cpidActivateTab(b.dataset.tab); });
  });
  if (!window._cpidFiltersInited) {
    window._cpidFiltersInited = true;
    cpidInitFilters();
  }
  if (!window._cpidThemeObs) {
    window._cpidThemeObs = new MutationObserver(function () {
      var screen = document.getElementById("${SCREEN_ID}");
      if (!screen || !screen.classList.contains("active")) return;
      cpidDestroyCharts();
      cpidInit();
      var active = document.querySelector("#${SCREEN_ID} .cpid-view-tab[data-tab].active");
      if (active) cpidActivateTab(active.dataset.tab);
    });
    window._cpidThemeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
  var active = document.querySelector("#${SCREEN_ID} .cpid-view-tab[data-tab].active");
  if (active) cpidActivateTab(active.dataset.tab);
}
window.initCpiDashboardScreen = initCpiDashboardScreen;
window.cpidActivateTab = cpidActivateTab;
window.cpidToggleDd = cpidToggleDd;
`;

  return `/* CPI Dashboard — synced from CPI dashbord.html */\n${js.trim()}\n\n${wrapper.trim()}\n`;
}

const mainBlock = extractMainBlock(ref);
const css = adaptCssForIndexEmbed(normalizeCss(extractStyleBlock(ref)));
const js = adaptJsForIndex(extractScriptBlock(ref));
const partial = mainInnerHtml(mainBlock);

fs.writeFileSync(CSS_FILE, `${css}\n`, "utf8");
fs.writeFileSync(JS_FILE, js, "utf8");
fs.writeFileSync(PARTIAL_FILE, `${partial}\n`, "utf8");

const indexHtml = fs.readFileSync(INDEX_FILE, "utf8");
const updatedIndex = patchIndexHtml(indexHtml, mainBlock);
fs.writeFileSync(INDEX_FILE, updatedIndex, "utf8");

console.log("Updated:");
console.log(" -", path.relative(ROOT, INDEX_FILE));
console.log(" -", path.relative(ROOT, CSS_FILE));
console.log(" -", path.relative(ROOT, JS_FILE));
console.log(" -", path.relative(ROOT, PARTIAL_FILE));
