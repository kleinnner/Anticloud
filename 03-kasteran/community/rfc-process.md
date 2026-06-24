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

# Kasteran* — RFC Process
© Lois-Kleinner & 0-1.gg 2026

## Overview

The Request for Comments (RFC) process is the primary mechanism for proposing significant changes to Kasteran*. It ensures that changes are thoroughly discussed, documented, and agreed upon before implementation. This process promotes transparency, collaboration, and thoughtful decision-making.

## When to Use RFCs

An RFC is required for:
- New language features
- Significant API changes
- Standard library additions
- Process or governance changes
- Breaking changes
- Major tooling changes

An RFC is not required for:
- Bug fixes
- Minor improvements
- Documentation updates
- Test additions

## RFC Lifecycle

```
Draft → Discussion → Refinement → Final Comment → Decision → Accepted/Rejected
                                                                    ↓
                                                             Implementation
```

## RFC Process Steps

### 1. Pre-RFC Discussion
Before writing a formal RFC, discuss the idea:
- Open a GitHub Discussion
- Get feedback from the community
- Refine the proposal
- Gauge interest and support

### 2. Draft RFC
Write the RFC following the template:

```markdown
# RFC-NNNN: Title

## Summary
Brief description of the proposal

## Motivation
Why is this change needed?

## Detailed Design
Technical specification of the change

## Drawbacks
Potential disadvantages

## Alternatives
Other approaches considered

## Unresolved Questions
Open questions to be resolved
```

### 3. Submit RFC
Create a pull request adding the RFC to the repository:
- File: `rfcs/NNNN-title.md`
- PR title: `rfc(NNNN): title`

### 4. Discussion Period
The RFC enters a discussion period:
- **Minimum**: 2 weeks
- **Maximum**: 6 weeks
- **Purpose**: Community feedback and refinement
- **Format**: PR comments and review

### 5. Refinement
Based on feedback, the RFC author may:
- Update the RFC content
- Add clarifications
- Address concerns
- Propose modifications

### 6. Final Comment Period (FCP)
When the RFC is mature:
- Core team proposes FCP
- FCP lasts 1 week
- No major changes during FCP
- Final comments collected

### 7. Decision
The core team makes a decision:
- **Accepted**: RFC is merged, implementation can begin
- **Rejected**: RFC is closed with explanation
- **Postponed**: RFC is tabled for future consideration

## RFC Template

```
RFC: NNNN
Title: [Title]
Author: [Name]
Status: [Draft | Accepted | Rejected | Implemented]
Date: [YYYY-MM-DD]

## Summary
One-paragraph summary of the proposal.

## Motivation
Why this change is needed, what problems it solves.

## Detailed Design
Complete technical specification.

## Drawbacks
Why we might not want to do this.

## Rationale and Alternatives
Why this approach over alternatives.

## Prior Art
How other languages solve similar problems.

## Unresolved Questions
What is not yet decided.

## Implementation Plan
How and when this would be implemented.
```

## RFC Statuses

| Status | Meaning |
|---|---|
| Draft | RFC is being written |
| Discussion | RFC is under community review |
| FCP | Final Comment Period |
| Accepted | RFC approved, ready for implementation |
| Rejected | RFC declined with explanation |
| Postponed | Deferred for future consideration |
| Implemented | Changes have been merged |

## Decision-Making

Decisions are made by the core team based on:
- Technical merit
- Community consensus
- Alignment with project goals
- Implementation feasibility
- Maintenance burden

## Conclusion

The RFC process ensures that significant changes to Kasteran* are well-designed, thoroughly discussed, and have community buy-in. It is a cornerstone of transparent and collaborative governance.
