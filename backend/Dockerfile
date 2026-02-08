FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app
COPY gradle gradle
COPY gradlew build.gradle settings.gradle ./
COPY src src

RUN chmod +x gradlew && ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -g 1000 appgroup && adduser -u 1000 -G appgroup -D appuser
USER appuser

COPY --from=build /app/build/libs/remote-control-api.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
