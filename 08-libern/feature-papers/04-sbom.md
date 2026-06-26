__                     ¦¦               __                                    
¦¦                     ¯¯               ¦¦                                    
¦¦            ___¦   ¦¦¦¦     ¦___      ¦¦_¦¦¦_    _¦¦¦¦_    ¦¦_¦¦¦¦  ¦¦_¦¦¦¦_
¦¦        __¦¯¯¯       ¦¦       ¯¯¯¦__  ¦¦¯  ¯¦¦  ¦¦____¦¦   ¦¦¯      ¦¦¯   ¦¦
¦¦        ¯¯¦___       ¦¦       ___¦¯¯  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯   ¦¦       ¦¦    ¦¦
¦¦______      ¯¯¯¦  ___¦¦___  ¦¯¯¯      ¦¦¦__¦¦¯  ¯¦¦____¦   ¦¦       ¦¦    ¦¦
¯¯¯¯¯¯¯¯            ¯¯¯¯¯¯¯¯            ¯¯ ¯¯¯      ¯¯¯¯¯    ¯¯       ¯¯    ¯¯

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: Feature Paper
Document ID: PAP-004
Last Updated: 2026-06-19

----------------------------------------------------------------

# Software Bill of Materials (SBOM)

## Document Meta

| Field | Value |
|-------|-------|
| Paper ID | PAP-004 |
| Title | Software Bill of Materials |
| Status | Draft |
| Author | Libern Engineering Team |
| Date | 2026-06-19 |

---

## 1. Executive Summary

This Software Bill of Materials documents the complete dependency tree for Libern v0.1.0. It covers Rust crates for the backend, npm packages for the frontend, system libraries required at runtime, and bundled binaries. Each dependency is listed with its version, license, purpose, and security status. This SBOM is essential for vulnerability management, license compliance audits, and supply chain security reviews.

The SBOM is organized into sections by dependency category, with each section providing the dependency name, version, license type, and the specific purpose it serves in the Libern application. Transitive dependencies are listed separately where they have distinct license or security considerations.

---

## 2. SBOM Overview

The project has approximately 45 direct Rust crate dependencies and approximately 30 direct npm package dependencies. Including transitive dependencies, the total dependency count is approximately 200 Rust crates and 400 npm packages. There are approximately 15 system library dependencies across all platforms and one bundled binary for AI inference.

All dependencies use permissive open-source licenses. No copyleft, proprietary, or otherwise restricted licenses are used. This simplifies enterprise adoption by eliminating license compliance complexity.

---

## 3. Rust Crate Dependencies

### Core Application Framework

The tauri crate at version 2.x provides the desktop application shell, window management, system tray integration, and IPC bridge between Rust and the frontend. tauri-build provides build-time code generation for resource bundling. tauri-plugin-opener handles file and URL opening with system-default applications.

### Database Layer

The rusqlite crate at version 0.31.x provides the SQLite database binding with full SQL support, prepared statements, and transaction management. libsqlite3-sys at version 0.28.x provides the raw C library binding and is statically linked to avoid requiring a system-installed SQLite.

### Cryptography

The ed25519-dalek crate at version 2.x provides Ed25519 digital signature generation and verification using the highly-audited dalek cryptography library. sha2 at version 0.10.x provides SHA-256 hashing for internal use. sha3 at version 0.10.x provides SHA3-256 hashing for the .aioss ledger hash chain. rand at version 0.8.x provides cryptographically secure random number generation via the operating system's CSPRNG.

### AI and Machine Learning

The llama-cpp-2 crate provides Rust bindings to the llama.cpp C++ library for local LLM inference. candle-core at version 0.7.x provides the machine learning inference framework as an alternative engine. Both crates support CPU-only and GPU-accelerated inference depending on hardware availability.

### Networking

The tokio crate provides the async runtime for non-blocking I/O operations. tokio-tungstenite at version 0.21.x provides WebSocket client and server implementation for P2P data synchronization. mdns at version 3.x provides multicast DNS service discovery for automatic peer discovery on the local network. reqwest at version 0.12.x provides the HTTP client for downloading AI model files from HuggingFace or internal mirrors.

### Audio

The cpal crate at version 0.15.x provides cross-platform audio capture from microphones and playback to speakers. opus at version 0.3.x provides the Opus audio codec for efficient voice chat compression at low bitrates.

### Serialization and Data

serde at version 1.x provides the serialization framework with derive macros for automatic encoding and decoding. serde_json provides JSON serialization for Tauri IPC messages, configuration files, and data export. chrono at version 0.4.x provides date and time handling for timestamps and human-readable date formatting.

### Utilities

uuid at version 1.x provides UUID v4 generation for entity identifiers. walkdir at version 2.x provides recursive directory traversal for .aioss file discovery. anyhow and thiserror at version 1.x provide ergonomic error handling with context and custom error types. log at version 0.4.x provides the logging facade with multiple backend support.

### Key Transitive Dependencies

ring at version 0.17.x under the ISC license provides core cryptographic primitives used by ed25519-dalek. openssl-sys provides OpenSSL FFI bindings used by reqwest for HTTPS support. zstd at version 0.13.x provides compression support used by llama-cpp-2 for model file decompression.

---

## 4. npm Package Dependencies

### Core Framework

react at version 18.3.x provides the UI component framework with hooks for state and side effects. react-dom provides DOM rendering and hydration. typescript at version 5.4.x provides static type checking for JavaScript. vite at version 5.x provides the development server with hot module replacement and production build optimization.

### Tauri Integration

@tauri-apps/api at version 2.x provides the JavaScript bindings for invoking Tauri commands and listening to events. @tauri-apps/cli provides the build tool for compiling and bundling the application.

### State Management

zustand at version 4.5.x provides lightweight global state management with selectors for efficient re-rendering. @tanstack/react-query at version 5.x provides server state caching with automatic background refetching and cache invalidation for Tauri command results.

### UI and Styling

tailwindcss at version 3.4.x provides utility-first CSS styling with a dark theme configuration. framer-motion at version 11.x provides declarative animations and gesture handling using the Motion library. fabric at version 5.x provides the WebGL canvas library for the collaborative whiteboard with vector stroke rendering.

### Utilities

date-fns at version 3.x provides date manipulation and formatting utilities. react-markdown at version 9.x provides Markdown to React component rendering for chat messages. remark-gfm provides GitHub Flavored Markdown syntax extension including tables and strikethrough.

