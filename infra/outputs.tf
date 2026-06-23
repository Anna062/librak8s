output "acr_login_server" {
  description = "URL de la registry Docker"
  value       = azurerm_container_registry.acr.login_server
  # exemple : librak8sacr.azurecr.io
}

output "aks_cluster_name" {
  description = "Nom du cluster Kubernetes"
  value       = azurerm_kubernetes_cluster.aks.name
}

output "resource_group_name" {
  description = "Nom du resource group"
  value       = azurerm_resource_group.main.name
}

output "db_host" {
  description = "Hostname du serveur PostgreSQL"
  value       = azurerm_postgresql_flexible_server.db.fqdn
  # exemple : librak8s-db.postgres.database.azure.com
}

output "db_name" {
  description = "Nom de la base de données"
  value       = azurerm_postgresql_flexible_server_database.librak8s.name
  # → librak8s
}

output "db_admin_login" {
  description = "Login administrateur PostgreSQL"
  value       = azurerm_postgresql_flexible_server.db.administrator_login
}