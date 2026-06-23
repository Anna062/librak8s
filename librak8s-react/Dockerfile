# ─── Stage 1 : Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances en premier pour profiter du cache Docker
COPY package*.json ./
RUN npm ci

# Copie du reste des sources et build de production
COPY . .
RUN npm run build

# ─── Stage 2 : Serve ───────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Suppression de la conf nginx par défaut
RUN rm -f /etc/nginx/conf.d/default.conf

# Copie du build Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie de la configuration nginx custom
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