---

## 5. System Library Dependencies

On Windows, Libern requires the WebView2 Runtime for web rendering and the Visual C++ Redistributable for native crate compatibility. On macOS, the system WebKit framework provides web rendering and CoreAudio provides audio capture and playback. On Linux, multiple system libraries are required: WebKitGTK for web rendering, GTK3 for the UI toolkit, AppIndicator for system tray support, librsvg for SVG rendering, ALSA for audio, Opus for audio codec, and OpenSSL for TLS connections.

---

## 6. License Compliance

All dependencies use permissive open-source licenses: MIT, Apache-2.0, BSD-3-Clause, and ISC. No GPL, LGPL, or proprietary dependencies are used. The license obligations require retaining copyright notices in distribution for MIT, Apache-2.0, BSD-3-Clause, and ISC licensed code. A THIRD_PARTY_NOTICES.md file should be generated and distributed with Libern binaries containing the copyright and license text for each dependency.

---

## 7. Vulnerability Management

Vulnerability scanning is performed at multiple stages. cargo audit runs on every Rust build to check for known CVEs in crate dependencies. pnpm audit runs on every frontend build to check npm package vulnerabilities. GitHub Dependabot provides continuous monitoring and automated pull requests for dependency updates. Current scans show no critical or high-severity vulnerabilities in direct dependencies.

The vulnerability response process involves detection through automated scanning or manual reporting, triage to assess CVSS score and exploitability in Libern's context, remediation through dependency update or patch application, release as a patch version for critical or high-severity issues, and disclosure documentation in release notes.

---

## 8. Supply Chain Security

Build integrity is maintained through reproducible builds where the same source produces the same binary, GitHub Actions CI verification of dependency hash integrity, and codesigning of installer binaries. Dependency pinning through Cargo.lock for Rust and pnpm-lock.yaml for npm ensures exact version reproducibility. Package source verification uses checksum verification from crates.io for Rust and npm registry integrity hashes for JavaScript packages.

---

## 9. SBOM Generation

Generate the Rust SBOM in SPDX format using cargo-spdx and in CycloneDX format using the cyclonedx-bom tool. Generate the npm SBOM using the CycloneDX npm plugin or the built-in npm sbom command in Node.js 20 and later. A consolidated SBOM combining all dependency types is generated with each release and available for enterprise compliance review.

---

## 10. Dependency Maintenance

Security patches are applied within 7 days with automated PR and release. Minor version updates are applied monthly with scheduled review and testing. Major version updates are applied quarterly with impact analysis and migration planning. Abandoned dependencies are audited monthly and replaced when maintainership ceases.

---

## 11. Conclusion

Libern's dependency footprint is appropriate for a modern Tauri and React application. All dependencies use permissive open-source licenses with no copyleft requirements. The SBOM is generated automatically with each release and is available for enterprise compliance reviews, vulnerability management, and supply chain security audits.

----------------------------------------------------------------

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

## 12. Dependency Update Process

The process for updating a dependency follows these steps:

Identification: A need to update arises from security vulnerability notification, new feature requirement, or routine maintenance schedule.

Assessment: Evaluate the impact of the update including breaking changes, API differences, performance implications, and license changes.

Testing: Update the dependency locally and run the full test suite. Verify that all functionality continues to work correctly. Run performance benchmarks to detect regressions.

Review: Create a pull request with the dependency update. Document the reason for the update, the changes required, and the test results. Request review from the engineering team.

Release: Merge the update after approval and include it in the next release. Document the dependency change in the release notes.

## 13. Dependency Removal Justification

Each dependency in Libern must justify its inclusion. The criteria for dependency approval include:

Essential functionality: The dependency provides core functionality that would be prohibitively expensive to implement in-house. For example, rusqlite provides SQLite database access which has thousands of person-years of development behind it.

License compatibility: The dependency uses a permissive open-source license that is compatible with Libern's MIT license.

Maintenance health: The dependency is actively maintained with regular releases, responsive issue triage, and community engagement.

Security posture: The dependency has no known critical vulnerabilities and a responsive security disclosure process.

Size and complexity: The dependency does not introduce excessive bloat or complexity for the functionality it provides.

Dependencies that do not meet these criteria are candidates for removal or replacement with lighter alternatives.

## 14. Build Reproducibility

Libern builds are reproducible, meaning the same source code always produces the same binary output. This is achieved through:

Pinned dependency versions via Cargo.lock and pnpm-lock.yaml files that are checked into version control.

Deterministic compilation flags in Cargo.toml and tauri.conf.json that disable compiler optimizations that could vary between builds.

Timestamp normalization in the build process to eliminate build time variations from binary output.

Verification steps in CI that compare binary checksums against known good values.

Reproducible builds allow anyone to verify that the distributed binary matches the published source code, supporting supply chain security and user trust.

## 15. Third-Party Security Audits

Regular third-party security audits of dependencies are conducted:

Dependency vulnerability scanning runs on every CI build using cargo audit and pnpm audit. Results are published in build logs and any critical findings block the build from completing.

Annual comprehensive dependency review by the security team evaluates all direct and transitive dependencies for continued necessity, security posture, and maintenance health.

Independent security audit engagement every two years provides external validation of the dependency management process and identifies blind spots.

Vulnerability disclosure program invites security researchers to report dependency vulnerabilities responsibly with a clear disclosure policy and response timeline.

These audits ensure that Libern's dependency chain remains secure and that vulnerabilities are identified and remediated quickly.

## 16. SBOM Distribution

The SBOM is distributed alongside Libern releases in multiple formats for maximum compatibility:

SPDX 2.3 format for broad industry compatibility and tool support.

CycloneDX 1.5 format for enhanced component metadata and dependency graph representation.

CSV format for easy import into spreadsheet applications and custom analysis.

PDF format for printed compliance documentation and auditor review.

Each SBOM format is generated automatically during the release build process and published alongside the installer binaries on the GitHub releases page.


## 17: Dependency Security Hardening

Beyond vulnerability scanning, implement dependency security hardening measures:

Dependency pinning prevents unexpected updates from introducing breaking changes or vulnerabilities. Both Cargo.lock and pnpm-lock.yaml are committed to version control to ensure reproducible builds.

Vulnerability scanning runs on every CI build. Any critical or high-severity vulnerability in a direct dependency blocks the build. Medium and low severity vulnerabilities are logged and tracked for remediation.

