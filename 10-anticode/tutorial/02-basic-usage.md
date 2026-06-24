```
▄▄                            ██     ▄▄   ▄▄▄                  ▄▄           
████                ██         ▀▀     ██  ██▀                   ██           
████    ██▄████▄  ███████    ████     ██▄██      ▄████▄    ▄███▄██   ▄████▄  
██  ██   ██▀   ██    ██         ██     █████     ██▀  ▀██  ██▀  ▀██  ██▄▄▄▄██ 
██████   ██    ██    ██         ██     ██  ██▄   ██    ██  ██    ██  ██▀▀▀▀▀▀ 
▄██  ██▄  ██    ██    ██▄▄▄   ▄▄▄██▄▄▄  ██   ██▄  ▀██▄▄██▀  ▀██▄▄███  ▀██▄▄▄▄█ 
▀▀    ▀▀  ▀▀    ▀▀     ▀▀▀▀   ▀▀▀▀▀▀▀▀  ▀▀    ▀▀    ▀▀▀▀      ▀▀▀ ▀▀    ▀▀▀▀▀ 

ANTIKODE — terminal-native AI coding engine
Lois-Kleinner and 0-1.gg 2026 Copyright
```

# Basic Usage

## Overview

This tutorial covers the basic ways to interact with ANTIKODE: one-shot prompts from the command line, the interactive TUI, and the command system. You'll learn how to send prompts, navigate the interface, and use built-in commands.

## One-Shot Prompts

ANTIKODE supports non-interactive one-shot prompts for quick tasks:

```bash
# One-shot prompt (runs and exits)
antikode -p "Create a function that reverses a string in Python"

# With a specific file context
antikode -p "Add error handling to this function" --file src/main.go

# Pipe input
echo "Write a unit test for the User model" | antikode
```

### One-Shot Output

The one-shot mode prints the agent's response to stdout and exits:

```
$ antikode -p "Create a Python function that reverses a string"

Build Agent:

Here's a Python function that reverses a string:

def reverse_string(s):
    return s[::-1]

# Example usage
print(reverse_string("hello"))  # Output: "olleh"

File created: reverse_string.py
```

### Useful One-Shot Flags

| Flag | Description |
|------|-------------|
| `-p, --prompt` | The prompt to execute |
| `-f, --file` | File to provide as context |
| `--mode` | Agent mode (build, plan) |
| `--session` | Session name |
| `--output` | Output format (text, json, silent) |
| `--timeout` | Maximum execution time |
| `--allow-all` | Auto-approve all permission requests |

### One-Shot with JSON Output

For scripting and integration:

```bash
antikode -p "Create a Go HTTP server" --output json
```

Output:

```json
{
  "session_id": "abc123-def456",
  "agent": "build_agent",
  "operations": [
    {
      "tool": "WriteTool",
      "file": "server.go",
      "status": "success"
    }
  ],
  "response": "I've created a Go HTTP server...",
  "exit_code": 0
}
```

## Interactive TUI

The primary way to use ANTIKODE is through the interactive TUI. Start it with:

```bash
antikode
```

### TUI Layout

```
┌── ANTIKODE v1.0.0 ──────────────────────────────────── Session: default ──┐
│ ┌─ Chat ──────────────────────────────┐ ┌─ Files ────────────────────┐ │
│ │                                     │ │ my-project/                │ │
│ │ ╭─────────────────────────────────╮ │ │ ├── src/                   │ │
│ │ │ Build Agent                     │ │ │ ├── main.go               │ │
│ │ │ Hello! I'm the Build Agent.     │ │ │ ├── reverse_string.py     │ │
│ │ │ How can I help you with your    │ │ │ └── server.go             │ │
│ │ │ code today?                     │ │ │                           │ │
│ │ ╰─────────────────────────────────╯ │ │                           │ │
│ │                                     │ │                           │ │
│ └────────────────────────────────────┘ └───────────────────────────┘ │
│ ┌─ Input ────────────────────────────────────────────────────────────┐ │
│ │ >                                                                  │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ Status: Build Agent | Model: qwen2.5-coder-7b | Perm: Ask | Session 1 │
└────────────────────────────────────────────────────────────────────────┘
```

