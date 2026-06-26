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

# FAQ: General Questions

## What is ANTIKODE?

ANTIKODE is a terminal-native AI coding engine that runs entirely on your local machine. It connects to local language models (via llamafile, Ollama, or compatible backends) and provides AI-assisted coding through a full-screen terminal user interface or command-line mode.

Unlike cloud-dependent AI coding tools, ANTIKODE processes everything locally. Your code never leaves your machine. It features specialized agents for building, planning, exploring, and researching code, all governed by a fine-grained permission system that puts you in control.

## Who is ANTIKODE for?

ANTIKODE is designed for several groups of developers:

**Privacy-Conscious Developers:**
If you work with proprietary code, healthcare data, financial systems, or any sensitive information, ANTIKODE lets you use AI assistance without sending your code to third-party servers.

**Terminal-Native Developers:**
If you live in the terminal — using tmux, vim/neovim, command-line tools, and SSH — ANTIKODE fits naturally into your workflow. No IDE plugin required.

**Offline Developers:**
If you work on planes, trains, remote locations, or secure facilities without internet access, ANTIKODE works fully offline.

**Cost-Conscious Developers:**
ANTIKODE is free and open-source. No subscriptions, no per-token fees, no premium tiers.

**Open Source Advocates:**
ANTIKODE is fully open source. You can inspect, modify, and distribute the code.

**Team Leads and Engineering Managers:**
If you need audit trails, permission controls, and compliance support for AI-assisted coding, ANTIKODE provides built-in transparency and accountability.

## Why is ANTIKODE local-only by default?

ANTIKODE is designed with a "local-first" philosophy for several fundamental reasons:

**Privacy: Your code is your intellectual property.**
When you use cloud AI tools, you're sending your code — often proprietary, sensitive, or confidential — to third-party servers. ANTIKODE eliminates this risk by processing everything locally.

**Control: You should own your toolchain.**
Cloud services can change pricing, deprecate APIs, or go out of business. A local tool works the same today and tomorrow.

**Reliability: No network dependency.**
Local operation means no latency from network round trips, no downtime from service outages, no rate limits from API providers.

**Cost: Free and unlimited.**
Local inference incurs no per-token costs. Once you have the hardware and the model, usage is free.

**Speed: No network overhead.**
Local inference eliminates 500ms-2s of network round-trip time per interaction.

## Can ANTIKODE use cloud models?

Yes. While the default and recommended configuration is fully local, ANTIKODE supports OpenAI-compatible API endpoints. You can configure it to use cloud models like GPT-4, Claude, or any OpenAI-compatible API.

This is an explicit opt-in configuration change. ANTIKODE never sends data to external services unless you configure it to do so.

To use a cloud model, set the provider to "openai" in your configuration:

```json
{
  "provider": "openai",
  "model": {
    "name": "gpt-4o-mini",
    "openai": {
      "api_key": "${OPENAI_API_KEY}",
      "base_url": "https://api.openai.com/v1"
    }
  }
}
```

## How does ANTIKODE compare to GitHub Copilot?

| Aspect | GitHub Copilot | ANTIKODE |
|--------|---------------|----------|
| Architecture | Cloud-based | Local-first |
| Privacy | Code sent to GitHub | Code stays on your machine |
| Cost | $10-39/month per user | Free |
| UI | IDE plugin | Terminal-native (TUI + CLI) |
| Offline | No | Yes |
| Audit trail | No | AIOSS hash-chained ledger |
| Permission system | None | Granular per-agent/tool |
| Agent system | Single mode | Build, Plan, General, Explore, Scout |
| Model | Proprietary | Any compatible model |
| Open source | No | Yes |
| MCP support | No | Yes |

## How does ANTIKODE compare to Cursor?

| Aspect | Cursor | ANTIKODE |
|--------|--------|----------|
| Architecture | Cloud + local | Local-first |
| Privacy | Code sent to cloud | Code stays on your machine |
| Cost | $20/month | Free |
| UI | VS Code fork | Terminal-native |
| Offline | Limited | Full |
| Audit trail | No | AIOSS hash-chained ledger |
| Permission system | Limited | Granular per-agent/tool |
| Model | Multiple (limited) | Any compatible model |
| Open source | No | Yes |

