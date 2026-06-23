resource "azurerm_postgresql_flexible_server" "db" {
  name                   = var.db_name
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "16"

  administrator_login    = var.db_admin_login
  administrator_password = var.db_admin_password

  sku_name               = "B_Standard_B1ms"
  storage_mb             = 32768 # Stockage initial en MB (32 GB)

  backup_retention_days  = 7 # Backup automatique pendant 7 jours

  zone = "1"
}

# La base de données
resource "azurerm_postgresql_flexible_server_database" "librak8s" {
  name      = "librak8s"
  server_id = azurerm_postgresql_flexible_server.db.id
  collation = "en_US.utf8"
  charset   = "UTF8"
}

# Règle firewall : autorise AKS à se connecter à la DB
# En production, on affinerait avec les IPs exactes du cluster
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_aks" {
  name             = "allow-aks"
  server_id        = azurerm_postgresql_flexible_server.db.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}