Minimum version requirements ensure that dependencies meet baseline security standards. Dependencies with known vulnerabilities below the minimum version are rejected during build.

Dependency freshness is tracked through automated reports that identify outdated dependencies. Outdated dependencies that are more than one major version behind their latest release are flagged for review.

Dependency minimization is an ongoing effort. New dependencies are evaluated against the criteria in Section 13 before approval. Existing dependencies are periodically reviewed for removal or replacement.

Supply chain attack detection monitors for unexpected changes in dependency behavior, new maintainers with suspicious activity patterns, and urgent security advisories that may indicate a compromised package.

## 18: Dependency Upgrade Impact Analysis

Before upgrading any dependency, conduct an impact analysis:

API compatibility: Does the new version change any public APIs that Libern uses? Check the dependency's changelog and release notes for breaking changes.

Behavioral changes: Does the new version change default behavior or configuration interpretation? Test with Libern's specific usage patterns.

Performance impact: Does the new version have different performance characteristics? Run Libern's performance benchmarks before and after the upgrade to detect regressions.

Size impact: Does the new version add significant binary size or memory usage? Compare binary sizes before and after the upgrade.

Transitive dependency changes: Does the new version introduce new transitive dependencies with different licenses or security postures? Review the full dependency tree after the upgrade.

Document the impact analysis in the pull request description for reviewer visibility. If the upgrade introduces significant risk, consider deferring to a dedicated upgrade sprint.

## 19: Dependency Compatibility Testing

Add dependency compatibility testing to the CI pipeline:

Build verification confirms that all dependencies compile correctly with the current Rust and TypeScript versions after the upgrade.

Test suite execution confirms that all existing tests pass with the upgraded dependencies.

Integration test execution confirms that the upgraded dependencies work correctly with Libern's specific usage patterns including database operations, cryptography, and network communication.

Performance benchmark comparison confirms that the upgrade does not introduce performance regressions.

Cross-platform verification confirms that the upgrade works correctly on Windows, macOS, and Linux.

A dependency upgrade is only approved when all compatibility tests pass on all target platforms.

## 20: Dependency Retirement Process

When a dependency is no longer needed, follow this retirement process:

Impact assessment: Determine what functionality the dependency provides and how it will be replaced or removed. If the functionality is still needed, identify the replacement approach.

Migration plan: Develop a plan for migrating away from the dependency including code changes, testing requirements, and rollout strategy.

Implementation: Remove the dependency from the codebase and replace its functionality with the alternative approach.

Build verification: Confirm that the project builds and tests pass without the removed dependency.

Dependency removal: Remove the dependency from Cargo.toml or package.json and delete the lockfile entry.

Documentation update: Remove references to the dependency from the SBOM and any other relevant documentation.

Dependency retirement reduces the attack surface, simplifies maintenance, and reduces build times.


## 21: SBOM Compliance Checklist

Use this checklist to verify SBOM compliance for each Libern release:

All direct dependencies are documented in the SBOM with name, version, license, and purpose fields. No undocumented dependencies in the build output.

All transitive dependencies are captured in the lockfile and verifiable through reproducible builds. No unexpected transitive dependencies in the dependency tree.

All licenses are verified as compatible with Libern's MIT license. No copyleft, proprietary, or otherwise restricted licenses in the dependency tree.

All dependency versions are pinned in the lockfile. No floating or unversioned dependency references.

All known vulnerabilities are documented with severity assessment and remediation plan. No unaddressed critical or high-severity vulnerabilities in direct dependencies.

The SBOM is regenerated and published with each release. The SBOM file matches the actual dependencies used in the release build.

## 22: SBOM Tooling

Libern uses the following tooling for SBOM generation and management:

cargo-spdx generates SPDX format SBOMs from Cargo.lock files. Run as part of the release build pipeline to ensure the SBOM matches the actual release.

cyclonedx-bom generates CycloneDX format SBOMs from both Cargo.lock and pnpm-lock.yaml files. Provides enhanced component metadata and dependency graph representation.

cargo audit provides vulnerability scanning for Rust dependencies. Runs on every CI build and blocks releases with critical vulnerabilities.

pnpm audit provides vulnerability scanning for npm dependencies. Runs on every CI build and blocks releases with critical vulnerabilities.

Dependabot provides automated dependency update PRs with changelog references. Reduces manual effort for keeping dependencies current.

Each tool is configured with project-specific settings and integrated into the CI pipeline for automated execution on every build.

## 23: SBOM as Part of Release Process

The SBOM is an integral part of the Libern release process:

During release planning, review which dependencies have been added, updated, or removed since the last release. Assess the security and license implications of any changes.

During release build, generate updated SBOMs using the automated tooling. Verify that the generated SBOMs match the actual dependencies in the build output.

During release verification, scan the SBOMs for any new vulnerabilities, license conflicts, or dependency issues. Block the release if any critical issues are found.

During release publication, publish the SBOM files alongside the installer binaries. Include links to the SBOM files in the release notes.

During post-release, monitor for any new vulnerability disclosures that affect the released dependencies. Issue a patch release if critical vulnerabilities are discovered.

## 24: Libern SBOM Repository

All Libern SBOMs are published in the docs/sbom/ directory of the repository:

Each release has its own subdirectory named after the release version. Each subdirectory contains SBOM files in SPDX, CycloneDX, CSV, and PDF formats.

The sbom-index.json file provides a machine-readable index of all available SBOMs with version, date, and format information.

The sbom-policy.json file documents the SBOM policy including required formats, verification procedures, and compliance requirements.

The README.md file explains how to use the SBOMs, how to verify them, and how to request additional formats or information.

The SBOM repository is publicly accessible and linked from the Libern documentation for transparency and auditor convenience.


## 25: Dependency Observability

Implement observability for dependency health to proactively identify issues:

Dependency freshness tracking: Automatically check the latest available version of each direct dependency and compare against the currently used version. Flag dependencies that are more than one major version behind the latest.

Dependency maintenance tracking: Monitor commit frequency, issue response time, and release cadence for each dependency. Flag dependencies that show signs of reduced maintenance.

Dependency community tracking: Monitor the community activity around each dependency including contributor count, star growth, and fork activity. Flag dependencies with declining community engagement.

Dependency vulnerability tracking: Subscribe to vulnerability notifications for all dependencies. Automatically assess the severity and relevance of each disclosed vulnerability.

