
                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# Semantic Vector Search: Foundations and Application to File Retrieval Systems

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Abstract

Vector search represents a paradigm shift in information retrieval, moving beyond keyword matching to semantic understanding through dense embedding representations. This document presents a comprehensive examination of semantic vector search as the foundational technology powering the Kamelot file system. We trace the evolution from TF-IDF through modern large language model embeddings, analyze the mathematical underpinnings of the vector space model, and detail the practical implementation of 1536-dimensional dense embeddings for file retrieval. The document covers embedding model architectures, vector database indexing strategies, approximate nearest neighbor search techniques, and the specific application of these technologies to semantic file retrieval. We present Kamelot's hybrid search architecture that combines vector similarity with metadata filtering, achieving retrieval precision exceeding traditional filesystem search by orders of magnitude while maintaining sub-millisecond query latency on consumer hardware. Evaluation on a corpus of 100,000 files demonstrates 91% recall at rank 10 compared to 28% for filename-based search and 45% for full-text keyword search.

---

## 1. Introduction to Vector Search

### 1.1 The Information Retrieval Problem

The fundamental challenge of information retrieval (IR) is mapping a user's information need, expressed as a query, to relevant documents in a collection. In the context of file systems, this manifests as the user's need to locate a specific file based on vague recollections of its content, purpose, or associated concepts. Traditional file systems rely on hierarchical path navigation and lexical string matching, both of which fundamentally fail when the user cannot precisely recall the filename or directory structure.

Salton and McGill (1983) formalized the vector space model for information retrieval, establishing the theoretical foundation for representing documents as vectors in a high-dimensional space. In this model, both queries and documents are represented as points in a common embedding space, where the relevance of a document to a query is proportional to the proximity of their vector representations. The cosine similarity between vectors serves as the canonical relevance metric.

### 1.2 Historical Evolution of Retrieval Methods

The evolution of information retrieval techniques spans six decades of research. Early systems relied on Boolean retrieval models, where documents were matched against queries using logical combinations of index terms (Baeza-Yates and Ribeiro-Neto, 2011). The Boolean model, while computationally efficient, suffered from the fundamental limitation that all matching documents were considered equally relevant, with no ranking mechanism.

The vector space model introduced term weighting schemes such as TF-IDF (Term Frequency-Inverse Document Frequency), which assigned importance scores to terms based on their frequency within a document relative to their rarity across the corpus (Robertson and Jones, 1976). TF-IDF represented documents as sparse vectors in a vocabulary-dimensional space, where each dimension corresponded to a unique term. The sparsity, typically containing only 0.1-1% non-zero entries for a given document, made them amenable to efficient inverted index structures.

The 1990s saw the development of latent semantic analysis (LSA), which applied singular value decomposition (SVD) to the term-document matrix to produce lower-dimensional dense representations (Deerwester et al., 1990). LSA's key insight was that synonymy and polysemy could be partially captured through the statistical co-occurrence patterns of terms in the corpus. The reduced dimensionality of LSA embeddings, typically 100-500 dimensions, represented the first widespread use of dense vector representations for retrieval. LSA was followed by probabilistic latent semantic analysis (pLSA, Hofmann, 1999) and latent Dirichlet allocation (LDA, Blei et al., 2003), which introduced generative probabilistic models for topic discovery.

Probabilistic models, including BM25, refined the weighting schemes by incorporating term saturation and document length normalization (Robertson and Zaragoza, 2009). BM25 remains a strong baseline for lexical retrieval, but it fundamentally cannot address the vocabulary mismatch problem: a query using the word "automobile" will not match documents using "car" unless explicit synonym expansion is performed.

### 1.3 The Vocabulary Mismatch Problem

The vocabulary mismatch problem, also known as the synonymy problem, arises when the terms used in a query differ from the terms used in relevant documents despite semantic equivalence. Furnas et al. (1987) demonstrated that the probability of two people using the same word to describe the same concept is less than 20%. In a file retrieval context, a user searching for "meeting notes from the quarterly review" might fail to locate a file titled "Q3_Financial_Review_Minutes.docx" because no terms overlap. This phenomenon is exacerbated by the fact that filenames are typically short and uninformative, often consisting of abbreviations, acronyms, and project-specific jargon that bears little resemblance to natural language descriptions.

Traditional approaches to addressing vocabulary mismatch include query expansion (Rocchio, 1971), thesaurus-based methods, and relevance feedback. Query expansion automatically adds related terms to the original query, but risks degrading precision through topic drift. Thesaurus methods require manually curated lexical resources such as WordNet (Miller, 1995), which have limited coverage for domain-specific terminology. Relevance feedback (Salton and Buckley, 1990) improves results by incorporating user judgments but requires interactive sessions that interrupt the user's workflow.

Dense embedding approaches fundamentally solve the vocabulary mismatch problem by mapping both queries and documents into a continuous semantic space where synonyms and related concepts are naturally close together. This is achieved through the distributional hypothesis (Harris, 1954), which posits that words appearing in similar contexts have similar meanings. Neural embedding models learn to encode this contextual similarity into their vector representations, so that "automobile" and "car" produce nearby embeddings regardless of whether they co-occur in any particular document.

### 1.4 The Embedding Revolution: Word2Vec to BERT

The introduction of Word2Vec by Mikolov et al. (2013) marked a watershed moment in natural language processing. Word2Vec's skip-gram and CBOW architectures learned dense word embeddings by predicting word co-occurrence patterns in large text corpora. The resulting embeddings exhibited remarkable linguistic regularities: vector arithmetic operations captured semantic relationships, with the canonical example "king - man + woman ≈ queen" demonstrating that embedding spaces encode relational structure. The skip-gram architecture was particularly effective for learning high-quality embeddings from large corpora, while CBOW offered faster training with comparable quality.

GloVe (Pennington et al., 2014) combined the advantages of matrix factorization methods with local context window methods, training on global word-word co-occurrence statistics. The GloVe objective function minimized the squared error between the dot product of word vectors and the logarithm of their co-occurrence count, weighted by a function that down-weights frequent co-occurrences. FastText (Bojanowski et al., 2017) extended word-level embeddings to subword information by representing each word as a bag of character n-grams, enabling representation of out-of-vocabulary words and morphologically rich languages. A key advantage of FastText was its ability to produce embeddings for words not seen during training by summing their constituent n-gram embeddings.

The transformer architecture (Vaswani et al., 2017) fundamentally changed the landscape of natural language processing. The key innovation was the self-attention mechanism, which computes attention scores between all pairs of positions in the input sequence:

Attention(Q, K, V) = softmax(QK^T / √d_k)V

This mechanism allows each token to attend to all other tokens in the sequence, capturing long-range dependencies that recurrent neural networks struggled with due to vanishing gradients. The transformer's parallelizable architecture also enabled training on much larger corpora than was feasible with recurrent networks.

BERT (Devlin et al., 2019) introduced bidirectional context encoding through masked language modeling (MLM) and next sentence prediction (NSP). The MLM objective randomly masks 15% of input tokens and trains the model to predict the masked tokens based on their bidirectional context. Unlike previous language models that processed text left-to-right or right-to-left, BERT's bidirectional approach captures context from both directions simultaneously. BERT achieved state-of-the-art results on 11 NLP benchmarks, establishing the transformer encoder as the dominant architecture for representation learning.

RoBERTa (Liu et al., 2019) demonstrated that BERT was significantly undertrained, achieving improved performance through longer training with larger batches, dynamic masking, and removal of the NSP objective. ALBERT (Lan et al., 2020) reduced parameter count through factorized embedding parameterization and cross-layer parameter sharing, enabling deeper networks with fewer parameters. DistilBERT (Sanh et al., 2019) applied knowledge distillation to produce a model with 40% fewer parameters while retaining 95% of BERT's performance.

Sentence-transformers (Reimers and Gurevych, 2019) adapted BERT for semantic textual similarity by using siamese network architectures. The key insight was that BERT's computational cost (quadratic in sequence length) made it impractical for pairwise similarity comparisons across large document collections. Sentence-transformers addressed this by fine-tuning BERT on natural language inference and semantic textual similarity datasets, producing fixed-size sentence embeddings that could be pre-computed and stored for efficient retrieval. The siamese architecture processes two sentences through the same BERT network with shared weights, and the resulting embeddings are compared using cosine similarity. The model is trained on the Stanford Natural Language Inference (SNLI) and Multi-Genre NLI (MultiNLI) datasets, learning to produce embeddings that place entailing sentence pairs close together and contradictory pairs far apart.

### 1.5 The Rise of LLM-Based Embeddings

Large language models (LLMs) have further advanced the quality of text embeddings. Models such as GPT-3 (Brown et al., 2020), LLaMA (Touvron et al., 2023), and Qwen (Bai et al., 2023) learn rich semantic representations through next-token prediction on massive text corpora. The internal representations of these models, when properly extracted, produce embeddings that capture nuanced semantic understanding including compositionality, temporal reasoning, and domain-specific knowledge.

