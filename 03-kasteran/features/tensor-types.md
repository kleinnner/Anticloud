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

# Kasteran* — Tensor Types

© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* provides first-class tensor types for multi-dimensional array operations. Tensors are the foundation for numerical computing, machine learning, and graphics workloads.

## Syntax

Tensors are declared with the bracket syntax:

```
|: Tensor1D = [f32, 128]        // 128-element vector
|: Tensor2D = [f32, 64, 64]     // 64x64 matrix
|: Tensor3D = [f32, 32, 32, 3]  // 3D volume with 3 channels
```

The first element is the element type, followed by dimension sizes. Supported element types include `f32`, `f64`, `i32`, `i64`, and `bool`.

## Creation

```
zeros  := [f32, 256].zeros()
ones   := [f32, 64, 64].ones()
random := [f32, 128].uniform(0.0, 1.0)
```

## Broadcasting

Kasteran* supports NumPy-style broadcasting semantics. When operating on tensors of different shapes, dimensions are aligned from the right:

```
a := [f32, 3, 1]  // shape (3, 1)
b := [f32, 1, 4]  // shape (1, 4)
c := a + b        // result shape (3, 4)
```

Broadcasting rules:

1. If dimensions differ, the smaller tensor is padded with 1s on the left
2. Dimensions of size 1 are stretched to match
3. If no dimension matches, it is an error

## Slicing

Tensor slicing uses bracket notation with colon ranges:

```
mat := [f32, 10, 10].zeros()
row := mat[3, :]      // fourth row, all columns
col := mat[:, 5]      // all rows, sixth column
sub := mat[2:5, 2:5]  // 3x3 submatrix
```

Strided slicing is supported:

```
evens := mat[::2, :]    // every other row
```

## Matrix Multiplication

The `@` operator performs matrix multiplication:

```
a := [f32, 128, 64].uniform(0.0, 1.0)
b := [f32, 64, 256].uniform(0.0, 1.0)
c := a @ b     // result shape [f32, 128, 256]
```

## Reduction Operations

```
sum   := tensor.sum()
mean  := tensor.mean()
max   := tensor.max()
min   := tensor.min()
```

Reductions along specific axes:

```
row_sums := mat.sum(axis=1)
```

## Element-wise Operations

All arithmetic operators work element-wise on tensors:

```
a := [f32, 128].ones()
b := [f32, 128].uniform(0.0, 1.0)
c := a * b + 1.0   // element-wise multiply and add
```

## Graph

```
graphify {
    TensorDecl([type, d1, d2, ...]) -> TensorType
    TensorType -> {Creation, Slice, Broadcast, Matmul}
    Creation -> {zeros, ones, uniform, from_array}
    Slice -> {Range, Strided, Index}
    Broadcast -> {ShapeAlignment, DimStretch}
    Matmul(@) -> {GEMM, MKL, OpenMP}
}
```

## Example: Linear Layer

```
|+ linear_layer(input: [f32, 128], weights: [f32, 128, 64], bias: [f32, 64]) -> [f32, 64] {
    raw := input @ weights    // [f32, 64]
    => raw + bias
}

|+ relu(input: [f32, 64]) -> [f32, 64] {
    => input.max(0.0)         // element-wise max with scalar
}

|+ forward(x: [f32, 128]) -> [f32, 64] {
    h1 := linear_layer(x, w1, b1) ~> relu
    h2 := linear_layer(h1, w2, b2) ~> relu
    => h2
}
```

## Example: Convolution (3x3)

```
|+ conv2d(input: [f32, 32, 32, 3], kernel: [f32, 3, 3, 3, 16]) -> [f32, 30, 30, 16] {
    // Built-in convolution
    => input.conv2d(kernel, stride=1, padding=0)
}
```

## Memory Layout

By default, tensors are stored in **row-major** (C-style) order. The compiler can optionally emit column-major order for BLAS compatibility via the `kasteran.toml` option `tensor.layout = "column-major"`.
</```