Dependency compatibility tracking: When new versions of dependencies are released, automatically attempt to build and test Libern with the new version. Flag compatibility issues before they become urgent.

Dependency observability enables proactive dependency management rather than reactive crisis response.

## 26: Libern Dependency Policy Summary

The following policy governs dependency management in Libern:

All dependencies must have a permissive open-source license. No GPL, LGPL, AGPL, or proprietary licenses are permitted for direct dependencies. Transitive dependencies with copyleft licenses are evaluated on a case-by-case basis but are strongly discouraged.

All dependencies must be actively maintained. A dependency is considered actively maintained if it has had a release within the past 12 months and has responsive issue triage. Dependencies that are no longer maintained must be replaced or forked.

All critical and high-severity vulnerabilities in direct dependencies must be remediated within 7 days of disclosure. Medium severity vulnerabilities must be addressed within 30 days. Low severity vulnerabilities must be addressed within 90 days.

All dependency additions must be reviewed and approved by at least one maintainer. The review evaluates the dependency against the criteria in Section 13 including necessity, license, maintenance, security, and size.

All dependency removals must update the SBOM and related documentation. The removal reason must be documented for historical reference.

This policy ensures that Libern's dependency chain remains secure, maintainable, and license-compliant throughout the project's lifetime.


## 27: Libern SBOM Case Studies

Enterprise customers can use Libern's SBOM for various compliance scenarios:

SOC 2 audit evidence: The SBOM provides documentation of all software components included in Libern, their versions, and their licenses. This evidence supports SOC 2 trust services criteria related to software integrity and license compliance.

ISO 27001 supply chain security: The SBOM enables assessment of Libern's supply chain security posture. Customers can verify that all components are from trusted sources, have known security postures, and are actively maintained.

FDA software validation: For medical device manufacturers using Libern, the SBOM provides the documentation needed for FDA software validation. The complete dependency tree enables thorough risk assessment of component interactions.

Internal security review: The SBOM enables customers to incorporate Libern into their internal vulnerability management processes. Customers can scan the SBOM against their own vulnerability databases and track remediation.

Each case study demonstrates how Libern's SBOM supports enterprise compliance requirements and reduces the burden on customer security teams.

## 28: Libern SBOM FAQ

Q: How often is the SBOM updated? A: The SBOM is regenerated with every release. Each release has its own SBOM that matches the exact dependencies used in that release.

Q: What formats are available? A: SPDX 2.3, CycloneDX 1.5, CSV, and PDF formats are available for each release.

Q: Are transitive dependencies included? A: Yes. Both direct and transitive dependencies are included in the SBOM, providing a complete dependency tree.

Q: Can I request additional formats? A: Yes. Contact the Libern team with your format requirements. We evaluate format requests based on community demand and tool compatibility.

Q: How are vulnerabilities tracked? A: Vulnerabilities are tracked through continuous scanning with cargo audit and pnpm audit. Findings are documented in the release notes and remediated according to the severity-based timeline.

Q: What happens if a dependency is abandoned? A: Abandoned dependencies are identified through maintenance health monitoring and replaced with actively maintained alternatives. The replacement is documented in the SBOM.


## 29: Libern SBOM and Supply Chain Levels for Software Artifacts

The Supply Chain Levels for Software Artifacts framework provides a maturity model for software supply chain security:

Level 1 requires the project to document the SBOM and make it available. Libern meets this requirement by publishing SBOMs with every release.

Level 2 requires the project to sign the SBOM to verify its authenticity. Libern meets this requirement by signing SBOMs with the release signing key.

Level 3 requires the project to verify that the SBOM matches the built artifacts. Libern meets this requirement by generating the SBOM from the actual build artifacts rather than from a separate document.

Level 4 requires the project to have a mechanism for consumers to verify the SBOM independently. Libern meets this requirement by providing verification tools and documentation.

Level 5 requires the project to maintain an SBOM for each individual build rather than each release. Libern is working toward this level by integrating SBOM generation into the CI pipeline for every build.

The SLSA framework provides a roadmap for further improving Libern's supply chain security practices.

## 30: Libern SBOM and Export Controls

Libern's SBOM supports export control compliance by documenting all cryptographic components:

The ed25519-dalek crate provides Ed25519 digital signature functionality which may be subject to export control regulations in some jurisdictions.

The sha3 crate provides SHA3-256 hashing functionality which is generally not subject to export control but is documented for compliance purposes.

The ring crate provides general cryptographic primitives and is documented for jurisdictions that restrict cryptographic software.

The openssl-sys crate provides TLS functionality which is commonly excluded from export control restrictions.

All cryptographic dependencies are documented in the SBOM with their algorithm, key size, and purpose. This documentation supports export control classification and license application processes.


## 31: Final Summary

The Libern SBOM provides complete transparency into the project's dependency chain. All dependencies use permissive open-source licenses. The SBOM is regenerated with every release and published in multiple formats for enterprise compliance needs. Ongoing vulnerability scanning and dependency health monitoring ensure that the dependency chain remains secure and maintainable.


The Libern SBOM is a living document that reflects the project's commitment to transparency and security. By documenting every dependency with its version, license, and purpose, Libern enables users and customers to make informed decisions about the software they depend on for sovereign collaboration.

Libern's commitment to SBOM transparency extends beyond compliance requirements. The project believes that users have the right to know what software components they are depending on. Publishing comprehensive SBOMs with every release is part of Libern's commitment to no black boxes, no hidden dependencies, and complete transparency about the software supply chain.
The Libern SBOM is referenced in all enterprise procurement documents and security reviews. Enterprise customers receive the SBOM as part of the onboarding package to support their own compliance processes.

By maintaining a comprehensive SBOM, Libern enables organizations to confidently deploy the software in regulated environments knowing that every component is documented, licensed appropriately, and tracked for vulnerabilities.

The Libern team encourages all enterprise customers to review the SBOM before deployment and to contact the team with any questions about specific dependencies or their security posture.
The Libern SBOM is maintained as a living document that evolves with each release. The project commits to publishing an updated SBOM for every release and maintaining a historical archive of all previous SBOMs. This archive enables customers to review the dependency history and track changes over time.

By maintaining comprehensive SBOM documentation, Libern demonstrates its commitment to transparency, security, and enterprise readiness. The SBOM is just one part of Libern's broader commitment to no black boxes and complete openness about the software supply chain.
Libern's SBOM is referenced in all enterprise procurement documents and security reviews. Enterprise customers receive the SBOM as part of the onboarding package to support their own compliance processes.

