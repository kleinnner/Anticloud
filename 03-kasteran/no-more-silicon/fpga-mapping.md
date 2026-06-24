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

# Kasteran* — FPGA Mapping
© Lois-Kleinner & 0-1.gg 2026

## Overview

Field-Programmable Gate Arrays (FPGAs) offer reconfigurable hardware that can be customized for specific workloads. Kasteran* compiler's intermediate representation — based on dataflow graphs — maps naturally to FPGA fabric, enabling high-performance hardware acceleration without traditional hardware description languages.

## Dataflow Graph Representation

Kasteran* compiler uses a dataflow graph as its intermediate representation (IR):

```
input_a ──┐
          ├──▶ mul ──▶ add ──▶ output
input_b ──┘         │
               input_c
```

Each node in the graph represents an operation, and edges represent data dependencies. This representation is ideal for FPGA mapping because FPGAs are fundamentally dataflow architectures.

## Mapping to FPGA Fabric

### Logic Blocks
Kasteran* operations map to FPGA logic blocks:
- **Arithmetic operations**: Map to DSP slices (multipliers, adders)
- **Logic operations**: Map to LUTs (look-up tables)
- **Memory operations**: Map to block RAM (BRAM)
- **Control logic**: Maps to flip-flops and MUXes

### Pipelining
Dataflow graphs map naturally to pipelined implementations:
- Each pipeline stage corresponds to a depth level in the graph
- Registers are inserted at pipeline boundaries
- Throughput is determined by the critical path
- Latency is the sum of all stage delays

### Parallelism
Independent branches in the dataflow graph execute in parallel:
- Multiple operations per clock cycle
- Data-level parallelism across array elements
- Task-level parallelism across independent subgraphs

## Compilation Flow

The FPGA compilation flow is:

1. **Source to IR**: Kasteran* source compiles to dataflow IR
2. **IR optimization**: Graph optimizations (common subexpression, dead code)
3. **Resource estimation**: Estimate LUT, DSP, BRAM, and FF usage
4. **Placement and routing**: Map IR nodes to FPGA resources
5. **Bitstream generation**: Generate FPGA configuration bitstream

## Resource Estimation

Kasteran* provides FPGA resource estimation at compile time:

```
fn matrix_multiply(a: Matrix, b: Matrix) -> Matrix
    @fpga_resources(
        lut = 24576,
        dsp = 512,
        bram = 128,
        ff = 16384,
        frequency = "300MHz"
    )
```

## High-Level Synthesis Features

Kasteran* provides HLS features for FPGA development:

### Loop Pipelining
Loops are automatically pipelined:
- Initiation interval (II) is optimized
- Loop-carried dependencies are analyzed
- Array partitioning for BRAM access

### Data Type Customization
Custom bit widths reduce resource usage:
```
// 8-bit integer instead of 32-bit
let pixel: u8 = read_pixel()
```

### Memory Architecture
Kasteran* supports various memory architectures:
- On-chip BRAM for local storage
- DDR4/DDR5 for external memory
- HBM for high-bandwidth applications
- Streaming interfaces for data flow

## Performance Characteristics

| Workload | CPU | GPU | FPGA (Kasteran*) |
|---|---|---|---|
| Signal processing | 1x | 10x | 50x |
| Packet processing | 1x | 2x | 100x |
| Matrix multiply | 1x | 25x | 10x |
| Crypto operations | 1x | 5x | 100x |

## Example: FIR Filter

```
// Kasteran* FIR filter - compiles to FPGA
fn fir_filter(input: [f32], coefficients: [f32]) -> [f32] {
    // Compiler generates pipelined FPGA implementation
    // with DSP slices for multiply-accumulate
    for i in coefficients.length..input.length {
        var acc = 0.0
        for j in coefficients.length {
            acc += input[i - j] * coefficients[j]
        }
        result[i] = acc
    }
    return result
}
```

## Conclusion

Kasteran* dataflow-based IR maps naturally to FPGA fabric, enabling high-performance hardware acceleration. Developers can target FPGAs using familiar programming constructs rather than hardware description languages, making FPGA acceleration accessible to a wider range of developers.
