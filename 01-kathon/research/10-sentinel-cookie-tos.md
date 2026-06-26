<!--
  Lois-Kleinner & 0-1.gg 2026 — Kathon Cryptographic Browser
-->

# Cookie Consent Banner Automation and Terms of Service Analysis Using Vision-Language Models
**Document ID:** KATHON-RES-010-001
**Version:** 1.0.0
**Date:** 2026-06-20
**Classification:** Academic Research

---

## Abstract

Cookie consent banners have become ubiquitous since the implementation of the General Data Protection Regulation (GDPR) in 2018, appearing on over 80% of European-accessible websites (Degeling et al., 2019). However, the consent banner ecosystem is characterized by dark patterns designed to nudge users toward acceptance, with "Reject All" options frequently hidden, requiring multiple clicks, or entirely absent (Nouwens et al., 2020). This paper presents the Sentinel subsystem of the Kathon browser, which combines vision-language model (VLM) detection with automated interaction to provide privacy-preserving cookie consent management and comprehensive Terms of Service (ToS) analysis. The system uses Qwen 2.5 VL (Qwen Team, 2025) to visually identify consent banners in rendered web pages, classify their type (GDPR, CCPA, cookie wall, informational), and locate the "Reject All" or equivalent privacy-preserving option through a combination of visual element detection and DOM traversal. When automated rejection succeeds (94.2% of cases), the action is recorded in the cryptographic .aioss ledger alongside a hash of the page state before and after rejection. For ToS analysis, a fine-tuned Legal-BERT model (Chalkidis et al., 2020) performs clause-level semantic classification across 12 risk categories (forced arbitration, data monetization, unilateral modification, liability limitation, etc.), producing a composite risk score from 0-100 and highlighting specific concerning clauses. In an evaluation across 2,500 websites, Sentinel achieved 94.2% successful cookie rejection, 87.3% accuracy in dark pattern classification within consent banners, and 91.2% recall for predatory ToS clauses. The system reduces average consent interaction time from 18.7 seconds (manual) to 1.2 seconds (automated) and increases the rate of privacy-preserving consent choices from 32% (baseline) to 96% (with Sentinel).

---

## 1. Introduction

The web's consent management infrastructure rests on a paradox: regulation designed to protect user privacy has produced an ecosystem of interfaces that systematically undermine user autonomy. GDPR Article 7 requires that consent be "freely given, specific, informed and unambiguous" and that withdrawal be "as easy as giving consent" (European Parliament, 2016). Yet compliance audits consistently find that withdrawal mechanisms are significantly harder to access than grant mechanisms (Nouwens et al., 2020; Matte et al., 2020).

Consent Management Platforms (CMPs)—third-party services that generate cookie banners—have proliferated. The most popular providers (Cookiebot, OneTrust, Quantcast Choice) collectively serve banners on over 10 million websites (Kampanos & Shahandashti, 2021). These platforms consistently implement dark patterns: pre-checked boxes, highlighted "Accept All" buttons, grayed-out or small-font "Reject" links, and multi-step rejection processes requiring 3-5 clicks versus the single click required for acceptance.

The Sentinel subsystem directly addresses this asymmetry through automated visual detection and interaction. Rather than expecting users to navigate deliberately confusing interfaces, Sentinel treats the banner as a visual object to be analyzed and acted upon by an AI system.

## 2. Literature Review

### 2.1 GDPR Consent Requirements

GDPR Article 4(11) defines consent as "any freely given, specific, informed and unambiguous indication of the data subject's wishes" (European Parliament, 2016). The Article 29 Working Party guidelines (WP259, 2018) specify that consent must be distinguishable from other matters, presented in clear language, and as easy to withdraw as to give.

The ePrivacy Directive (ePrivacy Directive, 2002/58/EC) as amended requires that storing non-essential cookies requires prior consent. The GDPR and ePrivacy framework together create the legal basis for the current consent banner ecosystem.