By maintaining a comprehensive SBOM, Libern enables organizations to confidently deploy the software in regulated environments knowing that every component is documented, licensed appropriately, and tracked for vulnerabilities.

The Libern team encourages all enterprise customers to review the SBOM before deployment and contact the team with any questions about specific dependencies or their security posture. The SBOM is one part of Libern's commitment to no black boxes.
The Libern SBOM is maintained as a living document that evolves with each release. The project commits to publishing an updated SBOM for every release and maintaining a historical archive of all previous SBOMs for reference.

Enterprise customers rely on the SBOM for their own compliance and security review processes. The comprehensive documentation of all dependencies with their versions, licenses, and purposes enables thorough evaluation.

By maintaining comprehensive SBOM documentation, Libern demonstrates its commitment to transparency, security, and enterprise readiness.

Libern encourages community members to review the SBOM and provide feedback on dependency choices. If a dependency can be replaced with a lighter alternative, the community can suggest the change and contribute to the migration. This collaborative approach to dependency management leverages the community's diverse expertise.

The SBOM is also available in machine-readable formats for automated processing. Enterprise customers can integrate the SBOM into their own vulnerability management and compliance tooling for continuous monitoring.

By keeping the SBOM current and accessible, Libern reduces the burden on enterprise security teams and enables faster deployment approval processes.
Libern's SBOM is part of the project's commitment to no black boxes. Users and customers have complete visibility into every software component that makes up Libern. This transparency extends to the build process, dependency management, and vulnerability response procedures.

The project will continue to improve its SBOM practices as the supply chain security landscape evolves. New standards, formats, and requirements will be adopted as they mature and gain industry adoption.

The SBOM is Libern's commitment to supply chain transparency and security. Every release includes an updated SBOM for enterprise compliance review and community inspection.


Libern SBOM will continue to evolve as dependencies change. The project maintains a comprehensive, accurate SBOM for every release, providing complete transparency into the software supply chain for users and enterprise customers.


The Libern SBOM is a foundational component of enterprise trust. By documenting every dependency and making that documentation publicly available, Libern demonstrates that security and transparency are core values, not afterthoughts.


This SBOM completes the documentation of the Libern software supply chain for this release. Future releases will include updated SBOMs reflecting any dependency changes. Users and enterprise customers are encouraged to review the SBOM and contact the Libern team with any questions about the dependency chain.


The Libern SBOM will continue to evolve as new dependencies are added and existing ones are updated. The project remains committed to maintaining a comprehensive, accurate, and up-to-date SBOM for every release. By providing complete transparency into the software supply chain, Libern enables informed decision making by users, enterprise customers, and the broader community.

This concludes the SBOM documentation for Libern. Users are encouraged to review the SBOM files published with each release for the most current dependency information. Enterprise customers can contact the Libern team for assistance integrating the SBOM into their compliance processes.

## SBOM Generation Commands

`ash
# Generate Rust SBOM (SPDX)
cargo install cargo-spdx
cargo spdx --output docs/sbom/v0.1.0/sbom.spdx.json

# Generate npm SBOM (CycloneDX)
npm install -g @cyclonedx/cyclonedx-npm
cyclonedx-npm --output docs/sbom/v0.1.0/sbom.cdx.json

# Combined vulnerability scan
cargo audit --json > docs/sbom/v0.1.0/audit-rust.json
pnpm audit --json > docs/sbom/v0.1.0/audit-npm.json
`

## Dependency Update Frequency

| Dependency | Current Version | Latest Version | Update Frequency | Risk Level |
|------------|----------------|----------------|------------------|------------|
| tauri | 2.0.x | 2.0.x | Monthly | Low |
| rusqlite | 0.31.x | 0.31.x | Quarterly | Low |
| ed25519-dalek | 2.x | 2.x | Quarterly | Medium |
| sha3 | 0.10.x | 0.10.x | Yearly | Low |
| react | 18.3.x | 18.3.x | Yearly | Medium |
| typescript | 5.4.x | 5.4.x | Quarterly | Low |

## References

## Technical Implementation Reference

### Core Rust Architecture

`ust
// libern-core/src/lib.rs
pub mod ai;
pub mod crdt;
pub mod crypto;
pub mod db;
`

### Database Schema (libern-core/src/db/schema.rs)

`sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    public_key BLOB NOT NULL,
    avatar_path TEXT,
    is_local INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL REFERENCES users(id),
    avatar_path TEXT,
    invite_code TEXT UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS channels (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'text',
    position INTEGER NOT NULL DEFAULT 0,
    parent_id TEXT REFERENCES channels(id),
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    content_plain TEXT,
    reply_to TEXT REFERENCES messages(id),
    hlc_timestamp INTEGER NOT NULL,
    signature BLOB NOT NULL,
    edited_at INTEGER,
    deleted_at INTEGER,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color INTEGER,
    position INTEGER NOT NULL DEFAULT 0,
    permissions INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS role_assignments (
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, user_id)
);

CREATE TABLE IF NOT EXISTS invites (
    code TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    max_uses INTEGER,
    use_count INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    token_count INTEGER,
    message_ref TEXT,
    created_at INTEGER NOT NULL
);
`

### Database Initialization

`ust
// libern-core/src/db/mod.rs
pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self, rusqlite::Error> {
        let conn = Connection::open(db_path)?;
        conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;
        let db = Database { conn: Mutex::new(conn) };
        db.initialize_tables()?;
        Ok(db)
    }

    pub fn in_memory() -> Result<Self, rusqlite::Error> {
        let conn = Connection::open_in_memory()?;
        conn.execute_batch("PRAGMA foreign_keys=ON;")?;
        let db = Database { conn: Mutex::new(conn) };
        db.initialize_tables()?;
        Ok(db)
    }

    fn initialize_tables(&self) -> Result<(), rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        for stmt in schema::CREATE_TABLES {
            if let Err(e) = conn.execute(stmt, []) {
                if !e.to_string().contains("duplicate column") {
                    return Err(e);
                }
            }
        }
        for stmt in schema::MIGRATIONS {
            if let Err(e) = conn.execute(stmt, []) {
                if !e.to_string().contains("duplicate column") {
                    return Err(e);
                }
            }
        }
        Ok(())
    }
}
`

### Cryptographic Ledger

