# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Bayaan 5.0 — a static HTML/CSS/JS prototype of SCAD's "Bayaan" statistical workspace (CPI, Labor Market Observatory, Geo View, Widget/Agent Studio, Government Data Hub, etc.). No framework, no build tool, no package.json, no test suite. Everything is hand-authored HTML/CSS/vanilla JS.

## Running it

Must be served over `http://localhost`, never opened as `file://` — `file://` documents each get their own origin, so `localStorage` (theme, favourites, widget library, active screen) stops syncing across pages.

```bash
node scripts/serve.js 5500
```
or double-click `serve.bat` (same thing). Then open `http://localhost:5500/index.html`.

Claude Code's own preview config (`.claude/launch.json`) runs `.claude/static-server.js` on port 5599 — equivalent tiny static file server, used automatically by the `preview_start` tool.

There is no lint/test/build command for the app itself — the only scripts are the sync utilities below.

## Architecture

### `index.html` is the app

A single ~46k-line, ~2MB file. It is a multi-"screen" SPA: each major surface is a `<div id="screen-*">` (e.g. `screen-home`, `screen-cpi-dashboard`, `screen-geo-view`, `screen-lmo-obs`, `screen-govdata`, `screen-editor`, `screen-products`). Screens are shown/hidden by toggling an `active` class; there is **no central router** — each nav item calls its own handler (e.g. `openGeoView(event)` in `js/header.js`'s `NAV_ITEMS`), and `js/header.js` (`BayaanHeader.syncActive(screenId)`) drives which topnav item is highlighted via `TOPNAV_ACTIVE_MAP` / `COMMON_TOPNAV_SCREENS`.

Two screens are embedded as **iframes**, not native markup: `lmoObsFrame` (Labor Market Observatory, pointing at `lmo/*.html`) and `geoObsFrame` (Geo View). `js/theme.js` explicitly bridges theme state across these iframe boundaries (see below) — anything cross-cutting (theme, language) touching those screens must go through the same iframe-aware path, not just `document`.

### Prototype → app "sync" workflow

Root-level files like `CPI dashbord.html`, `LaborMarketObservatory.html`, `bayaan-workbench-v4.html`, `bayaan-widget-studio-v1.html`, `geo-view-ai-v3.html`, `benchmark.html`, `trade.html`, `forecast.html`, `observe.html` are **standalone design prototypes**, not live app code. They are the source of truth for a screen's markup/CSS/JS, then manually synced into `index.html` via one-off scripts in `scripts/`:

- `scripts/update-cpi-dashboard-section.js` — reads `CPI dashbord.html`, extracts its `<main class="main">` block, adapts the CSS, and writes the result into `index.html`'s `#screen-cpi-dashboard`, `css/pages/cpi-dashboard.css`, `js/cpi-dashboard.js`, and `partials/cpi-dashboard-main.html`.
- `scripts/build-cpi-template.js` — compiles `partials/cpi-dashboard-main.html` into `js/cpi-dashboard-template.js` as a template-literal string assigned to `window.CPID_DASHBOARD_MAIN_HTML`.

If you edit CPI dashboard content, edit `CPI dashbord.html` (or the partial) and re-run these — don't hand-edit the generated `window.CPID_*` string in `js/cpi-dashboard-template.js` or the embedded copy inside `index.html` directly, they'll drift out of sync. Other screens (Agent Studio, ETL Studio) follow the same "big HTML fragment as a `window.WB_*_HTML` template string" pattern (`wb-agent-studio.js`, `wb-etl-studio.js`) but currently have no automated sync script — those are synced by hand from their `bayaan-*-studio*.html` prototypes.

`scripts/cleanup-unused-files.ps1` deletes a known list of superseded prototype files (old landing pages, dark-mode drafts, etc.) — re-runnable/safe, only removes files still present.

### `lmo/` — Labor Market Observatory

Standalone pages (`lmo-observe.html`, `lmo-diagnose.html`, `lmo-briefing-desk.html`, `lmo-forecasting_v2.html`, `lmo-geospatial.html`, `lmo-simulation.html`, `lmo-indicator-detail.html`, `lmo-insight-detail.html`) plus matching `lmo-*.js`/`.css`. These render both as their own pages (opened directly) and hosted inside `index.html`'s `lmoObsFrame` iframe. `js/lmo-chrome.js` decides which: `isHosted()` (`window.parent !== window`) and `isEmbed()` (`?embed=1`) suppress the shared header/topnav when framed. `lmo/data/*.geojson` + `*-data.js` back the regional map views. Superseded drafts live under `lmo/old/` and `css/pages/old/`.

### Shared chrome, injected at runtime

- `js/header.js` — builds the topnav for every "ws-screen" page (index.html screens and standalone pages alike), including nav items, language switch, notifications, profile menu.
- `js/footer.js` — fetches `components/bayaan-products-footer.html` and injects it; falls back to an inline copy if the fetch fails (relevant under `file://` or on standalone pages served from a different relative path).
- `js/section-scroll-spy.js` — shared scrollspy/dot-nav used by long single-scroll pages (e.g. home).
- `js/studio-chat-helpers.js` — shared AI-chat bubble/avatar helpers used by the various "studio"/builder chat panes.

### Cross-page state (`localStorage`, `bayaan*` keys)

Pages are independent documents that coordinate purely through `localStorage` + `storage`/custom events — there's no shared JS runtime across standalone pages. Key conventions:

- `bayaan-theme` — light/dark, read/written by `js/theme.js` (`window.BayaanTheme`). Applies `data-theme` to `<html>`/`<body>`, re-broadcasts to embedded iframes via `postMessage({type:"bayaan-theme"})` and to other tabs/pages via the native `storage` event.
- `bayaanFavourites` — written by `index.html`, read by `favourites.html` (`js/favourites-page.js`) and by standalone product pages via `js/favourites-shared.js` (any bookmark icon with `data-fav-toggle`/`data-fav-store`/`data-fav-id`).
- `bayaan_widget_library_v1` — widgets built in Widget Studio, read by the home page widget picker (`js/widget-library.js`, fires `bayaan-widget-library-change`).
- `bayaanActiveScreen`, `bayaan-lang`, `bayaanOpenBuiltWidget`, `bayaanOpenStudioGallery`, `bayaanIndicatorDetailName` — smaller pieces of cross-page/cross-reload navigation state.

When adding a feature that must work both inside `index.html` and as a standalone page, follow this localStorage-plus-event pattern rather than assuming a shared global.

### Styling

- `css/variables.css` — primitive tokens (color ramps, spacing).
- `css/theme.css` — semantic light/dark mapping on top of the primitives (`data-theme` attribute driven).
- `style.css` — main app stylesheet (large, general-purpose).
- `css/pages/*.css` — one file per screen/page (`cpi-dashboard.css`, `ai.css`, `lmo-*.css`, etc.), loaded piecemeal by whichever page needs it.
- `css/components/*.css` — shared injected components (e.g. footer).

Always style via the existing CSS variables rather than hardcoding colors, so `js/theme.js`'s `BayaanTheme.chartColor`/`chartPalette`/`cssVar` helpers (used to theme Chart.js/Highcharts) keep working.

### Charting

Chart.js and Highcharts are both loaded from CDN `<script>` tags (no local copies, no bundler). `BayaanTheme.chartTheme()`/`chartPalette()` in `js/theme.js` pull current theme colors so charts re-theme on light/dark toggle.
