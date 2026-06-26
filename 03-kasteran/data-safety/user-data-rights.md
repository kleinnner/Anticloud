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

# Kasteran* — User Data Rights
© Lois-Kleinner & 0-1.gg 2026

## Overview

User data rights are legal and ethical protections that give individuals control over their personal information. Kasteran* provides comprehensive support for the five core data rights: access, correction, deletion, portability, and objection. These rights are implemented as first-class features of the data management system.

## Right to Access

Individuals have the right to know what personal data is collected and how it is used.

### Data Discovery
```
let user_data = DataSubject::find(user_id)
user_data.categories() -> [DataCategory]
user_data.sources() -> [DataSource]
user_data.purposes() -> [ProcessingPurpose]
user_data.third_parties() -> [ThirdParty]
```

### Access Request Processing
```
let request = AccessRequest::new(user_id)
request.verify_identity(mfa_token)
request.process()
// Returns complete data inventory for the user
```

### Response Format
```
access_response:
  user_id: "user_123"
  categories:
    - name: "Profile"
      fields: ["name", "email", "address"]
      source: "registration"
      purpose: "account_management"
      retention: "account_active + 2 years"
    - name: "Activity"
      fields: ["login_history", "purchase_history"]
      source: "system_logs"
      purpose: "service_improvement"
      retention: "3 years"
```

## Right to Correction

Individuals can request correction of inaccurate personal data.

### Correction Request
```
let request = CorrectionRequest::new(user_id)
request.add_correction("address", "123 Main St")
request.add_correction("phone", "+1-555-0100")
request.submit()
```

### Correction Workflow
1. **Submission**: User submits correction request
2. **Verification**: Identity is verified
3. **Validation**: Requested correction is validated
4. **Execution**: Data is updated in all systems
5. **Confirmation**: User receives confirmation
6. **Logging**: Correction is recorded in audit log

### Correction Audit
```
correction_record:
  timestamp: 2026-06-19T10:30:00Z
  user_id: user_123
  field: "address"
  old_value: "456 Oak Ave"
  new_value: "123 Main St"
  verified_by: "id_document_upload"
  reason: "user_report"
```

## Right to Deletion

Individuals can request deletion of their personal data.

### Deletion Request
```
let request = DeletionRequest::new(user_id)
request.scope("all")  // or specific categories
request.submit()

// Request is subject to legal exceptions
```

### Deletion Process
1. **Verification**: Identity confirmed
2. **Assessment**: Check for legal retention requirements
3. **Execution**: Data deleted from primary, backup, and cache
4. **Verification**: Deletion confirmed
5. **Notification**: User notified of completion
6. **Documentation**: Deletion recorded for audit

### Exceptions
Data may be retained when:
- Required by law (tax, financial regulations)
- Necessary for legal claims
- Required for public health
- Necessary for freedom of expression

## Right to Portability

Individuals can receive their data in a structured, commonly used format.

### Portability Request
```
let request = PortabilityRequest::new(user_id)
request.format("json")
request.scope(["profile", "activity"])
request.submit()
```

### Portability Features
- Multiple export formats (JSON, CSV, Parquet)
- Machine-readable output
- Complete data or selected categories
- Direct transfer to another service
- Download or API delivery

## Right to Object

Individuals can object to processing of their personal data.

### Objection Request
```
let request = ObjectionRequest::new(user_id)
request.object_to("direct_marketing")
request.object_to("profiling")
request.object_to("legitimate_interest_processing")
request.submit()
```

### Objection Handling
1. **Verification**: Identity confirmed
2. **Assessment**: Valid objection grounds
3. **Processing stop**: Relevant processing is stopped
4. **Confirmation**: User notified of action
5. **Exception handling**: If overriding, justification documented

## Automated Decision-Making Rights

Individuals have rights regarding automated decisions:

- **Explanation**: Request explanation of automated decisions
- **Human review**: Request human review of automated decisions
- **Challenge**: Challenge automated decisions

```
let explanation = AutomatedDecision::explain(decision_id)
// Returns: input features, model version, confidence, decision factors
```

## Rights Management Dashboard

Kasteran* provides a unified dashboard for managing data rights:

```
rights_dashboard:
  access_requests: 15 (12 completed, 3 pending)
  correction_requests: 3 (3 completed)
  deletion_requests: 8 (5 completed, 3 pending legal review)
  portability_requests: 5 (5 completed)
  objection_requests: 2 (2 processed)
```

## Conclusion

Kasteran* provides comprehensive support for all user data rights: access, correction, deletion, portability, and objection. These rights are enforced through automated workflows that ensure consistent, auditable processing of user requests.

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com