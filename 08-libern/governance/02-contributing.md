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
Category: governance | ID: LIB-GOV-002

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

# Contributing to Libern

## 1. Overview

Welcome to Libern! We are excited that you want to contribute. Libern is a
community-driven open-source project, and contributions of all kinds â€” code,
documentation, design, testing, translations, and more â€” are welcome.

This document provides guidelines for contributing to the Libern project.
Please read it before making your first contribution.

## 2. Quick Start

### 2.1 Prerequisites

Before contributing, ensure you have:

- A GitHub account
- Basic familiarity with Git and GitHub
- The development environment set up for your contribution area:
  - **Rust:** For backend/crypto/CLI contributions
  - **TypeScript/HTML/CSS:** For frontend/UI contributions
  - **Markdown:** For documentation contributions
  - **Figma or similar:** For design contributions

### 2.2 Finding Something to Work On

Start here:

1. **Good First Issue:** Issues labeled `good-first-issue` are specifically
   curated for new contributors
2. **Help Wanted:** Issues labeled `help-wanted` indicate the project needs
   assistance
3. **Documentation:** Improvements to docs are always welcome
4. **Bug fixes:** Look for unassigned bugs in the issue tracker
5. **Feature requests:** Check the RFC process for features needing
   implementation

### 2.3 Setting Up the Development Environment

**Clone the repository:**
```bash
git clone https://github.com/libern/libern.git
cd libern
```

**Backend (Rust):**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Build
cargo build
cargo test
```

**Frontend (TypeScript):**
```bash
cd frontend
npm install
npm run dev
```

**Full build:**
```bash
# From the repository root
cargo run --release
```

## 3. Contribution Workflow

### 3.1 Step 1: Discuss

Before starting work on a significant contribution:

- **For bugs:** Check if the issue already exists. If not, create one.
- **For features:** Open a discussion or RFC (see governance-model.md).
- **For small changes:** Proceed directly to Step 2 if the change is trivial.

This step ensures your effort is not wasted if the change would not be
accepted.

### 3.2 Step 2: Fork and Branch

1. Fork the Libern repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/libern.git
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

Branch naming conventions:
- `fix/` â€” Bug fixes
- `feature/` â€” New features
- `docs/` â€” Documentation changes
- `refactor/` â€” Code refactoring
- `test/` â€” Test additions or changes
- `chore/` â€” Maintenance tasks

### 3.3 Step 3: Make Changes

- Write clean, idiomatic code following the project's style
- Keep changes focused â€” one logical change per pull request
- Write or update tests for your changes
- Update documentation as needed
- Ensure your changes do not break existing tests

### 3.4 Step 4: Test

Run the relevant tests before submitting:
```bash
# Run all tests
cargo test

# Run frontend tests
cd frontend && npm test

# Run linting
cargo clippy
npm run lint

# Run type checking (if applicable)
npm run typecheck
```

### 3.5 Step 5: Commit

Write clear, descriptive commit messages:
```
<type>: <brief description>

<detailed description (optional)>

Fixes #<issue-number>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Example:
```
feat: add message search by date range

Implement date range filtering for the message search feature.
Users can now search messages between two dates using the
/range command or the search UI.

Closes #1234
```

### 3.6 Step 6: Submit Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a pull request against the `main` branch of the Libern repository
3. Fill in the pull request template completely
4. Link any related issues: `Closes #123` or `Related to #456`

### 3.7 Step 7: Review Process

Your pull request will be reviewed by maintainers:

1. **Automated checks:** CI runs tests, linting, and formatting
2. **Initial review:** A maintainer reviews within 3-5 business days
3. **Feedback:** Address review comments and push updates
4. **Final review:** Maintainer approves or requests changes
5. **Merge:** Approved PRs are squashed and merged by a maintainer

## 4. Code Review Standards

### 4.1 What Reviewers Look For

- **Correctness:** Does the code do what it claims?
- **Security:** Does the code introduce vulnerabilities?
- **Performance:** Is the code efficient?
- **Maintainability:** Is the code easy to understand and modify?
- **Testing:** Are there adequate tests?
- **Documentation:** Are changes documented?
- **Style:** Does the code follow project conventions?

### 4.2 Review Response Times

| Contribution Size | Expected Initial Review | Target Merge |
|-------------------|------------------------|--------------|
| Trivial (< 50 lines) | 1-2 business days | 3-5 business days |
| Small (50-200 lines) | 2-3 business days | 1 week |
| Medium (200-500 lines) | 3-5 business days | 2 weeks |
| Large (500+ lines) | 1 week | 3-4 weeks |

