<!--
     ▄▄▄   ▄▄▄  ▄▄▄  ▄▄▄▄▄▄▄▄              ▄▄▄▄      ▄▄▄▄     ▄▄▄     
    ██     ███  ███  ██▀▀▀▀▀▀            ▄█▀▀▀▀█    ██▀▀██      ██    
    ██     ████████  ██           ██     ██▄       ██    ██     ██    
    ██     ██ ██ ██  ███████   ▄▄▄██▄▄▄   ▀████▄   ██ ██ ██     ██    
  ▀▀█▄     ██ ▀▀ ██  ██        ▀▀▀██▀▀▀       ▀██  ██    ██     ▄█▀▀  
    ██     ██    ██  ██           ██     █▄▄▄▄▄█▀   ██▄▄██      ██    
    ██     ▀▀    ▀▀  ▀▀                   ▀▀▀▀▀      ▀▀▀▀       ██    
    ▀█▄▄                                                      ▄▄█▀    

MF+SO — Multi Factor+ Sign On
by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner
The Sovereign Identity & Authentication Vault
-->

# Open Source Philosophy

## Why MF+SO Is Open Source: Transparency, Trust, and Community Audit

### 1. Introduction

MF+SO (Multi Factor+ Sign On) is built on a foundational belief: security software must be transparent to be trustworthy. Unlike proprietary authentication systems that operate as black boxes, MF+SO publishes every line of source code under a permissive open-source license. This document explains the philosophical, practical, and security-driven rationale behind that decision.

The modern authentication landscape is dominated by closed-source identity providers — Google, Apple, Microsoft, Okta, and dozens of others — whose internal security practices, cryptographic implementations, and data handling procedures remain opaque to the very users who depend on them. MF+SO rejects this model entirely. We believe that in 2026, with supply-chain attacks, state-sponsored threats, and mass surveillance at an all-time high, users and enterprises alike deserve — and must demand — full visibility into the software that guards their digital identities.

Authentication software occupies a uniquely sensitive position in the software ecosystem. It handles the keys to every other service a user accesses — their email, banking, healthcare, social media, work accounts, and more. A vulnerability or backdoor in authentication software can compromise all of these services simultaneously. This concentration of risk demands a corresponding concentration of trustworthiness, and trustworthiness in software comes from transparency, verifiability, and community oversight.

The open-source philosophy is not an afterthought or a feature of MF+SO. It is the starting point from which everything else — the cryptographic architecture, the privacy guarantees, the auditability, the reproducibility — follows as a natural consequence. Every document in this "No Black Boxes" series elaborates on a specific aspect of this philosophy, providing the technical depth and practical details that security-conscious users and organizations need to make informed decisions about their authentication infrastructure.

### 2. The Transparency Imperative

Transparency is not merely a nice-to-have feature for MF+SO; it is the core architectural requirement from which all other security properties derive. When source code is open, every claim the software makes about its behavior can be independently verified. When MF+SO states that it performs all biometric matching locally, that it never transmits private keys to a remote server, or that it uses zero-knowledge proofs for credential verification — those claims can be confirmed or refuted by anyone with the technical ability to read the code.

This stands in stark contrast to proprietary authentication systems, where users must accept vendor assurances on faith. History is replete with examples of closed-source security software that made bold claims about encryption, only to be found later to contain backdoors, weak algorithms, or intentional data leakage. The most famous example is the Dual_EC_DRBG random number generator standard, later revealed to contain a National Security Agency backdoor — a vulnerability that persisted in certified products for years precisely because the implementation could not be publicly audited. More recently, proprietary VPN services, messaging applications, and password managers have been found to exaggerate their security properties, misrepresent their data handling practices, or silently introduce tracking functionality.

MF+SO's transparency model addresses this problem at multiple levels. First, the source code itself is published and version-controlled, providing a complete historical record of every change. Second, all cryptographic primitives are drawn from well-studied, standardized algorithms with public implementations. Third, the build process is fully deterministic and reproducible, meaning that a binary distributed through official channels can be verified to correspond exactly to a specific commit in the source repository. Fourth, all dependencies are declared, audited, and pinned to specific versions, with automated vulnerability scanning integrated into the development pipeline. Fifth, all security incidents and vulnerability disclosures are published in transparency reports that are freely accessible to the public.

### 3. Trust Through Verifiability

Trust in MF+SO is not based on brand reputation, marketing claims, or legal agreements. It is based on verifiability. Any user, security researcher, auditor, or competitor can download the source code, inspect it, build it, and confirm that the running application behaves exactly as documented.

This verifiability creates a fundamentally different trust relationship than proprietary software. With a closed-source authenticator, the user's security posture depends entirely on the vendor's competence, integrity, and continued good-faith operation. If the vendor is compromised — through a data breach, insider threat, government subpoena, or acquisition by an adversarial entity — the user may never know that their security has been undermined. With MF+SO, any unauthorized change to the code is immediately visible to anyone monitoring the repository. The community can fork the project, maintain independent builds, and continue using a trusted version even if the original maintainers are compromised.

