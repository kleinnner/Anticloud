<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Open Core Model

## Transparent Feature Boundaries

Kazkade follows an open-core model: the core runtime, storage engine, CLI, and all fundamental capabilities are fully open source (MIT/Apache 2.0). Enterprise features that require significant infrastructure investment are available under the Kazkade Community License (KCL).

> "Open core is not a tax on users. It is a sustainable model for long-term open-source development." — Kazkade Licensing Philosophy

---

## Feature Distribution

```
┌──────────────────────────────────────────────────────────────────┐
│                    Kazkade Feature Distribution                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  OPEN SOURCE (MIT/Apache 2.0)                                     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ • Zero-copy runtime (mmap engine)                           │ │
│  │ • .acol columnar storage format                             │ │
│  │ • SIMD dispatch layer (AVX2/AVX-512/NEON/SVE/SSE4.2)       │ │
│  │ • SQL query engine                                           │ │
│  │ • Software rasterizer                                        │ │
│  │ • MLP inference engine (scalar + SIMD)                      │ │
│  │ • Compression codecs (RLE/Delta/Bitpack/Dictionary/I4/I8)   │ │
│  │ • .aioss tamper-proof ledger                                 │ │
│  │ • CLI (bench/query/inspect/dashboard/self-test/ledger)      │ │
│  │ • Local web dashboard                                        │ │
│  │ • FUSE filesystem integration                                │ │
│  │ • Build reproducibility infrastructure                       │ │
│  │ • Binary verification (Cosign + SLSA)                        │ │
│  │ • SBOM generation                                            │ │
│  │ • All tests and benchmarks                                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ENTERPRISE (Kazkade Community License)                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ • LDAP/SSO authentication                                   │ │
│  │ • Role-based access control (RBAC)                          │ │
│  │ • Audit log export (SIEM integration)                       │ │
│  │ • Multi-tenant isolation                                     │ │
│  │ • Encrypted .acol storage at rest                           │ │
│  │ • Hardware Security Module (HSM) integration                 │ │
│  │ • Cluster management / distributed query                    │ │
│  │ • WAL (Write-Ahead Log) replication                         │ │
│  │ • Priority support (SLA: 4h response)                      │ │
│  │ • Compliance reports (SOC2, HIPAA, FedRAMP)                 │ │
│  │ • Custom license terms available                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Feature Comparison Matrix

| Feature | Community (MIT/Apache) | Enterprise (KCL) |
|---------|----------------------|-------------------|
| **Core Runtime** | | |
| Zero-copy mmap engine | ✓ Full | ✓ Full + HSM pages |
| .acol columnar storage | ✓ Full | ✓ Full + encryption |
| SIMD dispatch (AVX2/AVX-512/NEON/SVE) | ✓ Full | ✓ Full |
| **Query Engine** | | |
| SQL parser & executor | ✓ Full | ✓ Full |
| Query optimization | ✓ Full | ✓ Full + distributed |
| Result caching | ✓ Memory only | ✓ Persistent + distributed |
| **Ledger** | | |
| .aioss blockchain | ✓ Full | ✓ Full |
| Cryptographic verification | ✓ Full | ✓ Full |
| Audit trail | ✓ Local only | ✓ SIEM export |
| **Rasterizer** | | |
| Software rasterizer | ✓ Full | ✓ Full |
| Pipeline configuration | ✓ Limited | ✓ Full API |
| **MLP Inference** | | |
| Scalar + SIMD inference | ✓ Full | ✓ Full |
| Model loading | ✓ ONNX + custom | ✓ + enterprise formats |
| Batch processing | ✓ Up to 1024 | ✓ Unlimited |
| **Authentication** | | |
| Local auth | ✓ Built-in | ✓ Built-in |
| LDAP/SSO | ✗ | ✓ Full |
| RBAC | ✗ | ✓ Granular |
| **Security** | | |
| At-rest encryption | ✗ | ✓ AES-256-GCM |
| HSM integration | ✗ | ✓ PKCS#11 |
| Audit logging | ✓ Console | ✓ Syslog/SIEM |
| **Deployment** | | |
| Single-node | ✓ Full | ✓ Full |
| Multi-node cluster | ✗ | ✓ Up to 256 nodes |
| WAL replication | ✗ | ✓ Synchronous |
| **Support** | | |
| Community support | ✓ GitHub Issues | ✓ Priority |
| SLA | Best effort | 4-hour response |
| Custom SLAs | ✗ | ✓ Available |

---

## Community License Details

### Kazkade Community License (KCL) v1.0

The KCL is a commercial license that grants additional rights beyond MIT/Apache:

**Eligibility**: Organizations with annual revenue >$1,000,000 or deploying Kazkade in a production environment serving >10,000 users.

**Rights Granted**:
1. Use all enterprise features in production
2. Modify and self-host enterprise features
3. Deploy in multi-node configurations
4. Receive priority support

**Obligations**:
1. Maintain current subscription
2. Do not sublicense enterprise features
3. Do not remove license notices
4. Comply with applicable laws

**Termination**: License terminates if subscription lapses. Data remains owned by licensee. Grace period of 30 days.

### Pricing

| Tier | Nodes | Support | Price |
|------|-------|---------|-------|
| Community | 1 | Community | Free |
| Starter | 1-3 | Email (24h) | $1,000/node/year |
| Business | 1-10 | Email (8h) | $5,000/node/year |
| Enterprise | Unlimited | Priority (4h) | Custom |

---

## Migration Path

### Community to Enterprise

```bash
# Step 1: Evaluate enterprise features
$ kazkade feature --list
Open Source Features:    34 available
Enterprise Features:     12 available (trial: 30 days)

