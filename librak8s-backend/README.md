# LibraK8s — API de gestion de bibliothèque

API REST Spring Boot conçue comme support de TP Kubernetes.  
Architecture **DDD hexagonale**, sécurité **JWT**, documentation **Swagger UI**.

---

## Stack technique

| Composant       | Choix                          |
|-----------------|-------------------------------|
| Language        | Java 21                        |
| Framework       | Spring Boot 3.3.4              |
| Build           | Maven                          |
| Base de données | PostgreSQL 16                  |
| Auth            | JWT (jjwt 0.12.6)             |
| Docs API        | SpringDoc OpenAPI 3 (Swagger)  |
| Monitoring      | Spring Actuator                |

---

## Lancer en local

### Prérequis
- Java 21+
- Maven 3.9+
- Docker Desktop

### Option 1 — Script tout-en-un

```bash
chmod +x run.sh
./run.sh
```

Le script démarre un conteneur PostgreSQL puis lance l'application en profil `dev`.

### Option 2 — Manuelle

```bash
# 1. Démarrer PostgreSQL
docker run -d \
  --name librak8s-postgres \
  -e POSTGRES_DB=librak8s \
  -e POSTGRES_USER=librak8s \
  -e POSTGRES_PASSWORD=librak8s123 \
  -p 5432:5432 \
  postgres:16-alpine

# 2. Lancer l'application
mvn spring-boot:run -Pdev
```

### Option 3 — Image Docker (prod)

```bash
# Build
docker build -t librak8s:latest .

# Run (avec PostgreSQL séparé)
docker run -d \
  --name librak8s-app \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_HOST=host.docker.internal \
  -e DB_USERNAME=librak8s \
  -e DB_PASSWORD=librak8s123 \
  -e JWT_SECRET=<votre-secret-base64-256bits> \
  librak8s:latest
```

---

## Credentials de démo

| Utilisateur | Mot de passe | Rôle       |
|-------------|--------------|------------|
| `admin`     | `admin123`   | ROLE_ADMIN |
| `user`      | `user123`    | ROLE_USER  |

> Ces comptes sont créés automatiquement au premier démarrage via `DataInitializer`.

---

## URLs

| Service      | URL                                          |
|--------------|----------------------------------------------|
| Swagger UI   | http://localhost:8080/swagger-ui.html        |
| OpenAPI JSON | http://localhost:8080/api-docs               |
| Health       | http://localhost:8080/actuator/health        |
| Info         | http://localhost:8080/actuator/info          |
| Metrics      | http://localhost:8080/actuator/metrics       |

---

## Flow complet : register → login → appel authentifié

### 1. Créer un compte

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "alice123", "role": "USER"}'
```

Réponse : `201 Created`

---

### 2. Se connecter (obtenir un JWT)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "alice123"}'
```

Réponse :
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

---

### 3. Lister les livres (requête authentifiée)

```bash
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

curl http://localhost:8080/api/books \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Emprunter un livre

```bash
curl -X POST http://localhost:8080/api/loans \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookId": 1}'
```

---

### 5. Voir mes emprunts

```bash
curl http://localhost:8080/api/loans/my \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6. Retourner un livre

```bash
curl -X PUT http://localhost:8080/api/loans/1/return \
  -H "Authorization: Bearer $TOKEN"
```

---

### 7. (Admin) Ajouter un livre

```bash
ADMIN_TOKEN="<token de admin>"

curl -X POST http://localhost:8080/api/books \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kubernetes in Action",
    "author": "Marko Luksa",
    "isbn": "978-1617293726",
    "totalCopies": 5
  }'
```

---

## Architecture DDD

```
src/main/java/com/librak8s/
├── domain/
│   ├── model/        ← Entités pures Java (0 dépendance Spring/JPA)
│   ├── port/         ← Interfaces (contrats des repositories et services)
│   └── exception/    ← Exceptions métier
├── application/
│   ├── service/      ← Use cases
│   └── dto/          ← Request/Response DTOs (Java records)
├── infrastructure/
│   ├── persistence/  ← Entités JPA + adapters
│   ├── security/     ← JWT, filtres, UserDetailsService
│   └── config/       ← SecurityConfig, OpenApiConfig
└── exposition/
    └── rest/         ← Controllers REST + GlobalExceptionHandler
```

**Règle clé** : `domain/` n'importe rien de Spring ou JPA.  
Les `@Entity` vivent uniquement dans `infrastructure/persistence/`.

---

## Variables d'environnement (prod)

| Variable             | Défaut          | Description                    |
|----------------------|-----------------|--------------------------------|
| `DB_HOST`            | `localhost`     | Hôte PostgreSQL                |
| `DB_PORT`            | `5432`          | Port PostgreSQL                |
| `DB_NAME`            | `librak8s`      | Nom de la base                 |
| `DB_USERNAME`        | `librak8s`      | Utilisateur DB                 |
| `DB_PASSWORD`        | `librak8s123`   | Mot de passe DB                |
| `JWT_SECRET`         | (valeur dev)    | Secret HMAC-SHA256 en Base64   |
| `JWT_EXPIRATION`     | `86400000`      | Durée du token (ms)            |

---

## Sondes Kubernetes

```yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 40
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 20
  periodSeconds: 5
```