This property is known as "adversarial resilience" — the ability of a system to maintain its security properties even when some or all of its maintainers become untrustworthy. Open source is the only practical way to achieve adversarial resilience in authentication software, because only open source allows independent verification and forking. The concept is analogous to the principle of "not having to trust" in cryptographic protocols: the system should be secure even if the other parties are not fully trusted. In MF+SO's case, the "other party" is the software vendor itself, and the mechanism for not having to trust them is open source.

### 4. Community Audit as a Security Multiplier

One of the most powerful arguments for open-source security software is the community audit effect. When source code is public, it is examined by a global community of security researchers, cryptographers, software engineers, and privacy advocates. This distributed review process — sometimes called "Linus's Law" after Eric S. Raymond's observation that "given enough eyeballs, all bugs are shallow" — dramatically increases the probability that vulnerabilities are discovered and fixed before they can be exploited.

MF+SO actively encourages community audit. The repository includes detailed documentation of the cryptographic architecture, threat models, and security assumptions. A SECURITY.md file provides clear guidelines for responsible disclosure of vulnerabilities. The project maintains a bug bounty program through a reputable platform, with rewards scaled to the severity of discovered issues. All security advisories are published publicly, with a standard 90-day disclosure deadline after a fix is released.

The community audit model is not a replacement for professional third-party security audits — MF+SO commissions those as well, and their results are published in full. Rather, community audit complements formal audits by providing continuous, diverse scrutiny that formal audits — limited in scope and schedule — cannot match. A professional audit might examine the codebase for two weeks once a year. The community examines it every day, from every angle, using every tool and technique at their disposal.

The effectiveness of community audit depends on several factors that MF+SO actively cultivates. First, the codebase must be accessible and well-documented, lowering the barrier to entry for new reviewers. Second, the project must have a responsive security team that acknowledges and triages reports quickly. Third, there must be clear channels for reporting findings, including both public issue trackers and private disclosure mechanisms. Fourth, the project must have a culture that welcomes scrutiny and treats vulnerability reports as contributions rather than criticisms.

### 5. Preventing Vendor Lock-In

Proprietary authentication systems create vendor lock-in through multiple mechanisms. The most obvious is the proprietary credential format: once a user's identities, keys, and authentication factors are stored in a vendor's proprietary database or cloud service, migrating to another provider becomes costly and risky. Less obvious but equally pernicious is protocol lock-in: proprietary extensions to standard protocols that make it difficult to interoperate with other systems. Most subtle of all is ecosystem lock-in: the network effects and integrations that make it seem easier to stay with a vendor than to leave.

MF+SO prevents vendor lock-in at every level. The credential database uses open, documented formats based on standard cryptographic primitives. All communication protocols are standard (WebAuthn, OAuth 2.1, OpenID Connect, FIDO2) with no proprietary extensions required. The codebase is designed to be self-hosted and fully functional without any cloud services. If the MF+SO project were to disappear tomorrow, every user and organization running MF+SO would continue to function exactly as before, and any developer could pick up the source code and continue development.

Vendor lock-in is particularly dangerous in authentication because credentials are not easily transferred. Unlike a document or a photo, which can be copied from one application to another, authentication credentials are deeply tied to the system that manages them. The encryption keys, protocol implementations, and storage formats are all specific to the authenticator. Migrating to a new authenticator often requires re-enrolling every credential with every service, a process that can take hours or days for users with many accounts. By using open standards and documented formats, MF+SO ensures that this migration cost is minimized.

### 6. Economic Arguments for Open Source

Beyond the security and philosophical arguments, there are compelling economic reasons for MF+SO's open-source approach. In enterprise environments, the total cost of ownership for proprietary authentication systems includes not just licensing fees but also integration costs, audit costs, and long-term migration costs. Open-source software eliminates licensing fees entirely, but more importantly, it reduces integration and audit costs by providing full source access to internal security teams.

For individual users, MF+SO is free in every sense: no cost to use, no cost to audit, no cost to modify, and no cost to leave. This is particularly important for privacy-conscious users, journalists, activists, and others who may lack the resources to pay for premium authentication software but whose security needs are highest. The project's open-source model ensures that the highest-quality authentication technology is available to everyone, regardless of their financial resources.

The open-source model also creates economic efficiency in the security ecosystem. Instead of every organization duplicating the effort of auditing the same proprietary authentication software, the results of a single audit of MF+SO's open-source code benefit the entire user base. Security researchers can specialize in MF+SO and share their findings with everyone, rather than being bound by nondisclosure agreements. This collective approach to security assurance is more efficient and more effective than the fragmented, duplicated approach required by proprietary software.

### 7. The Limits of Open Source

MF+SO's commitment to open source does not mean that every aspect of the project is public. There are legitimate limits to transparency that must be acknowledged. Specifically:

- **Vulnerability reports** are kept private during the remediation period, in accordance with responsible disclosure practices. This prevents attackers from exploiting vulnerabilities before users have had a chance to update. The standard practice is to disclose the vulnerability publicly 90 days after a fix is released, or sooner if the fix is widely deployed.

- **User data** is never public — MF+SO has no cloud storage of user credentials or personal information. The application runs locally on the user's device, and the data stored there is encrypted with keys that only the user possesses. Even if someone had full access to the MF+SO source code and infrastructure, they could not access any user's credentials.

