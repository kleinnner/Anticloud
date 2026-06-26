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

# Kasteran* — Dataflow Architectures and Parallel Execution
**Academic Research Document**
© Lois-Kleinner & 0-1.gg 2026

## Abstract
Dataflow architectures represent a fundamental departure from the von Neumann model of computation, organizing execution around the flow of data rather than a sequential instruction stream. This document surveys dataflow computing—from Jack Dennis's pioneering static dataflow graphs to modern systolic arrays, Intel's TBB (Threading Building Blocks), and data-driven execution in heterogeneous systems. We examine Kasteran*'s compiler's ability to detect dataflow parallelism and generate dataflow-oriented scheduling for multicore and GPU targets.

## 1. Introduction
The von Neumann bottleneck—the sequential nature of instruction fetch and execution—limits the performance of conventional processors. Dataflow architectures address this limitation by allowing instructions to execute as soon as their operands are available, exploiting parallelism at the finest granularity. Kasteran*'s compiler analyzes programs to identify dataflow structures—where data dependencies are explicit and control dependencies are secondary—and generates parallel schedules that exploit these structures on multicore CPUs, GPUs, and potential dataflow accelerators.

## 2. Historical Background
The concept of dataflow computing was formalized by Jack Dennis at MIT in the 1970s. Dennis's static dataflow model represented programs as directed graphs where nodes are operations and edges are data dependencies (Dennis 1). Each node fires (executes) when all its input edges have tokens, producing tokens on its output edges. The static dataflow model used a single token per edge, requiring acknowledgment signals for pipelining.

Arvind and Gostelow at MIT developed the dynamic dataflow model, where multiple tokens can coexist on an edge, distinguished by tags or contexts (Arvind and Gostelow 1). The "tagged-token" model enables loop parallelism: each loop iteration creates tagged tokens that flow through the graph independently. The Monsoon machine, developed at MIT and Motorola, was a notable hardware implementation of tagged-token dataflow (Papadopoulos and Culler 1).

Systolic arrays, introduced by H. T. Kung at Carnegie Mellon, represent a specialized dataflow architecture for regular, compute-intensive operations (Kung 1). In a systolic array, data flows rhythmically (like blood in the cardiovascular system) through a network of processing elements, each performing a simple operation. Systolic arrays achieved significant success in signal processing and matrix computations, culminating in the iWarp processor by Intel and Carnegie Mellon.

The Von Neumann bottleneck motivated research into data-driven execution in conventional processors. The "dataflow in a von Neumann envelope" approach added dataflow-like execution to conventional processors through out-of-order execution, register renaming, and scoreboarding (Tomasulo 1). Modern superscalar processors implement a form of dataflow execution within a sliding window of instructions, though the overhead of hardware scheduling limits the window size.

## 3. Technical Analysis
Dataflow graphs provide a natural intermediate representation for parallel programming. In Kasteran*'s compiler, the HIR can be lowered to a dataflow representation where each operation is a node, each value is an edge, and dependencies are explicit. The dataflow graph representation enables several analysis and optimization passes:

Dependence analysis: The compiler computes the data dependencies between operations, distinguishing true dependencies (read-after-write) from anti-dependencies (write-after-read) and output dependencies (write-after-write). Anti-dependencies and output dependencies can be eliminated through renaming and register promotion.

Parallelism extraction: The dataflow graph directly exposes instruction-level parallelism: any set of nodes whose inputs are all available can execute concurrently. The compiler performs list scheduling, where ready nodes (all inputs available) are dynamically scheduled to available execution units. The critical path through the graph determines the theoretical minimum execution time.

Fusion and fission: Dataflow subgraphs that operate on streams of data can be fused (combining operations to reduce intermediate storage) or fissioned (splitting operations for parallel execution). The compiler uses fusion to improve cache locality and fission to expose coarse-grained parallelism.

