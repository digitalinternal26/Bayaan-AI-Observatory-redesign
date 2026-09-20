/* Tiny static file server for local development.
   Opening these pages by double-clicking the .html files loads each one as
   its own file:// document — some browsers (Firefox always, some Chrome
   configurations) give every file:// page its own isolated localStorage, so
   state that's supposed to be shared across pages (favourites, theme, etc.)
   never carries over. Serving the site over http://localhost instead gives
   every page the same origin, so localStorage works the way the app expects.

   Usage: node scripts/serve.js [port]   (defaults to 5500) */
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const port = Number(process.argv[2]) || 5500;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".map": "application/json",
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
  if (reqPath === "/") reqPath = "/index.html";

  const filePath = path.normalize(path.join(root, reqPath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found: " + reqPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Bayaan site running at http://localhost:${port}/index.html`);
  console.log(`Favourites page: http://localhost:${port}/favourites.html`);
  console.log("Press Ctrl+C to stop.");
});
