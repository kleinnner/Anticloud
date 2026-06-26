<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Extending SQL

This guide covers custom SQL functions, aggregates, and UDF registration with vectorized execution.

## UDF Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    SQL Query Engine                       │
│                                                          │
│  SQL Text ──> Parser ──> Planner ──> Executor ──> Result│
│                              │                           │
│                              ▼                           │
│                       UDF Registry                       │
│                    ┌─────────────────┐                   │
│                    │ Scalar Functions │                   │
│                    │ Aggregate Funcs  │                   │
│                    │ Window Functions │                   │
│                    │ Table Functions  │                   │
│                    └─────────────────┘                   │
│                              │                           │
│                              ▼                           │
│                    ┌─────────────────┐                   │
│                    │ Vectorized Exec │                   │
│                    │ (SIMD batches)  │                   │
│                    └─────────────────┘                   │
└──────────────────────────────────────────────────────────┘
```

## Built-in Functions

### Scalar Functions

| Function | Description | Example |
|----------|-------------|---------|
| `ABS(x)` | Absolute value | `ABS(-5) → 5` |
| `CEIL(x)` | Ceiling | `CEIL(3.14) → 4` |
| `FLOOR(x)` | Floor | `FLOOR(3.14) → 3` |
| `ROUND(x, d)` | Round to d decimals | `ROUND(3.14159, 2) → 3.14` |
| `POW(x, y)` | Power | `POW(2, 10) → 1024` |
| `SQRT(x)` | Square root | `SQRT(16) → 4` |
| `EXP(x)` | Exponential | `EXP(1) → 2.71828` |
| `LOG(x)` | Natural log | `LOG(2.71828) → 1` |
| `LOG10(x)` | Base-10 log | `LOG10(100) → 2` |
| `SIN(x)` / `COS(x)` / `TAN(x)` | Trigonometry | `SIN(0) → 0` |
| `LENGTH(s)` | String length | `LENGTH('hello') → 5` |
| `UPPER(s)` / `LOWER(s)` | Case conversion | `UPPER('hello') → 'HELLO'` |
| `TRIM(s)` | Whitespace trim | `TRIM(' hello ') → 'hello'` |
| `SUBSTR(s, i, n)` | Substring | `SUBSTR('hello', 2, 3) → 'ell'` |
| `CONCAT(a, b)` | String concat | `CONCAT('ab', 'cd') → 'abcd'` |
| `COALESCE(a, b)` | First non-null | `COALESCE(NULL, 5) → 5` |
| `NULLIF(a, b)` | Null if equal | `NULLIF(5, 5) → NULL` |
| `HASH(x)` | SHA3-256 hash | `HASH('data') → hex string` |
| `TYPEOF(x)` | Type name | `TYPEOF(42) → 'i64'` |

### Aggregate Functions

| Function | Description |
|----------|-------------|
| `COUNT(*)` | Row count |
| `COUNT(DISTINCT x)` | Distinct count |
| `SUM(x)` | Sum |
| `AVG(x)` | Average |
| `MIN(x)` | Minimum |
| `MAX(x)` | Maximum |
| `STDDEV(x)` | Standard deviation |
| `VARIANCE(x)` | Variance |
| `MEDIAN(x)` | Median (approximate) |
| `PERCENTILE(x, p)` | Percentile (approximate) |
| `FIRST(x)` | First value in group |
| `LAST(x)` | Last value in group |
| `ARRAY_AGG(x)` | Collect to array |

### Window Functions

| Function | Description |
|----------|-------------|
| `ROW_NUMBER()` | Row number |
| `RANK()` | Rank with gaps |
| `DENSE_RANK()` | Rank without gaps |
| `LAG(x, n)` | Previous row value |
| `LEAD(x, n)` | Next row value |
| `NTILE(n)` | Bucket assignment |

## Creating Custom Scalar Functions

### Step 1: Define the Function

```rust
use kazcade::sql::*;
use kazcade::types::*;

#[derive(Debug)]
pub struct LevenshteinDistance;

impl ScalarFunction for LevenshteinDistance {
    fn name(&self) -> &str {
        "levenshtein"
    }

    fn description(&self) -> &str {
        "Computes Levenshtein distance between two strings"
    }

    fn return_type(&self, args: &[DataType]) -> Result<DataType> {
        if args.len() != 2 {
            return Err(SqlError::InvalidArgumentCount {
                expected: 2,
                actual: args.len(),
            });
        }
        if args[0] != DataType::Utf8 || args[1] != DataType::Utf8 {
            return Err(SqlError::TypeMismatch {
                expected: "utf8".into(),
                actual: format!("{:?}", args),
            });
        }
        Ok(DataType::I32)
    }

