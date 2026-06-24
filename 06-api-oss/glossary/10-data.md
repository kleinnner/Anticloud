---
title: "Glossary 10: Data Glossary"
sidebar_position: 10
description: "Documentation for Glossary 10: Data Glossary"
tags: [glossary]
---

# Glossary 10: Data Glossary

## Terms

### RAG (Retrieval-Augmented Generation)
- Combining document retrieval with model generation
- API-OSS indexes documents and retrieves relevant context for queries

### Embedding
- Dense vector representation of text
- Used for semantic search and similarity comparison

### Vector Database
- Database optimized for storing and searching embeddings
- API-OSS has built-in vector storage (no external DB needed)

### Chunking
- Splitting documents into smaller pieces for indexing
- API-OSS supports: character, token, semantic, recursive chunking

### Chunk Size
- Number of characters/tokens per chunk
- Typical: 256–2048 tokens depending on use case

### Chunk Overlap
- Shared content between adjacent chunks
- Prevents information loss at chunk boundaries

### Indexing
- Process of parsing, chunking, embedding, and storing documents
- API-OSS automatic indexing on document upload

### Full-Text Search
- Keyword-based search over document text
- API-OSS uses BM25 algorithm for full-text search

### Semantic Search
- Meaning-based search using embeddings
- Finds conceptually similar content even without keyword match

### Hybrid Search
- Combined full-text + semantic search
- API-OSS hybrid search balances precision and recall

### BM25
- Ranking function for full-text search
- Industry-standard algorithm (used by Elasticsearch)

### TF-IDF (Term Frequency-Inverse Document Frequency)
- Statistical measure of term importance in a document
- Foundation for BM25 algorithm

### Cosine Similarity
- Measure of similarity between two vectors
- Used in semantic search to compare embeddings

### Document Pipeline
- Automated workflow: upload → parse → chunk → embed → index
- API-OSS pipeline runs in real-time on document ingestion

### Data Ingestion
- Process of importing data into API-OSS
- Supports: file upload, API, webhook, connector, watch directory

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
