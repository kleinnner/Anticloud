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
Category: compliance | ID: LIB-COMP-002

────────────────────────────────────────────────────────────────

# HIPAA Compliance

## 1. Overview

The Health Insurance Portability and Accountability Act (HIPAA) establishes
national standards for protecting sensitive patient health information (known as
Protected Health Information or PHI). HIPAA applies to covered entities (health
care providers, health plans, health care clearinghouses) and their business
associates.

Libern's architecture — local-first, P2P, no cloud dependency — is uniquely suited
for HIPAA-compliant communications. Because PHI never leaves the local device
unless explicitly shared via encrypted P2P connections, many of the most
challenging HIPAA compliance requirements are automatically satisfied.

This document analyzes Libern against the HIPAA Privacy Rule, Security Rule, and
Breach Notification Rule, with special attention to the Business Associate
relationship.

## 2. HIPAA Privacy Rule (45 CFR § 164.500-534)

### 2.1 Permitted Uses and Disclosures

The Privacy Rule defines how PHI may be used and disclosed. Libern supports
compliance with these restrictions because:

- All data processing occurs locally on the user's device. No data is sent to
  any third party for processing.
- Data sharing is fully under the control of the user. Only explicitly authorized
  peers receive any data.
- The open-source codebase allows covered entities to verify exactly what data
  is collected, processed, and transmitted.

### 2.2 Minimum Necessary Standard

The Privacy Rule requires that only the minimum necessary PHI be used or disclosed.
Libern's architecture inherently respects this principle:

- Users control exactly what data they share and with whom
- Data synchronization is granular — individual messages, files, or channels can
  be selectively shared
- No automatic metadata collection or sharing occurs
- The application does not collect or transmit any data beyond what the user
  explicitly creates

### 2.3 Notice of Privacy Practices

Covered entities must provide patients with a notice of privacy practices. While
Libern does not generate this notice, it supports compliance by:

- Providing full transparency through open source code
- Ensuring that no data practices are hidden from patients
- Allowing the covered entity to accurately describe data flows because they
  are deterministic and observable

## 3. HIPAA Security Rule (45 CFR § 164.302-318)

### 3.1 Administrative Safeguards

| Standard | Libern Support |
|----------|----------------|
| Security Management Process | Libern provides .aioss audit logs for risk analysis and sanction policies |
| Assigned Security Responsibility | Configurable — organization designates a security officer |
| Workforce Security | Ed25519 key-based identity ensures only authorized users access data |
| Information Access Management | Server administrators control peer authorization |
| Security Awareness and Training | Libern's transparency aids training; no hidden data flows |
| Security Incident Procedures | .aioss audit trail supports incident detection and reporting |
| Contingency Plan | .aioss exports provide backup; P2P redundancy aids recovery |
| Evaluation | Periodic evaluation supported by open code and audit trails |
| Business Associate Contracts | See Section 5 below |

### 3.2 Physical Safeguards

| Standard | Libern Support |
|----------|----------------|
| Facility Access Controls | Libern runs on the organization's existing hardware |
| Workstation Security | Libern data is stored in the user's home directory; standard OS controls apply |
| Device and Media Controls | .aioss export enables controlled data transfer and disposal |
| Accountability | Audit trails provide accountability for access and changes |

### 3.3 Technical Safeguards

#### 3.3.1 Access Control (164.312(a)(1))

- **Unique User Identification:** Each Libern user is identified by their Ed25519
  public key, providing a unique, non-repudiable identifier.
- **Emergency Access Procedure:** Organizations can establish key escrow or backup
  identity procedures for emergency access (see key recovery documentation).
- **Automatic Logoff:** Libern uses OS-level session management. Data at rest is
  protected when the user locks their workstation.
- **Encryption and Decryption:** PHI at rest is protected by platform-level
  encryption (BitLocker, FileVault, LUKS). PHI in transit is encrypted via P2P
  TLS channels.

#### 3.3.2 Audit Controls (164.312(b))

Libern provides comprehensive audit controls through the .aioss ledger:

- Every message, file operation, and configuration change is recorded
- Each record is signed with the user's Ed25519 private key
- Records are hash-chained to prevent tampering
- The ledger can be exported and inspected using standard tools
- All access to data leaves cryptographic evidence

This exceeds the HIPAA requirement for hardware, software, and procedural
mechanisms that record and examine access to PHI.

