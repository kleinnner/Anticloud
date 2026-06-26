<!--
     ▄▄▄   ▄▄▄  ▄▄▄  ▄▄▄▄▄▄▄▄              ▄▄▄▄      ▄▄▄▄     ▄▄▄     
    ██     ███  ███  ██▀▀▀▀▀▀            ▄█▀▀▀▀█    ██▀▀██      ██    
    ██     ████████  ██           ██     ██▄       ██    ██     ██    
    ██     ██ ██ ██  ███████   ▄▄▄██▄▄▄   ▀████▄   ██ ██ ██     ██    
  ▀▀█▄     ██ ▀▀ ██  ██        ▀▀▀██▀▀▀       ▀██  ██    ██     ▄█▀▀  
    ██     ██    ██  ██           ██     █▄▄▄▄▄█▀   ██▄▄██      ██    
    ██     ▀▀    ▀▀  ▀▀                   ▀▀▀▀▀      ▀▀▀▀       ██    
    ▀█▄▄                                                      ▄▄█▀    

MF+SO — Multi Factor+ Sign On
by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner
The Sovereign Identity & Authentication Vault
-->

# Enterprise Installation Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Windows Installation (via GPO)](#windows-installation-via-gpo)
4. [macOS Installation (via MDM)](#macos-installation-via-mdm)
5. [Linux Installation (via apt/rpm)](#linux-installation-via-aptrpm)
6. [Server Deployment](#server-deployment)
7. [Post-Installation Verification](#post-installation-verification)
8. [Troubleshooting Installation](#troubleshooting-installation)

## Introduction

This guide covers enterprise-scale installation of MF+SO across your organization. Whether you're deploying to end-user devices, servers, or both, this document provides step-by-step instructions for Windows, macOS, and Linux deployments using enterprise management tools.

## Prerequisites

### License Requirements

| License Type | Users | Features |
|-------------|-------|----------|
| Enterprise Starter | Up to 100 | Core features, email support |
| Enterprise Standard | Up to 1,000 | All features, phone support |
| Enterprise Premier | Unlimited | All features, dedicated support, SLA |

### System Requirements

#### Server Requirements

| Environment | Minimum | Recommended |
|-------------|---------|-------------|
| CPU | 8 cores | 16+ cores |
| RAM | 32 GB | 64+ GB |
| Storage | 500 GB SSD | 2 TB NVMe |
| Database | PostgreSQL 14 | PostgreSQL 16 |
| Network | 1 Gbps | 10 Gbps |

#### Client Requirements

| OS | Minimum Version | Architecture |
|----|-----------------|--------------|
| Windows | Windows 10 20H2 | x64, ARM64 |
| macOS | macOS 12 Monterey | Intel, Apple Silicon |
| Linux | Ubuntu 20.04 / RHEL 8 | x64, ARM64 |

### Network Requirements

| Destination | Port | Protocol | Purpose |
|-------------|------|----------|---------|
| mfso-server:443 | 443 | HTTPS | API communication |
| mfso-server:8443 | 8443 | HTTPS | Admin console |
| updates.mfso.app | 443 | HTTPS | Update checks |
| verify.mfso.app | 443 | HTTPS | Ledger verification |

### Active Directory / LDAP Prerequisites

| Requirement | Details |
|-------------|---------|
| Domain functional level | Windows Server 2016+ |
| LDAP server | OpenLDAP 2.4+ / 389 Directory Server |
| Service account | Read access to directory |
| Secure connection | LDAPS required |
| Attribute mapping | Define mapping in installation wizard |

## Windows Installation (via GPO)

### Preparing the MSI Package

1. Download the MF+SO Enterprise MSI from your enterprise portal:
   ```
   https://enterprise.mfso.app/downloads/mfso-enterprise-x.x.x.msi
   ```
2. Verify the package signature:
   ```powershell
   Get-AuthenticodeSignature -FilePath mfso-enterprise-x.x.x.msi
   ```
3. Place the MSI on a network share accessible to all target machines:
   ```
   \\company.local\software\mfso-enterprise\mfso-enterprise-x.x.x.msi
   ```

### Creating the GPO

#### Step 1: Create GPO

1. Open Group Policy Management Console (GPMC)
2. Right-click your domain or OU → "Create a GPO in this domain, and Link it here"
3. Name it: "MF+SO Enterprise Installation"
4. Right-click the new GPO → "Edit"

#### Step 2: Configure Software Installation

1. Navigate to: Computer Configuration → Policies → Software Settings → Software installation
2. Right-click → New → Package
3. Browse to the MSI on the network share
4. Select "Assigned" (installation at computer startup)
5. Click OK

#### Step 3: Configure MF+SO Settings (via ADMX)

1. Download the MF+SO ADMX template from enterprise portal
2. Copy `mfso.admx` to `\\domain\SYSVOL\domain\Policies\PolicyDefinitions`
3. Copy `mfso.adml` to `\\domain\SYSVOL\domain\Policies\PolicyDefinitions\en-US`
4. In GPO Editor: Computer Configuration → Policies → Administrative Templates → MF+SO

#### Step 4: Configure Policies

| Policy | Description | Recommended Value |
|--------|-------------|-------------------|
| Server URL | MF+SO server address | `https://mfso.company.com` |
| Auto-update | Enable automatic updates | Enabled |
| Update channel | Stable, Beta, or Insiders | Stable |
| Vault timeout | Auto-lock timeout (seconds) | 300 |
| Clipboard clear | Clipboard clear delay (seconds) | 10 |
| Allow biometrics | Enable biometric unlock | Enabled |
| Require HTTPS | Require HTTPS for all connections | Enabled |

#### Step 5: Deploy Configuration File

Alternatively, deploy a `mfso-config.json` via GPO:

1. Create configuration file:
   ```json
   {
     "server_url": "https://mfso.company.com",
     "auto_update": true,
     "update_channel": "stable",
     "vault_timeout": 300,
     "clipboard_clear": 10,
     "allow_biometrics": true,
     "require_https": true,
     "proxy": {
       "enabled": false,
       "server": "",
       "port": 0
     },
     "logging": {
       "level": "warn",
       "file": "%PROGRAMDATA%\\MF+SO\\logs\\mfso.log"
     }
   }
   ```
2. Place in network share: `\\company.local\config\mfso-config.json`
3. Add to GPO: Computer Configuration → Preferences → Windows Settings → Files
4. Copy to: `%PROGRAMDATA%\MF+SO\mfso-config.json`

### Silent Installation (PowerShell)

For targeted installations or testing:

```powershell
# Download installer
Invoke-WebRequest -Uri "https://enterprise.mfso.app/downloads/mfso-enterprise-x.x.x.msi" -OutFile "C:\temp\mfso-enterprise-x.x.x.msi"

# Verify signature
Get-AuthenticodeSignature -FilePath "C:\temp\mfso-enterprise-x.x.x.msi"

# Silent install
msiexec /i "C:\temp\mfso-enterprise-x.x.x.msi" /quiet /norestart SERVER_URL="https://mfso.company.com" VAULT_TIMEOUT=300

# Verify installation
Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -like "*MF+SO*"}
```

### Post-Installation Configuration

1. **Firewall Rules**: Ensure MF+SO can communicate with your server
   ```powershell
   New-NetFirewallRule -DisplayName "MF+SO Enterprise" -Direction Outbound -Protocol TCP -RemotePort 443 -Action Allow
   ```
2. **Certificate Trust**: Install your enterprise root certificate if using internal CA
3. **Proxy Configuration**: Configure system proxy if required

## macOS Installation (via MDM)

### Preparing the PKG Package

1. Download MF+SO Enterprise PKG:
   ```
   https://enterprise.mfso.app/downloads/mfso-enterprise-x.x.x.pkg
   ```
2. Verify signature:
   ```bash
   pkgutil --check-signature mfso-enterprise-x.x.x.pkg
   ```
3. Create a configuration profile

### Creating Configuration Profile

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.mfso.enterprise.config</string>
            <key>PayloadIdentifier</key>
            <string>com.mfso.enterprise.config.1</string>
            <key>PayloadUUID</key>
            <string>UNIQUE-UUID-HERE</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>server_url</key>
            <string>https://mfso.company.com</string>
            <key>auto_update</key>
            <true/>
            <key>vault_timeout</key>
            <integer>300</integer>
            <key>clipboard_clear</key>
            <integer>10</integer>
            <key>allow_biometrics</key>
            <true/>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>MF+SO Enterprise Configuration</string>
    <key>PayloadIdentifier</key>
    <string>com.mfso.enterprise</string>
    <key>PayloadType</key>
    <string>Configuration</string>
</dict>
</plist>
```

### MDM Deployment Steps

#### Jamf Pro

1. Upload the PKG to Jamf Pro → Computers → Packages
2. Create a policy → "Install MF+SO"
3. Scope to target computers or smart groups
4. Add the configuration profile
5. Set maintenance frequency: "Once per computer"

#### Microsoft Intune

1. Upload PKG to Intune → Apps → macOS
2. Configure app information
3. Assign to groups
4. Upload configuration profile (XML above)

#### Kandji

1. Add PKG to Kandji → Library → Add Custom App
2. Upload the package
3. Configure settings via Blueprint
4. Assign to devices

#### Manual Installation (for testing)

```bash
# Download
curl -O https://enterprise.mfso.app/downloads/mfso-enterprise-x.x.x.pkg

# Verify
pkgutil --check-signature mfso-enterprise-x.x.x.pkg

# Install
sudo installer -pkg mfso-enterprise-x.x.x.pkg -target /

# Verify
ls /Applications/MF+SO.app
```

## Linux Installation (via apt/rpm)

### APT-Based Systems (Ubuntu, Debian)

#### Add Repository

```bash
# Import GPG key
curl -fsSL https://enterprise.mfso.app/keys/mfso-enterprise.gpg | sudo gpg --dearmor -o /usr/share/keyrings/mfso-enterprise.gpg

# Add repository
echo "deb [signed-by=/usr/share/keyrings/mfso-enterprise.gpg] https://enterprise.mfso.app/apt stable main" | sudo tee /etc/apt/sources.list.d/mfso-enterprise.list

# Update package list
sudo apt update
```

#### Install

```bash
# Install
sudo apt install mfso-enterprise

# Verify
dpkg -l | grep mfso-enterprise
```

#### Configure

Configuration file: `/etc/mfso/mfso-config.json`

```json
{
  "server_url": "https://mfso.company.com",
  "auto_update": true,
  "install_source": "apt",
  "vault_timeout": 300
}
```

### RPM-Based Systems (RHEL, CentOS, Fedora)

#### Add Repository

```bash
# For RHEL 9 / CentOS 9
sudo cat > /etc/yum.repos.d/mfso-enterprise.repo << EOF
[mfso-enterprise]
name=MF+SO Enterprise Repository
baseurl=https://enterprise.mfso.app/rpm/stable/\$releasever/\$basearch
enabled=1
gpgcheck=1
gpgkey=https://enterprise.mfso.app/keys/mfso-enterprise.gpg
EOF

# Import GPG key
sudo rpm --import https://enterprise.mfso.app/keys/mfso-enterprise.gpg

# Update package list
sudo dnf update
```

#### Install

```bash
# Install
sudo dnf install mfso-enterprise

# Verify
rpm -q mfso-enterprise
```

### Post-Installation (Linux)

#### Desktop Integration

```bash
# Update desktop database
sudo update-desktop-database

# Register MIME types
sudo update-mime-database /usr/share/mime
```

#### Automatic Updates

Configure unattended upgrades:

```bash
# For APT systems
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Server Deployment

### Kubernetes Deployment

#### Prerequisites
- Kubernetes 1.28+
- Helm 3+
- StorageClass configured
- Ingress controller
- Cert-manager (optional)

#### Install via Helm

```bash
# Add MF+SO Helm repository
helm repo add mfso-enterprise https://enterprise.mfso.app/helm
helm repo update

# Create configuration values file (values.yaml)
cat > values.yaml << EOF
global:
  serverUrl: "https://mfso.company.com"
  adminEmail: "admin@company.com"

database:
  type: postgresql
  host: postgres-db.internal
  port: 5432
  database: mfso
  username: mfso
  existingSecret: mfso-db-password

redis:
  host: redis.internal
  port: 6379
  existingSecret: mfso-redis-password

ingress:
  enabled: true
  hostname: mfso.company.com
  tls:
    enabled: true
    clusterIssuer: letsencrypt-prod

enterprise:
  licenseKey: "YOUR-ENTERPRISE-LICENSE-KEY"
  adminConsole:
    enabled: true
    adminUsers:
      - "admin@company.com"
EOF

# Install
helm install mfso-enterprise mfso-enterprise/mfso -f values.yaml --namespace mfso --create-namespace
```

### Docker Compose Deployment

For smaller deployments:

```bash
# Download docker-compose.yml
curl -O https://enterprise.mfso.app/deploy/docker-compose.yml

# Create .env file
cat > .env << EOF
MFSO_SERVER_URL=https://mfso.company.com
MFSO_DB_PASSWORD=secure_password
MFSO_REDIS_PASSWORD=secure_password
MFSO_LICENSE_KEY=YOUR-LICENSE-KEY
EOF

# Start services
docker-compose up -d

# Verify
docker-compose ps
```

## Post-Installation Verification

### Client Verification

```powershell
# Windows - Check installation
Get-ItemProperty "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*" | Where-Object {$_.DisplayName -like "*MF+SO*"}

# macOS - Check installation
ls /Applications/MF+SO.app
mdfind "kMDItemFSName == 'MF+SO.app'"

# Linux - Check installation
dpkg -l | grep mfso-enterprise
rpm -q mfso-enterprise
```

### Connectivity Test

```bash
# Test server connectivity
curl -I https://mfso.company.com/health

# Expected response: HTTP/1.1 200 OK
```

### Service Verification

```bash
# Check all services are running
docker-compose ps
# or
kubectl get pods -n mfso

# Check service health
curl https://mfso.company.com/health/ready
# Expected: {"status": "healthy"}
```

## Troubleshooting Installation

### Common Installation Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Installation fails | Insufficient permissions | Run installer as administrator/root |
| GPO not applying | MSI path not accessible | Check network share permissions |
| Configuration not applying | ADMX not copied correctly | Verify ADMX file location |
| Cannot connect to server | Firewall blocking | Check firewall rules |
| Certificate error | Enterprise CA not trusted | Install enterprise root certificate |
| MDM deployment fails | Package not signed | Verify package signature |

### Windows Specific

```powershell
# Check installation logs
Get-Content "$env:TEMP\MSI*.log"

# Force group policy update
gpupdate /force

# Check applied policies
gpresult /h gpreport.html
```

### macOS Specific

```bash
# Check installation logs
log show --predicate 'subsystem contains "com.mfso"' --last 1h

# Verify profile
sudo profiles -C -v
```

### Linux Specific

```bash
# Check installation logs
journalctl -u mfso-enterprise -n 100

# Verify repository
apt-cache policy mfso-enterprise

# Check configuration
cat /etc/mfso/mfso-config.json
```

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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