## How does ANTIKODE compare to Cody (Sourcegraph)?

| Aspect | Cody | ANTIKODE |
|--------|------|----------|
| Architecture | Cloud | Local-first |
| Privacy | Code sent to Sourcegraph | Code stays on your machine |
| Cost | Free + paid tiers | Free |
| UI | VS Code / JetBrains plugin | Terminal-native |
| Offline | No | Yes |
| Audit trail | No | AIOSS hash-chained ledger |
| Permission system | Limited | Granular per-agent/tool |
| Custom commands | Yes | Yes (via scripting) |
| Open source | Partially | Fully |

## Do I need a powerful computer?

ANTIKODE itself is lightweight — the binary is a few megabytes and uses minimal CPU/RAM when idle. The hardware requirement comes primarily from the model you choose:

- **1.5B parameter models:** 4GB RAM, any CPU — runs on almost any modern computer
- **7B parameter models:** 8GB RAM, recommended GPU acceleration
- **13B+ parameter models:** 16GB+ RAM, GPU recommended
- **34B+ parameter models:** 32GB+ RAM, GPU required

ANTIKODE works on any system that can run a model. You can use small models on modest hardware and still get useful code assistance.

## Is ANTIKODE really free?

Yes. ANTIKODE is free and open-source under a permissive license. There are no:
- Subscription fees
- Per-token charges
- Premium tiers
- Paid features

The only cost is the hardware you already own and, optionally, cloud API fees if you choose to use cloud models.

## Can I use ANTIKODE at work?

That depends on your organization's policies. Because ANTIKODE is:

1. **Fully local** — No data leaves your machine
2. **Open source** — Your security team can audit the code
3. **Auditable** — The AIOSS ledger provides complete records
4. **Configurable** — Permissions can be locked down to meet security requirements

ANTIKODE is designed to meet the requirements of organizations that cannot use cloud AI tools due to privacy, security, or compliance concerns.

## Does ANTIKODE collect telemetry?

No. ANTIKODE does not collect any telemetry, usage data, or analytics. It makes no network requests unless you explicitly configure it to (e.g., for web fetch or cloud model access).

You can verify this by:
1. Checking the source code
2. Running a network monitor while using ANTIKODE
3. Building from source

## What programming languages does ANTIKODE support?

ANTIKODE works with any programming language. It uses language-agnostic tools (read, write, edit, bash) and relies on the underlying model's language capabilities.

Code-specialized models like Qwen2.5-Coder and DeepSeek-Coder excel at:
- Python, JavaScript, TypeScript, Go, Rust, Java, C/C++, C#
- Web technologies (HTML, CSS, React, Vue, etc.)
- SQL and database queries
- Shell scripting (bash, PowerShell)
- Configuration files (JSON, YAML, TOML)

The model you choose determines language support, not ANTIKODE itself.

## Can I use ANTIKODE for non-coding tasks?

While ANTIKODE is optimized for coding, the General Agent (@general) can answer general questions, research topics, and provide explanations. The flexibility depends on the capabilities of the underlying model.

## Does ANTIKODE work with my editor?

Yes. ANTIKODE is editor-agnostic. Because it runs in the terminal:

- Use it alongside vim/neovim in separate tmux panes
- Open it in VS Code's integrated terminal
- Use it as a standalone tool
- Script it in your build pipeline

No IDE plugin is required, though community plugins may emerge.

## Can I contribute to ANTIKODE?

Yes! ANTIKODE is open source and welcomes contributions. You can:

- Report bugs and suggest features on GitHub
- Submit pull requests for bug fixes and improvements
- Write documentation and tutorials
- Create MCP servers for the ecosystem
- Build community tools and integrations

The project is on GitHub at https://github.com/antikode/antikode.

## Who created ANTIKODE?

ANTIKODE was created by Lois-Kleinner and 0-1.gg. The project name combines "anti" (against) and "kode" (code) — representing a stance against cloud-dependent, privacy-invasive AI coding tools.

## What does the name ANTIKODE mean?

"ANTIKODE" is a compound name:

- **ANTI** — Against the status quo of cloud-dependent, privacy-violating AI tools
- **KODE** — Code, the thing developers create and work with

Together, it represents a tool that's counter to the mainstream approach to AI-assisted coding — local instead of cloud, private instead of surveilled, controlled instead of autonomous.

## Is ANTIKODE production-ready?

ANTIKODE is designed for production use. Key features for production environments include:

- **AIOSS ledger** — Complete audit trail for compliance
- **Permission system** — Fine-grained access control
- **Session management** — Persistent, recoverable sessions
- **Undo/redo** — Reversible operations
- **Automated testing support** — CI/CD integration

However, as with any tool, you should evaluate it for your specific use case and requirements.

## What is a "terminal-native" application?

A terminal-native application is designed specifically for the terminal, not ported from a GUI or web application. Key characteristics:

- Full-screen terminal UI (not just a command line)
- Keyboard-driven navigation
- ANSI colors and formatting
- No mouse requirement (though often supported)
- Works in any terminal emulator
- Compatible with tmux, screen, SSH

ANTIKODE uses the Bubble Tea TUI framework, which is purpose-built for terminal-native applications.

## What models work best with ANTIKODE?

While ANTIKODE works with any compatible model, code-specialized models generally perform best:

| Model | Size | Quality | Hardware |
|-------|------|---------|----------|
| Qwen2.5-Coder-7B-Instruct | 4.5GB | Excellent | 8GB RAM, GPU recommended |
| DeepSeek-Coder-6.7B-Instruct | 4GB | Excellent | 8GB RAM, GPU recommended |
| CodeLlama-7B-Instruct | 4GB | Good | 8GB RAM, GPU recommended |
| Qwen2.5-Coder-1.5B-Instruct | 1GB | Good | 4GB RAM, any CPU |
| Qwen2.5-Coder-14B-Instruct | 9GB | Superior | 16GB RAM, GPU required |
| DeepSeek-Coder-33B-Instruct | 20GB | Superior | 32GB RAM, GPU required |
| Phi-3-Mini-4K-Instruct | 2.5GB | Good | 6GB RAM, any CPU |

Model quality generally scales with size, but even 1.5B-7B models provide useful code assistance.

## Can I run multiple models simultaneously?

ANTIKODE supports configuring different models for different agents. For example, you could use:

- A fast 1.5B model for the Scout Agent (quick searches)
- A capable 7B model for the Build Agent (code generation)
- A powerful 14B model for the Plan Agent (deep analysis)

This requires running multiple model backends and configuring each agent to use a different one.

## How do I update ANTIKODE?

Download the latest binary from the GitHub releases page:

```bash
# Linux / macOS
curl -LO https://github.com/antikode/antikode/releases/latest/download/antikode-$(uname -s)-$(uname -m).tar.gz
tar xzf antikode-*.tar.gz
sudo mv antikode /usr/local/bin/

# Windows PowerShell
Invoke-WebRequest -Uri "https://github.com/antikode/antikode/releases/latest/download/antikode-windows-x86_64.zip" -OutFile "antikode.zip"
Expand-Archive -Path "antikode.zip" -DestinationPath "C:\antikode" -Force
```

## What terminals are supported?

ANTIKODE works with any modern terminal emulator that supports ANSI 256-color:

- **Windows:** Windows Terminal (recommended), ConEmu, Alacritty
- **macOS:** iTerm2 (recommended), Terminal.app, Kitty, Alacritty
- **Linux:** GNOME Terminal, Konsole, Kitty, Alacritty, xterm (basic)

Note: The standard Windows console (conhost.exe) has limited ANSI support. Windows Terminal is recommended on Windows.

## Where can I get help?

- **Documentation:** Read the docs in this documentation set
- **GitHub Issues:** Report bugs and request features
- **Source Code:** https://github.com/antikode/antikode

## How do I report a bug?

File an issue on GitHub at https://github.com/antikode/antikode/issues. Include:

- ANTIKODE version (`antikode --version`)
- Operating system and version
- Terminal emulator
- Model backend and version
- Steps to reproduce the issue
- Expected vs actual behavior
- Relevant logs or error messages
- AIOSS ledger export (if applicable)

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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