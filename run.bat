@echo off
title 1 in 8 Billion - Local Server
echo ========================================================
echo    1 in 8 Billion (1 trong 8 ty) - Ban chay Offline
echo ========================================================
echo.
echo Dang khoi dong server cuc bo...
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Tim thay Python! Dang khoi dong http://localhost:8080...
    start http://localhost:8080/index.html
    python -m http.server 8080
    exit /b
)

where npx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Tim thay Node.js! Dang khoi dong server...
    start http://localhost:3000
    npx serve -s .
    exit /b
)

echo Khong tim thay Python hoac Node.js, dang mo truc tiep bang trinh duyet...
start index.html
