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
Document ID: DEV-005
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Testing

## Introduction

Testing is a critical part of the Libern development process. The project uses a multi-layered testing strategy: Rust unit tests for core logic, Rust integration tests for Tauri commands, TypeScript unit tests for frontend logic, and component tests for React components. This guide covers how to write, run, and maintain tests across the entire codebase.

The testing philosophy follows the test pyramid: many fast unit tests at the bottom, fewer integration tests in the middle, and a small number of E2E tests at the top. Tests are run automatically in CI and must pass before any PR can be merged.

By the end of this guide, you will be able to:
- Write Rust unit tests for core library code
- Write Rust integration tests for Tauri commands
- Write TypeScript unit tests for Zustand stores and utility functions
- Write React component tests
- Run the full test suite and interpret results
- Measure and improve code coverage
- Write testable code following best practices

---

## Part 1: Testing Philosophy

### Test Pyramid

```
         ╱╲
        ╱ E2E ╲
       ╱────────╲
      ╱ Integration ╲
     ╱────────────────╲
    ╱   Unit Tests      ╲
   ╱──────────────────────╲
```

- **Unit tests** (many): Test individual functions, methods, and pure logic. Fast, deterministic, no external dependencies.
- **Integration tests** (some): Test Tauri commands with real (or in-memory) database. Verify the full command pathway.
- **E2E tests** (few): Test full application workflows (future). Simulate user interactions across the entire stack.

### Testing Priorities

| Layer | Priority | Framework | Location |
|-------|----------|-----------|----------|
| CRDT logic | Critical | Rust `#[test]` | `crates/libern-core/src/crdt/` |
| Database operations | Critical | Rust `#[test]` | `crates/libern-core/src/db/` |
| Tauri commands | High | Rust integration | `apps/desktop/src-tauri/tests/` |
| Zustand stores | High | Vitest | `apps/desktop/src/stores/*.test.ts` |
| Utility functions | Medium | Vitest | `apps/desktop/src/lib/*.test.ts` |
| React components | Medium | Vitest + Testing Library | Co-located with components |

---

## Part 2: Rust Unit Tests

### Writing Unit Tests

Rust unit tests are written inline in the source file using `#[cfg(test)]` modules:

```rust
// crates/libern-core/src/crdt/hlc.rs
pub struct HybridLogicalClock {
    pub physical: u64,
    pub logical: u16,
}

impl HybridLogicalClock {
    pub fn new(now: u64) -> Self {
        HybridLogicalClock { physical: now, logical: 0 }
    }

    pub fn now(&mut self) -> u64 {
        let physical = std::cmp::max(self.physical, get_current_time());
        if physical == self.physical {
            self.logical += 1;
        } else {
            self.logical = 0;
        }
        self.physical = physical;
        (self.physical << 16) | self.logical as u64
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hlc_monotonic_increase() {
        let mut hlc = HybridLogicalClock::new(1000);
        let t1 = hlc.now();
        let t2 = hlc.now();
        assert!(t2 > t1, "HLC must always increase");
    }

    #[test]
    fn test_hlc_logical_counter_increment() {
        let mut hlc = HybridLogicalClock::new(1000);
        let t1 = hlc.now();
        let t2 = hlc.now();
        let t3 = hlc.now();
        assert_eq!(t1 & 0xFFFF, 0);
        assert_eq!(t2 & 0xFFFF, 1);
        assert_eq!(t3 & 0xFFFF, 2);
    }

    #[test]
    fn test_hlc_physical_clock_advances() {
        let mut hlc = HybridLogicalClock::new(1000);
        let t1 = hlc.now();
        hlc.physical = 2000; // Simulate time passing
        let t2 = hlc.now();
        assert_eq!(t2 & 0xFFFF, 0);
        assert_eq!(t2 >> 16, 2000);
    }

    #[test]
    fn test_hlc_timestamp_format() {
        let mut hlc = HybridLogicalClock::new(1000);
        let timestamp = hlc.now();
        let physical = timestamp >> 16;
        let logical = (timestamp & 0xFFFF) as u16;
        assert_eq!(physical, 1000);
        assert_eq!(logical, 0);
    }
}
```

### Testing Database Operations

