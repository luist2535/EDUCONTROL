@echo off
chcp 65001 >nul
echo ===================================================
echo   EDUCONTROL - INSTALADOR Y ARRANCADOR IONIC
echo ===================================================
echo.

if not exist "node_modules\" (
    echo [1/2] Instalando dependencias de Ionic y Angular...
    call npm.cmd install
) else (
    echo [1/2] Dependencias detectadas.
)

echo.
echo [2/2] Iniciando servidor de desarrollo Ionic...
echo La aplicacion se abrira en http://localhost:4200
echo.
call npx.cmd ng serve --open
pause
