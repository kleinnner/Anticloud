<!--
KASTERAN* — The Last Programming Language
© Lois-Kleinner & 0-1.gg 2026. All rights reserved.

 ▄▄   ▄▄▄                                           ▄     
 ██  ██▀                         ██              ▄▄ █ ▄▄  
 ██▄██      ▄█████▄  ▄▄█████▄  ███████    ▄████▄    ██▄████   ▄█████▄  ██▄████▄   █████   
 █████      ▀ ▄▄▄██  ██▄▄▄▄ ▀    ██      ██▄▄▄▄██   ██▀       ▀ ▄▄▄██  ██▀   ██  ▀▀ █ ▀▀  
 ██  ██▄   ▄██▀▀▀██   ▀▀▀▀██▄    ██      ██▀▀▀▀▀▀   ██       ▄██▀▀▀██  ██    ██     ▀     
 ██   ██▄  ██▄▄▄███  █▄▄▄▄▄██    ██▄▄▄   ▀██▄▄▄▄█   ██       ██▄▄▄███  ██    ██           
 ▀▀    ▀▀   ▀▀▀▀ ▀▀   ▀▀▀▀▀▀      ▀▀▀▀     ▀▀▀▀▀    ▀▀        ▀▀▀▀ ▀▀  ▀▀    ▀▀           
-->

# Kasteran* — WCAG 2.2 Compliance
© Lois-Kleinner & 0-1.gg 2026

## Overview

The Web Content Accessibility Guidelines (WCAG) 2.2 provide a global standard for digital accessibility. While Kasteran* is primarily a programming language, it supports the development of accessible web applications through its WASM backend and framework features. This document covers how Kasteran* helps developers achieve WCAG 2.2 compliance.

## The Four Principles (POUR)

WCAG is organized around four principles: Perceivable, Operable, Understandable, and Robust.

### Perceivable

Information and user interface components must be presentable to users in ways they can perceive.

**Text Alternatives**: Kasteran* encourages semantic markup through its component model. The compiler can warn when non-text content lacks text alternatives. Image components require alt text at the type level.

**Time-Based Media**: Kasteran* provides built-in media components that support captions, audio descriptions, and sign language interpretation. Developers can specify these as required fields in their media components.

**Adaptable**: The WASM backend produces semantically structured content that maintains meaning when presented in different ways. The type system enforces proper heading hierarchies and semantic landmarks.

**Distinguishable**: Kasteran* supports high-contrast mode detection, color scheme preferences, and text spacing requirements. The compiler can verify color contrast ratios against WCAG AA and AAA thresholds.

### Operable

User interface components and navigation must be operable.

**Keyboard Accessible**: Kasteran* web applications support full keyboard navigation by default. The framework enforces logical tab order, visible focus indicators, and keyboard event handling. The compiler can warn about missing keyboard handlers for interactive elements.

**Enough Time**: Kasteran* provides time-limit configuration that respects user preferences. Users can adjust, extend, or disable time limits. The runtime supports saving progress automatically.

**Seizures and Physical Reactions**: The animation system respects prefers-reduced-motion settings. Animations can be paused, stopped, or hidden. The compiler can detect animation frequency and warn about risks of photosensitive seizures.

**Navigable**: Kasteran* provides built-in navigation components:

- Skip links are automatically generated
- Page titles are required by the component model
- Focus order follows document order by default
- Link purpose can be determined from the link text alone
- Multiple navigation methods are supported
- Headings and labels describe topic or purpose
- Focus indicators are visible and meet contrast requirements

**Input Modalities**: Kasteran* supports various input methods:

- Pointer gestures are not required for functionality
- Motion actuation is not required (operations work without device motion)
- Target size meets minimum dimensions
- Pointer cancelation is supported

### Understandable

Information and the operation of the user interface must be understandable.

**Readable**: Kasteran* components support language declarations at the document and element level. Unusual words, abbreviations, and reading level can be annotated.

**Predictable**: Web pages and applications built with Kasteran* behave predictably:

- Focus does not change context unexpectedly
- Input controls do not cause automatic context changes
- Navigation is consistent across pages
- Components are identified consistently

**Input Assistance**: Kasteran* provides form validation and error handling:

- Error descriptions are provided in text
- Input suggestions are available
- Error prevention for legal, financial, and data-critical operations
- Help and documentation are accessible

### Robust

Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

**Compatible**: Kasteran* WASM output produces valid, semantic HTML. The framework supports ARIA roles, states, and properties. Custom components can define ARIA attributes at the type level. The compiler validates ARIA usage against the WAI-ARIA specification.

**Accessibility API**: The runtime provides proper accessibility tree information through the browser's accessibility API. Custom components are required to expose appropriate accessibility information.

## Compliance Levels

WCAG defines three compliance levels:

### Level A (Minimum)
Kasteran* enforces Level A compliance by default. The compiler will error on any violation of Level A success criteria.

### Level AA (Target)
Kasteran* recommends Level AA as the target compliance level. The framework provides components that meet AA requirements by default. Warnings are generated for AA violations during development.

### Level AAA (Advanced)
Kasteran* supports Level AAA compliance through additional component configurations and validation rules. The compiler can be configured to enforce AAA requirements.

## Testing and Validation

Kasteran* provides automated accessibility testing:

- **Static analysis**: The compiler checks for accessibility issues during compilation
- **Runtime checks**: Accessibility monitoring in development mode
- **Integration testing**: Automated WCAG audit in the CI pipeline
- **Screen reader testing**: Integration with screen reader testing tools

## Conclusion

Kasteran* helps developers build accessible web applications by embedding WCAG 2.2 compliance into the language and framework. The compiler provides early feedback on accessibility issues, reducing the cost of compliance.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com