- **Security-critical infrastructure** (code signing keys, build server credentials) is protected with appropriate access controls. These keys are necessary for the project's operation but, if exposed, could allow an attacker to distribute malicious updates. The access to these keys is limited to a small number of trusted maintainers, and their use is logged and audited.

- **Pending feature development** may be discussed in private channels before public announcement, to avoid speculation and misinformation. However, the final implementation is always public and subject to the same review process as any other code.

These limits are not contradictions of the open-source philosophy. They are practical necessities for maintaining the security of the project while still achieving maximum transparency. The key principle is that everything that can be public without compromising security should be public, and the boundaries of transparency are themselves documented and justified.

### 8. Historical Context and Inspiration

MF+SO's open-source philosophy draws on decades of thinking about security, transparency, and software freedom. The project acknowledges foundational influences including:

- **The GNU Manifesto and Free Software Foundation** — Richard Stallman's arguments for user freedom and the ethical imperative of source code access. The concept of "free as in freedom, not free as in price" is central to MF+SO's mission: users must have the freedom to inspect, modify, and share the software that controls their digital identity.

- **The Open Source Definition and Open Source Initiative** — The practical framework for evaluating and certifying open-source licenses. MF+SO's choice of the Apache 2.0 license is informed by the Open Source Definition's requirement for free redistribution, source code access, and derived works.

- **The Cryptography Freedom movement** — The "cypherpunk" tradition that produced PGP, Tor, Signal, and the cryptographic tools that make MF+SO possible. The cypherpunk principle that "privacy in an open society requires anonymous transaction systems" directly informs MF+SO's local-first, zero-knowledge architecture.

- **The reproducible builds project** — The technical infrastructure for verifying that compiled binaries correspond to source code. Without reproducible builds, source code transparency is incomplete, because users cannot verify that the binary they run matches the source they inspect.

- **The Zero Trust security model** — The principle of "never trust, always verify" that extends naturally from network architecture to software supply chains. In a Zero Trust framework, every component of the software supply chain must be verified independently, which is only possible when source code is available.

- **The Verified Boot and Measured Boot security model** — Chain of trust concepts from hardware security that apply equally to software supply chains. Each link in the chain from source code to running binary must be verifiable.

These traditions converge in MF+SO's central insight: in an era of ubiquitous surveillance, state-sponsored cyberattacks, and opaque corporate data practices, authentication software must be held to the highest possible standard of transparency. Anything less is a betrayal of the user's trust.

### 9. Practical Implications for Users

For the end user of MF+SO, the open-source philosophy translates into concrete benefits:

- **No hidden data collection** — Because the source code is public, any data collection or transmission is visible to all. Users do not need to take MF+SO's privacy policy on faith; they can verify it by reading the code.

- **No planned obsolescence** — Because the software can be forked and maintained independently, there is no risk of the project being discontinued and leaving users stranded. Even if the original maintainers abandon the project, the community can continue development.

- **No surprise behavior changes** — Because every change is recorded in version control with a clear audit trail, users can track exactly what the software does and when it changed. Silent updates that modify behavior without user knowledge are impossible.

- **Community support** — Beyond the official support channels, users can get help from the community through forums, chat rooms, and stack exchange sites. The open-source community is self-sustaining and does not depend on the project's continued funding.

- **Customizability** — Organizations with specific requirements can modify the software to meet their needs without waiting for the vendor to implement features. Custom modifications can be shared with the community, benefiting other users with similar needs.

- **Rapid security response** — When vulnerabilities are discovered, the community can develop and distribute fixes independently. Users do not have to wait for a vendor to release an update.

- **Long-term archival** — The source code, being publicly available, can be archived by multiple independent organizations. Even if the primary repository is taken down, the code will survive in mirrors, archives, and local copies.

### 10. Open Source and Organizational Trust

For organizations evaluating MF+SO, the open-source nature of the software provides a different kind of assurance than proprietary software. When an organization adopts proprietary authentication software, they must trust the vendor's claims about security, privacy, and compliance. This trust is based on factors that are outside the organization's control: the vendor's reputation, financial stability, and continued good faith.

When an organization adopts MF+SO, they can verify those claims themselves. The organization's own security team can audit the code, verify the build, and assess the security posture. This internal verification provides a level of assurance that no external certification or vendor promise can match. Organizations in regulated industries (finance, healthcare, government) particularly benefit from this ability to conduct independent security assessments.

Furthermore, the open-source license allows organizations to modify the software to meet their specific compliance requirements. If a regulation requires specific audit logging, cryptographic algorithms, or access controls, the organization can implement those requirements directly rather than hoping the vendor adds them. This flexibility is particularly valuable for organizations with complex compliance needs.

### 11. Community Governance

MF+SO's open-source community is governed by a transparent, meritocratic governance model. The project's governance structure includes:

- **Core maintainers**: A small group of trusted individuals with commit access to the repository. Core maintainers are selected based on their contributions, expertise, and alignment with the project's values.

- **Contributors**: Anyone who contributes code, documentation, translations, or other improvements. Contributors do not need to sign a CLA; their contributions are licensed under the project's Apache 2.0 license.

- **Security team**: A subset of core maintainers with specific responsibility for security issues. The security team has access to private disclosure channels and can make emergency releases.

- **Community moderators**: Volunteers who moderate the community forum, chat rooms, and other community spaces. Moderators enforce the code of conduct and ensure a welcoming environment.

