---
title: "Passaporte Identity System"
sidebar_position: 99
description: "A self-sovereign identity card within the system that displays user profile, compliance status, and system activity summary. Each Passaporte is a verifiable digital identity that can be shared with ot"
tags: [features]
---

# Passaporte Identity System

## What It Does
A self-sovereign identity card within the system that displays user profile, compliance status, and system activity summary. Each Passaporte is a verifiable digital identity that can be shared with other instances or exported as a signed document. It provides portable identity verification without relying on any external identity provider.

## How It Works
The Passaporte system is implemented in i-oss-gateway/src/handlers/passaporte.rs. When a user generates their Passaporte via WebSocket on port 3030 (generate_passaporte), the system:

1. Collects user profile data: name, bio, avatar photo, compliance status (system integrity check result, last audit date), and activity statistics (session count, message count, graph size).
2. Generates a cryptographic signature over the identity data using a local key pair (generated at first startup, stored in ./data/identity/).
3. Packages the data and signature into a JSON document with a version header and timestamp.
4. Returns the Passaporte data to the frontend for display.

The frontend PassaporteView (React 18 + Vite 5 + Tailwind) renders the identity card with: photo, name, bio, compliance badge (green/red based on system integrity), activity stats, and a QR code containing the signed identity document for sharing.

The Passaporte can be shared with other API-OSS instances: the recipient instance imports the signed document, verifies the signature against the sender's public key, and displays the verified identity. This enables cross-instance trust without a central certificate authority.

All identity operations are recorded in the SHA-256 hash-chained audit ledger at data/ledger/ in .aioss format. The system runs on the single pi-oss binary. HTTP UI on port 8081.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Passaporte view from the user menu.
4. Edit your profile: name, bio, and avatar photo.
5. The compliance badge shows green if the SHA-256 integrity check passed on startup.
6. Activity stats show your session count, message count, and graph node count.
7. Click "Share" to generate a QR code containing your signed Passaporte.
8. Another user can scan the QR code to import your identity into their instance.
9. Use CLI: pi-oss passaporte generate, pi-oss passaporte show, pi-oss passaporte export.

Config in opencode.json:
`json
{
  "passaporte": {
    "key_dir": "./data/identity",
    "auto_sign": true
  }
}
`

## The Moat
- No competitor offers an integrated self-sovereign identity system within an AI platform.
- Our Passaporte provides government-grade identity verification without relying on any external identity provider.
- Cryptographic signing enables cross-instance trust without central certificate authorities.
- Compliance badge integrates system integrity state into identity verification.
- The QR code sharing mechanism enables easy peer-to-peer identity verification.

## Why Choose API-OSS
Self-sovereign identity built into the platform. Organizations that need to verify identities across deployments � multi-site intelligence operations, enterprise branch offices, collaborative research networks � can do so without setting up identity providers or certificate authorities. The Passaporte's cryptographic signing ensures that identities are tamper-proof and verifiable by any recipient.

## Competitive Comparison
- **Palantir**: No self-sovereign identity � relies on corporate SSO (Okta, Active Directory) with external dependency.
- **OpenAI**: No identity system beyond login credentials. No portable identity concept.
- **Anthropic**: No identity concept. Cloud-only login via email/password.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Passaporte Identity System

## What It Does
A self-sovereign identity card within the system that displays user profile, compliance status, and system activity summary. Each Passaporte is a verifiable digital identity that can be shared with other instances or exported as a signed document. It provides portable identity verification without relying on any external identity provider.

## How It Works
The Passaporte system is implemented in i-oss-gateway/src/handlers/passaporte.rs. When a user generates their Passaporte via WebSocket on port 3030 (generate_passaporte), the system:

1. Collects user profile data: name, bio, avatar photo, compliance status (system integrity check result, last audit date), and activity statistics (session count, message count, graph size).
2. Generates a cryptographic signature over the identity data using a local key pair (generated at first startup, stored in ./data/identity/).
3. Packages the data and signature into a JSON document with a version header and timestamp.
4. Returns the Passaporte data to the frontend for display.

The frontend PassaporteView (React 18 + Vite 5 + Tailwind) renders the identity card with: photo, name, bio, compliance badge (green/red based on system integrity), activity stats, and a QR code containing the signed identity document for sharing.

The Passaporte can be shared with other API-OSS instances: the recipient instance imports the signed document, verifies the signature against the sender's public key, and displays the verified identity. This enables cross-instance trust without a central certificate authority.

All identity operations are recorded in the SHA-256 hash-chained audit ledger at data/ledger/ in .aioss format. The system runs on the single pi-oss binary. HTTP UI on port 8081.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Passaporte view from the user menu.
4. Edit your profile: name, bio, and avatar photo.
5. The compliance badge shows green if the SHA-256 integrity check passed on startup.
6. Activity stats show your session count, message count, and graph node count.
7. Click "Share" to generate a QR code containing your signed Passaporte.
8. Another user can scan the QR code to import your identity into their instance.
9. Use CLI: pi-oss passaporte generate, pi-oss passaporte show, pi-oss passaporte export.

Config in opencode.json:
`json
{
  "passaporte": {
    "key_dir": "./data/identity",
    "auto_sign": true
  }
}
`

## The Moat
- No competitor offers an integrated self-sovereign identity system within an AI platform.
- Our Passaporte provides government-grade identity verification without relying on any external identity provider.
- Cryptographic signing enables cross-instance trust without central certificate authorities.
- Compliance badge integrates system integrity state into identity verification.
- The QR code sharing mechanism enables easy peer-to-peer identity verification.