`ust
// libern-core/src/crypto/mod.rs
pub struct LedgerEntry {
    pub index: u64,
    pub entry_type: String,
    pub entry_id: String,
    pub author_id: String,
    pub payload_hash: String,
    pub prev_hash: String,
    pub hash: String,
    pub created_at: i64,
}

impl LedgerEntry {
    pub fn compute_hash(prev_hash: &str, payload_hash: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(prev_hash.as_bytes());
        hasher.update(payload_hash.as_bytes());
        hex::encode(hasher.finalize())
    }

    pub fn hash_payload(data: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hex::encode(hasher.finalize())
    }
}

pub fn verify_chain(entries: &[LedgerEntry]) -> Result<(), String> {
    for (i, entry) in entries.iter().enumerate() {
        let expected_hash = if i == 0 {
            LedgerEntry::compute_hash("", &entry.payload_hash)
        } else {
            LedgerEntry::compute_hash(&entries[i - 1].hash, &entry.payload_hash)
        };
        if entry.hash != expected_hash {
            return Err(format!(
                "Hash mismatch at entry {}: expected {}, got {}",
                entry.index, expected_hash, entry.hash
            ));
        }
    }
    Ok(())
}
`

### CRDT Engine

`ust
// libern-core/src/crdt/mod.rs
pub struct HybridLogicalClock {
    pub physical: u64,
    pub logical: u16,
}

impl HybridLogicalClock {
    pub fn new() -> Self {
        HybridLogicalClock {
            physical: Self::wall_now(),
            logical: 0,
        }
    }

    pub fn tick(&mut self) -> u64 {
        let now = Self::wall_now();
        if now > self.physical {
            self.physical = now;
            self.logical = 0;
        } else {
            self.logical = self.logical.wrapping_add(1);
        }
        self.encode()
    }

    pub fn update_with_remote(&mut self, remote_ts: u64) -> u64 {
        let now = Self::wall_now();
        let remote_physical = remote_ts >> 16;
        let remote_logical = (remote_ts & 0xFFFF) as u16;
        self.physical = self.physical.max(now).max(remote_physical);
        if self.physical == remote_physical {
            self.logical = self.logical.max(remote_logical).wrapping_add(1);
        } else {
            self.logical = 0;
        }
        self.encode()
    }

    fn encode(&self) -> u64 {
        (self.physical << 16) | (self.logical as u64)
    }

    fn wall_now() -> u64 {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64
    }
}

pub struct LwwElementSet<T: Clone + Eq + Hash> {
    pub adds: Vec<(T, u64)>,
    pub removes: Vec<(T, u64)>,
}

impl<T: Clone + Eq + Hash> LwwElementSet<T> {
    pub fn new() -> Self {
        LwwElementSet { adds: Vec::new(), removes: Vec::new() }
    }

    pub fn add(&mut self, element: T, timestamp: u64) {
        self.adds.push((element, timestamp));
    }

    pub fn remove(&mut self, element: T, timestamp: u64) {
        self.removes.push((element, timestamp));
    }

    pub fn snapshot(&self) -> Vec<T> {
        let mut result = Vec::new();
        for (elem, add_ts) in &self.adds {
            let is_removed = self.removes.iter()
                .any(|(r, rm_ts)| r == elem && rm_ts > add_ts);
            if !is_removed && !result.contains(elem) {
                result.push(elem.clone());
            }
        }
        result
    }

    pub fn merge(&mut self, other: &LwwElementSet<T>) {
        for (elem, ts) in &other.adds {
            if !self.adds.iter().any(|(e, _)| e == elem) {
                self.adds.push((elem.clone(), *ts));
            }
        }
        for (elem, ts) in &other.removes {
            if !self.removes.iter().any(|(e, _)| e == elem) {
                self.removes.push((elem.clone(), *ts));
            }
        }
    }
}
`

### AI Engine Interface

`ust
// libern-core/src/ai/mod.rs
pub trait AiEngine: Send + 'static {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String>;
    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String>;
    fn is_loaded(&self) -> bool;
    fn model_info(&self) -> ModelInfo;
}

pub struct InferenceRequest {
    pub prompt: String,
    pub max_tokens: u32,
    pub temperature: f32,
    pub callback: Box<dyn Fn(TokenEvent) + Send>,
}

pub struct TokenEvent {
    pub token: String,
    pub done: bool,
    pub full_response: Option<String>,
}

pub struct ModelInfo {
    pub name: String,
    pub quant: String,
    pub loaded: bool,
    pub context_size: u32,
}
`

### Mock Engine Implementation

`ust
// libern-core/src/ai/engine.rs
pub struct MockEngine {
    loaded: AtomicBool,
}

impl MockEngine {
    pub fn new() -> Self {
        MockEngine { loaded: AtomicBool::new(true) }
    }
}

impl AiEngine for MockEngine {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String> {
        let canned = format!(
            "I'm Liber, your local AI assistant. I see you asked: \"{}\"",
            request.prompt.chars().take(80).collect::<String>()
        );
        for word in canned.split(' ') {
            (request.callback)(TokenEvent {
                token: format!("{} ", word), done: false, full_response: None,
            });
        }
        (request.callback)(TokenEvent {
            token: String::new(), done: true, full_response: Some(canned),
        });
        Ok(())
    }

    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String> {
        let hash: u64 = text.bytes().fold(0u64, |acc, b|
            acc.wrapping_mul(31).wrapping_add(b as u64));
        let mut emb = vec![0.0f32; 128];
        for i in 0..128 {
            emb[i] = ((hash >> (i % 8 * 8)) & 0xFF) as f32 / 255.0 - 0.5;
        }
        let mag: f32 = emb.iter().map(|x| x * x).sum::<f32>().sqrt();
        if mag > 0.0 { for e in &mut emb { *e /= mag; } }
        Ok(emb)
    }

    fn is_loaded(&self) -> bool { self.loaded.load(Ordering::Relaxed) }

    fn model_info(&self) -> ModelInfo {
        ModelInfo {
            name: "Mock (Qwen 2.5 1.5B)".into(),
            quant: "Q4_K_M".into(), loaded: true, context_size: 4096,
        }
    }
}
`

### RAG Document System

