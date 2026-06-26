▄▄                            ██     ▄▄   ▄▄▄                  ▄▄           
████                ██         ▀▀     ██  ██▀                   ██           
████    ██▄████▄  ███████    ████     ██▄██      ▄████▄    ▄███▄██   ▄████▄  
██  ██   ██▀   ██    ██         ██     █████     ██▀  ▀██  ██▀  ▀██  ██▄▄▄▄██ 
██████   ██    ██    ██         ██     ██  ██▄   ██    ██  ██    ██  ██▀▀▀▀▀▀ 
▄██  ██▄  ██    ██    ██▄▄▄   ▄▄▄██▄▄▄  ██   ██▄  ▀██▄▄██▀  ▀██▄▄███  ▀██▄▄▄▄█ 
▀▀    ▀▀  ▀▀    ▀▀     ▀▀▀▀   ▀▀▀▀▀▀▀▀  ▀▀    ▀▀    ▀▀▀▀      ▀▀▀ ▀▀    ▀▀▀▀▀ 

ANTIKODE — terminal-native AI coding engine
Lois-Kleinner and 0-1.gg 2026 Copyright

# Code Review

This guide explains how to use ANTIKODE's plan agent for code review, analyzing pull requests, and getting actionable feedback.

## Table of Contents

1. Understanding the Plan Agent
2. Initiating a Code Review
3. Review Depth Levels
4. Analyzing Changes
5. Security Review
6. Performance Review
7. Style and Standards Review
8. Architecture Review
9. Review Output
10. Iterating on Feedback
11. Team Review Workflows
12. CI Integration
13. Tips and Tricks
14. Troubleshooting

---

## 1. Understanding the Plan Agent

The plan agent is specialized for analysis, planning, and review tasks. It excels at:

- Deep code analysis
- Identifying issues and risks
- Suggesting improvements
- Generating structured feedback
- Understanding system interactions

### How It Differs from Build Agent

| Aspect | Build Agent | Plan Agent |
|--------|-------------|------------|
| Focus | Implementation | Analysis |
| Temperature | Higher (0.3-0.5) | Lower (0.1-0.2) |
| Output | Code | Feedback |
| Iterations | Many (execution) | Focused (analysis) |
| Tools | Read, Write, Edit | Read, Search, Analyze |

---

## 2. Initiating a Code Review

### Reviewing a PR

```
# Review the current PR
antikode run agent plan-agent "Review the current pull request"

# Review specific changes
antikode run agent plan-agent "Review the changes in src/auth/jwt.ts"

# Review against a branch
antikode run agent plan-agent "Review all changes between feature/refresh-token and develop"
```

### Reviewing Uncommitted Changes

```
# Review working directory changes
antikode run agent plan-agent "Review my uncommitted changes"

# Review staged changes
antikode run agent plan-agent "Review the changes I have staged for commit"
```

### Batch Review

```
# Review multiple files
antikode run agent plan-agent "Review these files for issues: src/auth/*.ts, src/middleware/*.ts"

# Review by pattern
antikode run agent plan-agent "Review all new files added in the last commit"
```

---

## 3. Review Depth Levels

### Quick Scan (Level 1)

```
# Fast surface-level review
antikode run agent plan-agent --mode quick "Check for obvious issues in the PR"
# Checks: syntax errors, type mismatches, missing imports
# Duration: 10-30 seconds
```

### Standard Review (Level 2)

```
# Balanced review
antikode run agent plan-agent "Review the PR for bugs, security issues, and code quality"
# Checks: logic errors, edge cases, security vulnerabilities, style violations
# Duration: 1-3 minutes
```

### Deep Dive (Level 3)

```
# Comprehensive review
antikode run agent plan-agent --mode deep "Do a thorough review of the authentication changes"
# Checks: all Level 2 + architecture, performance, test coverage, documentation
# Duration: 3-10 minutes
```

### Custom Depth

```
# Configure review depth
antikode run agent plan-agent \
  --config '{"depth":"custom","checks":["security","performance","test-coverage"]}' \
  "Review the API changes"
```

---

## 4. Analyzing Changes

### Understanding the Diff