- **Users**: The broader community of MF+SO users who provide feedback, report bugs, and suggest features. User feedback is collected through the issue tracker, community forum, and user surveys.

Governance decisions, including changes to the governance model itself, are made through a documented process that involves community discussion and, where appropriate, voting. The governance model is itself documented in the repository and is subject to the same transparency and auditability as the code.

### 12. Open Source and the Long-Term Vision

The open-source nature of MF+SO is not just about the present; it is about ensuring the project's long-term viability and independence. Proprietary authentication projects have a history of being acquired, shut down, or changed in ways that harm their users. When a proprietary password manager or authenticator is acquired, the new owner may change the pricing model, introduce advertising, or redirect user data to new purposes. Users who have invested time in learning and using the product are left with a difficult choice: accept the changes or go through the painful process of migrating to a new system.

Open-source projects, by contrast, cannot be acquired in a way that takes away the community's rights to the code. Even if the MF+SO trademark and official distribution channels are acquired, the community can fork the code, rebrand, and continue development under a new name. The Apache 2.0 license ensures that this right is permanent and irrevocable.

This long-term resilience is particularly important for authentication software, where the cost of switching is high. Users and organizations that adopt MF+SO can be confident that their investment in learning and configuring the software will not be undermined by a corporate decision made years in the future. The software belongs to the community, and the community's rights to it are protected by the open-source license.

### 13. Conclusion

MF+SO is open source not because it is fashionable, not because it reduces marketing costs, and not because it is expected of security tools. MF+SO is open source because authentication software that is not open source cannot be fully trusted. In a world where digital identity is the foundation of online security, privacy, and freedom, the software that protects that identity must be accountable to its users — and accountability requires transparency.

The open-source philosophy is not an afterthought or a feature of MF+SO. It is the starting point from which everything else — the cryptographic architecture, the privacy guarantees, the auditability, the reproducibility — follows as a natural consequence. Every document in this "No Black Boxes" series elaborates on a specific aspect of this philosophy, providing the technical depth and practical details that security-conscious users and organizations need to make informed decisions about their authentication infrastructure.

We invite you to read the source code. We invite you to audit it, build it, break it, and help us improve it. That is the only path to software that deserves to be trusted with your identity.

### 13. Open Source and the Developer Experience

The open-source nature of MF+SO creates a developer experience that is fundamentally different from proprietary authentication projects. Developers who integrate MF+SO into their applications, contribute to the project, or build on top of its codebase benefit from full access to the implementation, comprehensive documentation, and a responsive community.

**Integration experience:** When integrating MF+SO into an application or service, developers can examine the exact code that handles authentication flows, credential storage, and protocol implementation. This allows for precise understanding of behavior, edge cases, and security properties. Integration tests can be written against the actual MF+SO codebase rather than against a black-box API whose internal behavior is undocumented.

**Debugging and troubleshooting:** When issues arise during integration, developers can debug directly into the MF+SO source code. They can set breakpoints, step through authentication flows, and examine internal state. This debugging capability is invaluable for diagnosing integration issues that would be opaque with proprietary authentication software.

**Customization and extension:** Developers who need behavior that MF+SO does not provide by default can modify the source code directly. Common customizations include: custom authentication factor types, specialized credential storage backends, integration with internal identity management systems, and custom UI themes that match organizational branding.

**Testing and quality assurance:** The availability of the full test suite allows developers to run MF+SO's tests against their modifications, ensuring that changes do not break existing functionality. Organizations can extend the test suite with their own integration tests specific to their deployment.

### 14. Case Studies from the Open Source Ecosystem

The success of open-source security software provides compelling evidence for MF+SO's philosophical approach. Several projects have demonstrated that open-source authentication and security software can achieve widespread adoption while maintaining strong security properties.

**Signal Protocol:** The Signal Protocol, which powers end-to-end encryption for Signal, WhatsApp, and other messaging applications, is fully open source. Its cryptographic design has been extensively analyzed by the global research community, and the protocol has become the de facto standard for secure messaging. The open-source nature of the protocol was essential to its adoption — no major messaging platform would integrate a proprietary encryption protocol.

**Let's Encrypt:** Let's Encrypt is an open-source Certificate Authority that has issued over a billion certificates. Its ACME protocol is standardized through the IETF, and its entire infrastructure is open source. Let's Encrypt demonstrated that open-source security infrastructure can achieve the scale, reliability, and trustworthiness that was previously thought to require proprietary systems.

**WireGuard:** WireGuard is an open-source VPN protocol that was designed for simplicity, performance, and security. Its source code is deliberately small (approximately 4,000 lines), making it auditable by a single security researcher. WireGuard has been adopted by major Linux distributions, cloud providers, and commercial VPN services. Its open-source nature was critical to its rapid adoption and integration into the Linux kernel.

**OpenPGP:** The OpenPGP standard for encrypted email and file encryption has been open source since its inception. Despite its complexity and usability challenges, OpenPGP remains the most widely deployed encryption standard for email because it is open, standardized, and implemented by multiple interoperable software projects.

These case studies share common characteristics: open standards, public implementations, community audit, and long-term maintenance independent of any single organization. MF+SO follows the same model, applying the lessons learned from these successful open-source security projects to the domain of multi-factor authentication.

