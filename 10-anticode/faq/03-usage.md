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

# FAQ: Usage

## How do I start ANTIKODE?

```bash
# Interactive TUI mode
antikode

# One-shot prompt mode
antikode -p "Create a Go HTTP server"

# Restore last session
antikode --restore

# Start with a specific session
antikode --session my-project
```

## How do I send a message to an agent?

In the TUI, type your message at the input prompt and press Enter:

```
> Create a REST API with user authentication
```

To use a specific subagent, use @mentions:

```
@general What's the Go equivalent of Python's list comprehension?
@explore How is authentication structured in this project?
@scout Find all TODO comments
```

## How do I switch between Build and Plan modes?

```
/mode build         — Switch to Build Agent (default)
/mode plan          — Switch to Plan Agent
/mode               — Show current mode
```

## What's the difference between Build and Plan modes?

**Build Mode:** The agent can read, write, edit files, and execute bash commands. Use this for implementing features, fixing bugs, and writing code.

**Plan Mode:** The agent can only read files and analyze code. It cannot make any modifications. Use this for architecture review, planning, and code analysis.

## How do I use the file tree?

Press `Ctrl+P` to toggle the file tree panel. Navigate with arrow keys, collapse/expand directories with Left/Right, and press Enter to preview files.

## How do I use the task board?

Press `Ctrl+B` to toggle the task board panel. Use these commands:

```
/todos                   — Show task board
/add "Fix login bug"     — Create a task
/done 42                 — Mark task as done
/update 42 --status active  — Start working on task
/todos list              — List all tasks
```

## How do I undo an operation?

```
/undo                    — Undo last operation
/undo 3                  — Undo last 3 operations
/redo                    — Redo last undone operation
```

Undo works for state-modifying operations: file writes, edits, and bash commands.

## How do I get help?

```
/help                    — Show general help
/help tools              — Show tool documentation
/help commands           — Show all commands
/help agents             — Show agent documentation
```

Press `?` at any time to open the help dialog.

## How do I quit ANTIKODE?

```
/quit                    — Quit ANTIKODE
Ctrl+C                   — Quit ANTIKODE
```

ANTIKODE automatically saves the session on exit.

## How do I run a one-shot command from the terminal?

```bash
antikode -p "Create a function that reverses a string in Python"
antikode -p "Review this code" --mode plan
echo "Create a .gitignore for a Go project" | antikode
```

## How do I capture one-shot output?

```bash
# Save response to file
antikode -p "Generate a .gitignore for Go" > .gitignore

# JSON output for scripting
antikode -p "Create a Go file" --output json

# Quiet mode (only output changes)
antikode -p "Fix the bug" --output silent
```

## How do I provide context to a one-shot prompt?

```bash
# Provide a specific file as context
antikode -p "Add error handling" --file src/main.go

# Pipe file content
cat src/main.go | antikode -p "Fix the bugs in this code"

# Specify working directory
antikode -p "Run tests" --workdir /path/to/project
```

## How do I navigate the TUI?

| Key | Action |
|-----|--------|
| Tab | Focus next panel |
| Ctrl+P | Toggle file tree |
| Ctrl+B | Toggle task board |
| Ctrl+C | Quit |
| Ctrl+L | Clear chat |
| Up/Down | Message history |
| PageUp/PageDown | Scroll chat |
| ? | Help dialog |

## Why does the agent ask for permission?

ANTIKODE's permission system requires approval for potentially destructive operations:

- Writing new files
- Editing existing files
- Executing bash commands
- Making web requests

This is by design. You can set permissions to "allow" for trusted operations:

```
/permit allow build write
/permit allow build edit
```

## How do I change permissions?

```
/permit                      — Show current permissions
/permit list                 — Show permission matrix
/permit allow build write    — Allow write for build agent
/permit deny general bash    — Deny bash for general agent
/permit ask plan edit        — Set edit to ask for plan agent
/permit reset                — Reset all permission caches
```

## How do I manage sessions?

```
/session                     — Show current session
/session list                — List all sessions
/session switch project-alpha  — Switch sessions
/session new scratchpad      — Create new session
/session delete temp         — Delete a session
```

## How do I use @general?

The General Agent answers questions and looks up information:

```
@general What's the CAP theorem?
@general How do I implement JWT refresh tokens in Go?
@general Explain the difference between TCP and UDP
```

The General Agent cannot modify files.

## How do I use @explore?

The Explore Agent analyzes the codebase structure:

```
@explore What does this project do?
@explore How is the authentication system structured?
@explore Find all API route definitions
```

The Explore Agent cannot modify files.

## How do I use @scout?

The Scout Agent performs fast, targeted searches:

```
@scout Find the main configuration file
@scout Search for "FIXME" in the code
@scout Check if there's a Dockerfile
```

The Scout Agent cannot modify files.

