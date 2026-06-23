# ─── Stage 1 : Build ────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Téléchargement des dépendances en cache séparé
COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn package -DskipTests -q

# ─── Stage 2 : Runtime ──────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Utilisateur non-root pour la sécurité
RUN addgroup -S librak8s && adduser -S librak8s -G librak8s
USER librak8s

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
