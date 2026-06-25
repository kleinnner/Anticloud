---
title: "Form Builder"
sidebar_position: 99
description: "Dynamic form generation from JSON Schema definitions for structured data collection directly"
tags: [features]
---

# Form Builder

## What It Does
Dynamic form generation from JSON Schema definitions for structured data collection directly
into the knowledge graph. No code required to create, deploy, and collect data through
forms. Form submissions become typed graph nodes with full metadata, ledger attestation for
immutability, and native queryability through the graph engine. Supports file uploads with
SHA-256 content hashing, geolocation fields, and digital signature capture (SVG path data).

## How It Works
The Form Builder is implemented in `forms.rs` under `ai-oss-gateway/src/`. The form
definition uses JSON Schema (draft 2020-12) as the canonical format — any JSON Schema
editor or generator can create form definitions. Supported field types: text, number, date,
select (enum), multi-select, file upload (with SHA-256 content hashing for deduplication
and integrity verification), geolocation (latitude/longitude), and signature (captured as
SVG path data representing the signing gesture). The frontend `FormBuilderView` — served on
the HTTP UI at port 8081 — provides a visual JSON Schema editor with live preview and
drag-and-drop field addition. Form definitions are stored as graph nodes with label `Form`
and properties containing the schema, metadata (title, description, version), and
configuration (submit permissions, notification settings, webhook URL). When a user submits
a form, the backend validates the submission against the JSON Schema using the `jsonschema`
Rust crate. Valid submissions become typed graph nodes (label `FormSubmission`) with edges
to the form definition node and to the submitting user's Passaporte node. File uploads are
stored in the configured data directory with content hashes recorded in the submission node
for deduplication. Each submission creates a ledger entry with the submission hash attested
by the user's Passaporte signature, providing an immutable audit trail. Form submissions can
trigger workflows configured via the Workflow Builder — for example, a maintenance request
form submission triggers an approval workflow that notifies the responsible manager via the
Telegram bridge. The entire form system works fully offline with no cloud dependency.

The JSON Schema validation in `forms.rs` uses the `jsonschema` Rust crate to validate
submissions against the form's schema. The validation checks: required fields are present
(`required` array in schema), field types match (`string`, `number`, `integer`, `array`,
`object`), string lengths respect `minLength`/`maxLength`, numeric values respect
`minimum`/`maximum`/`exclusiveMinimum`/`exclusiveMaximum`, enum values are valid
(`enum` array), and file uploads have valid MIME types (`contentMediaType`) and maximum
sizes (`contentSchema.maximum` applied as bytes). The form definitions are stored as graph
nodes with label `Form` and properties including: `schema` (the full JSON Schema),
`title`, `description`, `version` (auto-incrementing integer), `submit_permissions`
(array of Passaporte role IDs), `webhook_url` (optional URL for external submission
notifications), and `notification_config` (bridge targets for submission alerts). The
frontend `FormBuilderView` is a React component served on the HTTP UI at port 8081. It
uses the `@monaco-editor/react` code editor for the raw JSON Schema edit panel with
completions and validation, and a custom drag-and-drop palette built with React DnD for
visual field addition. When the user deploys a form, the frontend sends an `form_create`
WebSocket message with the form definition, which `forms.rs` validates (schema is valid
JSON Schema draft 2020-12), creates the `Form` graph node, and returns the form's unique
URL (`/form/<uuid>`) for distribution. Form submission URLs follow the pattern
`http://localhost:8081/form/<uuid>` for local access or
`https://<tunnel-host>/form/<uuid>` for remote access via the built-in tunnel.

## How to Operate
1. Start the gateway: `api-oss start`. HTTP UI on port 8081, WebSocket on port 3030.
2. Open the Form Builder view at `http://localhost:8081/forms`.
3. Create a new form: click "New Form", give it a name and description.
4. Add fields: drag field types from the palette onto the form preview. Configure each
   field's properties (label, required, validation rules, placeholder text).
5. For advanced forms, edit the JSON Schema directly in the schema editor panel.
6. Set submission permissions: choose which Passaporte roles can submit (public,
   authenticated, specific roles).
7. Click "Deploy" — the form is saved as a graph node and is immediately available.
8. Share the form URL: accessible at `http://localhost:8081/form/<form-id>` or via QR code
   with `api-oss share qr --form <form-id>`.
9. View submissions: select a form and click "Submissions" in the UI.
10. Export submissions: use `api-oss graph query --type FormSubmission` or WS message.
11. Configure notifications: set `form.submission_notification` in `opencode.json`.

## The Moat
- Competitors treat form builders as standalone features disconnected from the knowledge
  graph — Google Forms, Typeform, Microsoft Forms are data silos with no graph integration.
- API-OSS form submissions become graph nodes with full metadata, ledger entries for
  immutability, and native queryability — you can query "show all maintenance requests from
  Building A submitted last month" as a single graph query.
- Tight integration between data collection, graph storage, ledger attestation, and workflow
  automation is architecturally unique among form builders.
- All forms and submissions work fully offline with no cloud dependency.

## Why Choose API-OSS
A defense agency conducting field inspections needs a form system that works entirely
offline, cryptographically attests each submission, and integrates directly into their
intelligence graph. API-OSS provides all of this — no cloud dependency, no per-form
licensing, no data silos. An enterprise can replace Google Forms, Typeform, and
SurveyMonkey with a single self-hosted form system that feeds data directly into their
AI-enabled knowledge graph. A consumer builds personal data collection forms that sync
between devices via P2P sync with CRDT conflict resolution.

## Competitive Comparison
- **Palantir**: Form capabilities exist in Foundry but are cloud-dependent and proprietary.
- **Google**: Google Forms is cloud-only, no graph integration, no offline mode.
- **Microsoft**: Power Apps / Forms is cloud-only, requires licensing ($10–$20/user/month).
- **Typeform**: Cloud-only SaaS, no self-hosted option, $35/month for basic plan.
- **JotForm**: Cloud-only, no self-hosted option, data stored in JotForm's cloud.

## Cost-Benefit Analysis
Typeform costs $35–$70/month. SurveyMonkey costs $25–$99/month. Google Forms is free but
data is locked in Google's ecosystem. API-OSS Form Builder costs $0. A one-time $2,000
workstation replaces $300–$1,200/year in form tool subscriptions. Time saved by automatic
graph integration (versus manual data entry from form exports): hours per week. The
compliance benefit of ledger-attested submissions (immutable audit trail) replaces manual
verification processes worth thousands of dollars per audit cycle.

## Applications
- **Consumer**: Personal data collection — inventories, journals, checklists, expense
  tracking. All data stored locally, no cloud dependency.
- **Government / Defense**: Field data collection with cryptographic attestation. Intelligence
  reports, inspection forms, incident reports — submitted offline and synced when
  connectivity returns via P2P sync with CRDT resolution.
- **Enterprise**: Customer feedback, employee surveys, compliance forms, maintenance requests
  — feeding directly into the knowledge graph for queryability and workflow automation.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
