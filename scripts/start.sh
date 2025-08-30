#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Smart Library System Startup Script${NC}"
echo -e "${BLUE}=====================================${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists java; then
    echo -e "${RED}❌ Java is not installed. Please install Java 17 or higher.${NC}"
    exit 1
fi

if ! command_exists mvn; then
    echo -e "${RED}❌ Maven is not installed. Please install Maven 3.6 or higher.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are installed!${NC}"

# Function to start backend
start_backend() {
    echo -e "${YELLOW}🔧 Starting Spring Boot backend...${NC}"
    cd backend
    
    # Check if target directory exists, if not, compile first
    if [ ! -d "target" ]; then
        echo -e "${YELLOW}📦 Compiling backend for the first time...${NC}"
        mvn clean compile
    fi
    
    echo -e "${GREEN}🏃 Running Spring Boot application...${NC}"
    mvn spring-boot:run &
    BACKEND_PID=$!
    cd ..
    
    echo -e "${GREEN}✅ Backend started with PID: $BACKEND_PID${NC}"
    echo -e "${BLUE}📍 Backend running at: http://localhost:8080${NC}"
    echo -e "${BLUE}📍 API Documentation: http://localhost:8080/swagger-ui.html${NC}"
    echo -e "${BLUE}📍 H2 Console: http://localhost:8080/h2-console${NC}"
}

# Function to start frontend
start_frontend() {
    echo -e "${YELLOW}🎨 Starting React frontend...${NC}"
    cd frontend
    
    # Check if node_modules exists, if not, install dependencies
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
        npm install
    fi
    
    echo -e "${GREEN}🏃 Starting React development server...${NC}"
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo -e "${GREEN}✅ Frontend started with PID: $FRONTEND_PID${NC}"
    echo -e "${BLUE}📍 Frontend running at: http://localhost:3000${NC}"
}

# Function to cleanup processes
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping services...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Backend stopped${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Frontend stopped${NC}"
    fi
    
    # Kill any remaining processes on ports 8080 and 3000
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    
    echo -e "${BLUE}👋 Smart Library System stopped. Goodbye!${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start services
start_backend
sleep 5  # Give backend time to start

start_frontend

echo -e "\n${GREEN}🎉 Smart Library System is now running!${NC}"
echo -e "${BLUE}📱 Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}🔧 Backend API: http://localhost:8080${NC}"
echo -e "${BLUE}📚 API Docs: http://localhost:8080/swagger-ui.html${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for user to stop the services
wait
