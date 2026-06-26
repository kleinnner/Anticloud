▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: compliance | ID: LIB-COMP-007

────────────────────────────────────────────────────────────────

# FedRAMP Considerations

## 1. Overview

The Federal Risk and Authorization Management Program (FedRAMP) is a U.S.
government program that provides a standardized approach to security assessment,
authorization, and continuous monitoring for cloud products and services. FedRAMP
applies to cloud service offerings (CSOs) used by federal agencies.

Libern is not a cloud service — it is a locally-deployed desktop application with
P2P networking. This distinction is critical for FedRAMP analysis. However,
federal agencies may wish to deploy Libern as part of their collaboration
infrastructure, and this document addresses the considerations for doing so
within the FedRAMP framework.

This document covers: how Libern's on-premise deployment model interacts with
FedRAMP requirements, FIPS-compliant cryptography, and the path to authorization
for agencies that need FedRAMP-compliant collaboration tools.

## 2. FedRAMP Applicability

### 2.1 Is Libern a Cloud Service Offering?

FedRAMP defines a cloud service offering as "a complete set of cloud services
that a provider offers to customers." Libern is software that runs on the
customer's own hardware. It does not:

- Operate shared infrastructure
- Provide multi-tenant cloud services
- Store data on provider-controlled servers
- Require internet connectivity to function
- Charge for service usage based on consumption

**Conclusion:** Libern is not a cloud service offering and is not subject to
FedRAMP as a CSO. However, if an agency deploys Libern on a cloud platform
(e.g., AWS Workspaces, Azure Virtual Desktop), the underlying cloud
infrastructure must be FedRAMP-authorized.

### 2.2 FedRAMP Tailored for Low-Impact SaaS

For agencies that wish to treat Libern as a service, FedRAMP Tailored provides a
streamlined path for low-impact SaaS offerings. Libern's architecture aligns well
with the Tailored baseline because:

- Data is processed locally, not in the cloud
- No sensitive authentication credentials are stored on servers
- The cryptographic audit trail provides continuous monitoring
- The open-source codebase enables thorough security review

### 2.3 Agency Authorization Path

Agencies seeking to use Libern can pursue:

1. **FedRAMP Agency Authorization (formerly JAB P-ATO):** For agency-specific
   deployment on FedRAMP-authorized infrastructure
2. **FedRAMP Tailored:** For low-impact use cases
3. **FedRAMP Equivalent:** If Libern is deployed on-premise, agencies may
   determine that FedRAMP requirements are met through NIST SP 800-53 controls
   applied to the deployment environment

## 3. FIPS-Compliant Cryptography

### 3.1 FIPS 140-3 Requirements

Federal Information Processing Standard (FIPS) 140-3 defines security requirements
for cryptographic modules. Federal agencies must use FIPS-validated cryptography
for protecting sensitive information.

Libern uses the following cryptographic primitives:

| Algorithm | Usage | FIPS Status |
|-----------|-------|-------------|
| Ed25519 | Digital signatures, identity | Not FIPS-approved (EdDSA variant) |
| SHA-3 | Hash chaining | FIPS 202 approved |
| ChaCha20-Poly1305 | P2P transport encryption | Not FIPS-approved |
| AES-256-GCM | Optional data at rest encryption | FIPS 197 / SP 800-38D approved |

### 3.2 FIPS Mode Configuration

For federal deployments requiring FIPS compliance, Libern can be configured to
use FIPS-approved algorithms:

- **Signatures:** Replace Ed25519 with ECDSA P-384 (FIPS 186-5)
- **Hash chaining:** Replace SHA-3 with SHA-384 (FIPS 180-4) or retain SHA-3
  (FIPS 202 approved)
- **Transport encryption:** Replace ChaCha20-Poly1305 with AES-256-GCM
  (FIPS 197 / SP 800-38D)
- **Key agreement:** Use ECDH with NIST P-384 (SP 800-56A)

A "FIPS mode" configuration flag will select FIPS-approved algorithm variants
and disable non-approved algorithms. This mode should be enabled for all federal
deployments.

### 3.3 Cryptographic Module Validation

Libern uses cryptographic implementations from:

- **RustCrypto:** Pure Rust implementations of standard algorithms
- **OpenSSL (via ring):** FIPS-validated cryptographic library
- **OS crypto providers:** Platform FIPS modules (Windows CNG, macOS
  CryptoKit)

For FIPS compliance, Libern should be configured to use FIPS-validated modules:
- On Windows: Use CNG (Cryptography Next Generation) with FIPS mode enabled
- On Linux: Use OpenSSL FIPS module
- On macOS: Use CryptoKit with FIPS-compliant algorithms