#### 3.3.3 Integrity Controls (164.312(c)(1))

- **Hash chaining:** The .aioss ledger creates an unbreakable chain of custody.
  Any modification to a prior record invalidates all subsequent hashes.
- **Digital signatures:** Ed25519 signatures ensure that records are authentic
  and have not been tampered with.
- **CRDT convergence:** The Conflict-Free Replicated Data Type ensures that
  all peers converge to the same state, eliminating data integrity disputes.

#### 3.3.4 Person or Entity Authentication (164.312(d))

- Ed25519 key pairs serve as the foundation for identity.
- Authentication is cryptographic rather than password-based.
- Key compromise detection and rotation procedures are supported.

#### 3.3.5 Transmission Security (164.312(e)(1))

- All P2P communication is encrypted in transit.
- mDNS-based peer discovery operates on the local network only.
- No communication passes through any intermediary server.

### 3.4 Organizational Requirements (164.314)

- **Business Associate Contracts:** See Section 5.
- **Group Health Plan requirements:** Libern data can be isolated per plan or
  employer group by creating separate servers.

## 4. Breach Notification Rule (45 CFR §§ 164.400-414)

### 4.1 Breach Detection

Libern's .aioss audit trail makes breach detection straightforward:

- The hash chain can be inspected for unexpected records
- Digital signatures can be verified against known public keys
- Any deviation from expected state is cryptographically detectable

### 4.2 Breach Notification

While Libern cannot automatically generate breach notifications to HHS, affected
individuals, or the media, it supports the notification process by:

- Providing a complete record of what data was accessed and when
- Enabling rapid isolation of compromised peers
- Supporting forensic analysis through cryptographic proofs

### 4.3 Risk Assessment

The four-factor risk assessment required by HIPAA is simplified with Libern:

1. **Nature and extent of PHI involved:** Can be determined precisely from the
   .aioss audit trail.
2. **Unauthorized person who accessed PHI:** Identified by Ed25519 public key.
3. **Whether PHI was actually acquired or viewed:** .aioss records show all reads.
4. **Extent of risk mitigation:** Can be demonstrated through key rotation,
   peer removal, and data recovery procedures.

## 5. Business Associate Considerations

### 5.1 Is Libern a Business Associate?

Under HIPAA, a Business Associate is a person or entity that creates, receives,
maintains, or transmits PHI on behalf of a covered entity. Libern is distributed
as software, not as a service. The key distinction:

- **Libern as software:** When a covered entity downloads and runs Libern on its
  own infrastructure, Libern is a software tool, not a Business Associate. The
  covered entity maintains full control over the data and infrastructure.
- **Libern as a service:** If an organization hosts Libern for another covered
  entity, that organization would be a Business Associate and would need a BAA.

Most Libern deployments will fall into the first category — the covered entity
downloads the single binary, runs it on its own hardware, and controls all data.

### 5.2 If a BAA Is Needed

For deployments where Libern is provided as a managed service, a Business
Associate Agreement (BAA) should address:

- **Permitted uses:** Limited to the collaboration functionality described in
  this document.
- **Safeguards:** The technical safeguards described in Section 3.
- **Reporting:** Breach notification procedures.
- **Termination:** Data destruction upon termination of the BAA.
- **Subcontractors:** Libern does not use subcontractors for data processing.

### 5.3 Subcontractor Liability

Libern has no subcontractors in its core architecture. The software does not
depend on any external data processing service. This eliminates the cascading
BAA requirements that exist in cloud-based solutions.

## 6. Implementation Guidance for Covered Entities

### 6.1 Recommended Configuration for HIPAA Compliance

1. **Deploy on managed endpoints:** Use organization-managed devices with full
   disk encryption (BitLocker, FileVault, LUKS).
2. **Enable .aioss logging:** Ensure the .aioss ledger is enabled and configured
   for appropriate retention periods.
3. **Implement key management:** Establish procedures for Ed25519 key generation,
   storage, backup, and rotation.
4. **Configure network isolation:** Restrict Libern P2P communication to trusted
   network segments.
5. **Establish audit review procedures:** Regularly review .aioss audit logs.
6. **Document data flows:** Use this document as a starting point for your own
   data flow mapping and risk assessment.

### 6.2 Prohibited Configurations

- Do not use public mDNS discovery across untrusted networks
- Do not share Ed25519 private keys outside the organization
- Do not disable cryptographic verification features
- Do not use Libern on devices without disk encryption

