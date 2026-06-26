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

# Configuration

## Overview

ANTIKODE is configured through a JSON file named `antikode.json` placed in the project root directory or in `~/.antikode/config.json`. The configuration file controls every aspect of the system: provider selection, model parameters, agent behavior, permission rules, UI customization, and more.

## Configuration File Locations

ANTIKODE looks for configuration in the following order (later files override earlier ones):

1. **Built-in defaults** — Hardcoded sensible defaults
2. **Global config** — `~/.antikode/config.json`
3. **Project config** — `<project-root>/antikode.json`
4. **Environment variables** — `ANTIKODE_*` prefixed variables
5. **CLI flags** — Command-line arguments to `antikode`

## Configuration File Example

```json
{
  "version": "1.0",
  "provider": "llamafile",
  "model": {
    "path": "/home/user/models/qwen2.5-coder-7b-instruct.gguf",
    "context_length": 8192,
    "temperature": 0.2,
    "top_p": 0.9,
    "stop": ["</s>", "<|im_end|>"],
    "parameters": {
      "repeat_penalty": 1.1,
      "frequency_penalty": 0.0,
      "presence_penalty": 0.0
    }
  },
  "agents": {
    "build": {
      "temperature": 0.2,
      "context_length": 8192,
      "permissions": {
        "read": "allow",
        "write": "ask",
        "edit": "ask",
        "bash": "ask",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "webfetch": "deny",
        "question": "allow",
        "todo": "allow"
      }
    },
    "plan": {
      "temperature": 0.4,
      "context_length": 16384,
      "permissions": {
        "read": "allow",
        "write": "deny",
        "edit": "deny",
        "bash": "deny",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "webfetch": "allow",
        "question": "allow",
        "todo": "allow"
      }
    }
  },
  "session": {
    "auto_save": true,
    "auto_save_interval_seconds": 60,
    "max_sessions": 10,
    "encryption": {
      "enabled": false
    }
  },
  "memory": {
    "enabled": true,
    "max_entries": 10000,
    "max_storage_mb": 500
  },
  "ledger": {
    "enabled": true,
    "path": "~/.antikode/ledger/",
    "encryption": {
      "enabled": true
    }
  },
  "ui": {
    "theme": "tokyo-night",
    "show_file_tree": true,
    "show_task_board": true,
    "animation_speed": "normal"
  },
  "mcp_servers": {
    "filesystem": {
      "transport": "stdio",
      "command": "node",
      "args": ["/path/to/mcp-filesystem-server/index.js"]
    }
  }
}
```

## Complete Configuration Reference

### Root-Level Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `version` | string | "1.0" | Configuration schema version |
| `provider` | string | "llamafile" | Model backend to use |
| `model` | object | (see below) | Model configuration |
| `agents` | object | (see below) | Per-agent configuration |
| `session` | object | (see below) | Session management configuration |
| `memory` | object | (see below) | Agent memory configuration |
| `ledger` | object | (see below) | AIOSS ledger configuration |
| `ui` | object | (see below) | Terminal UI configuration |
| `mcp_servers` | object | {} | MCP server definitions |
| `delegation` | object | (see below) | Subagent delegation config |
| `task_board` | object | (see below) | Task board configuration |

## Provider Configuration

ANTIKODE supports multiple model backends. The provider is selected via the `provider` field.

### Provider: llamafile (Default)

```json
{
  "provider": "llamafile",
  "model": {
    "path": "/home/user/models/qwen2.5-coder-7b-instruct.gguf",
    "context_length": 8192,
    "temperature": 0.2,
    "top_p": 0.9,
    "stop": ["</s>", "<|im_end|>"],
    "parameters": {
      "repeat_penalty": 1.1,
      "frequency_penalty": 0.0,
      "presence_penalty": 0.0,
      "mirostat": 0,
      "mirostat_tau": 5.0,
      "mirostat_eta": 0.1
    },
    "llamafile": {
      "executable": "llamafile.exe",
      "port": 8080,
      "host": "127.0.0.1",
      "n_gpu_layers": -1,
      "n_threads": 8,
      "flash_attn": true,
      "cache_size_mb": 2048,
      "batch_size": 512
    }
  }
}
```

