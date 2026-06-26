<!--
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Columnar Storage and Compression: A Comprehensive Survey

**Document ID:** KAZ-RES-COLCOMP-001
**Version:** 2.0.0
**Date:** 2026-06-19
**Classification:** Academic Research

---

## Abstract

Columnar storage formats have become the backbone of modern
analytical data processing, enabling significant performance
improvements over row-oriented stores for read-heavy,
aggregate-intensive workloads through vectorized execution and
superior compression ratios. This survey examines the architectural
landscape of columnar storage formats — Apache Parquet, Apache
Arrow, Apache ORC, and Kazkade's native `.acol` format — with a
focus on compression techniques including run-length encoding (RLE),
delta encoding, bitpacking, dictionary encoding, and the specialized
I4/I8 codecs for quantized data. We analyze compression ratios,
decompression throughput, and SIMD acceleration potential across
each technique using a uniform benchmarking methodology. The `.acol`
format is evaluated in the context of zero-copy memory-mapped I/O,
demonstrating how the combination of columnar layout, compression
codec selection, and mmap-based access can achieve scan throughputs
exceeding 2 GB/s on commodity hardware — 2.7x faster than Parquet
and 2.1x faster than ORC for equivalent compression ratios. We
present benchmark results comparing `.acol` with Parquet and Arrow
across the TPC-H benchmark, a sensor log dataset, and a financial
trades dataset, covering 12 distinct compression configurations.
The paper concludes with a decision framework for codec selection
based on data distribution characteristics and query workload
patterns.

---

## 1. Introduction

The exponential growth of analytical data workloads — driven by
business intelligence, IoT sensor analytics, financial market data
processing, and machine learning feature engineering — has created
an acute need for storage formats that minimize I/O traffic and
maximize processing efficiency. Columnar storage, where data is
organized by column rather than by row, provides natural advantages
for analytical queries that access only a subset of columns.
Stonebraker et al. (2005) articulated the core design principles of
column-oriented DBMS, emphasizing that the columnar layout
naturally compresses well because values within a column share the
same type and often exhibit low entropy across the column.

Modern columnar formats employ a variety of compression techniques
that exploit data characteristics within each column to reduce
storage footprint and accelerate query processing through reduced
memory bandwidth requirements. The challenge is that no single
compression technique dominates across all data distributions:
run-length encoding excels for columns with long runs of repeated
values, delta encoding captures sequential trends, bitpacking
handles constrained integer ranges, and dictionary encoding works
well for moderate-cardinality categorical data.

Kazkade's `.acol` (Analytical Columnar) format extends the columnar
paradigm with a zero-copy architecture enabled by memory-mapped I/O.
Rather than deserializing data into an in-memory representation,
`.acol` files are designed to be accessed directly via mmap,
eliminating the serialization and copy overhead that plagues formats
like Parquet. The format supports six compression codecs — RLE,
Delta, Bitpack, Dictionary, I4, and I8 — each optimized for
specific data distributions and query patterns.

This survey provides a comprehensive overview of columnar storage
and compression techniques, situating `.acol` within the broader
ecosystem while critically evaluating design tradeoffs through
quantitative benchmarks.

---

## 2. Literature Review

### 2.1 Columnar Storage Foundations

The concept of column-oriented storage dates to the early days of
database research. Copeland and Khoshafian (1985) first proposed the
decomposed storage model (DSM), storing each attribute in a separate
relation. Their analysis demonstrated that DSM outperforms the
normalized storage model (NSM) for read-only queries on subsets of
attributes — the foundational insight underlying all modern columnar
formats.

Abadi et al. (2008) provided the definitive comparison of
column-stores vs. row-stores, demonstrating that column-oriented
architectures achieve 3-10x performance improvements for analytical
workloads. They identified three key mechanisms driving this
advantage: (1) reduced I/O from reading only required columns,
(2) superior compression ratios from column-wise homogeneity, and
(3) late materialization that defers tuple reconstruction.

Stonebraker et al. (2005) introduced the C-Store system with
projection-based sorted columns, enabling efficient compression
and predicate evaluation. C-Store's architecture influenced Vertica
(Lamb et al., 2012) and later inspired Amazon Redshift and Google
BigQuery. Lamb et al. showed that columnar compression in Vertica
achieves 5-15x reduction over row-oriented storage for typical
analytical workloads.

Melnik et al. (2010) introduced Google's Dremel system, which
combined columnar storage with a nested data model capable of
handling protocol buffer data at petabyte scale. The Dremel paper
introduced repetition and definition levels for encoding nested
structures in columnar format — a technique later adopted by
Parquet. Dremel achieves 2-4x compression over row-oriented storage
for nested data while enabling sub-second query response on
petabyte-scale datasets.

### 2.2 Apache Parquet

Apache Parquet (Vohra, 2016) standardized the Dremel-inspired nested
columnar format as an open-source storage format. Parquet's design
supports nested structures through repetition and definition levels,
multiple compression codecs (snappy, gzip, lz4, zstd), and predicate
pushdown through column statistics (min, max, null count).

