@echo off
title ProjectHub AI - Development Server
color 0A
echo.
echo  ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗██╗  ██╗██╗   ██╗██████╗      █████╗ ██╗
echo  ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██║  ██║██║   ██║██╔══██╗    ██╔══██╗██║
echo  ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████║██║   ██║██████╔╝    ███████║██║
echo  ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ██╔══██║██║   ██║██╔══██╗    ██╔══██║██║
echo  ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ██║  ██║╚██████╔╝██████╔╝    ██║  ██║██║
echo  ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝     ╚═╝  ╚═╝ ╚═╝
echo.
echo  Smart Projects. Better Learning.
echo  ═══════════════════════════════════════════════════════
echo.
echo  Starting Backend API Server (Port 5000)...
start "ProjectHub API" cmd /k "cd /d "%~dp0backend" && node server.js"
timeout /t 3 /nobreak >nul
echo  Starting Frontend Dev Server (Port 5173)...
start "ProjectHub Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo.
echo  ✅ Both servers starting...
echo.
echo  📡 API:      http://localhost:5000
echo  🌐 Frontend: http://localhost:5173
echo  🔑 Admin:    admin@projecthub.ai / Admin@123
echo.
timeout /t 4 /nobreak >nul
start http://localhost:5173
