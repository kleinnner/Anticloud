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

# FAQ: Troubleshooting

## Common Issues

### "Connection refused" when starting ANTIKODE

**Problem:** ANTIKODE cannot connect to the model backend.

**Solutions:**

1. **Ensure the model backend is running:**
   ```bash
   # For llamafile
   curl http://127.0.0.1:8080/v1/models
   # Should return model information
   
   # For Ollama
   curl http://127.0.0.1:11434/api/tags
   # Should return list of models
   ```

2. **Check the host and port configuration:**
   ```json
   {
     "model": {
       "llamafile": {
         "host": "127.0.0.1",
         "port": 8080
       }
     }
   }
   ```
   Ensure these match your model backend's configuration.

3. **Check if the model backend is listening on the correct interface:**
   - llamafile: `--host 127.0.0.1` (default) or `--host 0.0.0.0` for external access
   - Ollama: By default listens on `127.0.0.1:11434`

4. **Wait for the model to finish loading:**
   Large models can take 30-60 seconds to load into memory. Wait for the model backend to print its "ready" message before starting ANTIKODE.

### "Model file not found"

**Problem:** The GGUF model file path in the configuration is incorrect.

**Solutions:**

1. **Verify the file exists:**
   ```bash
   ls -la /path/to/your/model.gguf
   ```

2. **Use an absolute path:**
   ```json
   {
     "model": {
       "path": "/home/username/models/qwen2.5-coder-7b-instruct-q4_k_m.gguf"
     }
   }
   ```

3. **Check file permissions:**
   ```bash
   chmod 644 /path/to/your/model.gguf
   ```

### "Out of memory" error

**Problem:** The model requires more RAM than available.

**Solutions:**

1. **Use a smaller model:**
   - Switch from 7B to 1.5B parameters
   - Use a more quantized version (q4_k_m uses less RAM than q8_0)

2. **Reduce context length:**
   ```json
   {
     "model": {
       "context_length": 2048
     }
   }
   ```

3. **Use CPU-only mode:**
   Remove `--n-gpu-layers` or set to 0 to avoid GPU memory pressure.

4. **Close other memory-intensive applications** before running large models.

5. **Monitor memory usage:**
   ```bash
   # Linux
   free -h
   # macOS
   memory_pressure
   # Windows (Task Manager)
   ```

### Slow model response times

**Problem:** Model inference is taking too long.

**Solutions:**

1. **Enable GPU acceleration:**
   ```bash
   llamafile --server --model model.gguf --n-gpu-layers -1
   ```

2. **Use a smaller model:**
   1.5B models are significantly faster than 7B models.

3. **Reduce context length:**
   ```json
   {
     "model": {
       "context_length": 4096
     }
   }
   ```

4. **Use a more aggressively quantized model:**
   `q4_k_m` is faster than `q8_0` or `f16`.

5. **Check CPU/GPU utilization:**
   ```bash
   # CPU
   top
   # GPU (NVIDIA)
   nvidia-smi -l 1
   ```

6. **Close background processes** competing for resources.

### "Permission denied" errors

**Problem:** An agent cannot perform a requested operation.

**Solutions:**

1. **Check current permissions:**
   ```
   /permit list
   ```

2. **Grant permission:**
   ```
   /permit allow build write
   /permit allow build bash
   ```

3. **Check for path-based overrides** in the permission configuration file.

4. **Reset permission cache:**
   ```
   /permit reset
   ```

### Edit tool fails with "oldString not found"

**Problem:** The agent tried to edit a file but the text to replace doesn't exist.

**Solutions:**

1. **The file may have changed** since the agent read it. The agent should re-read the file and retry.

2. **Whitespace differences:** The agent's oldString may have different indentation or line endings. Try asking the agent to be more precise about the text to replace.

3. **Line ending issues:** On Windows, files may use CRLF (\r\n) while the agent expects LF (\n). Ensure consistent line endings.

### TUI display issues

**Problem:** The TUI looks garbled or has rendering problems.

**Solutions:**

1. **Check terminal compatibility:**
   - Use Windows Terminal (not the legacy console) on Windows
   - Use iTerm2, Kitty, or Alacritty for best results

2. **Set the TERM environment variable:**
   ```bash
   export TERM=xterm-256color
   ```

3. **Check terminal color support:**
   ```bash
   echo $TERM
   # Should include "256color" or "truecolor"
   ```

4. **Resize terminal:** Some display issues resolve on terminal resize.

5. **Try minimal mode:**
   ```bash
   antikode --minimal
   ```

6. **Clear and restart:**
   ```bash
   reset
   antikode
   ```

### "Failed to initialize terminal" error

**Problem:** ANTIKODE cannot initialize the TUI.

**Solutions:**

1. **Check that your terminal supports the required features:**
   - ANSI escape codes
   - 256 colors
   - Cursor positioning

2. **Try with a minimal terminal:**
   ```bash
   antikode --minimal
   ```

3. **Check the TERM variable:**
   ```bash
   echo $TERM
   export TERM=xterm-256color
   ```

4. **On Windows:** Ensure you're using Windows Terminal, not the legacy console.

### Session won't restore

**Problem:** A saved session cannot be loaded.

**Solutions:**

1. **Check session integrity:**
   ```
   /session verify <name>
   ```