# Step 2: Enable trial
$ kazkade license --activate-trial

# Step 3: Configure enterprise features
$ kazkade config set auth.type=ldap
$ kazkade config set storage.encryption=aes-256-gcm
$ kazkade config set cluster.nodes=3

# Step 4: Verify all features
$ kazkade self-test --enterprise

# Step 5: Purchase license and apply
$ kazkade license --apply kazkade-enterprise-license.pem
```

### Enterprise to Community (Downgrade)

```bash
# Step 1: Remove enterprise configuration
$ kazkade config unset auth.type
$ kazkade config unset storage.encryption
$ kazkade config set cluster.nodes=1

# Step 2: Disable enterprise features
$ kazkade feature --disable enterprise

# Step 3: Verify community mode
$ kazkade self-test --community

# Step 4: Remove license
$ kazkade license --remove
```

### Data Portability

All data formats (`.acol` storage, `.aioss` ledger, SQL schemas) are identical between Community and Enterprise editions. No data conversion is needed when migrating:

- **Community → Enterprise**: All data is immediately compatible. Enable enterprise features on existing databases.
- **Enterprise → Community**: Enterprise features that enhance data (e.g., encryption) must be disabled. Data remains accessible with community features.

---

## What "Open Source" Means in Kazkade

Every line of code under the MIT/Apache license is:

1. **Fully readable** — No obfuscation, no binary stubs, no encrypted source
2. **Fully buildable** — `cargo build --release` produces working binary
3. **Fully testable** — All tests and benchmarks are included
4. **Forkable** — MIT/Apache permits forking and redistribution
5. **Verifiable** — Build reproducibility ensures forked code matches claim
6. **Auditable** — Third-party audits apply to all MIT/Apache code
7. **Independently maintainable** — Community can maintain forks indefinitely

### What Enterprise Adds

Enterprise features are typically infrastructure integrations that require ongoing maintenance of proprietary integrations:

```rust
// Community: Local authentication
fn authenticate(username: &str, password: &str) -> Result<User> {
    let hash = argon2::hash_password(password)?;
    db::query("SELECT * FROM users WHERE username = ? AND password_hash = ?",
              [username, hash])
}

