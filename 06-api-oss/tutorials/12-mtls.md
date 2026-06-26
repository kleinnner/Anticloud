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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com