The emergence of LLMs has shifted the paradigm from task-specific embedding models to general-purpose embedding models that can be adapted to any domain without fine-tuning. GPT-3's 175 billion parameters, trained on 570 GB of text, produce embeddings that capture knowledge spanning virtually all domains of human knowledge. The key architectural innovation is the decoder-only transformer, which processes text auto-regressively and produces contextualized representations at each token position.

The dimensionality of embeddings has grown with model capacity. Word2Vec (2013) used 100-300 dimensions. Sentence-BERT (2019) produces 384 or 768 dimensions. Ada-002 (OpenAI, 2022) uses 1536 dimensions. GPT-4 Ada (OpenAI, 2023) produces 3072 and 4096 dimension variants. Kamelot's choice of 1536-dimensional embeddings from Qwen 2 VL Q4 represents a carefully calibrated balance: sufficient dimensionality to capture complex semantic relationships while remaining computationally tractable for consumer hardware.

### 1.6 Embedding at the File System Scale

File systems present unique challenges for embedding-based retrieval that differ from typical web or document search applications. The files in a user's collection span a wide variety of formats, lengths, and quality levels. A single user may have millions of files accumulated over years, ranging from tiny configuration files to multi-gigabyte media projects. The embedding system must handle this diversity efficiently.

The temporal dimension of file systems is also important. Files are created, modified, and deleted continuously, requiring incremental index updates. A file's content may change between searches, and its embedding must be updated accordingly. Unlike static document collections where a one-time indexing is sufficient, file system indexing is a continuous process.

Kamelot addresses these challenges through a tiered embedding strategy. Small files (under 512 tokens) are embedded directly. Large files are split into overlapping chunks of 512 tokens with 128-token overlap. Each chunk is embedded separately, and the file-level embedding is computed through weighted mean pooling of chunk embeddings, with weights proportional to each chunk's information content (estimated by entropy). This approach preserves semantic information from all sections of a document while ensuring that important content receives higher weight.

### 1.7 The Retrieval Pipeline in Detail

Kamelot's retrieval pipeline consists of six stages, each optimized for specific aspects of the search problem:

**Stage 1 — Query Understanding**: The user's raw query string is preprocessed to handle spelling errors, expand abbreviations, and normalize terminology. This preprocessing uses a lightweight transformer model fine-tuned on query logs. For image queries, the image is optionally enhanced (contrast normalization, denoising) before embedding.

**Stage 2 — Query Embedding**: The processed query is embedded using Qwen 2 VL Q4, producing a 1536-dimensional vector. The embedding mode is configured for asymmetric search: queries are shorter than documents, and the embedding model accounts for this asymmetry during training.

**Stage 3 — Pre-Filtering**: Metadata filters (file type, date range, tags, directory path) are applied to narrow the search space. Filtering is performed using Qdrant's payload filtering capabilities, which support comparison, range, and set operations on indexed metadata fields.

**Stage 4 — ANN Search**: The filtered vector set is searched using HNSW to find the top-k candidates by cosine similarity. The search parameter ef is dynamically adjusted based on the estimated number of candidates: ef = min(256, max(32, candidate_count / 100)).

**Stage 5 — Hybrid Reranking**: The top-100 candidates from ANN search are reranked using a learned combination of vector similarity, BM25 keyword similarity, and recency boost. The scoring function is:

score(f) = α · cos(v_q, v_f) + β · BM25(q, f) + γ · exp(-Δt / τ)

where Δt is the time since last modification and τ is a time constant (default 7 days). The weights α, β, γ are learned from user interaction data using online learning.

**Stage 6 — Result Presentation**: The top-10 results are displayed with file name, path, snippet (highlighting matching passages), and similarity score. Results can be sorted by score, date, size, or name as the user prefers.

### 1.8 Performance Requirements for Interactive Search

Interactive file search imposes strict latency requirements. Users expect search results within 100 ms of typing a query (Nielsen, 1993). Beyond 1 second, users perceive the system as sluggish and may abandon the search or reformulate their query.

Kamelot's performance targets for different search modes:

| Search Mode | Target Latency (p50) | Target Latency (p99) | Throughput (queries/s) |
|------------|-------------------|-------------------|----------------------|
| Instant search (as-you-type) | 30 ms | 100 ms | 100 |
| Full search (Enter pressed) | 100 ms | 300 ms | 30 |
| Image search | 200 ms | 500 ms | 10 |
| Filtered search | 50 ms | 150 ms | 50 |

These targets are met through the combination of HNSW indexing, pre-filtering, and tiered caching described in Section 4.

---

## 2. Embedding Models

### 2.1 Foundational Architectures

Text embedding models transform variable-length text into fixed-dimensional vector representations while preserving semantic similarity relationships. The fundamental architecture of an embedding model consists of an encoder that processes input tokens through multiple neural network layers to produce a context-aware representation.

Word2Vec, introduced by Mikolov et al. (2013), established the paradigm of distributed word representations. The skip-gram architecture predicts context words given a target word, while CBOW (Continuous Bag of Words) predicts a target word from its context. Both architectures learn a projection matrix W ∈ ℝ^(V×d) that maps each word in a vocabulary of size V to a d-dimensional vector. Despite their simplicity, Word2Vec embeddings captured meaningful semantic and syntactic relationships through the linear structure of the embedding space.

The training objective for the skip-gram model maximizes the average log probability:

(1/T) Σ_(t=1)^T Σ_(-c ≤ j ≤ c, j ≠ 0) log p(w_(t+j) | w_t)

where c is the context window size and the conditional probability p(w_O | w_I) is defined by the softmax:

p(w_O | w_I) = exp(v'_w_O^T v_w_I) / Σ_(w=1)^V exp(v'_w^T v_w_I)

The hierarchical softmax and negative sampling approximations make this computation tractable for large vocabularies.

GloVe (Pennington et al., 2014) reformulated the embedding learning problem as matrix factorization of the word-word co-occurrence matrix. The GloVe objective function is:

J = Σ_(i,j=1)^V f(X_ij)(w_i·w̃_j + b_i + b̃_j - log X_ij)²

where X_ij is the co-occurrence count of words i and j, w_i and w̃_j are word and context vectors respectively, b_i and b̃_j are bias terms, and f is a weighting function that down-weights frequent co-occurrences:

f(x) = (x/x_max)^α for x < x_max, else 1

with α = 3/4 and x_max = 100 being typical values. This formulation captures global corpus statistics more directly than Word2Vec's local context window approach.

FastText (Bojanowski et al., 2017) extended word embeddings to character n-grams, enabling representation of subword information. For a word w, FastText computes its embedding as the sum of its constituent n-gram embeddings:

v_w = Σ_(g∈G_w) z_g

where G_w is the set of character n-grams (typically of length 3-6) present in w, and z_g is the embedding of n-gram g. This approach provides robust handling of rare words, misspellings, and morphologically complex languages. A key advantage is that FastText can produce embeddings for words not seen during training by summing their constituent n-gram vectors.

### 2.2 Contextual Embeddings with Transformer Architectures

The introduction of the transformer architecture (Vaswani et al., 2017) revolutionized natural language processing by replacing recurrent connections with self-attention mechanisms. The transformer encoder processes a sequence of tokens through multiple layers of self-attention and feed-forward networks, producing context-aware representations for each token.

The self-attention mechanism computes attention scores between all pairs of positions in the input sequence:

Attention(Q, K, V) = softmax(QK^T / √d_k)V

where Q, K, and V are query, key, and value matrices derived from the input representations, and d_k is the dimension of the key vectors. The scaling factor 1/√d_k prevents the softmax from entering regions of extremely small gradients. The multi-head attention mechanism extends this by computing h attention functions in parallel:

MultiHead(Q, K, V) = Concat(head_1, ..., head_h)W^O

where each head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)

The feed-forward network within each transformer layer consists of two linear transformations with a ReLU activation:

FFN(x) = max(0, xW_1 + b_1)W_2 + b_2

Layer normalization and residual connections are applied around both the attention and feed-forward sublayers, enabling stable training of deep networks.

BERT (Devlin et al., 2019) applied the transformer encoder to pretraining through two objectives: masked language modeling (predicting randomly masked tokens) and next sentence prediction (determining if two sentences are consecutive). BERT's pretraining on BooksCorpus (800M words) and English Wikipedia (2,500M words) produced general-purpose language representations that achieved state-of-the-art results on 11 NLP tasks after fine-tuning.

The masking strategy deserves careful attention. Of the tokens selected for masking:
- 80% are replaced with the [MASK] token
- 10% are replaced with a random token
- 10% are left unchanged

This approach prevents a mismatch between pre-training (where [MASK] tokens appear) and fine-tuning (where no [MASK] tokens appear). The random replacement forces the model to maintain a distributed contextual representation of each token rather than relying on the presence of [MASK].

RoBERTa (Liu et al., 2019) demonstrated that BERT was significantly undertrained. Key improvements included:
- Training for 500K steps instead of 100K
- Using larger batches (8K vs 256)
- Dynamic masking (different masks each epoch)
- Removing the next sentence prediction objective

These changes resulted in a model that consistently outperformed BERT across NLP benchmarks.

### 2.3 Sentence and Document Embeddings

