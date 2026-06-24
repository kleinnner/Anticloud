---
title: "Glossary 16: Search Glossary"
sidebar_position: 16
description: "Documentation for Glossary 16: Search Glossary"
tags: [glossary]
---

# Glossary 16: Search Glossary

## Terms

### Search Engine
- API-OSS's built-in search system
- Supports full-text, semantic, and hybrid search

### Full-Text Search
- Keyword-based search matching exact terms
- Fast and precise for known terms

### Semantic Search
- Meaning-based search using embeddings
- Finds conceptually related results

### Hybrid Search
- Combined full-text + semantic search with weighted scoring
- API-OSS default search mode

### BM25
- Probabilistic ranking function for full-text search
- Industry standard (used by Lucene, Elasticsearch)

### Embedding Search
- Search by vector similarity (cosine distance)
- Finds results by meaning, not keywords

### Cosine Similarity
- Measure of angle between two vectors
- API-OSS uses for embedding similarity scoring

### Search Index
- Inverted index mapping tokens to documents
- Built automatically during document ingestion

### Index Refresh
- Updating the search index with new/changed documents
- API-OSS supports automatic and manual refresh

### Search Filters
- Metadata filters applied to search results
- Filter by: date range, document type, author, source

### Search Ranking
- Algorithm determining result order
- API-OSS uses hybrid BM25 + embedding scoring

### Search Relevance
- How well results match the query
- Measured by: precision, recall, NDCG (Normalized Discounted Cumulative Gain)

### Search Highlighting
- Showing matched terms in context
- API-OSS returns snippets with highlighted matches

### Faceted Search
- Search with category-based drill-down
- Filter results by metadata facets (type, date, source)

### Fuzzy Search
- Approximate matching (handles typos)
- API-OSS supports edit-distance-based fuzzy search

### Search Analytics
- Tracking what users search for
- Used for: content gap analysis, popular queries, failed searches

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
