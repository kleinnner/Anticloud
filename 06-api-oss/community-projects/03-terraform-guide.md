---
title: "apioss-terraform Provider"
sidebar_position: 3
description: "Terraform provider for managing API-OSS resources."
tags: [community-projects]
---

# apioss-terraform Provider

## Overview

Terraform provider for managing API-OSS resources.

## Installation

```hcl
terraform {
  required_providers {
    apioss = {
      source = "registry.terraform.io/community/apioss"
      version = "~> 1.0"
    }
  }
}
```

## Resources

```hcl
provider "apioss" {
  endpoint = "https://api.example.com"
  api_key  = var.apioss_key
}

resource "apioss_route" "chat" {
  path     = "/v1/chat"
  upstream = "https://api.openai.com"
  methods  = ["POST"]
  auth_required = true
}

resource "apioss_api_key" "app" {
  name = "my-app"
  role = "user"
}
```

## Data Sources

```hcl
data "apioss_routes" "all" {}

data "apioss_models" "available" {}
```

## Next

- [apioss-vscode Extension](04-vscode-extension-guide.md)

## See Also

Related community projects and development documentation.

- [Community Projects](../community-projects/01-community-projects-overview.md)
- [Community Overview](../community/01-building-community.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Plugin Development](../plugins/01-plugins-overview.md)
