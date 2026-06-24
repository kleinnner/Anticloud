<!-- SEO -->
<meta name="description" content="Contribute to the Anticloud ecosystem — code, docs, research, testing, and community guidelines.">
<meta name="keywords" content="anticloud, contributing, open source, community">


<!-- Breadcrumb: Home > Contributing -->

![Contributing](https://img.shields.io/badge/Section-Contributing-ff9f0a?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Contributing

We welcome contributions across all Anticloud projects. This guide explains how to get involved.

## Ways to Contribute

- **Code**: Submit PRs to any project repository
- **Documentation**: Improve wiki pages, READMEs, and guides
- **Research**: Publish papers and datasets via Zenodo/Dataverse
- **Testing**: Report bugs and test new features
- **Community**: Answer questions on DEV, LinkedIn, and forums

## Development Workflow

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    FORK[Fork Repo] --> BRANCH[Create Branch]
    BRANCH --> CODE[Make Changes]
    CODE --> TEST[Run Tests]
    TEST --> PR[Open PR]
    PR --> REVIEW[Code Review]
    REVIEW --> MERGE[Merge]
    MERGE --> RELEASE[Release]
```

## Code Review Checklist

- [ ] Code compiles without warnings
- [ ] Tests pass
- [ ] Follows existing code style and conventions
- [ ] Cryptographic operations use Libern primitives
- [ ] New features include documentation
- [ ] Audit trail entries are included where applicable

## Project Repositories

| Project | Language | Status |
|---------|----------|--------|
| [Kathon](Kathon) | Rust | ![Beta](https://img.shields.io/badge/-beta-0071e3) |
| [Kamelot](Kamelot) | Rust | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) |
| [Kasteran](Kasteran) | Rust | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) |
| [Kazcade](Kazcade) | Rust | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) |
| [API-OSS](API-OSS) | Rust | ![Stable](https://img.shields.io/badge/-stable-34c759) |
| [Inte11ect](Inte11ect) | Go | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) |
| [aioss-format](aioss-format) | JSON | ![Stable](https://img.shields.io/badge/-stable-34c759) |
| [Libern](Libern) | Rust | ![Stable](https://img.shields.io/badge/-stable-34c759) |
| [Sovereign-OS](Sovereign-OS) | Linux | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) |
| [MFSO](MFSO) | Rust | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) |
| [Anticode](Anticode) | TypeScript | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) |

## Code of Conduct

All contributors must adhere to our [Code of Conduct](https://github.com/kleinnner/Anticloud/blob/main/CODE_OF_CONDUCT.md). Be respectful, inclusive, and constructive.

---

> 📖 **Full docs**: [Docusaurus Intro](https://kleinnner.github.io/Anticloud/docs/intro) · [Home](Home) · [Architecture](Architecture) · [Projects](Projects) · [Tools](Tools) · [Getting-Started](Getting-Started) · [Ecosystem](Ecosystem) · [FAQ](FAQ) · [Roadmap](Roadmap)
