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
Category: compliance | ID: LIB-COMP-001

────────────────────────────────────────────────────────────────

# GDPR Compliance

## 1. Overview

The General Data Protection Regulation (GDPR) is the European Union's comprehensive
data privacy regulation that governs how organizations collect, process, store, and
delete personal data of EU residents. Libern's architecture makes GDPR compliance
trivial by eliminating the fundamental risk factors that make compliance difficult
for most organizations: centralized data storage, third-party data processing, and
opaque data flows.

Libern is a sovereign, offline-first, LAN-P2P collaborative telecom engine. Every
message, file, and interaction is stored locally on the user's device, signed with
Ed25519 keys, hash-chained into a tamper-evident .aioss ledger, and synchronized
peer-to-peer via CRDT merge. There is no central server, no cloud dependency, and
no third-party data processor.

This document maps Libern's architecture to specific GDPR requirements and
demonstrates how each article is satisfied — often by design rather than by policy.

## 2. Key Architectural Advantages

### 2.1 No Central Data Controller

Traditional SaaS platforms act as data controllers, collecting and storing user data
on centralized servers. This creates enormous compliance burden: data must be
protected at rest, in transit, during processing, and across international borders.
A breach of the central server exposes all users' data.

Libern has no central server. Each user is their own data controller. Data never
leaves the device unless the user explicitly shares it via P2P sync with peers they
have authorized. This eliminates the controller liability that most GDPR compliance
programs are designed to address.

### 2.2 Data Locality by Default

GDPR Article 5(1)(e) requires that personal data not be kept longer than necessary
and that it be stored appropriately. Libern stores all data locally on the user's
machine in an SQLite database with .aioss ledger export. The user has physical
control over the storage medium, the backup strategy, and the retention period.

There is no automatic replication to cloud servers. There is no hidden telemetry.
Data stays where the user puts it.

### 2.3 No Third-Party Data Processors

GDPR Article 28 requires written contracts with data processors and restricts what
processors can do with personal data. Libern does not use any third-party data
processors for its core functionality. AI inference runs locally via the Candle
engine. P2P communication is direct between peers. There is no API call to an
external LLM provider, no analytics service, no crash reporter sending data to a
remote endpoint.

Organizations deploying Libern do not need to execute Data Processing Agreements
(DPAs) for the Libern software itself. The only DPAs needed would be for
underlying infrastructure (operating system, hardware vendor, network provider).

## 3. GDPR Article Mapping

### 3.1 Article 5 — Principles Relating to Processing of Personal Data

| Principle | Libern Compliance |
|-----------|------------------|
| Lawfulness, fairness, transparency | All processing is user-initiated. The software is fully open source (AGPL-3.0) for audit. |
| Purpose limitation | Data is processed only for the purpose of local collaboration. No secondary uses. |
| Data minimization | Only data explicitly created by the user is stored. No telemetry, no metadata harvesting. |
| Accuracy | Data is cryptographically signed and hash-chained. Tampering is detectable. |
| Storage limitation | The user controls retention. Data can be pruned locally at any time. |
| Integrity and confidentiality | Ed25519 signatures + SHA-3 hash chain + local encryption ensure integrity. |

### 3.2 Article 7 — Conditions for Consent

GDPR Article 7 requires that consent be freely given, specific, informed, and
unambiguous. Libern does not process personal data based on consent in the
traditional sense because it does not collect or transmit personal data to any
third party. However, for the data the user chooses to share with peers:

- Consent is implicit in the act of creating and sharing data within a server
- Users explicitly add peers to their servers; no data is shared without an
  authorized P2P connection
- The open-source nature of Libern means users can verify exactly what data is
  being processed and how
- Consent can be withdrawn at any time by deleting local data or removing peers
  from the server

### 3.3 Article 17 — Right to Erasure (Right to Be Forgotten)

GDPR Article 17 gives individuals the right to have their personal data erased
without undue delay. Libern makes this trivially achievable:

- **Local deletion:** A user can delete their local database file at any time.
  This removes all messages, files, and metadata they have stored.
- **Selective deletion:** Users can delete individual messages, channels, or
  entire servers from their local instance.
- **P2P deletion propagation:** When a user deletes data locally, the CRDT
  merge logic propagates deletion tombstones to connected peers, ensuring the
  deletion is respected across the network.
- **Verification:** After deletion, the user can verify that data is gone by
  inspecting the local SQLite database and the .aioss ledger export.

