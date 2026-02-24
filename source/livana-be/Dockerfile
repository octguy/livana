# ─── Stage 1: Dependency cache ───────────────────────────────────────────────
# Copy only the Gradle wrapper + build scripts so this layer is reused
# as long as dependencies haven't changed.
FROM eclipse-temurin:25-jdk-noble AS deps

WORKDIR /app

COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle settings.gradle ./

RUN chmod +x gradlew && \
    ./gradlew dependencies --no-daemon --quiet

# ─── Stage 2: Build ──────────────────────────────────────────────────────────
FROM deps AS build

COPY src/ src/

RUN ./gradlew bootJar --no-daemon -x test

# ─── Stage 3: Extract Spring Boot layers ─────────────────────────────────────
# Splits the fat JAR into stable layers (deps → loader → snapshots → app)
# so subsequent image rebuilds only push the changed layer.
FROM eclipse-temurin:25-jdk-noble AS extractor

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

RUN java -Djarmode=layertools -jar app.jar extract

# ─── Stage 4: Runtime ────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jre-noble AS runtime

WORKDIR /app

# Least-volatile layers first so Docker cache is maximally reused
COPY --from=extractor /app/dependencies/ ./
COPY --from=extractor /app/spring-boot-loader/ ./
COPY --from=extractor /app/snapshot-dependencies/ ./
COPY --from=extractor /app/application/ ./

EXPOSE 8080

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
