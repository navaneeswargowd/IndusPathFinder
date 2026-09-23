# ==========================================
# Stage 1: Build Spring Boot Application
# ==========================================
FROM maven:3.9.9-eclipse-temurin-17 AS builder
 
WORKDIR /app
 
# Copy Maven configuration first
COPY pom.xml .
 
# Download dependencies
RUN mvn dependency:go-offline -B
 
# Copy project source
COPY src ./src
 
# Build application
RUN mvn clean package -DskipTests
 
 
# ==========================================
# Stage 2: Run Spring Boot Application
# ==========================================
FROM eclipse-temurin:17-jre
 
# Install fonts required by JasperReports
RUN apt-get update && \
    apt-get install -y \
        fontconfig \
        fonts-dejavu \
        fonts-liberation \
&& \
    rm -rf /var/lib/apt/lists/*
 
WORKDIR /app
 
# Copy Spring Boot JAR
COPY --from=builder /app/target/*.jar app.jar
 
# Spring Boot port
EXPOSE 8080
 
# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]