## 7. Comparison with Cloud-Based Alternatives

| Requirement | Libern | Slack/Teams | Signal |
|-------------|--------|-------------|--------|
| PHI on device only | Yes | No | Yes |
| No third-party processing | Yes | No | No |
| Audit trail | Built-in (.aioss) | Enterprise add-on | Limited |
| Open source | Yes (AGPL-3.0) | No | Yes |
| BAA needed | No (self-hosted) | Yes | No |
| Local AI processing | Yes | No | No |
| FIPS compliance path | Yes | Vendor-dependent | Vendor-dependent |

## 8. HIPAA Compliance Checklist

### 8.1 Pre-Deployment

- [ ] Conduct a HIPAA Security Rule risk assessment for the Libern deployment
- [ ] Document all data flows and processing activities
- [ ] Establish Ed25519 key management procedures (generation, storage, rotation)
- [ ] Configure .aioss audit logging with appropriate retention periods
- [ ] Deploy Libern on managed, encrypted endpoints
- [ ] Set up network isolation for Libern P2P traffic
- [ ] Train workforce members on Libern usage and HIPAA requirements
- [ ] Update Notice of Privacy Practices to include Libern

### 8.2 Ongoing Operations

- [ ] Review .aioss audit logs weekly
- [ ] Verify peer authorization list is current (monthly)
- [ ] Test backup and recovery procedures (quarterly)
- [ ] Conduct periodic risk assessments (annually)
- [ ] Update documentation when Libern is updated

### 8.3 Breach Response

- [ ] Have breach notification procedures documented
- [ ] Maintain ability to determine breach scope from .aioss logs
- [ ] Test breach response procedures (annually)
- [ ] Ensure contact information for OCR notification is current

## 9. Role of the HIPAA Security Officer

### 9.1 Responsibilities

The HIPAA Security Officer for organizations deploying Libern should:

1. **Oversee key management:** Ensure Ed25519 keys are properly generated,
   stored, backed up, and rotated according to policy
2. **Monitor audit logs:** Review .aioss ledger exports for suspicious activity
3. **Manage access control:** Authorize and de-authorize peers in Libern servers
4. **Conduct training:** Ensure all Libern users understand HIPAA obligations
5. **Incident response:** Lead response to any suspected HIPAA breach involving
   Libern

### 9.2 Tools Available

The Security Officer can use Libern's features:

```bash
# Export audit log for review period
libern --export-aioss --since "2026-01-01" --until "2026-03-31"

# Verify all peer identities
libern --list-peers --show-keys

# Check database integrity for forensic purposes
libern --check-db --verbose

# Generate compliance report
libern --compliance-report --standard hipaa
```

## 10. HIPAA and the .aioss Audit Trail

### 10.1 Meeting 45 CFR § 164.312(b)

The HIPAA Security Rule requires audit controls that record and examine access
to PHI. Libern's .aioss ledger satisfies this requirement comprehensively:

| Audit Log Requirement | .aioss Implementation |
|----------------------|---------------------|
| Record access to PHI | Every message read/write is recorded |
| Record modifications | Edits and deletions are logged with tombstones |
| Record timestamps | Each operation includes NTP-synchronized timestamp |
| Identify the user | Each operation is signed with Ed25519 key |
| Detect tampering | Hash chain makes tampering evident |
| Retain logs | Configurable retention, exportable to .aioss |
| Review capability | Standard tools can parse and analyze |

### 10.2 Audit Log Review Procedures

Recommended review schedule:
- **Daily:** Automated integrity check of the .aioss hash chain
- **Weekly:** Review of new peer authorizations and permission changes
- **Monthly:** Full audit log review for suspicious patterns
- **Quarterly:** Comprehensive compliance review including log retention

## 11. Frequently Asked Questions

### 11.1 Can I use Libern for telemedicine?

Yes. Libern's voice chat and messaging features can be used for telemedicine
communications, provided the deployment follows the HIPAA configuration
guidelines in this document and the device is properly secured.

### 11.2 Is voice chat HIPAA-compliant?

Voice chat in Libern uses encrypted P2P channels. Voice data is not stored
unless explicitly recorded (which must be disclosed to participants). For
HIPAA compliance, ensure voice chat is used on encrypted endpoints and all
participants are authorized.

