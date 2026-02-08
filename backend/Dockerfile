FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -g 1000 appgroup && adduser -u 1000 -G appgroup -D appuser
USER appuser

COPY build/libs/remote-control-api.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
