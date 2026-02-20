# ref: https://registry.terraform.io/providers/keycloak/keycloak/5.0.0/docs/resources/openid_client

variable "default_password" {
  type = string
}

variable "app_name" {
  type    = string
  default = "breakfast"
}

variable "root_url" {
  type    = string
  default = "http://localhost:5173"
}

variable "valid_redirect_uris" {
  type    = list(string)
  default = ["*"]
}

variable "valid_post_logout_redirect_uris" {
  type    = list(string)
  default = ["+"]
}

variable "web_origins" {
  type    = list(string)
  default = ["*"]
}

variable "systemuser_secret" {
  type    = string
}

data "keycloak_realm" "master" {
  realm = "master"
}

import {
  id = "master"
  to = keycloak_realm.master
}

resource "keycloak_realm" "master" {
  realm             = data.keycloak_realm.master.id
}

resource "keycloak_realm" "realm" {
  realm = var.app_name
  # Realm Settings > Login tab
  reset_password_allowed   = true
  login_with_email_allowed = true
  registration_allowed = true
}

resource "keycloak_default_roles" "default_roles" {
  realm_id      = keycloak_realm.realm.id
  default_roles = ["offline_access", "uma_authorization"]
}

resource "keycloak_openid_client" "client" {
  realm_id                        = keycloak_realm.realm.id
  client_id                       = var.app_name
  access_type                     = "PUBLIC"
  direct_access_grants_enabled    = true
  standard_flow_enabled           = true
  valid_redirect_uris             = var.valid_redirect_uris
  valid_post_logout_redirect_uris = var.valid_post_logout_redirect_uris
  web_origins                     = var.web_origins
  root_url                        = var.root_url
}
