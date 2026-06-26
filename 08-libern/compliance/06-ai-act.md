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
Category: compliance | ID: LIB-COMP-006

────────────────────────────────────────────────────────────────

# EU AI Act Compliance

## 1. Overview

The European Union's Artificial Intelligence Act (Regulation 2024/1689) is the
world's first comprehensive legal framework for AI, categorizing AI systems by
risk level: unacceptable risk (prohibited), high risk (regulated), limited risk
(transparency obligations), and minimal risk (no obligations).

Libern includes a local AI engine for natural language processing tasks such as
message summarization, smart replies, and content moderation. Because this AI
engine runs entirely on the user's device and does not transmit any data to
external services, it falls into the "minimal risk" or "no significant risk"
category under the AI Act.

This document analyzes Libern's AI capabilities against the EU AI Act
requirements and demonstrates why the local AI architecture is categorically
exempt from most regulatory obligations.

## 2. AI System Classification

### 2.1 Risk Category Assessment

Under the AI Act, AI systems are classified into four risk categories:

| Risk Category | Description | Libern AI Status |
|---------------|-------------|-----------------|
| Unacceptable | Prohibited practices (subliminal manipulation, social scoring, etc.) | Not applicable |
| High Risk | Systems affecting safety or fundamental rights | Not applicable |
| Limited Risk | Systems with transparency obligations (e.g., chatbots) | Potentially applicable |
| Minimal Risk | No regulatory obligations | Likely classification |

### 2.2 Why Libern AI Is Minimal Risk

Libern's AI engine qualifies as minimal risk for several reasons:

1. **No training on user data:** The AI model is pre-trained and distributed
   with the application. User data is never used to train, fine-tune, or
   improve the model.
2. **Local processing:** All inference happens on the user's device. No data
   is transmitted to any external server.
3. **User control:** The AI features are optional and can be disabled entirely.
4. **Transparency:** The model, its capabilities, and its limitations are fully
   documented.
5. **No profiling:** The AI does not create profiles of users or make
   decisions that affect their legal rights.

### 2.3 High-Risk Criteria Assessment

The AI Act defines high-risk AI systems as those that pose significant risks to
health, safety, or fundamental rights. The specific high-risk categories from
Annex III are evaluated below:

| High-Risk Category | Libern AI Relevance |
|--------------------|-------------------|
| Biometric identification | Not used |
| Critical infrastructure | Not used for safety components |
| Education and vocational training | Not used |
| Employment and worker management | Not used |
| Access to essential services | Not used |
| Law enforcement | Not used |
| Migration and border control | Not used |
| Administration of justice | Not used |

Libern's AI performs only auxiliary communication tasks (summarization, reply
suggestions, content moderation). It does not make decisions that affect legal
rights, safety, or access to essential services.

## 3. Transparency Obligations (Title IV)

### 3.1 Article 50 — Transparency for Certain AI Systems

Article 50 requires that users be informed when they are interacting with an AI
system. Libern satisfies this obligation by:

- Clearly labeling AI-generated content (summaries, smart replies)
- Indicating when the AI engine is active or fallback mode
- Providing a visual indicator when AI processing is occurring
- Including settings that show which AI features are enabled

### 3.2 Article 50(2) — Emotional Detection

Libern does not perform emotion detection. Voice processing is limited to audio
transmission for voice chat; no emotional analysis is performed.

### 3.3 Article 50(3) — Deep Fakes

Libern's AI does not generate synthetic content (images, video, audio). It only
processes text for summarization and suggestions. The AI does not create deep
fakes or manipulate media.

## 4. General-Purpose AI (GPAI) Assessment

### 4.1 Is Libern AI a GPAI?

The AI Act defines General-Purpose AI as AI systems that can serve a variety of
purposes. Libern's AI is narrowly scoped to communication assistance within the
application. It is not a general-purpose model like GPT-4 or Llama — it is a
specialized, small-footprint model designed for specific tasks.

### 4.2 If Classified as GPAI

Even if Libern's AI were classified as a GPAI, it would likely qualify for the
"open-source" exemption under Article 53, provided:

- The model is released under a free/open-source license (Libern is AGPL-3.0)
- Model parameters are published (available as part of the application)
- The model is transparent about capabilities and limitations
- No systemic risk is identified (the model is small and specialized)

## 5. Provider Obligations

### 5.1 Who Is the Provider?

Under the AI Act, the "provider" is the entity that develops or makes available
an AI system. For Libern, the provider is the Libern development team.

### 5.2 Obligations Not Applicable to Libern

Because Libern's AI is minimal risk, the following provider obligations do not
apply:

- **Article 8-15:** Risk management system (required for high-risk only)
- **Article 9-15:** Technical documentation, record-keeping, transparency (full
  version for high-risk only)
- **Article 16-22:** Conformity assessment (required for high-risk only)
- **Article 43:** CE marking (required for high-risk only)

### 5.3 Voluntary Compliance Measures

While not required, Libern voluntarily implements:

- **Transparency documentation:** This document explains AI capabilities
- **User information:** In-app indicators show when AI is active
- **Human oversight:** All AI suggestions require user approval before action
- **Accuracy and robustness:** Testing and validation of AI model performance

## 6. Deployer Obligations

### 6.1 Who Is the Deployer?

The deployer is the organization or individual that deploys Libern and uses its
AI features. Under Article 29, deployers of high-risk AI systems have specific
obligations, but these do not apply to Libern's minimal-risk AI.

### 6.2 Recommended Best Practices

Although not legally required, Libern recommends that deployers:

1. Inform users about AI features and how to disable them
2. Monitor AI performance for relevant use cases
3. Provide feedback channels for AI-related issues
4. Document the decision to use AI assistance

## 7. Data Training and Privacy

### 7.1 No Training on User Data

Libern's AI model is pre-trained and distributed as a static model file. The
application does not:

- Collect user messages for training data
- Fine-tune models based on user behavior
- Transmit prompts or responses to external servers
- Share any data with model developers

This is a critical distinction from cloud-based AI services (ChatGPT, Claude,
Copilot) that may use user data for model improvement.

### 7.2 GDPR Interaction

The AI Act does not override GDPR requirements. The interaction between the AI
Act and GDPR for Libern's AI:

- **GDPR Article 5(1)(b):** Purpose limitation is satisfied — AI processes only
  the data the user provides for the specific task
- **GDPR Article 5(1)(c):** Data minimization is satisfied — only the current
  context is processed
- **GDPR Article 22:** Automated decision-making — Libern's AI makes suggestions,
  not decisions affecting legal rights
- **GDPR Article 35:** DPIA — not required due to minimal risk profile

## 8. AI Model Properties

### 8.1 Model Architecture

Libern's AI uses the Candle engine for local inference:

- **Size:** Small-footprint model (< 2 GB) suitable for consumer hardware
- **Performance:** Optimized for CPU inference, GPU acceleration optional
- **Capabilities:** Message summarization, smart reply suggestions, content
  moderation
- **Limitations:** Not a general-purpose chatbot; limited to communication
  assistance

### 8.2 Model Card (Recommended under GPAI rules)

| Property | Value |
|----------|-------|
| Model name | Libern AI v1.0 |
| Architecture | Transformer-based (Candle engine) |
| Parameters | < 7B |
| Training data | Public datasets only (no user data) |
| License | AGPL-3.0 compatible |
| Intended use | Communication assistance |
| Known limitations | Not suitable for medical, legal, or financial advice |
| Ethical considerations | Content filtering for harmful outputs |

## 9. Enforcement and Penalties

### 9.1 Regulatory Oversight

The AI Act is enforced by national market surveillance authorities. For Libern's
AI classification:

- **No registration requirement:** Minimal-risk AI does not need EU database
  registration
- **No notified body assessment:** Not required for minimal risk
- **No conformity assessment:** Not required for minimal risk

### 9.2 Penalties

The AI Act imposes fines of up to 35 million EUR or 7% of global annual turnover
for violations of prohibited practices. For transparency violations (Article 50),
fines are up to 15 million EUR or 3% of turnover. These penalties apply to
high-risk systems and providers of general-purpose AI, not to minimal-risk AI
like Libern's.

## 10. Future-Proofing

### 10.1 Potential Reclassification

As the AI Act is implemented and interpreted, Libern's AI classification should
be re-evaluated if:

- New high-risk categories are added that include communication assistance
- The AI capabilities expand to include decision-making affecting legal rights
- The model size and capabilities increase significantly

### 10.2 Monitoring and Updates

The Libern team commits to:
- Monitoring AI Act developments and guidance
- Updating this document as regulations evolve
- Maintaining the minimal-risk profile of AI features
- Providing compliance documentation for deployers

## 11. AI Risk Management

### 11.1 Risk Identification

Libern's AI features present minimal risk, but identified risks include:

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Incorrect or misleading summaries | Low | Low | User can edit/reject; AI use is optional |
| Biased content moderation | Low | Low | Moderation is configurable; local training only |
| Privacy leak via AI context | None | N/A | All processing is local; no data transmitted |
| Model vulnerability to prompt injection | Low | Low | Model is specialized, not general-purpose |
| Dependency on model file integrity | Low | Medium | SHA-256 verification on download |

