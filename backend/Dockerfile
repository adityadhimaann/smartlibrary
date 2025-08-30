FROM openjdk:17-jdk-slim

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the already built JAR file
COPY target/smart-library-backend-1.0.0.jar app.jar

# Expose port (optional, but helpful locally)
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod

# Run application with dynamic port expansion
CMD java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar app.jar