### Provider: Ollama

```json
{
  "provider": "ollama",
  "model": {
    "name": "qwen2.5-coder:7b",
    "context_length": 8192,
    "temperature": 0.2,
    "top_p": 0.9,
    "ollama": {
      "host": "http://127.0.0.1:11434",
      "keep_alive": "5m",
      "options": {
        "num_ctx": 8192,
        "num_gpu": 1,
        "main_gpu": 0,
        "low_vram": false
      }
    }
  }
}
```

### Provider: OpenAI-Compatible

```json
{
  "provider": "openai",
  "model": {
    "name": "gpt-4o-mini",
    "context_length": 16384,
    "temperature": 0.2,
    "openai": {
      "base_url": "https://api.openai.com/v1",
      "api_key": "${OPENAI_API_KEY}",
      "organization": null,
      "max_retries": 3,
      "timeout_seconds": 60
    }
  }
}
```

### Provider: Custom (OpenAI-compatible local)

```json
{
  "provider": "openai",
  "model": {
    "name": "local-model",
    "context_length": 4096,
    "temperature": 0.2,
    "openai": {
      "base_url": "http://127.0.0.1:8080/v1",
      "api_key": "not-needed",
      "max_retries": 3,
      "timeout_seconds": 120
    }
  }
}
```

## Agent Configuration

Each agent can be independently configured:

```json
{
  "agents": {
    "build": {
      "enabled": true,
      "temperature": 0.2,
      "top_p": 0.9,
      "context_length": 8192,
      "model": "default",
      "system_prompt": "You are a senior software engineer...",
      "permissions": {
        "read": "allow",
        "write": "ask",
        "edit": "ask",
        "bash": "ask",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "webfetch": "deny",
        "question": "allow",
        "todo": "allow"
      },
      "options": {
        "max_tool_calls_per_step": 10,
        "require_bash_description": true,
        "max_bash_timeout": 300000,
        "auto_retry_on_error": true,
        "max_retries": 3,
        "show_tool_diff": true
      }
    },
    "plan": {
      "enabled": true,
      "temperature": 0.4,
      "top_p": 0.9,
      "context_length": 16384,
      "model": "default",
      "permissions": {
        "read": "allow",
        "write": "deny",
        "edit": "deny",
        "bash": "deny",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "webfetch": "allow",
        "question": "allow",
        "todo": "allow"
      },
      "options": {
        "max_tool_calls_per_step": 5
      }
    },
    "general": {
      "enabled": true,
      "temperature": 0.3,
      "context_length": 4096,
      "model": "default",
      "web_fetch_enabled": true,
      "permissions": {
        "read": "allow",
        "write": "deny",
        "edit": "deny",
        "bash": "deny",
        "glob": "deny",
        "grep": "deny",
        "list": "allow",
        "webfetch": "allow",
        "question": "allow",
        "todo": "deny"
      }
    },
    "explore": {
      "enabled": true,
      "temperature": 0.1,
      "context_length": 8192,
      "model": "default",
      "max_files_to_read": 50,
      "permissions": {
        "read": "allow",
        "write": "deny",
        "edit": "deny",
        "bash": "deny",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "webfetch": "deny",
        "question": "allow",
        "todo": "deny"
      }
    },
    "scout": {
      "enabled": true,
      "temperature": 0.0,
      "context_length": 2048,
      "model": "default",
      "max_search_results": 20,
      "permissions": {
        "read": "allow",
        "write": "deny",
        "edit": "deny",
        "bash": "deny",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "webfetch": "deny",
        "question": "allow",
        "todo": "deny"
      }
    }
  }
}
```

### Common Agent Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | true | Enable this agent |
| `temperature` | number | 0.2 | LLM temperature (0.0-1.0) |
| `top_p` | number | 0.9 | Nucleus sampling parameter |
| `context_length` | number | 8192 | Max context window in tokens |
| `model` | string | "default" | Model to use (overrides root model) |
| `system_prompt` | string | default | Custom system prompt |
| `permissions` | object | agent-specific | Per-tool permission levels |
| `options` | object | {} | Agent-specific options |

## Session Configuration