### 15. The Economics of Open Source Authentication

The economic case for open-source authentication software extends beyond the elimination of licensing fees. Organizations that adopt MF+SO realize economic benefits throughout the software lifecycle.

**Procurement efficiency:** Open-source software eliminates the lengthy procurement processes associated with proprietary enterprise software. There are no license negotiations, no vendor evaluations based on marketing materials rather than technical merit, and no complex contract terms regarding data handling, SLA commitments, or liability.

**Audit cost reduction:** Organizations in regulated industries (finance, healthcare, government) must conduct security audits of the software they deploy. With proprietary software, the organization must either trust vendor-supplied audit reports or conduct their own audits — often under NDAs that limit the scope of review. With open-source software, the organization's security team can conduct a full audit without restrictions, and the results of that audit can be shared across the organization.

**Integration cost reduction:** Integrating authentication software into existing infrastructure often requires customization and extension. With open-source software, these customizations can be implemented in-house or by third-party integrators without vendor involvement. The cost savings from avoiding vendor professional services can be substantial.

**Migration cost avoidance:** The cost of migrating from one proprietary authentication system to another can be enormous, involving data migration, protocol adaptation, re-enrollment of users, and retraining. MF+SO's use of open standards and documented formats minimizes this migration cost. Organizations that adopt MF+SO retain the ability to migrate to any other standards-compliant authentication system in the future.

**Community support economics:** The MF+SO community provides support through forums, chat rooms, and documentation. This community support complements official support channels and often provides faster, more detailed responses than traditional vendor support. Organizations can also hire community members as consultants for specialized needs.

### 16. Frequently Asked Questions About Open Source Authentication

**Q: If the source code is public, doesn't that make it easier for attackers to find vulnerabilities?**

A: This is one of the most common misconceptions about open-source security software. While it is true that attackers can examine the source code, the same is true for defenders — and the defenders outnumber the attackers. In practice, the "many eyeballs" effect means that vulnerabilities in open-source software are found and fixed faster than in proprietary software. Furthermore, attackers can reverse-engineer proprietary binaries to find vulnerabilities, so source code availability does not increase the attack surface; it equalizes the information available to attackers and defenders.

**Q: How does MF+SO prevent malicious contributions from being merged?**

A: The project has a rigorous code review process that requires at least one reviewer for all changes and at least two reviewers for security-critical changes. All changes must pass automated security analysis, including SAST, fuzz testing, and dependency scanning before merging. The project maintains a list of trusted reviewers with demonstrated expertise in security-sensitive code.

**Q: Can I use MF+SO in a commercial product?**

A: Yes, the Apache 2.0 license explicitly allows commercial use, modification, and distribution. You can integrate MF+SO into a commercial product without paying royalties or releasing your product's source code. See the license file for full details.

**Q: What happens if the MF+SO project is abandoned?**

A: Because the software is open source under a permissive license, the community can fork the project and continue development independently. The source code will remain available through multiple mirrors and archives. Organizations can also maintain private forks for internal use.

**Q: How does MF+SO handle vulnerability disclosure?**

A: MF+SO follows industry-standard responsible disclosure practices. Vulnerabilities are reported to the security team through a private channel, confirmed, and fixed. After a fix is released and users have had time to update, the vulnerability is publicly disclosed with full details, credit to the discoverer, and CVE assignment.

### 17. How to Contribute to MF+SO

Contributions to MF+SO are welcome from everyone, regardless of experience level. The project maintains a CONTRIBUTING.md file with detailed guidance, but the following provides a high-level overview of contribution opportunities.

**Code contributions:** Developers can contribute bug fixes, feature implementations, performance improvements, and test additions. The codebase is organized with clearly labeled issues for new contributors, including "good first issue" tags for those getting started. Pull requests undergo the standard review process.

**Security research:** Security researchers are encouraged to audit the code and report findings through the bug bounty program or responsible disclosure process. The project maintains clear guidelines for security research, including a scope definition and a safe harbor policy that protects researchers acting in good faith.

**Documentation:** Technical writers can contribute to the project's documentation, including API references, user guides, architecture documentation, and translation into other languages. Documentation is maintained in the repository alongside the code.

**Community support:** Community members can help answer questions in the forum, triage issues, review pull requests, and moderate community spaces. These contributions are essential to maintaining a healthy open-source community.

**Financial support:** Organizations and individuals can support MF+SO through the Open Collective platform. Contributions fund security audits, infrastructure costs, bug bounties, and community events.

### 18. Open Source Governance Model Deep Dive

MF+SO's governance model is designed to ensure the project remains open, transparent, and resilient over the long term.

**Core maintainers** are individuals who have demonstrated sustained commitment to the project through high-quality contributions, thoughtful code reviews, and constructive community participation. Core maintainers have commit access to the repository and voting rights on project decisions.

**Technical steering committee** consists of five core maintainers who oversee the project's technical direction. The TSC resolves disputes that cannot be resolved through normal discussion, approves significant architectural changes, and manages the relationship with external organizations.

**Governance principles:**
- Decisions are made through consensus-based discussion, with voting as a fallback mechanism
- All governance discussions and votes are recorded in public archives
- No single organization or individual has veto power over project decisions
- Governance documents are themselves open to amendment through the governance process
- The project maintains a code of conduct that applies to all governance participants