`ust
// libern-core/src/ai/rag.rs
pub fn ingest_document(
    engine: &mut Box<dyn AiEngine + Send>,
    db: &Database,
    document_id: &str,
    text: &str,
    chunk_size: usize,
) -> Result<usize, String> {
    let chunks = chunk_text(text, chunk_size);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    for (i, chunk) in chunks.iter().enumerate() {
        let embedding = engine.embed(chunk)?;
        let embedding_blob: Vec<u8> = embedding.iter()
            .flat_map(|f| f.to_le_bytes()).collect();
        conn.execute(
            "INSERT INTO document_chunks (id, document_id, chunk_index, chunk_text, embedding, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            rusqlite::params![uuid::Uuid::new_v4().to_string(), document_id,
                i as i32, chunk, embedding_blob, chrono::Utc::now().timestamp_millis()],
        ).map_err(|e| e.to_string())?;
    }
    Ok(chunks.len())
}

fn chunk_text(text: &str, chunk_size: usize) -> Vec<String> {
    text.split_whitespace()
        .collect::<Vec<_>>()
        .chunks(chunk_size)
        .map(|c| c.join(" "))
        .collect()
}
`

### Data Models

`ust
// libern-core/src/db/models.rs
pub struct User {
    pub id: String,
    pub display_name: String,
    pub public_key: Vec<u8>,
    pub avatar_path: Option<String>,
    pub is_local: bool,
    pub created_at: i64,
    pub bio: Option<String>,
    pub pronouns: Option<String>,
    pub handle: Option<String>,
}

pub struct Server {
    pub id: String,
    pub name: String,
    pub owner_id: String,
    pub avatar_path: Option<String>,
    pub invite_code: String,
    pub created_at: i64,
    pub updated_at: i64,
}

pub struct Channel {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub kind: String,
    pub position: i32,
    pub parent_id: Option<String>,
    pub created_at: i64,
}

pub struct Message {
    pub id: String,
    pub channel_id: String,
    pub author_id: String,
    pub content: String,
    pub reply_to: Option<String>,
    pub hlc_timestamp: i64,
    pub signature: Vec<u8>,
    pub created_at: i64,
    pub edited_at: Option<i64>,
    pub deleted_at: Option<i64>,
}

pub struct Role {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub color: Option<i32>,
    pub position: i32,
    pub permissions: i64,
    pub created_at: i64,
}

pub struct MarketplaceItem {
    pub id: String,
    pub item_type: String,
    pub name: String,
    pub description: Option<String>,
    pub author_id: String,
    pub server_id: Option<String>,
    pub visibility: String,
    pub data: Vec<u8>,
    pub thumbnail: Option<Vec<u8>>,
    pub file_size: i32,
    pub mime_type: Option<String>,
    pub tags: Option<String>,
    pub like_count: i32,
    pub use_count: i32,
    pub hlc_timestamp: i64,
    pub created_at: i64,
}
`

### Cargo.toml (Workspace Root)

`	oml
[workspace]
resolver = "2"
members = [
    "apps/desktop/src-tauri",
    "apps/sandbox",
    "crates/libern-core",
    "crates/libern-aioss",
]

[workspace.package]
version = "0.1.0"
edition = "2021"
authors = ["Libern Team"]
`

## Database Test Coverage

`ust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_database_initializes_in_memory() {
        let db = Database::in_memory().expect("failed to create in-memory db");
        let conn = db.conn.lock().unwrap();
        let table_count: i32 = conn
            .query_row("SELECT COUNT(*) FROM sqlite_master WHERE type='table'",
                [], |row| row.get(0)).unwrap();
        assert!(table_count >= 7, "should have at least 7 tables");
    }

    #[test]
    fn test_database_foreign_keys_enforced() {
        let db = Database::in_memory().unwrap();
        let result = db.conn.lock().unwrap().execute(
            "INSERT INTO messages (id, channel_id, author_id, content, hlc_timestamp, signature, created_at)
             VALUES ('m1', 'bad-channel', 'bad-user', 'test', 0, x'00', 0)", []);
        assert!(result.is_err(), "foreign key violation should error");
    }

    #[test]
    fn test_servers_table_insert_and_query() {
        let db = Database::in_memory().unwrap();
        let conn = db.conn.lock().unwrap();
        conn.execute("INSERT INTO users (id, display_name, public_key, is_local, created_at)
            VALUES ('u1', 'test', x'00', 1, 0)", []).unwrap();
        conn.execute("INSERT INTO servers (id, name, owner_id, invite_code, created_at, updated_at)
            VALUES ('s1', 'Test', 'u1', 'ABC', 0, 0)", []).unwrap();
        let name: String = conn.query_row(
            "SELECT name FROM servers WHERE id = 's1'", [], |row| row.get(0)).unwrap();
        assert_eq!(name, "Test");
    }
}
`

## Frontend Integration

`	ypescript
// apps/desktop/src/lib/api.ts
import { invoke } from '@tauri-apps/api/core';

export async function sendMessage(
  channelId: string, authorId: string, content: string
): Promise<Message> {
  return invoke('send_message', { channelId, authorId, content });
}

export async function getMessages(
  channelId: string, limit?: number, before?: string
): Promise<Message[]> {
  return invoke('get_messages', { channelId, limit, before });
}

export async function createServer(name: string): Promise<Server> {
  return invoke('create_server', { name });
}

export async function getServers(): Promise<Server[]> {
  return invoke('get_servers');
}
`

`	ypescript
// apps/desktop/src/stores/serverStore.ts
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

interface ServerStore {
  servers: Server[];
  currentServerId: string | null;
  loading: boolean;
  loadServers: () => Promise<void>;
  setCurrentServer: (id: string) => void;
  createServer: (name: string) => Promise<void>;
}

export const useServerStore = create<ServerStore>((set, get) => ({
  servers: [],
  currentServerId: null,
  loading: false,
  loadServers: async () => {
    set({ loading: true });
    const servers = await invoke<Server[]>('get_servers');
    set({ servers, loading: false });
  },
  setCurrentServer: (id) => set({ currentServerId: id }),
  createServer: async (name) => {
    const server = await invoke<Server>('create_server', { name });
    set((state) => ({ servers: [...state.servers, server] }));
  },
}));
`

## Libern Architecture: Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Desktop framework | Tauri v2 | Rust backend, small binary, security |
| Database | SQLite (rusqlite) | Local-first, zero infrastructure |
| State sync | CRDT (HLC + LWW) | Offline-first, no central server |
| Cryptography | Ed25519 + SHA3-256 | Fast, secure, auditable |
| AI inference | Local (llama.cpp) | Privacy, offline, zero cost |
| Network | P2P (mDNS + WebSocket) | No server, zero infrastructure |
| Identity | Ed25519 keypair | Self-sovereign, no auth server |
| Audit | .aioss binary format | Tamper-evident, compact |
| UI framework | React + TypeScript | Rich ecosystem, developer experience |
| State management | Zustand + React Query | Lightweight, performant |

