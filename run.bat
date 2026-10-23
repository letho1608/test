@echo off
title Vo Han Trung Sinh - He Thong Khoi Chay
:MENU
cls
echo ========================================================
echo         VO HAN TRUNG SINH - HE THONG KHOI CHAY
echo ========================================================
echo.
echo   [1] Khoi chay Ban Bao Mat Chong Hack (Production /dist)
echo   [2] Khoi chay Ban Phat Trien (Source /src)
echo   [3] Dong goi lai Ma Nguon (Rebuild Obfuscation)
echo   [4] Mo file Standalone doc lap (Single File)
echo   [5] Thoat
echo.
set /p opt="Vui long chon [1-5]: "

if "%opt%"=="1" goto RUN_PROD
if "%opt%"=="2" goto RUN_DEV
if "%opt%"=="3" goto REBUILD
if "%opt%"=="4" goto RUN_STANDALONE
if "%opt%"=="5" exit /b
goto MENU

:RUN_PROD
cls
echo Dang khoi dong Ban Bao Mat Chong Hack tai thu muc dist...
if not exist "dist\index.html" (
    echo Khong tim thay ban build! Dang tu dong dong goi...
    call node build.js
)
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Tim thay Python! Dang khoi dong http://localhost:8080...
    start http://localhost:8080/
    python -m http.server 8080 --directory dist
    exit /b
)
where npx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Tim thay Node.js! Dang khoi dong server...
    start http://localhost:3000
    npx serve dist
    exit /b
)
start dist\index.html
exit /b

:RUN_DEV
cls
echo Dang khoi dong Ban Phat Trien (Moc goc)...
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
start index.html
exit /b

:REBUILD
cls
call node build.js
pause
goto MENU

:RUN_STANDALONE
cls
if not exist "dist\standalone.html" (
    echo Dang dong goi file standalone...
    call node build.js
)
start dist\standalone.html
goto MENU