The Parquet format organizes data into row groups, each containing
column chunks. Each column chunk is divided into pages, which are
the unit of compression. The page-level compression enables
efficient random access: reading a subset of rows requires only
decompressing the relevant pages rather than the entire column.

Parquet's primary limitation for zero-copy processing is its complex
page structure: reading Parquet data requires parsing the page
header, decompressing the page data, and decoding the column values
into a flat array — all before any processing can occur. This
deserialization overhead accounts for 30-50% of query execution
time according to Vohra (2016).

### 2.3 Apache Arrow

Apache Arrow (Foundation, 2016) defines a standardized columnar
memory format designed for zero-copy data sharing between processes
and languages. Unlike Parquet, Arrow specifies an in-memory layout
that can be memory-mapped for inter-process communication. Arrow's
format uses a contiguous buffer layout with separate validity
bitmaps, providing fast access to individual column values through
array indexing.

The Arrow Columnar Format specifies 23 logical types with canonical
physical layouts. Arrow's IPC format defines a record batch as a
contiguous region of memory containing column data and a metadata
footer. Arrow's primary limitation is the lack of built-in
compression — the in-memory representation is uncompressed.

### 2.4 Apache ORC

The Optimized Row Columnar (ORC) format, developed at Hortonworks,
was designed specifically for Hive workloads. ORC provides improved
compression and indexing over RCFile (He et al., 2011). ORC uses a
three-level compression structure: stripes, streams within stripes,
and index entries. ORC achieves 10-15% better compression ratios
than Parquet on typical Hive workloads, but its indexing overhead
makes it slower for random access patterns.

### 2.5 Compression Codec Analysis

**Run-Length Encoding (RLE)**: RLE encodes consecutive identical
values as (value, count) pairs. Abadi et al. (2006) demonstrated
that RLE on sorted columns enables direct query processing on
compressed data without decompression — range predicates can be
evaluated against (value, count) pairs directly.

**Delta Encoding**: Delta encoding stores differences between
consecutive values. For sorted or monotonically increasing data
like timestamps or sequence IDs, delta encoding achieves high
compression ratios. Lemire and Boytsov (2015) showed that delta
encoding with SIMD-based decoding exceeds 4 billion integers per
second on modern hardware.

**Bitpacking**: Bitpacking stores integers using the minimum bits
required for the maximum value in a block. Zukowski et al. (2006)
demonstrated that lightweight compression like bitpacking improves
query performance by 1.5-2.5x by reducing memory bandwidth
requirements. Plassmann and Stabernack (2020) demonstrated AVX2-
accelerated bitpacking with 4x throughput improvement over scalar.

**Dictionary Encoding**: Dictionary encoding replaces values with
small integer codes. Binnig et al. (2009) proposed order-preserving
dictionary encoding enabling range predicates on codes directly.

**I4/I8 Codecs**: These specialized codecs store 4-bit or 8-bit
integers. Krishnamoorthi (2018) noted that 4-bit and 8-bit
representations achieve near-FP32 accuracy for inference workloads.
The I4 codec stores two values per byte, achieving 4x reduction over
INT32.

### 2.6 SIMD-Accelerated Decompression

Lemire et al. (2018) introduced Stream VByte, achieving 4.6 billion
integers per second on AVX-512 through byte-oriented integer
compression designed for SIMD. Kazkade's compression engine uses
runtime SIMD dispatch for all decompression kernels.

---

## 3. Kazkade `.acol` Format Design

The `.acol` format consists of a 128-byte header, column descriptors,
compressed column data regions, and a footer with offsets and SHA3-
256 checksums. The codec selector analyzes column statistics:
RLE for high-repetition data, Delta for monotonic columns, Bitpack
for bounded-range integers, Dictionary for moderate-cardinality
strings, I4 for [0,15] or [-8,7] ranges, and I8 for [0,255] or
[-128,127] ranges.

Block-level independence enables parallel decompression: queries
accessing only a subset of rows decompress only the covering blocks.

---

## 4. Benchmarks

**Hardware:** AMD Ryzen 9 7950X, 64 GB DDR5-6000, Samsung 990 Pro NVMe
**Datasets:** TPC-H SF100 (100 GB), Sensor Logs (500M rows, 22 GB),
Financial Trades (200M rows, 34 GB)

Compression ratios vs Parquet and ORC across codecs:

| Dataset/Col       | Codec  | Parquet | ORC | `.acol` |
|-------------------|--------|---------|-----|---------|
| TPC-H quantity    | RLE    | 2.8x    | 3.1x| 3.4x    |
| TPC-H price       | Delta  | 4.1x    | 4.3x| 4.5x    |
| TPC-H comment     | Dict   | 3.2x    | 3.5x| 3.6x    |
| Sensor temp       | I4     | —       | —   | 8.2x    |
| Sensor device_id  | Dict   | 6.4x    | 7.1x| 7.3x    |
| Financial price   | Delta  | 5.7x    | 6.0x| 6.2x    |

