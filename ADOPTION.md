# Adoption & Maturity Model

## Lifecycle Stages

```
Experimental → Incubating → Graduated → Core → Archived
```

| Stage | Criteria | Governance |
|-------|----------|------------|
| **Experimental** | Initial research, 5+ docs, clear README | Project creator |
| **Incubating** | 20+ docs, architecture diagram, working prototype | Project maintainer |
| **Graduated** | 50+ docs, community contributions, 3-month stability | Core Team oversight |
| **Core** | Critical infrastructure, 100+ docs, production-ready | Core Team + BDFL |
| **Archived** | No longer maintained, read-only | Core Team decision |

---

## Platform Projects

| Project | Stage | Docs | Maturity Indicators |
|---------|-------|------|---------------------|
| 01 Kathon | Incubating | 21 | Architecture documented, proof of concept |
| 02 Kamelot | Graduated | 99 | Full spec, tutorial, community contributions |
| 03 Kasteran | Graduated | 166 | Compiler spec, formal verification pipeline |
| 04 aioss-format | Incubating | 35 | Format spec, compliance mapping, migration path |
| 05 sovereign-os | Graduated | 173 | ISO build tutorial, 20 extensions, 25 tutorials |
| 06 api-oss | Core | 446 | 162 feature docs, 5 release phases, 30 papers |
| 07 MF+SO | Incubating | 83 | Comparative crypto analysis, hardware key support |
| 08 libern | Graduated | 126 | Full protocol spec, enterprise audit framework |
| 09 kazcade | Graduated | 158 | Performance benchmarks, columnar format spec |
| 10 Anticode | Incubating | 65 | Agent protocol, TUI spec, audit trail design |
| 11 inte11ect | Graduated | 122 | 72 module specs, routing algorithm documentation |

## Developer Tools (40)

| Category | Tools | Stage |
|----------|-------|-------|
| Security & Cryptography | 9 tools | Graduated |
| Compliance & Governance | 9 tools | Incubating |
| Analysis & Planning | 8 tools | Incubating |
| Developer Utilities | 14 tools | Incubating |

All 40 tools have consistent documentation: README, Quickstart, Tutorial, FAQ.

---

## How to Advance a Project

1. Meet the criteria for the next stage
2. Open a Governance RFC (see [GOVERNANCE.md](./GOVERNANCE.md))
3. Core Team reviews within 14 days
4. BDFL approval for Core stage promotions