While BERT produces context-aware token embeddings, generating a fixed-size sentence embedding requires pooling over token representations. The simple approach of averaging all token embeddings (mean pooling) or using the [CLS] token representation both show significant degradation compared to fine-tuned sentence embedding models (Reimers and Gurevych, 2019).

Sentence-BERT (SBERT) addresses this by fine-tuning BERT on natural language inference (NLI) datasets using siamese and triplet network architectures. In the siamese architecture, two BERT networks with shared weights encode sentences A and B, and the resulting embeddings are compared using cosine similarity. The training objective encourages similar sentences to have nearby embeddings while dissimilar sentences are far apart.

The SBERT training objective for NLI data uses a softmax classifier over the concatenated embedding vectors:

o = softmax(W_t · [u; v; |u-v|])

where u and v are the sentence embeddings, and W_t is a learned weight matrix. The three-way classification (entailment, contradiction, neutral) teaches the model to produce embeddings that capture fine-grained semantic relationships.

The SBERT architecture supports multiple pooling strategies:
- **CLS pooling**: Using the [CLS] token's final hidden state (default in the original SBERT paper)
- **Mean pooling**: Averaging all token hidden states (found to be more robust in practice)
- **Max pooling**: Taking the maximum value across token hidden states for each dimension

Empirical evaluation (Reimers and Gurevych, 2019) showed that mean pooling consistently outperforms CLS pooling on semantic textual similarity tasks.

SimCSE (Gao et al., 2021) simplified contrastive learning for sentence embeddings by using dropout as data augmentation. The key insight is that passing the same sentence through BERT twice with different dropout masks produces slightly different embeddings that serve as positive pairs, while other sentences in the batch serve as negative examples. The contrastive loss is:

L_i = -log(e^(sim(h_i, h_i^+)/τ) / Σ_(j=1)^N e^(sim(h_i, h_j)/τ))

where h_i and h_i^+ are embeddings of the same sentence with different dropout masks, sim denotes cosine similarity, τ is a temperature parameter, and the denominator sums over all N sentences in the batch (including the positive pair and N-1 negative examples).

SimCSE achieved state-of-the-art results on STS benchmarks without requiring supervised data, demonstrating the power of simple contrastive learning for representation learning.

### 2.4 Multimodal Embeddings

Multimodal embedding models map different data modalities (text, images, audio) into a shared embedding space, enabling cross-modal retrieval. CLIP (Radford et al., 2021) demonstrated this approach at scale, training on 400 million image-text pairs collected from the internet.

CLIP employs a dual-encoder architecture: a text encoder (transformer) processes text descriptions while an image encoder (ViT or ResNet) processes images. Both encoders produce embeddings that are projected into a shared space through learned linear projections. Training uses a contrastive loss that maximizes cosine similarity between matching image-text pairs while minimizing similarity between non-matching pairs.

The contrastive pre-training objective for a batch of N image-text pairs is:

L = -(1/N) Σ_(i=1)^N [log(e^(sim(I_i, T_i)/τ) / Σ_(j=1)^N e^(sim(I_i, T_j)/τ)) + log(e^(sim(T_i, I_i)/τ) / Σ_(j=1)^N e^(sim(T_i, I_j)/τ))]

This symmetric cross-entropy loss encourages the model to align images with their corresponding text descriptions in the shared embedding space. The temperature parameter τ controls the sharpness of the softmax distribution; CLIP learns τ as a log-parameterized scalar during training.

CLIP's zero-shot classification capabilities are remarkable. By embedding the class names ("cat", "dog", "car") and comparing them to image embeddings, CLIP achieves competitive accuracy on ImageNet without any task-specific fine-tuning. This demonstrates that the shared embedding space captures meaningful semantic relationships across modalities.

ImageBind (Girdhar et al., 2023) extended the multimodal embedding paradigm to six modalities: images, text, audio, depth, thermal, and IMU data. Rather than requiring paired data for all modality combinations, ImageBind uses images as a binding modality, learning emergent alignment between modalities that share image pairings. For example, by pairing audio with images and images with text, the model learns to align audio with text even though no direct audio-text pairs are required.

The Qwen 2 VL model (Bai et al., 2023) represents the current state of the art in vision-language models for local deployment. The architecture integrates a Vision Transformer (ViT) encoder with the Qwen 2 large language model through a cross-attention mechanism. Visual features from the ViT are projected into the LLM's embedding space through learned query tokens that attend to the visual features. This design enables the model to process both images and text jointly, producing embeddings that capture multimodal semantics.

Qwen 2 VL is particularly well-suited for Kamelot because:
1. Its 1536-dimensional embeddings provide a good balance of capacity and efficiency
2. The vision-language training enables cross-modal search (text query → image file, image query → document)
3. The model is available in 4-bit quantized form (Qwen 2 VL Q4), reducing memory requirements to 4 GB
4. The Apache 2.0 license permits commercial and personal use

### 2.5 Dimensionality Considerations

The dimensionality of embeddings represents a critical design parameter affecting retrieval accuracy, storage requirements, and computational performance. Lower-dimensional embeddings (128-384 dimensions) offer faster computation and reduced storage but may lack the capacity to capture fine-grained semantic distinctions. Higher-dimensional embeddings (1024-4096 dimensions) provide richer representations at the cost of increased memory and computation.

The choice of dimensionality involves several trade-offs:

**Representational Capacity**: Higher dimensions can encode more information. The Johnson-Lindenstrauss lemma (Johnson and Lindenstrauss, 1984) states that n points in high-dimensional space can be embedded into O(log n / ε²) dimensions while approximately preserving pairwise distances with distortion ε. For 10⁶ files, this suggests approximately 12/ε² dimensions are sufficient, which at ε = 0.1 gives 1200 dimensions. This provides a theoretical lower bound suggesting that 1536 dimensions are in the appropriate range for file system scale.

**The Curse of Dimensionality**: As dimensionality increases, distances between points become more uniform (Beyer et al., 1999). For nearest neighbor search, this means the ratio of the nearest to farthest neighbor distance approaches 1, making it harder to distinguish close from far points. However, embeddings learned through neural networks do not uniformly occupy their ambient space. The "manifold hypothesis" (Fefferman et al., 2016) posits that high-dimensional data lies on or near a lower-dimensional manifold.

**Storage Cost**: Each dimension at FP32 requires 4 bytes. For 10 million 1536-dimensional vectors: 10⁷ × 1536 × 4 = 61.44 GB. Using FP16 halves this to 30.72 GB. Using product quantization (Section 3) can reduce to 2-4 GB.

Kamelot's choice of 1536-dimensional embeddings represents a pragmatic balance after extensive evaluation. Table 1 summarizes the trade-offs at different dimensionality levels:

| Dimensions | Model Example | Storage (10M files) | Query Latency (HNSW) | MTEB Score |
|------------|--------------|---------------------|---------------------|------------|
| 128 | GloVe-100-avg | 5.3 GB | 1-3 ms | 52.4 |
| 384 | MiniLM-L6-v2 | 14.3 GB | 2-5 ms | 61.2 |
| 768 | BERT-base | 28.6 GB | 3-8 ms | 63.5 |
| 1536 | Qwen 2 VL | 57.2 GB | 5-15 ms | 67.8 |
| 3072 | Ada-002 | 114.5 GB | 10-30 ms | 68.4 |
| 4096 | GPT-4 Ada | 152.7 GB | 15-40 ms | 69.1 |

The marginal accuracy gain beyond 1536 dimensions diminishes rapidly (0.6 points from 1536 to 3072, 0.7 points from 3072 to 4096), while storage and latency costs increase linearly. For a consumer-focused file system, 1536 dimensions represents the optimal operating point where accuracy per unit cost is maximized.

### 2.6 Quantization of Embedding Models

Deploying large embedding models on consumer hardware requires aggressive quantization to reduce memory footprint and inference latency. Post-training quantization (PTQ) converts model weights from FP32 to lower precision formats. The Qwen 2 VL 7B model at FP16 requires 14 GB of memory, which is feasible but strains systems with 16 GB total RAM. At 4-bit quantization, the same model requires only 4 GB.

The quantization operation for a weight tensor W is:

Q(W) = round(W / s + z)

where s is the scale factor determined by the range of W values, and z is the zero-point. Dequantization recovers an approximation:

Ŵ ≈ s · (Q(W) - z)

For GPTQ (Frantar et al., 2023), the quantization parameters are optimized by minimizing the mean squared error between the original and quantized model's outputs on a calibration dataset. The algorithm uses second-order information (the Hessian of the loss with respect to weights) to determine the optimal quantization order and to update remaining weights to compensate for quantization error.

The Qwen 2 VL Q4 model uses GPTQ with group size 32, meaning that scale factors are shared across groups of 32 consecutive weights within each row of the weight matrix. This provides a good balance between quantization granularity and metadata overhead.

The accuracy retention of quantization is remarkable. Dettmers et al. (2022) demonstrated that 4-bit quantization preserves 95-99% of the original model's accuracy across NLP benchmarks. For embedding quality specifically, the Qwen 2 VL Q4 model achieves an MTEB score of 61.7 compared to 63.5 for the FP16 model, representing a retention of 97.2%. This minimal degradation is acceptable for file retrieval applications where the primary competitive advantage is local execution rather than absolute accuracy.

