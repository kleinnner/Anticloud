<!--
     ▄▄▄   ▄▄▄  ▄▄▄  ▄▄▄▄▄▄▄▄              ▄▄▄▄      ▄▄▄▄     ▄▄▄     
    ██     ███  ███  ██▀▀▀▀▀▀            ▄█▀▀▀▀█    ██▀▀██      ██    
    ██     ████████  ██           ██     ██▄       ██    ██     ██    
    ██     ██ ██ ██  ███████   ▄▄▄██▄▄▄   ▀████▄   ██ ██ ██     ██    
  ▀▀█▄     ██ ▀▀ ██  ██        ▀▀▀██▀▀▀       ▀██  ██    ██     ▄█▀▀  
    ██     ██    ██  ██           ██     █▄▄▄▄▄█▀   ██▄▄██      ██    
    ██     ▀▀    ▀▀  ▀▀                   ▀▀▀▀▀      ▀▀▀▀       ██    
    ▀█▄▄                                                      ▄▄█▀    

MF+SO — Multi Factor+ Sign On
by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner
The Sovereign Identity & Authentication Vault
-->

# GitHub Issues Guide

> **Last Updated:** 2026-06-19
> **Category:** Support

## Overview

MF+SO uses GitHub Issues for bug tracking and feature requests. This guide explains how to file effective reports that help our team understand and resolve your issues quickly.

## Repository

**URL:** https://github.com/mfso/mfso/issues

## Issue Templates

When creating a new issue, you'll be prompted to choose a template:

- **Bug Report** — For reporting software bugs and unexpected behavior
- **Feature Request** — For suggesting new features or improvements
- **Security Vulnerability** — DO NOT USE; report via security@mfso.io
- **Question** — For general questions (prefer Discord for quick answers)

## Filing a Bug Report

### Before Filing

1. **Search existing issues** — Check if the bug has already been reported
2. **Check known issues** — See `docs/help-bugs/01-known-issues.md`
3. **Update to latest version** — The bug may have been fixed in a newer release
4. **Try basic troubleshooting** — Restart app, restart device, reinstall

### Bug Report Template

```markdown
## Bug Description
[Clear, concise description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Tap on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Screenshots / Recordings
[If applicable, add screenshots or screen recordings]

## Environment
### App Version:
[Settings > About > Version]
### OS Version:
[iOS 17.4 / Android 14 / macOS 14.4 / Windows 11 24H2 / Ubuntu 22.04]
### Device Model:
[iPhone 15 Pro / Pixel 8 / MacBook Pro M3 / ThinkPad X1]
### Browser (if applicable):
[Chrome 120 / Firefox 125 / Safari 17]

## Additional Context
- Did this work before? [Yes/No]
- If yes, which version did it work on?
- Is this intermittent or consistent?
- Does it happen with a specific account or all accounts?

## Logs
[Attach logs: Settings > Help > Export Logs]
[Or paste relevant portion of logs here]
```

### Example: Good Bug Report

```markdown
## Bug Description
TOTP codes for GitHub accounts show "Expired" 2 seconds before the actual expiry

## Steps to Reproduce
1. Open MF+SO
2. Go to account list
3. Tap on "GitHub (Personal)"
4. Observe the countdown timer

## Expected Behavior
The code should remain valid until the full 30-second window expires

## Actual Behavior
At the 28-second mark (2 seconds early), the code shows as "Expired" for 1-2 seconds before the next code appears

## Screenshots
[screenshot showing expired state at 28s]

## Environment
- App Version: 2.5.3
- OS Version: iOS 17.4
- Device Model: iPhone 15 Pro

## Additional Context
- This has been happening since v2.5.0
- Occurs consistently on all accounts
- The code is still valid during the "Expired" display

## Logs
[logs attached]
```

### Example: Poor Bug Report

```markdown
app broken plz fix

something wrong with codes

iphone
```

## Filing a Feature Request

### Feature Request Template

```markdown
## Feature Description
[Clear description of the requested feature]

## Problem Statement
[What problem does this feature solve?]

## Proposed Solution
[How should the feature work?]

## Alternatives Considered
[What other approaches have you considered?]

## Use Case
[Describe a specific scenario where this feature would be useful]

## Related Issues
[Link to any related discussions or issues]

## Additional Context
[Any other information, mockups, or references]
```

### Example: Good Feature Request