### Sending a Message

Type your message at the input prompt and press Enter:

```
> Create a REST API endpoint for user registration
```

The agent will process your request, execute tools, and respond:

```
Build Agent: I'll create a REST API endpoint for user registration.

Let me first check if there are any existing files...

[Used GlobTool — 3ms]
Found: main.go, go.mod

[Used ReadTool — 5ms]
Reading main.go...

I see you have a basic HTTP server. I'll add the registration endpoint.

[Used EditTool — 15ms]
Updated main.go with registration handler

Let me verify it compiles:

[Used BashTool — go build ./... — 2.3s]
Build succeeded!

Here's what I added:
- POST /api/register endpoint
- User registration handler with validation
- JSON request/response format
- Password hashing with bcrypt

The server now accepts POST requests to /api/register with:
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Ctrl+P` | Toggle file tree |
| `Ctrl+B` | Toggle task board |
| `Tab` | Cycle focus through panels |
| `Up/Down` | Navigate message history (in chat) |
| `PageUp/PageDown` | Scroll chat |
| `Ctrl+C` | Quit ANTIKODE |
| `Ctrl+L` | Clear chat |
| `Ctrl+F` | Search chat |
| `?` | Show help |
| `Escape` | Close dialog |

### Working with Permission Prompts

When an agent needs to use a tool that requires your approval, a permission dialog appears:

```
┌─ Permission Request ───────────────────────────────────┐
│                                                        │
│  Build Agent wants to write:                           │
│                                                        │
│  File:    src/main.go                                  │
│  Content: REST API handler (45 lines)                  │
│  Risk:    Low                                          │
│                                                        │
│  [a] Allow    [d] Deny    [A] Allow Always            │
│  [D] Deny Always    [v] View Content    [?] Help      │
└────────────────────────────────────────────────────────┘
```

Press `a` to allow this one time, or `A` to always allow this agent to use this tool.

## Command System

ANTIKODE provides a rich set of built-in commands, all prefixed with `/`.

### General Commands

```
/help                  — Show help
/clear                 — Clear chat
/status                — Show system status
/version               — Show version
/quit                  — Exit ANTIKODE
```

### Agent Commands

```
/mode                  — Show current mode
/mode build            — Switch to Build Agent
/mode plan             — Switch to Plan Agent
/agent status          — Show all agent statuses
```

### Session Commands

```
/session               — Show current session
/session list          — List all sessions
/session switch <name> — Switch sessions
/session new <name>    — Create new session
/undo                  — Undo last operation
/redo                  — Redo last undone operation
```

### Task Commands

```
/todos                 — Show task board
/add <title>           — Add a task
/done <id>             — Mark task done
/update <id> <field>   — Update task
/todos list            — List all tasks
```

### Permission Commands

```
/permit                — Show current permissions
/permit list           — Show permission matrix
/permit allow <agent> <tool>  — Allow a tool
/permit deny <agent> <tool>   — Deny a tool
/permit reset          — Reset permission cache
```

### Ledger Commands

```
/ledger status         — Show ledger stats
/ledger tail           — Show recent entries
/ledger verify         — Verify chain integrity
/ledger export         — Export ledger
```

### MCP Commands

```
/mcp list              — List MCP servers
/mcp status            — Show MCP connections
/mcp connect <name>    — Connect MCP server
```

## Example Workflows

### Example 1: Fix a Bug

```
> There's a bug in the login handler — it crashes on empty input

Build Agent: I'll investigate the login handler.

[Used GrepTool — 10ms]
Found login handler in src/auth/login.go:42-89

[Used ReadTool — 5ms]
Reading src/auth/login.go...

I found the issue. The handler doesn't check if the username field is empty
before using it. Let me fix that.

[Used EditTool — 12ms]
Added input validation to login handler

Here's the fix:
- Added check for empty username before processing
- Returns 400 Bad Request with descriptive message
- Added test case for empty input
```

