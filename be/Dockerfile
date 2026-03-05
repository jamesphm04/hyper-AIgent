# Java 21 LTS
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY target/hyper-aigent-backend.jar ./hyper-aigent-backend.jar

EXPOSE 8080

CMD ["java", "-jar", "hyper-aigent-backend.jar"]