```rust
// crates/libern-core/src/db/mod.rs
#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_db() -> Database {
        Database::new(":memory:").expect("Failed to create in-memory database")
    }

    #[test]
    fn test_create_user() {
        let db = create_test_db();
        let user = db.create_user("TestUser").expect("Failed to create user");
        assert_eq!(user.display_name, "TestUser");
        assert!(user.is_local);
        assert_eq!(user.public_key.len(), 32);
    }

    #[test]
    fn test_duplicate_user_id() {
        let db = create_test_db();
        let user1 = db.create_user("User1").unwrap();
        let user2 = db.create_user("User2").unwrap();
        assert_ne!(user1.id, user2.id);
    }

    #[test]
    fn test_create_server_with_default_channels() {
        let db = create_test_db();
        let user = db.create_user("Owner").unwrap();
        let server = db.create_server("Test Server", &user.id, None).unwrap();
        assert_eq!(server.name, "Test Server");

        let channels = db.get_channels(&server.id).unwrap();
        assert_eq!(channels.len(), 2);
        assert_eq!(channels[0].name, "general");
        assert_eq!(channels[1].name, "Voice");
    }

    #[test]
    fn test_send_and_get_messages() {
        let db = create_test_db();
        let user = db.create_user("User").unwrap();
        let server = db.create_server("Server", &user.id, None).unwrap();
        let channels = db.get_channels(&server.id).unwrap();
        let channel_id = channels[0].id.clone();

        let msg = db.send_message(&channel_id, &user.id, "Hello, world!", None).unwrap();
        assert_eq!(msg.content, "Hello, world!");

        let messages = db.get_messages(&channel_id, None, Some(50)).unwrap();
        assert_eq!(messages.len(), 2); // welcome message + our message
    }

    #[test]
    fn test_permission_check() {
        let db = create_test_db();
        let user = db.create_user("User").unwrap();
        let server = db.create_server("Server", &user.id, None).unwrap();

        let has_perm = db.check_permission(&user.id, &server.id, PERM_MANAGE_SERVER).unwrap();
        assert!(has_perm);
    }
}
```

### Running Rust Tests

```bash
# Run all Rust tests in workspace
cargo test --workspace

# Run tests in a specific package
cargo test -p libern-core
cargo test -p libern-aioss

# Run tests matching a name pattern
cargo test hlc

# Run with output (for debugging)
cargo test -- --nocapture

# Run with all features
cargo test --all-features
```

---

## Part 3: Rust Integration Tests

Integration tests test the full Tauri command pathway with a real (in-memory) database.

### Integration Test File

```rust
// apps/desktop/src-tauri/tests/integration.rs
use tauri::test::{mock_builder, MockRuntime};

fn setup_test_app() -> tauri::App<MockRuntime> {
    mock_builder()
        .manage(Database::new(":memory:").unwrap())
        .invoke_handler(tauri::generate_handler![
            commands::server::create_server,
            commands::server::get_servers,
            commands::message::send_message,
            commands::message::get_messages,
            commands::user::create_user,
            commands::user::get_local_user,
            commands::role::create_role,
            commands::role::check_permission,
        ])
        .build()
}

#[test]
fn test_full_create_server_flow() {
    let app = setup_test_app();
    let db = app.state::<Database>();

    // Create user
    let user_result: Result<User, String> = tauri::test::invoke(
        &app, "create_user",
        serde_json::json!({ "displayName": "TestUser" }),
    );
    assert!(user_result.is_ok());
    let user = user_result.unwrap();

    // Create server
    let server_result: Result<Server, String> = tauri::test::invoke(
        &app, "create_server",
        serde_json::json!({ "name": "Test Server", "ownerId": user.id }),
    );
    assert!(server_result.is_ok());
    let server = server_result.unwrap();

    // Get servers
    let servers_result: Result<Vec<Server>, String> = tauri::test::invoke(
        &app, "get_servers",
        serde_json::json!({}),
    );
    assert!(servers_result.is_ok());
    assert_eq!(servers_result.unwrap().len(), 1);

    // Get channels for the server
    let channels = db.get_channels(&server.id).unwrap();
    assert_eq!(channels.len(), 2);

    // Send a message
    let msg_result: Result<Message, String> = tauri::test::invoke(
        &app, "send_message",
        serde_json::json!({
            "channelId": channels[0].id,
            "authorId": user.id,
            "content": "Integration test message",
        }),
    );
    assert!(msg_result.is_ok());
}

#[test]
fn test_permission_enforcement() {
    let app = setup_test_app();
    let db = app.state::<Database>();

    let owner: User = tauri::test::invoke(
        &app, "create_user",
        serde_json::json!({ "displayName": "Owner" }),
    ).unwrap();

    let member: User = tauri::test::invoke(
        &app, "create_user",
        serde_json::json!({ "displayName": "Member" }),
    ).unwrap();

    let server: Server = tauri::test::invoke(
        &app, "create_server",
        serde_json::json!({ "name": "Server", "ownerId": owner.id }),
    ).unwrap();

    let owner_perm: bool = tauri::test::invoke(
        &app, "check_permission",
        serde_json::json!({
            "userId": owner.id,
            "serverId": server.id,
            "permission": PERM_MANAGE_SERVER,
        }),
    ).unwrap();
    assert!(owner_perm);

    let member_perm: bool = tauri::test::invoke(
        &app, "check_permission",
        serde_json::json!({
            "userId": member.id,
            "serverId": server.id,
            "permission": PERM_MANAGE_SERVER,
        }),
    ).unwrap();
    assert!(!member_perm);
}
```

