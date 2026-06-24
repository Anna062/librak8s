variable "location" {
  description = "Région Azure"
  type        = string
  default     = "norwayeast"
}

variable "resource_group_name" {
  description = "Nom du resource group principal"
  type        = string
  default     = "librak8s-rg"
}

variable "acr_name" {
  description = "Nom du Container Registry (unique sur Azure)"
  type        = string
  default     = "librak8sacr"
}

variable "aks_name" {
  description = "Nom du cluster Kubernetes"
  type        = string
  default     = "librak8s-aks"
}

variable "node_count" {
  description = "Nombre de nodes dans le cluster"
  type        = number
  default     = 2
}

variable "db_name" {
  description = "Nom du serveur PostgreSQL"
  type        = string
  default     = "librak8s-db"
}

variable "db_admin_login" {
  description = "Login administrateur PostgreSQL"
  type        = string
  default     = "libradmin"
}

variable "db_admin_password" {
  description = "Mot de passe PostgreSQL"
  type        = string
  sensitive   = true
}