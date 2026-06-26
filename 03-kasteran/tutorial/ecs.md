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

# Kasteran* — Building a Game ECS

© Lois-Kleinner & 0-1.gg 2026

## Components

Define components with `$$`:

```
$$ Position = (x: f32, y: f32)
$$ Velocity = (dx: f32, dy: f32)
$$ Sprite   = (path: string, z_order: i32)
$$ Health   = (current: i32, max: i32)
```

## Spawning Entities

Use `@+` to spawn:

```
@+ Player(
    Position(x: 0.0, y: 0.0),
    Velocity(dx: 0.0, dy: 0.0),
    Sprite(path: "player.png", z_order: 10),
    Health(current: 100, max: 100)
)
```

## Querying Entities

Use `@>` to query:

```
@> Position, Velocity {
    |+ update(pos: Position, vel: Velocity, dt: f32) {
        pos.x = pos.x + vel.dx * dt
        pos.y = pos.y + vel.dy * dt
    }
}
```

## Systems

Use `@~` for systems:

```
@~ Movement : Position, Velocity {
    |+ run(pos: Position, vel: Velocity, dt: f32) {
        pos.x = pos.x + vel.dx * dt
        pos.y = pos.y + vel.dy * dt
    }
}
```

## Complete Game Loop

```
$$ Position = (x: f32, y: f32)
$$ Velocity = (dx: f32, dy: f32)

@+ Player(Position(0.0, 0.0), Velocity(1.0, 0.0))

@~ Movement : Position, Velocity {
    |+ run(pos: Position, vel: Velocity, dt: f32) {
        pos.x = pos.x + vel.dx * dt
        pos.y = pos.y + vel.dy * dt
    }
}

|+ main() -> i32 {
    dt :~ 0.016
    loop {
        @~ Movement { |s| s.run(dt) }
    }
    => 0
}
```
</```

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776170
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/03-kasteran
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
4. Lois-Kleinner Internet Arc: https://archive.org/details/kasteran
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
