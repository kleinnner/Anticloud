---
title: "FAQ for Finance"
sidebar_position: 14
description: "Q: Is API-OSS PCI DSS compliant?"
tags: [faq]
---

# FAQ for Finance

## Compliance

```text
Q: Is API-OSS PCI DSS compliant?
A: You can deploy PCI DSS-compliant with API-OSS on your infra.

Q: What encryption standards?
A: AES-256-GCM at rest, TLS 1.3 in transit.

Q: Do you support audit trails for regulators?
A: Immutable hash-chain audit logs with export.
```

## Performance

```text
Q: What throughput can we expect?
A: 100K req/s per node, horizontally scalable.

Q: What about latency?
A: <5ms gateway overhead. P99 under 10ms.

Q: Do you support high-frequency trading use cases?
A: Low-latency mode available with direct connection.
```

## Security

```text
Q: Do you support mTLS?
A: Yes, mutual TLS for upstream connections.

Q: Can we integrate with our SIEM?
A: Yes, CEF-format logs, Splunk, Elastic, Datadog.

Q: What about secrets management?
A: Vault, AWS Secrets Manager, Azure Key Vault.
```

## Next

- [FAQ for Government](15-faq-for-government.md)

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)
