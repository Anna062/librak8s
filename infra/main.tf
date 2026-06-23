terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27"
    }
  }
}

provider "azurerm" {
  features {}
}

# Le provider Kubernetes pointe sur le cluster qu'on crée juste en dessous
provider "kubernetes" {
  host = azurerm_kubernetes_cluster.aks.kube_config[0].host

  client_certificate     = base64decode(azurerm_kubernetes_cluster.aks.kube_config[0].client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.aks.kube_config[0].client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.aks.kube_config[0].cluster_ca_certificate)
}

# ── Resource Group ────────────────────────────────────────────
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

# ── Container Registry (ACR) ──────────────────────────────────
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = false
}

# ── Cluster Kubernetes (AKS) ──────────────────────────────────
resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.aks_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = var.aks_name

  default_node_pool {
    name       = "default"
    node_count = var.node_count
    vm_size    = "Standard_B2s"
  }

  # AKS gère sa propre identité Azure — pas besoin de créer un service principal manuellement
  identity {
    type = "SystemAssigned"
  }
}

# Permet à AKS de puller les images depuis ACR sans credentials
resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}

# ── Namespaces Kubernetes ─────────────────────────────────────
resource "kubernetes_namespace" "front" {
  metadata {
    name = "front"
  }

  # Attend que AKS soit prêt avant de créer le namespace
  depends_on = [azurerm_kubernetes_cluster.aks]
}

resource "kubernetes_namespace" "back" {
  metadata {
    name = "back"
  }

  depends_on = [azurerm_kubernetes_cluster.aks]
}
