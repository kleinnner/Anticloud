▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: Developer Guide
Document ID: DEV-002
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Contributing Code

## Introduction

This guide outlines the contribution workflow for the Libern project. It covers code style conventions, the pull request (PR) workflow, code review process, testing requirements, and best practices for writing high-quality contributions. Whether you are fixing a bug, adding a feature, or improving documentation, following these guidelines ensures a smooth collaboration experience.

Libern is a community-driven project and contributions are welcome at every level. The project maintains a code of conduct based on respect, inclusivity, and constructive collaboration.

By the end of this guide, you will understand:
- The coding standards and style conventions for Rust and TypeScript
- The PR workflow from fork to merge
- The code review process and what reviewers look for
- How to write and run tests for your changes
- Commit message conventions and changelog requirements
- How dependencies are managed
- The CI/CD pipeline and release process

---

## Part 1: Code Style Conventions

### Rust Code Style

Libern follows the standard Rust style conventions enforced by `rustfmt` and `clippy`.

#### Formatting

```bash
# Auto-format all Rust code
cargo fmt

# Check formatting without changes
cargo fmt --check
```

Formatting rules (configured in `rustfmt.toml`):
- Indentation: 4 spaces (no tabs)
- Line width: 100 characters
- Imports: grouped by std/external/crate, separated by blank lines
- `use` statements: single items per line (not `use a::b::{c, d}`)

Example:
```rust
use std::collections::HashMap;
use std::sync::Mutex;

use rusqlite::params;
use serde::{Deserialize, Serialize};

use crate::db::Database;
use crate::models::User;
```

#### Linting

```bash
# Run Clippy checks
cargo clippy --all-targets --all-features -- -D warnings
```

All contributions must pass Clippy with no warnings (`-D warnings`). Key Clippy lints enforced:
- `clippy::pedantic` — Most pedantic lints are expected
- `clippy::unwrap_used` — Prefer `?` operator or `.expect("reason")` over `.unwrap()`
- `clippy::cast_lossless` — Explicit type casting
- `clippy::doc_markdown` — Proper documentation formatting

#### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Modules | `snake_case` | `server.rs`, `message.rs` |
| Types/Structs | `PascalCase` | `Server`, `AiossHeader` |
| Functions/Methods | `snake_case` | `create_server`, `send_message` |
| Constants | `SCREAMING_SNAKE_CASE` | `PERM_MANAGE_SERVER` |
| Enum variants | `PascalCase` | `Classification::Safe` |
| Local variables | `snake_case` | `channel_id`, `user_count` |
| Type parameters | single uppercase | `T`, `E`, `K`, `V` |

#### Error Handling

- Use `Result<T, String>` for Tauri command return types (Tauri serialization requirements).
- Use custom error types for internal logic.
- Use `anyhow` for complex error propagation in internal code.
- Always provide meaningful error messages.
- Prefer `?` operator over unwrap/expect in production code.

```rust
// Good
pub fn create_server(db: &Database, name: &str) -> Result<Server, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    // ...
    Ok(server)
}

// Avoid
pub fn create_server(db: &Database, name: &str) -> Server {
    let conn = db.conn.lock().unwrap();
    // ...
}
```

#### Documentation

- All public items (structs, functions, traits) must have doc comments (`///`).
- Include `# Errors`, `# Panics`, and `# Safety` sections where applicable.
- Use code blocks in doc comments for examples.

```rust
/// Creates a new server in the database.
///
/// # Arguments
/// * `db` - Database state
/// * `name` - Server display name
/// * `owner_id` - User ID of the server owner
///
/// # Errors
/// Returns `Err` if the database operation fails or the name is empty.
///
/// # Example
/// ```rust
/// let server = create_server(&db, "My Server", &user_id)?;
/// ```
#[tauri::command]
pub fn create_server(
    db: State<Database>,
    name: String,
    owner_id: String,
) -> Result<Server, String> {
    // ...
}
```

### TypeScript / React Code Style

#### Formatting

```bash
# Auto-format all TypeScript/CSS
pnpm format
```

Configuration in `.prettierrc`:
```json
{
    "semi": true,
    "singleQuote": false,
    "tabWidth": 2,
    "trailingComma": "all",
    "printWidth": 100,
    "arrowParens": "always"
}
```

#### Linting

```bash
# Run ESLint
pnpm lint
```

ESLint configuration extends the recommended rulesets:
```javascript
// .eslintrc.cjs
module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    plugins: ["react-refresh"],
    rules: {
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
};
```

#### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | `PascalCase` | `MessageList`, `ServerIcon` |
| Hooks | `camelCase` (prefix `use`) | `useLiberStream`, `useAiStatus` |
| Stores | `camelCase` | `uiStore`, `serverStore` |
| Functions | `camelCase` | `sendMessage`, `getServers` |
| Interfaces | `PascalCase` | `Server`, `Channel` |
| Types | `PascalCase` | `ViewType`, `AiToken` |
| Files | `camelCase` | `messageList.tsx`, `api.ts` |

#### React Best Practices

- Use functional components with hooks.
- Keep components small and focused (single responsibility).
- Extract reusable logic into custom hooks.
- Use TypeScript strict mode (`strict: true` in `tsconfig.json`).
- Props interfaces should be defined at the top of the component file.
- Use `React.FC` or implicit return type.

```typescript
// Good
interface MessageListProps {
    channelId: string;
    messages: Message[];
    isLoading: boolean;
}

