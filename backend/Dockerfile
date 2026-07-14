# Multi-stage build for Spring Boot with Gradle
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy gradle wrapper and build scripts first for dependency caching
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN chmod +x ./gradlew

# Copy source code and build
COPY src src
RUN ./gradlew build -x test --no-daemon

# Run stage using lightweight JRE
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/build/libs/*SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