2. **Try loading the most recent auto-save:**
   ```
   /session restore --latest
   ```

3. **Manual recovery:**
   ```bash
   # Find session files
   ls ~/.antikode/sessions/
   # Check if session.json is valid JSON
   cat ~/.antikode/sessions/<session-id>/session.json | python -m json.tool
   ```

4. **If corrupted:** You may need to start a new session. The AIOSS ledger can help reconstruct the last known state.

### AIOSS ledger verification fails

**Problem:** The ledger chain integrity check reports errors.

**Solutions:**

1. **Check which entries are affected:**
   ```
   /ledger verify --verbose
   ```

2. **Determine if the chain break is due to:**
   - Manual file modification (tampering)
   - Disk corruption
   - Software bug

3. **Export the ledger before any repair:**
   ```
   /ledger export
   ```

4. **Rebuild the chain from the last valid entry:**
   This may be necessary if the corruption is extensive. File a bug report if this occurs.

### "Command not found" for /commands

**Problem:** A /command is not recognized.

**Solutions:**

1. **Check the command name:**
   ```
   /help
   ```
   Lists all available commands.

2. **Check for typos:** Commands are case-insensitive but must be spelled correctly.

3. **Check the context:** Some commands are only available in specific modes or contexts.

### Agent responds with wrong output

**Problem:** The agent's response is incorrect or nonsensical.

**Solutions:**

1. **Check the model:**
   - Different models have different quality levels
   - Smaller models are more prone to errors

2. **Clear context and retry:**
   ```
   /clear
   ```
   Then rephrase your request.

3. **Be more specific:** Vague prompts get vague responses.

4. **Switch to Plan mode for analysis, then Build mode for implementation.**

5. **Use the Question tool for clarification:**
   The agent should ask clarifying questions if the request is ambiguous.

### Bash commands fail

**Problem:** Commands executed by the agent return errors.

**Solutions:**

1. **Check the command syntax:** The agent may have generated incorrect commands.

2. **Check the working directory:** Ensure the command runs in the correct directory.

3. **Check environment:** Some commands may require specific tools or environment variables.

4. **Grant necessary permissions:**
   ```
   /permit allow build bash
   ```

5. **Set a longer timeout for long-running commands:**
   ```json
   {
     "agents": {
       "build": {
         "options": {
           "max_bash_timeout": 600000
         }
       }
     }
   }
   ```

### MCP server connection fails

**Problem:** MCP server cannot be connected.

**Solutions:**

1. **Check server status:**
   ```
   /mcp status
   ```

2. **Verify the server configuration:**
   - For stdio servers: Check the command and args
   - For SSE servers: Check the URL is reachable

3. **Check server logs:**
   ```
   /mcp logs <server-name>
   ```

4. **Ensure the server executable is installed:**
   Some MCP servers require Node.js or Python.

5. **Test the server independently:**
   ```bash
   # For stdio servers, run the command directly
   node /path/to/mcp-server/index.js
   ```

### Agent takes too long to respond

**Problem:** The agent is processing for an extended period.

**Solutions:**

1. **Press Ctrl+C** to interrupt and try a simpler request.

2. **Check if the model is still running:**
   - Monitor CPU/GPU usage
   - Check model backend logs

3. **Reduce context length:**
   ```json
   {
     "model": {
       "context_length": 4096
     }
   }
   ```

4. **Use a smaller or faster model.**

5. **Be more specific in your request** to reduce the agent's processing time.

### Permission prompts are too frequent

**Problem:** The agent asks for permission for every operation.

**Solutions:**

1. **Use "Allow Always" when approving permissions:**
   Press `A` (capital A) in the permission dialog.

2. **Set persistent permissions:**
   ```
   /permit allow build write
   /permit allow build bash
   ```

3. **Configure permissions in antikode.json:**
   ```json
   {
     "agents": {
       "build": {
         "permissions": {
           "read": "allow",
           "write": "allow",
           "edit": "allow",
           "bash": "allow"
         }
       }
     }
   }
   ```

## Debug Mode

Enable debug mode for more detailed error information:

```bash
antikode --debug
```

Or set the environment variable:

```bash
export ANTIKODE_DEBUG=true
antikode
```

Debug mode shows:
- Full error stack traces
- Tool execution details
- Model communication logs
- Permission evaluation traces

## Logs

ANTIKODE logs are stored in:

```
~/.antikode/logs/
  antikode.log          — Main log file
  antikode.debug.log    — Debug log (when debug mode is enabled)
```

Check the logs for error messages and stack traces:

```bash
tail -100 ~/.antikode/logs/antikode.log
```

## Reporting Issues

If you encounter a bug or issue that isn't covered here:

1. **Check existing issues** on GitHub: https://github.com/antikode/antikode/issues
2. **Enable debug mode** and reproduce the issue
3. **Collect relevant information:**
   - ANTIKODE version: `antikode --version`
   - Operating system and version
   - Terminal emulator
   - Model backend and version
   - Configuration file (redact sensitive info)
   - Debug logs
   - AIOSS ledger export

4. **File a new issue** with the collected information.

## Getting Help

- **Documentation:** Read the full documentation set
- **GitHub Issues:** https://github.com/antikode/antikode/issues
- **Community:** Community support channels (check the GitHub repository for links)

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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