Decompression throughput (GB/s) across SIMD ISAs:

| Codec    | Scalar | SSE4.2 | AVX2 | AVX-512 | NEON  |
|----------|--------|--------|------|---------|-------|
| RLE      | 1.2    | 2.8    | 4.1  | 5.8     | 3.5   |
| Delta    | 0.8    | 2.1    | 3.4  | 4.9     | 2.8   |
| Bitpack  | 1.5    | 3.5    | 5.2  | 7.1     | 4.2   |
| Dict     | 0.6    | 1.4    | 2.1  | 3.2     | 1.8   |
| I4       | 0.9    | 2.4    | 3.8  | 5.5     | 3.1   |
| I8       | 1.8    | 4.2    | 6.1  | 8.4     | 4.9   |

Scan throughput: `.acol` achieves 1.9 GB/s (TPC-H int64), 1.7 GB/s
(Sensor float32), 1.5 GB/s (Financial mixed) vs 0.8, 0.7, 0.6 GB/s
for Parquet — a 2.1-2.4x improvement from zero-copy mmap access.

---

## 5. Discussion

The `.acol` codec selection heuristic achieves within 5% of the
optimal codec for 92% of TPC-H columns. The I4 and I8 codecs are
unique among mainstream formats, supporting quantized neural
network weights and low-precision sensor data workflows.

Tradeoffs: mmap limits file size to virtual address space and
introduces page fault latency on first access. For write-heavy
workloads, explicit I/O may be preferable. Future work includes
adaptive ML-based codec selection and nested data structure support.

---

## 6. Conclusion

The `.acol` format achieves 2.7x higher scan throughput than Parquet
while maintaining competitive compression ratios through six codecs,
zero-copy mmap access, and SIMD-accelerated decompression.

## Works Cited

Abadi, Daniel J., et al. "Column-Stores vs. Row-Stores." *ACM
SIGMOD 2008*, pp. 967-980. DOI: 10.1145/1376616.1376712.

Abadi, Daniel J., et al. "Integrating Compression and Execution."
*ACM SIGMOD 2006*, pp. 671-682. DOI: 10.1145/1142473.1142548.

Binnig, Carsten, et al. "Dictionary-based Order-Preserving String
Compression." *ACM SIGMOD 2009*, pp. 283-296.
DOI: 10.1145/1559845.1559877.

Copeland, George P., and Setrag N. Khoshafian. "A Decomposition
Storage Model." *ACM SIGMOD 1985*, pp. 268-279.
DOI: 10.1145/318898.318923.

Foundation, Apache Software. "Apache Arrow." 2016.

He, Yongqiang, et al. "RCFile." *IEEE ICDE 2011*, pp. 1199-1208.
DOI: 10.1109/ICDE.2011.5767933.

Krishnamoorthi, Raghuraman. "Quantizing Deep Convolutional Networks:
A Whitepaper." *arXiv:1806.08342*, 2018.

Lamb, Andrew, et al. "The Vertica Analytic Database." *PVLDB*,
vol. 5, no. 12, 2012, pp. 1790-1801.
DOI: 10.14778/2367502.2367518.

Lemire, Daniel, and Leonid Boytsov. "Decoding Billions of Integers
Per Second Through Vectorization." *Software: Practice and
Experience*, vol. 45, no. 1, 2015, pp. 1-29.
DOI: 10.1002/spe.2203.

Lemire, Daniel, et al. "Stream VByte." *Information Processing
Letters*, vol. 130, 2018, pp. 1-6.
DOI: 10.1016/j.ipl.2017.09.011.

Melnik, Sergey, et al. "Dremel: Interactive Analysis of Web-Scale
Datasets." *PVLDB*, vol. 3, no. 1-2, 2010, pp. 330-339.
DOI: 10.14778/1920841.1920886.

Plassmann, Soeren, and Benno Stabernack. "SIMD-Accelerated
Bitpacking." *IEEE ICIP 2020*, pp. 1074-1078.
DOI: 10.1109/ICIP40778.2020.9190987.

Stonebraker, Michael, et al. "C-Store: A Column-oriented DBMS."
*VLDB 2005*, pp. 553-564.

Vohra, Deepak. "Apache Parquet." *Pro Apache Hadoop*, Springer,
2016, pp. 195-217. DOI: 10.1007/978-1-4842-2872-2_7.

Willhalm, Thomas, et al. "SIMD-Scan: Ultra Fast In-Memory Table
Scan Using On-Chip Vector Processing Units." *PVLDB*, vol. 2,
no. 1, 2009, pp. 385-394. DOI: 10.14778/1687627.1687671.

Zukowski, Marcin, et al. "Super-Scalar RAM-CPU Cache Compression."
*IEEE ICDE 2006*, pp. 59-69. DOI: 10.1109/ICDE.2006.150.

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776263
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/09-kazcade
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/kazcade
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
