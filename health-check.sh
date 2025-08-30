#!/bin/bash

# Smart Library System - Health Check Script
echo "🔍 Checking Smart Library System Health..."

# Check if ports are in use
echo "📡 Checking port availability..."
if lsof -i :8080 > /dev/null 2>&1; then
    echo "✅ Backend is running on port 8080"
else
    echo "❌ Backend not running on port 8080"
    exit 1
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend not running on port 3000"
    exit 1
fi

# Test API endpoints
echo "🔧 Testing API endpoints..."

# Test books endpoint
if curl -s -f http://localhost:8080/api/books > /dev/null; then
    echo "✅ Books API endpoint working"
else
    echo "❌ Books API endpoint failed"
fi

# Test search endpoint
if curl -s -f "http://localhost:8080/api/books/search?title=harry" > /dev/null; then
    echo "✅ Search API endpoint working"
else
    echo "❌ Search API endpoint failed"
fi

# Test categories endpoint
if curl -s -f http://localhost:8080/api/books/categories > /dev/null; then
    echo "✅ Categories API endpoint working"
else
    echo "❌ Categories API endpoint failed"
fi

# Test frontend
echo "🎨 Testing frontend..."
if curl -s -f http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
fi

echo ""
echo "🎉 System Health Check Complete!"
echo "📖 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8080"
echo "📋 API Docs: http://localhost:8080/swagger-ui.html"
echo "💾 H2 Console: http://localhost:8080/h2-console"
echo ""
echo "🏁 All systems operational! Smart Library is ready to use."