export function MessageList({ channelId, messages, isLoading }: MessageListProps) {
    // ...
}

// Avoid (mixing concerns)
export function MessageList({ channelId, messages }: { channelId: string; messages: Message[] }) {
    // ...
}
```

#### State Management

- Use Zustand stores for global state (server list, UI state).
- Use TanStack Query for server state caching (Tauri command results).
- Use React's `useState` for local component state.
- Use `useCallback` and `useMemo` for performance optimization where needed.

```typescript
// Zustand store example
interface UiState {
    view: ViewType;
    selectedServerId: string | null;
    selectedChannelId: string | null;
}

export const useUiStore = create<UiState>()((set) => ({
    view: "chat",
    selectedServerId: null,
    selectedChannelId: null,
    setView: (view: ViewType) => set({ view }),
}));
```

### CSS / Tailwind

- Use Tailwind utility classes for most styling.
- Extract repeated patterns into component classes or Tailwind `@apply` directives.
- Custom CSS goes in `index.css` or `liber.css`.
- Avoid inline styles.

#### Color Palette

The Tailwind configuration defines custom colors:

```javascript
// tailwind.config.js
colors: {
    "discord-dark": "#1e1f22",
    "discord-darker": "#111214",
    "discord-sidebar": "#2b2d31",
    "discord-channel": "#313338",
    "discord-hover": "#3c3f45",
    "discord-accent": "#5865f2",
    "discord-green": "#23a55a",
    "discord-red": "#da373c",
    "discord-yellow": "#f0b232",
}
```

---

## Part 2: Branch Strategy

### Branch Naming

| Pattern | Purpose |
|---------|---------|
| `main` | Stable, release-ready code |
| `develop` | Integration branch for features |
| `feat/<name>` | New feature development |
| `fix/<name>` | Bug fixes |
| `docs/<name>` | Documentation changes |
| `refactor/<name>` | Code refactoring |
| `chore/<name>` | Build process, dependencies, tooling |

Examples:
```
feat/voice-activity-detection
fix/message-deletion-cascade
docs/contributing-guide
refactor/ai-engine-trait
chore/update-deps
```

### Branch from Develop

All feature branches should branch from `develop` and merge back into `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feat/my-feature
```

---

## Part 3: Pull Request Workflow

### Step 1: Create a Fork

Fork the repository on GitHub and clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/libern.git
cd libern
git remote add upstream https://github.com/libern/libern.git
```

### Step 2: Create a Feature Branch

```bash
git checkout -b feat/your-feature
```

### Step 3: Make Changes

- Follow the code style conventions.
- Write tests for your changes.
- Update documentation as needed.
- Keep commits focused and atomic.

### Step 4: Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat` — A new feature
- `fix` — A bug fix
- `docs` — Documentation changes
- `style` — Code style changes (formatting, etc.)
- `refactor` — Code refactoring
- `test` — Adding or fixing tests
- `chore` — Build process, dependencies, etc.

Examples:
```
feat(voice): add voice activity detection indicator
fix(message): cascade delete reactions on message delete
docs(api): update Tauri command reference
refactor(ai): extract prompt building into pipeline module
test(crdt): add unit tests for LWW element set merge
```

### Step 5: Run Local Checks

Before pushing, run the full check suite:

```bash
# Rust
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test

# TypeScript
pnpm lint
pnpm typecheck
pnpm test
```

### Step 6: Push and Create PR

```bash
git push origin feat/your-feature
```

Create a Pull Request on GitHub with:
- **Clear title** following conventional commit format.
- **Description** explaining what the PR does, why, and how.
- **Related issues** referenced (e.g., "Closes #42").
- **Screenshots** for UI changes.
- **Checklist** of completed items.