**Conflict resolution:**
- Technical disagreements are resolved through technical arguments, not authority
- Persistent disagreements are escalated to the TSC
- The TSC's decisions can be appealed through a documented process
- In extreme cases, the community can fork the project to resolve irreconcilable differences

### 19. Conclusion and Call to Action

MF+SO is open source because authentication software that is not open source cannot be fully trusted. This conviction is supported by historical evidence, economic analysis, and practical experience in the security industry. The open-source philosophy is not an afterthought or a marketing position — it is the foundational principle from which every aspect of MF+SO's security model derives.

We invite you to verify our claims by reading the source code, auditing the implementation, building the binaries, and comparing them to our official releases. We invite you to contribute your expertise, whether as a developer, security researcher, documentation writer, or community supporter. We invite you to hold us accountable to the standards we have set for ourselves.

The source code is available at https://github.com/lois-kleinner/mfso. The documentation is maintained in the same repository. The community gathers on the project forum at https://community.mfso.io. The security team can be reached at security@mfso.io.

Your identity deserves software that is worthy of trust. MF+SO strives to be that software, and the open-source philosophy is how we earn that trust — not once, but every day, through transparency, verifiability, and community accountability.

### 20. Comparison: Open Source vs. Proprietary Authentication

The following table provides a direct comparison between MF+SO's open-source approach and typical proprietary authentication solutions across key dimensions:

| Dimension | MF+SO (Open Source) | Proprietary Solutions |
|-----------|---------------------|-----------------------|
| Source code access | Full, public repository | Binary-only or limited source access |
| Security audit | Independent verification by anyone | Vendor-controlled, NDA-bound |
| Build verification | Reproducible builds, binary matching | Binary verification not possible |
| Supply chain transparency | Complete SBOM for every release | Limited or no SBOM publication |
| Cryptographic algorithm disclosure | All algorithms documented, standardized | May include proprietary algorithms |
| Vulnerability disclosure | Full public disclosure after fix | Variable, often limited disclosure |
| Community review | Global community of reviewers | Limited to vendor's security team |
| Vendor lock-in | None, open standards and formats | Proprietary formats, protocols |
| Long-term maintenance | Forkable, community-sustained | Dependent on vendor viability |
| Customization | Full source modification allowed | Limited to vendor API |
| Licensing cost | Free (Apache 2.0) | Per-user or per-deployment fees |
| Integration flexibility | Full control over integration | Limited to supported integrations |
| Data portability | Multiple export formats | Often restricted export |
| Audit trail transparency | Complete Git history, public | Limited change history |
| Compliance verification | Self-verify or third-party audit | Vendor attestation required |

This comparison demonstrates that open-source authentication software provides material advantages across every dimension relevant to security, privacy, and user freedom.

### 21. Open Source Maturity Model

MF+SO follows a defined maturity model for its open-source project governance, moving through stages as the project grows:

**Stage 1 — Startup (Current):** Core maintainers establish the project, define governance, publish source code, implement security processes, and build the initial community. At this stage, decision-making is concentrated among the founding maintainers, with transparent processes and community input.

**Stage 2 — Growth:** As the community expands, governance becomes more distributed. Additional maintainers are added from the community. Formal voting procedures are established for project decisions. A technical steering committee is formed to oversee architectural direction.

**Stage 3 — Maturity:** The project achieves a self-sustaining community with diverse maintainers from multiple organizations. Governance is fully documented and practiced. The project has a proven track record of security vulnerability response and community management.

**Stage 4 — Institutionalization:** The project is adopted by a foundation or similar institution that provides legal and financial infrastructure while maintaining community governance. The project's open-source nature is protected by institutional bylaws that prevent any single entity from taking control.

Each stage of the maturity model preserves the core open-source philosophy while adapting governance structures to the project's scale and community needs.

### 22. The Role of Funding in Open Source Authentication

Sustainable open-source projects require funding for infrastructure, security audits, and maintainer time. MF+SO's funding model is designed to preserve the project's independence and open-source commitments.

**Funding sources:**
- **Grants:** The project accepts grants from foundations and organizations that support open-source security software. Grant funding is preferred because it comes with minimal strings and supports the project's mission.
- **Donations:** Individual and corporate donations through Open Collective provide unrestricted funding for project operations.
- **Enterprise support:** Fee-based enterprise support services (deployment assistance, custom development, priority support) generate revenue without compromising the open-source nature of the software.
- **Consulting and training:** Maintainers offer paid consulting and training services related to MF+SO deployment and integration.

**Funding commitments:**
- No funding source can dictate project direction or feature prioritization
- All funding sources are disclosed in transparency reports
- No single funding source can contribute more than 15% of annual revenue
- Funding is not accepted from organizations engaged in surveillance, censorship, or human rights violations
- Funding decisions are made transparently and documented publicly

### 23. Open Source and Regulatory Compliance

Regulatory compliance frameworks increasingly recognize the value of open-source software for security-critical applications:

**NIST SP 800-207 (Zero Trust Architecture):** The NIST Zero Trust Architecture guidelines emphasize the importance of verifying every access request. Open-source authentication software aligns with this principle by allowing organizations to verify the security properties of their authentication infrastructure rather than relying on vendor attestations.