### Running Integration Tests

```bash
cd apps/desktop/src-tauri
cargo test --test integration
```

---

## Part 4: TypeScript Unit Tests

### Testing Zustand Stores

```typescript
// apps/desktop/src/stores/uiStore.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { useUiStore } from "./uiStore";

describe("uiStore", () => {
    beforeEach(() => {
        useUiStore.setState({
            view: "chat",
            selectedServerId: null,
            selectedChannelId: null,
        });
    });

    it("should initialize with default values", () => {
        const state = useUiStore.getState();
        expect(state.view).toBe("chat");
        expect(state.selectedServerId).toBeNull();
        expect(state.selectedChannelId).toBeNull();
    });

    it("should switch views", () => {
        const { setView } = useUiStore.getState();
        setView("marketplace");
        expect(useUiStore.getState().view).toBe("marketplace");
        setView("compliance");
        expect(useUiStore.getState().view).toBe("compliance");
    });

    it("should select a server", () => {
        const { setSelectedServer } = useUiStore.getState();
        setSelectedServer("server-1");
        expect(useUiStore.getState().selectedServerId).toBe("server-1");
    });

    it("should clear selection on view change", () => {
        const { setSelectedServer, setView } = useUiStore.getState();
        setSelectedServer("server-1");
        setView("marketplace");
        expect(useUiStore.getState().selectedServerId).toBeNull();
    });
});
```

### Testing Utility Functions

```typescript
// apps/desktop/src/lib/api.test.ts
import { describe, it, expect } from "vitest";
import { parseMessageContent, formatTimestamp } from "./utils";

describe("parseMessageContent", () => {
    it("should parse bold text", () => {
        const result = parseMessageContent("Hello **world**");
        expect(result).toContainEqual({ type: "bold", text: "world" });
    });

    it("should parse italic text", () => {
        const result = parseMessageContent("Hello *world*");
        expect(result).toContainEqual({ type: "italic", text: "world" });
    });

    it("should parse inline code", () => {
        const result = parseMessageContent("Use `code` here");
        expect(result).toContainEqual({ type: "code", text: "code" });
    });

    it("should handle empty input", () => {
        const result = parseMessageContent("");
        expect(result).toEqual([]);
    });

    it("should handle plain text without formatting", () => {
        const result = parseMessageContent("Just plain text");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({ type: "text", text: "Just plain text" });
    });
});
```

### Running TypeScript Tests

```bash
# Run all frontend tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run a specific test file
pnpm test -- uiStore.test.ts

# Run with coverage
pnpm test -- --coverage
```

---

## Part 5: React Component Tests

### Setup

Testing is done with Vitest + @testing-library/react:

```typescript
// apps/desktop/src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
    it("should render with text", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText("Click me")).toBeDefined();
    });

    it("should call onClick when clicked", () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);
        fireEvent.click(screen.getByText("Click"));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("should be disabled when disabled prop is true", () => {
        render(<Button disabled>Click</Button>);
        const button = screen.getByText("Click") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    it("should apply variant classes", () => {
        const { container } = render(<Button variant="danger">Delete</Button>);
        expect(container.firstChild?.classList.contains("bg-red-600")).toBe(true);
    });
});
```

### Testing Components with Stores

