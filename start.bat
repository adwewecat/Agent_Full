@echo off
:: ============================================================================
:: @file start.bat
:: @description File khởi chạy nhanh dự án 3D AI Agent Office Dashboard cho Windows.
:: Tự động kiểm tra Node.js, cài đặt dependencies nếu chưa có và mở trình duyệt.
:: ============================================================================

chcp 65001 > nul
title Agent_Full - 3D AI Agent Dashboard
color 0B

echo.
echo  ==================================================================
echo     🤖 AGENT_FULL - 3D AI AGENT OFFICE DASHBOARD (GOD-VIEW)
echo  ==================================================================
echo.

:: 1. Kiểm tra môi trường Node.js trên máy
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [!] LỖI: Không tìm thấy Node.js trên máy tính của bạn!
    echo  [*] Vui lòng tải và cài đặt Node.js từ https://nodejs.org/ trước khi tiếp tục.
    echo.
    pause
    exit /b 1
)

:: 2. Kiểm tra thư mục node_modules, tự động cài đặt nếu chưa có
if not exist "node_modules\" (
    echo  [*] Phát hiện thư mục node_modules chưa được cài đặt.
    echo  [*] Đang tiến hành cài đặt dependencies (npm install)...
    echo.
    call npm.cmd install
    if %errorlevel% neq 0 (
        echo  [!] Cài đặt dependencies thất bại! Vui lòng kiểm tra kết nối mạng.
        pause
        exit /b 1
    )
    echo  [OK] Cài đặt dependencies hoàn tất!
    echo.
)

:: 3. Khởi chạy Vite Dev Server và mở trình duyệt tự động
echo  [*] Đang khởi chạy 3D Dashboard tại http://localhost:3000 ...
echo  [*] Nhấn Ctrl + C để dừng máy chủ bất kỳ lúc nào.
echo.

call npm.cmd run dev

pause
