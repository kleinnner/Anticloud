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

# Kasteran* — ECS FAQ
© Lois-Kleinner & 0-1.gg 2026

## What is the ECS pattern?

ECS stands for Entity-Component-System, an architectural pattern popular in game development and data-oriented design. It separates data (components) from behavior (systems) and identity (entities).

## Does Kasteran* support ECS?

Yes, Kasteran* has a built-in ECS framework as part of the standard library. It is designed for high-performance data-oriented programming.

## How do I create an entity?

```
let entity = world.spawn()
entity.add_component(Position { x: 0.0, y: 0.0 })
entity.add_component(Velocity { x: 1.0, y: 0.0 })
```

## How do I query entities?

```
for (position, velocity) in world.query_mut::<(Position, Velocity)>() {
    position.x += velocity.x * dt
    position.y += velocity.y * dt
}
```

## How does ECS performance compare?

Kasteran* ECS is highly optimized:

- **Cache-friendly**: Components are stored in contiguous arrays
- **Archetype-based**: Entities with same component sets are grouped
- **Parallel queries**: Systems can run in parallel
- **Zero overhead**: No virtual dispatch or boxing

Performance is comparable to or better than dedicated ECS libraries in C++.

## Can I use ECS for non-game applications?

Yes, ECS is useful for any data-oriented application:
- Physics simulations
- Data processing pipelines
- Network packet processing
- Any application with many entities sharing behavior

## Conclusion

Kasteran* ECS provides high-performance, cache-friendly entity-component-system support for games, simulations, and data-oriented applications.