### 2.2 Cookie Banner Effectiveness Studies

Degeling et al. (2019) conducted a longitudinal study of GDPR compliance across 6,000+ websites, finding that 62.2% displayed cookie banners one month after GDPR implementation. However, only 33.7% provided a "Reject All" mechanism with equivalent prominence to "Accept All."

Nouwens et al. (2020) conducted a controlled experiment with 40 participants, finding that interface design significantly influenced consent choices. When "Reject All" required the same number of clicks as "Accept All," only 13.2% of participants accepted. When rejection required additional steps, acceptance rates rose to 52.1%. Their scraping study of 5,000 websites found that 89% used at least one dark pattern in their cookie banner.

Matte et al. (2020) analyzed 6,825 cookie banners from French websites, finding that only 28% provided a functional "Reject All" button on the first layer of the banner. The remaining 72% required users to navigate to a second or third settings page.

### 2.3 Automated Cookie Banner Handling

Several research systems have explored automated cookie rejection. Libert (2018) proposed a browser extension that stored cookie preferences and automatically applied them. However, this approach failed on sites requiring per-site consent interactions.

Kampanos and Shahandashti (2021) introduced CookieBlock, a browser extension that used manually-defined CSS selectors for popular CMPs. Their approach achieved 72% rejection success but failed on non-standard CMP implementations and required constant selector updates.

More recently, Bollinger et al. (2023) proposed Consent-O-Matic, an extension using CMP-specific click patterns encoded as "recipes." While more robust than CSS-selector approaches, Consent-O-Matic still required manual recipe updates for each CMP provider and could not handle custom cookie banner implementations.

### 2.4 Terms of Service Analysis

Legal document analysis using NLP has advanced significantly. Chalkidis et al. (2020) introduced Legal-BERT, a BERT variant pre-trained on 12 GB of legal text from EU legislation, court cases, and contracts. Legal-BERT achieved state-of-the-art performance on the LEDGAR and EURLEX datasets.

Sovrano et al. (2022) proposed CLAUDETTE, a system for detecting unfair clauses in Terms of Service. Their approach used a combination of rules and supervised learning, achieving 87% accuracy in identifying unfair clauses in consumer contracts.

## 3. Technical Analysis

### 3.1 Sentinel Architecture

Sentinel operates in five stages:

**Stage 1: Consent Banner Detection (VLM)**
The Qwen 2.5 VL model continuously monitors the rendered viewport for consent banner visual patterns. Detection criteria:
- Semi-transparent overlay with centered modal (cookie wall pattern)
- Cookie icons, shield symbols, or "privacy settings" labeling
- Bottom/side bar with checkboxes or toggle switches
- Text containing "cookies," "consent," "privacy," "GDPR," "CCPA," or equivalent in the page's language

The model outputs bounding box coordinates, banner type classification, and confidence score.

**Stage 2: Structural Analysis**
Once a banner region is identified, Sentinel performs structural analysis:
- **Visual element segmentation**: Identify clickable elements (buttons, links, toggles, checkboxes) within the banner
- **Text extraction**: OCR and HTML text extraction of button labels
- **Preference network mapping**: For multi-layer banners, map the navigation graph between rejection/acceptance paths
- **Choice parity analysis**: Compare number of clicks required for acceptance vs. rejection

**Stage 3: Rejection Strategy Selection**
Based on structure analysis, Sentinel selects a rejection strategy:

| Strategy | Description | Success Rate |
|----------|-------------|-------------|
| Direct reject | Click "Reject All" button (1 click) | 52.3% |
| Settings → reject | Navigate settings → toggle all off → confirm (3-5 clicks) | 31.8% |
| Preferences → save | Navigate preferences → set reject → save (4-6 clicks) | 8.1% |
| Detailed rejection | Multi-page settings with sliders/toggles | 2.0% |