// Enterprise: LDAP integration (KCL licensed)
#[cfg(feature = "enterprise")]
fn authenticate_via_ldap(username: &str, password: &str) -> Result<User> {
    let ldap_config = config::get_ldap_config()?;
    let ldap_conn = ldap::connect(ldap_config.server)?;
    ldap_conn.bind(&format!("cn={},{}", username, ldap_config.base_dn), password)?;
    // ...
}
```

---

## Transparency in Licensing

Every file in the repository has a clear license header:

```rust
// SPDX-License-Identifier: MIT OR Apache-2.0
// Kazkade - Zero-Copy Compute Runtime
// Copyright (c) 2026 Lois-Kleinner & 0-1.gg
```

Enterprise features are in separate directories with KCL headers:

```rust
// SPDX-License-Identifier: Kazkade-Community-License-1.0
// Kazkade Enterprise - LDAP/SSO Authentication
// Copyright (c) 2026 Lois-Kleinner & 0-1.gg
```

### Feature Gating

Enterprise features are gated at compile time:

```toml
# Cargo.toml
[features]
default = []
enterprise = [
    "kazcade-auth-ldap",
    "kazcade-storage-encrypt",
    "kazcade-cluster",
    "kazcade-rbac",
]
```

Checking whether your binary includes enterprise features:

```bash
$ kazkade version --verbose
Kazkade v0.1.0
Build: release
Features: default (no enterprise features enabled)
License: MIT/Apache 2.0

$ kazkade version --verbose --enterprise
Kazkade v0.1.0-enterprise
Build: release
Features: default, enterprise, ldap, encryption, cluster
License: Kazkade Community License v1.0
```

---

## Sustainability Model

| Revenue Source | Supports |
|---------------|----------|
| Enterprise subscriptions | Core development (6 FTEs) |
| Priority support contracts | Support team (3 FTEs) |
| Consulting services | Custom integrations |
| Training & certification | Documentation & education |
| Community donations | Infrastructure costs |

### Spending Transparency

Kazkade publishes quarterly spending reports:

```markdown
# Q1 2026 Spending Report
Revenue: $450,000
Expenses:
- Engineering salaries: $320,000 (71%)
- Cloud infrastructure: $45,000 (10%)
- Security audits: $30,000 (7%)
- Community events: $15,000 (3%)
- Legal & compliance: $20,000 (4%)
- Operations: $20,000 (4%)
Net: $0 (reinvested)
```

---

## Community vs Enterprise: FAQ

### Can I build a competing product with the community edition?

Yes. The MIT license explicitly permits this. Many companies build commercial products on top of Kazkade's community edition.

### Will core features ever become enterprise-only?

No. The core runtime, storage format, SQL engine, and CLI will always remain open source. The `.acol` format, `.aioss` ledger, and SIMD engine are foundational and will never be paywalled.

### What happens if I stop paying for enterprise?

Your data remains accessible. Enterprise features stop working after the grace period. You can downgrade to community edition with no data loss.

### Can I contribute to enterprise features?

Community contributions to enterprise features are accepted under a contribution license agreement that grants Kazkade the right to maintain them as proprietary.

---

## Feature Requests

Community members can vote on feature priorities:

```bash
$ kazkade feature --request "WAL replication"
Feature request submitted: WAL replication
Current votes: 142
Status: Under consideration (enterprise tier)

$ kazkade feature --roadmap
Q3 2026: WAL replication (enterprise)
Q4 2026: Encrypted .acol storage (enterprise)
Q1 2027: Cross-region replication (enterprise)
Q2 2027: Community: Query federation
```

---

## License Compliance Verification

```bash
# Verify your binary's license compliance
$ kazkade verify --license
License: MIT/Apache 2.0 (community)
Features: 34 open source, 0 enterprise
Compliance: ✓ All dependencies have compatible licenses

# For enterprise:
$ kazkade verify --license
License: Kazkade Community License v1.0
Features: 34 open source, 12 enterprise
Compliance: ✓ Subscription active (expires 2027-06-15)
```

---

## Related Documentation

- [Source Code Transparency](./source-code-transparency.md) — Licensing in source files
- [Dependency Disclosure](./dependency-disclosure.md) — Third-party dependency licenses
- [Community Code Review](./community-code-review.md) — Review process

---

## Quick Reference

```bash
# List features and their licenses
kazkade feature --list
kazkade feature --list --enterprise

# Activate enterprise trial
kazkade license --activate-trial --duration 30

# Apply enterprise license
kazkade license --apply ./license.pem

# Check license status
kazkade verify --license

# Request a feature
kazkade feature --request "Feature description"

# View roadmap
kazkade feature --roadmap
```

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
