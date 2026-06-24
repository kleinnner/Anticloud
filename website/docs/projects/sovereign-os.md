---
sidebar_label: sovereign-os
---

# sovereign-os

Arch Linux-based Sovereign OS with .aioss ledger daemon, custom toolchain, TPM attestation, measured boot, 20 GNOME shell extensions

## Boot Chain

```mermaid
flowchart TD
    P[Power On] -->|UEFI| TB[TPM Measured Boot]
    TB -->|PCR Values| AT[Attestation]
    TB -->|Secure| BL[Boot Loader]
    BL -->|Verified| KN[Linux Kernel]
    KN -->|Init| SD[systemd]
    SD -->|Start| AL[.aioss Ledger Daemon]
    SD -->|Load| CT[Custom Toolchain]
    SD -->|Start| GS[GNOME Shell<br/>+ 20 Extensions]
    AL -->|Log Events| AF[.aioss Ledger]
    AT -->|Remote Verify| VS[Verification Server]
```

## Documentation

View the full documentation for this project on GitHub:
- [Project README](https://github.com/kleinnner/Anticloud/blob/main/05-sovereign-os/README.md)
- [Project Directory](https://github.com/kleinnner/Anticloud/tree/main/05-sovereign-os)
