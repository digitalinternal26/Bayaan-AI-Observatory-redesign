# Removes files not referenced by index.html prototype flow.
# Safe to re-run: only deletes paths that still exist.

$ErrorActionPreference = "Stop"
$DemoRoot = Split-Path $PSScriptRoot -Parent

Set-Location $DemoRoot

$files = @(
    # Standalone / legacy HTML
    "Home1.html",
    "index-v1.html",
    "bayaan-dark.html",
    "bayaan-5-mobile-home (4).html",
    "welcome-screen.html",
    "bayaan-welcome-preferences.html",
    "bayaan-agentic-onboarding.html",
    "settings-submenu.html",
    "geo-intelligence.html",
    "gcc_gdp_trend.html",
    "why-abu-dhabi-inflation-above-target (1).html",
    "bayaan_table_builder.html",
    "bayaan-widget-studio.html",
    "wb-agent-studio.html",
    "wb-etl-studio.html",
    "lmo\lmo-forecasting-v3.html",
    "snippets\home-extra-widgets.html",

    # Dev / temp tooling (this script is kept)
    "build-wb-etl-studio.js",
    "_tmp_main.js",
    "test-results\.last-run.json",
    "bayaan-5.0-demo.code-workspace",
    ".claude\settings.local.json",

    # Orphan CSS
    "css\pages\lmo-forecast-v3.css",

    # Unused assets
    "assets\ae.svg",
    "assets\bh.svg",
    "assets\kw.svg",
    "assets\qa.svg",
    "assets\sa.svg",
    "assets\maps.svg",
    "assets\geo-heatmap.png",
    "assets\geo-heatmap2.png",
    "assets\geo-heatmap-map.png",
    "assets\geo-map.png",
    "assets\prod-filter-tree.png",
    "assets\prod-filter-tree.svg",
    "assets\scad-logo.svg",
    "assets\scad-footer-logo.png",
    "assets\search-icon.svg",
    "assets\search-pointer-icon.svg",
    "assets\close-icon.svg",
    "assets\warning-icon.svg",
    "assets\warning-pointer-icon.svg",
    "assets\the-emirates-falcon.svg",
    "assets\story-1.jpg",
    "assets\story-2.jpg",
    "assets\Why Abu Dhabi's inflation is above target - and what's driving it (1).jpg",
    "assets\The Red Sea effect how a shipping crisis became.jpg",
    "images\emirates icon.svg"
)

$dirs = @(
    "node_modules",
    "test-results",
    "snippets"
)

$removed = 0
$skipped = 0

foreach ($rel in $files) {
    $path = Join-Path $DemoRoot $rel
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Force
        Write-Host "Removed file: $rel"
        $removed++
    } else {
        Write-Host "Skip (missing): $rel"
        $skipped++
    }
}

# Remove legacy migrate scripts (superseded dev tooling)
$legacyScripts = @(
    "scripts\sync-footer.js",
    "scripts\migrate-colors.js",
    "scripts\migrate-js-colors.js",
    "scripts\extract-lmo-page-css.py"
)
foreach ($rel in $legacyScripts) {
    $path = Join-Path $DemoRoot $rel
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Force
        Write-Host "Removed file: $rel"
        $removed++
    }
}

foreach ($rel in $dirs) {
    $path = Join-Path $DemoRoot $rel
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Recurse -Force
        Write-Host "Removed directory: $rel"
        $removed++
    } else {
        Write-Host "Skip dir (missing): $rel"
        $skipped++
    }
}

Write-Host ""
Write-Host "Cleanup complete. Removed: $removed | Skipped/missing: $skipped"
