@echo off
cd /d "%~dp0"
set PORT=8000
echo Serving this folder at http://localhost:%PORT%/
start "" http://localhost:%PORT%/
python -m http.server %PORT% 2>nul || py -m http.server %PORT% 2>nul || npx --yes serve . -l %PORT%