## 4. NIST SP 800-53 Control Mapping

### 4.1 Access Control (AC)

| Control | Libern Implementation |
|---------|---------------------|
| AC-2 — Account Management | Ed25519 key-based identity management |
| AC-3 — Access Enforcement | Role-based access control per channel/server |
| AC-4 — Information Flow Enforcement | P2P connections control data flow |
| AC-5 — Separation of Duties | Server owner, admin, member roles |
| AC-6 — Least Privilege | Granular channel permissions |
| AC-7 — Unsuccessful Logon Attempts | OS-level authentication |
| AC-17 — Remote Access | Encrypted P2P for remote peers |

### 4.2 Audit and Accountability (AU)

| Control | Libern Implementation |
|---------|---------------------|
| AU-2 — Audit Events | .aioss ledger records all security-relevant events |
| AU-3 — Content of Audit Records | Cryptographic signatures, timestamps, identities |
| AU-4 — Audit Storage Capacity | Local disk storage, configurable retention |
| AU-5 — Response to Audit Processing Failures | CRDT continues logging even on partial failure |
| AU-6 — Audit Review, Analysis, and Reporting | Exportable .aioss for analysis tools |
| AU-7 — Audit Reduction and Report Generation | .aioss format supports automated processing |
| AU-8 — Time Stamps | OS NTP-synchronized timestamps |
| AU-9 — Protection of Audit Information | Hash chain prevents tampering |
| AU-11 — Audit Record Retention | Configurable retention policy |
| AU-12 — Audit Generation | Automatic generation of all event types |

### 4.3 Configuration Management (CM)

| Control | Libern Implementation |
|---------|---------------------|
| CM-2 — Baseline Configuration | Default configuration is security-focused |
| CM-3 — Configuration Change Control | Release process with versioning |
| CM-4 — Security Impact Analysis | Open source enables community analysis |
| CM-6 — Configuration Settings | Documented configuration parameters |
| CM-7 — Least Functionality | Minimal attack surface, single binary |
| CM-8 — Information System Component Inventory | SBOM available |

### 4.4 Identification and Authentication (IA)

| Control | Libern Implementation |
|---------|---------------------|
| IA-2 — Identification and Authentication | Ed25519 key pairs |
| IA-3 — Device Identification | Key-based device identity |
| IA-4 — Identifier Management | Key generation and registration |
| IA-5 — Authenticator Management | Key storage, backup, rotation |
| IA-6 — Authenticator Feedback | Visual indicators for authentication status |
| IA-7 — Cryptographic Module Authentication | FIPS-compliant mode available |
| IA-8 — Identification and Authentication (Non-Org) | P2P peer identification |

### 4.5 Incident Response (IR)

| Control | Libern Implementation |
|---------|---------------------|
| IR-4 — Incident Handling | .aioss audit trail for forensics |
| IR-5 — Incident Monitoring | Continuous monitoring via ledger |
| IR-6 — Incident Reporting | Exportable incident evidence |
| IR-7 — Incident Response Assistance | Documentation and support |

### 4.6 System and Communications Protection (SC)

| Control | Libern Implementation |
|---------|---------------------|
| SC-7 — Boundary Protection | P2P communication on local network |
| SC-8 — Transmission Confidentiality | Encrypted P2P channels |
| SC-12 — Cryptographic Key Establishment | Ed25519 key generation and exchange |
| SC-13 — Cryptographic Protection | FIPS-compliant algorithms available |
| SC-28 — Protection of Information at Rest | Local encryption via platform |
| SC-39 — Process Isolation | Single binary, OS-level process isolation |

### 4.7 System and Information Integrity (SI)

| Control | Libern Implementation |
|---------|---------------------|
| SI-3 — Malicious Code Protection | Code signing, minimal dependencies |
| SI-4 — System Monitoring | .aioss ledger enables monitoring |
| SI-7 — Software Integrity | Signed releases, hash verification |
| SI-10 — Information Input Validation | CRDT validation of all operations |
| SI-12 — Information Handling | Cryptographic handling of all data |

## 5. Continuous Monitoring

### 5.1 FedRAMP Continuous Monitoring Requirements

FedRAMP requires continuous monitoring of security controls. Libern supports this
through:

- **Automated audit logging:** The .aioss ledger automatically records all
  security-relevant events
- **Integrity verification:** The hash chain enables automated verification
  that audit logs have not been tampered with
