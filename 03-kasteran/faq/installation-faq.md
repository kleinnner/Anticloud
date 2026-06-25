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

# Kasteran* — Installation FAQ
© Lois-Kleinner & 0-1.gg 2026

## How do I install Kasteran*?

### Quick Install (Windows)
```
winget install kasteran
```

### Quick Install (macOS/Linux)
```
curl -sSL https://kasteran.dev/install.sh | sh
```

### Using Cargo
```
cargo install kasteran
```

### Using npm
```
npm install -g kasteran
```

### Build from Source
```
git clone https://github.com/kasteran/kasteran.git
cd kasteran
cargo build --release
./target/release/kasteran --version
```

## What are the system requirements?

### Compiler
- **RAM**: 2 GB minimum, 8 GB recommended
- **CPU**: 1 GHz dual-core minimum
- **Storage**: 500 MB for compiler + stdlib
- **OS**: Windows 10+, macOS 12+, Linux kernel 5.0+

### Runtime
- **RAM**: 32 MB minimum (varies by application)
- **Storage**: 100 KB minimum binary size
- **CPU**: Any x86-64 or ARM64 processor

## Windows Installation

### Using winget
```
winget install kasteran
```

### Using installer
Download the Windows installer from kasteran.dev/download.

### Using Cargo
Ensure Rust is installed, then:
```
cargo install kasteran
```

## macOS Installation

### Using Homebrew
```
brew install kasteran
```

### Using the install script
```
curl -sSL https://kasteran.dev/install.sh | sh
```

## Linux Installation

### Using package manager
```
# Debian/Ubuntu
apt install kasteran

# Fedora
dnf install kasteran

# Arch Linux
pacman -S kasteran
```

### Using the install script
```
curl -sSL https://kasteran.dev/install.sh | sh
```

## Docker Installation

```
docker pull kasteran/kasteran:latest
docker run kasteran/kasteran kasteran --version
```

## Verifying Installation

```
kasteran --version
kasteran --help
kasteran new hello_world
cd hello_world
kasteran build
./hello_world
```

## Updating

```
kasteran self-update
# Or via package manager
brew upgrade kasteran
```

## Uninstalling

```
# Windows
winget uninstall kasteran

# macOS/Linux (if installed via script)
kasteran self-uninstall
```

## Conclusion

Kasteran* can be installed via multiple package managers, install scripts, or by building from source. Choose the method that works best for your platform.

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
