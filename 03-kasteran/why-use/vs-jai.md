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

# Why Choose Kasteran* Over Jai
© Lois-Kleinner & 0-1.gg 2026

## The Case for Kasteran* Over Jai

Jai is the game development language designed by Jonathan Blow, sharing Kasteran*'s vision of a performance-oriented language with hot-reload, comptime, and SOA layout. The languages are philosophically aligned but radically different in development model and accessibility.

## Public Development vs Closed Development

Jai's development is closed. Jonathan Blow works on it alone, sharing progress through occasional live streams. There is no public repository, no issue tracker, no RFC process, no release date. The language exists primarily as a set of ideas and a compiler that only Jonathan Blow has used.

Kasteran* is developed in public. The GitHub repository is open for contributions. The RFC process invites community input on language design. Release milestones are public and tracked.

**Kasteran* Advantage:** You can use Kasteran* today. Jai may never have a public release.

## Open Source vs Single Developer

Jai is a single-developer project. If Jonathan Blow loses interest, gets stuck, or faces personal challenges, Jai's future is uncertain. No community can carry the project forward.

Kasteran* is open source with multiple contributors and a foundation governance model. The language belongs to its community. Development continues regardless of individual circumstances.

**Kasteran* Advantage:** Long-term viability through community ownership.

## Cross-Platform vs Windows-First

Jai development targets Windows (MSVC toolchain, Windows SDK). Cross-platform support is not a priority.

Kasteran* targets Windows, Linux, and macOS from day one. The C backend ensures platform compatibility wherever a C compiler exists.

**Kasteran* Advantage:** Use Kasteran* on any platform. Jai locks you into Windows.

## Broader Scope

Jai is laser-focused on game engine development. It makes no claims about AI/ML, general systems programming, or WASM deployment.

Kasteran* targets game development plus AI/ML plus systems programming. GPU compute, tensor types, and WASM backend extend the language beyond games.

**Kasteran* Advantage:** One language for game engines, AI inference, and infrastructure. Jai is a single-domain language.

## Kasteran* Is the Right Choice When:

- You need a language that exists today and has a public release
- Open source and community governance are important
- You develop on Linux or macOS (not just Windows)
- Your use case spans games plus AI/ML or systems programming
- Long-term language viability is a concern

## Jai Is Still the Right Choice When:

- Jonathan Blow's design decisions perfectly align with your needs
- You're willing to wait for an uncertain release
- Windows-only development is acceptable
- You want to follow Jai's development and potentially contribute if it opens

## The Verdict

Jai and Kasteran* share a vision: a modern language for performance-critical development with hot-reload, comptime, and data-oriented design. Jai has the advantage of Jonathan Blow's singular design vision and deep game industry credibility. Kasteran* has the advantages of being open source, cross-platform, publicly available, and community-governed. For most developers and studios, Kasteran* is the practical choice — it exists, it's open, and it runs on your platform.
