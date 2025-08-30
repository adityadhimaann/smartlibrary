@echo off
setlocal enabledelayedexpansion

echo.
echo 🚀 Smart Library System Startup Script
echo =====================================

REM Check prerequisites
echo 📋 Checking prerequisites...

where java >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Java is not installed. Please install Java 17 or higher.
    pause
    exit /b 1
)

where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Maven is not installed. Please install Maven 3.6 or higher.
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ All prerequisites are installed!

REM Start backend
echo.
echo 🔧 Starting Spring Boot backend...
cd backend

if not exist "target" (
    echo 📦 Compiling backend for the first time...
    call mvn clean compile
)

echo 🏃 Running Spring Boot application...
start "Backend" cmd /c "mvn spring-boot:run"

cd ..

REM Wait a bit for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 10 /nobreak >nul

REM Start frontend
echo.
echo 🎨 Starting React frontend...
cd frontend

if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
)

echo 🏃 Starting React development server...
start "Frontend" cmd /c "npm start"

cd ..

echo.
echo 🎉 Smart Library System is now running!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8080
echo 📚 API Docs: http://localhost:8080/swagger-ui.html
echo.
echo Press any key to stop all services...
pause >nul

REM Stop services (this is basic - you might want to implement proper process management)
taskkill /f /im "java.exe" 2>nul
taskkill /f /im "node.exe" 2>nul

echo.
echo 👋 Smart Library System stopped. Goodbye!
pause