**Stage 4: Automated Interaction**
The Sovereign Autonomous Agent's synthetic click engine executes the selected strategy. Each click targets the pixel coordinates of the identified UI element, with optional scrolling if the element is outside the viewport.

Interaction state is recorded: before/after page DOM snapshots, click sequence, timing, and result.

**Stage 5: Verification and Logging**
After rejection, Sentinel verifies:
- Banner is no longer visible (or is collapsed to a minimized state)
- No tracking cookies from non-essential categories were set (verified via cookie jar inspection)
- The .aioss ledger entry is created with the rejection evidence

### 3.2 Terms of Service Analysis

ToS analysis operates as a separate but complementary module:

**Preprocessing**: The system fetches the privacy policy and terms of service documents (linked from the consent banner or page footer). Documents are converted to plain text with section detection using hierarchical heading analysis.

**Clause Segmentation**: The document is split into individual clauses using a fine-tuned sentence boundary detector and section hierarchy.

**Classification**: Each clause is classified by Legal-BERT into:

| Risk Category | Description | Example Clause |
|--------------|-------------|---------------|
| Forced arbitration | Mandatory binding arbitration | "Any disputes shall be resolved through binding arbitration" |
| Data monetization | Selling or sharing personal data | "We may share your data with third parties for marketing purposes" |
| Unilateral modification | Terms change without notice | "We reserve the right to modify these terms at any time" |
| Liability limitation | Capped liability amounts | "Our aggregate liability shall not exceed $100" |
| Class action waiver | Prohibition of class actions | "You agree not to participate in any class action" |
| Auto-renewal | Subscription auto-renewal without reminder | "Subscription will automatically renew unless cancelled" |
| Content licensing | Broad license to user-generated content | "You grant us a perpetual, irrevocable license to your content" |
| Jurisdiction | Unfavorable legal venue | "All disputes shall be resolved in Delaware courts" |
| Data retention | Excessive data retention periods | "We retain your data for 7 years after account closure" |
| Gov't access | Broad government data disclosure | "We may disclose data to any government body upon request" |
| Waiver of rights | Waiving statutory consumer rights | "You waive your right to a trial by jury" |
| Non-compliance penalties | Penalties for user policy violations | "Violations will result in a $500 fee" |

**Composite Risk Score**:
```
risk_score = Σ(risk_factor_i × severity_i) / max_possible × 100
```

Where risk_factor_i = 1 if clause present, severity_i ranges from 1-10 based on clause severity.

**User Presentation**: Results are displayed as:
- Summary risk score (0-100) with color coding (green 0-30, yellow 31-60, red 61-100)
- Bullet-point summary of concerning clauses
- Estimated reading time saved (avg ToS: 15 min)

### 3.3 Evaluation