One caveat: Because Libern uses a CRDT-based append-only log (the .aioss ledger),
deletion is implemented via tombstone records rather than physical removal from
the hash chain. The hash chain still proves the historical sequence of operations,
but the tombstone ensures that the content is no longer accessible through normal
application interfaces. This is consistent with GDPR Recital 65, which recognizes
that deletion from backup systems may take additional time and that technical
limitations may apply.

### 3.4 Article 20 — Right to Data Portability

GDPR Article 20 gives individuals the right to receive their personal data in a
structured, commonly used, machine-readable format and to transmit that data to
another controller. Libern supports this through the .aioss export format:

- **Native .aioss export:** The entire server ledger can be exported as a
  standardized .aioss file. This is a structured, machine-readable format
  containing all messages, metadata, and cryptographic signatures.
- **SQLite database access:** The underlying SQLite database can be accessed
  directly using standard SQLite tools. The schema is documented in the
  developer documentation.
- **Individual message export:** Users can export individual messages or
  selected conversations.
- **No vendor lock-in:** Because all data is stored locally in standard formats,
  users can migrate to any other system at any time. There is no proprietary
  cloud service holding their data hostage.

### 3.5 Article 25 — Data Protection by Design and by Default

GDPR Article 25 requires that data protection principles be integrated into
processing activities from the design stage. Libern embodies this principle:

- **Privacy by design:** The entire architecture is built on the premise that
  data should not leave the user's device unless absolutely necessary.
- **Privacy by default:** All privacy-protective settings are enabled by default.
  There is no telemetry, no analytics, no cloud backup. These are not features
  the user must opt out of — they simply do not exist.
- **Data minimization:** Libern does not collect email addresses, phone numbers,
  or any personal identifiers. Identity is based on Ed25519 public keys.
- **End-to-end integrity:** Every message is signed and hash-chained, ensuring
  that data cannot be tampered with even if it is intercepted.

### 3.6 Article 32 — Security of Processing

GDPR Article 32 requires appropriate technical and organizational measures to
ensure the security of personal data. Libern provides:

- **Encryption at rest:** The local SQLite database can be encrypted using
  platform-level encryption (BitLocker, FileVault, LUKS) or application-level
  encryption.
- **Encryption in transit:** All P2P communication is encrypted using
  established cryptographic protocols.
- **Cryptographic integrity:** Ed25519 signatures and SHA-3 hash chaining
  provide tamper-evident logging.
- **Access control:** Identity-based access control using Ed25519 key pairs.
  Only authorized peers can join a server.
- **Audit trail:** The .aioss ledger provides a complete, tamper-evident audit
  trail of all operations.

## 4. Data Protection Impact Assessment (DPIA)

Under GDPR Article 35, a Data Protection Impact Assessment is required when
processing operations are likely to result in high risk to individuals' rights
and freedoms. Libern's architecture inherently reduces risk to the point where
a DPIA may not be necessary, but the following analysis supports the assessment:

### 4.1 Systematic Description of Processing

- **What data is processed:** Messages, files, voice data, whiteboard canvas
  data, and server metadata created by the user.
- **Where data is processed:** Entirely on the user's local device.
- **Who has access to data:** Only the user and peers they explicitly authorize.
- **How data is shared:** Direct P2P connections established by user invitation.

### 4.2 Necessity and Proportionality

Processing is necessary for the functionality of the collaboration platform. The
data processed is limited to what is required for messaging, file sharing, voice
chat, and whiteboard collaboration. No additional data is collected.

### 4.3 Risk Assessment

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|----------|------------|
| Unauthorized access to local data | Low | High | Platform encryption, user authentication |
| Data interception during P2P sync | Low | Medium | End-to-end encryption |
| Data loss | Medium | Medium | .aioss backup, CRDT redundancy |
| Third-party access | None | N/A | No third-party processing |

## 5. International Data Transfers (Chapter V)

GDPR restricts transfers of personal data to countries outside the EEA unless
adequate safeguards are in place. Libern's architecture has unique implications:

- Data does not cross borders unless the user explicitly shares it with a peer
  in another country
- The user controls which peers to connect to, regardless of geographic location
- There is no automated or hidden data transfer to any jurisdiction
- For organizations with multinational operations, Libern can be deployed such
  that data remains within national boundaries by restricting peer connections

## 6. Records of Processing Activities (Article 30)

GDPR Article 30 requires controllers to maintain records of processing activities.
Libern supports this through:

- **Automatic logging:** The .aioss ledger records all operations with
  cryptographic proof.
- **Exportable records:** Records can be exported in machine-readable format.
- **Transparent processing:** Because all processing is local, the user can
  inspect exactly what data is being processed at any time.
- **Audit-ready:** The .aioss ledger can be provided to supervisory authorities
  upon request as evidence of processing activities.

## 7. Breach Notification (Articles 33-34)

While Libern's architecture dramatically reduces the risk of a data breach (no
central server to breach, no cloud database to compromise), organizations should
still have breach notification procedures. Libern supports this by:

- Providing clear .aioss audit trails that can be inspected after a suspected
  breach
- Allowing rapid isolation of affected peers by removing them from the server
- Supporting forensic analysis through the cryptographic audit trail

The most likely breach scenario is a compromised endpoint device. Standard
endpoint security measures (disk encryption, strong authentication, antivirus)
should be in place to mitigate this risk.

## 8. Data Protection Officer (DPO) Considerations

### 8.1 Role of the DPO

Under GDPR Articles 37-39, certain organizations must appoint a Data Protection
Officer. The DPO is responsible for monitoring compliance with GDPR. Libern
supports the DPO's role by:

- Providing complete transparency into data processing through open source code
- Offering verifiable audit trails through the .aioss ledger
- Enabling data inventory and mapping through documented data flows
- Supporting data protection impact assessments with architectural documentation

### 8.2 DPO Access to Data

The DPO can access all relevant data processing information:

- **Data flows:** Fully documented in this compliance series
- **Processing records:** Available via .aioss ledger export
- **Data inventory:** The SQLite schema is documented and inspectable
- **Security measures:** Cryptographic implementations are open source

### 8.3 Communication with Supervisory Authorities

If a DPO needs to communicate with a supervisory authority (e.g., CNIL, ICO,
DPC), Libern provides:

- Complete .aioss exports for evidence submission
- Cryptographic proof of data integrity
- Documentation of processing activities
- Records of consent and data subject requests

## 9. GDPR Compliance Checklist

### 9.1 Pre-Deployment

- [ ] Conduct a Data Protection Impact Assessment (DPIA) for the Libern deployment
- [ ] Document data flows using this document as a template
- [ ] Establish key management procedures (see key-recovery.md)
- [ ] Configure .aioss automatic export schedule
- [ ] Define data retention policies
- [ ] Train administrators on data subject request handling
- [ ] Update privacy notices to include Libern usage

### 9.2 Ongoing Operations

- [ ] Review .aioss audit logs periodically (monthly recommended)
- [ ] Test data subject access request procedures (quarterly)
- [ ] Verify deletion procedures work as expected (quarterly)
- [ ] Review data retention and purge expired data (annually)
- [ ] Update DPIA when Libern is updated or deployment changes
- [ ] Conduct annual compliance review

### 9.3 Incident Response

- [ ] Have breach notification procedures in place (see incident-recovery docs)
- [ ] Ensure 72-hour notification capability to supervisory authority
- [ ] Maintain communication channels outside Libern for incident response
- [ ] Test incident response procedures (annually)

## 10. Comparison with Cloud-Based Alternatives

| GDPR Requirement | Libern | Slack/Teams | Google Workspace |
|-----------------|--------|-------------|-----------------|
| Data controller defined | User (self) | Provider + user (joint) | Provider + user |
| Data processor agreement | Not needed (no processor) | Required (DPA) | Required |
| Data localization | Full (local device) | Regional data centers | Regional data centers |
| Right to erasure | Immediate, self-service | Request-based, 30 days | Request-based |
| Data portability | Native .aioss export | Limited export API | Google Takeout |
| Encryption at rest | Platform-level | Provider-managed | Provider-managed |
| Encryption in transit | P2P encrypted | Provider-managed | Provider-managed |
| Audit trail | Built-in (.aioss) | Enterprise add-on | Admin console logs |
| Open source | Yes (AGPL-3.0) | No | No |
| Third-party processing | None | Multiple processors | Multiple processors |

## 11. Frequently Asked Questions

### 11.1 Does Libern process personal data on my behalf?

No. Libern is software that runs on your device. You control what data is
created, stored, and shared. Libern does not process data on your behalf as
a service provider or data processor.

### 11.2 Can I use Libern for processing special categories of data?

Yes. Because Libern stores all data locally and you control all sharing, you can
use it for processing special categories of data (health information, political
opinions, biometric data, etc.) under GDPR Article 9, provided you have
appropriate safeguards in place.