### 11.3 How do I handle a patient's request for PHI access?

Use the .aioss export feature to create a complete, cryptographically signed
record of all communications involving the patient. Provide the export to the
patient along with the Libern verification tools.

### 11.4 What if a Libern update changes audit log behavior?

Libern maintains backward compatibility for .aioss format within major
versions. Changes to audit behavior are documented in release notes. The
Security Officer should review release notes before updating.

### 11.5 Can Libern integrate with existing SIEM tools?

Yes. The .aioss ledger can be exported to JSON or other formats for
integration with SIEM tools. Custom integration scripts can parse the
ledger for automated monitoring and alerting.

## 12. Comparison with Other HIPAA-Compliant Tools

| Requirement | Libern (Self-Hosted) | HIPAA-Certified Cloud Tools |
|-------------|---------------------|---------------------------|
| PHI location | Local device only | Cloud servers |
| BAA required | No | Yes |
| Open source | Yes (AGPL-3.0) | Typically no |
| Audit trail | Built-in (.aioss) | Usually add-on |
| Encryption at rest | Platform-level | Provider-managed |
| Encryption in transit | P2P encrypted | Provider-managed |
| Offline capability | Full | Limited or none |
| Cost | Free | Per-user subscription |
| Third-party AI | None (local) | Often cloud AI |

## 13. Conclusion

Libern offers a compelling compliance posture for healthcare organizations that
need HIPAA-compliant collaboration tools. The key advantages are:

1. **PHI never leaves the device** unless explicitly shared via encrypted P2P
2. **No Business Associate relationship** when self-hosted
3. **Comprehensive audit trail** through the .aioss ledger
4. **No third-party data processing** — all AI and computation is local
5. **Full transparency** through open source code

Healthcare organizations should perform their own risk assessment and consult
with legal counsel, but Libern's architecture eliminates many of the most
challenging HIPAA compliance burdens associated with cloud-based alternatives.

## 14. Appendix: HIPAA Regulatory References

| Regulation | Topic | Libern Compliance Section |
|------------|-------|--------------------------|
| 45 CFR § 164.104 | Applicability | Section 2 |
| 45 CFR § 164.306 | Security Rule general rules | Section 3 |
| 45 CFR § 164.308 | Administrative safeguards | Section 3.1 |
| 45 CFR § 164.310 | Physical safeguards | Section 3.2 |
| 45 CFR § 164.312 | Technical safeguards | Section 3.3 |
| 45 CFR § 164.314 | Organizational requirements | Section 3.4 |
| 45 CFR § 164.316 | Policies and procedures | Section 3 |
| 45 CFR § 164.400-414 | Breach notification | Section 4 |
| 45 CFR § 164.500-534 | Privacy Rule | Section 2 |
| 45 CFR § 160.103 | Definitions | Section 5 |


## 16. Implementation Walkthrough for Healthcare Organizations

### 16.1 HIPAA Deployment Checklist — Expanded

**Phase 1: Security Rule Controls (45 CFR § 164.308-312)**

