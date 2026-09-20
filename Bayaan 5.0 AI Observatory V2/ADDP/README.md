# ADDP — standalone

A self-contained copy of the ADDP map app. No dependency on the source repo,
npm, or Vite.

## Running it

**Double-click `index.html`.** That's it — no server, no install.

It also works served over HTTP if you prefer (any static server, from any
subdirectory), but nothing requires it.

## Contents

| Path | What it is |
|---|---|
| `index.html` | Entry point |
| `app.bundle.js` | The whole app, with the Tabler icons inlined |
| `styles.css` | All styles |
| `assets/` | Images and SVGs |
| `data/*.js` | The datasets, wrapped so they load without a server |
| `vendor/` | MapLibre GL 4.7.1, vendored locally |

### Why data/*.js and not data/*.json

Browsers block `fetch()` on `file://`, so a double-clicked page cannot read
sibling `.json` files. A classic `<script src>` is allowed, so each dataset is
wrapped in a tiny JS file that registers its JSON text on a global, and a shim
in `index.html` answers the app's `fetch("data/...")` calls from it. The JSON
inside is unmodified — edit the string in place to change the data.

## Network access

Map tiles come from `tiles.openfreemap.org` and the Inter font from Google
Fonts. Without a connection the panels and data still work, but the basemap is
blank and the font falls back to a system one. There is no offline tile source.

## Rebuilding

From the source repo: `npm run build:standalone`
