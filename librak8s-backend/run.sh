#!/usr/bin/env bash
set -euo pipefail

POSTGRES_CONTAINER="librak8s-postgres"
DB_NAME="librak8s"
DB_USER="librak8s"
DB_PASS="librak8s123"
DB_PORT="5433"

# ─── PostgreSQL ──────────────────────────────────────────────────────────────
if docker ps -a --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
  echo "[run.sh] Container '${POSTGRES_CONTAINER}' déjà existant — démarrage si arrêté..."
  docker start "${POSTGRES_CONTAINER}" 2>/dev/null || true
else
  echo "[run.sh] Démarrage d'un nouveau conteneur PostgreSQL..."
  docker run -d \
    --name "${POSTGRES_CONTAINER}" \
    -e POSTGRES_DB="${DB_NAME}" \
    -e POSTGRES_USER="${DB_USER}" \
    -e POSTGRES_PASSWORD="${DB_PASS}" \
    -p "${DB_PORT}:5433" \
    postgres:16-alpine
fi

# ─── Attente que PostgreSQL soit prêt ────────────────────────────────────────
echo "[run.sh] Attente de la disponibilité de PostgreSQL..."
until docker exec "${POSTGRES_CONTAINER}" pg_isready -U "${DB_USER}" -d "${DB_NAME}" -q 2>/dev/null; do
  printf '.'
  sleep 1
done
echo ""
echo "[run.sh] PostgreSQL prêt !"

# ─── Lancement de l'application ──────────────────────────────────────────────
echo "[run.sh] Lancement de LibraK8s (profil dev)..."
mvn spring-boot:run -Pdev

# ─── Nettoyage (Ctrl+C) ──────────────────────────────────────────────────────
trap 'echo "[run.sh] Arrêt..."; docker stop "${POSTGRES_CONTAINER}" 2>/dev/null || true' EXIT