**FIPS 140-3 (Cryptographic Module Validation):** While FIPS validation is primarily focused on cryptographic modules, the transparency of open-source implementations can facilitate the validation process. Organizations can audit open-source cryptographic code directly rather than relying on vendor validation reports.

**EU Cybersecurity Act:** The EU's cybersecurity certification framework recognizes the importance of transparency in security products. Open-source software's verifiability aligns with the certification requirements for independent assessment.

**ISO 27001 (Information Security Management):** ISO 27001 requires organizations to ensure that acquired software meets security requirements. Open-source software allows organizations to conduct their own assessments rather than relying on vendor-provided evidence.

### 24. Open Source and National Security

The relationship between open-source software and national security is complex and evolving. MF+SO takes the position that open-source authentication software enhances national security by:

- Reducing dependence on foreign proprietary software that may be subject to foreign intelligence collection
- Enabling domestic security review and verification of critical authentication infrastructure
- Preventing vendor lock-in by foreign corporations that may be subject to foreign law
- Allowing rapid response to newly discovered vulnerabilities without waiting for vendor updates
- Facilitating the development of sovereign authentication capabilities

These considerations are particularly relevant for government and military applications of authentication software.

### 25. Open Source in the Broader Context

The open-source philosophy that guides MF+SO is part of a broader movement toward transparency and user control in digital infrastructure. Other domains where open-source principles are increasingly applied include:

- **Hardware design:** Open hardware initiatives (RISC-V, OpenRISC) apply open-source principles to processor design and hardware verification
- **Data formats:** Open data formats (CSV, JSON, Parquet, Arrow) ensure data portability and prevent vendor lock-in
- **Standards:** Open standards (IETF, W3C, ISO) provide the foundation for interoperable systems
- **Scientific research:** Open science practices (open access, open data, open methodology) increase research reproducibility and integrity
- **Government:** Open government initiatives (open data portals, open policy-making) increase transparency and citizen participation

MF+SO sits at the intersection of several of these movements: open-source software, open standards for authentication, and user-controlled identity management. The project contributes to a future in which digital identity infrastructure is transparent, verifiable, and accountable to its users.

### 26. Risks of Open Source and How MF+SO Mitigates Them

While open-source software provides significant advantages for security-critical applications, it also introduces risks that must be acknowledged and managed:

**Risk: Malicious contributions.** A bad actor could submit a vulnerability disguised as a legitimate contribution. Mitigation: mandatory code review (2+ reviewers for security code), automated security scanning, signed commits, and provenance verification for contributors.

**Risk: Maintainer burnout.** Essential maintainers may leave the project, leaving critical components unmaintained. Mitigation: bus factor management through documentation, knowledge sharing, and gradual onboarding of new maintainers. The project maintains a bus factor of at least 3 for all critical components.

**Risk: Supply chain attacks.** Compromised dependencies could introduce vulnerabilities. Mitigation: dependency pinning, hash verification, automated vulnerability scanning, and source-based dependencies for critical components.

**Risk: Fork fragmentation.** Disagreements within the community could lead to competing forks that fragment the user base and dilute security review resources. Mitigation: clear governance and conflict resolution processes, recognition that healthy forks can be beneficial (competing implementations drive improvement).

**Risk: Funding sustainability.** The project may struggle to secure ongoing funding for security audits and infrastructure. Mitigation: diversified funding sources, transparent financial management, and low-cost infrastructure design.

### 27. The Future of Open Source Authentication

As the digital identity landscape evolves, MF+SO's open-source philosophy positions the project to address emerging challenges:

**Post-quantum cryptography:** The transition to post-quantum cryptographic algorithms will require significant changes to authentication software. Open-source authentication software can adapt faster than proprietary solutions because the entire community can contribute to the transition rather than relying on a single vendor's development roadmap.

**Decentralized identity:** Emerging decentralized identity standards (DID, Verifiable Credentials) are inherently open and standards-based. MF+SO's open-source architecture is well-positioned to integrate with these standards as they mature.

**WebAuthn and passkeys:** The adoption of WebAuthn and passkeys for passwordless authentication is driving demand for open-source authenticators that can be independently verified. MF+SO's focus on WebAuthn compliance positions it as a trusted option for passwordless authentication.

**Regulatory evolution:** As data protection and cybersecurity regulations evolve, the demand for verifiable security software will increase. Open-source authentication software that can be independently audited and verified will be increasingly preferred over proprietary alternatives.

### 28. Glossary of Open Source Terms

Understanding the terminology used in open-source software is essential for informed decision-making:

- **Apache 2.0 License:** A permissive open-source license that allows users to use, modify, and distribute the software for any purpose, including commercial use, with minimal restrictions.
- **Copyleft:** A licensing approach that requires derivative works to be distributed under the same license as the original work. The GPL family of licenses uses copyleft.
- **Fork:** A copy of the source code that is developed independently from the original project. Forks can be competitive or complementary.
- **Free Software:** Software that respects users' freedom to run, copy, distribute, study, change, and improve the software, as defined by the Free Software Foundation.
- **Open Source:** Software with source code that is made available under a license that allows anyone to use, study, modify, and distribute it. The Open Source Initiative maintains the Open Source Definition.
- **Permissive License:** An open-source license that imposes minimal restrictions on how the software can be used, modified, or distributed. Examples include MIT, BSD, and Apache 2.0.
- **Pull Request:** A mechanism for proposing changes to a repository. The change is reviewed before being merged.
- **SBOM (Software Bill of Materials):** A machine-readable inventory of all components in a software package, including dependencies and their versions.
- **Source Code:** The human-readable version of software that can be inspected, modified, and compiled into executable form.

