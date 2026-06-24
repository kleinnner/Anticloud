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

# SSO Integration

This guide covers SAML 2.0, OIDC, and LDAP configuration for enterprise single sign-on.

## Supported Providers

| Provider | SAML 2.0 | OIDC | LDAP |
|----------|----------|------|------|
| Okta | Yes | Yes | Yes |
| Azure AD | Yes | Yes | No |
| Keycloak | Yes | Yes | Yes |
| OneLogin | Yes | No | No |
| Ping Identity | Yes | Yes | Yes |
| Google Workspace | No | Yes | No |
| OpenLDAP | No | No | Yes |
| FreeIPA | No | No | Yes |

## SAML 2.0 Configuration

### Step 1: Configure Kazkade (SP)

`ash
kazcade-ctl sso configure saml \
  --issuer "https://kazcade.company.com" \
  --acs-url "https://kazcade.company.com/api/v1/auth/saml/callback" \
  --entity-id "kazcade-enterprise" \
  --cert-file /etc/ssl/kazcade-saml.crt \
  --key-file /etc/ssl/kazcade-saml.key
`

### Step 2: Service Provider Metadata

`ash
kazcade-ctl sso metadata saml --output sp-metadata.xml
`

`xml
<?xml version="1.0"?>
<EntityDescriptor entityID="kazcade-enterprise"
    xmlns="urn:oasis:names:tc:SAML:2.0:metadata">
  <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <KeyDescriptor use="signing">
      <KeyInfo><X509Data><X509Certificate>MIID...</X509Certificate></X509Data></KeyInfo>
    </KeyDescriptor>
    <AssertionConsumerService
        Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
        Location="https://kazcade.company.com/api/v1/auth/saml/callback"
        index="0"/>
  </SPSSODescriptor>
</EntityDescriptor>
`

### Step 3: IdP Configuration (Okta Example)

`
┌──────────────────────────────────────────────┐
│  Okta Admin Console                         │
│                                              │
│  Applications > Add Application > SAML 2.0  │
│                                              │
│  Single sign-on URL:                         │
│  https://kazcade.company.com/api/v1/auth/   │
│  saml/callback                              │
│                                              │
│  Audience URI (SP Entity ID):                │
│  kazcade-enterprise                          │
│                                              │
│  Attribute statements:                       │
│  email: user.email                          │
│  name:  user.firstName + " " + user.lastName│
│  role:   kazcade_role                       │
│                                              │
│  [Save] [Download Metadata]                  │
└──────────────────────────────────────────────┘
`

### Step 4: Upload IdP Metadata

`ash
kazcade-ctl sso configure idp \
  --metadata okta-metadata.xml \
  --provider okta

# Test connection
kazcade-ctl sso test saml --provider okta --user alice@company.com
`

## OIDC Configuration

### Azure AD Example

`ash
kazcade-ctl sso configure oidc \
  --provider azure-ad \
  --client-id "00000000-0000-0000-0000-000000000000" \
  --client-secret "secret..." \
  --issuer "https://login.microsoftonline.com/{tenant-id}/v2.0" \
  --authorization-endpoint "https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/authorize" \
  --token-endpoint "https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token" \
  --jwks-uri "https://login.microsoftonline.com/{tenant-id}/discovery/v2.0/keys" \
  --redirect-uri "https://kazcade.company.com/api/v1/auth/oidc/callback" \
  --scopes "openid,email,profile"
`

### Keycloak Example

`ash
kazcade-ctl sso configure oidc \
  --provider keycloak \
  --client-id "kazcade" \
  --client-secret "client-secret" \
  --issuer "https://keycloak.company.com/realms/enterprise" \
  --redirect-uri "https://kazcade.company.com/api/v1/auth/oidc/callback"
`

### Verify OIDC

`ash
# Generate test login URL
kazcade-ctl sso test oidc --provider keycloak

# Open URL, authenticate, verify token exchange
kazcade-ctl sso test oidc --verify-token eyJhbG...
`

## LDAP Configuration

### OpenLDAP Example

`	oml
# ~/.kazcade/sso/ldap.toml
[ldap]
url = "ldaps://ldap.company.com:636"
bind_dn = "cn=admin,dc=company,dc=com"
bind_password = "secure-password"
base_dn = "dc=company,dc=com"
user_filter = "(objectClass=inetOrgPerson)"
group_filter = "(objectClass=groupOfNames)"

[ldap.mapping]
uid = "uid"
email = "mail"
display_name = "displayName"
first_name = "givenName"
last_name = "sn"
groups = "memberOf"

[ldap.groups]
admin = "cn=kazcade-admin,ou=groups,dc=company,dc=com"
analyst = "cn=kazcade-analyst,ou=groups,dc=company,dc=com"
viewer = "cn=kazcade-viewer,ou=groups,dc=company,dc=com"

[ldap.tls]
ca_cert = "/etc/ssl/certs/ca-certificates.crt"
verify_hostname = true
`

### Setup LDAP

`ash
kazcade-ctl sso configure ldap --config ldap.toml

# Test LDAP connection
kazcade-ctl sso test ldap --bind

# Test user lookup
kazcade-ctl sso test ldap --user alice

# Output:
# ✓ LDAP bind successful
# ✓ User 'alice' found
#   Email: alice@company.com
#   Groups: kazcade-analyst, kazcade-viewer
#   → Role: analyst
`

## Multi-Provider Configuration

`	oml
# ~/.kazcade/sso/config.toml
[[providers]]
name = "okta"
type = "saml"
priority = 1
default = true

[[providers]]
name = "azure-ad"
type = "oidc"
priority = 2

[[providers]]
name = "openldap"
type = "ldap"
priority = 3

[defaults]
auto_create_users = true
default_role = "viewer"
session_timeout_minutes = 480
`

## User Provisioning

### JIT (Just-In-Time)

Users are automatically created on first SSO login:

`yaml
# ~/.kazcade/sso/provisioning.yml
jit:
  enabled: true
  default_role: viewer
  team_mapping:
    - ldap_group: "cn=kazcade-analyst,ou=groups,dc=company,dc=com"
      team: analytics
      role: analyst
    - ldap_group: "cn=kazcade-admin,ou=groups,dc=company,dc=com"
      team: admin
      role: admin
`

### SCIM (Coming Soon)

`ash
# SCIM endpoint (for IdP-driven provisioning)
kazcade-ctl sso scim-endpoint
# https://kazcade.company.com/api/v1/scim/v2
`

## Session Management

`ash
# Configure session
kazcade-ctl sso session \
  --timeout 480 \
  --extend-on-activity \
  --max-sessions 5 \
  --terminate-on-logout

# List active sessions
kazcade-ctl sso sessions --user alice@company.com

# Terminate session
kazcade-ctl sso session terminate --session-id abc123

# Force re-authentication
kazcade-ctl sso session force-reauth --user alice@company.com
`

## Troubleshooting

`ash
# Enable SSO debug logging
kazcade-ctl config set sso.log_level debug

# Check SSO status
kazcade-ctl sso status

# Provider health
kazcade-ctl sso health --provider okta

# Decode JWT token
kazcade-ctl sso decode-token eyJhbG...

# Clear SSO cache
kazcade-ctl sso cache clear
`

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
