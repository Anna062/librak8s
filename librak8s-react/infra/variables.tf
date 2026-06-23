variable "location" {
  default = "westeurope"
}

variable "resource_group_name" {
  default = "librak8s-react-rg"
}

variable "acr_name" {
  default = "librak8s-react"
}

variable "aks_name" {
  default = "librak8s-react-aks"
}

variable "node_count" {
  default = 2
}