                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 04 — Searching with Natural Language

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Overview](#overview)
2. [How Semantic Search Works](#how-semantic-search-works)
3. [Setting Up Ollama for Search](#setting-up-ollama-for-search)
4. [Your First Search](#your-first-search)
5. [Understanding Search Results](#understanding-search-results)
6. [Advanced Query Techniques](#advanced-query-techniques)
7. [Filtering Results](#filtering-results)
8. [Using the Mock Backend](#using-the-mock-backend)
9. [Performance Optimization](#performance-optimization)
10. [Search in the GPU Canvas](#search-in-the-gpu-canvas)
11. [Troubleshooting Search](#troubleshooting-search)
12. [Query Language Reference](#query-language-reference)

---

## Overview

The ability to search files using natural language is Kamelot's killer feature. Instead of remembering where you saved a file, what you named it, or what folder it's in, you simply describe what you're looking for in plain English (or any language Qwen 2 VL supports).

Kamelot's search is powered by vector similarity. Both your files and your queries are converted into mathematical vectors (embeddings) that capture semantic meaning. Files that are semantically similar to your query appear at the top of the results.

This tutorial covers everything from your first search to advanced query techniques, filtering, and optimization.

## How Semantic Search Works

### The Query Pipeline

```
Your Query: "find my tax documents from last year"
                    │
                    ▼
              ┌──────────┐
              │  Ollama  │
              │  Qwen    │  "find my tax documents from last year"
              │  2 VL    │  → [0.23, -0.45, 0.67, ..., 0.12]
              └────┬─────┘
                   │ Query Embedding (384 dims)
                   ▼
              ┌──────────┐
              │  Qdrant  │  Cosine Similarity Search
              │  HNSW    │  Compare query vector vs all stored vectors
              └────┬─────┘
                   │ Ranked Results (by similarity score)
                   ▼
              ┌──────────┐
              │  Decrypt │  Decrypt metadata for display
              │  & Sort  │  (file content stays encrypted)
              └────┬─────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Results Displayed   │
        │  Score  Name         │
        │  0.94   tax-2025.pdf │
        │  0.87   irs-forms... │
        │  0.45   shopping.... │
        └──────────────────────┘
```

### Vector Similarity Explained

Each file is represented as a point in 384-dimensional space. When you search, your query is also converted to a point, and Kamelot finds all files whose points are nearby.

Imagine a 2D simplification:

```
     ↑
     │        📄 "cat photo.jpg"
     │        ·
     │
     │  📄 "tax return.pdf"
     │  ·
     │                    📄 "shopping list.txt"
     │                    ·
     │        📄 "budget.xlsx"
     │        ·
     │                            📄 "project plan.md"
     │                            ·
     └─────────────────────────────────────────────→

Query: "tax documents"
     → Located near "tax return.pdf" and "budget.xlsx"
     → Far from "cat photo.jpg"
```

### Cosine Similarity

The specific metric used is cosine similarity, which measures the angle between vectors:

```
cosine_similarity(A, B) = (A · B) / (||A|| * ||B||)
```

- **1.0**: Identical direction (very similar)
- **0.0**: Orthogonal (unrelated)
- **-1.0**: Opposite direction (very dissimilar)

In practice, Kamelot returns scores between 0 and 1. Scores above 0.7 indicate strong semantic matches. Scores below 0.5 are typically noise.

### Why This Is Better Than Keyword Search

| Aspect | Traditional Keyword Search | Kamelot Semantic Search |
|--------|---------------------------|------------------------|
| Query format | Exact keywords | Natural language |
| Synonyms | Misses synonyms | Matches synonyms automatically |
| Typos | Requires exact spelling | Tolerant of typos |
| Context | No understanding | Understands context |
| "Tax documents" | Matches only "tax documents" | Matches "tax return", "IRS filing", "1040 form" |
| Language | Language-specific | Multi-lingual (Qwen 2 VL) |
| Ranking | Binary (match/no match) | Continuous (similarity score) |

## Setting Up Ollama for Search

### Start Ollama

```bash
ollama serve
```

This starts the Ollama server on `http://127.0.0.1:11434`. Keep this terminal open, or run it as a background service.

### Verify Ollama is Running

```bash
curl http://127.0.0.1:11434/api/tags
```

Expected output:
```json
{"models":[{"name":"qwen2-vl:2b","modified_at":"2026-06-19T10:00:00Z","size":1717986918}]}
```

### Pull the Model (if not already done)

```bash
ollama pull qwen2-vl:2b
```

### Check Model Availability

```bash
kml status --models
```

Output:
```
Ollama Models:
  qwen2-vl:2b (available, 1.6 GB)
```

### Optimize Ollama for Search

For better search performance, configure Ollama to keep the model loaded in memory:

```bash
# Keep model loaded (avoids cold-start latency)
ollama run qwen2-vl:2b --keep-alive 5m
```

Or configure in Kamelot:

```toml
[ollama]
keep_alive = "5m"  # Keep model loaded for 5 minutes after last use
```

## Your First Search

### Basic Search

```bash
kml query "find my tax documents"
```

Expected output:

```
Top 5 results for "find my tax documents":
  Score  Inode                                    Name              MIME              Size
  ─────  ─────                                    ────              ────              ────
  0.942  7f3a5c91-...    tax-return-2025.pdf       application/pdf   245 KB
  0.887  a1b2c3d4-...    irs-form-1040.pdf         application/pdf   180 KB
  0.834  e5f6a7b8-...    w2-2025.png               image/png         1.2 MB
  0.721  c9d0e1f2-...    budget-2025.xlsx           application/xlsx   56 KB
  0.512  b2c3d4e5-...    shopping-list.txt          text/plain        1 KB

Showing 5 of 12 results.
```

### Search with Limit

```bash
kml query "find my tax documents" --limit 3
```

### Search with Minimum Score

```bash
kml query "find my tax documents" --min-score 0.7
```

### Search with a Different Model

```bash
kml query "find my tax documents" --model qwen2-vl:7b
```

### Search in Different Languages

```bash
# Spanish
kml query "buscar mis documentos de impuestos"

# French
kml query "trouver mes documents fiscaux"

# German
kml query "finde meine Steuerunterlagen"

# Chinese
kml query "查找我的税务文件"

# Japanese
kml query "税金の書類を探す"
```

Qwen 2 VL supports multiple languages. Results will include files whose embeddings are close to the query embedding in any language.

## Understanding Search Results

### Result Fields

Each result contains:

| Field | Description | Example |
|-------|-------------|---------|
| **Score** | Cosine similarity (0-1) | 0.942 |
| **Inode** | UUID v4 unique identifier | `7f3a5c91-...` |
| **Name** | Original filename | `tax-return-2025.pdf` |
| **MIME** | File type | `application/pdf` |
| **Size** | File size | 245 KB |
| **Created** | Ingestion timestamp | `2026-06-19 10:00:00` |
| **Tags** | User-assigned tags (if any) | `taxes, 2025` |

### Score Interpretation

| Score Range | Meaning | Likelihood of Match |
|-------------|---------|-------------------|
| 0.90 - 1.00 | Extremely close | Almost certainly what you want |
| 0.80 - 0.89 | Very close | Likely relevant |
| 0.70 - 0.79 | Close | Probably relevant |
| 0.60 - 0.69 | Moderate | Possibly relevant |
| 0.50 - 0.59 | Weak | Tangentially related |
| < 0.50 | Noise | Unlikely to be relevant |

### Output Formats

**Table (default):**

```bash
kml query "tax documents"
```

**JSON:**

```bash
kml query "tax documents" --format json
```

Output:
```json
{
  "query": "tax documents",
  "results": [
    {
      "score": 0.942,
      "inode": "7f3a5c91-...",
      "name": "tax-return-2025.pdf",
      "mime_type": "application/pdf",
      "size": 245000,
      "created_at": "2026-06-19T10:00:00Z",
      "tags": ["taxes"]
    }
  ],
  "total_results": 12,
  "query_time_ms": 45.2
}
```

**CSV:**

```bash
kml query "tax documents" --format csv
```

Output:
```
score,inode,name,mime_type,size,created_at,tags
0.942,7f3a5c91-...,tax-return-2025.pdf,application/pdf,245000,2026-06-19T10:00:00Z,"taxes"
```

**YAML:**

```bash
kml query "tax documents" --format yaml
```

### Getting File Content

Once you find the file you want, retrieve it:

```bash
kml get 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c --output recovered_file.pdf
```

Or by name:

```bash
kml get "tax-return-2025.pdf" --output ./restored/tax-return-2025.pdf
```

## Advanced Query Techniques

### Multi-part Queries

```bash
# OR logic (implicit)
kml query "budget OR financial report OR expense sheet"

# AND logic
kml query "project proposal Q4 2025"
```

Kamelot uses the query embedding as a whole. For complex queries, the model considers all terms together.

### Phrase Emphasis

```bash
# Use quotes for exact phrase matching (the model weights these terms higher)
kml query '"confidential client list"'

# Combine phrases and terms
kml query '"quarterly report" 2025 financial'
```

### Negative Queries

You can exclude concepts:

```bash
kml query "meeting notes" --exclude "canceled"
```

Files semantically related to "canceled" will be downranked.

### Date-Range Queries

```bash
# Natural date queries
kml query "documents from last week"
kml query "files created in march 2025"
kml query "everything from q4 2025"

# Explicit date filters combine with semantic search
kml query "project files" --since "2025-01-01" --until "2025-12-31"
```

### File Type Queries

```bash
# Query by type
kml query "spreadsheets with budget data"
kml query "presentation slides about marketing"
kml query "code files related to authentication"

# Explicit type filter
kml query "api documentation" --mime application/pdf
```

### User-Tag Queries

```bash
# Search within tagged files
kml query "budget" --tag "work" --tag "finance"

# Combine multiple tags
kml query "project planning" --tag "active" --tag "important"
```

### Author-Based Queries

```bash
kml query "reports" --author "John Smith"
```

### Combined Advanced Query

```bash
kml query "confidential client contracts" \
  --mime application/pdf \
  --tag "legal" \
  --since "2025-01-01" \
  --exclude "draft" \
  --min-score 0.75 \
  --limit 10 \
  --format json
```

### Similarity Search (Find Similar Files)

Find files similar to an existing file:

```bash
kml similar 7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c
```

This uses the file's own embedding as the query:

```
Top 5 files similar to tax-return-2025.pdf:
  Score  Name
  0.97   tax-return-2025.pdf  (identical)
  0.91   irs-form-1040.pdf
  0.88   w2-2025.png
  0.82   tax-withholding.xlsx
  0.76   budget-2025.xlsx
```

### Negative Example Search

```bash
kml similar 7f3a5c91... --exclude a1b2c3d4...
```

### Concept Arithmetic

You can do vector arithmetic:

```bash
# "Find photos of cats but not dogs"
kml query "cat" --exclude "dog"

# "Find work documents that are not about budget"
kml query "work documents" --exclude "budget finance money"
```

## Filtering Results

### MIME Type Filters

```bash
# Show only PDFs
kml query "tax documents" --mime application/pdf

# Show only images
kml query "vacation" --mime image/jpeg --mime image/png

# Show only code files
kml query "authentication" --mime text/x-python --mime text/x-rust
```

### Size Filters

```bash
# Small files
kml query "notes" --max-size 10240  # Less than 10 KB

# Large files
kml query "presentations" --min-size 1048576  # More than 1 MB

# Range
kml query "documents" --min-size 1024 --max-size 10485760  # 1 KB - 10 MB
```

### Date Filters

```bash
# Since a date
kml query "reports" --since "2026-01-01"

# Until a date
kml query "old documents" --until "2025-06-01"

# Date range
kml query "project files" --since "2025-06-01" --until "2026-06-01"

# Relative dates
kml query "recent files" --since "7 days ago"
kml query "last month's files" --since "30 days ago" --until "now"
```

### Tag Filters

```bash
# Files with a specific tag
kml query "everything" --tag "important"

# Files with ANY of these tags (OR logic)
kml query "work" --tag "work" --tag "project" --tag "active"

# Files with ALL of these tags (AND logic)
kml query "urgent work" --tag "work" --tag "urgent"
```

### Combining Filters with Semantic Search

The real power comes from combining semantic search with explicit filters:

```bash
kml query "budget spreadsheets for Q4 marketing projects" \
  --mime application/vnd.openxmlformats-officedocument.spreadsheetml.sheet \
  --tag "marketing" \
  --since "2025-10-01" \
  --until "2025-12-31" \
  --min-score 0.6 \
  --limit 20
```

This finds files that:
1. Are semantically related to "budget spreadsheets for Q4 marketing projects"
2. Are Excel spreadsheets
3. Have the "marketing" tag
4. Were ingested in Q4 2025
5. Have at least 0.6 similarity score
6. Returns at most 20 results

### Working with the Results

```bash
# Export results to a file
kml query "tax documents" --format json --output results.json

# Count results
kml query "tax documents" --count

# Show only the top result
kml query "tax documents" --limit 1

# Get full metadata for each result
kml query "tax documents" --verbose
```

## Using the Mock Backend

Kamelot includes a mock embedding backend that does not require Ollama. This is useful for:

- Testing and development
- CI/CD pipelines
- Demo environments
- Systems without GPU

### Enable Mock Mode

```bash
kml query "test query" --model mock
```

### How Mock Embeddings Work

The mock backend generates deterministic embeddings based on a hash of the text:

- Same text → same embedding (deterministic)
- Similar text → somewhat similar embedding (not as good as real model)
- Different text → different embedding

The mock model produces 384-dimensional random-but-consistent vectors. They are not semantically meaningful, but they demonstrate the search pipeline.

### Configure Mock as Default

```toml
[ollama]
model = "mock"
mock_dimensions = 384
mock_seed = 42  # Deterministic seed
```

### Use Cases for Mock

**Testing queries:**

```bash
kml put "The quick brown fox" --model mock
kml put "Lazy dog sleeping" --model mock
kml query "brown fox" --model mock

# Results will be ranked, but semantically meaningless
```

**CI/CD pipeline:**

```yaml
# .github/workflows/test.yml
- name: Test Kamelot Search
  run: |
    kml init ./test_store
    kml put test_data/ --recursive --model mock
    kml query "test" --model mock --format json > results.json
    # Assert expected results
```

**Benchmarking:**

```bash
# Benchmark without Ollama overhead
kml query "benchmark query" --model mock --limit 1000
```

### Limitations of Mock

- No semantic understanding
- Visual embeddings not generated for images
- Cross-lingual search does not work
- Scores are not meaningful (always ~0.5 for unrelated, ~0.9 for exact match)

## Performance Optimization

### Index Optimization

The HNSW index in Qdrant has parameters that trade off search speed vs. accuracy:

```toml
[qdrant.hnsw]
m = 16           # Number of bi-directional links (default: 16)
ef_construct = 100  # Size of dynamic candidate list (default: 100)
ef_search = 64   # Search depth (default: 64)
```

**For faster search (lower accuracy):**

```toml
[qdrant.hnsw]
m = 8
ef_construct = 50
ef_search = 32
```

**For higher accuracy (slower search):**

```toml
[qdrant.hnsw]
m = 32
ef_construct = 200
ef_search = 128
```

### Query Caching

```toml
[query]
cache_size = 1000  # Cache results for repeated queries
cache_ttl = 300    # Invalidate after 5 minutes
```

### Pre-computed Embeddings

For faster queries, you can pre-compute query embeddings:

```bash
# Pre-compute embedding for a common query
kml query "work documents" --precompute

# Later queries use the cached embedding
kml query "work documents" --use-cached
```

### Batch Query Processing

```bash
# Multiple queries in one command
kml query --batch queries.txt
```

`queries.txt`:
```
find my tax documents
show me recent photos
where is the budget spreadsheet
```

### Parallel Queries

```bash
# Run 3 queries in parallel
kml query "tax" --parallel &
kml query "photos" --parallel &
kml query "budget" --parallel &
wait
```

### Query Timeouts

```bash
kml query "complex search" --timeout 30  # 30 seconds max
```

### Connection Pooling

```toml
[qdrant]
pool_size = 4  # Number of simultaneous connections to Qdrant
```

### Payload Indexing

For faster filtered queries, configure Qdrant payload indexes:

```toml
[qdrant.payload_index]
fields = ["mime_type", "created_at", "size", "tags"]
```

## Search in the GPU Canvas

When you launch the GPU canvas UI, search is available through the omnibox.

### Launch the Canvas

```bash
kamelot-ui
```

### The Omnibox

The omnibox is a search bar at the top of the canvas window.

- **Open:** `Ctrl+Space` or click the search icon
- **Type:** Enter a natural language query
- **Results:** Matching files appear as cards below the omnibox
- **Select:** Click a result or use arrow keys + Enter

### Visual Result Display

In the canvas, search results show:

- File thumbnail or icon (based on MIME type)
- File name and size
- Similarity score (visualized as a bar or percentage)
- Preview snippet (first few lines of text)

### Dragging Results to Canvas

When you find a file via search, you can drag it from the results panel onto the canvas. The file appears as a tile that you can position anywhere.

### Canvas Navigation from Search

```bash
# In the CLI, open a specific file's location on the canvas
kml query "budget" --show-on-canvas
```

This centers the canvas on the file's position (if placed there previously).

## Troubleshooting Search

### "No results found"

**Possible causes:**
- Store is empty
- Query is too specific
- Embedding model is not running

**Solutions:**

```bash
# Check if store has files
kml list --count

# Broaden your query
kml query "documents"  # Very broad
kml query "tax"        # Partial match
kml query "finance"    # Different wording

# Check Qdrant
curl http://localhost:6333/collections/kamelot
```

### "Failed to connect to Ollama"

```bash
# Start Ollama
ollama serve

# Check if it's listening
curl http://127.0.0.1:11434/api/tags
```

### "Model not available"

```bash
# Pull the model
ollama pull qwen2-vl:2b

# List available models
ollama list
```

### Low Quality Results

If your search results don't match what you expect:

```bash
# Try different wording
kml query "IRS filing"  # instead of "tax documents"

# Use more specific terms
kml query "1040 form 2025"  # instead of "tax form"

# Check if embeddings were generated correctly
kml get a1b2c3d4... --embedding

# Re-embed a file with a different model
kml put --re-embed filename.pdf --model qwen2-vl:7b
```

### Slow Queries

```bash
# Check query time
kml query "test" --verbose
# Look for "query_time_ms"

# Check Qdrant performance
curl http://localhost:6333/collections/kamelot

# Optimize HNSW parameters (see Performance Optimization section)

# Check system resources
# CPU, RAM, and disk I/O affect query speed
```

### Inconsistent Results

If the same query returns different results:

```bash
# Check Ollama model temperature
# Set to 0 for deterministic output
kml config set ollama.temperature 0

# Check if store is being modified between queries
kml status
# Compare block count
```

### Cross-Lingual Search Issues

If searching in one language doesn't find documents in another:

```bash
# Use the same language as the documents
kml query "documentos de impuestos"  # For Spanish documents

# Or use a model with better cross-lingual support
kml query "tax documents" --model qwen2-vl:7b
```

## Query Language Reference

### Query Syntax

```
query [--model <model>] [--limit <n>] [--min-score <n>]
      [--mime <type>] [--since <date>] [--until <date>]
      [--tag <tag>] [--exclude <text>] [--author <name>]
      [--format <table|json|csv|yaml>] [--output <file>]
      [--count] [--verbose] [--parallel]
      "<natural language query>"
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | String | (required) | Natural language search query |
| `--model` | String | `config` | Embedding model (`qwen2-vl:2b`, `mock`, etc.) |
| `--limit` | Integer | 10 | Maximum number of results |
| `--min-score` | Float | 0.0 | Minimum similarity score (0-1) |
| `--mime` | String | none | Filter by MIME type (repeatable) |
| `--since` | Date | none | Only files ingested after this date |
| `--until` | Date | none | Only files ingested before this date |
| `--tag` | String | none | Filter by tag (repeatable) |
| `--exclude` | String | none | Downrank files related to this text |
| `--author` | String | none | Filter by author metadata |
| `--format` | String | `table` | Output format |
| `--output` | String | stdout | Write results to file |
| `--count` | Flag | false | Only show count of results |
| `--verbose` | Flag | false | Show full metadata for each result |
| `--parallel` | Flag | false | Run in parallel mode |
| `--timeout` | Integer | 60 | Query timeout in seconds |

### Examples Quick Reference

```bash
# Basic
kml query "find my tax documents"

# Limit results
kml query "photos" --limit 5

# Filter by type
kml query "code" --mime text/x-rust

# Filter by date
kml query "recent" --since "7 days ago"

# Filter by tag
kml query "work" --tag "important"

# Exclude concepts
kml query "meeting notes" --exclude "canceled"

# JSON output
kml query "everything" --format json

# Count only
kml query "documents" --count

# Mock model (no Ollama needed)
kml query "test" --model mock

# Find similar files
kml similar 7f3a5c91...

# Export results
kml query "tax" --format csv --output tax_results.csv

# Verbose with all filters
kml query "Q4 marketing budget" \
  --mime application/pdf \
  --tag "finance" \
  --since "2025-10-01" \
  --until "2025-12-31" \
  --min-score 0.7 \
  --limit 20 \
  --format json \
  --verbose
```

---

*Next tutorial: [05 — CLI Deep Dive](05-cli-deep-dive.md)*

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
