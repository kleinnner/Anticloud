---
title: "API Reference 07: Authentication"
sidebar_position: 7
description: "sk-aioss-{type}-{32 hex chars}"
tags: [api]
---

# API Reference 07: Authentication

## API Keys

### Key Format

```
sk-aioss-{type}-{32 hex chars}
```

Example: `sk-aioss-admin-a1b2c3d4e5f6789012345678abcdef01`

### Key Types

| Type | Prefix | Permissions | Expiry | Rate Limit |
|------|--------|-------------|--------|------------|
| Admin | `sk-aioss-admin-` | Full read/write, user management | Never | 1000/min |
| Write | `sk-aioss-write-` | Read + write to graph/models/docs | 1 year | 500/min |
| Read | `sk-aioss-read-` | Read-only queries | 1 year | 200/min |
| Bridge | `sk-aioss-bridge-` | Bridge-specific + limited AI | 1 year | 100/min |
| Temp | `sk-aioss-temp-` | Single-session, auto-expires | 24 hours | 50/min |

### Generating Keys

```bash
# CLI
aioss api-key create --name "CI/CD Pipeline" --type write
# Output: sk-aioss-write-a1b2c3d4e5f6789012345678abcdef01

# List keys
aioss api-key list

# Revoke key
aioss api-key revoke sk-aioss-write-a1b2c3d4e5f6789012345678abcdef01
```

```python
# Python SDK
key = client.api_keys.create(
    name="My App Key",
    key_type="write",
    expires_in_days=365
)
print(key.value)  # Print once, never again
```

## Authentication Methods

### Header (Recommended)

```bash
curl -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  http://localhost:8080/v1/chat/completions
```

### Query Parameter

```bash
curl "http://localhost:8080/v1/chat/completions?api_key=sk-aioss-xxxxxxxxxxxx" \
  -d '{"model":"qwen2.5-7b-q4","messages":[{"role":"user","content":"Hello"}]}'
```

### Cookie

```bash
curl -b "aioss_api_key=sk-aioss-xxxxxxxxxxxx" \
  http://localhost:8080/v1/models
```

## JWT Authentication

For SSO/OIDC integration, API-OSS supports JWT tokens:

```bash
# Login with OIDC provider
aioss auth login --provider azure-ad
# Opens browser, redirects to OIDC provider
# Returns JWT token

# Use JWT
curl -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \
  http://localhost:8080/v1/chat/completions
```

## mTLS Authentication

For zero-trust deployments, configure mutual TLS:

```yaml
gateway:
  tls:
    enabled: true
    cert_file: /etc/ai-oss/certs/server.crt
    key_file: /etc/ai-oss/certs/server.key
    ca_file: /etc/ai-oss/certs/ca.crt
    require_client_cert: true
```

## RBAC Permissions Matrix

| Action | Admin | Write | Read | Bridge |
|--------|-------|-------|------|--------|
| Chat completions | ✅ | ✅ | ✅ | ✅ |
| Graph read | ✅ | ✅ | ✅ | ❌ |
| Graph write | ✅ | ✅ | ❌ | ❌ |
| Ingest documents | ✅ | ✅ | ❌ | ✅ |
| Manage models | ✅ | ❌ | ❌ | ❌ |
| View ledger | ✅ | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ |
| Manage API keys | ✅ | ❌ | ❌ | ❌ |
| Configure system | ✅ | ❌ | ❌ | ❌ |
| Bridge operations | ✅ | ❌ | ❌ | ✅ |

## Rate Limiting

```yaml
Rate limit headers returned on every response:
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 487
X-RateLimit-Reset: 1717117200
```

On rate limit (HTTP 429):
```json
{
  "error": {
    "code": "rate_limited",
    "message": "Rate limit exceeded. Retry after 5 seconds.",
    "retry_after": 5
  }
}
```

## Security Best Practices

1. **Rotate keys regularly** — Use key types with expiry for automation
2. **Never log keys** — Mask keys in logs (`sk-aioss-admin-XXXX...XXXX`)
3. **Use least privilege** — Create read-only keys for monitoring
4. **Prefer header auth** — URL params can be logged by proxies
5. **Enable mTLS** — For production deployments requiring zero-trust
6. **Monitor key usage** — Audit log shows which key performed each action

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
