<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Enterprise Onboarding

This guide covers guided setup for enterprise deployments including the installer, first-run wizard, and license key configuration.

## Enterprise Installer

### Prerequisites

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| CPU cores | 8 | 32+ |
| RAM | 16 GB | 64 GB |
| Storage | 500 GB SSD | 2 TB NVMe |
| OS | Ubuntu 22.04, RHEL 9, Windows Server 2022 | Same |
| Filesystem | ext4, NTFS, xfs | xfs (Linux) |

### Download

`ash
# Enterprise installer bundle
curl -LO https://enterprise.kazcade.io/v0.6.0/kazcade-enterprise-linux-x86_64.run
chmod +x kazcade-enterprise-linux-x86_64.run

# Windows (PowerShell Admin)
Invoke-WebRequest -Uri "https://enterprise.kazcade.io/v0.6.0/kazcade-enterprise-windows-x64.exe" -OutFile "kazcade-enterprise.exe"
`

### Installation

`ash
# Interactive install
sudo ./kazcade-enterprise-linux-x86_64.run

# Silent install with config
sudo ./kazcade-enterprise-linux-x86_64.run \
  --prefix /opt/kazcade \
  --config install-config.yml \
  --license /path/to/license.lic
`

### Installation Structure

`
/opt/kazcade/
├── bin/
│   ├── kazkade          # Main binary
│   ├── kazcade-ctl      # Control utility
│   └── kazcade-connector # Connector manager
├── etc/
│   ├── kazkade.toml     # Main config
│   ├── license.lic      # License file
│   └── enterprise.toml  # Enterprise features
├── lib/
│   ├── libkazcade.so
│   └── plugins/
├── data/
│   ├── ledgers/
│   ├── stores/
│   └── temp/
├── logs/
│   ├── access.log
│   ├── error.log
│   └── audit.log
└── scripts/
    ├── start.sh
    ├── stop.sh
    └── backup.sh
`

## First-Run Wizard

`ash
kazcade-ctl wizard
`

### Step 1: License Key

`
┌──────────────────────────────────┐
│  Kazkade Enterprise License     │
│                                  │
│  License Key: ████████████████  │
│                                  │
│  [Validate]  [Skip (14-day eval)]│
└──────────────────────────────────┘
`

### Step 2: Administrator Account

`
┌──────────────────────────────────┐
│  Create Admin Account           │
│                                  │
│  Email:    admin@company.com    │
│  Password: [••••••••••]         │
│  Name:     Jane Doe             │
│                                  │
│  SSH Key:  [optional]           │
│                                  │
│  [Create]                        │
└──────────────────────────────────┘
`

### Step 3: Storage Configuration

`
┌──────────────────────────────────┐
│  Storage Configuration          │
│                                  │
│  Data Path:   /data/kazcade     │
│  Ledger Path: /data/kazcade/    │
│               ledgers           │
│  Backup Path: /backup/kazcade   │
│                                  │
│  Encryption:  [✓] AES-256-GCM  │
│                                  │
│  [Test] [Continue]               │
└──────────────────────────────────┘
`

### Step 4: Network Configuration

`
┌──────────────────────────────────┐
│  Network Configuration          │
│                                  │
│  HTTP Port:      8742            │
│  HTTPS Port:     8743            │
│  IPC Socket:     /var/run/       │
│                  kazkade.sock   │
│  TLS Cert:       /etc/ssl/      │
│                  kazkade.crt    │
│  TLS Key:        /etc/ssl/      │
│                  kazkade.key    │
│                                  │
│  [Generate Self-Signed] [Next]  │
└──────────────────────────────────┘
`

### Step 5: SSO Integration (Optional)

`
┌──────────────────────────────────┐
│  Single Sign-On                 │
│                                  │
│  Provider: [Okta v]             │
│  ┌────────────────────────┐    │
│  │ SAML 2.0 Metadata URL  │    │
│  │                        │    │
│  │ [Upload Metadata]       │    │
│  └────────────────────────┘    │
│                                  │
│  [Skip] [Test Connection]       │
└──────────────────────────────────┘
`

### Step 6: Summary

`
┌──────────────────────────────────┐
│  Configuration Summary          │
│                                  │
│  License:  Enterprise Gold      │
│  Admin:    jane@company.com     │
│  Data:     /data/kazcade        │
│  TLS:      Enabled              │
│  SSO:      Okta (SAML 2.0)      │
│                                  │
│  [< Back] [Apply Configuration] │
└──────────────────────────────────┘
`

## License Key Configuration

### License Types

| Tier | Features | Max Nodes | Support |
|------|----------|-----------|---------|
| Bronze | Core + RBAC | 3 | Business hours |
| Silver | + SSO + Audit | 10 | 8x5 |
| Gold | + SLA + Multi-DC | 25 | 24x7 |
| Platinum | Unlimited | Unlimited | Dedicated |

### Activate License

`ash
# Online activation
kazcade-ctl license activate --key XXXX-XXXX-XXXX-XXXX

# Offline activation
kazcade-ctl license request --output request.json
# Upload request.json to https://enterprise.kazcade.io/license/activate
# Download response.lic
kazcade-ctl license apply response.lic
`

### Check License Status

`ash
kazcade-ctl license status
`

`
License Status:
  Tier:       Enterprise Gold
  Valid:      Yes
  Expires:    2027-06-19
  Nodes:      15/25 used
  Features:   RBAC, SSO, Audit, SLA, Multi-DC
  Support:    24x7 Priority
`

### License Monitoring

`ash
kazkade dashboard --admin --license
`

Shows:

`
┌──────────────────────────────────────┐
│ License Usage                        │
│                                      │
│ Nodes: ████████░░░░ 15/25            │
│ Storage: ██████░░░░ 1.2 TB / 5 TB   │
│ QPS: ████░░░░░░░ 4500 / 10000       │
│                                      │
│ Days remaining: 365                  │
│ Renewal date: 2027-06-19            │
└──────────────────────────────────────┘
`

## Post-Install Verification

`ash
# Run enterprise self-test
kazcade-ctl verify

# Output:
# ✓ License: VALID (Enterprise Gold)
# ✓ Storage: /data/kazcade (2 TB NVMe)
# ✓ Ledger: Initialized (24 entries)
# ✓ TLS: Enabled (cert expires 2027-06-19)
# ✓ SSO: Connected (Okta)
# ✓ RBAC: Active (3 roles)
# ✓ Audit: Logging enabled
# All checks passed.
`

## Managing the Service

`ash
# Start/stop/restart
kazcade-ctl start
kazcade-ctl stop
kazcade-ctl restart

# Status
kazcade-ctl status

# Systemd integration (Linux)
systemctl enable kazkade
systemctl start kazkade

# Windows Service
sc create kazkade binPath="C:\Program Files\Kazcade\kazcade.exe --service"
sc start kazkade
`

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

