@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo    PIPI - Aprende jugando
echo ============================================
echo.

where py >nul 2>nul
if %errorlevel%==0 goto :pyrun

where python >nul 2>nul
if %errorlevel%==0 goto :pythonrun

where node >nul 2>nul
if %errorlevel%==0 goto :noderun

echo No se encontro Python ni Node.
echo.
echo Opciones:
echo   1) Instala Python desde https://www.python.org
echo   2) O simplemente abre el archivo index.html
echo.
pause
exit /b

:pyrun
start "" http://localhost:8000
py -m http.server 8000
exit /b

:pythonrun
start "" http://localhost:8000
python -m http.server 8000
exit /b

:noderun
start "" http://localhost:8000
node server.js
exit /b
