---
title: "Error Codes Cheat Sheet"
sidebar_position: 4
description: "Documentation for Error Codes Cheat Sheet"
tags: [cheat-sheets]
---

# Error Codes Cheat Sheet

## Authentication Errors

| Code | Status | Meaning |
|---|---|---|
| invalid_api_key | 401 | Invalid or expired |
| missing_api_key | 401 | No key provided |
| key_revoked | 401 | Key has been revoked |
| key_expired | 401 | Key has expired |
| insufficient_permissions | 403 | Missing scope |

## Request Errors

| Code | Status | Meaning |
|---|---|---|
| invalid_request | 400 | Malformed request body |
| missing_required_field | 400 | Required field missing |
| invalid_model | 400 | Model not found |
| context_length_exceeded | 400 | Input too long |
| invalid_messages_format | 400 | Wrong message format |

## Rate Limit Errors

| Code | Status | Meaning |
|---|---|---|
| rate_limit_exceeded | 429 | Rate limit hit |
| rate_limit_key_exceeded | 429 | Key limit hit |
| rate_limit_global_exceeded | 429 | Global limit hit |

## Server Errors

| Code | Status | Meaning |
|---|---|---|
| internal_error | 500 | Unexpected error |
| upstream_error | 502 | Upstream error |
| upstream_timeout | 504 | Upstream timed out |
| service_unavailable | 503 | Temporarily unavailable |

## Next

- [Quick Start Cheat Sheet](05-quick-start-cheat-sheet.md)

## See Also

Related cheat sheets and reference documentation.

- [Cheat Sheets](../cheat-sheets/01-cheat-sheets-overview.md)
- [CLI Reference](../cli/01-getting-started.md)
- [Config Reference](../reference/03-configuration-schema.md)
- [Error Codes](../reference/04-error-codes.md)
