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

# Enterprise Troubleshooting Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Deployment Issues](#deployment-issues)
3. [Sync Problems](#sync-problems)
4. [Integration Failures](#integration-failures)
5. [Performance Issues](#performance-issues)
6. [Certificate and Encryption Issues](#certificate-and-encryption-issues)
7. [Database Issues](#database-issues)
8. [Network Issues](#network-issues)

## Introduction

This troubleshooting guide covers common issues encountered in MF+SO Enterprise deployments. Each section includes symptoms, causes, diagnostic steps, and solutions.

## Deployment Issues

### Installation Failures

#### Windows GPO Deployment

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| MSI fails to install | Insufficient permissions | Check MSI log: `%TEMP%\MSI*.log` | Run as administrator |
| GPO not applying | MSI path inaccessible | `gpresult /h report.html` | Verify network share permissions |
| Configuration not applying | ADMX not installed | Check registry: `HKLM\Software\Policies\MF+SO` | Copy ADMX to SYSVOL correctly |
| Application crashes on launch | Missing dependencies | Check Event Viewer: `Windows Logs → Application` | Install VC++ Redistributable |

#### macOS MDM Deployment

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| PKG fails silently | Code signing validation | `pkgutil --check-signature package.pkg` | Ensure PKG is properly signed |
| Profile not installing | MDM configuration issue | `sudo profiles -C -v` | Check MDM server logs |
| App shows Not Verified | Gatekeeper | `spctl --assess --verbose /Applications/MF+SO.app` | Run: `sudo spctl --master-disable` |

#### Linux Deployment

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| apt update fails | GPG key missing | `apt-get update 2>&1 \| grep MFSO` | Re-import GPG key |
| rpm install fails | Dependency missing | `dnf deplist mfso-enterprise` | Install dependencies |
| Service won't start | Port conflict | `netstat -tlnp \| grep LISTEN` | Change port or stop conflicting service |

## Sync Problems

### Device Sync Issues

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| Changes not syncing | Network connectivity | Sync status: Settings → Sync → Status | Check internet connection |
| Sync conflicts | Simultaneous edits | Conflict log: Settings → Sync → Conflicts | Review and resolve conflicts |
| Sync stuck at XX% | Large vault | Check sync progress: `api/sync/status` | Wait or force sync restart |
| Device not appearing | Authorization expired | Device list: Admin Console → Users → Devices | Re-authorize device |

### Server Sync Issues

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| Sync service down | Service crash | `docker-compose ps` or `kubectl get pods` | Restart sync service |
| Sync queue backing up | High load | Check queue depth: `rabbitmqctl list_queues` | Scale sync workers |
| Database sync lag | Replication delay | `kubectl exec -n mfso deploy/db -- pg_stat_replication` | Check replica health |

## Integration Failures

### LDAP/Active Directory Integration

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| Users not syncing | Connection failure | Check connector status: Admin → Directory → Status | Verify LDAP server is reachable |
| Sync errors in log | Bind credentials expired | Check service account password | Update bind credentials |
| Attributes not mapping | Schema mismatch | Test attribute query: `ldapsearch -x -H ldap://server -b "DC=..."` | Update attribute mapping |
| Users duplicated | Sync race condition | Check sync logs for duplicates | Delete duplicates, adjust sync interval |

### SAML/SSO Issues

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| SSO login fails | Certificate expired | Check IdP certificate expiration | Renew certificate at IdP |
| Assertion error | Attribute mismatch | Check SAML assertion in browser dev tools | Update attribute mapping |
| ACS URL mismatch | Configuration error | Verify ACS URL matches IdP configuration | Update SSO settings |
| User not found | JIT provisioning disabled | Check IdP attribute for user identifier | Enable JIT or create user manually |

### SCIM Integration

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| User not created | SCIM endpoint error | Check SCIM logs: Admin → SCIM → Logs | Verify SCIM endpoint URL |
| Duplicate users | SCIM race condition | Check SCIM sync history | Clear duplicates, reduce sync frequency |
| Deprovisioning not working | Deletion disabled | Check SCIM deprovision settings | Enable deprovision |

## Performance Issues

### Slow Authentication

| Symptom | Possible Cause | Diagnosis | Solution |
|---------|---------------|-----------|----------|
| Login takes > 3 seconds | Database query slow | Check slow query log: `pg_stat_statements` | Optimize queries, add indexes |
| TOTP generation slow | Time drift | Check system time: `timedatectl` | Sync NTP |
| All operations slow | Resource exhaustion | Check metrics: CPU, memory, disk IO | Scale resources |

### High Latency

| Symptom | Possible Cause | Diagnosis | Solution |
|---------|---------------|-----------|----------|
| Vault access slow | Storage latency | Check storage metrics: `iostat -x 1` | Upgrade storage tier |
| API response slow | Database contention | `pg_locks` | Kill blocking queries |
| Sync latency high | Network bandwidth | `iperf3` between components | Increase bandwidth |

## Certificate and Encryption Issues

### TLS Certificate Problems

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| "Certificate expired" | Certificate past expiration | `openssl x509 -in cert.pem -text -noout` | Renew certificate |
| "Certificate not trusted" | Unknown CA | Check trust store | Install CA certificate |
| "Hostname mismatch" | Wrong certificate | `openssl s_client -connect host:443` | Get certificate for correct hostname |
| "TLS handshake failed" | Protocol mismatch | Check TLS version support | Enable TLS 1.2+ |

### Encryption Key Issues

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| Can't decrypt vault | Key mismatch | Check key version: Admin → Encryption → Status | Restore from backup |
| HSM communication error | HSM offline | Check HSM status: `pkcs11-tool --module` | Restart HSM service |
| Key rotation failed | Permissions issue | Check key rotation logs | Verify HSM user permissions |

## Database Issues

### Connection Problems

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| "Too many connections" | Connection pool exhausted | `SELECT count(*) FROM pg_stat_activity` | Increase max_connections |
| "Connection refused" | Database down | `pg_isready` | Start PostgreSQL service |
| "Connection timeout" | Network issue | `telnet db-host 5432` | Check firewall rules |

### Performance Problems

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| Slow queries | Missing indexes | `pg_stat_statements` | Add missing indexes |
| High CPU on DB | Expensive queries | `SELECT * FROM pg_stat_activity WHERE state = 'active'` | Optimize queries |
| Growing table size | No vacuum | `SELECT relname, n_dead_tup FROM pg_stat_user_tables` | Run VACUUM |

## Network Issues

### Connectivity Problems

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| Can't reach server | DNS failure | `nslookup mfso.company.com` | Fix DNS record |
| Connection drops | Firewall timeout | `tcpdump -i eth0 port 443` | Adjust firewall idle timeout |
| High packet loss | Network congestion | `mtr mfso.company.com` | Optimize network path |
| VPN connectivity | VPN configuration | Check VPN client logs | Update VPN configuration |

### Firewall Issues

| Symptom | Cause | Diagnosis | Solution |
|---------|-------|-----------|----------|
| Can't connect from client | Firewall blocking | `Test-NetConnection mfso.company.com -Port 443` (PowerShell) | Open port 443 |
| Cluster communication fails | Internal firewall | `nc -zv internal-host 9090` | Allow inter-service communication |
| LDAP sync fails | LDAP port blocked | `Test-NetConnection ldap.company.com -Port 636` | Open LDAPS port |

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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
