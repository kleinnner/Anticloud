â–„â–„                     â–ˆâ–ˆ               â–„â–„                                    
â–ˆâ–ˆ                     â–€â–€               â–ˆâ–ˆ                                    
â–ˆâ–ˆ            â–„â–„â–„â–ˆ   â–ˆâ–ˆâ–ˆâ–ˆ     â–ˆâ–„â–„â–„      â–ˆâ–ˆâ–„â–ˆâ–ˆâ–ˆâ–„    â–„â–ˆâ–ˆâ–ˆâ–ˆâ–„    â–ˆâ–ˆâ–„â–ˆâ–ˆâ–ˆâ–ˆ  â–ˆâ–ˆâ–„â–ˆâ–ˆâ–ˆâ–ˆâ–„
â–ˆâ–ˆ        â–„â–„â–ˆâ–€â–€â–€       â–ˆâ–ˆ       â–€â–€â–€â–ˆâ–„â–„  â–ˆâ–ˆâ–€  â–€â–ˆâ–ˆ  â–ˆâ–ˆâ–„â–„â–„â–„â–ˆâ–ˆ   â–ˆâ–ˆâ–€      â–ˆâ–ˆâ–€   â–ˆâ–ˆ
â–ˆâ–ˆ        â–€â–€â–ˆâ–„â–„â–„       â–ˆâ–ˆ       â–„â–„â–„â–ˆâ–€â–€  â–ˆâ–ˆ    â–ˆâ–ˆ  â–ˆâ–ˆâ–€â–€â–€â–€â–€â–€   â–ˆâ–ˆ       â–ˆâ–ˆ    â–ˆâ–ˆ
â–ˆâ–ˆâ–„â–„â–„â–„â–„â–„      â–€â–€â–€â–ˆ  â–„â–„â–„â–ˆâ–ˆâ–„â–„â–„  â–ˆâ–€â–€â–€      â–ˆâ–ˆâ–ˆâ–„â–„â–ˆâ–ˆâ–€  â–€â–ˆâ–ˆâ–„â–„â–„â–„â–ˆ   â–ˆâ–ˆ       â–ˆâ–ˆ    â–ˆâ–ˆ
â–€â–€â–€â–€â–€â–€â–€â–€            â–€â–€â–€â–€â–€â–€â–€â–€            â–€â–€ â–€â–€â–€      â–€â–€â–€â–€â–€    â–€â–€       â–€â–€    â–€â–€

Libern â€” Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: compliance | ID: LIB-COMP-004

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

# California Consumer Privacy Act (CCPA) Compliance

## 1. Overview

The California Consumer Privacy Act (CCPA) grants California residents specific
rights regarding their personal information, including the right to know what
personal information is collected, the right to delete personal information, the
right to opt out of the sale of personal information, and the right to
non-discrimination for exercising these rights.

Libern's architecture â€” local-first, P2P, no cloud dependency â€” substantially
simplifies CCPA compliance. Because Libern does not collect personal information
in the traditional sense (no accounts, no email, no phone numbers, no telemetry),
many CCPA requirements are satisfied by default. Organizations deploying Libern
face minimal additional compliance burden.

This document analyzes Libern against CCPA requirements and provides guidance for
covered businesses that use Libern.

## 2. Applicability

### 2.1 Does CCPA Apply to Libern?

The CCPA applies to for-profit businesses that collect consumers' personal
information and meet certain thresholds (e.g., gross revenue over $25 million,
handling data of 100,000+ consumers, or deriving 50%+ of revenue from selling
personal information).

Libern itself is not a business â€” it is open-source software. The CCPA obligations
fall on the organization deploying Libern. However, because Libern does not sell
personal information (Section 4), does not collect personal information beyond
what users explicitly create, and operates entirely on local devices, the
compliance burden is minimal.

### 2.2 Personal Information Under CCPA

The CCPA defines personal information broadly to include identifiers,
commercial information, internet activity, geolocation, and inferences drawn
from such data.

Libern's data model includes:
- **User identity:** Ed25519 public key (a cryptographic identifier, not a real
  name or email address)
- **Messages:** Text content created by the user
- **Files:** Attachments shared by the user
- **Voice data:** Audio streams during voice chat sessions
- **Whiteboard data:** Canvas drawings and annotations
- **Metadata:** Timestamps, channel memberships, role assignments