```
# Get a summary of changes
antikode run agent plan-agent "Summarize what this PR does"

# Understand impact
antikode run agent plan-agent "What parts of the system are affected by these changes?"

# Dependency analysis
antikode run agent plan-agent "What other modules depend on the changed code?"
```

### Change Categories

The plan agent categorizes changes for focused review:

```
# Review by change type
antikode run agent plan-agent "Focus on the logic changes in this PR"
antikode run agent plan-agent "Check only the configuration changes"
antikode run agent plan-agent "Review the test changes"
```

### Contextual Understanding

```
# The agent understands the full context:
antikode run agent plan-agent "These changes add refresh token rotation. 
  Verify the implementation follows our security requirements and handles all edge cases."
```

---

## 5. Security Review

### Vulnerability Detection

The plan agent checks for common vulnerabilities:

```
# Run security-focused review
antikode run agent plan-agent "Security review of the auth module changes"
```

### What It Checks

| Category | Checks |
|----------|--------|
| Injection | SQL injection, command injection, XSS |
| Authentication | Token handling, session management, password storage |
| Authorization | Access control, privilege escalation |
| Data Exposure | Sensitive data logging, information disclosure |
| Input Validation | Missing validation, improper sanitization |
| Dependencies | Known vulnerable packages |
| Cryptography | Weak algorithms, improper key management |

### Security Review Output

```
## Security Review Findings

### Critical
- Line 45: SQL injection vulnerability in raw query
  Severity: CRITICAL
  Fix: Use parameterized query
  Example: db.query('SELECT * FROM users WHERE id = $1', [userId])

### High
- Line 89: JWT secret hardcoded in source
  Severity: HIGH
  Fix: Use environment variable: process.env.JWT_SECRET

### Medium
- Line 156: Missing rate limiting on login endpoint
  Severity: MEDIUM
  Fix: Add rate limiter middleware
```

---

## 6. Performance Review

### Performance Analysis

```
# Performance-focused review
antikode run agent plan-agent "Analyze the performance impact of these changes"
```

### What It Checks

| Aspect | Example Issues |
|--------|---------------|
| Database queries | N+1 queries, missing indexes |
| Memory | Large allocations, memory leaks |
| Async | Missing awaits, blocking operations |
| Caching | Missed caching opportunities |
| Bundle size | Large imports, tree-shaking issues |
| Network | Chatty APIs, serialization overhead |
| Rendering | Unnecessary re-renders, heavy computations |

### Performance Recommendations

```
## Performance Review

### High Impact
- src/services/auth.ts:156 - N+1 query pattern detected
  Each user lookup triggers a separate database query
  Fix: Use eager loading or batch query
  
### Medium Impact
- src/middleware/auth.ts:34 - Synchronous crypto operation
  jwt.verify() blocks the event loop
  Consider: Use the async version for high-traffic endpoints
```

---

## 7. Style and Standards Review

### Code Style Checks

```
# Style review
antikode run agent plan-agent "Check if the changes follow our coding standards"
```

### What It Checks

```
## Style Review

### Follows Standards: Yes (with exceptions)

### Issues Found
- src/auth/jwt.ts:23 - Use named exports instead of default export
  Our convention: export const verifyToken = ...
  
- src/auth/jwt.ts:67 - Missing return type annotation
  Add: function decodeToken(token: string): TokenPayload

- src/auth/jwt.ts:89 - Line exceeds 100 characters
  Break into multiple lines following Prettier config
```

### Standards Configuration

```
// .antikode/review-standards.yaml
standards:
  typescript:
    strict: true
    noImplicitAny: true
    preferNamedExports: true
    
  naming:
    functions: camelCase
    classes: PascalCase
    constants: UPPER_CASE
    files: kebab-case
    
  patterns:
    - "Use early returns over nested ifs"
    - "Prefer async/await over raw promises"
    - "All public functions must have JSDoc"
```

---

## 8. Architecture Review

### System Impact Analysis

```
# Architecture review
antikode run agent plan-agent --mode deep "Review the architectural impact of adding refresh token rotation"
```

### Architecture Feedback

