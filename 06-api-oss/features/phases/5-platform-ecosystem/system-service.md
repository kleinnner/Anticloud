---
title: "System Service"
sidebar_position: 99
description: "Runs API-OSS as a background system service on all major platforms: Windows service"
tags: [features]
---

# System Service

## What It Does
Runs API-OSS as a background system service on all major platforms: Windows service
(Service Control Manager), Linux systemd, and macOS launchd. Auto-start on boot with proper
process management, crash recovery (Restart=on-failure with 5s delay), and logging
integration (systemd journal, Event Viewer, unified log). Includes system tray integration
for status monitoring and quick controls (open UI, restart, stop, view logs).

## How It Works
Service management is implemented in `service.rs` under `ai-oss-gateway/src/` using platform-
specific APIs. On Windows, the `windows-service` Rust crate integrates with the Service
Control Manager (SCM). The service registers with a display name "API-OSS Gateway" and a
description. It supports standard SCM controls: start, stop, pause, continue, and custom
control codes for log rotation and config reload. On Linux, the `install` command generates
a systemd unit file at `/etc/systemd/system/api-oss.service` with: `Type=simple`,
`User=api-oss` (creates user if needed), `WorkingDirectory=/var/lib/api-oss`,
`ExecStart=/usr/local/bin/api-oss start`, `Restart=on-failure`, `RestartSec=5s`,
`StandardOutput=journal`, `StandardError=journal`. The unit file includes resource limits
(`LimitNOFILE=65536`, `LimitNPROC=4096`) and sandboxing directives (`ProtectSystem=strict`,
`PrivateTmp=true`, `NoNewPrivileges=true`) following security best practices. On macOS, a
launchd plist is generated at `~/Library/LaunchAgents/io.api-oss.gateway.plist` with
`KeepAlive=true`, `RunAtLoad=true`, and standard logging configuration. The CLI provides
`api-oss service install`, `service uninstall`, `service status`, `service start`, and
`service stop` — part of ServiceCmd in the 87-command CLI with 5 subcommands. The service
starts the gateway binary with the `start` command, launching the WebSocket server (3030),
HTTP UI (8081), metrics endpoint (9000), and any configured bridge/tunnel agents. The
service binary (~81 MB) is the same single binary used for interactive mode. System tray
integration (optional, `service.tray: true` in `opencode.json`) uses `tray-icon` or
platform-specific APIs. The tray shows a status icon (green = running, yellow = starting,
red = stopped) with a right-click menu: open UI, restart, stop, show logs, show status.

The CLI argument parsing for the ServiceCmd subcommand enum uses clap's derive API:
`#[derive(clap::Subcommand)]` on the `ServiceCmd` enum with variants `Install`, `Uninstall`,
`Start`, `Stop`, and `Status`. Each variant carries clap attributes for help text and
argument definitions. When invoked, the CLI connects to the running gateway via WebSocket on
port 3030 and sends the corresponding `ClientMessage` variant (e.g., `service_install`,
`service_status`) over the `tokio-tungstenite` connection. The gateway processes these
messages as tokio tasks — the service manager spawns one task per platform-specific
operation, binding to the SCM API (Windows), systemd D-Bus (Linux), or launchd socket
(macOS) respectively. Each task has a configurable timeout of 30 seconds to prevent hangs
during service registration or unregistration. The service manager also exposes a health
probe tokio task that emits heartbeat metrics to Prometheus on port 9000 every 15 seconds,
allowing the Kubernetes HorizontalPodAutoscaler and system monitoring to detect service
availability. All service lifecycle events are written to the ledger as attested entries,
providing a complete operational audit trail of when the gateway was installed, started,
stopped, or updated.

## How to Operate
1. Start in interactive mode first to verify configuration: `api-oss start`.
2. Install as a system service: `api-oss service install` — auto-detects the OS.
3. On Linux: creates systemd unit and enables it (`systemctl enable`).
4. On Windows: registers with SCM (admin prompt required).
5. On macOS: creates launchd plist and loads it (`launchctl load`).
6. Start the service: `api-oss service start` or OS-native commands.
7. Check status: `api-oss service status` — shows running state, uptime, PID, memory.
8. View logs: Linux `journalctl -u api-oss -f`, Windows Event Viewer, macOS `log show`.
9. Stop: `api-oss service stop` — graceful shutdown with in-flight operation completion.
10. Uninstall: `api-oss service uninstall` — stops and removes service registration.
11. System tray: set `service.tray: true` in `opencode.json`.
12. Configure auto-start: `service.restart_policy` and `service.restart_delay`.
13. Set environment overrides in `opencode.json`:
    ```json
    {
      "service": {
        "restart_policy": "on-failure",
        "restart_delay": "10s",
        "tray": true,
        "log_level": "info"
      }
    }
    ```
14. View detailed service metrics: `api-oss doctor --service` — checks SCM/systemd/launchd
    status, resource usage, uptime, and last restart reason.
15. For fleet management: combine with `api-oss tco` to generate per-machine service cost
    reports across all deployed instances.

## The Moat
- Competitors assume cloud deployment and offer no system service management for local
  installations — Palantir has no local service; OpenAI/Anthropic are cloud-only.
- For a sovereign AI platform designed to run 24/7 on user hardware, proper service
  integration with auto-start, crash recovery, and OS-level process management is essential.
- The single binary works as both interactive CLI and system service — no separate build.
- Sandboxing directives in the systemd unit file (ProtectSystem, PrivateTmp,
  NoNewPrivileges) follow production security best practices.

## Why Choose API-OSS
An enterprise IT administrator pushes the API-OSS binary via SCCM, runs `api-oss service
install` as a post-install script, and the AI platform runs on every workstation with auto-
start on boot and centralized log management. A defense operator installs the service once
and API-OSS runs reliably 24/7 with automatic crash recovery.

## Competitive Comparison
- **Palantir**: No local service management — always cloud or dedicated server deployment.
- **OpenAI/Anthropic**: Cloud-only APIs, no local service concept.
- **Nvidia**: No system service for AI platform deployments.
- **Ollama**: Has service management but inference-only.

## Cost-Benefit Analysis
Manual startup after each boot: 30 seconds x 250 days = 125 min/year per machine. For 500
machines: ~1,040 hours/year ($78k at $75/hour). Service auto-start eliminates this. Without
service manager, crash downtime averages 4 hours. With systemd auto-restart, downtime is 5
seconds. For critical AI platform, 4 hours of downtime costs $10k–$100k.

Deploying a comparable service management solution via third-party tools: NSSM (Windows)
requires manual configuration per machine (~30 min each at $75/hour = $37.50/machine);
systemd unit files must be written by hand for each Linux deployment; launchd plists require
macOS expertise. API-OSS automates all three platforms from a single `service install`
command. Palantir Foundry has no local service management — organizations using Foundry
must deploy dedicated server infrastructure with 24/7 operations staff ($200k+/year salary),
whereas API-OSS runs as a lightweight service on existing workstations. Cloud alternatives
(OpenAI, Anthropic) require always-on internet connectivity — a 4-hour internet outage costs
$10k–$50k in lost productivity for an AI-dependent team, while API-OSS service continues
running locally even during network failures. The built-in system tray eliminates the need
for separate monitoring software ($500–$2,000/year per machine for tools like Datadog or
New Relic agent deployment) by providing real-time status visualisation directly on the
desktop with zero additional cost and zero configuration overhead.

## Applications
- **Consumer**: Install once, auto-start on boot, always-available AI in background.
- **Government / Defense**: Reliable 24/7 operation on dedicated hardware.
- **Enterprise**: Managed fleet deployment with standardized service configuration.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