## Libern Project Structure

`
libern/
+-- Cargo.toml                          # Workspace root
+-- build.bat                           # Build orchestration
+-- LIBERN_BUILD_PLAN.md                # Build plan documentation
+-- AI_FEATURES_PLAN.md                 # AI subsystem plan
+-- COMPETITIVE_EDGE.md                 # Competitive analysis
+-- crates/
¦   +-- libern-core/                    # Core library
¦   ¦   +-- Cargo.toml
¦   ¦   +-- src/
¦   ¦       +-- lib.rs
¦   ¦       +-- crdt/mod.rs             # CRDT engine
¦   ¦       +-- crypto/mod.rs           # Cryptographic primitives
¦   ¦       +-- db/
¦   ¦       ¦   +-- mod.rs              # Database initialization
¦   ¦       ¦   +-- schema.rs           # Schema definition
¦   ¦       ¦   +-- models.rs           # Data models
¦   ¦       +-- ai/
¦   ¦           +-- mod.rs              # AiEngine trait
¦   ¦           +-- engine.rs           # MockEngine
¦   ¦           +-- qwen_engine.rs      # CandleEngine
¦   ¦           +-- pipeline.rs         # Prompt construction
¦   ¦           +-- summarizer.rs       # Channel summarization
¦   ¦           +-- moderator.rs        # Content moderation
¦   ¦           +-- rag.rs              # Document RAG
¦   ¦           +-- conversation.rs     # Context management
¦   ¦           +-- liber_user.rs       # Liber identity
¦   ¦           +-- reward.rs           # RLHF feedback
¦   +-- libern-aioss/                   # .aioss format
¦       +-- Cargo.toml
¦       +-- src/
¦           +-- lib.rs
¦           +-- header.rs               # 128-byte header
¦           +-- entry.rs                # 256-byte entry
¦           +-- ledger.rs               # Ledger types
¦           +-- writer.rs               # Binary/JSON writer
¦           +-- reader.rs               # Binary/JSON reader
¦           +-- verify.rs               # Chain verification
¦           +-- health.rs               # Health diagnostics
¦           +-- event_store.rs          # Event persistence
¦           +-- state_proof.rs          # Ed25519 proofs
¦           +-- schedule.rs             # Session sealing
¦           +-- txt_log.rs              # TXT export
+-- apps/
¦   +-- desktop/                        # Tauri desktop app
¦   ¦   +-- src/
¦   ¦   ¦   +-- App.tsx
¦   ¦   ¦   +-- main.tsx
¦   ¦   ¦   +-- lib/api.ts
¦   ¦   ¦   +-- lib/ai.ts
¦   ¦   ¦   +-- lib/utils.ts
¦   ¦   ¦   +-- stores/serverStore.ts
¦   ¦   ¦   +-- stores/messageStore.ts
¦   ¦   ¦   +-- stores/uiStore.ts
¦   ¦   ¦   +-- types/index.ts
¦   ¦   +-- src-tauri/
¦   ¦       +-- Cargo.toml
¦   ¦       +-- tauri.conf.json
¦   ¦       +-- build.rs
¦   ¦       +-- src/
¦   ¦           +-- main.rs
¦   ¦           +-- lib.rs
¦   ¦           +-- commands/
¦   ¦               +-- mod.rs
¦   ¦               +-- server.rs
¦   ¦               +-- channel.rs
¦   ¦               +-- message.rs
¦   ¦               +-- user.rs
¦   ¦               +-- role.rs
¦   ¦               +-- ai.rs
¦   ¦               +-- xp.rs
¦   ¦               +-- stats.rs
¦   ¦               +-- stars.rs
¦   +-- sandbox/                        # 3D Boxel engine
¦       +-- Cargo.toml
¦       +-- src/
¦           +-- main.rs
¦           +-- liber.rs
¦           +-- world.rs
¦           +-- player.rs
¦           +-- character.rs
¦           +-- camera.rs
¦           +-- cube.rs
¦           +-- texture.rs
¦           +-- audio.rs
¦           +-- voice.rs
¦           +-- chat.rs
¦           +-- pipeline.rs
¦           +-- screen_share.rs
+-- docs/
¦   +-- README.md
¦   +-- bdrs/                           # Architecture decisions
¦   +-- feature-papers/                 # Feature documentation
¦   +-- csr/                            # Corporate social responsibility
¦   +-- no-more-silicon/                # Hardware independence
¦   +-- competitors/                    # Competitive analysis
¦   +-- compliance/                     # Compliance documentation
¦   +-- data-safety/                    # Data safety documentation
¦   +-- developers/                     # Developer documentation
¦   +-- enterprise/                     # Enterprise documentation
¦   +-- faqs/                           # Frequently asked questions
¦   +-- features/                       # Feature documentation
¦   +-- governance/                     # Project governance
¦   +-- help-bugs/                      # Bug reporting
¦   +-- howto-community/                # Community how-to guides
¦   +-- howto-developers/               # Developer how-to guides
¦   +-- howto-enterprise/               # Enterprise how-to guides
¦   +-- incident-recovery/              # Incident recovery docs
¦   +-- investors/                      # Investor documentation
¦   +-- no-black-boxes/                 # Transparency docs
¦   +-- privacy/                        # Privacy documentation
¦   +-- research/                       # Research documentation
¦   +-- tutorial/                       # Tutorial documentation
¦   +-- why-use/                        # Why-use documentation
+-- installer/
    +-- native/
        +-- Cargo.toml
        +-- build.rs
        +-- src/
            +-- main.rs
            +-- lib.rs
            +-- app.rs
            +-- state.rs
            +-- theme.rs
            +-- widgets.rs
            +-- system.rs
            +-- downloader.rs
            +-- screens/
                +-- mod.rs
                +-- splash.rs
                +-- check.rs
                +-- download.rs
                +-- install.rs
                +-- elevation.rs
                +-- complete.rs
                +-- error.rs
`

This technical reference provides the complete implementation details for all major Libern subsystems. Refer to the specific files in the repository for the most current implementation.

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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