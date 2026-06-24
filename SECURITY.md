# Security Policy

## Supported Versions

This repository contains research documentation only. Security disclosures apply to the research, specifications, and protocols described herein.

| Version | Supported |
|---------|-----------|
| latest  | ✅ |
| < latest| ❌ |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability in any Anticloud project specification, cryptographic protocol, or architecture design, please disclose it responsibly.

**Contact:** `kleinner@0-1.gg`

**PGP Key:** Available on request — email kleinner@0-1.gg with subject `PGP REQUEST`

### Disclosure Process

1. **Report** via email to `kleinner@0-1.gg` with full details, reproduction steps, and impact analysis.
2. **Acknowledgment** within 48 hours.
3. **Triage** within 5 business days — we will confirm the vulnerability and provide an estimated remediation timeline.
4. **Coordinated disclosure** 90 days after fix availability, unless both parties agree otherwise.

### What to Include

- Project name and version affected
- Type of vulnerability (cryptographic, protocol, implementation, architectural)
- Full description and proof of concept
- Impact assessment
- Suggested remediation (optional)

### Scope

This policy covers all projects in the `kleinnner/Anticloud` repository:
- 11 platform projects (`01-kathon` through `11-inte11ect`)
- 40 developer tools (`12-api-oss-tools/`)
- Cryptographic formats (`.aioss` ledger, hash chains, signature schemes)
- Communication protocols (P2P sync, CRDT convergence, identity)

### Out of Scope

- Markdown rendering issues
- Spelling or formatting errors
- Runtime environments where no Anticloud software is running

## Recognition

We maintain a security researcher hall of fame. Reporters of verified vulnerabilities will be credited in our research documentation (unless anonymity is requested).

## Coordinated Disclosure

We follow a 90-day coordinated disclosure window from the date a fix is made available. We request that vulnerabilities not be disclosed publicly before this window expires.