```json
{
  "session": {
    "max_sessions": 10,
    "default_name": "default",
    "auto_save": true,
    "auto_save_interval_seconds": 60,
    "save_on_operation": true,
    "max_auto_saves": 1000,
    "compression": true,
    "encryption": {
      "enabled": false,
      "algorithm": "aes-256-gcm"
    },
    "conversation": {
      "max_messages": 10000,
      "truncation_strategy": "summarize"
    },
    "undo": {
      "max_stack_size": 1000,
      "persist_across_sessions": true
    },
    "storage": {
      "path": "~/.antikode/sessions/",
      "max_size_mb": 1024
    }
  }
}
```

## Memory Configuration

```json
{
  "memory": {
    "enabled": true,
    "storage": {
      "type": "sqlite",
      "path": "~/.antikode/memory/memory.db",
      "encryption": true,
      "max_entries": 10000,
      "max_storage_mb": 500
    },
    "embeddings": {
      "enabled": true,
      "model": "local",
      "dimensions": 384
    },
    "search": {
      "default_strategy": "hybrid",
      "keyword_weight": 0.4,
      "semantic_weight": 0.6,
      "max_results": 20
    },
    "consolidation": {
      "enabled": true,
      "interval_hours": 24,
      "similarity_threshold": 0.75
    },
    "eviction": {
      "policy": "importance_based",
      "auto": true,
      "check_interval_minutes": 60
    }
  }
}
```

## Ledger Configuration

```json
{
  "ledger": {
    "enabled": true,
    "path": "~/.antikode/ledger/",
    "max_entries": 100000,
    "auto_prune": true,
    "prune_after_days": 90,
    "encryption": {
      "enabled": true,
      "algorithm": "aes-256-gcm"
    },
    "signing": {
      "enabled": false,
      "key_path": "~/.antikode/signing_key.pem",
      "algorithm": "ed25519"
    },
    "entry_filter": {
      "log_parameters": true,
      "log_outputs": false,
      "excluded_tools": ["QuestionTool"]
    },
    "verification": {
      "auto_verify_on_start": true,
      "alert_on_chain_break": true
    }
  }
}
```

## UI Configuration

```json
{
  "ui": {
    "theme": "tokyo-night",
    "layout": {
      "show_file_tree": true,
      "show_task_board": true,
      "file_tree_width_ratio": 0.25,
      "task_board_height_ratio": 0.3,
      "chat_width_ratio": 0.75
    },
    "chat": {
      "show_timestamps": true,
      "show_tool_panels": true,
      "max_messages": 500,
      "collapse_tool_results": true,
      "message_display": "compact"
    },
    "animations": {
      "enabled": true,
      "typing_speed": 50,
      "spinner_fps": 15,
      "typing_indicator": true
    },
    "theme": {
      "name": "tokyo-night",
      "dark_mode": true,
      "high_contrast": false,
      "custom_colors": {}
    },
    "keyboard": {
      "custom_bindings": {}
    },
    "minimal_mode": false
  }
}
```

## MCP Configuration

```json
{
  "mcp_servers": {
    "filesystem": {
      "transport": "stdio",
      "command": "node",
      "args": ["/path/to/mcp-filesystem-server/index.js"],
      "env": {
        "ALLOWED_PATHS": "/home/user/project"
      },
      "auto_start": true,
      "restart_on_failure": true,
      "max_restarts": 5,
      "timeout": 10000
    },
    "github": {
      "transport": "sse",
      "url": "https://api.github.com/mcp",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}",
        "User-Agent": "antikode/1.0"
      },
      "auth": {
        "type": "token",
        "env_var": "GITHUB_TOKEN"
      },
      "auto_start": false,
      "timeout": 30000
    },
    "database": {
      "transport": "stdio",
      "command": "python",
      "args": ["-m", "mcp_database_server", "--db-path", "$PROJECT_DIR/data.db"],
      "auto_start": true
    }
  }
}
```

## Delegation Configuration

```json
{
  "delegation": {
    "enabled": true,
    "parallel_execution": true,
    "max_concurrent_delegations": 3,
    "timeout_seconds": 60,
    "collect_results": true,
    "auto_merge": true,
    "agents": {
      "general": {
        "model": "default",
        "temperature": 0.3,
        "context_length": 4096
      },
      "explore": {
        "model": "default",
        "temperature": 0.1,
        "max_files_to_read": 50
      },
      "scout": {
        "model": "default",
        "temperature": 0.0,
        "max_search_results": 20
      }
    }
  }
}
```

