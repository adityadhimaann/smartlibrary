#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Smart Library System Setup Script${NC}"
echo -e "${BLUE}====================================${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check Java
if ! command_exists java; then
    echo -e "${RED}❌ Java is not installed. Please install Java 17 or higher.${NC}"
    echo -e "${BLUE}💡 You can download it from: https://adoptium.net/${NC}"
    exit 1
else
    JAVA_VERSION=$(java -version 2>&1 | grep version | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -lt "17" ]; then
        echo -e "${RED}❌ Java version is too old. Please install Java 17 or higher.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Java $JAVA_VERSION is installed${NC}"
fi

# Check Maven
if ! command_exists mvn; then
    echo -e "${RED}❌ Maven is not installed. Please install Maven 3.6 or higher.${NC}"
    echo -e "${BLUE}💡 You can download it from: https://maven.apache.org/download.cgi${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Maven is installed${NC}"
fi

# Check Node.js
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    echo -e "${BLUE}💡 You can download it from: https://nodejs.org/${NC}"
    exit 1
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt "16" ]; then
        echo -e "${RED}❌ Node.js version is too old. Please install Node.js 16 or higher.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js v$(node -v) is installed${NC}"
fi

# Check npm
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm v$(npm -v) is installed${NC}"
fi

echo -e "\n${YELLOW}🔧 Setting up backend dependencies...${NC}"
cd backend

# Clean and compile backend
echo -e "${BLUE}📦 Cleaning and compiling backend...${NC}"
mvn clean compile

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend setup completed successfully${NC}"
else
    echo -e "${RED}❌ Backend setup failed${NC}"
    exit 1
fi

cd ..

echo -e "\n${YELLOW}🎨 Setting up frontend dependencies...${NC}"
cd frontend

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend setup completed successfully${NC}"
else
    echo -e "${RED}❌ Frontend setup failed${NC}"
    exit 1
fi

cd ..

echo -e "\n${GREEN}🎉 Setup completed successfully!${NC}"
echo -e "${BLUE}📝 You can now run the system using:${NC}"
echo -e "${YELLOW}   ./start.sh${NC} (on macOS/Linux)"
echo -e "${YELLOW}   start.bat${NC} (on Windows)"
echo -e "\n${BLUE}📚 Documentation:${NC}"
echo -e "${YELLOW}   README.md${NC} - Complete documentation"
echo -e "\n${BLUE}🌐 URLs when running:${NC}"
echo -e "${YELLOW}   Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}   Backend API: http://localhost:8080${NC}"
echo -e "${YELLOW}   API Documentation: http://localhost:8080/swagger-ui.html${NC}"
echo -e "${YELLOW}   H2 Database Console: http://localhost:8080/h2-console${NC}"

echo -e "\n${GREEN}Happy coding! 🚀${NC}"