### 4.3 Handling Feedback

- Be respectful and responsive to reviewer feedback
- Explain your design decisions when questioned
- If you disagree with feedback, explain your reasoning
- Make requested changes promptly
- If you need clarification, ask

## 5. Code Standards

### 5.1 Rust Style

- Follow the Rust Style Guide
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Write documentation comments (`///`) for public APIs
- Use meaningful variable and function names
- Prefer safe Rust â€” use `unsafe` only when absolutely necessary and document
  why

### 5.2 TypeScript Style

- Follow the project's ESLint and Prettier configuration
- Use TypeScript strict mode
- Prefer const over let
- Use async/await over raw promises
- Use functional programming patterns when appropriate

### 5.3 General Guidelines

- Keep functions small and focused (one function = one responsibility)
- Prefer readability over cleverness
- Use descriptive names over comments
- Handle errors explicitly â€” avoid unwrap() in production code
- Test edge cases, not just the happy path

## 6. Testing Requirements

### 6.1 When Tests Are Required

- Bug fixes: Add a test that reproduces the bug
- New features: Add tests for the new functionality
- Refactoring: Ensure existing tests still pass

### 6.2 Test Types

- **Unit tests:** For individual functions and modules
- **Integration tests:** For module interactions
- **End-to-end tests:** For critical user workflows
- **Property-based tests:** For cryptographic and data processing code

### 6.3 Test Coverage

- Aim for 80%+ coverage on new code
- Critical security and crypto code: 95%+ coverage
- UI components: Focus on behavior, not rendering

## 7. Documentation Contributions

### 7.1 Types of Documentation

- **User guides:** How to use Libern features
- **Developer docs:** Architecture, API references, internals
- **Compliance docs:** Regulatory and legal documentation
- **Tutorials:** Step-by-step guides for common tasks
- **FAQ:** Frequently asked questions

### 7.2 Documentation Style

- Use clear, concise language
- Follow the existing document structure and headers
- Use proper Markdown formatting
- Include code examples where appropriate
- Link to related documentation

### 7.3 Documentation Build

Documentation is built using Markdown and hosted alongside the project.
Preview your changes:
```bash
# Some documentation may use a static site generator
# Check the docs/README.md for build instructions
```

## 8. Design Contributions

### 8.1 UI/UX Design

- UI changes should follow the existing design system
- Submit design proposals before implementation
- Use the project's Figma template (if available)
- Consider accessibility (WCAG 2.1 AA minimum)
- Support dark and light themes

### 8.2 Visual Assets

- Icons should use SVG format
- Follow the existing icon style guide
- Optimize SVG files for size
- Provide both light and dark variants

## 9. Translation Contributions

### 9.1 Adding a New Language

1. Check if the language is already supported
2. Create a new translation file in the translations directory
3. Translate all strings in the template file
4. Submit a pull request with the new translation

### 9.2 Translation Guidelines

- Maintain the same meaning, not literal translation
- Respect cultural differences in tone and formality
- Keep technical terms consistent
- Note any strings that do not translate well

## 10. Reporting Issues

### 10.1 Bug Reports

When reporting a bug, include:
- Libern version and operating system
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots or error messages (if applicable)
- Any relevant log files

### 10.2 Feature Requests

When requesting a feature:
- Describe the problem you are trying to solve
- Explain why it is important for Libern
- Suggest how the feature might work
- Describe any alternatives you have considered

## 11. Community Guidelines

### 11.1 Communication

- Be respectful and professional in all interactions
- Assume good faith from other contributors
- Give constructive feedback
- Accept feedback gracefully
- Use inclusive language

### 11.2 Code of Conduct

All contributors must follow the Libern Code of Conduct. Violations should be
reported to the Core Team.

### 11.3 Recognition

Contributors are recognized in:
- The contributors file in the repository
- Release notes
- Project website (for significant contributions)

## 12. Frequently Asked Questions

**Q: Do I need to sign a CLA?**
A: No. Libern does not require a Contributor License Agreement. By contributing
to an AGPL-3.0 project, your contributions are licensed under AGPL-3.0.

**Q: Can I contribute if I am not a programmer?**
A: Absolutely! We need help with documentation, translations, design, testing,
community support, and more.

**Q: How long does it take for a PR to be reviewed?**
A: We aim for initial review within 3-5 business days. Complex changes may
take longer.

**Q: What if my contribution is rejected?**
A: We provide reasons for rejection. You are welcome to ask questions, make
changes, and resubmit.