### 11.2 Human Oversight

Libern implements human oversight for all AI features:

- **Summarization:** AI suggests summaries; user accepts or rejects
- **Smart replies:** AI suggests replies; user selects or ignores
- **Content moderation:** AI flags content; human moderator reviews
- All AI features can be disabled entirely via settings

### 11.3 Accuracy and Robustness

Libern's AI model is tested for:
- **Relevance:** Summaries accurately reflect source content
- **Completeness:** No omission of critical information
- **Bias testing:** Model is evaluated for demographic fairness
- **Robustness:** Performance under different input conditions

## 12. Documentation Requirements

### 12.1 Technical Documentation

While not required for minimal-risk AI, Libern maintains documentation:

- Model architecture and training methodology
- Training data sources and filtering
- Performance benchmarks and limitations
- Security measures for model integrity
- Version history and changelog

### 12.2 Record Keeping

Libern users should maintain records of:
- Which AI features are enabled and why
- Any incidents involving AI output
- User feedback on AI performance
- Periodic reviews of AI feature usage

### 12.3 Transparency to End Users

Libern displays clear indicators when AI is active:
- Visual indicator in the UI when AI is processing
- Labels on AI-generated content (summaries, suggestions)
- Settings panel showing all AI features and their status
- Option to disable AI features individually

## 13. National Implementation Variations

### 13.1 EU Member State Variations

EU member states may implement the AI Act with national variations:

- **Germany:** Strong worker council involvement; Libern's AI transparency
  supports co-determination requirements
- **France:** CNIL guidance on AI; Libern's local processing aligns with CNIL
  recommendations for data minimization
- **Netherlands:** Active AI regulatory sandbox; Libern's compliance
  documentation supports sandbox participation
- **Ireland:** DPC is lead supervisory authority; minimal-risk AI has no
  registration requirement

### 13.2 International Equivalents

The EU AI Act is influencing global AI regulation:

- **UK:** Similar risk-based approach; Libern's classification would be similar
- **Canada:** Proposed AIDA (Artificial Intelligence and Data Act); aligns with
  risk-based framework
- **Brazil:** Proposed AI regulation; similar risk categories
- **Japan:** Soft-law approach to AI; Libern's transparency supports guidelines
- **US:** Sector-specific AI regulation; NIST AI Risk Management Framework

## 14. Frequently Asked Questions

### 14.1 Does Libern's AI fall under the AI Act's scope?

Yes, the AI Act applies to all AI systems placed on the EU market or used in
the EU. However, Libern's AI falls into the minimal-risk category, which has no
regulatory obligations beyond voluntary compliance measures.

### 14.2 What if the EU classifies Libern's AI as high-risk in the future?

Libern's development team will assess any reclassification and implement
necessary compliance measures. The open-source codebase and transparent
architecture facilitate rapid adaptation to regulatory changes.

### 14.3 Can I use Libern's AI for medical or legal advice?

No. Libern's AI is designed for communication assistance only. It should not
be used for medical, legal, financial, or other professional advice. The model
is not trained or validated for such purposes.

### 14.4 How do I disable AI features entirely?

Open Settings > AI and toggle "Enable AI Features" to off. This will use the
MockEngine fallback, which provides template-based responses without AI
processing.

### 14.5 Does Libern's AI learn from my conversations?

No. The AI model is static and pre-trained. Libern does not collect user
messages for training, does not fine-tune models based on usage, and does not
transmit any data to model developers.

## 15. Conclusion

Libern's local AI architecture makes EU AI Act compliance straightforward:

1. **Minimal risk classification:** The AI is auxiliary, optional, and local
2. **No training on user data:** All models are pre-trained on public data
3. **Full transparency:** Open source model, documented capabilities
4. **User control:** AI can be disabled entirely
5. **No high-risk applications:** The AI does not make decisions affecting
   fundamental rights

Organizations deploying Libern in the EU can use this document as part of their
AI Act compliance assessment. For most deployments, no further action is
required beyond the transparency measures already implemented in the software.

## 16. Appendix: AI Act Article Mapping

| Article | Topic | Libern Compliance |
|---------|-------|------------------|
| Art. 1-4 | Scope and definitions | Section 2 |
| Art. 5 | Prohibited practices | Section 2.1 |
| Art. 6 | Classification rules | Section 2.2 |
| Art. 8-15 | High-risk requirements | Section 2.3 (not applicable) |
| Art. 16-22 | Conformity assessment | Section 5.2 (not applicable) |
| Art. 50 | Transparency obligations | Section 3 |
| Art. 51 | GPAI classification | Section 4 |
| Art. 53 | GPAI obligations | Section 4.2 |
| Art. 59 | Regulatory sandboxes | Section 13 |
| Art. 99 | Penalties | Section 9 |