All of this data is created by the user and stored locally on their device.
Libern does not collect or process personal information independently.

## 3. Consumer Rights

### 3.1 Right to Know (CCPA Â§ 1798.110)

Consumers have the right to request that a business disclose the categories and
specific pieces of personal information it has collected.

**Libern implementation:** Because all data is stored locally in a standard
SQLite database, users can inspect their data at any time. Organizations can
provide consumers with a .aioss export of their data, which contains all
messages, metadata, and cryptographic signatures in a machine-readable format.

To respond to a Right to Know request:
1. Open the Libern application
2. Export the relevant .aioss ledger
3. Provide the export to the consumer
4. The consumer can verify the export using standard Libern tools

### 3.2 Right to Delete (CCPA Â§ 1798.105)

Consumers have the right to request deletion of personal information collected
by a business.

**Libern implementation:** Deletion can be performed in multiple ways:

- **Self-service deletion:** Users can delete individual messages, channels, or
  entire servers directly from the Libern interface.
- **Bulk deletion:** The local SQLite database can be deleted or specific tables
  can be cleared.
- **P2P propagation:** When data is deleted locally, the CRDT tombstones are
  propagated to connected peers to ensure the deletion is respected across the
  network.
- **Verification:** After deletion, the user can verify that the data is no
  longer accessible through normal application interfaces.

The .aioss ledger preserves tombstones (deletion markers) rather than physically
removing data from the hash chain. This is consistent with CCPA's recognition
that deletion from backup and archival systems may require additional time.

### 3.3 Right to Opt Out (CCPA Â§ 1798.120)

Consumers have the right to opt out of the sale of their personal information to
third parties.

**Libern implementation:** Libern does not sell personal information. There is
no mechanism for selling data, no advertising platform, no data broker
integration, and no third-party data sharing. The opt-out right is therefore
not triggered. However, Libern provides complete transparency about data
practices through its open-source codebase and documentation.

### 3.4 Right to Non-Discrimination (CCPA Â§ 1798.125)

Businesses may not discriminate against consumers who exercise their CCPA rights.

**Libern implementation:** Because Libern does not condition any service on the
collection or sale of personal information, exercising CCPA rights has no impact
on the user's ability to use the software. All features remain available
regardless of privacy choices.

## 4. Sale of Personal Information

### 4.1 Definition of Sale

The CCPA defines "sale" broadly to include sharing personal information for
valuable consideration. Libern's architecture has no concept of selling data:

- No advertising revenue model
- No data broker relationships
- No third-party analytics
- No data sharing agreements
- No valuable consideration for personal information

Libern is monetized through voluntary support (AGPL-3.0 license, enterprise
support contracts). User data is never part of the business model.

### 4.2 No Sale Certification

Organizations deploying Libern can confidently certify that they do not sell
personal information through their use of Libern. This simplifies CCPA compliance
and eliminates the need for a "Do Not Sell My Personal Information" link related
to Libern usage.

## 5. Data Collection Practices

### 5.1 Categories of Personal Information Collected

| Category | Collected by Libern | Purpose | Source |
|----------|-------------------|---------|--------|
| Identifiers | Ed25519 public key only | Identity, authentication | Local generation |
| Personal records | No | N/A | N/A |
| Protected classifications | No | N/A | N/A |
| Commercial info | No | N/A | N/A |
| Biometric info | No | N/A | N/A |
| Internet/network activity | No | N/A | N/A |
| Geolocation | No | N/A | N/A |
| Audio/visual | Voice data only (user-initiated) | Voice chat | Local capture |
| Professional/employment | No | N/A | N/A |
| Education info | No | N/A | N/A |
| Inferences | No | N/A | N/A |

### 5.2 Business Purpose for Collection

The only business purpose for collecting personal information in Libern is to
provide the core collaboration functionality. There are no secondary or
commercial purposes.

## 6. CCPA Compliance Checklist for Libern Deployments

### 6.1 Privacy Notice

The organization should update its privacy notice to disclose:

- That Libern stores data locally on the user's device
- That Libern does not collect or sell personal information
- That users can access and delete their data through the Libern interface
- How to exercise CCPA rights in relation to Libern data