### Pull Request Template

```markdown
## Description
[Describe the changes in detail]

## Related Issue
Closes #[issue_number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Build/CI change

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

---

## Part 4: Code Review Process

### Reviewer Expectations

Reviewers check for:

1. **Correctness** — Does the code do what it claims?
2. **Security** — Are there any vulnerabilities? (input validation, SQL injection, etc.)
3. **Performance** — Are there obvious performance issues?
4. **Style** — Does it follow project conventions?
5. **Testability** — Is the code testable? Are tests included?
6. **Documentation** — Are public APIs documented?
7. **Error handling** — Are errors handled gracefully?
8. **Edge cases** — Are edge cases considered? (empty inputs, null values, etc.)

### Review Process

1. **Author** submits PR.
2. **CI** runs automated checks (lint, test, build).
3. At least **one maintainer review** required.
4. Reviewer may request changes.
5. Author addresses feedback and pushes updates.
6. Reviewer approves.
7. PR is merged (squash merge preferred).

### Review Comments

- Be constructive and specific.
- Use GitHub's suggestion feature for code changes.
- Explain *why* a change is needed, not just *what*.
- Separate blocking issues from style suggestions.

---

## Part 5: Testing Requirements

### Rust Tests

#### Unit Tests

Write unit tests in the same file as the code, in a `#[cfg(test)]` module:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_invite_code_length() {
        let code = generate_invite_code();
        assert_eq!(code.len(), 12);
    }

    #[test]
    fn test_check_permission_with_no_roles() {
        let result = check_permission_internal(&conn, "user1", "server1", PERM_SEND_MESSAGES);
        assert!(!result);
    }

    #[test]
    fn test_hlc_monotonic_increase() {
        let mut hlc = HybridLogicalClock::new(1000);
        let t1 = hlc.now();
        let t2 = hlc.now();
        assert!(t2 > t1);
    }
}
```

#### Integration Tests

Integration tests in `apps/desktop/src-tauri/tests/integration.rs` test the full Tauri command pathway:

```rust
#[cfg(test)]
mod integration_tests {
    #[test]
    fn test_create_and_get_server() {
        let app = setup_test_app();
        // Create server
        let server = create_server_command(&app, "Test Server", "user1");
        assert_eq!(server.name, "Test Server");
        // Get servers
        let servers = get_servers_command(&app);
        assert_eq!(servers.len(), 1);
    }
}
```

### TypeScript Tests

#### Vitest Unit Tests

```typescript
// messageStore.test.ts
import { describe, it, expect } from "vitest";

describe("messageStore", () => {
    it("should add a message to the channel", () => {
        const store = useMessageStore.getState();
        const message: Message = {
            id: "1",
            channel_id: "ch1",
            author_id: "user1",
            content: "Hello",
            hlc_timestamp: Date.now(),
            signature: [],
            created_at: Date.now(),
        };
        store.addMessage("ch1", message);
        expect(store.messages.get("ch1")).toHaveLength(1);
    });
});
```

#### Component Tests

```typescript
// MessageInput.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MessageInput } from "./MessageInput";

describe("MessageInput", () => {
    it("should call onSend when Enter is pressed", () => {
        const onSend = vi.fn();
        render(<MessageInput channelId="ch1" onSend={onSend} />);
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "Hello" } });
        fireEvent.keyDown(input, { key: "Enter" });
        expect(onSend).toHaveBeenCalledWith("Hello");
    });
});
```

### Running Tests

```bash
# Run all Rust tests
cargo test --workspace

# Run specific Rust test
cargo test test_generate_invite_code_length

# Run TypeScript tests
pnpm test

# Run with coverage
cargo tarpaulin --ignore-tests
pnpm test -- --coverage
```

### Test Coverage Targets

| Area | Target |
|------|--------|
| Core CRDT logic | 95%+ |
| Tauri commands | 80%+ |
| Database operations | 85%+ |
| Frontend components | 70%+ |
| AI pipeline | 60%+ |

---

## Part 6: Documentation Requirements

### When to Update Docs

Documentation must be updated when:
- Adding a new Tauri command (update API reference).
- Changing an existing command signature.
- Adding a new React component.
- Changing the database schema.
- Adding or changing user-facing features.
- Changing build or setup instructions.

### Documentation Files

| Type | Location | Format |
|------|----------|--------|
| API reference | `docs/api/` | Markdown |
| Tutorials | `docs/tutorial/` | Markdown |
| How-to guides | `docs/howto-*/` | Markdown |
| Architecture docs | `docs/research/` | Markdown |
| Inline code docs | Source files | Doc comments |

### Documenting Tauri Commands

Each Tauri command should have:
1. A doc comment in the Rust source with `# Arguments` and `# Errors` sections.
2. An entry in the TypeScript API layer (`lib/api.ts`) with typed parameters.
3. Documentation in the relevant how-to or tutorial guide.

