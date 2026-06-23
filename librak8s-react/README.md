# LibraK8s React

Interface web de gestion de bibliothèque — support TP Kubernetes.  
Consomme l'API Spring Boot `librak8s-api`.

## Stack

| Outil | Rôle |
|---|---|
| React 18 + Vite | Framework UI + bundler |
| TypeScript | Typage statique |
| React Router v6 | Navigation SPA |
| TanStack Query v5 | Cache serveur / état asynchrone |
| Axios | Appels HTTP + intercepteurs JWT |
| React Hook Form + Zod | Formulaires + validation |
| Tailwind CSS + shadcn/ui | Styling |
| Zustand | État global (auth) |

---

## Prérequis

- Node.js ≥ 20
- npm ≥ 10
- Backend Spring Boot `librak8s-api` sur `http://localhost:8080`

---

## Installation

```bash
cd librak8s-react
npm install
```

---

## Lancer en développement

Le backend doit être accessible sur `http://localhost:8080`.  
Le proxy Vite redirige automatiquement `/api/*` vers le backend.

```bash
npm run dev
# → http://localhost:5173
```

---

## Build de production

```bash
npm run build
# Le dossier dist/ contient les assets statiques
```

---

## Lancer avec Docker

### Build de l'image

```bash
docker build -t librak8s-react:latest .
```

### Lancer le conteneur (standalone)

```bash
docker run -p 80:80 librak8s-react:latest
# → http://localhost
```

### Docker Compose (avec le backend)

```yaml
services:
  librak8s-api:
    image: librak8s-api:latest
    ports:
      - "8080:8080"

  librak8s-react:
    image: librak8s-react:latest
    ports:
      - "80:80"
    depends_on:
      - librak8s-api
```

> En production Docker/K8s, nginx proxifie `/api/` vers `http://librak8s-api:8080/api/` automatiquement via `nginx.conf`.

---

## Variables d'environnement

| Variable | Fichier | Valeur |
|---|---|---|
| `VITE_API_URL` | `.env.development` | `http://localhost:8080` |
| `VITE_API_URL` | `.env.production` | `http://librak8s-api` |

Pour surcharger en build :

```bash
VITE_API_URL=https://api.mon-domaine.com npm run build
```

---

## Credentials de démo

| Utilisateur | Mot de passe | Rôle |
|---|---|---|
| `admin` | `admin123` | `ROLE_ADMIN` |
| `user` | `user123` | `ROLE_USER` |

L'admin peut **ajouter** et **supprimer** des livres.  
Tous les utilisateurs connectés peuvent **emprunter** et **retourner** des livres.

---

## Architecture

```
src/
├── app/           # Router, entry point, route guards
├── features/      # auth / books / loans (types, api, hooks, components)
├── shared/        # Navbar, Loader, ErrorBoundary, axios, queryClient, Zustand
├── pages/         # LoginPage, RegisterPage, BooksPage, BookDetailPage, MyLoansPage
├── components/ui/ # Primitives shadcn/ui (Button, Card, Dialog, Toast…)
└── types/         # Types génériques API
```

---

## Déploiement Kubernetes (exemple)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: librak8s-react
spec:
  replicas: 2
  selector:
    matchLabels:
      app: librak8s-react
  template:
    metadata:
      labels:
        app: librak8s-react
    spec:
      containers:
        - name: librak8s-react
          image: librak8s-react:latest
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: librak8s-react
spec:
  selector:
    app: librak8s-react
  ports:
    - port: 80
      targetPort: 80
  type: LoadBalancer
```
