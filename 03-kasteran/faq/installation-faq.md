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