- **Configuration monitoring:** Configuration changes are recorded in the audit
  trail
- **Vulnerability scanning:** The single binary has a minimal attack surface;
  scanning can focus on the deployment environment

### 5.2 Automated Scanning and Reporting

Libern can be integrated with existing monitoring tools:

- Audit logs can be exported in standard formats
- Metric collection via OS-level monitoring
- Integration with SIEM tools through log export
- Automated compliance reporting via .aioss analysis

## 6. Deployment Models for Federal Agencies

### 6.1 On-Premise Deployment (Recommended)

Agencies deploy Libern on their own managed endpoints:
- Full control over hardware and network
- No external dependencies
- Works in air-gapped environments
- Compatible with existing endpoint security tools
- FedRAMP authorization follows the agency's existing ATO

### 6.2 Virtual Desktop Infrastructure (VDI)

Libern can be deployed on FedRAMP-authorized VDI:
- Underlying VDI platform must be FedRAMP-authorized
- Libern runs within the VDI session
- Data never leaves the VDI environment
- P2P discovery must be configured for VDI network architecture

### 6.3 Cloud-Hosted Endpoints

Agencies can run Libern on FedRAMP-authorized cloud desktops:
- AWS Workspaces (FedRAMP-authorized)
- Azure Virtual Desktop (FedRAMP-authorized)
- Libern runs as a user application within the authorized environment

## 7. FedRAMP Authorization Package

An agency pursuing FedRAMP authorization for a Libern deployment should prepare:

### 7.1 System Security Plan (SSP)
- System description and architecture
- Control implementation descriptions (use Section 4 as starting point)
- Boundary diagram showing Libern's scope

### 7.2 Security Assessment Report (SAR)
- Assessment of Libern's controls
- Vulnerability scanning results
- Penetration test findings

### 7.3 Plan of Action and Milestones (POA&M)
- Any identified weaknesses and remediation plans
- Timeline for addressing findings

## 8. Comparison with FedRAMP-Authorized Alternatives

| Requirement | Libern (On-Premise) | FedRAMP Cloud Collaboration Tools |
|-------------|-------------------|----------------------------------|
| FedRAMP Authorization | Not required (not cloud) | Required |
| FIPS 140-3 | Configurable | Required |
| Data residency | Agency-controlled | Cloud provider dependent |
| Audit trail | Built-in (.aioss) | Add-on typically required |
| Cost per user | Free (AGPL-3.0) | Variable per-seat licensing |
| Open source | Yes | No |
| Internet required | No | Yes (typically) |

## 9. FedRAMP Tailored for Libern

### 9.1 Eligibility

FedRAMP Tailored is designed for low-impact SaaS services. Libern's deployment
characteristics align well with the Tailered baseline:
- No multi-tenancy concerns (each user has local data)
- No identity management system (cryptographic identity)
- No externalized data storage (all data is local)

### 9.2 Tailored Baseline Controls

FedRAMP Tailored includes 37 controls from the NIST SP 800-53 baseline. Libern
directly supports these key controls:

- **AC-2, AC-3, AC-6:** Access control via Ed25519 keys and RBAC
- **AU-2, AU-3, AU-6:** Audit via .aioss ledger
- **IA-2, IA-5:** Identification and authentication via cryptographic keys
- **SC-8, SC-13:** Transmission and cryptographic protection
- **SI-4, SI-7:** Monitoring and integrity verification

## 10. Security Assessment Process

### 10.1 Third-Party Assessment Organization (3PAO)

For agencies pursuing FedRAMP authorization, a 3PAO will assess Libern. The
assessment should cover:

1. **Architecture review:** Libern's local-first, P2P architecture
2. **Code review:** Open source codebase inspection
3. **Penetration testing:** Focus on P2P communication, local data storage,
   and cryptographic implementation
4. **Control testing:** Verification of all NIST SP 800-53 controls
5. **Documentation review:** SSP, SAR, POA&M completeness

### 10.2 Assessment Artifacts

Libern provides the following artifacts for assessment:

| Artifact | Description | Location |
|----------|-------------|----------|
| Architecture documentation | System design and data flows | docs/developers/ |
| Compliance mapping | Control implementation descriptions | docs/compliance/ |
| Security documentation | Security features and configuration | docs/enterprise/ |
| Source code | Full source for review | github.com/libern/libern |
| Build system | Reproducible builds | CI/CD configuration |
| Dependency list | SBOM for all dependencies | Included with release |

## 11. Supply Chain Risk Management

### 11.1 Software Supply Chain