### 6.2 Consumer Request Procedures

Organizations should establish procedures for handling CCPA requests related to
Libern:

1. **Receive request:** Consumer submits a verifiable request through the
   organization's standard process
2. **Verify identity:** Use existing organizational identity verification
   procedures
3. **Locate data:** The .aioss export provides a complete record of the
   consumer's data
4. **Respond:** Provide the export (Right to Know) or confirm deletion (Right
   to Delete) within the required timeframe (45 days, extendable by 45 days)

### 6.3 Training

Staff handling CCPA requests should be trained on:

- How Libern stores and processes data
- How to export .aioss ledgers
- How to delete data through the Libern interface
- The difference between local deletion (immediate) and P2P tombstone
  propagation (eventual)

## 7. Service Provider Considerations

### 7.1 Is Libern a Service Provider?

Under the CCPA, a service provider processes personal information on behalf of a
business pursuant to a written contract. Libern is software, not a service
provider. However, when a managed service provider hosts Libern for a covered
business, that provider may be a service provider and should have appropriate
contractual protections.

### 7.2 Contractual Requirements

Service provider contracts for Libern hosting should include:

- Purpose limitations on data processing
- Prohibition on retaining, using, or disclosing personal information beyond
  the business purposes specified
- Certification of compliance with CCPA requirements
- Data deletion upon termination of services

## 8. Comparison with Cloud-Based Alternatives

| CCPA Requirement | Libern (Self-Hosted) | Cloud-Based Platforms |
|-----------------|---------------------|---------------------|
| Right to Know | Instant, self-service | Request-based, delayed |
| Right to Delete | Immediate, self-service | Request-based, may propagate through systems |
| Opt Out of Sale | Not applicable (no sale) | May be required (data monetization) |
| Service Provider | Not applicable (software) | Usually required (cloud provider) |
| Data Collection | User-created only | User-created + telemetry + analytics |
| Transparency | Full (open source) | Varies by vendor |

## 9. CCPA Compliance Checklist

### 9.1 Pre-Deployment

- [ ] Update the organization's privacy notice to address Libern usage
- [ ] Document data flows for Libern deployment
- [ ] Train staff on handling CCPA requests for Libern data
- [ ] Establish procedures for Right to Know responses using .aioss export
- [ ] Establish procedures for Right to Delete using Libern deletion features
- [ ] Verify that Libern configuration does not enable data collection

### 9.2 Consumer Request Handling

**Right to Know:**
1. Receive verifiable consumer request
2. Locate the consumer's data in the Libern database or .aioss export
3. Generate a .aioss export of the consumer's data
4. Provide the export within 45 days
5. Document the request and response

**Right to Delete:**
1. Receive verifiable consumer request
2. Delete the consumer's data through Libern's interface
3. Verify deletion by inspecting the database
4. Confirm deletion to the consumer
5. Document the request and response

### 9.3 Verification of Consumer Requests

Organizations should verify that the person making a CCPA request is the
consumer whose data is being requested. For Libern deployments:
- Verification is based on the organization's existing authentication
- Libern's Ed25519 key identity provides cryptographic proof of identity
- The .aioss ledger provides a complete record of the consumer's data
- Request verification procedures should be documented in the privacy program

## 10. Special Considerations for Employers

### 10.1 Employee Data

When Libern is used as an internal communication tool, employee data may be
subject to CCPA. Employers should:

1. **Disclose data practices:** Inform employees what data is collected through
   Libern (messages, files, voice data)
2. **Limit monitoring:** Use Libern's transparency to clearly communicate any
   monitoring practices
3. **Handle requests:** Process employee CCPA requests through the same
   procedures as consumer requests
4. **Distinguish roles:** Employee data may have different treatment than
   customer/consumer data under CCPA exemptions

### 10.2 Business Communications Exemption

CCPA has exemptions for certain business-to-business communications. Libern
data used exclusively for internal business communications may be partially
exempt, but organizations should still maintain good data hygiene practices.

## 11. Interaction with Other Privacy Laws

### 11.1 CPRA (California Privacy Rights Act)

The CPRA, which amended the CCPA effective January 2023, introduced additional
requirements:

- **Sensitive personal information:** Libern's voice data and message content
  may qualify as sensitive. Libern's local storage and P2P architecture
  minimize the compliance burden.
- **Automated decision-making:** Libern's local AI makes suggestions only;
  it does not make automated decisions that significantly affect consumers.
- **Contractors:** Libern has no contractors in its data processing chain.

### 11.2 Other State Laws

Organizations operating in multiple states should consider:
- Virginia CDPA
- Colorado CPA
- Connecticut CTDPA
- Utah UCPA
- Iowa ICDPA

Libern's architecture provides similar compliance benefits for all these laws
due to its local-first, no-collection design.

## 12. Frequently Asked Questions

### 12.1 Does Libern sell my personal information?

No. Libern does not sell personal information. There is no mechanism for data
sale in the software, and the project's funding model does not involve data
monetization.

### 12.2 Can consumers delete their messages without affecting other users?

Yes. When a consumer deletes their messages, the deletion is propagated to
peers via CRDT tombstones. The message content is no longer accessible through
normal application interfaces, though the cryptographic hash chain preserves
evidence of the deletion operation.

### 12.3 How do I provide a consumer with their data in a portable format?

Use the .aioss export feature. This creates a structured, machine-readable file
containing all the consumer's data and metadata. The consumer can import this
into another Libern instance or any system that supports the .aioss format.

### 12.4 What data does Libern collect automatically?

Libern does not collect any data automatically. No telemetry, no analytics, no
usage statistics, no error reports. All data in Libern is explicitly created by
the user.

### 12.5 How long does Libern retain data?

Data is retained until the user deletes it. Libern does not enforce any
automatic retention or deletion policies. Organizations should configure their
own retention policies based on their data governance requirements.

## 13. Conclusion

Libern's architecture makes CCPA compliance straightforward for covered
businesses:

1. **No sale of personal information:** The business model does not involve data
   monetization
2. **User-controlled data:** Consumers can access, export, and delete their data
   directly
3. **Minimal data collection:** Only Ed25519 public keys and user-created content
4. **Full transparency:** Open source code provides complete visibility into data
   practices
5. **Reduced compliance burden:** The absence of centralized data collection
   eliminates most CCPA obligations

Organizations deploying Libern should still review their overall CCPA compliance
program, but the Libern component introduces minimal additional risk or
obligation.

## 14. Appendix: CCPA/CPRA Statutory References

| Section | Topic | Libern Compliance |
|---------|-------|------------------|
| 1798.100 | General duties | Section 2 |
| 1798.105 | Right to delete | Section 3.2 |
| 1798.110 | Right to know | Section 3.1 |
| 1798.115 | Right to opt out | Section 3.3 |
| 1798.120 | Sale of personal information | Section 4 |
| 1798.125 | Non-discrimination | Section 3.4 |
| 1798.130 | Notice requirements | Section 5 |
| 1798.135 | Service provider obligations | Section 7 |
| 1798.140 | Definitions | Section 2.2 |
| 1798.185 | Regulations | Section 6 |

## 15. Cross-Reference with Other US State Privacy Laws

### 15.1 Virginia CDPA

The Virginia Consumer Data Protection Act shares many similarities with CCPA:
- **Right to access:** Libern provides instant .aioss export
- **Right to delete:** Libern supports immediate local deletion
- **Right to opt out:** Libern does not sell data
- **Data protection assessments:** Libern's DPIA documentation supports this

### 15.2 Colorado CPA

The Colorado Privacy Act adds:
- **Profiling opt-out:** Libern's AI makes suggestions, not profiling decisions
- **Universal opt-out:** Libern has no data collection to opt out of
- **Sensitive data:** Voice data may be sensitive; local processing ensures compliance

### 15.3 Connecticut CTDPA

The Connecticut Data Privacy Act closely follows Virginia's model:
- Libern's local-first architecture satisfies all requirements
- No additional obligations beyond CCPA baseline


## 17. CCPA Rights Fulfillment Procedures â€” Expanded

### 17.1 Right to Know â€” Step-by-Step

