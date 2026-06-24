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

# User Management

## Table of Contents

1. [Introduction](#introduction)
2. [User Lifecycle Overview](#user-lifecycle-overview)
3. [User Provisioning](#user-provisioning)
4. [MFA Enrollment](#mfa-enrollment)
5. [Group and Role Management](#group-and-role-management)
6. [User Deactivation and Deprovisioning](#user-deactivation-and-deprovisioning)
7. [Audit and Reporting](#audit-and-reporting)
8. [Self-Service Portals](#self-service-portals)

## Introduction

Enterprise user management in MF+SO provides centralized control over the complete user lifecycle. From provisioning to deprovisioning, administrators can manage users, enforce MFA enrollment, and maintain compliance with organizational policies.

## User Lifecycle Overview

### Lifecycle Stages

```
Provisioning → Onboarding → Active Use → Transition → Deprovisioning
     │            │             │            │              │
     ▼            ▼             ▼            ▼              ▼
  Create user  Enroll MFA    MFA usage   Role changes   Deactivate
  Assign groups Configure    Password mgmt  Transfer      Archive
  Set policies  First login  Vault access  Reassign      Delete
```

### Provisioning Methods

| Method | Speed | Automation | Best For |
|--------|-------|------------|----------|
| Directory sync | Medium | High | Large organizations with AD/LDAP |
| SCIM | Fast | High | Cloud directory integration |
| Bulk import | Fast | Medium | Initial migration |
| Manual creation | Slow | Low | Small teams, exceptions |
| Self-registration | Fast | High | External users, contractors |
| JIT provisioning | Instant | High | SSO integration |

## User Provisioning

### Directory Sync (AD/LDAP)

#### Configuration

1. Admin Console → Directory → Add Directory
2. Select directory type: Active Directory / OpenLDAP / Other
3. Configure connection:

| Field | Description | Example |
|-------|-------------|---------|
| Server URL | Directory server address | ldaps://dc01.company.com:636 |
| Bind DN | Service account | CN=mfso-svc,OU=Service Accounts,DC=company,DC=com |
| Base DN | Search base | DC=company,DC=com |
| User object class | User object type | user / inetOrgPerson |
| User filter | Filter for user sync | (&(objectClass=user)(enabled=TRUE)) |
| Group object class | Group object type | group / groupOfNames |

4. Configure attribute mapping:

| MF+SO Field | AD/LDAP Attribute | Required |
|-------------|-------------------|----------|
| Username | sAMAccountName | Yes |
| Email | mail | Yes |
| First name | givenName | No |
| Last name | sn | No |
| Phone | telephoneNumber | No |
| Department | department | No |
| Title | title | No |

5. Set sync schedule:
   - **Continuous**: Sync every 15 minutes
   - **Hourly**: Sync every hour
   - **Daily**: Sync once daily (configurable time)
   - **Manual**: Trigger sync manually

#### Sync Behavior

| AD/LDAP Action | MF+SO Action |
|----------------|--------------|
| User created | User created (if auto-provision enabled) |
| User updated | User attributes updated |
| User disabled | User deactivated |
| User deleted | User deactivated (configurable: deactivate or delete) |
| Group member added | User added to group |
| Group member removed | User removed from group |

### SCIM Provisioning

#### Service Provider Configuration

```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig"],
  "patch": {"supported": true},
  "bulk": {"supported": true, "maxOperations": 100, "maxPayloadSize": 1048576},
  "filter": {"supported": true, "maxResults": 200},
  "changePassword": {"supported": false},
  "authenticationSchemes": [
    {
      "name": "Bearer Token",
      "description": "Bearer token authentication",
      "type": "httpbasic"
    }
  ]
}
```

#### Supported SCIM Operations

| Operation | Endpoint | Description |
|-----------|----------|-------------|
| Create User | POST /Users | Create a new user |
| Get User | GET /Users/{id} | Retrieve user details |
| Update User | PUT /Users/{id} | Full user update |
| Patch User | PATCH /Users/{id} | Partial user update |
| Delete User | DELETE /Users/{id} | Deactivate user |
| List Users | GET /Users | List users with filtering |
| Create Group | POST /Groups | Create a new group |
| Update Group | PATCH /Groups/{id} | Update group membership |

### Bulk Import

1. Admin Console → Users → Import
2. Download the CSV template
3. Fill in user data:

```csv
username,email,first_name,last_name,department,groups,mfa_policy
jdoe,jdoe@company.com,John,Doe,Engineering,"Engineering,Staff","required"
asmith,asmith@company.com,Ane,Smith,Marketing,Marketing,optional
```

4. Upload the completed CSV
5. Review import preview
6. Confirm import

## MFA Enrollment

### Enrollment Process

#### Automatic Enrollment

1. Admin configures MFA policy (required/optional)
2. User receives email notification:
   ```
   Subject: Action Required: Set up Multi-Factor Authentication
   
   Hello [Name],
   
   Your organization requires multi-factor authentication for access
   to company resources. Please set up MFA within [grace period] days.
   
   Setup link: https://[server]/mfa-enroll
   
   Setup deadline: [date]
   
   If you have questions, contact IT Support.
   ```
3. User clicks setup link
4. User installs MF+SO app (if not installed)
5. User scans enrollment QR code or enters setup code
6. User verifies by entering TOTP code
7. MFA enrollment complete

#### Forced Enrollment

For high-security environments:
1. Admin initiates forced enrollment
2. User cannot access MF+SO resources until MFA is configured
3. Enrollment screen appears on first login
4. User must complete enrollment to proceed

#### Enrollment Status

| Status | Description |
|--------|-------------|
| Not enrolled | User has not configured MFA |
| Enrolled | User has MFA configured |
| Expired | MFA configuration has expired (requires re-enrollment) |
| Bypassed | User is temporarily exempt from MFA |

### Managing MFA Devices

| Action | Description |
|--------|-------------|
| View devices | See all registered MFA devices for a user |
| Remove device | Remove a compromised or lost device |
| Reset MFA | Force user to re-enroll all MFA devices |
| Generate recovery codes | Create new backup codes for user |
| Bypass MFA | Temporarily bypass MFA (with audit trail) |

### Enrollment Compliance

| Metric | Description |
|--------|-------------|
| Enrollment rate | Percentage of users with MFA configured |
| Enrollment by group | Enrollment rate per group/department |
| Pending enrollments | Users who haven't enrolled within grace period |
| Compliance score | Overall MFA compliance percentage |

## Group and Role Management

### User Groups

Groups are used to organize users and apply policies:

| Group Type | Description | Example |
|------------|-------------|---------|
| AD/LDAP group | Synced from directory | Engineering |
| SCIM group | Provisioned via SCIM | Contractors |
| Manual group | Created in admin console | Executive Team |
| Dynamic group | Rule-based membership | All-VIP-Users |

### Dynamic Groups

Create groups based on rules:

```json
{
  "name": "High Security Users",
  "description": "Users requiring elevated security",
  "rules": {
    "operator": "OR",
    "conditions": [
      {"field": "department", "operator": "IN", "value": ["Security", "IT", "Legal", "Finance", "HR"]},
      {"field": "title", "operator": "CONTAINS", "value": "Admin"},
      {"field": "custom_field", "operator": "EQUALS", "field": "clearance", "value": "top_secret"}
    ]
  }
}
```

### Role-Based Access Control

| Role | Vault Access | Admin Console | User Management | Policy Management | Audit |
|------|-------------|---------------|----------------|-------------------|-------|
| User | Own vault only | No | No | No | Own activity |
| Auditor | No | Read-only | Read-only | Read-only | Full |
| Help Desk | No | Limited | Reset MFA, unlock | No | Assigned actions |
| User Manager | No | Yes | Assigned groups | No | Managed users |
| Security Admin | No | Yes | Yes | Yes | Full |
| Super Admin | No | Yes | Yes | Yes | Full |

## User Deactivation and Deprovisioning

### Deactivation Process

#### Automated Deprovisioning

1. User removed from AD/LDAP or SCIM source
2. MF+SO detects change on next sync
3. User account is deactivated:
   - All sessions terminated
   - API tokens revoked
   - Device trust removed
   - Vault access disabled
4. Audit log entry created

#### Manual Deprovisioning

1. Admin Console → Users → Search user
2. User Profile → Deactivate
3. Select deactivation options:
   - **Terminate sessions**: End all active sessions
   - **Revoke tokens**: Invalidate all API tokens
   - **Remove devices**: De-authorize all devices
   - **Archive vault**: Preserve vault for compliance
   - **Transfer vault**: Assign vault to another user
4. Confirm deactivation

### Deprovisioning Timeline

| Phase | Action | Timing |
|-------|--------|--------|
| Immediate | Sessions terminated, tokens revoked | Instant |
| 30 days | User in grace period (can be reactivated) | 30 days |
| 90 days | Vault permanently archived | 90 days post-deactivation |
| 7 years | Audit data retained | Per compliance requirements |
| Permanent | User data deleted | After retention period |

### Vault Transfer

Transfer a deactivated user's vault to another user:

1. Admin Console → Users → Select user → Transfer Vault
2. Select recipient user
3. Confirm transfer
4. Recipient receives notification
5. Vault appears in recipient's vault as a separate collection

### Data Retention After Deprovisioning

| Data Type | Retention Period | Deletion Method |
|-----------|-----------------|-----------------|
| User metadata | 30 days after deactivation | Hard delete |
| Encrypted vault | 90 days | Cryptographic erasure |
| Audit logs | 7 years | Immutable (anonymized) |
| .aioss ledger | Permanent | Anonymized (user reference removed) |

## Audit and Reporting

### User Activity Reports

| Report | Description |
|--------|-------------|
| User creation report | New users created in date range |
| Login activity | User authentication events |
| MFA enrollment | MFA enrollment status changes |
| Policy changes | Policy modifications affecting users |
| Deprovisioning | User deactivation events |
| Vault access | Vault access attempts (successful and failed) |

### Compliance Reports

| Report | Description | Frequency |
|--------|-------------|-----------|
| MFA compliance | Percentage of users with MFA enrolled | On demand |
| MFA compliance by department | Per-department enrollment rates | On demand |
| Inactive users | Users who haven't logged in for N days | Weekly |
| Policy exceptions | Users with policy exceptions | Monthly |
| Audit trail export | Complete audit log for auditors | On demand |

## Self-Service Portals

### User Self-Service

Users can manage without admin intervention:
- **MFA enrollment**: Self-enroll in MFA
- **Device management**: View and remove authorized devices
- **Recovery codes**: Generate new recovery codes
- **Password reset**: Self-service password reset (if enabled)
- **Profile update**: Update personal information

### Manager Self-Service

Managers can manage their direct reports:
- **View team compliance**: See MFA status for team members
- **Request exceptions**: Request temporary policy exceptions
- **Initiate transfer**: Request vault transfer for departing team members
- **View activity**: See recent activity for team members

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
