#!/bin/bash

# Smart Library System Startup Script
echo "🚀 Starting Smart Library System..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Function to cleanup background processes on script exit
cleanup() {
    echo "🛑 Stopping services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Backend
echo "📚 Starting Backend Service..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID) - will be available at http://localhost:8080"

# Wait a moment for backend to initialize
sleep 5

# Start Frontend
echo "🎨 Starting Frontend Service..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID) - will be available at http://localhost:3000"

echo ""
echo "🎉 Smart Library System is now running!"
echo "📖 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8080"
echo "📋 API Documentation: http://localhost:8080/swagger-ui.html"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes to finish
wait $BACKEND_PID
wait $FRONTEND_PID