    fn execute_vectorized(&self, args: &[ColumnVector], output: &mut ColumnVector) -> Result<()> {
        let left = args[0].as_utf8()?;
        let right = args[1].as_utf8()?;
        let out = output.as_i32_mut()?;

        for i in 0..left.len() {
            out[i] = self.levenshtein_simd(left[i], right[i]);
        }

        Ok(())
    }
}

impl LevenshteinDistance {
    fn levenshtein_simd(&self, a: &str, b: &str) -> i32 {
        // For short strings, use SIMD-optimized distance
        if a.len() <= 32 || b.len() <= 32 {
            self.short_levenshtein(a, b)
        } else {
            self.standard_levenshtein(a, b)
        }
    }

    fn short_levenshtein(&self, a: &str, b: &str) -> i32 {
        let a_bytes = a.as_bytes();
        let b_bytes = b.as_bytes();
        let (m, n) = (a_bytes.len(), b_bytes.len());

        if m == 0 { return n as i32; }
        if n == 0 { return m as i32; }

        // Use bit-parallel for short strings (Myers' algorithm)
        if m <= 64 {
            return self.myers_bitpar(a_bytes, b_bytes);
        }

        // Fallback to DP
        let mut prev: Vec<usize> = (0..=n).collect();
        let mut curr = vec![0usize; n + 1];

        for i in 1..=m {
            curr[0] = i;
            for j in 1..=n {
                let cost = if a_bytes[i - 1] == b_bytes[j - 1] { 0 } else { 1 };
                curr[j] = std::cmp::min(
                    std::cmp::min(curr[j - 1] + 1, prev[j] + 1),
                    prev[j - 1] + cost,
                );
            }
            std::mem::swap(&mut prev, &mut curr);
        }

        prev[n] as i32
    }

    fn myers_bitpar(&self, a: &[u8], b: &[u8]) -> i32 {
        // Bit-parallel Myers' algorithm
        let m = a.len();
        let n = b.len();
        
        // Build match bitmasks
        let mut match_masks = vec![0u64; 256];
        for (i, &ch) in a.iter().enumerate() {
            match_masks[ch as usize] |= 1u64 << i;
        }

        let mut vp = !0u64;
        let mut vn = 0u64;
        let mut score = m as i32;
        let mut peq: u64;

        for &ch in b {
            peq = match_masks[ch as usize];
            let x = peq | vn;
            let d0 = ((vp + (vp & (peq | vn))) ^ vp) | peq | vn;
            let hp = vn | !(d0 | vp);
            let hn = d0 & vp;

            if hp & (1u64 << (m - 1)) != 0 {
                score += 1;
            }
            if hn & (1u64 << (m - 1)) != 0 {
                score -= 1;
            }

            let shift_hp = (hp << 1) | 1;
            vn = shift_hp & d0;
            vp = (hn << 1) | !(d0 | shift_hp);
        }

        score
    }

    fn standard_levenshtein(&self, a: &str, b: &str) -> i32 {
        // Standard DP for longer strings
        let a_bytes = a.as_bytes();
        let b_bytes = b.as_bytes();
        let (m, n) = (a_bytes.len(), b_bytes.len());
        
        if m == 0 { return n as i32; }
        if n == 0 { return m as i32; }

        let mut prev: Vec<usize> = (0..=n).collect();
        let mut curr = vec![0usize; n + 1];

        for i in 1..=m {
            curr[0] = i;
            for j in 1..=n {
                let cost = if a_bytes[i - 1] == b_bytes[j - 1] { 0 } else { 1 };
                curr[j] = std::cmp::min(
                    std::cmp::min(curr[j - 1] + 1, prev[j] + 1),
                    prev[j - 1] + cost,
                );
            }
            std::mem::swap(&mut prev, &mut curr);
        }

        prev[n] as i32
    }
}
```

### Step 2: Register the Function

```rust
use kazcade::sql::UdfRegistry;

fn register_udfs() {
    let registry = UdfRegistry::global();
    registry.register_scalar(Arc::new(LevenshteinDistance));
}
```

### Step 3: Use in SQL

```sql
SELECT
    name,
    levenshtein(name, 'kazcade') as distance
FROM packages
WHERE levenshtein(name, 'kazcade') <= 3
ORDER BY distance ASC
LIMIT 5;
```

## Custom Aggregate Functions

Let's build a `MODE` (most frequent value) aggregate:

```rust
use std::collections::HashMap;
use kazcade::sql::*;

#[derive(Debug)]
pub struct Mode {
    counts: HashMap<DataValue, i64>,
    best_value: Option<DataValue>,
    best_count: i64,
}

impl AggregateFunction for Mode {
    fn name(&self) -> &str {
        "mode"
    }

    fn description(&self) -> &str {
        "Returns the most frequent value (mode)"
    }