```markdown
## Feature Description
Add the ability to organize accounts into folders/tags

## Problem Statement
I have over 200 accounts in my vault and scrolling through the flat list is becoming difficult to manage. I need a way to organize accounts by category (e.g., Work, Personal, Finance)

## Proposed Solution
Implement a folder/tag system where users can:
- Create folders in the account list
- Drag and drop accounts between folders
- Assign tags to accounts (an account can have multiple tags)
- Filter and search by folder/tag
- Sync folder organization across devices

## Alternatives Considered
1. Favorites/bookmarks — only helps with a subset
2. Search — requires knowing what to search for
3. External organization — not integrated

## Use Case
I have accounts for work (GitHub, Jira, Slack), personal (Twitter, Instagram), and finance (Bank of America, Chase). I'd like to quickly switch between these categories.

## Related Issues
#4567 - Group accounts by category
#7890 - Tag support for accounts
```

## Issue Labels

Our team uses labels to categorize issues:

### Type Labels
| Label | Meaning |
|---|---|
| `bug` | Confirmed software bug |
| `feature-request` | New feature suggestion |
| `enhancement` | Improvement to existing feature |
| `question` | General question |
| `documentation` | Documentation issue |

### Priority Labels
| Label | Meaning |
|---|---|
| `priority-critical` | Must fix immediately |
| `priority-high` | Should fix soon |
| `priority-medium` | Fix in current/next milestone |
| `priority-low` | Nice to have |

### Status Labels
| Label | Meaning |
|---|---|
| `status-triaging` | Awaiting initial review |
| `status-accepted` | Confirmed, on the list to fix |
| `status-in-progress` | Currently being worked on |
| `status-fixed` | Fix completed, awaiting release |
| `status-needs-info` | Need more information from reporter |
| `status-wont-fix` | Will not be fixed (with explanation) |
| `status-duplicate` | Already reported |
| `status-by-design` | Working as intended |

## Issue Lifecycle

```
Issue Created
      │
      ▼
Triaging (automated label assignment)
      │
      ▼
Community Manager / Bot assigns appropriate labels
      │
      ▼
┌──────────────────────────────────────────────────────┐
│                  Needs More Info?                     │
├───────────────────YES────────────────────NO──────────┤
│                    │                    │            │
│                    ▼                    ▼            │
│        Bot adds "needs-info"     Product team         │
│        label, asks for more       reviews issue       │
│        information                                    │
│                    │                    │            │
│                     │                   ▼            │
│                     │         ┌──────────────────┐  │
│                     │         │  Review Decision  │  │
│                     │         ├────────┬─────────┤  │
│                     │         │ Accept │ Reject   │  │
│                     │         └───┬────┴─────────┘  │
│                     │             │                 │
│                     ▼             ▼                 │
│              Reporter returns   │                   │
│              with info           ▼                   │
│                                 │    │               │
│                                 │    └──→ Closed     │
│                                 │          │         │
│                                 ▼          ▼         │
│                          Milestone    Wont Fix       │
│                              │                       │
│                              ▼                       │
│                          In Progress                 │
│                              │                       │
│                              ▼                       │
│                          Fix Committed                │
│                              │                       │
│                              ▼                       │
│                          Fix Released                 │
│                              │                       │
│                              ▼                       │
│                          Issue Closed                 │
└──────────────────────────────────────────────────────┘
```

## Best Practices

### Do's
- **Search first** — Check if your issue already exists
- **One issue per report** — Keep bug reports focused on a single problem
- **Use the template** — It ensures we have all necessary information
- **Be specific** — "Crashes when I tap X" is better than "App crashes"
- **Attach logs** — They provide crucial diagnostic information
- **Respond to questions** — Check back if we ask for more information
- **Update status** — Close the issue if you solve it yourself
- **Be respectful** — Remember there's a human on the other end

### Don'ts
- **Don't report security issues** publicly — email security@mfso.io instead
- **Don't create duplicate issues** — Comment on existing issues instead
- **Don't use issues for personal support** — Use Discord for quick questions
- **Don't demand attention** — Bumping comments doesn't help
- **Don't include** master passwords, seed phrases, or other secrets
- **Don't post screenshots of TOTP codes**

## Using GitHub Reactions

| Reaction | Meaning |
|---|---|
| 👍 | I have this issue too / I want this feature |
| 🎉 | This issue is resolved for me |
| ❤️ | Thank you / this is great |
| 🚀 | This will help me |
| 👀 | I'm watching this issue |

Don't use +1 comments; use reactions instead.

## Issue Voting

Feature requests can be upvoted using the 👍 reaction. Highly voted features are reviewed quarterly for roadmap inclusion.

## Reporting Security Issues

**DO NOT** file security issues in the public GitHub issue tracker.

Instead:
- Email: security@mfso.io
- HackerOne: https://hackerone.com/mfso
- PGP key: https://mfso.io/.well-known/security.txt

## Community Recognition

Community members who consistently file high-quality bug reports and feature requests may receive:
- **Bug Bounty rewards** — For qualifying security issues
- **Contributor badge** — On Discord and GitHub
- **Beta access** — To new features
- **Community spotlight** — Recognition in release notes

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*