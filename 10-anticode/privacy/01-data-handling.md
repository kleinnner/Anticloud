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

# Data Handling: What ANTIKODE Collects and How It Processes

## Overview

ANTIKODE is designed on a principle of absolute data minimalism: the system collects nothing. This document provides a comprehensive accounting of data handling in ANTIKODE, covering what data is processed, where it resides, and how it is protected.

## Data Collection

### Absolutely Nothing

ANTIKODE does not collect any telemetry, analytics, usage statistics, or personal information. There are no tracking mechanisms, no analytics endpoints, no phone-home functionality, and no user behavior monitoring.

The following is an exhaustive list of what ANTIKODE does NOT collect:
- Source code content
- File names or paths
- Project names or structures
- Usage frequency or patterns
- Error logs or crash reports
- System information (OS, hardware, locale)
- User identity or credentials
- Network information
- Any form of personal data

### No Network Communication

ANTIKODE performs no network communication during normal operation. The only network activity related to ANTIKODE is:

1. **Model Downloading**: When the user explicitly requests it, ANTIKODE downloads model files from the user-specified source. This is a one-time operation per model. The user controls which sources to use.
2. **Optional Updates**: If configured, ANTIKODE may check for updates from user-specified sources. This is disabled by default.

Both activities are user-initiated and user-controlled. ANTIKODE does not perform any background network activity.

## Data Processing

### Inference Context

When a developer uses ANTIKODE for code assistance, the following data is temporarily processed:

1. **Code Context**: The current file content, cursor position, and surrounding code context as determined by the user's selection or automatic context window.
2. **User Prompt**: Any natural language prompt provided by the developer.

This data is processed entirely on the local machine. It is provided to the local LLM inference engine, which generates a response based on its pre-trained parameters. No data is transmitted externally.

### Processing Lifecycle

1. **Input**: The developer invokes ANTIKODE with code context and optional prompt.
2. **Inference**: The local LLM processes the input and generates output. This occurs entirely in system memory.
3. **Output**: The generated code or text is displayed to the developer.
4. **Logging**: A hash of both the input context and the output is recorded in the .aioss ledger (see /docs/data-safety/01-aioss-ledger.md). The full content is not stored.
5. **Cleanup**: Temporary processing buffers are cleared after inference completes.

## Data Storage

### .aioss Ledger

The ledger stores cryptographic hashes of inference events, not the full content. The ledger is stored in `.ANTIKODE/ledger/` within the project directory. Users can configure retention periods and selective deletion.

### Model Files

Downloaded model files are stored in the user-configured model cache directory (default: `~/.cache/ANTIKODE/models/`). These files contain the pre-trained model parameters only. They do not contain user data.

### Configuration

Configuration files are stored in `.ANTIKODE/config.toml`. These contain user preferences and model selection. No sensitive data is stored in configuration files by default.

## Data Deletion

Users can delete all ANTIKODE-related data by:

1. Removing the `.ANTIKODE` directory from the project root (deletes ledger and configuration).
2. Removing the model cache directory (deletes downloaded models).
3. Uninstalling the ANTIKODE binary.

No residual data remains on the system after these steps.

## Privacy Guarantees

ANTIKODE provides the following privacy guarantees:

1. **No data leaves your machine**: All processing is local. No network communication.
2. **No data collection**: No telemetry, analytics, or usage data.
3. **No third-party access**: No data is accessible to third parties.
4. **No model training**: Your code is never used to train or fine-tune models.
5. **No persistent code storage**: Your code is processed in memory and only hashes are persisted.

## Verification

Users can verify these claims through:

1. **Source code availability**: ANTIKODE's source code is open source and auditable.
2. **Network monitoring**: Use system tools to verify no network connections are established.
3. **Filesystem inspection**: Inspect the .ANTIKODE directory to verify what data is stored.
4. **Ledger integrity**: Verify the .aioss ledger does not contain full content.

## Works Cited

NIST. *Privacy Framework: A Tool for Improving Privacy through Enterprise Risk Management*. NIST, 2020.

European Parliament. "Regulation (EU) 2016/679 of the European Parliament and of the Council (General Data Protection Regulation)." *Official Journal of the European Union*, vol. L119, 2016, pp. 1-88.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
