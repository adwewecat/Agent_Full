<#
.SYNOPSIS
    Script khởi chạy dự án Agent_Full 3D AI Agent Dashboard trên PowerShell.

.DESCRIPTION
    Tự động kiểm tra môi trường Node.js, kiểm tra gói cài đặt node_modules
    và khởi chạy máy chủ phát triển Vite với cổng mặc định http://localhost:3000.
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Agent_Full - 3D AI Agent Dashboard"

Write-Host ""
Write-Host " ==================================================================" -ForegroundColor Cyan
Write-Host "    🤖 AGENT_FULL - 3D AI AGENT OFFICE DASHBOARD (GOD-VIEW)" -ForegroundColor Yellow
Write-Host " ==================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Kiểm tra Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host " [!] LỖI: Chưa cài đặt Node.js trên máy!" -ForegroundColor Red
    Write-Host " [*] Vui lòng tải và cài đặt Node.js tại: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host " Nhấn Enter để thoát..."
    exit 1
}

# 2. Kiểm tra dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host " [*] Thư mục node_modules chưa tồn tại. Đang chạy npm install..." -ForegroundColor Yellow
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) {
        Write-Host " [!] Cài đặt dependencies thất bại!" -ForegroundColor Red
        Read-Host " Nhấn Enter để thoát..."
        exit 1
    }
    Write-Host " [OK] Cài đặt dependencies thành công!" -ForegroundColor Green
    Write-Host ""
}

# 3. Khởi động Dev Server
Write-Host " [*] Đang khởi chạy 3D Dashboard tại http://localhost:3000 ..." -ForegroundColor Cyan
Write-Host " [*] Nhấn Ctrl + C để dừng máy chủ bất kỳ lúc nào." -ForegroundColor DarkGray
Write-Host ""

& npm.cmd run dev
