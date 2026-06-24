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

# PII Identification and Protection Mechanisms

## Overview

Personally Identifiable Information (PII) is any data that can be used to identify a specific individual. While ANTIKODE does not collect or process PII by design, developers may use ANTIKODE to work on codebases that contain PII. This document describes how ANTIKODE handles PII and what protections are in place.

## PII Categories

Under GDPR, HIPAA, and other regulatory frameworks, PII includes but is not limited to:

- Names, addresses, phone numbers
- Email addresses and usernames
- Government identifiers (SSN, passport numbers, driver's license)
- Financial account information
- Health information (PHI)
- IP addresses and device identifiers
- Biometric data
- Employment information

## ANTIKODE's PII Posture

### No PII Collection

ANTIKODE does not collect, store, or transmit any PII. The system has no mechanism for user registration, account creation, or identity management. The only user-identifiable information potentially relevant to ANTIKODE's operation is:

1. **Filesystem path**: The user's home directory path may contain a username. ANTIKODE accesses this only to read configuration and model files. This data is not logged, transmitted, or stored in the .aioss ledger.
2. **Process ownership**: The host OS assigns process ownership to a user account. ANTIKODE inherits this identity for filesystem access. No user identity data is stored.

### Contextual PII

When a developer provides code context that contains PII (e.g., a configuration file with database credentials, source code with hardcoded test user data), ANTIKODE processes this data temporarily for inference. Key protections:

1. **Temporary Processing**: The PII exists only in memory during inference. It is not stored beyond the inference lifecycle.
2. **No Persistence**: Only cryptographic hashes of the context are stored in the .aioss ledger. Hash functions are one-way; PII cannot be reconstructed from hashes.
3. **No Transmission**: All processing is local. PII never leaves the developer's machine.

## PII Protection Mechanisms

### Local-Only Architecture

The primary PII protection mechanism is ANTIKODE's local-only architecture. Because no data is transmitted, PII cannot be intercepted during transmission or accessed by external parties.

### Hash-Based Auditing

The .aioss ledger uses SHA-256 hashes for audit records. Hashes are one-way functions: given a hash value h = H(data), it is computationally infeasible to recover the original data. This provides strong PII protection while maintaining audit capabilities.

### Configurable Context Window

Developers can configure the maximum context window size to limit how much code is provided to the model. Smaller context windows reduce the risk of including PII in inference requests.

### No Data Retention

ANTIKODE retains no data beyond the .aioss ledger hashes and user-configurable model cache. The model cache contains only pre-trained model weights, not user data.

## Recommended PII Protection Practices

1. **Audit context before inference**: Review code context before invoking ANTIKODE to ensure PII is not included unnecessarily.
2. **Use .gitignore**: Add `.ANTIKODE/` to `.gitignore` to prevent accidental commit of ledger data.
3. **Configure short retention**: Set short retention periods for the .aioss ledger if PII is frequently present in code.
4. **Regular ledger verification**: Periodically verify that the .aioss ledger contains only hashes, not full content.
5. **Use PII scanning**: Integrate ANTIKODE with PII scanning tools to detect PII in code before AI processing.

## Incident Response

In the event that PII is identified in ANTIKODE's data:

1. **Stop inference**: Disable the AI engine.
2. **Delete the ledger**: Remove the `.ANTIKODE/ledger/` directory.
3. **Rotate models**: If PII was included in context, the model's in-memory processing is ephemeral. No model modification is needed.
4. **Document**: Record the incident for compliance purposes.

Because ANTIKODE does not transmit data, there is no data breach notification requirement beyond internal procedures.

## Regulatory Compliance

ANTIKODE's PII protections satisfy the following regulatory requirements:

- **GDPR Article 25**: Data protection by design and by default
- **HIPAA Privacy Rule (45 CFR §164.506)**: Minimum necessary standard
- **CCPA §1798.100**: Right to know what personal information is collected
- **NIST SP 800-53**: Privacy controls (AP, AR, DM, IP, SE, TR families)

## Works Cited

NIST. *Guide to Protecting the Confidentiality of Personally Identifiable Information (PII)*. NIST Special Publication 800-122, 2010.

European Parliament. "Regulation (EU) 2016/679 of the European Parliament and of the Council (General Data Protection Regulation)." *Official Journal of the European Union*, vol. L119, 2016, pp. 1-88.