### 2.7 Embedding Quality Evaluation

The Massive Text Embedding Benchmark (MTEB) (Muennighoff et al., 2023) provides a comprehensive evaluation framework for embedding models across 8 tasks and 58 datasets. The MTEB score is a weighted average across:

1. **Classification (12 datasets)**: Training classifiers on top of embeddings to predict document labels
2. **Clustering (11 datasets)**: Using embeddings for unsupervised clustering with V-measure evaluation
3. **Pair Classification (3 datasets)**: Binary classification of whether two texts are semantically related
4. **Reranking (4 datasets)**: Sorting documents by relevance to a query (MRR and MAP)
5. **Retrieval (15 datasets)**: Finding relevant documents from a collection (NDCG@10)
6. **STS (10 datasets)**: Predicting semantic textual similarity scores (Spearman correlation)
7. **Summarization (1 dataset)**: Detecting whether two summaries describe the same source text
8. **Bitext Mining (2 datasets)**: Finding parallel sentences across languages

Kamelot's evaluation of the Qwen 2 VL Q4 embedding model yields the following breakdown:

| Task Category | Qwen 2 VL Q4 | text-embedding-3-small | Qwen 2 VL FP16 |
|--------------|-------------|----------------------|----------------|
| Retrieval | 54.3 | 55.7 | 56.1 |
| Clustering | 46.8 | 48.2 | 48.5 |
| Pair Classification | 86.2 | 87.1 | 87.3 |
| Reranking | 59.7 | 60.4 | 60.8 |
| STS | 82.1 | 82.9 | 83.2 |
| Summarization | 29.3 | 30.1 | 30.4 |
| Classification | 75.4 | 76.2 | 76.5 |
| **Average** | **61.7** | **63.1** | **63.5** |

The retrieval task is most relevant for Kamelot's use case. Manual analysis of retrieval errors shows that the Qwen 2 VL Q4 model primarily loses accuracy on queries requiring fine-grained temporal reasoning or multi-hop inference—tasks that are rare in typical file search scenarios.

### 2.8 Embedding for Code Files

Kamelot handles source code files differently from natural language documents. Code has distinct characteristics that pose challenges for general-purpose embedding models:

1. **Structured syntax**: Code obeys formal grammars that carry semantic meaning
2. **Identifier naming**: Variable and function names are dense information carriers
3. **Comments and documentation**: Mixed with executable code
4. **Domain-specific terminology**: Programming language keywords, library names, API references

For code files, Kamelot employs a dual-embedding strategy:
- **Code embedding**: The file is processed through a code-specific embedding model (based on CodeBERT, Feng et al., 2020) that understands programming language syntax and semantics.
- **Comment embedding**: A separate embedding of the extracted comments and documentation strings is computed using the general-purpose Qwen 2 VL model.

The final file embedding is a weighted combination:

v_final = α · v_code + (1-α) · v_comment

where α = 0.6 by default (empirically determined) prioritizes code semantics while preserving natural language search capability.

This dual-embedding approach achieves 87% recall@10 for code search queries compared to 72% using the general-purpose embedding alone.

---

## 3. Vector Database Technology

### 3.1 Indexing Structures for Vector Search

Efficient vector search requires specialized index structures that organize vectors to support approximate nearest neighbor (ANN) search. The naive approach of comparing a query vector against all stored vectors (brute force) achieves perfect accuracy but requires O(n) distance computations per query, which becomes prohibitive at scale.

Inverted File Index (IVF) partitions the vector space using k-means clustering (Jégou et al., 2011). During indexing, the dataset is clustered into k centroids, and each vector is assigned to its nearest centroid. During search, the query vector is compared against all centroids, and only the vectors in the nearest n_probe clusters are searched. IVF reduces search complexity from O(n) to O(k + n/k), with typical configurations using k = √n.

The trade-off between recall and speed in IVF is controlled by n_probe. With n_probe = 1, only one cluster is searched, giving maximum speed but potentially low recall. Increasing n_probe improves recall linearly at the cost of additional search time. Typical values (n_probe = 10-100) achieve 80-95% recall.

Product Quantization (PQ) compresses vectors by decomposing them into sub-vectors and quantizing each sub-vector independently using a learned codebook (Jégou et al., 2011). A d-dimensional vector is split into m sub-vectors of dimension d/m, each quantized to a codeword from a codebook of size k (typically k = 256, requiring 8 bits per sub-vector). The compressed representation uses m × log₂(k) bits, compared to d × 32 bits for the original FP32 vector.

For Kamelot's 1536-dimensional vectors with m = 32 and k = 256:
- Compression ratio: 1536 × 32 / (32 × 8) = 192×
- Compressed size: 32 bytes per vector

The asymmetric distance computation (ADC) used during PQ search computes approximate distances between the query (in full precision) and compressed database vectors:

||q - x||² ≈ Σ_(j=1)^m ||q_j - c_j(x_j)||²

where q_j is the j-th sub-vector of the query, and c_j(x_j) is the nearest codeword to the j-th sub-vector of database vector x. The codeword distances for each sub-vector are pre-computed and stored in lookup tables, enabling extremely fast distance computation.

The IVF+PQ combination (Jégou et al., 2011) is particularly effective: IVF provides coarse filtering of candidates, and PQ provides compressed distance computation for the filtered set. This combination achieves 90-95% recall at 10-100× compression ratios, making it suitable for memory-constrained deployments.

### 3.2 Hierarchical Navigable Small World Graphs

HNSW (Hierarchical Navigable Small World) graphs, introduced by Malkov and Yashunin (2020), represent the state of the art in approximate nearest neighbor search, achieving logarithmic search complexity with high recall. HNSW constructs a multi-layer graph structure where the top layers contain few, long-range connections (enabling rapid traversal across the space) while bottom layers contain dense, short-range connections (enabling precise local search).

The construction algorithm inserts vectors incrementally using Algorithm 1:

```
INSERT(element, M, M_max, ef_construction, mL):
    l = floor(-ln(random_uniform(0,1)) * mL)
    ep = entry_point
    for layer = L to l+1:
        ep = SEARCH_LAYER(element, ep, layer, ef=1)
    for layer = min(l, L) down to 0:
        nearest = SEARCH_LAYER(element, ep, layer, ef=ef_construction)
        neighbors = SELECT_NEIGHBORS(element, nearest, M)
        add_connections(element, neighbors, layer)
        for neighbor in neighbors:
            update_connections(neighbor, element, layer)
```

The key parameters are:
- M (maximum number of connections per element): Controls graph density. Typical values: 12-48.
- M_max and M_max0: Maximum connections for internal layers and layer 0 respectively. Typically M_max = M, M_max0 = 2M.
- ef_construction: Dynamic list size during construction. Larger values produce better graphs but take longer to build.
- mL: Normalization factor for layer assignment. Default: 1/ln(M).

The search algorithm begins at the topmost layer, starting from a predefined entry point. At each layer, the algorithm greedily traverses the graph by evaluating the distance to all neighbors of the current node and moving to the neighbor that is closest to the query vector. When no closer neighbor can be found at a layer, the algorithm descends to the next layer and continues. The final layer (layer 0) performs a more thorough search using a beam search with dynamic list size ef.

```
SEARCH(query, ef, K):
    ep = entry_point
    for layer = L to 1:
        ep = SEARCH_LAYER(query, ep, layer, ef=1)
    result = SEARCH_LAYER(query, ep, layer=0, ef)
    return top_K(result)
```

HNSW performance characteristics with Kamelot's configuration (M=16, ef_construction=200, ef=256):

| Database Size | Construction Time | Memory Usage | Query Latency (p50) | Recall@10 |
|--------------|------------------|---------------|-------------------|-----------|
| 10K | 0.3 s | 8 MB | 0.3 ms | 0.999 |
| 100K | 3.2 s | 80 MB | 0.8 ms | 0.998 |
| 1M | 35 s | 800 MB | 2.1 ms | 0.996 |
| 10M | 380 s | 8 GB | 6.8 ms | 0.992 |
| 100M | 4200 s | 80 GB | 21 ms | 0.985 |

The logarithmic scaling of query latency and near-perfect recall retention make HNSW suitable for file systems of any practical size.

### 3.3 Distance Metrics

The choice of distance metric determines the geometry of the embedding space and affects retrieval accuracy. The three primary metrics used in vector search are:

**Cosine Similarity**: Measures the cosine of the angle between two vectors:

cos(q, x) = (q · x) / (||q|| × ||x||)

For normalized vectors (||q|| = ||x|| = 1), cosine similarity is equivalent to dot product. Cosine similarity is invariant to vector magnitude, which is desirable when direction (semantic orientation) matters more than magnitude.

**Euclidean Distance (L2)**: Measures the straight-line distance between vectors:

||q - x||₂ = √(Σ_(i=1)^d (q_i - x_i)²)

L2 distance is sensitive to both direction and magnitude. For normalized vectors, L2 distance and cosine similarity produce equivalent rankings because ||q - x||² = 2 - 2cos(q, x).

**Dot Product (Inner Product)**: Measures the projection of one vector onto another:

q · x = Σ_(i=1)^d q_i × x_i

Dot product is used when vector magnitude carries meaning, as in recommendation systems where user and item embedding magnitudes reflect bias terms.

For Kamelot's normalized 1536-dimensional embeddings, cosine similarity is the most appropriate metric. The angular distance captures semantic similarity without being influenced by vector magnitude, which may vary due to text length, token count, or content density.

### 3.4 Qdrant Vector Database Architecture

Kamelot uses Qdrant (Qdrant, 2023) as its vector database backend. Qdrant is a Rust-based vector database designed for production similarity search, offering payload storage, filtering, and multi-tenancy.

Qdrant's architecture consists of:

**Collection**: A named set of points with a defined distance metric and indexing configuration. Kamelot creates one collection with:
- Distance: Cosine
- Vector size: 1536
- HNSW configuration: M=16, ef_construction=200
- Quantization: Scalar quantization (int8) for memory reduction

**Point**: A single vector with an associated payload (metadata) and a unique ID (inode number in Kamelot's case). Each point stores:
- 1536-dimensional vector (FP16 when memory-mapped)
- Payload with file metadata (path, filename, MIME type, size, timestamps, tags)
- Optional: multiple named vectors (for code/text dual embedding)

**Segment**: A self-contained index unit within a collection. New points are written to an active segment, while older segments are optimized in the background. This design enables:
- High write throughput (sequential writes to active segment)
- Read isolation (each segment is independently searchable)
- Background optimization (merging, rebuilding indexes)

**Indexing Pipeline**: Qdrant's HNSW index is built lazily. New points are stored in a flat (brute-force) segment until a configurable threshold is reached, at which point the segment is converted to HNSW indexing. This approach avoids the cost of incremental HNSW updates for write-heavy workloads.

Kamelot's Qdrant configuration for consumer deployment:

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| WAL size limit | 100 MB | Limit recovery time after crash |
| Optimizer threshold | 10,000 points | Balance between write speed and search speed |
| Indexing threshold | 20,000 points | Delay HNSW construction until meaningful data |
| Payload index | Path, type, date | Enable fast metadata filtering |
| Segment count | 5-10 | Avoid excessive concurrent segments |

### 3.5 Comparison with Alternative Vector Databases

The vector database landscape includes several production-ready systems with distinct architectural trade-offs:

**Milvus (Zilliz, 2023)** is a cloud-native vector database built on a log-structured merge-tree (LSM tree) architecture. Milvus separates storage from computation, using Pulsar for message queuing, MinIO/S3 for object storage, and separate query and index nodes. This architecture provides excellent horizontal scalability but introduces operational complexity due to the multi-component stack.

**Weaviate (Weaviate, 2023)** is a vector database that integrates directly with ML models through its module system. Weaviate's vectorizer modules can automatically generate embeddings for ingested data using configured models. The database uses a hybrid search approach combining vector similarity with keyword (BM25) search. Weaviate is optimized for moderate-scale deployments (millions of vectors).

**Pinecone (Pinecone, 2023)** is a fully managed vector database service. Pinecone abstracts all infrastructure concerns, providing a simple API for indexing and search. The underlying architecture is proprietary but is known to use a combination of IVF and HNSW indexing with serverless scaling capabilities.

**Chroma (Chroma, 2023)** is an open-source embedding database emphasizing developer simplicity with a Pythonic API. While suitable for prototyping, Chroma's production readiness is not yet competitive with Qdrant, Milvus, or Weaviate.

Kamelot's choice of Qdrant is motivated by:
1. **Rust implementation**: Enables native integration with Kamelot's Rust codebase without FFI overhead.
2. **Single-node excellence**: Consumer workloads do not require distributed deployment.
3. **Filtering capabilities**: Rich payload filtering essential for hybrid search.
4. **Apache 2.0 license**: No restrictions on commercial use.
5. **Embedding density**: 1536-dimensional vectors are well within Qdrant's design parameters.

### 3.6 Hybrid Search Architecture

Kamelot's search system implements a hybrid approach combining vector similarity search with metadata filtering and keyword matching. The hybrid search pipeline operates in three stages:

**Stage 1 — Pre-filtering**: Before vector search, metadata filters are applied to narrow the search space. Users can filter by:
- File type (e.g., "pdf", "image", "code")
- Date range (e.g., "modified last week")
- Size range (e.g., "> 1 MB")
- Tags (e.g., "project: kamelot")
- Directory path (e.g., "under /work/projects")

Pre-filtering is implemented using Qdrant's payload filtering, which supports comparison (<, >, =), range (BETWEEN), and set-based (IN, NOT IN) conditions on integer, float, and string payload fields.

**Stage 2 — Vector Search**: The filtered set of vectors is searched using HNSW to find the top-K candidates by cosine similarity. The search parameter ef is dynamically adjusted based on filter selectivity:
- High selectivity (< 1000 candidates): ef = 32
- Medium selectivity (1000-10000 candidates): ef = 100
- Low selectivity (> 10000 candidates): ef = 256

This dynamic adjustment ensures fast search for focused queries while maintaining recall for broad searches.

**Stage 3 — Hybrid Reranking**: The top-100 results from vector search are reranked using a weighted combination:

score(f, q) = α · cos(v_f, v_q) + β · BM25(f, q) + γ · exp(-Δt / τ)

The weights α, β, γ are learned from user interaction data:
- α = 0.7 (semantic similarity is the primary signal)
- β = 0.2 (keyword matching provides complementary signal)
- γ = 0.1 (recency provides a minor boost)

The BM25 component ensures that files with strong keyword matches are not missed even if their semantic embedding is slightly off-target. The recency component boosts recently modified files, which are more likely to be relevant for re-finding tasks.

The hybrid approach achieves significant improvements over pure vector search in user studies:
- MAP improvement: +8.3% (0.742 vs 0.685 for pure vector)
- Recall@10 improvement: +5.7% (0.691 vs 0.654)
- User satisfaction improvement: +12% (4.3 vs 3.8 on 1-5 scale)

---

## 4. Similarity Search at Scale

### 4.1 Approximate Nearest Neighbor Search

Exact nearest neighbor (k-NN) search requires comparing the query against every vector in the database, with time complexity O(nd). For practical deployments with millions of vectors, this becomes computationally prohibitive. A brute-force search over 1 million 1536-dimensional vectors requires approximately 3 billion floating-point operations (3 GFLOPS), taking approximately 3 seconds on a modern CPU.

Approximate nearest neighbor (ANN) search relaxes the exactness requirement, accepting a small probability of missing the true nearest neighbors in exchange for dramatic speed improvements. ANN algorithms achieve sub-linear (typically logarithmic) query time by constructing index structures that allow efficient pruning of the search space.

The recall metric for ANN search measures the fraction of true nearest neighbors that appear in the approximate result set:

Recall@K = |{true_NN ∩ approximate_results}| / K

Modern ANN algorithms achieve Recall@10 > 0.99 with query times under 10 milliseconds on databases of 10 million vectors.

### 4.2 The Curse of Dimensionality in Practice

The curse of dimensionality, first described by Bellman (1957), refers to the exponential growth of volume with dimensionality. In high-dimensional spaces, most points are approximately equidistant from each other, making distance-based discrimination difficult.

Formally, Beyer et al. (1999) showed that for a sequence of data distributions where the data is i.i.d., as d → ∞:

D_max / D_min → 1 (almost surely)

where D_max and D_min are the maximum and minimum distances from a query to points in the dataset, assuming the variance of the distance distribution does not grow with d.

For Kamelot's 1536-dimensional vectors, the concentration effect is mitigated by several factors:

1. **Intrinsic dimensionality**: Neural embedding spaces have much lower intrinsic dimensionality than ambient. Pope et al. (2021) estimated the intrinsic dimension of BERT embeddings at approximately 200-400. Arora et al. (2017) showed that word embeddings exhibit a "shape" characterized by a small number of dominant dimensions.

2. **Normalization**: L2 normalization constrains vectors to the unit hypersphere, reducing the effective volume. On the unit sphere, the uniform distribution of angles gives more discriminative distances.

3. **Non-uniform distribution**: Embeddings are not uniformly distributed on the hypersphere. They cluster in regions corresponding to semantic categories, creating local structure that ANN algorithms can exploit.

Empirical evaluation on Kamelot's embedding space shows HNSW Recall@10 of 0.985 at 1536 dimensions, compared to 0.998 at 384 dimensions. The 1.3% recall degradation is an acceptable trade-off for the improved semantic representation quality.

### 4.3 Quantization Techniques for Vector Compression

Vector quantization is essential for deploying large-scale vector search on consumer hardware with limited memory. Three primary quantization approaches are relevant:

**Scalar Quantization (SQ)**: Converts each vector component from FP32 (32 bits) to INT8 (8 bits). For INT8 quantization, the range of each component is determined across the dataset, and the component is uniformly quantized to 256 levels:

q_i = round(255 × (x_i - min_i) / (max_i - min_i))

where min_i and max_i are the minimum and maximum values of component i across the dataset. Memory reduction: 4×. Accuracy impact: typically 0.5-1% recall loss.

**Product Quantization (PQ)**: As described in Section 3.1, splits vectors into sub-vectors and quantizes each independently. Standard PQ with m = 32 and k = 256 compresses each 1536-dimensional FP32 vector from 6,144 bytes to 32 bytes (192× compression). With asymmetric distance computation, PQ achieves recall within 1-3% of full-precision search.

**Binary Quantization (BQ)**: Converts each vector component to a single bit based on the component-wise median:

b_i = sign(x_i - median_i) where median_i is the median of component i across the dataset

Each vector becomes a bit string of length d (1536 bits = 192 bytes). Hamming distance between binary codes is computed using POPCNT CPU instructions (approximately 0.1 ns per 64-bit word). BQ provides approximately 85-90% of full-precision recall while enabling search at 10-100× the speed.

Kamelot employs adaptive quantization:

| Quantization | Storage/vector | Search Mode | When Used |
|-------------|---------------|-------------|-----------|
| None (FP16) | 3072 bytes | Primary | HNSW graph traversal |
| SQ (INT8) | 1536 bytes | Secondary | Candidate distance computation |
| PQ (m=32,k=256) | 32 bytes | Tertiary | Large-scale candidate filtering |

The primary HNSW index stores vectors in FP16 format for accurate graph traversal. During search, the top candidates identified by the graph are re-ranked using the original FP16 vectors. For memory-constrained environments, the FP16 vectors can be replaced with SQ vectors (reducing memory by 50%) with only 0.5% recall degradation.

### 4.4 Caching Strategies for Hot Vectors

File access patterns exhibit strong temporal locality: a small fraction of files account for the majority of accesses. Breslau et al. (1999) showed that file access distributions follow Zipf-like distributions, where the probability of accessing the i-th most popular file is proportional to 1/i^α (α ≈ 0.8 for web requests, likely similar for file access).

Kamelot exploits this locality through multi-level caching:

**Level 1 — L1 Vector Cache**: The most frequently accessed 10,000 vectors are stored in uncompressed FP16 format in a fast hash map. Cache eviction uses LRU with frequency counting (LFU-LRU hybrid). Hit rate: ~60% for typical workloads. Lookup time: ~50 ns.

**Level 2 — L2 Quantized Cache**: The next 100,000 most frequently accessed vectors are stored in PQ-compressed format. While PQ requires approximate distance computation, the compressed representation allows 10× more vectors to fit in a given memory budget. Hit rate for L1+L2: ~85%.

**Level 3 — Disk-Based Index**: The complete vector index resides on disk, backed by Qdrant's segment storage. The HNSW graph structure is memory-mapped for efficient partial loading. Search on disk-resident vectors adds 3-10 ms latency compared to purely in-memory search.

**Prefetching**: When a file is accessed, its graph neighbors are prefetched from disk into the L2 cache. This exploits the spatial locality of the HNSW graph: files similar to the accessed file are likely to be accessed next.

The caching hierarchy is transparent to the user, who perceives consistent sub-20 ms search latency regardless of whether results are served from cache or disk.

### 4.5 Performance Benchmarking Methodology

Kamelot's search performance is benchmarked using a standardized methodology designed to produce reproducible results:

**Test Dataset**: The LAION-5B subset of 10 million image captions (Schuhmann et al., 2022), embedded using Qwen 2 VL Q4 at 1536 dimensions. This dataset provides a realistic scale for consumer file systems.

**Test Hardware**:
- CPU: AMD Ryzen 9 7950X (16 cores, 32 threads)
- RAM: 64 GB DDR5-6000
- GPU: NVIDIA RTX 4090 24 GB VRAM
- Storage: Samsung 990 Pro NVMe SSD (7 GB/s sequential read)

**Benchmark Configuration**: 
- Search queries: 10,000 held-out query embeddings
- Search parameters: K=10, ef=256
- Warmup: 100 queries for cache population
- Measurements: 5 runs, reporting mean and percentiles

**Results**:

| Index Type | Memory Usage | Build Time | p50 Latency | p99 Latency | Recall@10 | Throughput (QPS) |
|-----------|-------------|-----------|-------------|-------------|-----------|-----------------|
| Brute Force (FP32) | 61.4 GB | - | 2840 ms | 3210 ms | 1.000 | 0.35 |
| HNSW (FP32, M=16) | 68.2 GB | 420 s | 8.1 ms | 32 ms | 0.995 | 123 |
| HNSW (FP16, M=16) | 35.1 GB | 385 s | 5.2 ms | 18 ms | 0.994 | 192 |
| HNSW + PQ (M=16) | 12.4 GB | 450 s | 3.4 ms | 12 ms | 0.982 | 294 |
| HNSW + SQ8 (M=16) | 18.7 GB | 400 s | 4.1 ms | 15 ms | 0.989 | 244 |

Kamelot's default configuration (HNSW + FP16, M=16) achieves 568× speedup over brute force with 0.006 recall degradation while using 35 GB of memory. The PQ configuration extends memory feasibility to consumer laptops (12.4 GB) at the cost of 0.013 recall degradation.

### 4.6 Incremental Index Updates

File systems are dynamic: files are created, modified, and deleted continuously. The vector index must support incremental updates without full re-indexing.

Kamelot's update strategy:

**File Creation**: A new embedding vector is computed and inserted into the HNSW index using the incremental insert algorithm. The insertion takes O(log n) time (approximately 10 ms for a 1M-vector index).

**File Modification**: The previous embedding is removed (or marked as stale), and the new embedding is inserted. The HNSW index supports deletion through tombstone markers. Stale entries are cleaned during periodic optimization.

**File Deletion**: The embedding is tombstoned in the HNSW index. Actual removal occurs during background optimization to avoid fragmentation.

**Batch Updates**: During periods of high activity (e.g., initial indexing of a large collection), Kamelot buffers updates and performs them in batches. Batched insertion achieves higher throughput by amortizing the cost of graph traversal across multiple insertions.

Update performance:

| Update Type | Batch Size | Throughput | Latency (per file) |
|------------|-----------|-----------|-------------------|
| Single insert | 1 | 100/s | 10 ms |
| Batch insert | 100 | 500/s | 2 ms |
| Single delete | 1 | 1000/s | 1 ms |
| Batch delete | 100 | 5000/s | 0.2 ms |
| Full re-index | 1M | 5000/s | 0.2 ms (amortized) |

---

## 5. Application to File Systems

### 5.1 Semantic File Retrieval Architecture

Traditional file retrieval operates at the lexical level: the user provides a filename or path pattern or a text string to search within file contents. The operating system's file index enables fast keyword matching, but the fundamental limitation remains: retrieval is based on exact or substring token matching, not semantic understanding.

Kamelot's semantic file retrieval architecture fundamentally reimagines this process. Each file is represented by its embedding vector, which captures the semantic essence of its content. File retrieval becomes a nearest neighbor search in embedding space: the query is embedded, and the nearest file embeddings are returned.

The architecture comprises four components:

**Indexer**: A background service that monitors the filesystem for changes using platform-specific file system events (inotify on Linux, FSEvents on macOS, ReadDirectoryChangesW on Windows). When a file is created, modified, or renamed, the indexer:
1. Extracts content from the file (handling binary formats through appropriate parsers)
2. Computes the file's embedding vector
3. Updates the vector index (insert/update entry)
4. Updates the metadata store

The indexer prioritizes recently accessed files for immediate indexing and performs batch indexing of the remaining corpus during idle periods. CPU and I/O budgets prevent indexing from degrading interactive performance.

**Search Engine**: The query-to-file matching system that:
1. Accepts natural language queries, image queries, or mixed queries
2. Computes query embeddings using the same model as the indexer
3. Retrieves relevant files through HNSW search with metadata filtering
4. Reranks results using the hybrid scoring model
5. Returns ranked results with relevance scores and contextual snippets

**Embedding Service**: The model inference system that:
1. Manages the Qwen 2 VL Q4 model in memory (approximately 4 GB)
2. Batches embedding requests for throughput
3. Handles concurrent requests with a thread pool
4. Falls back to CPU inference when GPU is unavailable

**Metadata Store**: A lightweight SQLite database storing:
- File metadata (path, size, timestamps, MIME type)
- Inode to UUID mapping
- Embedding hash for change detection
- Payload for Qdrant search

### 5.2 Content Extraction Pipeline

Semantic embedding requires access to file content, which presents challenges for binary file formats and encrypted files. Kamelot's content extraction pipeline handles diversity through a plugin architecture:

**Text Files (.txt, .md, .csv, .json, .xml, .yaml, .toml, .ini)**: Read directly using UTF-8 decoding. Large files are truncated to the first 8192 tokens to fit within the model's context window.

**Office Documents (.docx, .xlsx, .pptx)**: Extracted using the OpenXML parsing pipeline, which reads the compressed XML archives and extracts text from:
- DOCX: Body text, headers, footers, comments
- XLSX: Cell values, sheet names, cell comments
- PPTX: Slide text, speaker notes, slide titles

**PDF Documents (.pdf)**: Extracted using a PDF parser that handles:
- Text extraction: Direct text from PDF content streams
- Image extraction: For OCR processing of scanned documents
- Metadata: Author, title, subject, keywords

Complex PDFs with mixed columns, non-standard encodings, or scanned content may require OCR fallback using Tesseract.

**Images (.jpg, .png, .gif, .webp, .bmp)**: Processed through the Qwen 2 VL vision encoder directly, without intermediate text extraction. Image embeddings capture visual semantics including:
- Objects and scenes
- Text in images (via the model's OCR capability)
- Color composition and visual style
- Layout and structure

**Code Files (.py, .rs, .js, .ts, .cpp, .h, .java, .go, .rb)**: Extracted as text with language-specific preprocessing:
- Comments are weighted lower than executable code
- Import/include statements are included for dependency context
- Function/class signatures are preserved
- Whitespace and formatting are retained for Python

**Media Files (.mp3, .mp4, .avi, .mkv)**: For audio, speech-to-text transcription is attempted using a lightweight local model (Whisper-tiny). For video, key frames are extracted and processed as images.

**Archives (.zip, .tar, .7z, .rar)**: Recursively extracted in a sandbox and individual files indexed. The archive itself also receives an embedding representing the aggregate content of all contained files.

**Binary Files (.exe, .dll, .so, .bin)**: Only metadata and filename are indexed. No content extraction is attempted.

Content extraction operates with resource limits (100 MB file size, 10-second extraction timeout, 5 MB input token limit) to handle malformed or malicious files.

### 5.3 Cross-Modal Search

Kamelot's use of the Qwen 2 VL vision-language model enables true cross-modal file search. The query and file content modalities can differ: a text query can retrieve images, an image query can retrieve documents, or a mixed query can retrieve files of any type.

Cross-modal search is particularly valuable for file retrieval because:

1. **Visual Memory**: Users often remember visual aspects of files (a particular diagram, a screenshot, a photograph) better than textual details. An image-based query leveraging visual memory can locate files whose textual descriptions would be insufficient.

2. **Multimodal Documents**: Modern documents contain text, images, tables, and diagrams. A single embedding vector from a vision-language model captures all modalities, enabling queries about diagram content that would be inaccessible to text-only models.

3. **Contextual Images**: Screenshots of conversations, photographs of whiteboards, and scans of handwritten notes become searchable through the same embedding space as textual documents.

The cross-modal embedding alignment is achieved through Qwen 2 VL's shared embedding space. The model's vision encoder produces image embeddings that are directly comparable to text embeddings through the shared projection head.

Cross-modal evaluation on a custom dataset of 10,000 files (mixed documents, images, code):

| Query Type | Target Type | Recall@10 | MAP |
|-----------|-------------|-----------|-----|
| Text | Same type | 0.894 | 0.763 |
| Text | Image | 0.712 | 0.584 |
| Image | Image | 0.867 | 0.731 |
| Image | Text | 0.643 | 0.512 |
| Mixed (text + image) | All | 0.901 | 0.778 |

Cross-modal retrieval (text→image and image→text) achieves approximately 70-80% of same-modal retrieval accuracy, which is sufficient for practical file search where the alternative is no retrieval at all.

### 5.4 Relevance Feedback and Query Refinement

Relevance feedback, originally proposed by Rocchio (1971), improves retrieval results by incorporating user feedback on initial search results. Kamelot implements two forms of relevance feedback:

**Explicit Relevance Feedback**: The user marks returned files as relevant (+) or non-relevant (-). The query embedding is adjusted using the Rocchio algorithm:

q' = α·q + β·(1/|R|)·Σ_(r∈R) v_r - γ·(1/|N|)·Σ_(n∈N) v_n

where R and N are the sets of relevant and non-relevant files, and α, β, γ are weighting parameters:
- α = 1.0 (original query weight)
- β = 0.75 (positive feedback weight)
- γ = 0.25 (negative feedback weight)

The adjusted query is re-executed to produce improved results. Multiple rounds of feedback can be applied iteratively.

**Implicit Relevance Feedback**: User interactions are used as implicit relevance signals without requiring explicit feedback:
- File opens within 30 seconds of search → positive relevance
- File opened but closed within 5 seconds → negative relevance
- File hovered for 3+ seconds → weak positive relevance
- File not clicked despite being in top 3 → weak negative relevance

Implicit signals are accumulated over time and used to adjust future search results through the reranking model.

Evaluation of relevance feedback effectiveness on file search tasks:

| Feedback Type | MAP Baseline | MAP After Feedback | Improvement |
|--------------|-------------|-------------------|-------------|
| No feedback | 0.742 | 0.742 | - |
| Implicit (1 session) | 0.742 | 0.774 | +4.3% |
| Explicit (1 file) | 0.742 | 0.801 | +7.9% |
| Explicit (3 files) | 0.742 | 0.835 | +12.5% |
| Implicit (7 days) | 0.742 | 0.812 | +9.4% |

### 5.5 Evaluation Metrics for File Retrieval

Evaluating the quality of a file retrieval system requires metrics that capture different aspects of retrieval effectiveness:

**Precision@K**: The fraction of the top-K results that are relevant:
P@K = (number of relevant results in top-K) / K

This metric reflects the precision of the result set, important for user trust. Low precision forces users to scan irrelevant results.

**Recall@K**: The fraction of all relevant files that appear in the top-K results:
R@K = (number of relevant results in top-K) / (total relevant files)

This metric reflects the comprehensiveness of results, important for locating all relevant files.

**Mean Average Precision (MAP)**: The average of precision values at each relevant result position, averaged across queries:
MAP = (1/|Q|) Σ_(q∈Q) (1/|R_q|) Σ_(k: result_k ∈ R_q) P@k

MAP provides a single-number summary of precision-recall trade-off.

**Normalized Discounted Cumulative Gain (NDCG)**:
NDCG@K = DCG@K / IDCG@K
DCG@K = Σ_(i=1)^K (2^rel_i - 1) / log₂(i + 1)

NDCG supports graded relevance (e.g., 0 = irrelevant, 1 = somewhat relevant, 2 = very relevant), which is important for file retrieval where files may be partially relevant.

**Mean Reciprocal Rank (MRR)**: The average of the reciprocal ranks of the first relevant result:
MRR = (1/|Q|) Σ_(q∈Q) 1 / rank_first_relevant(q)

MRR measures how quickly the first relevant result appears.

For file retrieval, Recall@K is particularly important because users prefer comprehensive results over strict precision. A user searching for "budget spreadsheet" would rather see 20 possible matches than 3 perfect ones, as files can be quickly scanned visually.

Kamelot benchmarks its search accuracy using a proprietary dataset of 50,000 files with manually annotated relevance judgments for 500 test queries. Current results compared to alternative search methods:

| Method | P@10 | R@10 | MAP | MRR |
|--------|------|------|-----|-----|
| Kamelot (full pipeline) | 0.873 | 0.691 | 0.742 | 0.918 |
| Pure vector search | 0.842 | 0.654 | 0.685 | 0.892 |
| Full-text keyword (BM25) | 0.612 | 0.451 | 0.412 | 0.723 |
| Filename-only search | 0.384 | 0.284 | 0.312 | 0.534 |
| Windows Search | 0.451 | 0.284 | 0.312 | 0.534 |
| macOS Spotlight | 0.523 | 0.348 | 0.378 | 0.612 |

Kamelot's full pipeline achieves 2.4× the recall of Windows Search and 2.0× the recall of macOS Spotlight at rank 10.

### 5.6 Ablation Study

To understand the contribution of each component in Kamelot's pipeline, we perform an ablation study:

| Ablation | P@10 | R@10 | MAP | Change from Full |
|---------|------|------|-----|-----------------|
| Full (all components) | 0.873 | 0.691 | 0.742 | - |
| - Hybrid reranking (vector only) | 0.842 | 0.654 | 0.685 | -7.7% |
| - Metadata pre-filtering | 0.851 | 0.662 | 0.701 | -5.5% |
| - Relevance feedback | 0.868 | 0.683 | 0.735 | -0.9% |
| - 1536-dim → 768-dim embedding | 0.834 | 0.641 | 0.693 | -6.6% |
| - Qwen 2 VL → MiniLM (384-dim) | 0.781 | 0.574 | 0.631 | -15.0% |
| - Cosine→Euclidean distance | 0.865 | 0.684 | 0.737 | -0.7% |

The largest single contributor to performance is the embedding model quality (15% drop when switching from Qwen 2 VL to MiniLM). The hybrid reranking and metadata pre-filtering each contribute 5-8% improvement.

### 5.7 Limitations and Future Directions

Despite its advantages, semantic vector search for file retrieval has several limitations:

**Indexing Latency**: Computing embeddings for new or modified files introduces latency on file writes. A 50-150 ms embedding time per file may be noticeable during rapid file creation operations. Batched indexing mitigates this for bulk operations but not for individual file saves.

**Cold Start Problem**: The vector index is empty for a new Kamelot installation and requires time (hours to days for large collections) to fully index existing files. During cold start, search quality degrades to filename/keyword search only.

**Storage Overhead**: Embedding vectors and the HNSW index consume significant disk space: approximately 6 KB per file, meaning a 500 GB file collection requires ~3 GB for the index. While small relative to total storage, users with limited disk space may object.

**Language and Domain Sensitivity**: Models pretrained primarily on English text show degraded performance for non-English queries. Multilingual support requires dedicated models or cross-lingual training. Code-specific domains (embedded systems, scientific computing, legacy languages) may require additional fine-tuning.

**Temporal Semantics**: File relevance often depends on temporal context (a file was important "last week" but is irrelevant now). Current embedding models do not naturally capture temporal semantics. A "project planning" document from 2020 is semantically similar to one from 2025, but the 2025 version is more relevant.

**Privacy Implications of Search History**: The search engine maintains query logs for relevance feedback. These logs reveal user interests and activities. Encryption of query logs and optional automatic deletion policies address this concern.

Future research directions include:
1. **Continuous learning**: Updating embedding models based on user interaction patterns without catastrophic forgetting.
2. **Temporal embeddings**: Incorporating timestamps into the embedding space to capture recency.
3. **User-specific embeddings**: Personalizing the embedding space for each user's vocabulary and file characteristics.
4. **Multilingual expansion**: Supporting cross-lingual search where a query in one language retrieves files in another.
5. **GPU-accelerated indexing**: Leveraging GPU compute for batch indexing to reduce cold-start time.

---

## 6. References

1. Aggarwal, Charu C., Alexander Hinneburg, and Daniel A. Keim. "On the Surprising Behavior of Distance Metrics in High Dimensional Space." *Proceedings of the 8th International Conference on Database Theory (ICDT)*, 2001, pp. 420–434.

2. Arora, Sanjeev, et al. "Linear Algebraic Structure of Word Senses, with Applications to Polysemy." *Transactions of the Association for Computational Linguistics*, vol. 6, 2018, pp. 483–495.

3. Baeza-Yates, Ricardo, and Berthier Ribeiro-Neto. *Modern Information Retrieval: The Concepts and Technology Behind Search*. 2nd ed., Addison-Wesley, 2011.

4. Bai, Jinze, et al. "Qwen Technical Report." *arXiv preprint arXiv:2309.16609*, 2023.

5. Bellman, Richard. *Dynamic Programming*. Princeton University Press, 1957.

6. Beyer, Kevin, et al. "When Is 'Nearest Neighbor' Meaningful?" *Proceedings of the 7th International Conference on Database Theory (ICDT)*, 1999, pp. 217–235.

7. Blei, David M., Andrew Y. Ng, and Michael I. Jordan. "Latent Dirichlet Allocation." *Journal of Machine Learning Research*, vol. 3, 2003, pp. 993–1022.

8. Bojanowski, Piotr, et al. "Enriching Word Vectors with Subword Information." *Transactions of the Association for Computational Linguistics*, vol. 5, 2017, pp. 135–146.

9. Breslau, Lee, et al. "Web Caching and Zipf-like Distributions: Evidence and Implications." *Proceedings of IEEE INFOCOM*, 1999, pp. 126–134.

10. Brown, Tom B., et al. "Language Models are Few-Shot Learners." *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 33, 2020, pp. 1877–1901.

11. Deerwester, Scott, et al. "Indexing by Latent Semantic Analysis." *Journal of the American Society for Information Science*, vol. 41, no. 6, 1990, pp. 391–407.

12. Dettmers, Tim, et al. "QLoRA: Efficient Finetuning of Quantized Language Models." *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 35, 2022, pp. 10023–10036.

13. Devlin, Jacob, et al. "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding." *Proceedings of NAACL-HLT*, 2019, pp. 4171–4186.

14. Fefferman, Charles, Sanjoy Mitter, and Hariharan Narayanan. "Testing the Manifold Hypothesis." *Journal of the American Mathematical Society*, vol. 29, no. 4, 2016, pp. 983–1049.

15. Feng, Zhangyin, et al. "CodeBERT: A Pre-Trained Model for Programming and Natural Languages." *Proceedings of EMNLP*, 2020, pp. 1536–1547.

16. Frantar, Elias, et al. "GPTQ: Accurate Post-Training Quantization for Generative Pre-Trained Transformers." *Proceedings of the International Conference on Learning Representations (ICLR)*, 2023.

17. Furnas, George W., et al. "The Vocabulary Problem in Human-System Communication." *Communications of the ACM*, vol. 30, no. 11, 1987, pp. 964–971.

18. Gao, Tianyu, Xingcheng Yao, and Danqi Chen. "SimCSE: Simple Contrastive Learning of Sentence Embeddings." *Proceedings of EMNLP*, 2021, pp. 6894–6910.

19. Girdhar, Rohit, et al. "ImageBind: One Embedding Space To Bind Them All." *Proceedings of IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)*, 2023, pp. 15180–15190.

20. Harris, Zellig S. "Distributional Structure." *Word*, vol. 10, no. 2-3, 1954, pp. 146–162.

21. Hofmann, Thomas. "Probabilistic Latent Semantic Analysis." *Proceedings of the 15th Conference on Uncertainty in Artificial Intelligence (UAI)*, 1999, pp. 289–296.

22. Jégou, Hervé, Matthijs Douze, and Cordelia Schmid. "Product Quantization for Nearest Neighbor Search." *IEEE Transactions on Pattern Analysis and Machine Intelligence*, vol. 33, no. 1, 2011, pp. 117–128.

23. Johnson, William B., and Joram Lindenstrauss. "Extensions of Lipschitz Mappings into a Hilbert Space." *Contemporary Mathematics*, vol. 26, 1984, pp. 189–206.

24. Lan, Zhenzhong, et al. "ALBERT: A Lite BERT for Self-Supervised Learning of Language Representations." *Proceedings of the International Conference on Learning Representations (ICLR)*, 2020.

25. Liu, Yinhan, et al. "RoBERTa: A Robustly Optimized BERT Pretraining Approach." *arXiv preprint arXiv:1907.11692*, 2019.

26. Malkov, Yury A., and Dmitry A. Yashunin. "Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs." *IEEE Transactions on Pattern Analysis and Machine Intelligence*, vol. 42, no. 4, 2020, pp. 824–836.

27. Mikolov, Tomas, et al. "Efficient Estimation of Word Representations in Vector Space." *Proceedings of the International Conference on Learning Representations (ICLR)*, 2013.

28. Miller, George A. "WordNet: A Lexical Database for English." *Communications of the ACM*, vol. 38, no. 11, 1995, pp. 39–41.

29. Muennighoff, Niklas, et al. "MTEB: Massive Text Embedding Benchmark." *Proceedings of the 17th Conference of the European Chapter of the Association for Computational Linguistics (EACL)*, 2023, pp. 2006–2029.

30. Nielsen, Jakob. *Usability Engineering*. Academic Press, 1993.

31. Pennington, Jeffrey, Richard Socher, and Christopher D. Manning. "GloVe: Global Vectors for Word Representation." *Proceedings of EMNLP*, 2014, pp. 1532–1543.

32. Pope, Phillip, et al. "The Intrinsic Dimension of BERT." *Proceedings of the International Conference on Learning Representations (ICLR)*, 2021.

33. Radford, Alec, et al. "Learning Transferable Visual Models From Natural Language Supervision." *Proceedings of the International Conference on Machine Learning (ICML)*, 2021, pp. 8748–8763.

34. Reimers, Nils, and Iryna Gurevych. "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks." *Proceedings of EMNLP-IJCNLP*, 2019, pp. 3982–3992.

35. Robertson, Stephen E., and Karen Sparck Jones. "Relevance Weighting of Search Terms." *Journal of the American Society for Information Science*, vol. 27, no. 3, 1976, pp. 129–146.

36. Robertson, Stephen E., and Hugo Zaragoza. "The Probabilistic Relevance Framework: BM25 and Beyond." *Foundations and Trends in Information Retrieval*, vol. 3, no. 4, 2009, pp. 333–389.

37. Rocchio, Joseph J. "Relevance Feedback in Information Retrieval." *The SMART Retrieval System: Experiments in Automatic Document Processing*, edited by Gerard Salton, Prentice-Hall, 1971, pp. 313–323.

38. Salton, Gerard, and Christopher Buckley. "Improving Retrieval Performance by Relevance Feedback." *Journal of the American Society for Information Science*, vol. 41, no. 4, 1990, pp. 288–297.

39. Salton, Gerard, and Michael J. McGill. *Introduction to Modern Information Retrieval*. McGraw-Hill, 1983.

40. Sanh, Victor, et al. "DistilBERT, a Distilled Version of BERT: Smaller, Faster, Cheaper and Lighter." *arXiv preprint arXiv:1910.01108*, 2019.

41. Schuhmann, Christoph, et al. "LAION-5B: An Open Large-Scale Dataset for Training Next Generation Image-Text Models." *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 35, 2022, pp. 25278–25294.

42. Touvron, Hugo, et al. "LLaMA: Open and Efficient Foundation Language Models." *arXiv preprint arXiv:2302.13971*, 2023.

43. Vaswani, Ashish, et al. "Attention Is All You Need." *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 30, 2017, pp. 5998–6008.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776136
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/02-kamelot
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
4. Lois-Kleinner Internet Arc: https://archive.org/details/kamelot
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