---

## Part 7: Dependency Management

### Rust Dependencies

- Add dependencies in `apps/desktop/src-tauri/Cargo.toml` for desktop-specific code.
- Add dependencies in `crates/libern-core/Cargo.toml` for shared core code.
- Use `cargo add <crate>` to add dependencies (ensures correct version specification).
- Pin major versions; allow minor/patch updates with `^` or `>=`.

```bash
cargo add serde --features derive
cargo add tokio --features full
```

### TypeScript Dependencies

- Use `pnpm add` from the workspace root or app directory.
- Dev dependencies go in `devDependencies`.
- Pin exact versions for core dependencies (React, Tauri API).
- Use `^` ranges for utility libraries.

```bash
pnpm add zustand
pnpm add -D vitest
```

### Reviewing Dependencies

```bash
# Rust
cargo audit  # Check for security vulnerabilities
cargo outdated  # Check for outdated dependencies

# TypeScript
pnpm audit  # Check for security vulnerabilities
pnpm outdated  # Check for outdated dependencies
```

---

## Part 8: CI/CD Pipeline

The project uses GitHub Actions for continuous integration:

### Workflow: `ci.yml`

Triggers on:
- Push to `main` and `develop`
- Pull requests targeting `main` and `develop`

Steps:
1. **Checkout** — Clone repository
2. **Setup** — Install Rust, Node.js, pnpm
3. **Install dependencies** — `pnpm install`
4. **Lint** — `cargo fmt --check`, `cargo clippy`, `pnpm lint`
5. **Type check** — `pnpm typecheck`
6. **Test** — `cargo test`, `pnpm test`
7. **Build** — `pnpm tauri build`
8. **Upload artifacts** — Installer binaries

### Required Checks

All checks must pass before merging:
- `clippy` — No warnings
- `fmt` — Code formatting
- `test` — All tests pass
- `typecheck` — TypeScript strict checking
- `build` — Successful compilation

### GitHub Actions Workflow File

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  check:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rust-lang/setup-rust-toolchain@v1
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm install -g pnpm
      - run: pnpm install
      - run: cargo fmt --check
      - run: cargo clippy -- -D warnings
      - run: pnpm lint
      - run: pnpm typecheck
      - run: cargo test
      - run: pnpm test
      - run: pnpm tauri build
```

---

## Part 9: Release Process

### Versioning

Libern follows [Semantic Versioning](https://semver.org/):
- **Major**: Breaking API changes, incompatible database schema changes
- **Minor**: New features, non-breaking additions
- **Patch**: Bug fixes, performance improvements

### Release Steps

1. Create a release branch: `git checkout -b release/v0.2.0`
2. Update version in `Cargo.toml`, `tauri.conf.json`, and `package.json`.
3. Update `CHANGELOG.md` with the new release notes.
4. Create a PR from `release/v0.2.0` to `main`.
5. After merge, tag the release: `git tag v0.2.0 && git push origin v0.2.0`
6. GitHub Actions builds and publishes the release artifacts.
7. Merge `main` back to `develop`.

### Changelog Format

```markdown
# Changelog

## [0.2.0] - 2026-06-19

### Added
- Voice activity detection indicator (@username)
- Prediction markets with betting system
- Whiteboard export to PNG/SVG
- Per-server AI configuration

### Fixed
- Message deletion cascade now removes reactions
- Database migration for `server_stats` table
- MacOS notarization compatibility

### Changed
- Upgrade Tauri from v1 to v2
- Rewrite AI engine as pluggable trait
```

---

## Part 10: Good First Issues

If you are new to the project, look for issues labeled:
- `good first issue` — Beginner-friendly
- `help wanted` — Needs community contribution
- `bug` — Bug fixes
- `documentation` — Documentation improvements

### Getting Help

- Join the Libern community server (invite in the README)
- Check the discussions forum on GitHub
- Ask in the issue or PR comments
- Read the research papers in `docs/research/`

---

## Next Steps

Now that you understand the contribution workflow, proceed to:

- **How-To Guide 03**: Adding Commands — Learn how to add new Tauri commands
- **How-To Guide 04**: Modifying the Frontend — React components, Zustand stores, Tailwind styling
- **How-To Guide 05**: Testing — Writing unit tests and integration tests

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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