Systolic array mapping: For regular dataflow patterns—matrix multiplication, convolution, FFT—the compiler can map the dataflow graph onto a virtual systolic array. The mapping algorithm partitions the computation across processing elements and determines the data movement schedule. For execution on conventional hardware, the systolic mapping is lowered to SIMD vector operations or GPU shared memory accesses.

Data-driven scheduling extends beyond individual instructions to task-level parallelism. Kasteran*'s runtime uses a work-stealing scheduler where tasks are dynamically distributed across worker threads. Each task is a dataflow node: it becomes ready when all its input futures are fulfilled. The runtime's scheduler uses the Cilk work-stealing algorithm: idle workers steal ready tasks from busy workers' dequeues (Blumofe and Leiserson 1).

The TBB (Threading Building Blocks) library by Intel pioneered many of these concepts for C++ (Reinders 1). TBB's `parallel_for`, `parallel_reduce`, and `parallel_pipeline` patterns map dataflow concepts onto multicore CPUs with automatic load balancing and cache-aware task granularity. Intel's Ct (C for Throughput) language, a precursor to TBB, explored explicit dataflow programming with vector parallelism (Ghuloum et al. 1).

## 4. Current State of the Art
Modern dataflow architectures include both hardware and software approaches. Wave Computing's dataflow processing units (DPUs) implement static dataflow execution in silicon for machine learning workloads. The TRIPS (Tera-op, Reliable, Intelligently adaptive Processing System) architecture at the University of Texas demonstrated a hybrid von Neumann/dataflow design with explicit dataflow graph execution (Burger et al. 1).

In software, dataflow programming models have become mainstream for machine learning. TensorFlow and PyTorch construct dynamic computation graphs that are dataflow graphs: nodes are tensor operations, edges are tensor values, and execution schedulers (single-device, multi-device, distributed) map the graph onto available hardware. This approach combines the expressiveness of imperative programming with the optimization opportunities of dataflow analysis.

Apache Beam and Google Cloud Dataflow bring dataflow concepts to data processing pipelines. These systems model computation as directed graphs of transformations on data collections (PCollections), with automatic optimization, parallelization, and fault tolerance. The dataflow programming model enables declarative specification of data processing while the runtime handles distribution and scaling.

## 5. Relevance to Kasteran*
Kasteran*'s compiler analyzes dataflow parallelism at multiple granularities. At the instruction level, the compiler generates SSA form with explicit data dependencies, enabling the LLVM backend to exploit instruction-level parallelism through instruction scheduling and register allocation. At the loop level, the polyhedral model identifies data-parallel loop nests that can be mapped to SIMD or GPU execution. At the task level, the runtime's work-stealing scheduler exploits data dependencies captured through futures and promises.

The linear type system enhances dataflow analysis in several ways. Because linear values cannot be aliased, the compiler knows that each dataflow edge carries exactly one value, simplifying scheduling. The capability system tracks which dataflow nodes can access which memory regions, enabling the scheduler to place related nodes on the same core for cache locality.

Kasteran* also supports explicit dataflow programming through a `stream` abstraction:

```
let s: Stream<Int> = generate(1, 100);
let s1: Stream<Int> = map(s, |x| x * 2);
let s2: Stream<Int> = filter(s1, |x| x > 10);
let result: Int = sum(s2);
```

The compiler optimizes the pipeline using fusion (merging consecutive stream operations to eliminate intermediate arrays) and parallelism (distributing stream operations across cores). The type system ensures that stream operations are safe: linearity prevents aliasing of stream elements, and capabilities track which streams are being read or written.

## 6. Future Directions
The resurgence of interest in dataflow architectures for machine learning and data processing suggests that specialized hardware for dataflow execution may become more common. Google's TPU (Tensor Processing Unit) implements a systolic array matrix multiply unit, and newer AI accelerators incorporate dataflow scheduling at the chip level. Kasteran* is positioned to target these architectures through its MLIR-based code generation pipeline.

