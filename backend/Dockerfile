FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Copy source code
COPY src ./src

# Build application
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run application
CMD ["java", "-Dspring.profiles.active=prod", "-jar", "target/smart-library-backend-1.0.0.jar"]
