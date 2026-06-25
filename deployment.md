# Manuel de déploiement — librak8s

> **Projet** : librak8s · React Vite (`librak8s-react`) + Spring Boot (`librak8s-api`) + PostgreSQL  
> **Cloud** : Azure (AKS + ACR + PostgreSQL Flexible Server)  
> **IaC** : Terraform  
> **CI/CD** : GitHub Actions

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Structure du repo](#2-structure-du-repo)
3. [Bootstrap Azure — à faire une seule fois](#3-bootstrap-azure--à-faire-une-seule-fois)
4. [Déploiement de l'infrastructure (Terraform)](#4-déploiement-de-linfrastructure-terraform)
5. [Configuration des secrets GitHub](#5-configuration-des-secrets-github)
6. [Premier déploiement des applications](#6-premier-déploiement-des-applications)
7. [Vérification](#7-vérification)
8. [Déploiements suivants](#8-déploiements-suivants)
9. [Commandes utiles](#9-commandes-utiles)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prérequis

### Outils à installer

```bash
# Terraform
brew install terraform
terraform version   # → Terraform v1.7.x

# Azure CLI
brew install azure-cli
az version          # → azure-cli 2.x

# kubectl
brew install kubectl
kubectl version --client

# Docker Desktop
# → https://www.docker.com/products/docker-desktop/
docker version
```

### Connexion à Azure

```bash
# Connexion interactive (ouvre le navigateur)
az login

# Vérifier que tu es sur la bonne subscription
az account show

# Si plusieurs subscriptions, sélectionner la bonne
az account set --subscription "<SUBSCRIPTION_ID>"
az account show   # vérifier IsDefault: true
```

---

## 2. Structure du repo

```
librak8s/
├── infra/                          # Terraform — infrastructure Azure
│   ├── main.tf                     # AKS + ACR + namespaces + Ingress
│   ├── database.tf                 # PostgreSQL Flexible Server
│   ├── variables.tf                # déclaration des variables
│   ├── outputs.tf                  # valeurs exposées après apply
│   └── terraform.tfvars            # ⚠️ valeurs sensibles — jamais dans Git
│
├── front/                          # App React Vite
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── k8s/
│       ├── deployment.yaml         # image: __ACR_SERVER__/librak8s-react:__IMAGE_TAG__
│       └── service.yaml
│
├── back/                           # App Spring Boot
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── k8s/
│       ├── deployment.yaml         # image: __ACR_SERVER__/librak8s-api:__IMAGE_TAG__
│       └── service.yaml
│
├── k8s/                            # Manifestes partagés
│   └── ingress.yaml                # Ingress + ExternalName
│
└── .github/workflows/
    ├── terraform.yml               # déclenché sur infra/**
    ├── _reusable-deploy.yml        # logique CI/CD commune
    ├── deploy-front.yml            # déclenché sur front/**
    ├── deploy-back.yml             # déclenché sur back/**
    └── deploy-ingress.yml          # déclenché sur k8s/**
```

---

## 3. Bootstrap Azure — à faire une seule fois

> Ces étapes créent les ressources nécessaires **avant** de lancer Terraform.  
> À ne refaire que si tu réinitialises complètement le projet.

### 3.1 Créer le stockage pour le state Terraform

```bash
# Resource group dédié au state (séparé du reste de l'infra)
az group create \
  --name librak8s-tfstate-rg \
  --location westeurope

# Storage account (nom unique globalement sur Azure)
az storage account create \
  --name librak8stfstate \
  --resource-group librak8s-tfstate-rg \
  --sku Standard_LRS \
  --allow-blob-public-access false

# Container qui contiendra le fichier .tfstate
az storage container create \
  --name tfstate \
  --account-name librak8stfstate
```

> **Note Azure for Students** : si la région `westeurope` est bloquée, essaie `eastus`.  
> Si aucune région ne fonctionne, supprime le bloc `backend "azurerm"` dans `infra/main.tf`  
> pour utiliser un state local (uniquement pour le développement).

### 3.2 Créer l'App Registration et configurer OIDC

L'authentification OIDC permet à GitHub Actions de se connecter à Azure **sans stocker de mot de passe**.

```bash
# 1. Créer l'App Registration
az ad app create --display-name "github-actions-librak8s"

# 2. Récupérer l'appId (= AZURE_CLIENT_ID)
APP_ID=$(az ad app list \
  --display-name "github-actions-librak8s" \
  --query "[0].appId" \
  --output tsv)

echo "APP_ID: $APP_ID"   # noter cette valeur

# 3. Créer le Service Principal
az ad sp create --id $APP_ID

# 4. Donner les droits Contributor sur la subscription
az role assignment create \
  --assignee $APP_ID \
  --role Contributor \
  --scope /subscriptions/$(az account show --query id -o tsv)

# 5. Configurer la fédération OIDC
#    ⚠️ Remplace "ton-username" et "librak8s" par tes vraies valeurs GitHub
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:ton-username/librak8s:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

### 3.3 Récupérer les valeurs pour GitHub

```bash
echo "=== Valeurs à copier dans les secrets GitHub ==="
echo ""
echo "AZURE_CLIENT_ID:       $(az ad app list --display-name 'github-actions-librak8s' --query '[0].appId' -o tsv)"
echo "AZURE_TENANT_ID:       $(az account show --query tenantId -o tsv)"
echo "AZURE_SUBSCRIPTION_ID: $(az account show --query id -o tsv)"
```

---

## 4. Déploiement de l'infrastructure (Terraform)

### 4.1 Créer le fichier de variables sensibles

```bash
# Ce fichier n'est PAS dans Git (.gitignore contient *.tfvars)
cat > infra/terraform.tfvars << 'EOF'
db_admin_password = "MotDePasseSecurisé123!"
acr_name          = "librak8sacr"
EOF
```

> **Règle de mot de passe PostgreSQL** : min 8 caractères, au moins une majuscule,  
> une minuscule et un chiffre.

### 4.2 Initialiser et appliquer Terraform

```bash
cd infra/

# Télécharge les providers (azurerm, kubernetes, helm)
# Connecte au backend Azure Blob Storage
terraform init

# Vérifie la syntaxe de tous les fichiers .tf
terraform validate
# → Success! The configuration is valid.

# Formate les fichiers
terraform fmt

# Prévisualise ce qui va être créé — LIS ATTENTIVEMENT
terraform plan
```

**Le plan doit afficher ces ressources :**

```
Plan: 9 to add, 0 to change, 0 to destroy.

  + azurerm_resource_group.main
  + azurerm_container_registry.acr
  + azurerm_kubernetes_cluster.aks
  + azurerm_role_assignment.aks_acr_pull
  + azurerm_postgresql_flexible_server.db
  + azurerm_postgresql_flexible_server_database.librak8s
  + azurerm_postgresql_flexible_server_firewall_rule.allow_aks
  + helm_release.nginx_ingress
  + kubernetes_namespace.front
  + kubernetes_namespace.back
```

```bash
# Applique (la création prend ~10-12 minutes, AKS est le plus long)
terraform apply
# → tape "yes" quand demandé

# Vérifie les outputs après création
terraform output
```

**Exemple de résultat attendu :**

```
acr_login_server    = "librak8sacr.azurecr.io"
aks_cluster_name    = "librak8s-aks"
db_host             = "librak8s-db.postgres.database.azure.com"
db_name             = "librak8s"
resource_group_name = "librak8s-rg"
```

```bash
cd ..
```

### 4.3 Connecter kubectl au cluster

```bash
az aks get-credentials \
  --resource-group librak8s-rg \
  --name librak8s-aks

# Vérifier les nodes
kubectl get nodes
# NAME                    STATUS   ROLES   AGE   VERSION
# aks-default-xxxxx-0     Ready    agent   5m    v1.28.x
# aks-default-xxxxx-1     Ready    agent   5m    v1.28.x

# Vérifier les namespaces créés par Terraform
kubectl get namespaces
# front    Active   3m
# back     Active   3m
```

### 4.4 Créer le Secret Kubernetes pour la base de données

```bash
# Ce secret est référencé dans back/k8s/deployment.yaml
kubectl create secret generic db-credentials \
  --from-literal=password='MotDePasseSecurisé123!' \
  --namespace back

# Vérifier
kubectl get secret db-credentials -n back
```

---

## 5. Configuration des secrets GitHub

Dans ton repo GitHub : **Settings → Secrets and variables → Actions → New repository secret**

| Nom du secret           | Valeur             | Description              |
|-------------------------|--------------------|--------------------------|
| `AZURE_CLIENT_ID`       | `<appId>`          | ID de l'App Registration |
| `AZURE_TENANT_ID`       | `<tenantId>`       | ID du tenant Azure       |
| `AZURE_SUBSCRIPTION_ID` | `<subscriptionId>` | ID de la subscription    |

> Ces 3 valeurs ont été affichées à l'étape [3.3](#33-récupérer-les-valeurs-pour-github).

---

## 6. Premier déploiement des applications

### 6.1 Déployer l'Ingress (une seule fois)

```bash
# Récupérer l'ACR server depuis les outputs Terraform
ACR_SERVER=$(cd infra && terraform output -raw acr_login_server)

# Appliquer l'Ingress et les ExternalName
kubectl apply -f k8s/

# Vérifier
kubectl get ingress -n default
kubectl get service front-proxy -n default
kubectl get service back-proxy -n default
```

### 6.2 Déploiement via GitHub Actions (méthode normale)

Le déploiement se déclenche automatiquement à chaque push sur `main`.  
Pour le premier déploiement, pousse simplement ton code :

```bash
git add .
git commit -m "feat: initial deployment"
git push origin main
```

Puis surveille l'onglet **Actions** sur GitHub.  
Les 3 workflows vont se déclencher selon les dossiers modifiés.

### 6.3 Déploiement manuel (si besoin de bypasser le pipeline)

```bash
# Récupérer les valeurs Terraform
ACR_SERVER=$(cd infra && terraform output -raw acr_login_server)
AKS_NAME=$(cd infra && terraform output -raw aks_cluster_name)
RG_NAME=$(cd infra && terraform output -raw resource_group_name)

# Login ACR
az acr login --name $ACR_SERVER

# ── Front ──────────────────────────────────────────────────────────────────
IMAGE_TAG=$(git rev-parse HEAD)

docker build -t $ACR_SERVER/librak8s-react:$IMAGE_TAG ./front
docker push $ACR_SERVER/librak8s-react:$IMAGE_TAG

# Injecter les valeurs dans le manifeste (copie temporaire)
cp front/k8s/deployment.yaml /tmp/deployment-front.yaml
sed -i "s|__ACR_SERVER__|$ACR_SERVER|g" /tmp/deployment-front.yaml
sed -i "s|__IMAGE_TAG__|$IMAGE_TAG|g"   /tmp/deployment-front.yaml

kubectl apply -f /tmp/deployment-front.yaml
kubectl apply -f front/k8s/service.yaml
kubectl rollout status deployment/librak8s-react --namespace front --timeout=3m

# ── Back ───────────────────────────────────────────────────────────────────
cd back && mvn package -DskipTests && cd ..

docker build -t $ACR_SERVER/librak8s-api:$IMAGE_TAG ./back
docker push $ACR_SERVER/librak8s-api:$IMAGE_TAG

cp back/k8s/deployment.yaml /tmp/deployment-back.yaml
sed -i "s|__ACR_SERVER__|$ACR_SERVER|g" /tmp/deployment-back.yaml
sed -i "s|__IMAGE_TAG__|$IMAGE_TAG|g"   /tmp/deployment-back.yaml

kubectl apply -f /tmp/deployment-back.yaml
kubectl apply -f back/k8s/service.yaml
kubectl rollout status deployment/librak8s-api --namespace back --timeout=5m
```

---

## 7. Vérification

### 7.1 Vérifier les Pods

```bash
# Front
kubectl get pods -n front
# NAME                              READY   STATUS    RESTARTS   AGE
# librak8s-react-7d9f8b-xxxxx       1/1     Running   0          2m
# librak8s-react-7d9f8b-yyyyy       1/1     Running   0          2m

# Back
kubectl get pods -n back
# NAME                             READY   STATUS    RESTARTS   AGE
# librak8s-api-6c4f9d-xxxxx        1/1     Running   0          2m
# librak8s-api-6c4f9d-yyyyy        1/1     Running   0          2m
```

> **READY 0/1** = le Pod démarre encore (normal pendant 30s pour Spring Boot).  
> **CrashLoopBackOff** = erreur au démarrage → voir les logs.

### 7.2 Récupérer l'IP publique

```bash
# L'IP publique est sur l'Ingress Controller (pas sur les Services)
kubectl get service -n ingress-nginx

# NAME                                 TYPE           EXTERNAL-IP
# nginx-ingress-ingress-nginx-controller  LoadBalancer  20.123.45.67  ← ton IP
```

L'application est accessible sur : `http://20.123.45.67`  
L'API est accessible sur : `http://20.123.45.67/api`

### 7.3 Tester les endpoints

```bash
IP="20.123.45.67"   # remplace par ta vraie IP

# Front React
curl -I http://$IP
# → HTTP/1.1 200 OK

# Back Spring Boot (via Ingress, rewrite /api → /)
curl http://$IP/api/actuator/health
# → {"status":"UP"}
```

### 7.4 Voir les logs

```bash
# Logs du front
kubectl logs -l app=librak8s-react -n front --tail=50

# Logs du back
kubectl logs -l app=librak8s-api -n back --tail=50

# Logs en temps réel
kubectl logs -l app=librak8s-api -n back -f
```

---

## 8. Déploiements suivants

### Modifier le front uniquement

```bash
# Modifie des fichiers dans front/
git add front/
git commit -m "feat: update front"
git push origin main
# → seul deploy-front.yml se déclenche (~4 min)
```

### Modifier le back uniquement

```bash
# Modifie des fichiers dans back/
git add back/
git commit -m "feat: update api"
git push origin main
# → seul deploy-back.yml se déclenche (~6 min)
```

### Modifier l'infrastructure

```bash
# Modifie des fichiers dans infra/
git add infra/
git commit -m "infra: increase node count"
git push origin main
# → seul terraform.yml se déclenche
```

### Rollback vers une version précédente

```bash
# Voir l'historique des déploiements
kubectl rollout history deployment/librak8s-react -n front
kubectl rollout history deployment/librak8s-api -n back

# Revenir à la version précédente
kubectl rollout undo deployment/librak8s-react -n front
kubectl rollout undo deployment/librak8s-api -n back

# Revenir à une version spécifique
kubectl rollout undo deployment/librak8s-api -n back --to-revision=2
```

---

## 9. Commandes utiles

### Terraform

```bash
cd infra/

terraform output                              # affiche tous les outputs
terraform output -raw acr_login_server        # affiche une valeur spécifique
terraform plan                                # vérifier les changements sans appliquer
terraform apply                               # appliquer les changements
terraform destroy                             # ⚠️ supprime TOUTE l'infra
```

### Kubernetes

```bash
# Pods
kubectl get pods -n front
kubectl get pods -n back
kubectl get pods --all-namespaces

# Logs
kubectl logs <nom-du-pod> -n front
kubectl logs <nom-du-pod> -n back -f         # temps réel

# Décrire un Pod (utile pour diagnostiquer)
kubectl describe pod <nom-du-pod> -n back

# Accès shell dans un Pod (debug)
kubectl exec -it <nom-du-pod> -n back -- sh

# Services et Ingress
kubectl get services --all-namespaces
kubectl get ingress --all-namespaces
kubectl get service -n ingress-nginx

# Scaling manuel
kubectl scale deployment librak8s-react --replicas=3 -n front
kubectl scale deployment librak8s-api   --replicas=3 -n back

# Rollout
kubectl rollout status deployment/librak8s-api -n back
kubectl rollout history deployment/librak8s-api -n back
kubectl rollout undo deployment/librak8s-api -n back
```

### Docker / ACR

```bash
# Login ACR
ACR_SERVER=$(cd infra && terraform output -raw acr_login_server)
az acr login --name $ACR_SERVER

# Lister les images dans ACR
az acr repository list --name librak8sacr
az acr repository show-tags --name librak8sacr --repository librak8s-react

# Build et push manuel
docker build -t $ACR_SERVER/librak8s-react:test ./front
docker push $ACR_SERVER/librak8s-react:test
```

### Azure

```bash
# Infos subscription
az account show

# Ressources créées
az resource list --resource-group librak8s-rg --output table

# Reconnexion kubectl (si le token a expiré)
az aks get-credentials \
  --resource-group librak8s-rg \
  --name librak8s-aks \
  --overwrite-existing
```

---

## 10. Troubleshooting

### Pod en état `CrashLoopBackOff`

```bash
# Voir les logs du Pod crashé
kubectl logs <nom-du-pod> -n back --previous

# Décrire le Pod pour voir les events
kubectl describe pod <nom-du-pod> -n back
```

**Causes fréquentes :**
- Variables d'environnement manquantes (DB_HOST, DB_PASSWORD...)
- Secret `db-credentials` non créé dans le namespace `back`
- Erreur de connexion à la base de données

### Pod en état `Pending`

```bash
kubectl describe pod <nom-du-pod> -n back
# → section "Events" en bas
```

**Causes fréquentes :**
- Ressources insuffisantes (augmenter `node_count` dans `terraform.tfvars`)
- Image non trouvée dans ACR (vérifier le tag et les droits AcrPull)

### `ImagePullBackOff` — image non trouvée

```bash
# Vérifier que l'image existe dans ACR
az acr repository show-tags \
  --name librak8sacr \
  --repository librak8s-api

# Vérifier que le role AcrPull est bien assigné
az role assignment list \
  --scope $(az acr show --name librak8sacr --query id -o tsv) \
  --output table
```

### Ingress ne répond pas

```bash
# Vérifier que le pod ingress-nginx est Running
kubectl get pods -n ingress-nginx

# Vérifier que l'IP publique est assignée
kubectl get service -n ingress-nginx

# Vérifier les ExternalName
kubectl get service front-proxy -n default
kubectl get service back-proxy -n default
```

### Erreur OIDC dans le pipeline GitHub Actions

```bash
# Vérifier que la fédération est bien configurée
az ad app federated-credential list --id <APP_ID>

# Le 'subject' doit correspondre EXACTEMENT à :
# repo:ton-username/librak8s:ref:refs/heads/main
```

### `terraform apply` échoue sur la subscription

```bash
# Vérifier la subscription active
az account show

# Ré-authentifier si nécessaire
az logout && az login
az account set --subscription "<SUBSCRIPTION_ID>"
```

### Base de données inaccessible depuis le back

```bash
# Vérifier que la firewall rule existe
az postgres flexible-server firewall-rule list \
  --resource-group librak8s-rg \
  --name librak8s-db \
  --output table

# Vérifier le Secret K8s
kubectl get secret db-credentials -n back
kubectl describe secret db-credentials -n back

# Tester la connexion depuis un Pod (debug)
kubectl run pg-test --image=postgres:16-alpine -n back --rm -it -- \
  psql "host=librak8s-db.postgres.database.azure.com \
        user=libradmin \
        dbname=librak8s \
        sslmode=require"
```

---

## Récapitulatif des ressources créées

| Ressource          | Nom             | Description                         |
|--------------------|-----------------|-------------------------------------|
| Resource Group     | `librak8s-rg`   | Conteneur de toutes les ressources  |
| Container Registry | `librak8sacr`   | Stocke les images Docker            |
| Kubernetes Cluster | `librak8s-aks`  | 2 nodes Standard_B2s                |
| Namespace front    | `front`         | Isole le déploiement React          |
| Namespace back     | `back`          | Isole le déploiement Spring Boot    |
| Ingress Controller | `nginx-ingress` | Point d'entrée unique (IP publique) |
| PostgreSQL Server  | `librak8s-db`   | Base managée Azure (PostgreSQL 16)  |
| Base de données    | `librak8s`      | Base applicative                    |

## Flux de déploiement résumé

```
git push main
      │
      ├── infra/** modifié    →  terraform.yml  →  terraform apply
      │
      ├── front/** modifié   →  deploy-front.yml
      │                              │
      │                         get-infra (terraform output)
      │                              │
      │                         build-push (docker build + push ACR)
      │                              │
      │                         deploy (kubectl apply → rolling update 0 downtime)
      │
      └── back/** modifié    →  deploy-back.yml  (même flux, + mvn package)
```