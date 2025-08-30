#!/bin/bash
# Override any platform auto-detection and force Docker build

# Ensure we're using our Dockerfile
export BUILD_COMMAND="docker build -t app ."
export START_COMMAND="docker run -p \$PORT:8080 app"

# Alternative: Direct Java execution if Docker not available
export JAVA_VERSION="17"
export MAVEN_OPTS="-Xmx1024m"

# Build and run
if command -v docker >/dev/null 2>&1; then
    echo "Using Docker build..."
    docker build -t smartlibrary-backend .
    docker run -p ${PORT:-8080}:8080 -e PORT=${PORT:-8080} smartlibrary-backend
else
    echo "Using direct Java execution..."
    java -Dserver.port=${PORT:-8080} -Dspring.profiles.active=prod -jar target/smart-library-backend-1.0.0.jar
fi