## 17. AI Act Compliance Checklist

### 17.1 Pre-Deployment

- [ ] Confirm AI risk classification (minimal risk)
- [ ] Document AI features and their purposes
- [ ] Configure AI transparency indicators in Libern
- [ ] Review model documentation (model card in Section 8.2)
- [ ] Train users on AI capabilities and limitations
- [ ] Establish AI usage policy for the organization

### 17.2 Ongoing Operations

- [ ] Monitor AI performance and accuracy (quarterly)
- [ ] Review user feedback on AI features (quarterly)
- [ ] Update AI documentation when models are updated
- [ ] Verify AI features can be disabled independently
- [ ] Conduct annual AI compliance review


## 19. AI Act Compliance Procedures — Expanded

### 19.1 Risk Classification Confirmation Process

```
Step 1: Identify all AI features in use
        ├─ Message summarization
        ├─ Smart reply suggestions
        ├─ Content moderation
        └─ Document RAG query
        ↓
Step 2: Classify each feature per AI Act Annex III
        ├─ Biometric identification? No
        ├─ Critical infrastructure? No
        ├─ Education/training? No
        ├─ Employment/workers? No
        ├─ Essential services? No
        ├─ Law enforcement? No
        ├─ Migration/borders? No
        └─ Administration of justice? No
        ↓
Step 3: Determine risk level
        All features → Minimal Risk (no regulatory obligations)
        ↓
Step 4: Document classification
        See Section 2.2 of this document
        ↓
Step 5: Implement voluntary transparency measures
        See Section 3
```

### 19.2 Model Accuracy Testing Protocol

```bash
# Test 1: Summarization accuracy
libern --ai-test-summarization --test-set test_data.json
# Expected: >85% factual accuracy

# Test 2: Moderation consistency
libern --ai-test-moderation --test-set moderation_samples.json
# Expected: >90% classification consistency

# Test 3: Response relevance
libern --ai-test-relevance --test-set query_samples.json
# Expected: >80% relevant responses
```

### 19.3 Real-World Scenario: EU Financial Institution

**Scenario:** A Frankfurt-based bank deploys Libern for internal communications and uses the local AI for meeting summarization and compliance monitoring.

**AI Act analysis:**
1. **Risk classification:** Minimal risk — AI is auxiliary, optional, and makes only suggestions
2. **GDPR interaction:** No training on user data; all processing local
3. **Transparency:** AI-generated content clearly labeled; users informed
4. **Human oversight:** All AI suggestions require human approval
5. **Documentation:** Model card maintained, performance tracked

**BaFin (German regulator) assessment:** No concerns raised. The local-only AI processing was noted as a privacy-enhancing design choice.

### 19.4 Model Transparency Card

```
┌─────────────────────────────────────────────────────────────┐
│              LIBERN AI MODEL TRANSPARENCY CARD               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Model Name:         Libern AI v1.0                          │
│  Architecture:       Transformer (Candle engine)             │
│  Parameters:         1.5B (Qwen 2.5 based)                  │
│  Quantization:       Q4_K_M (4-bit)                         │
│  Training Data:      Public corpus only (no user data)       │
│  Fine-tuning:        None on user data                       │
│  Inference:          100% local device                       │
│  Data Transmission:  Zero — no data leaves device            │
│  Temperature Range:  0.0 (moderation) — 1.0 (creative)      │
│  Context Window:     2048 tokens                             │
│  Languages:          Multi-language (base model)             │
│  Intended Use:       Communication assistance only           │
│  Prohibited Uses:    Medical, legal, financial advice        │
│  Known Biases:       As inherited from base model            │
│  Mitigations:        Moderation system + human review        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 20. GPAI Obligations Reference Table

| GPAI Obligation (Art. 53) | Libern Status | Rationale |
|--------------------------|--------------|-----------|
| Technical documentation | Voluntary compliance | Model card available |
| Training data transparency | Not applicable | No training, pre-trained model |
| Copyright policy | Not applicable | Open source model, permissive license |
| Energy consumption reporting | Voluntary | CPU-only inference: ~50W typical |
| Systemic risk assessment | Not required | Model < 10^25 FLOPs threshold |
| Cybersecurity measures | Implemented | Signed model files, verified download |
| Code of practice adherence | Voluntary evaluation | Open source contributions |


## 18. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-06-19 | Libern Team | Initial AI Act compliance document |

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
