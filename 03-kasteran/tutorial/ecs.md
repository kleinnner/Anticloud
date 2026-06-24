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