Another frontier is the integration of dataflow with distributed computing. While dataflow graphs are inherently parallel, distributing them across a cluster introduces challenges of latency, bandwidth, and fault tolerance. Kasteran*'s capability system provides a foundation for distributed dataflow: capabilities can be associated with node locations, enabling the compiler to generate communication-optimized schedules.

## Works Cited

Arvind, and R. S. Gostelow. "The U-Interpreter." *IEEE Computer*, vol. 15, no. 2, 1982, pp. 42-49.

Blumofe, Robert D., and Charles E. Leiserson. "Scheduling Multithreaded Computations by Work Stealing." *Journal of the ACM*, vol. 46, no. 5, 1999, pp. 720-748.

Burger, Doug, et al. "Scaling to the End of Silicon with EDGE Architectures." *IEEE Computer*, vol. 37, no. 7, 2004, pp. 44-55.

Dennis, Jack B. "Data Flow Supercomputers." *IEEE Computer*, vol. 13, no. 11, 1980, pp. 48-56.

Ghuloum, Anwar, et al. "Ct: A Programming Language for Throughput Computing." *Intel Technical Report*, 2007.

Kung, H. T. "Why Systolic Architectures?" *IEEE Computer*, vol. 15, no. 1, 1982, pp. 37-46.

Papadopoulos, Gregory M., and David E. Culler. "Monsoon: An Explicit Token-Store Architecture." *Proceedings of the 17th Annual International Symposium on Computer Architecture*, 1990, pp. 82-91.

Reinders, James. *Intel Threading Building Blocks: Outfitting C++ for Multi-Core Processor Parallelism*. O'Reilly Media, 2007.

Tomasulo, Robert M. "An Efficient Algorithm for Exploiting Multiple Arithmetic Units." *IBM Journal of Research and Development*, vol. 11, no. 1, 1967, pp. 25-33.

Gaudiot, Jean-Luc, and Lubomir Bic. *Advanced Topics in Dataflow Computing*. Prentice Hall, 1991.

Lee, Edward A., and David G. Messerschmitt. "Static Scheduling of Synchronous Data Flow Programs for Digital Signal Processing." *IEEE Transactions on Computers*, vol. 36, no. 1, 1987, pp. 24-35.

Dennis, Jack B., and David P. Misunas. "A Preliminary Architecture for a Basic Data-Flow Processor." *Proceedings of the 2nd Annual Symposium on Computer Architecture*, 1975, pp. 126-132.

Gurd, John R., et al. "The Manchester Prototype Dataflow Computer." *Communications of the ACM*, vol. 28, no. 1, 1985, pp. 34-52.

Nikhil, Rishiyur S. "A Dataflow Substrate for Parallel Programming." *Proceedings of the 1991 International Conference on Parallel Processing*, 1991, pp. 1-10.

Veidenbaum, Alexander V. "A Dataflow-Based Approach to Parallel Programming." *Proceedings of the 1993 International Conference on Supercomputing*, 1993, pp. 1-10.

Culler, David E., and Arvind. "Resource Requirements of Dataflow Programs." *Proceedings of the 15th Annual International Symposium on Computer Architecture*, 1988, pp. 141-150.

Sarkar, Vivek. *Partitioning and Scheduling Parallel Programs for Multiprocessors*. MIT Press, 1989.

Foster, Ian. *Designing and Building Parallel Programs*. Addison-Wesley, 1995.

Darte, Alain, et al. *Scheduling and Automatic Parallelization*. Birkhäuser, 2000.

Wolfe, Michael. *High Performance Compilers for Parallel Computing*. Addison-Wesley, 1996.

Allen, Randy, and Ken Kennedy. *Optimizing Compilers for Modern Architectures*. Morgan Kaufmann, 2002.

Padua, David A., and Michael J. Wolfe. "Advanced Compiler Optimizations for Supercomputers." *Communications of the ACM*, vol. 29, no. 12, 1986, pp. 1184-1201.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776168
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/03-kasteran
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
