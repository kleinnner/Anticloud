---
title: "Tutorial 12: mTLS Configuration"
sidebar_position: 12
description: "Configure mutual TLS between clients and API-OSS, and between API-OSS and upstream services."
tags: [tutorials]
---

# Tutorial 12: mTLS Configuration

## Objective

Configure mutual TLS between clients and API-OSS, and between API-OSS and upstream services.

## Prerequisites

- API-OSS running
- OpenSSL installed
- Domain name (or localhost for testing)

## Step 1: Create a Certificate Authority

```bash
# Generate CA key
openssl genrsa -out ca-key.pem 4096

# Generate CA certificate
openssl req -new -x509 -days 3650 \
  -key ca-key.pem \
  -out ca-cert.pem \
  -subj "/CN=API-OSS Test CA"
```

## Step 2: Create Server Certificate

```bash
# Generate server key and CSR
openssl req -new -newkey rsa:4096 -nodes \
  -keyout server-key.pem \
  -out server.csr \
  -subj "/CN=localhost"

# Sign with CA
openssl x509 -req -days 365 \
  -in server.csr \
  -CA ca-cert.pem \
  -CAkey ca-key.pem \
  -CAcreateserial \
  -out server-cert.pem
```

## Step 3: Create Client Certificate

```bash
# Generate client key and CSR
openssl req -new -newkey rsa:4096 -nodes \
  -keyout client-key.pem \
  -out client.csr \
  -subj "/CN=apioss-client"

# Sign with CA
openssl x509 -req -days 365 \
  -in client.csr \
  -CA ca-cert.pem \
  -CAkey ca-key.pem \
  -CAcreateserial \
  -out client-cert.pem
```

## Step 4: Configure API-OSS with mTLS

```bash
# Copy certs to API-OSS
docker cp server-cert.pem apioss:/etc/apioss/certs/
docker cp server-key.pem apioss:/etc/apioss/certs/
docker cp ca-cert.pem apioss:/etc/apioss/certs/

# Enable mTLS (requires restart for this demo)
docker exec apioss apioss admin config set tls.enabled=true
docker exec apioss apioss admin config set tls.cert_path=/etc/certs/tls.crt
docker exec apioss apioss admin config set tls.key_path=/etc/certs/tls.key
docker exec apioss apioss admin config set tls.enabled_port=8443
docker exec apioss apioss admin config set tls.mtls.enabled=true
docker exec apioss apioss admin config set tls.mtls.ca_path=/etc/certs/ca.crt
docker exec apioss apioss admin config set tls.mtls.verify_fail_if_no_peer_cert=true
```

## Step 5: Test mTLS

```bash
# Without client cert — should fail
curl -k https://localhost:8443/health
# curl: (35) error:1401E410:SSL routines:...:sslv3 alert handshake failure

# With client cert — should succeed
curl -k https://localhost:8443/health \
  --cert client-cert.pem \
  --key client-key.pem
# {"status":"healthy"}
```

## Step 6: Configure Upstream mTLS

```bash
# Configure mTLS to upstream services
apioss admin config set upstream.ssl_verify=true
apioss admin config set upstream.ssl_ca_path=/etc/apioss/certs/ca-cert.pem
apioss admin config set upstream.ssl_cert_path=/etc/apioss/certs/client-cert.pem
apioss admin config set upstream.ssl_key_path=/etc/apioss/certs/client-key.pem
```

## What You Learned

- Creating a CA
- Generating server/client certificates
- Configuring mTLS on the gateway
- Testing mTLS with curl
- Configuring upstream mTLS

## Next Tutorial

→ [13: P2P Federation](13-p2p-federation.md)

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)
