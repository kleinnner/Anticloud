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

# Kasteran* — LSP Errors
© Lois-Kleinner & 0-1.gg 2026

## Overview

LSP-related errors occur during language server initialization, document synchronization, or diagnostic processing. These typically indicate configuration or connection issues with your editor or IDE.

## LSP Error Format

```
[LSP Error] <timestamp> <level>: <message>
```

## Initialization Failure (L001)

```
[LSP Error] 2026-06-19 10:00:00 ERROR: Failed to initialize LSP server
  └─ Cause: stdio transport error
```

**Cause:** The editor could not establish communication with the LSP server.

**Common causes:**
- The `kasteran lsp` command is not in PATH
- The editor is configured with the wrong command
- Another process is using the same port

**Fix:**

1. Ensure `kasteran` is in your PATH:
   ```
   which kasteran
   ```

2. Configure your editor correctly:

   **VS Code (settings.json):**
   ```json
   {
     "kasteran.lsp.path": "/usr/local/bin/kasteran",
     "kasteran.lsp.args": ["lsp"]
   }
   ```

   **Neovim (init.lua):**
   ```lua
   vim.api.nvim_create_autocmd("FileType", {
     pattern = "kasteran",
     callback = function()
       vim.lsp.start({
         name = "kasteran",
         cmd = { "kasteran", "lsp" },
       })
     end,
   })
   ```

   **Emacs (init.el):**
   ```elisp
   (add-to-list 'eglot-server-programs
                '(kasteran-mode . ("kasteran" "lsp")))
   ```

## Connection Issues (L002)

```
[LSP Error] 2026-06-19 10:00:05 ERROR: Connection closed unexpectedly
  └─ Cause: process exited with code 1
```

**Cause:** The LSP process crashed during initialization.

**Fix:** Check the LSP server logs:

```
kasteran lsp --verbose
```

Common crash causes:
- Missing configuration file
- Corrupted project directory
- Outdated compiler version

## Diagnostic Failure (L003)

```
[LSP Error] 2026-06-19 10:00:10 WARN: Failed to compute diagnostics
  └─ Cause: timeout processing file.ka
```

**Cause:** The compiler took too long to analyze a file.

**Fix:**
- Reduce file size
- Disable type checking for large files temporarily
- Increase timeout in editor configuration

## Feature Not Supported (L004)

```
[LSP Error] 2026-06-19 10:00:15 WARN: Workspace symbols not supported
```

**Cause:** The editor requested a feature that the LSP server does not support.

**Fix:** This is usually benign. The editor degrades gracefully. Update to the latest version for new features.

## File Not Found (L005)

```
[LSP Error] 2026-06-19 10:00:20 ERROR: File not found
  └─ Path: /project/src/nonexistent.ka
```

**Cause:** The LSP received a request for a file that does not exist on disk (e.g., a deleted or renamed file).

**Fix:** Ensure the file exists. If the file was recently deleted, close the editor tab.

## Protocol Error (L006)

```
[LSP Error] 2026-06-19 10:00:25 ERROR: Invalid JSON-RPC message
  └─ Cause: Expected method field
```

**Cause:** Malformed communication between editor and LSP server.

**Fix:** Update both your editor and the Kasteran* compiler. If the issue persists, report it with the full log.

## Checking LSP Logs

### Verbose Mode

```
kasteran lsp --verbose --log-file /tmp/kasteran-lsp.log
```

### Log File Contents

```
[2026-06-19 10:00:00] INFO  LSP server starting
[2026-06-19 10:00:00] INFO  Received: initialize
[2026-06-19 10:00:00] INFO  Sending: capabilities 7 features
[2026-06-19 10:00:00] INFO  Received: textDocument/didOpen (src/main.ka)
[2026-06-19 10:00:00] INFO  Computing diagnostics...
[2026-06-19 10:00:00] INFO  Publishing 0 diagnostics
[2026-06-19 10:00:01] INFO  Received: textDocument/completion
[2026-06-19 10:00:01] INFO  Sending: 12 completion items
```

## Common Editor Issues

### VS Code

**Issue: "Cannot find module" errors**

**Fix:** Ensure the workspace root is correctly set. The LSP needs to find `kasteran.toml` to resolve modules.

### Neovim

**Issue: LSP attaches but no completions**

**Fix:** Install the Kasteran* Treesitter grammar:

```
:TSInstall kasteran
```

### Emacs

**Issue: eglot does not recognize `.ka` files**

**Fix:** Add the file extension to eglot:

```elisp
(add-to-list 'auto-mode-alist '("\\.ka\\'" . kasteran-mode))
```

## Reporting LSP Issues

When reporting LSP issues, include:
1. The full LSP log file
2. Your editor version
3. The Kasteran* version (`kasteran --version`)
4. Steps to reproduce