### 11.3 Do I need a Data Processing Agreement with Libern?

No. Libern is not a data processor. It is software that you run on your own
infrastructure. No DPA is needed.

### 11.4 How do I handle a data subject access request?

Use the .aioss export feature to provide the data subject with a complete record
of their data. The export is machine-readable and cryptographically verifiable.

### 11.5 What happens if Libern is acquired or discontinued?

Because all data is stored locally in standard formats (SQLite, .aioss), you can
always access your data regardless of what happens to the project. There is no
vendor lock-in.

## 12. Conclusion

Libern's architectural decisions make GDPR compliance substantially simpler than
any cloud-based alternative. The key takeaways are:

1. **No data controller liability:** Each user is their own data controller.
2. **No third-party processors:** All processing is local and transparent.
3. **Built-in data portability:** .aioss export enables seamless data migration.
4. **Built-in right to erasure:** Local deletion is immediate and verifiable.
5. **Privacy by design:** The architecture inherently respects data protection
   principles.

Organizations deploying Libern should still conduct their own compliance
assessment and consult with legal counsel, but the compliance burden is
dramatically reduced compared to cloud-based collaboration platforms.

## 13. Appendix: Relevant GDPR Articles

| Article | Topic | Libern Compliance Section |
|---------|-------|--------------------------|
| Art. 5 | Principles of processing | Section 3.1 |
| Art. 7 | Conditions for consent | Section 3.2 |
| Art. 12 | Transparent communication | Section 6 |
| Art. 13-14 | Information to data subjects | Section 5 |
| Art. 15 | Right of access | Section 3.3 |
| Art. 16 | Right to rectification | Section 3.3 |
| Art. 17 | Right to erasure | Section 3.3 |
| Art. 18 | Right to restriction | Section 3.3 |
| Art. 20 | Right to data portability | Section 3.4 |
| Art. 22 | Automated decision-making | Section 2.3 |
| Art. 25 | Data protection by design | Section 3.5 |
| Art. 28 | Processor obligations | Section 2.3 |
| Art. 30 | Records of processing | Section 6 |
| Art. 32 | Security of processing | Section 3.6 |
| Art. 33-34 | Breach notification | Section 7 |
| Art. 35 | Data protection impact assessment | Section 4 |
| Art. 37-39 | Data Protection Officer | Section 8 |
| Ch. V | International transfers | Section 5 |


## 15. Implementation Walkthrough

### 15.1 Step-by-Step GDPR Deployment

**Phase 1: Assessment (Week 1)**

| Step | Action | Documentation |
|------|--------|---------------|
| 1.1 | Map all data flows using Libern architecture | docs/compliance/01-gdpr.md |
| 1.2 | Identify controller/processor relationships | Section 2.1 |
| 1.3 | Document lawful basis for processing | Section 3.1 |
| 1.4 | Review data minimization practices | Section 2.2 |
| 1.5 | Establish retention schedules | Section 9.1 |

**Phase 2: Technical Controls (Week 2)**

```
┌─────────────────────────────────────────────────────┐
│           GDPR Technical Controls in Libern          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  User Device                                         │
│  ┌───────────────────────────────────┐               │
│  │ SQLite Database (local)           │               │
│  │  ├─ Messages (encrypted at rest)  │               │
│  │  ├─ .aioss Ledger (hash-chained) │               │
│  │  └─ Ed25519 Keys (OS-protected)   │               │
│  └───────────────────────────────────┘               │
│            │  P2P Encrypted                           │
│            ▼  WebSocket                              │
│  ┌───────────────────────────────────┐               │
│  │  Peer Device (authorized only)    │               │
│  │  └─ CRDT Sync (deterministic)     │               │
│  └───────────────────────────────────┘               │
│                                                      │
│  No cloud server  ●  No third-party                 │
│  No telemetry     ●  No data selling                │
└─────────────────────────────────────────────────────┘
```

**Phase 3: Policy Updates (Week 3)**
1. Update privacy notice to reference Libern deployment
2. Create DPA register (Libern likely exempts need)
3. Document data subject request procedures
4. Train staff on Libern-specific GDPR features
5. Schedule first DPIA review

**Phase 4: Go-Live (Week 4)**
1. Conduct final compliance review
2. Verify .aioss export functionality
3. Test deletion procedures
4. Document baseline configuration
5. Enable automated .aioss exports

### 15.2 Real-World Scenario: Healthcare Research Collaboration