**Q: Can I be paid for contributing?**
A: Some contributions may be eligible for bounties or grants. Check the
project's funding page for opportunities.

## 14. Appendix: Contribution Checklist

Before submitting a pull request, verify:

- [ ] Code compiles without errors (`cargo build`)
- [ ] All tests pass (`cargo test`)
- [ ] Linting passes (`cargo clippy`, `npm run lint`)
- [ ] Formatting is correct (`cargo fmt`, `npm run format`)
- [ ] Documentation is updated
- [ ] Tests are added for new functionality
- [ ] No hardcoded secrets or credentials
- [ ] CHANGELOG entry is added (for significant changes)
- [ ] Commit messages follow the project convention
- [ ] PR description is complete and references related issues


## 16. Contribution Rewards and Recognition â€” Expanded

### 16.1 Recognition Tiers

| Tier | Criteria | Recognition |
|------|----------|-------------|
| Code Contributor | 1+ merged PR | Listed in CONTRIBUTORS.md |
| Significant Contributor | 10+ merged PRs | Release notes mention |
| Core Contributor | 50+ merged PRs | Project website listing |
| Maintainer | Sustained contribution + Core Team approval | Write access, voting rights |
| Core Team | Exceptional contribution + Steering approval | All maintainer rights + strategy input |

### 16.2 Sponsorship and Bounties

Libern participates in:
- **GitHub Sponsors:** Fund development of specific features
- **Bounty programs:** For security vulnerabilities and high-impact features
- **Grant funding:** Through partner organizations
- **Paid development:** Enterprise-sponsored features (with community approval)

## 17. Development Workflow â€” Detailed

### 17.1 Feature Branch Workflow

```
main branch
    â”‚
    â”œâ”€ feature/new-encryption    â† Feature development
    â”‚     â”‚
    â”‚     â”œâ”€ Commit 1: Add key exchange module
    â”‚     â”œâ”€ Commit 2: Implement encryption
    â”‚     â”œâ”€ Commit 3: Add tests
    â”‚     â””â”€ Commit 4: Update documentation
    â”‚     â”‚
    â”‚     â””â”€ PR â†’ main (squash merge)
    â”‚
    â”œâ”€ fix/crdt-convergence-bug  â† Bug fix
    â”‚     â””â”€ PR â†’ main
    â”‚
    â””â”€ release/v1.2.0           â† Release branch
```

### 17.2 Commit Message Examples

```
feat(crdt): add LWW-element-set merge optimization

Improve merge performance for large sets by using
a hashmap-based deduplication instead of linear scan.

Benchmark: 1000-element merge reduced from 45ms to 2ms.

Closes #789

---

fix(db): prevent race condition in WAL checkpointing

The WAL checkpoint was running concurrently with read
operations, causing intermittent integrity check failures.

Added a mutex guard around checkpoint operations.

Fixes #812
```

### 17.3 Code Review Checklist (Detailed)

**Security Review:**
- [ ] No hardcoded secrets or credentials
- [ ] No unsafe code blocks without justification
- [ ] Cryptographic operations use approved algorithms
- [ ] Input validation on all user-supplied data
- [ ] No new dependencies without security review
- [ ] Error messages do not leak sensitive information

**Performance Review:**
- [ ] No O(n^2) or worse algorithms in hot paths
- [ ] Database queries use appropriate indexes
- [ ] No unnecessary allocations in tight loops
- [ ] Async code properly handles backpressure

**Testing Review:**
- [ ] Unit tests cover the new functionality
- [ ] Edge cases are tested (empty input, null, boundary values)
- [ ] Error paths are tested
- [ ] Integration tests verify component interaction
- [ ] No reduction in overall test coverage

## 18. Real-World Contribution Examples

### 18.1 Example: Adding a New AI Command

```
1. Contributor opens discussion: "I want to add a /translate command"
2. Core Team responds: "Good idea â€” here are the requirements"
3. Contributor forks repo and creates branch `feature/translate-command`
4. Writes code:
   - crates/libern-core/src/ai/pipeline.rs: Add translation pipeline
   - apps/desktop/src/commands.ts: Add /translate command handler
   - docs/howto-community/04-using-ai-commands.md: Update docs
5. Runs: cargo test, npm test, cargo clippy
6. Submits PR with description and screenshots
7. Maintainer reviews within 3 days, requests minor changes
8. Contributor addresses feedback
9. PR merged in 1 week
10. Contributor added to release notes
```


## 15. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-06-19 | Libern Team | Initial contributing guide |

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