```
┌──────────────────────────────────────────────────────────────┐
│            HIPAA Security Rule — Libern Control Map            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Administrative Safeguards (§ 164.308)                        │
│  ├─ Security Management: .aioss audit logs                    │
│  ├─ Security Personnel: Designated security officer           │
│  ├─ Info Access Mgmt: Ed25519 RBAC                            │
│  ├─ Workforce Training: Open source transparency              │
│  ├─ Evaluation: Periodic .aioss review                        │
│  └─ Contingency: .aioss exports + peer redundancy             │
│                                                               │
│  Physical Safeguards (§ 164.310)                              │
│  ├─ Facility Access: Org-managed hardware                     │
│  ├─ Workstation Security: OS controls + disk encryption       │
│  ├─ Device/Media: .aioss export for controlled transfer       │
│  └─ Accountability: Full audit trail                          │
│                                                               │
│  Technical Safeguards (§ 164.312)                             │
│  ├─ Access Control: Ed25519 keys + RBAC + emergency access    │
│  ├─ Audit Controls: .aioss comprehensive logging              │
│  ├─ Integrity: SHA-3 hash chain + Ed25519 signatures          │
│  ├─ Auth: Cryptographic identity verification                 │
│  └─ Transmission: Encrypted P2P WebSocket channels            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 16.2 Real-World Scenario: Multi-Hospital PHI Sharing

**Scenario:** A network of three hospitals needs to share patient transfer records, lab results, and imaging referrals across facilities while maintaining strict HIPAA compliance.

**Challenge:** Traditional EMR integration requires lengthy BAAs, VPN configuration, and audit log aggregation.

**Libern Solution:**
1. Each hospital deploys Libern on locked-down, encrypted workstations
2. Radiologists, attending physicians, and case managers are issued Libern identities
3. PHI-sharing channels are created with role-based access (attending only, read-only for consultants)
4. Every PHI access is logged in the .aioss ledger with Ed25519 cryptographic proof
5. Platform-level encryption (BitLocker/FileVault) protects data at rest
6. P2P channels use AES-256-GCM encryption for transmission
7. HIPAA Security Officer reviews .aioss logs weekly using `libern --audit-key-usage`

### 16.3 PHI Flow Diagram

```
┌──────────────────┐          ┌──────────────────┐
│  Hospital A       │          │  Hospital B       │
│  ─────────────     │          │  ─────────────     │
│  Attending MD     │◄────────►│  Radiologist      │
│  Ed25519 Key: A1  │  P2P     │  Ed25519 Key: B1  │
│  Local SQLite     │  Encrypted│  Local SQLite     │
│  .aioss Ledger    │  Channel │  .aioss Ledger    │
│  BitLocker FDE    │          │  FileVault FDE    │
└──────────────────┘          └──────────────────┘
        │                            │
        │  P2P Encrypted             │  P2P Encrypted
        │  WebSocket                 │  WebSocket
        ▼                            ▼
┌─────────────────────────────────────────────────────────┐
│                  P2P Mesh Network                        │
│  ● No central server    ● No cloud processing           │
│  ● No business associate needed (self-hosted)           │
│  ● Complete audit trail for every PHI access            │
│  ● Cryptographic proof of integrity and non-repudiation │
└─────────────────────────────────────────────────────────┘
```

### 16.4 HIPAA Security Rule Code References

| HIPAA Standard | Libern Module | File Location |
|---------------|---------------|---------------|
| § 164.312(a)(1) Access Control | `crates/libern-core/src/crypto/identity.rs` | Ed25519 key generation |
| § 164.312(a)(2)(iv) Encryption | `crates/libern-core/src/db/encryption.rs` | SQLite encryption |
| § 164.312(b) Audit Controls | `crates/libern-aioss/src/ledger.rs` | .aioss audit entries |
| § 164.312(c)(1) Integrity | `crates/libern-aioss/src/verify.rs` | Hash chain verification |
| § 164.312(d) Authentication | `crates/libern-core/src/crypto/mod.rs` | Ed25519 challenge-response |
| § 164.312(e)(1) Transmission | `apps/sandbox/src/voice.rs` | Encrypted P2P audio |
| § 164.308(a)(1) Risk Analysis | `docs/compliance/02-hipaa.md` | This document |

## 17. PHI Data Retention and Disposal

### 17.1 Retention Schedule

| PHI Type | Retention Period | Disposal Method | Libern Feature |
|----------|-----------------|-----------------|---------------|
| Patient messages | 6 years (HIPAA) | Tombstone + database vacuum | `.aioss` export then prune |
| Clinical notes | 6 years | Export .aioss + secure delete | `libern --export-aioss` |
| Voice recordings | Per policy | Delete from local storage | `rm` + secure wipe |
| Audit logs | 6 years | .aioss archive | `libern --verify-ledger` |
| Key material | Until rotation | Revoke + destroy | `libern --revoke-key` |

### 17.2 Secure Disposal Procedure

```
Step 1: Export .aioss ledger for retention
  libern --export-aioss --output PHI-ARCHIVE-2026.aioss

Step 2: Verify archive integrity
  libern --verify-ledger PHI-ARCHIVE-2026.aioss

Step 3: Delete PHI from Libern
  libern --purge-server --server-id <id>

Step 4: Verify deletion
  sqlite3 ~/.local/share/libern/libern.db "SELECT count(*) FROM messages;"

Step 5: Secure wipe (OS-level)
  # Windows: cipher /w:C:\Users\<user>\AppData\Local\Libern
  # Linux: shred -vfz ~/.local/share/libern/libern.db
  # macOS: srm -rf ~/Library/Application Support/Libern
```


## 15. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-06-19 | Libern Team | Initial HIPAA compliance document |

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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