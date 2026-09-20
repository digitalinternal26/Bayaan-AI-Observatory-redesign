const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.join(__dirname, "../partials/cpi-dashboard-main.html"),
  "utf8"
).trim();
const escaped = html.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
fs.writeFileSync(
  path.join(__dirname, "../js/cpi-dashboard-template.js"),
  "window.CPID_DASHBOARD_MAIN_HTML=`" + escaped + "`;\n",
  "utf8"
);