**Scenario:** A European research consortium of 12 universities needs to share genomic research data under GDPR Article 9 (special categories of data).

**Challenge:** Cloud-based tools require extensive DPAs, data transfer impact assessments, and can't guarantee that genomic data won't be processed by third-party AI services.

**Libern Solution:**
1. Each university deploys Libern on local, encrypted workstations
2. Research team members are added as authorized peers via Ed25519 keys
3. Data never leaves the local network — P2P sync happens only between authorized devices
4. Local AI (Candle engine) processes genomic annotations without sending data to any cloud
5. Complete .aioss audit trail satisfies Article 30 record-keeping
6. Every researcher can independently verify data integrity via `libern --verify-ledger`

**Outcome:** The consortium avoids complex joint-controller agreements. Each university remains an independent controller for its own data. The project achieves GDPR compliance in weeks instead of months.

### 15.3 Data Flow Diagrams

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  User A      │         │  User B      │         │  User C      │
│  (Germany)   │         │  (France)    │         │  (Poland)    │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ Ed25519 Key   │◄────────► Ed25519 Key  │◄────────► Ed25519 Key  │
│ Local SQLite  │  P2P    │ Local SQLite │  P2P    │ Local SQLite │
│ .aioss Ledger │  Encrypt│ .aioss Ledger│  Encrypt│ .aioss Ledger│
│ Local AI     │         │ Local AI     │         │ Local AI     │
└─────────────┘         └─────────────┘         └─────────────┘
        │                      │                        │
        └──────────────────────┴────────────────────────┘
                        No central server
                   No data leaves EU territory
                  Each user = own data controller
```

**Cross-Border Data Flow Compliance:**
- Data stays local; only encrypted CRDT operations flow P2P
- No Schrems II violation: no US-based data processors
- Adequacy decision not needed: data doesn't "transfer" — it stays where created
- SCCs not required: no processor relationship exists

## 16. Regulatory Mapping: Libern Code References

| GDPR Article | Libern Source File | Implementation |
|-------------|-------------------|----------------|
| Art. 5(1)(c) — Data minimization | `crates/libern-core/src/db/schema.rs` | Only user-created data stored |
| Art. 5(1)(e) — Storage limitation | `crates/libern-aioss/src/schedule.rs` | Configurable session sealing |
| Art. 5(2) — Accountability | `crates/libern-aioss/src/ledger.rs` | Full audit trail |
| Art. 17 — Right to erasure | `crates/libern-core/src/crdt/mod.rs` | Tombstone deletion |
| Art. 20 — Data portability | `crates/libern-aioss/src/txt_log.rs` | .aioss export format |
| Art. 25 — Privacy by design | `crates/libern-core/src/lib.rs` | Core architecture |
| Art. 32 — Security | `crates/libern-core/src/crypto/mod.rs` | Ed25519 + SHA-3 |
| Art. 33 — Breach notification | `crates/libern-aioss/src/health.rs` | Health check chain |

## 17. Technical Annex: .aioss Ledger GDPR Compliance Details

### 17.1 How the .aioss Ledger Supports GDPR

| GDPR Requirement | .aioss Feature | Verification Method |
|-----------------|---------------|-------------------|
| Art. 5(2) Accountability | All operations recorded with cryptographic proof | `libern --verify-ledger` |
| Art. 15 Right of access | Complete export of all data | `libern --export-aioss` |
| Art. 16 Right to rectification | Edits create new entries (append-only) | `.aioss` audit shows edit history |
| Art. 17 Right to erasure | Tombstone markers hide data | Check `libern --aioss-search` |
| Art. 18 Restriction of processing | Channel permissions restrict access | RBAC configuration |
| Art. 20 Data portability | Structured .aioss export | JSON/binary export formats |
| Art. 30 Records of processing | Automatic, continuous logging | Real-time ledger updates |
| Art. 32 Security of processing | Hash chain + Ed25519 signatures | Cryptographic verification |
| Art. 33-34 Breach notification | Forensic audit trail | Ledger analysis tools |

### 17.2 Data Retention Configuration

```json
{
  "gdpr_compliance": {
    "auto_export": true,
    "export_format": "aioss",
    "retention_days": 365,
    "auto_prune": false,
    "prune_notification_days": 30,
    "deletion_mode": "tombstone_and_physical",
    "data_subject_contact": "privacy@organization.com"
  }
}
```


## 14. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-06-19 | Libern Team | Initial GDPR compliance document |

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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