```typescript
// apps/desktop/src/components/chat/MessageInput.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MessageInput } from "./MessageInput";

// Mock the API layer
vi.mock("../../lib/api", () => ({
    sendMessage: vi.fn().mockResolvedValue({
        id: "msg-1",
        content: "Hello",
        created_at: Date.now(),
    }),
}));

describe("MessageInput", () => {
    it("should render input field", () => {
        render(<MessageInput channelId="ch-1" authorId="user-1" />);
        expect(screen.getByPlaceholderText("Type a message...")).toBeDefined();
    });

    it("should clear input after sending", async () => {
        render(<MessageInput channelId="ch-1" authorId="user-1" />);
        const input = screen.getByPlaceholderText("Type a message...") as HTMLInputElement;

        fireEvent.change(input, { target: { value: "Hello" } });
        expect(input.value).toBe("Hello");

        fireEvent.keyDown(input, { key: "Enter" });
        expect(input.value).toBe("");
    });

    it("should disable send button when input is empty", () => {
        render(<MessageInput channelId="ch-1" authorId="user-1" />);
        const button = screen.getByText("Send") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    it("should enable send button when input has text", () => {
        render(<MessageInput channelId="ch-1" authorId="user-1" />);
        const input = screen.getByPlaceholderText("Type a message...");
        fireEvent.change(input, { target: { value: "Hello" } });
        const button = screen.getByText("Send") as HTMLButtonElement;
        expect(button.disabled).toBe(false);
    });
});
```

### Testing with TanStack Query

```typescript
// apps/desktop/src/components/server/ServerList.test.tsx
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ServerList } from "./ServerList";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

describe("ServerList", () => {
    it("should show loading state", () => {
        render(<Wrapper><ServerList /></Wrapper>);
        expect(screen.getByText("Loading servers...")).toBeDefined();
    });
});
```

---

## Part 6: Test Database Setup

For tests that require a database, use SQLite's in-memory mode:

```rust
// Helper function for creating test databases
pub fn create_test_database() -> Database {
    let db = Database::new(":memory:").expect("Failed to create in-memory database");
    db.run_migrations().expect("Failed to run migrations");
    db
}
```

This approach:
- Creates a fresh database for each test.
- No cleanup needed (dropped when `Database` goes out of scope).
- Runs faster than file-based databases.
- Isolates tests from each other.

### Existing Test Helpers

The codebase already includes test helpers in the server module:

```rust
// apps/desktop/src-tauri/src/commands/server.rs
#[cfg(test)]
pub fn create_test_server(db: &Database, name: &str, owner_id: &str) -> Server {
    let conn = db.conn.lock().unwrap();
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT INTO servers (id, name, owner_id, invite_code, created_at, updated_at)
         VALUES (?1, ?2, ?3, 'TESTCODE', ?4, ?4)",
        rusqlite::params![id, name, owner_id, now],
    ).unwrap();
    Server {
        id, name: name.to_string(), owner_id: owner_id.to_string(),
        avatar_path: None, invite_code: "TESTCODE".to_string(),
        created_at: now, updated_at: now,
    }
}

#[cfg(test)]
pub fn create_test_user(db: &Database) -> String {
    let conn = db.conn.lock().unwrap();
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT INTO users (id, display_name, public_key, is_local, created_at)
         VALUES (?1, 'testuser', x'00', 1, ?2)",
        rusqlite::params![id, now],
    ).unwrap();
    id
}
```

---

## Part 7: Test Coverage

### Measuring Coverage

```bash
# Rust coverage (requires cargo-tarpaulin)
cargo tarpaulin --ignore-tests --out Html

# TypeScript coverage
pnpm test -- --coverage
```

### Coverage Targets

| Module | Target | Current |
|--------|--------|---------|
| `libern-core/src/crdt/` | 95% | |
| `libern-core/src/db/` | 85% | |
| `libern-aioss/` | 90% | |
| Tauri commands | 80% | |
| Frontend stores | 85% | |
| Frontend components | 70% | |
| Frontend utility functions | 90% | |

### Viewing Coverage Reports

```bash
# Rust — generates htmlcov/ directory
cargo tarpaulin --out Html
open htmlcov/index.html

# TypeScript — generates coverage/ directory
pnpm test -- --coverage
# Output in coverage/lcov-report/index.html
```

---

## Part 8: Running the Full Test Suite

### Complete Test Command

```bash
# From the project root

# 1. Format check
cargo fmt --check
pnpm format --check

# 2. Lint
cargo clippy --all-targets --all-features -- -D warnings
pnpm lint

# 3. Type check
pnpm typecheck

# 4. Rust tests
cargo test --workspace

# 5. Frontend tests
pnpm test

# 6. Build (to catch compilation errors)
pnpm tauri build --debug
```

### CI Pipeline