Libern manages supply chain risk through:
- **Reproducible builds:** Binaries can be independently verified
- **Signed releases:** All releases are cryptographically signed
- **Dependency scanning:** Automated vulnerability scanning for all dependencies
- **SBOM:** Software Bill of Materials included with each release
- **Minimal dependencies:** Libern has a small dependency footprint

### 11.2 Third-Party Component Assessment

| Component | Risk Level | Assessment |
|-----------|-----------|------------|
| Rust standard library | Low | Well-audited, industry standard |
| SQLite | Low | Extensive testing, public domain |
| Candle ML library | Medium | Audited for security, no data transmission |
| WebSocket library | Low | Standard protocol, encrypted |
| Operating system APIs | Low | Standard OS interfaces |

## 12. Frequently Asked Questions for Federal Agencies

### 12.1 Is Libern FedRAMP-authorized?

Libern itself is not a cloud service and does not require FedRAMP authorization.
However, Libern can be deployed within FedRAMP-authorized environments (cloud
VDI, managed endpoints) and supports agencies in meeting FedRAMP control
requirements.

### 12.2 Can Libern be used in classified environments?

Libern can be used in classified environments with appropriate approvals.
The open-source codebase enables security classification review. For classified
deployments, additional security measures may be required based on the
classification level.

### 12.3 How does Libern handle COOP (Continuity of Operations)?

Libern's offline-first architecture supports COOP requirements. Users can
continue working during outages, and the P2P network provides resilient
communication without centralized infrastructure.

### 12.4 Does Libern support FIPS 140-3 validation?

Yes, through the FIPS mode configuration described in Section 3. When enabled,
Libern uses FIPS-validated cryptographic modules and algorithms.

### 12.5 Can Libern be integrated with PIV/CAC authentication?

Yes. Libern can be configured to require PIV/CAC authentication at the OS
level for device access. The Ed25519 identity can be linked to PIV/CAC
credentials through certificate mapping.


## 14. FedRAMP Control Implementation Details

### 14.1 AC-2 Account Management

Libern manages identities through Ed25519 cryptographic keys:

```
User Account Lifecycle:
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│ Key Gen    │───►│ Provision  │───►│ Active Use │───►│ Revocation │
│ (local)    │    │ (add peer) │    │ (sign ops) │    │ (remove)   │
└────────────┘    └────────────┘    └────────────┘    └────────────┘
     │                 │                 │                 │
     ▼                 ▼                 ▼                 ▼
  Ed25519 key     Server auth      .aioss signed      Key removed
  pair created    record added     operations          from servers
```

### 14.2 AU-2 Audit Events

The .aioss ledger records the following event types for FedRAMP compliance:

| Event Type | Trigger | .aioss Entry Type | Retention |
|-----------|---------|-------------------|-----------|
| Message sent | User sends message | `message` | Configurable |
| File uploaded | User shares file | `file_upload` | Configurable |
| Peer joined | New peer authorized | `peer_join` | Permanent |
| Peer removed | Peer deauthorized | `peer_leave` | Permanent |
| Role changed | Permission modified | `role_change` | Permanent |
| Key rotated | User rotates key | `key_rotation` | Permanent |
| Channel created | New channel | `channel_create` | Permanent |
| Channel deleted | Channel removed | `channel_delete` | Permanent |
| Config changed | Settings modified | `config_change` | Permanent |
| AI interaction | AI query/response | `ai_prompt/ai_response` | Configurable |

### 14.3 IA-2 Identification and Authentication

```rust
// From crates/libern-core/src/crypto/mod.rs:
// Each user is identified by their Ed25519 public key
// Authentication is proven by signing a challenge

pub struct Identity {
    pub public_key: [u8; 32],     // Ed25519 public key
    pub key_type: KeyType,         // Ed25519
    pub created_at: u64,           // Creation timestamp
    pub label: Option<String>,     // Human-readable label (optional)
}

pub fn authenticate(verifier: &[u8], signature: &[u8], pubkey: &[u8; 32]) -> bool {
    // Returns true if signature is valid for the given verifier and public key
}
```

### 14.4 SC-8 Transmission Confidentiality

| Layer | Protocol | Encryption | Key Exchange |
|-------|----------|-----------|-------------|
| Discovery | mDNS (UDP 5353) | None (metadata only) | N/A |
| P2P messaging | WebSocket (TCP) | ChaCha20-Poly1305 / AES-256-GCM | Ed25519 key exchange |
| Voice | UDP direct | X25519 + AES-256-GCM | Ed25519 key exchange |
| Model download | HTTPS (TCP 443) | TLS 1.3 | Standard PKI |