### 29. Practical Checklist for Evaluating Open Source Authentication Software

Organizations evaluating MF+SO or any open-source authentication solution can use the following checklist to assess its suitability:

**Source Code Assessment:**
- Is the source code publicly accessible in a version-controlled repository?
- Is the commit history available and does it show regular maintenance?
- Are releases tagged and signed?
- Is there a clear branching strategy?
- Are there multiple mirrors or backups of the repository?

**Security Assessment:**
- Has the codebase undergone third-party security audits?
- Are audit reports published publicly?
- Is there a clear vulnerability disclosure policy?
- Is there a bug bounty program?
- Are security fixes released promptly?
- Is the build process reproducible?

**License Assessment:**
- Is the license clearly indicated in the repository?
- Does the license permit the intended use (commercial, government, etc.)?
- Are there any patent or trademark restrictions?
- Are third-party component licenses compatible?
- Is the license irrevocable?

**Community Assessment:**
- Is there an active community of contributors?
- Are there clear governance documents?
- Is there a code of conduct?
- Are there community support channels (forum, chat, mailing list)?
- Are there paid support options available?

**Dependency Assessment:**
- Is a complete SBOM published?
- Are dependencies regularly scanned for vulnerabilities?
- Are dependencies pinned to specific versions?
- Is there a dependency update policy?
- Are critical dependencies audited?

### 30. References and Further Reading

The following resources provide additional context for the principles discussed in this document:

- "The Cathedral and the Bazaar" by Eric S. Raymond — The seminal work on open-source development models and the "many eyeballs" theory
- "Homeland" by Cory Doctorow — A novel exploring surveillance, identity, and the importance of cryptographic transparency
- "Understanding the Open Source Definition" — Open Source Initiative documentation on the criteria for open-source licenses
- "Reproducible Builds: A Guide" — The reproducible builds project's documentation on deterministic compilation and verification
- "Software Supply Chain Security" by NIST — NIST guidance on securing the software supply chain
- "The Zero Trust Architecture" (NIST SP 800-207) — Guidelines for implementing zero trust security models
- "Secure Software Development Framework" (NIST SP 800-218) — NIST framework for secure software development practices
- "Open Source Security Foundation (OpenSSF)" — Industry consortium for improving open-source security
- "The Linux Foundation's Core Infrastructure Initiative" — Best practices for open-source security-critical projects
- "Signal's Threat Model" — Signal's published threat model as an example of security documentation in open-source projects

These resources are referenced in the MF+SO documentation and provide foundation for the technical and philosophical positions taken in this document. Readers are encouraged to consult the primary sources for deeper understanding of the principles that guide MF+SO's development and governance.

### 31. Open Source and Identity Sovereignty

The concept of identity sovereignty — the idea that individuals should own and control their digital identity — is deeply connected to open-source principles. Just as open-source software gives users control over the software they run, identity sovereignty gives users control over the identity data they use to authenticate.

MF+SO's open-source philosophy directly supports identity sovereignty:
- Users can verify that their identity data is handled correctly
- Users can modify the software to meet their identity management needs
- Users are not locked into any vendor's identity ecosystem
- Users can independently audit the security of their identity management

The alignment between open-source software and identity sovereignty is not coincidental. Both movements recognize that control over digital tools and digital identity is essential for individual autonomy in the digital age.

### 32. Open Source Community Health Metrics

MF+SO tracks and publishes metrics about the health of its open-source community:

| Metric | Current | Trend |
|--------|---------|-------|
| Active contributors (monthly) | 24 | Increasing |
| New contributors (quarterly) | 15 | Stable |
| Pull requests merged (monthly) | 42 | Increasing |
| Average review time | 2.3 days | Decreasing |
| Issue response time (median) | 8 hours | Stable |
| Code review participation rate | 85% | Increasing |
| Documentation coverage | 92% | Increasing |
| Test coverage | 94% | Increasing |

These metrics are published quarterly in the project's community health report. The project aims for continuous improvement in community health, recognizing that a healthy community produces better software.

### 33. Final Thoughts

The open-source philosophy is not merely a licensing choice or a development methodology. It is a commitment to transparency, accountability, and user empowerment that shapes every aspect of MF+SO — from the cryptographic primitives we use to the way we handle bug reports, from the build infrastructure we maintain to the community governance we practice.

We believe that authentication software, because of its uniquely sensitive role in protecting digital identity, must be held to the highest standard of transparency. Open source is the only way to achieve that standard.

We invite you to verify our claims, scrutinize our code, and hold us accountable. The source code is at https://github.com/lois-kleinner/mfso. The community gathers at https://community.mfso.io. The security team can be reached at security@mfso.io.

Thank you for trusting MF+SO with your authentication needs. We are committed to earning that trust every day through transparency, verifiability, and community accountability.

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
