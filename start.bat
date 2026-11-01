@echo off
setlocal
cd /d "%~dp0"
title Agent_Full - 3D AI Agent Office Dashboard

echo ==================================================================
echo    AGENT_FULL - 3D AI AGENT OFFICE DASHBOARD [GOD-VIEW]
echo ==================================================================
echo.

:: 1. Kiem tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Khong tim thay Node.js tren may!
    echo Vui long cai dat Node.js tai https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 2. Kiem tra thu muc node_modules
if not exist "%~dp0node_modules\" (
    echo [*] Dang cai dat dependencies, vui long cho...
    call npm.cmd install
    if %errorlevel% neq 0 (
        echo [ERROR] Cai dat dependencies that bai!
        pause
        exit /b 1
    )
    echo [OK] Cai dat dependencies hoan tat!
    echo.
)

:: 3. Khoi chay Vite Dev Server
echo [*] Dang khoi chay 3D Dashboard tai http://localhost:5173 ...
echo [*] Trinh duyet se tu dong mo. Nhan Ctrl+C de dung server.
echo.

call npm.cmd run dev

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Dev server dung hoac xay ra loi!
    pause
)