## 15. FedRAMP Tailored Baseline — Complete Control Response

### 15.1 Tailored Controls (37 total)

| NIST SP 800-53 Control | Libern Implementation |
|------------------------|----------------------|
| AC-2 Account Management | Ed25519 key lifecycle |
| AC-3 Access Enforcement | RBAC + cryptographic |
| AC-6 Least Privilege | Granular channel permissions |
| AC-7 Unsuccessful Logins | OS-level lockout |
| AC-17 Remote Access | Encrypted P2P |
| AU-2 Audit Events | .aioss ledger |
| AU-3 Audit Content | Signed entries with all fields |
| AU-6 Audit Review | Exportable logs for analysis |
| AU-8 Time Stamps | OS NTP-synchronized HLC |
| AU-12 Audit Generation | Automatic, covers all events |
| CM-2 Baseline | Security-focused default config |
| IA-2 Identification | Unique Ed25519 keys |
| IA-5 Authenticator Mgmt | Full key lifecycle |
| IR-4 Incident Handling | Audit trail forensics |
| SC-7 Boundary Protection | LAN-only P2P by default |
| SC-8 Transmission | Encrypted channels |
| SC-12 Key Management | Ed25519 + optional KMS |
| SC-13 Cryptography | FIPS mode available |
| SC-28 At Rest Protection | Platform-level encryption |
| SI-4 System Monitoring | Ledger-based monitoring |
| SI-7 Software Integrity | Signed releases + verification |

## 16. FIPS 140-3 Implementation Details

### 16.1 FIPS Mode Configuration File

```json
{
  "fips_mode": {
    "enabled": true,
    "signature_algorithm": "ECDSA-P384",
    "hash_algorithm": "SHA-384",
    "encryption_algorithm": "AES-256-GCM",
    "key_agreement": "ECDH-P384",
    "crypto_module": "os_provider",
    "validate_at_startup": true,
    "block_non_fips_algorithms": true
  }
}
```

### 16.2 Cryptographic Module Selection

| OS | FIPS Module | Validation |
|---|------------|-----------|
| Windows | Microsoft CNG | FIPS 140-3 (pending) |
| RHEL 9 | OpenSSL FIPS Provider | FIPS 140-3 |
| Ubuntu 22.04 | OpenSSL 3 FIPS | FIPS 140-3 |
| macOS | Apple CryptoKit | FIPS 140-3 (pending) |

### 16.3 FIPS Compliance Verification Script

```powershell
# Windows FIPS Verification
Get-ItemPropertyValue -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa\FipsAlgorithmPolicy" -Name "Enabled"
libern --fips-status
# Expected: "FIPS mode: ENABLED | Algorithms: ECDSA-P384, SHA-384, AES-256-GCM"
```

```bash
# Linux FIPS Verification
fips-mode-setup --check
openssl list -providers | grep fips
libern --fips-status
# Expected: "FIPS mode: ENABLED | Crypto module: OpenSSL FIPS Provider"
```

## 17. NIST SP 800-53 Code References

| Control | Libern Source |
|---------|--------------|
| AC-2 | `crates/libern-core/src/crypto/identity.rs` |
| AC-3 | `crates/libern-core/src/db/schema.rs` |
| AU-2 | `crates/libern-aioss/src/ledger.rs` |
| AU-3 | `crates/libern-aioss/src/entry.rs` |
| AU-8 | `crates/libern-core/src/crdt/hlc.rs` |
| IA-2 | `crates/libern-core/src/crypto/mod.rs` |
| SC-8 | `apps/sandbox/src/voice.rs` |
| SC-12 | `crates/libern-core/src/crypto/mod.rs` |
| SC-13 | `crates/libern-aioss/src/state_proof.rs` |
| SC-28 | `crates/libern-core/src/db/encryption.rs` |
| SI-7 | `crates/libern-aioss/src/verify.rs` |


## 13. Conclusion

Libern offers federal agencies a unique value proposition for secure
collaboration:

1. **Not a cloud service:** FedRAMP applies to the deployment infrastructure,
   not to Libern itself
2. **FIPS-compliant mode:** Configurable to meet federal cryptographic
   requirements
3. **On-premise control:** Agencies maintain full data sovereignty
4. **Comprehensive audit:** .aioss ledger supports all NIST SP 800-53 audit
   controls
5. **Open source transparency:** Full code review capability for security
   assessors

Federal agencies should work with their Authorizing Official to determine the
appropriate authorization path for their specific Libern deployment.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