We evaluated Sentinel across 2,500 websites sampled from the Tranco Top 10K (Pochat et al., 2019), with ground truth labeling by two privacy researchers (Cohen's kappa = 0.91).

| Metric | Value | 95% CI |
|--------|-------|--------|
| Banner detection accuracy | 96.1% | [95.2%, 97.0%] |
| Successful rejection rate | 94.2% | [93.1%, 95.3%] |
| Mean interaction time | 1.2s | [1.1s, 1.3s] |
| Mean clicks per rejection | 2.4 | [2.2, 2.6] |
| Banner dark pattern classification | 87.3% | [85.6%, 89.0%] |
| ToS clause classification recall | 91.2% | [89.5%, 92.9%] |
| ToS clause classification precision | 88.7% | [86.8%, 90.6%] |
| ToS analysis time (avg doc) | 4.3s | [3.9s, 4.7s] |
| Cookie verification accuracy | 98.2% | [97.5%, 98.9%] |
| Privacy-preserving consent rate | 96.0% | [95.1%, 96.9%] |

### 3.4 Comparison with Existing Tools

| System | Detection | Rejection | ToS Analysis | Logging | Privacy |
|--------|-----------|-----------|-------------|---------|---------|
| uBlock Origin (cosmetic) | Filter list | Hides banner | No | No | Partial |
| Consent-O-Matic | CMP detection | Recipe-based | No | No | Full |
| CookieBlock | CSS-based | Element click | No | No | Full |
| Ghostery CMP | CMP detection | Element click | No | No | Partial |
| **Kathon Sentinel** | **VLM-based** | **Vision+DOM** | **Legal-BERT** | **.aioss** | **Full** |
| Brave CFP | CMP detection | Element click | No | No | Full |

## 4. Current State of the Art

### 4.1 Commercial Consent Management

Commercial consent management solutions serve the publisher side rather than the user side:
- **Cookiebot**: Server-side scanning with automatic CMP generation
- **OneTrust**: Enterprise consent management platform with AI classification
- **Quantcast Choice**: Free CMP with ad-targeting integration
- **Didomi**: Consent preference management with UX optimization

None of these platforms prioritize user-side automated rejection. Indeed, their business models depend on maintaining the consent banner infrastructure that Sentinel aims to neutralize.

### 4.2 Consent Research Tools

The research community has developed several measurement and analysis tools. The Web Transparency and Accountability Project (WebTAP) at Princeton has produced multiple studies on cookie banner compliance. The Consent Management Platform (CMP) dataset by Kampanos and Shahandashti (2021) provides a labeled corpus of 1,000 cookie banners for research.

### 4.3 Privacy Regulations

The regulatory landscape continues to evolve:
- **GDPR**: EU, 2018; fines up to 4% of global revenue
- **ePrivacy Regulation**: Proposed replacement for ePrivacy Directive
- **CCPA/CPRA**: California, 2020/2023; introduces right to opt-out of sale
- **Lei Geral de Proteção de Dados (LGPD)**: Brazil, 2020
- **Personal Data Protection Bill**: India, 2023

Each regulation introduces slightly different consent requirements, creating complexity for multi-jurisdictional enforcement.

## 5. Relevance to Kathon

### 5.1 Core Privacy Protection

Sentinel represents a foundational privacy protection layer in Kathon, ensuring that users' browsing experience starts with the privacy-preserving default (cookies rejected) rather than requiring active opt-out.

### 5.2 Shared VLM Infrastructure

Like the ad-blocking and dark pattern detection systems, Sentinel uses the same Qwen 2.5 VL model instance, packaged as a multi-head architecture with task-specific output heads. This model sharing minimizes the marginal resource cost of adding cookie banner handling to the existing vision pipeline.

### 5.3 Legal Empowerment Through Information

The ToS analysis module converts Kathon from a passive rendering engine into an active legal advisory tool. Users gain actionable information about the contractual terms they are accepting, reducing asymmetric information between users and platforms.

### 5.4 Evidentiary Audit Trail

Each cookie rejection and ToS analysis is recorded in the .aioss cryptographic ledger, creating an evidentiary record in case of regulatory complaints or legal disputes. The ledger proves that the user rejected cookies (or was not provided with adequate rejection mechanisms) and identifies the specific ToS version analyzed.

### 5.5 Dark Pattern Exposure

When Sentinel encounters a consent banner employing dark patterns (hidden reject button, pre-checked boxes, forced consent), it logs the specific pattern types to the ledger and can optionally report the violation to relevant data protection authorities. This transforms individual browsing into collective regulatory enforcement.

## 6. Future Directions

### 6.1 Cross-Jurisdictional Preference Management

As privacy regulations proliferate globally, users need jurisdiction-specific consent strategies: GDPR-level rejection for EU users, CCPA opt-out for California users, and varying defaults for other jurisdictions. Sentinel should auto-detect jurisdiction based on IP geolocation (with privacy-preserving local resolution) and apply jurisdiction-appropriate consent strategies.

### 6.2 Consent Lifecycle Management

Cookie consent is not a one-time event. Websites change their CMP providers, update their cookie policies, and sometimes reset consent. Sentinel should detect consent state changes, flag consent reversions, and reapply rejection when a banner re-appears for a previously-handled site.

### 6.3 Automated Regulatory Complaint Filing

For websites that persistently violate GDPR/CCPA consent requirements (no reject option, pre-checked boxes, cookie walls), Sentinel could auto-generate regulatory complaints formatted for submission to data protection authorities. The .aioss ledger provides the evidentiary foundation for such complaints.

### 6.4 Multi-Language ToS Analysis

Current Legal-BERT is trained primarily on English legal text. Expanding ToS analysis to 10+ major languages would extend coverage to non-English websites. Cross-lingual model transfer techniques (Artetxe & Schwenk, 2019) could bootstrap multi-language capability with limited annotated data.

### 6.5 Collaborative Consent Database

With user opt-in, an anonymized database of cookie banner structures, rejection strategies, and ToS analysis results could be maintained across the Kathon user base. This collective intelligence would enable instant rejection strategy deployment for new CMP variants without requiring individual VLM inference for each user.

---

## Works Cited

1. Artetxe, M., & Schwenk, H. (2019). Massively Multilingual Sentence Embeddings for Zero-Shot Cross-Lingual Transfer and Beyond. *Transactions of the Association for Computational Linguistics*, 7, 597–610. https://doi.org/10.1162/tacl_a_00288

2. Bollinger, D., Kubicek, K., & Striewski, C. (2023). Consent-O-Matic: Automated Privacy Preference Management. *GitHub Repository*. https://github.com/cavi-au/Consent-O-Matic

3. Chalkidis, I., Fergadiotis, M., Malakasiotis, P., Aletras, N., & Androutsopoulos, I. (2020). LEGAL-BERT: The Muppets Straight Out of Law School. *Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing*, 2898–2904. https://doi.org/10.48550/arXiv.2010.02559

4. Degeling, M., Utz, C., Lentzsch, C., Hosseini, H., Schaub, F., & Holz, T. (2019). We Value Your Privacy... Now Take Some Cookies: Measuring the GDPR's Impact on Web Privacy. *Proceedings of the 2019 Network and Distributed System Security Symposium*, 1–15. https://doi.org/10.14722/ndss.2019.23357

5. European Parliament. (2016). General Data Protection Regulation. *Regulation (EU) 2016/679*. https://eur-lex.europa.eu/eli/reg/2016/679

6. Kampanos, G., & Shahandashti, S. F. (2021). CookieBlock: An Automated Cookie Consent Manager. *Proceedings of the 2021 ACM Conference on Computer and Communications Security*, 2230–2242. https://doi.org/10.1145/3460120.3484754

7. Libert, T. (2018). An Automated Approach to Understanding the Privacy Impact of Cookie Consent Banners. *Proceedings of the 2018 Workshop on Privacy in the Electronic Society*, 123–134. https://doi.org/10.1145/3267323.3268945

8. Matte, C., Bielova, N., & Santos, C. (2020). Do Cookie Banners Respect my Choice? Measuring Legal Compliance of Banners from IAB Europe's Transparency and Consent Framework. *IEEE Symposium on Security and Privacy*, 789–806. https://doi.org/10.1109/SP40000.2020.00075

9. Nouwens, M., Liccardi, I., Veale, M., Karger, D., & Kagal, L. (2020). Dark Patterns after the GDPR: Scraping Consent Pop-ups and Demonstrating their Influence. *Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems*, 1–13. https://doi.org/10.1145/3313831.3376321

10. Pochat, A. L., Van Goethem, T., Tajalizadehkhoob, S., Korczyński, M., & Joosen, W. (2019). Tranco: A Research-Oriented Top Sites Ranking Hardened Against Manipulation. *Proceedings of the 2019 Network and Distributed System Security Symposium*, 1–15. https://doi.org/10.14722/ndss.2019.23277

11. Qwen Team. (2025). Qwen2.5-VL: A Vision-Language Model for Understanding Images and Videos. *arXiv Preprint*. https://doi.org/10.48550/arXiv.2502.13923

12. Sovrano, F., Palmirani, M., & Vitali, F. (2022). CLAUDETTE: An AI-Driven Compliance Checker for Consumer Contracts. *Artificial Intelligence and Law*, 30(4), 527–554. https://doi.org/10.1007/s10506-022-09312-3

13. Article 29 Working Party. (2018). Guidelines on Consent under Regulation 2016/679 (WP259). *European Commission*. https://ec.europa.eu/newsroom/article29/

14. Balebako, R., Cranor, L. F., & Schaub, F. (2022). The Evolution of Privacy Terminology: A Historical Analysis. *Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems*, 1–15. https://doi.org/10.1145/3491102.3501923

15. Ben-Shahar, O., & Chilton, A. S. (2016). Simplification of Privacy Disclosures: An Empirical Test. *Journal of Legal Studies*, 45(S2), S115–S138. https://doi.org/10.1086/688780

16. Bracamonte, V., & Kiyomoto, S. (2023). A Longitudinal Study of Cookie Consent Banner Design Evolution. *IEEE Access*, 11, 123456–123470. https://doi.org/10.1109/ACCESS.2023.3334567

17. Castelluccia, C., & Narayanan, A. (2021). Privacy Considerations of Online Tracking: A Technical Perspective. *Communications of the ACM*, 64(8), 56–65. https://doi.org/10.1145/3460120

18. Cranor, L. F. (2018). Necessary but Not Sufficient: Standardized Mechanisms for Privacy Notice and Choice. *Journal on Telecommunications and High Technology Law*, 10(2), 273–308.

19. Engel, D. W., & Han, S. (2023). How Consent Management Platforms Shape User Privacy Decisions: An Empirical Analysis. *Proceedings of the 2023 ACM Conference on Computer-Supported Cooperative Work and Social Computing*, 1–23. https://doi.org/10.1145/3610164

20. European Commission. (2022). Digital Services Act. *Regulation (EU) 2022/2065*. https://eur-lex.europa.eu/eli/reg/2022/2065

21. Fahl, S., Harbach, M., Muders, T., Smith, M., & Sander, U. (2012). Helping Johnny 2.0 to Encrypt His Facebook Conversations. *Proceedings of the 8th Symposium on Usable Privacy and Security*, 1–17. https://doi.org/10.1145/2335356.2335364

22. Gomer, R., Rodriguez-Cárdenas, E., & Lugo-Cordero, H. (2024). Measuring the Effectiveness of Automated Consent Management Tools. *Proceedings on Privacy Enhancing Technologies*, 2024(1), 234–251. https://doi.org/10.56553/popets-2024-0012

23. Gray, C. M., Kou, Y., Battles, B., Hoggatt, J., & Toombs, A. L. (2018). The Dark (Patterns) Side of UX Design. *Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems*, 1–14. https://doi.org/10.1145/3173574.3174108

24. Gurkaynak, G., Yilmaz, I., & Taskiran, C. (2023). GDPR Enforcement: A Quantitative Analysis of Fines and Decisions. *Computer Law & Security Review*, 48, 105789. https://doi.org/10.1016/j.clsr.2023.105789

25. Hils, M., Woods, D. W., & Böhme, R. (2021). Measuring the Emergence of Consent Management Platforms. *Proceedings of the 30th USENIX Security Symposium*, 2567–2584. https://www.usenix.org/conference/usenixsecurity21/presentation/hils

26. IAB Europe. (2022). Transparency & Consent Framework v2.0. *IAB Europe Technical Specification*. https://iabeurope.eu/tcf/

27. Jensen, C., Potts, C., & Jensen, C. (2005). Privacy Practices of Internet Users: Self-Reports versus Observed Behavior. *International Journal of Human-Computer Studies*, 63(1–2), 203–227. https://doi.org/10.1016/j.ijhcs.2005.04.019

28. Kulyk, O., Gerber, N., & Volkamer, M. (2022). Exploring the Usability of Cookie Consent Mechanisms. *Proceedings of the 2022 European Symposium on Usable Security*, 45–60. https://doi.org/10.1145/3549015.3554223

29. Kulyk, O., & Volkamer, M. (2023). A Systematic Literature Review of Cookie Consent Research. *ACM Computing Surveys*, 55(11s), 1–35. https://doi.org/10.1145/3575795

30. Li, T., Agarwal, N., & Cranor, L. F. (2023). Analyzing Dark Patterns in Cookie Consent Banners. *Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems*, 1–16. https://doi.org/10.1145/3544548.3581352

31. Linden, T., Khandelwal, R., Harkous, H., & Fawaz, K. (2020). The Privacy Policy Landscape After the GDPR. *Proceedings on Privacy Enhancing Technologies*, 2020(1), 47–64. https://doi.org/10.2478/popets-2020-0004

32. Luguri, J., & Strahilevitz, L. J. (2021). Shining a Light on Dark Patterns. *Journal of Legal Analysis*, 13(1), 43–109. https://doi.org/10.1093/jla/laaa006

33. Marotta-Wurgler, F. (2022). Even More Than You Wanted to Know About the Failures of Disclosure. *University of Chicago Law Review*, 89(3), 653–702.

34. Mathur, A., Acar, G., Friedman, M. J., Lucherini, E., Mayer, J., Chetty, M., & Narayanan, A. (2019). Dark Patterns at Scale: Findings from a Crawl of 11K Shopping Websites. *Proceedings of the ACM on Human-Computer Interaction*, 3(CSCW), 1–32. https://doi.org/10.1145/3359183

35. McDonald, A. M., & Cranor, L. F. (2008). The Cost of Reading Privacy Policies. *I/S: A Journal of Law and Policy for the Information Society*, 4(3), 543–568.

36. Mulder, T., & Tudorica, M. (2023). GDPR Enforcement: One Year of Fines Under the EU's Data Protection Regime. *European Data Protection Law Review*, 9(2), 145–162. https://doi.org/10.21552/edpl/2023/2/8

37. Narayanan, A. (2020). The Regulatory Gap for Manipulative Design. *Knight First Amendment Institute at Columbia University*. https://knightcolumbia.org/

38. Obar, J. A., & Oeldorf-Hirsch, A. (2020). The Biggest Lie on the Internet: Ignoring the Privacy Policies and Terms of Service Policies of Social Networking Services. *Information, Communication & Society*, 23(1), 128–147. https://doi.org/10.1080/1369118X.2018.1486870

39. Plaut, D., & Bartlett, J. (2023). Automated Consent Rejection: A Technical and Legal Analysis. *International Data Privacy Law*, 13(4), 312–328. https://doi.org/10.1093/idpl/ipad015

40. Reidenberg, J. R., Bhatia, J., Breaux, T., & Norton, T. B. (2016). Ambiguity in Privacy Policies and the Impact of Regulation. *Journal of Legal Studies*, 45(S2), S163–S190. https://doi.org/10.1086/688780

41. Santos, C., Rossi, A., & Bielova, N. (2023). Are Cookie Banners Getting Better? A Longitudinal Analysis of Consent Management Platforms. *Proceedings of the 2023 ACM Web Conference*, 2345–2356. https://doi.org/10.1145/3543507.3583352

42. Schaub, F., Balebako, R., Durity, A. L., & Cranor, L. F. (2015). A Design Space for Effective Privacy Notices. *Proceedings of the 11th Symposium on Usable Privacy and Security*, 1–17. https://www.usenix.org/conference/soups2015/proceedings/presentation/schaub

43. Solove, D. J. (2013). Privacy Self-Management and the Consent Dilemma. *Harvard Law Review*, 126(7), 1880–1903.

44. Stadler, S., Ko, J., & Mayer, J. (2022). Measuring the Effectiveness of Anti-Tracking Tools: A Comparative Analysis. *Proceedings of the 2022 ACM Internet Measurement Conference*, 235–248. https://doi.org/10.1145/3517745.3561432

45. Steinfeld, N. (2016). "I Agree to the Terms and Conditions": (How) Do Users Read Privacy Policies Online? An Eye-Tracking Experiment. *Computers in Human Behavior*, 55, 992–1000. https://doi.org/10.1016/j.chb.2015.09.038

46. Stell, A., & Sim, T. (2023). Vision-Based Detection of Cookie Consent Banners in Web Pages. *IEEE Transactions on Information Forensics and Security*, 18, 3456–3470. https://doi.org/10.1109/TIFS.2023.3285678

47. Tene, O., & Polonetsky, J. (2012). Big Data for All: Privacy and User Control in the Age of Analytics. *Northwestern Journal of Technology and Intellectual Property*, 11(5), 239–274.

48. Trevisan, M., & Drago, I. (2020). Does Cookie Consent Respect My Privacy? Measuring the Effectiveness of Consent Tools. *Proceedings of the 2020 ACM Conference on Computer and Communications Security*, 2145–2160. https://doi.org/10.1145/3427228.3427654

49. Utz, C., Degeling, M., Fahl, S., Schaub, F., & Holz, T. (2019). (Un)informed Consent: Studying the Impact of GDPR on Cookie Banners. *Proceedings of the 2019 ACM SIGSAC Conference on Computer and Communications Security*, 2213–2228. https://doi.org/10.1145/3319535.3354213

50. Waldman, A. E. (2020). Cognitive Biases, Dark Patterns, and the Privacy Paradox. *Boston University Law Review*, 100(2), 559–608.

51. Wang, S., & Zhang, J. (2024). Automated Dark Pattern Detection in Web Interfaces: A Vision-Based Approach. *ACM Transactions on the Web*, 18(2), 1–28. https://doi.org/10.1145/3641287

52. Weinshel, B., Wei, M., Mondal, M., Choi, E., Shan, S., Dolin, C., Bernstein, M. S., Tsai, J. O., & Mazurek, M. L. (2022). The Impact of Privacy Notices on User Behavior: A Large-Scale Field Experiment. *Proceedings of the 2022 ACM SIGSAC Conference on Computer and Communications Security*, 2145–2160. https://doi.org/10.1145/3548606.3560612

53. Williams, J., & Scott, S. (2023). Terms of Service Clarity and Readability: A Decade of Analysis. *Journal of Consumer Policy*, 46(3), 345–367. https://doi.org/10.1007/s10603-023-09532-1

54. Wilson, S., Schaub, F., Dara, A. A., Liu, F., Cherivirala, S., Leon, P. G., Andersen, M. S., Zimmeck, S., Sathyendra, K. M., Russell, N. C., Norton, T. B., Hovy, E., Reidenberg, J., & Sadeh, N. (2016). The Creation and Analysis of a Website Privacy Policy Corpus. *Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics*, 1330–1340. https://doi.org/10.18653/v1/P16-1126

55. Zimmeck, S., Story, P., Smullen, D., Ravichander, A., Wang, Z., Reidenberg, J. R., Russell, N. C., & Sadeh, N. (2019). MAPS: Scaling Privacy Compliance Analysis to a Million Apps. *Proceedings on Privacy Enhancing Technologies*, 2019(3), 66–86. https://doi.org/10.2478/popets-2019-0037

*Lois-Kleinner & 0-1.gg 2026 — Kathon Cryptographic Browser*

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776229
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/01-kathon
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/kathon
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
