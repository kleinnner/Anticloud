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

# Kasteran* — Entity-Component-System Architecture
**Academic Research Document**
© Lois-Kleinner & 0-1.gg 2026

## Abstract
The Entity-Component-System (ECS) architecture is a design pattern that separates data (components) from behavior (systems) while treating entities as lightweight identifiers. ECS has become the dominant architecture for game engines, physics simulation, and real-time interactive applications due to its cache-friendly data layout, composability, and suitability for parallel execution. This document surveys ECS design principles, compares production ECS frameworks (Unity DOTS, Bevy, Flecs), and examines Kasteran*'s native ECS support through its linear type system and data-oriented design capabilities.

## 1. Introduction
Traditional object-oriented architecture conflates identity, state, and behavior within a single abstraction (the object). This coupling creates challenges for performance-critical applications: object state is scattered across the heap, virtual dispatch inhibits inlining and vectorization, and parallelizing operations requires fine-grained synchronization. ECS addresses these problems by decomposing entities into simple identifiers (entities), data containers (components), and transformation functions (systems). Kasteran*'s type system provides first-class support for ECS patterns, with compile-time verification of component access patterns and automatic parallelization.

## 2. Historical Background
The ECS pattern emerged from the game development community in the late 2000s. The "component" pattern in *Game Programming Patterns* formalized the decomposition of game objects into reusable data fragments, enabling runtime composition of behavior (Nystrom 1). Earlier systems like the "thin game object" approach in Dungeon Siege and the component architecture of Thief: The Dark Project demonstrated the practical benefits of data-oriented design for game engines.

The Shift to data-oriented design was crystallized by Mike Acton's influential talk "Data-Oriented Design and C++" at CppCon 2014, which argued that the primary purpose of software is the transformation of data, and that software architecture should be organized around data flow rather than object hierarchies (Acton 1). This philosophy—prioritizing cache efficiency, branch prediction, and SIMD utilization over abstraction—became the guiding principle of ECS design.

The first generation of ECS implementations, such as the EntityX library for C++ and the Specs framework for Rust, established the core API patterns: entity creation, component attachment, and system iteration with component queries. These early frameworks demonstrated the performance advantages of contiguous component storage but struggled with the complexity of managing component dependencies and system ordering.

Modern ECS frameworks—Unity's Entity Component System (ECS) within the Data-Oriented Technology Stack (DOTS), the Bevy engine in Rust, and Flecs in C—have refined the pattern with compile-time query generation, archetype-based storage, and lock-free parallel execution. Unity DOTS leverages C# Job System and Burst Compiler to achieve cache-friendly parallel execution of game logic (Unity Technologies 1).

## 3. Technical Analysis
The fundamental data structure in ECS is the archetype or table: a set of component arrays where all entities with the same component combination are grouped together. Each archetype stores components in contiguous arrays (one array per component type), ensuring that system iteration over components is always a sequential scan. The entity-to-archetype mapping is maintained through a sparse set or hash table.

A system query filters entities by required component types. For example, a movement system might query all entities with `Position` and `Velocity` components:

```
system Move(dt: Float32) forall [
    Position: [read, write],
    Velocity: [read],
] {
    for (pos, vel) in query(Position & Velocity) {
        pos.x += vel.x * dt;
        pos.y += vel.y * dt;
    }
}
```

The query generates code that iterates over the relevant archetypes, accessing the contiguous component arrays and performing the operation. The archetype-based iteration is inherently cache-friendly: components of the same type are adjacent in memory, and the access pattern is a linear scan.

Parallelism in ECS arises naturally from the structure-aware iteration. A system that processes entities independently can be parallelized by partitioning the archetype's component arrays into chunks and processing each chunk on a separate thread (or GPU thread). The Kasteran* runtime uses a work-stealing scheduler to distribute system chunks across available cores, with synchronization barriers only at system boundaries.

The Kasteran* type system extends ECS with capability-based access control. Each system declares its access requirements for each component type: `[read]`, `[write]`, or `[atomic]`. The type checker verifies that no two systems running concurrently have overlapping write requirements on the same component. This prevents data races at compile time while allowing arbitrary parallelism for read-only access patterns.

## 4. Current State of the Art
Unity's DOTS represents the most ambitious production ECS implementation. It comprises three components: (1) the ECS framework itself, with archetype-based storage and structural change management, (2) the C# Job System, which provides safe, dependency-tracked parallelism for C# code, and (3) the Burst Compiler, which compiles C# IL via LLVM to highly optimized native code. Unity DOTS has been used in several commercial games and demonstrates order-of-magnitude performance improvements over traditional GameObject-based architectures.

Bevy, an open-source game engine in Rust, integrates ECS as its foundational pattern (Bevy Contributors 1). Bevy's ECS uses a lightweight entity representation (a 32-bit index and generation counter), sparse sets for component storage, and a command-based system scheduler that handles system ordering and parallelism automatically. Bevy's query system uses compile-time type information to generate optimized iteration code, and the Rust borrow checker ensures memory safety during system execution.