```
## Architecture Review

### Strengths
- Clean separation of concerns in auth service
- Good use of dependency injection
- Follows existing patterns

### Concerns
- Token storage in database may become a bottleneck
  Consider: Add Redis caching layer for token validation
- New dependency on uuid package
  Consider: Use built-in crypto.randomUUID()

### Recommendations
- Extract token management into its own module
- Add a repository pattern for token storage
- Consider event-driven architecture for token revocation
```

### Coupling Analysis

```
# Check for tight coupling
antikode run agent plan-agent "Analyze coupling between the new code and existing modules"
```

---

## 9. Review Output

### Output Format

The plan agent produces structured review output:

```
## Code Review: PR #142 - Refresh Token Rotation

### Summary
- Files changed: 5
- Lines added: 234
- Lines removed: 67
- Review time: 2m 34s

### Findings: 8 (2 Critical, 3 High, 2 Medium, 1 Low)

### Critical
[Details as shown above]

### High
[Details as shown above]

### Medium
[Details as shown above]

### Low
[Details as shown above]

### Overall Assessment
The implementation is generally solid. The two critical issues should be 
addressed before merging. The architectural approach aligns well with our 
existing patterns.

### Recommendations
1. Fix SQL injection vulnerability immediately
2. Move JWT secret to environment variable
3. Add rate limiting to auth endpoints
4. Consider extracting token validation to middleware
```

### Output Formats

```
# Markdown (default)
antikode run agent plan-agent "Review PR" --output-format markdown

# JSON (for programmatic processing)
antikode run agent plan-agent "Review PR" --output-format json

# GitHub PR comment format
antikode run agent plan-agent "Review PR" --output-format github
```

---

## 10. Iterating on Feedback

### Addressing Feedback

```
# After fixing identified issues, re-review
antikode run agent plan-agent "Re-review the auth changes after fixing the SQL injection"

# Focused re-review
antikode run agent plan-agent "Check that all critical and high findings are resolved"
```

### Tracking Review History

```
# Show review history for this PR
antikode review history --pr 142

# Compare reviews
antikode review compare --review-1 review-001 --review-2 review-002
```

---

## 11. Team Review Workflows

### Assigning Reviews

```
# Auto-assign reviewers based on expertise
antikode review assign --pr 142 --strategy expertise

# Request specific review type
antikode review request --pr 142 --type security --reviewer security-team
```

### Review Schedules

```
# Batch review all open PRs
antikode review batch --status open --team frontend-squad

# Daily review summary
antikode review summary --since yesterday
```

---

## 12. CI Integration

### Automated PR Review

```
// .github/workflows/antikode-review.yml
name: Automated Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run ANTIKODE review
        run: |
          antikode run agent plan-agent \
            "Review this PR and post findings as PR comments" \
            --output-format github \
            --ci-mode
        env:
          ANTK_API_KEY: ${{ secrets.ANTK_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Quality Gates

```
// Review quality gates
antikode review gate --pr 142 \
  --require "no-criticals" \
  --require "test-coverage > 80%" \
  --require "all-high-fixed"

// Gate result: PASS (all requirements met)
// or FAIL: "Critical issues found. Fix before merging."
```

---

## 13. Tips and Tricks

### Effective Reviews

```
// Focus the review:
// Bad: "Review this PR"
// Good: "Review this PR focusing on token handling security and 
//        verify that expired tokens are properly rejected"
```

### Context Matters

```
// Provide business context:
antikode run agent plan-agent "This PR implements SOC 2 required 
  audit logging. Verify it meets compliance requirements for 
  user action tracking."
```

### Combine with Other Tools

```
// Run linter first, then review
npm run lint && antikode run agent plan-agent "Review the lint fixes"
```

---

## 14. Troubleshooting

### Review Too Slow

```
# Reduce scope
antikode run agent plan-agent --scope "security-only" "Quick security check"

# Use faster model
antikode run agent plan-agent --model fast "Surface-level review"
```

### Too Many False Positives

```
# Adjust sensitivity
antikode run agent plan-agent \
  --config '{"sensitivity":"high","minSeverity":"medium"}' \
  "Review changes"
```

### Missing Context

```
# Provide explicit context
antikode context add "Project uses Prisma ORM, not raw SQL"
antikode run agent plan-agent "Review database changes"
```

---

This concludes the code review guide. For refactoring workflows, see the refactoring documentation.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