The GitHub Actions CI pipeline runs these steps automatically:
1. `cargo fmt --check`
2. `cargo clippy -- -D warnings`
3. `cargo test`
4. `pnpm lint`
5. `pnpm typecheck`
6. `pnpm test`
7. `pnpm tauri build`

All checks must pass before a PR can be merged.

### Common CI Issues and Solutions

| Issue | Solution |
|-------|----------|
| Test passes locally but fails in CI | Check for platform-specific issues (file paths, line endings) |
| Timeout on test | Use `#[timeout(30000)]` or increase timeout in vitest config |
| Database test fails in parallel | Use separate in-memory databases per test |
| Snapshots differ | Update snapshots with `--update` flag |
| Flaky async tests | Use `#[tokio::test(flavor = "multi_thread")]` |

---

## Part 9: Writing Testable Code

### Best Practices

1. **Pure functions are easier to test** — Extract logic into pure functions without side effects.
2. **Inject dependencies** — Pass database connections and other dependencies as parameters.
3. **Use interfaces/traits** — Makes mocking easier.
4. **Avoid global state** — Use dependency injection instead of globals.
5. **Test edge cases** — Empty inputs, null values, boundary conditions, error cases.

### Example: Refactoring for Testability

```rust
// Hard to test (coupled to state)
#[tauri::command]
pub fn get_server_name(db: State<Database>, server_id: String) -> Result<String, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let name: String = conn.query_row(
        "SELECT name FROM servers WHERE id = ?1",
        rusqlite::params![server_id],
        |row| row.get(0),
    ).map_err(|_| "Server not found".to_string())?;
    Ok(name)
}

// Easy to test (extracted logic)
pub fn get_server_name_internal(conn: &Connection, server_id: &str) -> Result<String, String> {
    let name: String = conn.query_row(
        "SELECT name FROM servers WHERE id = ?1",
        rusqlite::params![server_id],
        |row| row.get(0),
    ).map_err(|_| "Server not found".to_string())?;
    Ok(name)
}

#[tauri::command]
pub fn get_server_name(db: State<Database>, server_id: String) -> Result<String, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    get_server_name_internal(&conn, &server_id)
}
```

### Testing the Extracted Function

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::Database;

    #[test]
    fn test_get_server_name_found() {
        let db = Database::new(":memory:").unwrap();
        db.run_migrations().unwrap();
        let user_id = create_test_user(&db);
        let server = create_test_server(&db, "MyServer", &user_id);
        let conn = db.conn.lock().unwrap();

        let result = get_server_name_internal(&conn, &server.id);
        assert_eq!(result.unwrap(), "MyServer");
    }

    #[test]
    fn test_get_server_name_not_found() {
        let db = Database::new(":memory:").unwrap();
        db.run_migrations().unwrap();
        let conn = db.conn.lock().unwrap();

        let result = get_server_name_internal(&conn, "nonexistent-id");
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Server not found");
    }
}
```

---

## Part 10: Troubleshooting Tests

| Problem | Solution |
|---------|----------|
| Test fails due to database lock | Use separate in-memory databases for each test. Avoid shared state. |
| "cannot call non-const fn" in const context | Ensure test setup is not in a const context. Use `#[test]` functions properly. |
| Async test not running | Use `#[tokio::test]` for async Rust tests. |
| Component test not finding DOM elements | Use `screen.getByRole`, `screen.getByText`, or `screen.getByTestId`. Check the component renders correctly. |
| Mock not working | Verify the mock path matches the import path. Use `vi.mock()` before imports. |
| Test timeout | Increase timeout with `test(timeout)` option. Check for infinite loops or hanging promises. |
| Coverage report missing files | Check coverage configuration in `vitest.config.ts` or `cargo-tarpaulin` settings. |
| Integration test requires window | Tauri mock runtime provides a window mock. Use `mock_builder()` and test command invocations. |
| "QueryClient is not set" | Wrap components in `QueryClientProvider` in test setup. |
| Snapshot test fails | Component output may have changed. Review the diff and update snapshots with `--update`. |

### Quick Debugging Commands

```bash
# Run a single test with full output
cargo test test_name -- --nocapture

# Run Rust tests in release mode (faster execution)
cargo test --release

# Run TypeScript tests in a specific file
pnpm test -- src/stores/uiStore.test.ts

# Run TypeScript tests with UI (debug mode)
pnpm test -- --ui
```

---

## Next Steps

Now that you understand the testing framework, proceed to:

- **How-To Guide 06**: Building an Installer — MSI, native installer, cross-platform packaging

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