```
Step 1: Receive verified consumer request
        â†“
Step 2: Launch Libern on the relevant device
        â†“
Step 3: Export .aioss ledger for the consumer's server(s)
        libern --export-aioss --output ./consumer-data.aioss
        â†“
Step 4: Filter entries for the requesting consumer
        libern --aioss-filter --user <public-key> ./consumer-data.aioss
        â†“
Step 5: Generate human-readable report
        libern --aioss-to-json ./consumer-data.aioss > consumer-report.json
        â†“
Step 6: Verify export integrity
        libern --verify-ledger ./consumer-data.aioss
        â†“
Step 7: Deliver to consumer within 45 days
```

### 17.2 Right to Delete â€” Step-by-Step

```
Step 1: Receive verified consumer deletion request
        â†“
Step 2: Identify all data belonging to the consumer
        libern --aioss-filter --user <consumer-key> ./ledger.aioss
        â†“
Step 3: Delete consumer's messages
        libern --delete-user-messages --user <consumer-key>
        â†“
Step 4: Verify deletion
        libern --aioss-search --user <consumer-key> ./ledger.aioss
        Expected: "No entries found"
        â†“
Step 5: Confirm deletion to consumer in writing
        â†“
Step 6: Log the request and response for compliance records
```

### 17.3 Real-World Scenario: Enterprise CCPA Compliance

**Scenario:** A California-based e-commerce company with 500+ employees uses Libern for internal communication. A consumer exercises their CCPA right to know.

**Traditional approach:** IT team searches across Slack/Teams/email archives â€” days of work, partial results.

**Libern approach:**
1. Consumer submits verified request
2. Admin runs: `libern --export-aioss --output consumer-export.aioss`
3. Admin runs: `libern --aioss-filter --user <key> consumer-export.aioss`
4. Complete record generated in under 5 minutes
5. Export delivered: all messages, metadata, cryptographic proof of authenticity

**Result:** CCPA 45-day window easily met; compliance cost reduced by ~90%.

## 18. CPRA (California Privacy Rights Act) Enhanced Compliance

### 18.1 Sensitive Personal Information Handling

| CPRA Category | Libern Data | Safeguards |
|--------------|-------------|------------|
| SSN/ID numbers | Not collected | N/A |
| Financial account | Not collected | N/A |
| Precise geolocation | Not collected | N/A |
| Racial/ethnic origin | Not collected | N/A |
| Communications content | User-created messages | Local storage, user controls |
| Genetic data | Not collected | N/A |
| Biometric data | Not collected | N/A |
| Health data | Optional (per user) | Local only, P2P encrypted |
| Sex life/orientation | Not collected | N/A |

### 18.2 Automated Decision-Making (CPRA Â§ 1798.185(a)(16))

Libern's local AI makes suggestions only â€” no automated decisions that significantly affect consumers:

| AI Feature | Type | Consumer Impact |
|-----------|------|-----------------|
| Message summarization | Suggestion | None (user reviews) |
| Smart replies | Suggestion | None (user selects) |
| Content moderation | Classification | Configurable; human-in-loop |
| Document Q&A | Retrieval | None (user reviews) |

## 19. Multi-State US Privacy Law Compliance Matrix

| Requirement | CCPA/CPRA | Virginia CDPA | Colorado CPA | Connecticut CTDPA | Libern |
|------------|-----------|---------------|-------------|-------------------|--------|
| Right to know | âœ“ | âœ“ | âœ“ | âœ“ | Instant .aioss export |
| Right to delete | âœ“ | âœ“ | âœ“ | âœ“ | Immediate local deletion |
| Right to correct | âœ“ | âœ“ | âœ“ | âœ“ | Editable messages |
| Right to port | âœ“ | âœ“ | âœ“ | âœ“ | Native .aioss format |
| Opt-out of sale | âœ“ | âœ“ | âœ“ | âœ“ | No data sold |
| Sensitive data limits | âœ“ | âœ“ | âœ“ | âœ“ | Local processing only |
| Automated decisions | âœ“ | âœ“ | âœ“ | âœ“ | No profiling |
| Data protection assessment | âœ“ | âœ“ | âœ“ | âœ“ | DPIA in Section 4 |
| Non-discrimination | âœ“ | âœ“ | âœ“ | âœ“ | All features equal |
| Contract requirements | âœ“ | âœ“ | âœ“ | âœ“ | No processor needed |


## 16. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-06-19 | Libern Team | Initial CCPA compliance document |

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