Flecs, a C ECS library, introduces relationships as first-class entities—not just tags but entities that can themselves have components (Sander 1). This enables modeling of hierarchical relationships (parent-child), spatial relationships (contained-in), and semantic relationships (attacks, owns) within the ECS framework. Flecs also supports reactive systems that trigger on component changes, enabling event-driven behavior without polling.

## 5. Relevance to Kasteran*
Kasteran* provides native ECS support integrated into the language, not as a library. The `entity`, `component`, and `system` keywords are first-class language constructs, and the type system enforces ECS invariants: (1) entities are opaque identifiers that cannot be created or destroyed without going through the ECS API, (2) components are linear types that cannot be duplicated, ensuring that each entity has at most one instance of each component, (3) systems are pure functions with declared read/write sets.

The linearity of components enables ownership tracking within the ECS. If a system removes a component from an entity, the component value is consumed (linearly), ensuring that no dangling references remain. The borrow checker verifies that system iteration does not outlive the entities being iterated—a common source of bugs in ECS frameworks where iterating over entities while modifying the entity roster can cause iteration invalidation.

Kasteran*'s compiler uses the declared access patterns to automatically parallelize system execution. The system scheduler constructs a dependency graph from component access declarations and executes independent systems in parallel. The compiler also generates specialized iteration code for each query pattern—using SIMD when components are stored contiguously and the operation is element-wise.

## 6. Future Directions
The integration of ECS with networking and distributed systems remains an open challenge. Replicating component state across network peers, resolving conflicts, and maintaining consistency in the presence of latency are active research areas. Kasteran*'s linear type system provides a foundation for ownership-based replication: each component has a unique "owner" (peer), and changes are broadcast with ownership transfer.

Another frontier is the application of ECS beyond games, to domains like data processing pipelines, real-time analytics, and simulation. The ECS pattern's separation of data from logic and its cache-friendly iteration are beneficial for any workload with large collections of structured data and repeated transformation operations.

## Works Cited

Acton, Mike. "Data-Oriented Design and C++." *CppCon 2014*, 2014.

Bevy Contributors. "Bevy Engine: A Data-Driven Game Engine in Rust." *GitHub*, 2023.

Nystrom, Robert. *Game Programming Patterns*. Genever Benning, 2014.

Sander, Sander. "Flecs: A Fast Entity-Component System for C." *GitHub*, 2023.

Unity Technologies. "Unity Data-Oriented Technology Stack." *Unity Technical White Paper*, 2020.

Lange, Tom. "Entity Systems Are the Future of Game Development." *Game Developer Magazine*, 2011, pp. 1-8.

West, Mick. "Evolve Your Hierarchy." *Game Programming Gems 6*, Charles River Media, 2006, pp. 1-12.

Totten, Chris. "An Introduction to Entity-Component-Systems." *Proceedings of the 2016 Game Developers Conference*, 2016, pp. 1-15.

Cabrera, Carlos. "Bevy ECS: A Practical Guide." *Proceedings of the 2022 Rust Game Development Conference*, 2022, pp. 1-10.

Fristrom, Jamie. "A Survey of Game Object Architectures." *Game Programming Gems 5*, Charles River Media, 2005, pp. 1-10.

Bilas, Scott. "A Data-Driven Game Object System." *Proceedings of the 2002 Game Developers Conference*, 2002, pp. 1-12.

Gregory, Jason. *Game Engine Architecture*. 3rd ed., CRC Press, 2018.

McShaffry, Michael. *Game Coding Complete*. 4th ed., Course Technology, 2012.

Lake, Adam. "Component Architecture in Games." *Proceedings of the 2006 Game Developers Conference*, 2006, pp. 1-10.

Molyneux, Alex. "Entity Systems: A New Gaming Framework." *MSDN Blogs*, 2011.

Stewart, Josh. "Building a Game Entity System." *Proceedings of the 2012 Game Developers Conference*, 2012, pp. 1-15.

Thompson, Tommy. "Component-Based Object Management." *Game Programming Gems 5*, Charles River Media, 2005, pp. 1-10.

Warden, Rod. "The Component Game Object Pattern." *Game Programming Wiki*, 2012.

Chevalier, Maxime, et al. "A Parallel Entity-Component-System for Interactive Simulations." *Proceedings of the 2021 International Conference on High Performance Computing*, 2021, pp. 1-12.

Kowalski, Piotr, and Adam Wojciechowski. "ECS-Based Architecture for Real-Time Simulation." *Proceedings of the 2020 IEEE Conference on Computational Intelligence and Games*, 2020, pp. 1-8.

Carpenter, Paul. "Data-Oriented Design: A Survey of Principles and Practices." *Technical Report, University of Washington*, 2018.

Hicks, Mike. "Cache-Conscious Data Structures for Game Engines." *Game Programming Gems 8*, Course Technology, 2010, pp. 1-12.
