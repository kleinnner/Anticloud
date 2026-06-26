---
title: "Quick Start Cheat Sheet"
sidebar_position: 5
description: "docker run -p 8080:8080 api-oss:latest"
tags: [cheat-sheets]
---

# Quick Start Cheat Sheet

## Deploy in 5 Minutes

```bash
# 1. Start API-OSS
docker run -p 8080:8080 api-oss:latest

# 2. Check health
curl http://localhost:8080/v1/health

# 3. Create a route
curl -X POST http://localhost:9090/v2/admin/routes \
  -H "Authorization: Bearer ak-admin" \
  -d '{"path":"/v1/chat","upstream":"https://api.openai.com"}'

# 4. Create API key
curl -X POST http://localhost:9090/v2/admin/keys \
  -H "Authorization: Bearer ak-admin" \
  -d '{"name":"my-key","role":"user"}'

# 5. Make API call
curl http://localhost:8080/v1/chat \
  -H "Authorization: Bearer ak-..." \
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"Hello"}]}'
```

## Next Steps

```text
- Add rate limiting: config file
- Set up monitoring: /metrics endpoint
- Configure plugins: plugins section in config
- Enable auth: RBAC, SSO
- Deploy on K8s: Helm chart
```

## Next

- [Cheat Sheets Index](05-cheat-sheets-index.md)

## See Also

Related cheat sheets and reference documentation.

- [Cheat Sheets](../cheat-sheets/01-cheat-sheets-overview.md)
- [CLI Reference](../cli/01-getting-started.md)
- [Config Reference](../reference/03-configuration-schema.md)
- [Error Codes](../reference/04-error-codes.md)

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
