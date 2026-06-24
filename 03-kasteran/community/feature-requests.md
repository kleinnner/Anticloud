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

# Kasteran* — Feature Request Process
© Lois-Kleinner & 0-1.gg 2026

## Overview

The feature request process allows community members to suggest and discuss improvements to Kasteran*. This structured process ensures that all feature requests are considered, evaluated, and prioritized transparently.

## Submission Template

When submitting a feature request, use this template:

```markdown
### Feature Request

**Name**: [Descriptive name]

**Problem**: What problem does this feature solve?

**Solution**: What is the proposed solution?

**Use Case**: Who would benefit and how?

**Example**: Show how this feature would be used.

**Prior Art**: How do other languages solve this?

**Alternatives**: What other approaches exist?

**Implementation**: Any ideas on how to implement?

**Breaking Changes**: Would this break existing code?
```

## Triage Process

### Initial Review
When a feature request is submitted:
1. **Label assignment**: Feature request label applied
2. **Duplicate check**: Check for existing requests
3. **Feasibility check**: Is it technically feasible?
4. **Scope check**: Is it within project scope?

### Labels
Feature requests are labeled for tracking:
- `feature-request`: Valid feature request
- `needs-discussion`: Requires more community input
- `needs-design`: Requires detailed design
- `good-first-issue`: Beginner-friendly feature
- `help-wanted`: Community help needed
- `deferred`: Not currently prioritized
- `declined`: Not accepted

## Prioritization

Features are prioritized based on:

### Criteria
- **Community demand**: Number of upvotes and comments
- **Alignment**: Fit with project vision
- **Impact**: Number of users who benefit
- **Effort**: Implementation complexity
- **Maintenance**: Long-term maintenance burden
- **Dependencies**: What else depends on this

### Priority Levels
| Priority | Response Time | Implementation |
|---|---|---|
| P0: Critical | Within 1 week | Next release |
| P1: High | Within 2 weeks | Within 3 months |
| P2: Medium | Within 1 month | Within 6 months |
| P3: Low | Within 3 months | Backlog |
| P4: Wishlist | Acknowledged | No timeline |

## Decision Making

### Community Feedback
- Feature requests are open for community discussion for at least 2 weeks
- Upvotes (👍) indicate community interest
- Comments provide additional context and use cases
- Core team considers community feedback in decisions

### Core Team Review
The core team reviews feature requests periodically:
- Monthly triage meeting
- Evaluate against roadmap
- Assign priority and owner
- Communicate decisions

## Tracking

Feature requests are tracked on GitHub:
- **Status**: Open, In Discussion, Planned, In Progress, Completed, Declined
- **Milestone**: Assigned to a release milestone
- **Assignee**: Core team member or volunteer
- **Linked PRs**: Related implementation pull requests

## From Request to RFC

If a feature request gains traction, it may proceed to an RFC:
1. Feature request is discussed
2. Consensus that it's worth pursuing
3. Contributor writes RFC
4. RFC goes through standard process
5. If accepted, feature is implemented

## Community Involvement

Community members can help:
- **Upvote**: Support features you want
- **Comment**: Provide use cases and requirements
- **Design**: Help with design and specification
- **Implement**: Volunteer to implement the feature
- **Test**: Test implementation when ready

## Conclusion

The feature request process ensures that all suggestions are heard, evaluated, and prioritized fairly. Community participation is essential for shaping the future of Kasteran*.