## How do I use /commands?

```
/mode build               — Switch mode
/todos                    — Show tasks
/undo                     — Undo
/redo                     — Redo
/session list             — List sessions
/session switch <name>    — Switch session
/permit list              — Show permissions
/ledger tail              — Show recent ledger entries
/clear                    — Clear chat
/help                     — Show help
/quit                     — Exit ANTIKODE
```

## How do I search chat history?

Press `Ctrl+F` in the chat panel to open the search dialog. Type a query to search through all messages in the current session.

## How do I copy text from the TUI?

- **Select text:** Use your terminal's mouse selection
- **Copy:** `Ctrl+Shift+C` or right-click (terminal dependent)
- **Copy code blocks:** Press `c` when focused on a code block

## How do I interrupt a running agent?

Press `Ctrl+C` while the agent is processing. This cancels the current operation and returns control to you.

## How do I make multi-line inputs?

Use `Shift+Enter` to add line breaks in the input field:

```
> Create a function that:
  - Validates email format
  - Checks password strength
  - Returns error messages
```

## How do I see the model's raw response?

Tool results and model outputs are displayed in the chat. Each tool execution is shown in a collapsible panel. Press `Enter` on a tool panel to expand/collapse it.

## What happens when I close ANTIKODE?

ANTIKODE automatically:

1. Saves the current session state
2. Saves agent memory
3. Finalizes the AIOSS ledger
4. Cleanly terminates model backend connections (if managed)

Your session is preserved and can be restored with `antikode --restore`.

## How do I run tests through the agent?

```
> Run the tests
> Run go test ./... and show me the results
> Run tests for the auth package
```

The agent will execute the test command and display results.

## How do I review changes before applying them?

The permission system shows a diff preview for edits and a content preview for writes. Review these before approving:

- Press `v` to view full diff
- Press `a` to approve
- Press `d` to deny

## How do I use ANTIKODE in CI/CD?

```bash
# One-shot review of changed files
antikode -p "Review all staged changes for security issues" --mode plan --output json

# Automated test generation
antikode -p "Generate unit tests for src/handlers/auth.go" --output json

# Code cleanup
antikode -p "Fix all linting issues in src/" --allow-all
```

## Can I use ANTIKODE with my existing IDE?

ANTIKODE is editor-agnostic. Common setups:

**With VS Code:** Open the integrated terminal and run `antikode` in a split pane.

**With vim/neovim:** Run ANTIKODE in a separate tmux pane or terminal tab.

**With IntelliJ:** Use the terminal tool window to run ANTIKODE.

## How do I use ANTIKODE over SSH?

Install ANTIKODE and a model backend on your remote machine:

```bash
ssh myserver
antikode
```

For GPU-accelerated inference, ensure the remote machine has GPU drivers installed.

## Can I use ANTIKODE in a tmux session?

Yes. ANTIKODE works perfectly in tmux:

```bash
tmux new-session -s antikode 'antikode'
```

You can split tmux panes to have ANTIKODE on one side and your editor on the other.

## How do I reset my configuration?

```bash
# Remove global configuration
rm ~/.antikode/config.json

# Reset to defaults
antikode --init
```

## How do I create a custom configuration?

Create an `antikode.json` file in your project directory:

```bash
antikode --init
# Edit antikode.json to customize
```

## How do I verify the AIOSS ledger?

```
/ledger verify              — Verify the entire chain
/ledger verify --from 500   — Verify from a specific index
/ledger tail                — View recent entries
/ledger stats               — View ledger statistics
```

## How do I export the ledger?

```
/ledger export              — Export as JSON
/ledger export --format csv  — Export as CSV
/ledger export --format text — Export as text
```

## How do I export a session?

```
/session export project-alpha
```

This creates a Markdown file with the full conversation and file changes.

## How do I clear my data?

```bash
# Clear all ANTIKODE data
rm -rf ~/.antikode

# Or use commands
/memory clear --all
/ledger export --delete-after
/session cleanup --all
```

## What languages are supported?

ANTIKODE works with any programming language. The model's capabilities determine language support. Code-specialized models excel at:

- Python, JavaScript, TypeScript, Go, Rust
- Java, Kotlin, C#, C/C++
- HTML, CSS, SQL
- Shell scripting, configuration files
- And many more

## How do I get better results from ANTIKODE?

1. **Be specific:** "Fix the off-by-one error in the pagination loop" is better than "Fix the bug"
2. **Provide context:** Mention relevant files and patterns
3. **Use appropriate agents:** Plan mode for analysis, Build mode for implementation
4. **Use @mentions:** @general for research, @explore for codebase understanding
5. **Iterate:** Start with a high-level request, refine based on results
6. **Review diffs:** Always check what the agent is changing before approving
7. **Use /undo:** Don't be afraid to undo and retry with different instructions

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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
