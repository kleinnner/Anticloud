<!-- SEO -->
<meta name="description" content="Anticloud ecosystem — all platforms, profiles, research repositories, and community connections across the web.">
<meta name="keywords" content="anticloud ecosystem, github, linkedin, dev.to, hugging face, zenodo, dataverse">
<meta property="og:title" content="Anticloud Ecosystem & Platforms">
<meta property="og:description" content="All platforms, profiles, research repositories, and community connections across the web.">
<meta property="og:image" content="https://kleinnner.github.io/Anticloud/img/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Anticloud Ecosystem & Platforms">
<meta name="twitter:description" content="All platforms, profiles, research repositories, and community connections.">
<link rel="canonical" href="https://github.com/kleinnner/Anticloud/wiki/Ecosystem">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Anticloud Ecosystem & Platforms",
  "description": "All platforms, profiles, research repositories, and community connections across the web.",
  "isPartOf": { "@id": "https://github.com/kleinnner/Anticloud/wiki" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://github.com/kleinnner/Anticloud/wiki/Home" },
      { "@type": "ListItem", "position": 2, "name": "Ecosystem", "item": "https://github.com/kleinnner/Anticloud/wiki/Ecosystem" }
    ]
  }
}
</script>

<!-- Breadcrumb: Home > Ecosystem -->

![Ecosystem](https://img.shields.io/badge/Section-Ecosystem-ff9f0a?style=for-the-badge)
![Platforms](https://img.shields.io/badge/Platforms-12-0071e3?style=for-the-badge)
![Categories](https://img.shields.io/badge/Categories-5-34c759?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Ecosystem & Platforms

The Anticloud presence extends across multiple platforms for code, research, publishing, and community.

## Platform Map

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    CENTER((Anticloud))
    CENTER --> GIT[GitHub<br/>kleinnner/Anticloud]
    CENTER --> MAIN[Main Site<br/>0-1.gg]
    CENTER --> LINK[LinkedIn<br/>/in/kleinner]
    CENTER --> DEV[DEV.to<br/>@kleinner]
    CENTER --> HF[Hugging Face<br/>Anticloud]
    CENTER --> WP[WordPress<br/>anticlouds.wordpress.com]
    CENTER --> FM[Fandom Wiki<br/>anticloud.fandom.com]
    CENTER --> TU[Tumblr<br/>anticloud.tumblr.com]
    CENTER --> BS[Bluesky<br/>@kleinner]
    CENTER --> MA[Mastodon<br/>@kleinner]
    CENTER --> TG[Telegraph<br/>@kleinner]
    CENTER --> ZN[Zenodo<br/>anticloud]
    CENTER --> HD[Harvard Dataverse<br/>anticloud]
```

## Platform Categories

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart TB
    subgraph Code[Code & Development]
        GH[GitHub] --> HF[Hugging Face]
    end
    subgraph Content[Content & Publishing]
        WP[WordPress] --> DEV[DEV.to]
        DEV --> TG[Telegraph]
        TG --> TU[Tumblr]
    end
    subgraph Social[Social & Community]
        LI[LinkedIn] --> BS[Bluesky]
        BS --> MA[Mastodon]
    end
    subgraph Research[Research & Data]
        ZN[Zenodo] --> HD[Harvard Dataverse]
    end
    subgraph Wiki[Wiki & Docs]
        GW[GitHub Wiki] --> DP[Docusaurus Portal]
        DP --> FM[Fandom Wiki]
    end
    GH --> DP
    GH --> GW
    Content --> LI
```

## Main Profiles

| Platform | Link | Purpose |
|----------|------|---------|
| GitHub | [kleinnner/Anticloud](https://github.com/kleinnner/Anticloud) | Source code & issues |
| Main Site | [0-1.gg](https://0-1.gg) | Personal portal |
| LinkedIn | [/in/kleinner](https://linkedin.com/in/kleinner) | Professional network |
| DEV.to | [@kleinner](https://dev.to/kleinner) | Technical articles |
| Hugging Face | [Anticloud](https://huggingface.co/Anticloud) | AI models & datasets |

## Wikis & Documentation

| Platform | Link | Description |
|----------|------|-------------|
| **GitHub Wiki** | [Anticloud Wiki](https://github.com/kleinnner/Anticloud/wiki) | Technical wiki |
| Fandom Wiki | [anticloud.fandom.com](https://anticloud.fandom.com) | Community knowledge base |
| Docusaurus Portal | [kleinnner.github.io/Anticloud](https://kleinnner.github.io/Anticloud/) | Main documentation site |

## Publishing & Social

| Platform | Link | Content |
|----------|------|---------|
| WordPress Blog | [anticlouds.wordpress.com](https://anticlouds.wordpress.com) | Blog posts & updates |
| Tumblr | [anticloud.tumblr.com](https://anticloud.tumblr.com) | Microblogging |
| Telegraph | [@kleinner](https://telegra.ph/kleinner) | Long-form articles |
| Bluesky | [@kleinner](https://bsky.app/profile/kleinner.bsky.social) | Social updates |
| Mastodon | [@kleinner](https://mastodon.social/@kleinner) | Decentralized social |

## Research Repositories

| Platform | Link | Holdings |
|----------|------|----------|
| Zenodo | [anticloud](https://zenodo.org/search?q=anticloud) | Research papers & datasets |
| Harvard Dataverse | [anticloud](https://dataverse.harvard.edu/dataverse/anticloud) | Academic datasets |

---

> 📖 **Full docs**: [Docusaurus Links](https://kleinnner.github.io/Anticloud/docs/links) · [Home](Home) · [Architecture](Architecture) · [Projects](Projects) · [Tools](Tools) · [Roadmap](Roadmap) · [FAQ](FAQ) · [Glossary](Glossary)