### Example 2: Refactor Code

```
> Refactor the user service to use dependency injection

Build Agent: Let me analyze the current user service first.

[Used GlobTool — 5ms]
Found: src/services/user.go, src/services/user_test.go

[Used ReadTool — 10ms]
Reading user.go...

I can see the current implementation uses a global database connection.
I'll refactor it to use dependency injection.

Plan:
1. Create a UserService struct with DB dependency
2. Update constructor functions
3. Update all callers
4. Update tests

Let me proceed with the refactoring...

[Used EditTool — 20ms]
Refactored user.go to use DI pattern

[Used GrepTool — 15ms]
Finding all callers of the old pattern...
Found 3 callers in handlers/

[Used EditTool — 35ms]
Updated all callers

[Used BashTool — go test ./... — 4.2s]
All tests pass.
```

### Example 3: Learning with @general

```
> @general What's the difference between synchronous and asynchronous programming?

General Agent: Here's the difference between synchronous and asynchronous programming:

Synchronous (Blocking):
- Operations execute one after another
- Each operation waits for the previous to complete
- Simple to reason about but can be inefficient

Asynchronous (Non-blocking):
- Operations can run concurrently
- An operation can start before the previous one finishes
- More complex but more efficient for I/O-bound tasks

In Go, you use goroutines and channels for async:
go func() {
    // This runs concurrently
}()

In JavaScript, you use async/await or Promises:
async function fetchData() {
    const result = await fetch(url);
    return result.json();
}
```

### Example 4: Research with Plan Agent

```
> /mode plan
Planning mode activated.

> Analyze the current project structure and suggest improvements

Plan Agent: I'll analyze your project structure.

[Used GlobTool — 5ms]
Project structure:

my-project/
├── src/
│   ├── main.go           (245 lines)
│   ├── handlers/
│   │   ├── auth.go      (180 lines)
│   │   └── api.go       (210 lines)
│   ├── models/
│   │   └── user.go      (60 lines)
│   └── services/
│       └── user.go      (120 lines)
├── tests/
│   ├── auth_test.go     (90 lines)
│   └── api_test.go      (75 lines)
└── go.mod

Architecture Analysis:
1. Currently uses a monolithic handler structure
2. No clear separation between business logic and HTTP handling
3. Database access is mixed with handlers

Recommendations:
1. Implement a clean architecture with repository pattern
2. Create a dedicated database layer
3. Add request/response DTOs
4. Implement middleware for cross-cutting concerns

Priority order:
P0: Database layer abstraction (highest impact)
P1: DTOs for request/response
P2: Middleware framework
P3: Code generation tooling
```

## Tips and Tricks

### Multi-line Input

For long prompts, use `Shift+Enter` to add new lines:

```
> Create a function that:
  - Takes a list of numbers
  - Filters out even numbers
  - Returns the sum of odd numbers
  - With proper error handling
```

### Copy and Paste

- Copy text from the chat: Select with mouse (terminal dependent)
- Paste into the input: `Ctrl+Shift+V` or right-click
- Copy code blocks: Press `c` when focused on a code block

### Interrupting an Agent

If an agent is taking too long or generating unwanted output:

```
> [Press Ctrl+C]
[Interrupted] Build Agent was generating a response...
```

### Quick Mode Switching

```bash
# Start in plan mode
antikode --mode plan

# One-shot in plan mode
antikode -p "Review this architecture" --mode plan
```

### Output Redirection

```bash
# Capture response to file
antikode -p "Generate a .gitignore for a Go project" > .gitignore

# Pipe to another command
antikode -p "List all functions in main.go" | grep "func "
```

### Combining with the File Tree

The file tree panel shows your project structure. You can:

- Navigate with arrow keys
- Open files for context with `Enter`
- See git status indicators
- Right-click to copy file path

## Next Steps

Now that you know the basics, continue to:

- [Agent Modes](03-agent-modes.md) — Switch between Build and Plan modes
- [File Operations](04-file-operations.md) — Read, write, and edit files
- [Task Management](05-task-management.md) — Use the task board
