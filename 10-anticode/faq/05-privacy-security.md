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

# FAQ: Privacy and Security

## Data Handling

### Does ANTIKODE send my code anywhere?

**No.** By default, ANTIKODE does not send any data over the network. Your code, your prompts, and your files stay entirely on your machine.

The only exceptions are features you explicitly enable:

1. **Web Fetch tool:** Only sends requests to URLs you specify
2. **Cloud model provider:** Only if you configure an external API (OpenAI, etc.)
3. **MCP remote servers:** Only if you configure remote MCP connections

Each of these features is opt-in and clearly labeled.

### How can I verify that ANTIKODE doesn't phone home?

Several ways:

1. **Network monitoring:**
   ```bash
   # Linux
   sudo tcpdump -i any port not 8080 and port not 11434 and host not 127.0.0.1
   # macOS
   sudo tcpdump -i en0 port not 8080 and port not 11434 and host not 127.0.0.1
   # Run ANTIKODE and verify no external connections
   ```

2. **Source code audit:** ANTIKODE is fully open source. You can inspect the code to verify there is no telemetry, analytics, or data collection.

3. **Build from source:** Build the binary yourself to ensure it matches the published source.

4. **Firewall rules:** Block ANTIKODE's outbound connections as an additional safety measure.

### What data does ANTIKODE store locally?

ANTIKODE stores the following data on your local machine:

- **Configuration:** `~/.antikode/config.json` and project-level `antikode.json`
- **Session data:** `~/.antikode/sessions/` — Conversation history, file states, undo stacks
- **Agent memory:** `~/.antikode/memory/` — Persistent knowledge base
- **AIOSS ledger:** `~/.antikode/ledger/` — Hash-chained audit log
- **Logs:** `~/.antikode/logs/` — Debug and error logs
- **Permission cache:** `~/.antikode/permissions/` — Learned permission decisions

### How long is data retained?

Data is retained until you delete it. ANTIKODE does not automatically expire or delete your data. You control what is kept and for how long.

You can manually manage data retention:

```
# Clear agent memory
/memory clear --before 2026-01-01

# Prune old ledger entries
/ledger prune --before 30d

# Delete old sessions
/session cleanup --before 30d
```

### Can I delete all my data?

Yes. All ANTIKODE data is stored in `~/.antikode/`. You can delete this directory at any time:

```bash
rm -rf ~/.antikode
```

This removes all configuration, sessions, memories, and ledger data.

## Offline Usage

### Can ANTIKODE work completely offline?

**Yes.** ANTIKODE is designed for fully offline operation. Once you have:

1. The ANTIKODE binary
2. A model backend (llamafile or Ollama)
3. A model file

You can use ANTIKODE with zero network connectivity. No internet connection is required for any core functionality.

### What features require internet access?

The following features require internet access and are disabled by default:

1. **Web Fetch Tool** — Retrieving web content
2. **Cloud Model Provider** — Using external AI APIs
3. **Remote MCP Servers** — Connecting to external MCP services
4. **Model Download** — Downloading model files (done separately from ANTIKODE)

These features only work when you explicitly enable them.

### Can I verify offline behavior?

1. Disconnect your computer from the internet
2. Start ANTIKODE
3. Verify it works normally
4. Monitor for any connection attempts

## Security

### How does ANTIKODE protect my data?

ANTIKODE implements multiple layers of security:

1. **Local processing:** No data leaves your machine by default
2. **Encryption at rest:** Session, memory, and ledger data can be encrypted with AES-256-GCM
3. **Permission system:** Fine-grained control over agent actions
4. **Path sandboxing:** File operations restricted within project boundaries
5. **AIOSS ledger:** Tamper-evident audit log of all operations
6. **Process isolation:** Model backend runs as a separate process
7. **No telemetry:** No analytics, usage tracking, or data collection

### Is data encrypted at rest?

**Yes, optionally.** You can enable encryption for session data, memory, and ledger files:

```json
{
  "session": {
    "encryption": {
      "enabled": true,
      "algorithm": "aes-256-gcm"
    }
  },
  "memory": {
    "storage": {
      "encryption": true
    }
  },
  "ledger": {
    "encryption": {
      "enabled": true
    }
  }
}
```

Encryption keys are derived from machine-specific secrets. Encrypted data cannot be read on a different machine without the key.

### Can ANTIKODE access files outside my project?

By default, agents can only access files within the project directory where ANTIKODE is started. The permission system provides additional controls:

- **Path-based rules:** Restrict access to specific directories
- **Tool-level permissions:** Control which tools can access which files
- **Zone-based security:** System directories (like /etc, /usr, etc.) are protected by default

### Can ANTIKODE execute dangerous commands?

The permission system prevents unauthorized command execution:

- **Bash commands require approval** by default (Ask permission)
- **Dangerous patterns** (rm -rf, dd, format, etc.) trigger additional warnings
- **Command descriptions** must be provided for clarity
- **All commands are logged** to the AIOSS ledger

### How do I lock down ANTIKODE for sensitive environments?

For maximum security:

1. **Disable all network features:**
   ```json
   {
     "agents": {
       "build": {
         "permissions": {
           "webfetch": "deny"
         }
       },
       "plan": {
         "permissions": {
           "webfetch": "deny"
         }
       }
     }
   }
   ```

2. **Restrict bash access:**
   ```json
   {
     "agents": {
       "build": {
         "permissions": {
           "bash": "ask"
         },
         "options": {
           "require_bash_description": true,
           "max_bash_timeout": 60000
         }
       }
     }
   }
   ```

3. **Enable encryption:**
   ```json
   {
     "session": { "encryption": { "enabled": true } },
     "memory": { "storage": { "encryption": true } },
     "ledger": { "encryption": { "enabled": true } }
   }
   ```

4. **Enable ledger verification on startup:**
   ```json
   {
     "ledger": {
       "verification": {
         "auto_verify_on_start": true,
         "alert_on_chain_break": true
       }
     }
   }
   ```

5. **Audit the ledger regularly:**
   ```
   /ledger verify
   /ledger export
   ```

## AIOSS Ledger

### What is the AIOSS ledger?

The AIOSS (AI Operations Secure Store) ledger is a hash-chained audit log that records every operation ANTIKODE performs. Each entry contains:

- Timestamp and agent ID
- Tool used and its parameters
- Input and output hashes (SHA-256)
- Link to the previous entry (hash chain)
- Optional digital signature

### Why is it hash-chained?

The hash chain makes the ledger tamper-evident. Each entry's hash depends on:

1. The entry's own data
2. The hash of the previous entry

Modifying any entry changes its hash, which breaks the link to all subsequent entries. This makes tampering immediately detectable.

### How do I verify the ledger?

```
/ledger verify
```

This recomputes the hash of every entry and checks that:
1. Each entry's stored hash matches its recomputed hash
2. Each entry's previous_hash matches the prior entry's hash

Any discrepancies are reported with details.

### Can I export the ledger for external auditing?

Yes:

```
/ledger export              — JSON format
/ledger export --format csv  — CSV format
/ledger export --format text — Human-readable format
```

The exported ledger can be independently verified by third parties.

### What operations are logged?

Every tool execution is logged:
- ReadTool (with file path, not content)
- WriteTool (with file path and content hash)
- EditTool (with file path and old/new hashes)
- BashTool (with command and exit code)
- GlobTool (with pattern and results)
- GrepTool (with pattern and match count)
- ListTool (with path)
- WebFetchTool (with URL and status code)
- QuestionTool (with question)
- TodoWriteTool (with action and task ID)

Permission decisions and system events are also logged.

## Compliance

### Can ANTIKODE be used in HIPAA-compliant environments?

ANTIKODE's local-first architecture makes it suitable for HIPAA-compliant environments because:

1. **No data egress:** Protected Health Information (PHI) never leaves the machine
2. **Encryption at rest:** Session and ledger data can be encrypted
3. **Audit trail:** The AIOSS ledger provides complete records of all operations
4. **Access control:** The permission system enforces fine-grained controls

However, you should conduct your own compliance assessment for your specific use case.

### Can ANTIKODE be used in PCI DSS environments?

Similar to HIPAA, ANTIKODE's local operation addresses many PCI DSS requirements:

1. **Data localization:** Cardholder data never leaves the local machine
2. **Access controls:** Granular permission system
3. **Audit logging:** Complete tamper-evident audit trail
4. **Encryption:** Optional at-rest encryption

Conduct a thorough security assessment for your specific PCI DSS requirements.

### Can ANTIKODE be used in government/classified environments?

ANTIKODE's fully offline operation makes it suitable for air-gapped and classified environments:

1. **No network dependency:** Works without any network connectivity
2. **No telemetry:** No data ever leaves the machine
3. **Open source:** Full source code available for security review
4. **Auditable:** Complete record of all operations

Government and defense organizations should conduct their own security certification process.

## Model Security

### Are local models safe?

Local models are as safe as the source they come from. Follow these practices:

1. **Download from trusted sources:** Hugging Face, official model repositories
2. **Verify checksums:** Check SHA-256 hashes against official values
3. **Use reputable models:** Qwen, DeepSeek, CodeLlama, Phi from official publishers
4. **Scan for malware:** Treat model files like any downloaded binary

### Can models access the internet?

No. The model itself is a static file. It cannot make network requests. Network access is controlled by ANTIKODE's tool system:
- The WebFetch tool enables web requests (disabled by default)
- The Bash tool can execute commands that may access the network (requires permission)

### Can models execute code?

Models cannot execute code directly. They can only suggest code to ANTIKODE's tools, which then execute it with your permission. The model is a text prediction engine — it generates text that is interpreted by ANTIKODE's tool system.

## Comparison

### How does ANTIKODE's privacy compare to GitHub Copilot?

| Aspect | GitHub Copilot | ANTIKODE |
|--------|---------------|----------|
| Code sent to cloud | Yes | No |
| Telemetry | Yes | No |
| Offline operation | No | Yes |
| Data encryption | At rest only | At rest + configurable |
| Audit trail | None | AIOSS ledger |
| Open source | No | Yes |
| Third-party audit possible | No | Yes |

### How does ANTIKODE's privacy compare to Cursor?

| Aspect | Cursor | ANTIKODE |
|--------|--------|----------|
| Code sent to cloud | Yes | No |
| Telemetry | Yes | No |
| Offline operation | Limited | Yes |
| Data encryption | At rest | At rest + configurable |
| Audit trail | None | AIOSS ledger |
| Open source | No | Yes |
| Privacy mode | Opt-in only | Default |

## Best Practices

### General Privacy

1. **Use local models exclusively** for maximum privacy
2. **Enable encryption** for stored data
3. **Review permissions** regularly
4. **Audit the AIOSS ledger** periodically
5. **Keep ANTIKODE updated** for security patches
6. **Build from source** if you need maximum assurance

### Enterprise Security

1. **Define permission profiles** for different use cases
2. **Enable ledger signing** for non-repudiation
3. **Export and archive ledgers** for compliance
4. **Restrict web fetch and bash** to approved uses only
5. **Use path-based restrictions** to protect sensitive directories
6. **Conduct regular security reviews** of configuration and logs

### Incident Response

If you suspect a security issue:

1. **Check the AIOSS ledger** to review all recent operations
2. **Verify the ledger chain** with `/ledger verify`
3. **Review session history** for any unauthorized operations
4. **Check file changes** made during the session
5. **Export all relevant data** for forensic analysis
6. **File a security report** on GitHub if you find a vulnerability

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