## Task Board Configuration

```json
{
  "task_board": {
    "auto_create_tasks": true,
    "auto_detect_priority": true,
    "notifications": true,
    "columns": ["backlog", "active", "blocked", "done"],
    "max_board_tasks": 50,
    "sort_by": "priority",
    "group_by": "status",
    "templates": {
      "bug": {
        "title": "Fix: {{description}}",
        "priority": "P1",
        "tags": ["bug"]
      },
      "feature": {
        "title": "Add: {{description}}",
        "priority": "P2",
        "tags": ["feature"]
      }
    }
  }
}
```

## Environment Variables

ANTIKODE supports the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTIKODE_CONFIG` | Path to config file | `antikode.json` |
| `ANTIKODE_PROVIDER` | Model provider | `llamafile` |
| `ANTIKODE_MODEL` | Model path or name | - |
| `ANTIKODE_SESSION` | Session name | `default` |
| `ANTIKODE_DEBUG` | Enable debug logging | `false` |
| `ANTIKODE_DATA_DIR` | ANTIKODE data directory | `~/.antikode/` |
| `ANTIKODE_THEME` | UI theme name | `tokyo-night` |
| `ANTIKODE_NO_ANIMATIONS` | Disable animations | `false` |
| `ANTIKODE_LOG_LEVEL` | Log level (debug, info, warn, error) | `info` |
| `OPENAI_API_KEY` | API key for OpenAI provider | - |
| `ANTHROPIC_API_KEY` | API key for Anthropic provider | - |

## CLI Flags

```
antikode [options]

Options:
  --config <path>          Path to config file
  --provider <name>        Model provider (llamafile, ollama, openai)
  --model <path|name>      Model path or name
  --session <name>         Session name
  --restore                Restore last session
  --list-sessions          List available sessions
  --version                Show version
  --help                   Show help
  --debug                  Enable debug mode
  --theme <name>           UI theme
  --no-animations          Disable animations
  --log-level <level>      Set log level
  --data-dir <path>        Set data directory
```

## Configuration Best Practices

### For Local Development

```json
{
  "provider": "llamafile",
  "model": {
    "path": "./models/qwen2.5-coder-7b-instruct.gguf",
    "temperature": 0.2
  },
  "agents": {
    "build": {
      "permissions": {
        "write": "ask",
        "edit": "ask",
        "bash": "ask"
      }
    }
  }
}
```

### For CI/CD

```json
{
  "provider": "llamafile",
  "model": {
    "path": "/models/qwen2.5-coder-7b-instruct.gguf",
    "temperature": 0.0
  },
  "agents": {
    "build": {
      "permissions": {
        "write": "allow",
        "edit": "allow",
        "bash": "allow"
      }
    }
  },
  "ledger": {
    "export_on_exit": true,
    "export_format": "json"
  }
}
```

### For Code Review

```json
{
  "agents": {
    "build": {
      "permissions": {
        "write": "deny",
        "edit": "deny",
        "bash": "deny"
      }
    },
    "plan": {
      "temperature": 0.3,
      "context_length": 32768
    }
  }
}
```

## Configuration Validation

ANTIKODE validates the configuration file on startup and reports errors:

```
$ antikode
Error: Invalid configuration:
  - model.path: path does not exist
  - agents.build.permissions: unknown permission level "always"
  - mcp_servers.filesystem: missing required field "command" for stdio transport
```

## Dynamic Configuration

Some configuration values can be changed at runtime via commands:

```
/permit allow build write     — Change permission at runtime
/session config               — View current session config
/session config --set auto_save_interval 30  — Change setting
/theme nord                   — Change theme at runtime
/mode plan                    — Switch agent mode
```

## Conclusion

ANTIKODE's configuration system is designed to be flexible and comprehensive while maintaining sensible defaults. Whether you're running locally with llamafile, connecting to a cloud API, or setting up for CI/CD, the configuration can be tuned to your specific needs without requiring changes to the core application.

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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