## Why Choose API-OSS
Self-sovereign identity built into the platform. Organizations that need to verify identities across deployments � multi-site intelligence operations, enterprise branch offices, collaborative research networks � can do so without setting up identity providers or certificate authorities. The Passaporte's cryptographic signing ensures that identities are tamper-proof and verifiable by any recipient.

## Competitive Comparison
- **Palantir**: No self-sovereign identity � relies on corporate SSO (Okta, Active Directory) with external dependency.
- **OpenAI**: No identity system beyond login credentials. No portable identity concept.
- **Anthropic**: No identity concept. Cloud-only login via email/password.
### Protocol Message Reference

The feature communicates over WebSocket on port 3030 with the following message types. All messages are JSON with `type` and `payload` fields. The frontend sends request messages; the backend responds with response or event messages.

**Request messages** (frontend ? backend):
- Detailed in the How to Operate section above � each actionable step corresponds to a WebSocket message
- All messages include a `req_id` field for request-response correlation
- Errors are returned as `{ "type": "error", "req_id": "...", "message": "..." }`
- Messages are processed asynchronously � results may arrive in a different order than requests

**Response/event messages** (backend ? frontend):
- Each request generates at least one response message with status and data
- Streaming responses send multiple messages (e.g., one per token) followed by a completion message
- Event messages (e.g., model status changes, contradiction scan results) are pushed without a corresponding request
- The WebSocket connection is persistent � the frontend reconnects automatically on disconnect

**Error handling**: All WebSocket messages include error handling. If a request fails, an error message is returned with a description. The frontend displays errors as toast notifications. Failed requests do not affect other ongoing operations.

**Rate limiting**: There is no rate limiting on WebSocket messages � the system processes messages as fast as the hardware can handle. The 3050 Ti GPU and local inference ensure no external API rate limits apply.

### CLI Command Reference

The CLI provides 87 commands across 9 subcommand groups. All commands follow the pattern `api-oss <group> <action> [options]`. Use `api-oss help` to list all groups, `api-oss help <group>` for group-specific help.

The most important commands for this feature are:
- `api-oss status` � check gateway status and feature availability
- `api-oss config get <key>` � read configuration values
- `api-oss config set <key> <value>` � update configuration
- `api-oss log tail` � view real-time system logs
- `api-oss health` � run a comprehensive health check

### Integration Points

This feature integrates with the following other system components:

- **Knowledge Graph**: All data created or modified by this feature is stored as nodes and edges in `data/graph.db`. This enables cross-feature queries and relationships.
- **Audit Ledger**: All significant actions are recorded as entries in `data/ledger/` in `.aioss` format. The SHA-256 hash chain provides tamper-proof audit.
- **Search**: Content created by this feature is indexed by the FTS5 full-text search engine, making it discoverable via the Search view.
- **Multi-Agent Council**: If enabled, decisions made by this feature that have significant impact are reviewed by the Risk, Legal, and Strategist agents.
- **Contradiction Detection**: Statements made by this feature are checked for logical consistency with existing graph content.
- **Codex Multi-Tenancy**: All data is scoped by `codex_id`, ensuring isolation between workspaces.

### Security Considerations

- All feature operations are logged to the audit ledger with cryptographic chaining
- Path traversal protection applies to any file system access
- CLAW approval required for destructive operations (configurable)
- No data is transmitted over the network for feature operation
- The SHA-256 integrity check on startup validates all system components
- PID file lock prevents concurrent instance corruption of the database
- Feature works fully offline � no cloud dependency, no data breach surface

### Known Limitations

- Performance is bounded by local hardware � the 3050 Ti GPU provides ~20-40 tokens/second
- SQLite WAL supports concurrent reads but single writer � the PID lock enforces this
- Maximum database size is limited by available disk space (tested to 10GB+)
- WebSocket connection requires the gateway to be running (port 3030)
- HTTP UI requires the gateway to be running (port 8081)

### Upgrade & Migration

- All feature data is stored in the `./data/` directory
- To upgrade: replace the binary and restart � data is forward-compatible
- To migrate: copy the `./data/` directory to the new machine
- The audit ledger can be verified independently with `api-oss ledger verify`
- Configuration in `opencode.json` is versioned � the system warns on unknown keys

### Dependencies

This feature has no external runtime dependencies. All functionality is self-contained in the single `api-oss` binary:
- No cloud API keys required
- No third-party services
- No database servers
- No runtime environments (Python, Node.js)
- Docker is optional � everything runs as a single binary
- Everything works fully offline with no internet required

### FAQ

**Q: Does this require an internet connection?**
A: No. All features work fully offline with no internet required after initial model download.

**Q: What hardware do I need?**
A: A machine with a CUDA-capable GPU. The NVIDIA 3050 Ti (4GB VRAM) is the reference target and auto-detects with backend "cuda".

**Q: How do I start the gateway?**
A: Run `api-oss start` or execute the binary directly. The HTTP UI is on port 8081 and WebSocket on port 3030.

**Q: Can I run this in Docker?**
A: Docker is optional. The system runs as a single binary with no container required.

**Q: Where is my data stored?**
A: All data is in `./data/` by default � graph at `data/graph.db` (SQLite WAL), ledger at `data/ledger/` (`.aioss` format).

**Q: How do I configure the system?**
A: Edit `opencode.json` at the root or gateway level. Config drives all behavior.

**Q: Can I use a different model?**
A: Yes. Download any GGUF model and configure it in `opencode.json`. Runtime model switching is supported.

**Q: Is there a CLI?**
A: Yes � 87 commands in 9 subcommand groups. Run `api-oss help` to get started.

