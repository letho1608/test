@echo off
title Vo Han Trung Sinh - Dong Goi & Chong Hack
echo ========================================================
echo    DANG DONG GOI VA LAM ROI MA NGUON (ANTI-HACK)
echo ========================================================
echo.
node build.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Co loi xay ra trong qua trinh dong goi!
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo [V] Da dong goi thanh cong vao thu muc /dist !
echo.
pause