    fn return_type(&self, args: &[DataType]) -> Result<DataType> {
        if args.len() != 1 {
            return Err(SqlError::InvalidArgumentCount {
                expected: 1,
                actual: args.len(),
            });
        }
        Ok(args[0].clone())
    }

    fn create_state(&self) -> Box<dyn AggregateState> {
        Box::new(ModeState {
            counts: HashMap::new(),
        })
    }
}

#[derive(Debug)]
struct ModeState {
    counts: HashMap<DataValue, i64>,
}

impl AggregateState for ModeState {
    fn update(&mut self, args: &[DataValue]) -> Result<()> {
        let val = args[0].clone();
        let entry = self.counts.entry(val).or_insert(0);
        *entry += 1;
        Ok(())
    }

    fn merge(&mut self, other: Box<dyn AggregateState>) -> Result<()> {
        let other = other.as_any().downcast_ref::<ModeState>().unwrap();
        for (val, count) in &other.counts {
            let entry = self.counts.entry(val.clone()).or_insert(0);
            *entry += count;
        }
        Ok(())
    }

    fn finalize(&self) -> Result<DataValue> {
        let best = self.counts.iter()
            .max_by_key(|(_, &c)| c)
            .map(|(v, _)| v.clone())
            .ok_or_else(|| SqlError::EmptyInput("MODE requires at least one row".into()))?;
        Ok(best)
    }
}
```

### Register

```rust
registry.register_aggregate(Arc::new(Mode));
```

### Use

```sql
SELECT
    category,
    MODE(amount) as most_common_amount
FROM transactions
GROUP BY category;
```

## Vectorized UDF Execution

For maximum performance, implement vectorized execution:

```rust
#[derive(Debug)]
pub struct CosineSimilarity;

impl VectorizedFunction for CosineSimilarity {
    fn name(&self) -> &str {
        "cosine_similarity"
    }

    fn execute_vectorized(&self, args: &[&[f64]], output: &mut [f64]) -> Result<()> {
        let a = args[0];
        let b = args[1];
        
        // Process in SIMD-friendly batches
        for chunk in output.chunks_exact_mut(256) {
            self.simd_cosine(&a, &b, chunk);
        }
        Ok(())
    }
}

impl CosineSimilarity {
    #[cfg(target_feature = "avx2")]
    fn simd_cosine(&self, a: &[f64], b: &[f64], out: &mut [f64]) {
        use std::arch::x86_64::*;
        // AVX2 implementation using FMA instructions
        for i in 0..out.len() {
            let av = _mm256_loadu_pd(a.as_ptr().add(i * 4));
            let bv = _mm256_loadu_pd(b.as_ptr().add(i * 4));
            let dot = _mm256_fmadd_pd(av, bv, _mm256_setzero_pd());
            out[i] = /* extract and normalize */;
        }
    }

    #[cfg(not(target_feature = "avx2"))]
    fn simd_cosine(&self, a: &[f64], b: &[f64], out: &mut [f64]) {
        for i in 0..out.len() {
            let dot: f64 = a[i * 4..i * 4 + 4].iter()
                .zip(&b[i * 4..i * 4 + 4])
                .map(|(x, y)| x * y)
                .sum();
            out[i] = dot;
        }
    }
}
```

## Python UDFs

```python
import kazkade

# Register a Python UDF
@kazkade.udf(input_types=[kazkade.Utf8, kazkade.Utf8], return_type=kazkade.I32)
def levenshtein(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if s1[i-1] == s2[j-1] else 1
            dp[i][j] = min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost)
    return dp[m][n]

# Use in query
rt = kazkade.Runtime()
rt.register_udf(levenshtein)
result = rt.query("SELECT name, levenshtein(name, 'kazcade') FROM packages")
```

## UDF Metadata

```rust
impl FunctionMetadata for LevenshteinDistance {
    fn volatility(&self) -> Volatility {
        Volatility::Immutable  // Same inputs → same output
    }

    fn vectorization_support(&self) -> Vectorization {
        Vectorization::Native  // True vectorized execution
    }

    fn cost_estimate(&self) -> CostEstimate {
        CostEstimate {
            cpu_cost_per_row: 50.0,  // nanoseconds
            memory_cost_per_row: 0.0,
            selectivity: 0.5,
        }
    }
}
```

## Testing UDFs

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_levenshtein_sql() {
        let rt = kazcade::Runtime::new().unwrap();
        rt.register_scalar(Arc::new(LevenshteinDistance));

        let result = rt.query(
            "SELECT levenshtein('kitten', 'sitting') as dist"
        ).unwrap();
        
        let dist: i32 = result.column("dist").get(0);
        assert_eq!(dist, 3);
    }
}
```

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
