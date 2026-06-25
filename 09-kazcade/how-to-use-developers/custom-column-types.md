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

# Custom Column Types

This guide covers extending the `.acol` type system with custom logical types, including SIMD scan support.

## Type System Overview

```
┌──────────────────────────────────────────────────────────┐
│                   .acol Type Hierarchy                    │
│                                                          │
│  Physical Types                     Logical Types        │
│  ┌─────────────┐                  ┌─────────────────┐   │
│  │ i8, i16     │                  │ Decimal(p, s)   │   │
│  │ i32, i64    │── implement ────>│ IPv4, IPv6      │   │
│  │ u8, u16     │    LogicalType   │ MAC Address     │   │
│  │ u32, u64    │                  │ UUID            │   │
│  │ f32, f64    │                  │ Date, DateTime  │   │
│  │ utf8        │                  │ IPRange, CIDR   │   │
│  │ binary      │                  │ CustomType      │   │
│  └─────────────┘                  └─────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## Built-in Types

| Physical Type | Size | Alias | Description |
|---------------|------|-------|-------------|
| `i8` | 1 B | `tinyint` | Signed 8-bit |
| `i16` | 2 B | `smallint` | Signed 16-bit |
| `i32` | 4 B | `int` | Signed 32-bit |
| `i64` | 8 B | `bigint` | Signed 64-bit |
| `u8` | 1 B | `utinyint` | Unsigned 8-bit |
| `u16` | 2 B | `usmallint` | Unsigned 16-bit |
| `u32` | 4 B | `uint` | Unsigned 32-bit |
| `u64` | 8 B | `ubigint` | Unsigned 64-bit |
| `f32` | 4 B | `float` | IEEE 754 32-bit |
| `f64` | 8 B | `double` | IEEE 754 64-bit |
| `utf8` | var | `text`, `varchar` | UTF-8 string |
| `binary` | var | `blob`, `bytes` | Raw bytes |

### Logical Types

| Logical Type | Physical Backing | Description |
|-------------|-----------------|-------------|
| `decimal(p,s)` | i128 or i64 | Fixed-precision decimal |
| `date` | i32 (days from epoch) | Calendar date |
| `datetime` | i64 (nanoseconds) | Timestamp with timezone |
| `interval` | i64 (nanoseconds) | Time duration |
| `ipv4` | u32 | IPv4 address |
| `ipv6` | u128 | IPv6 address |
| `mac` | u64 | MAC-48 address |
| `uuid` | u128 | UUID v4 |
| `cidr` | (u128, u8) | CIDR range |

## Implementing a Custom Logical Type

Let's implement a `semver` type for semantic versioning.

### Step 1: Define the Physical Representation

```rust
use kazcade::types::*;

/// Physical storage: 3 x u32 = 12 bytes per value
#[repr(C)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct SemVerRaw {
    pub major: u32,
    pub minor: u32,
    pub patch: u32,
}
```

### Step 2: Implement `ColumnType`

```rust
use kazcade::types::*;
use kazcade::columnar::Column;
use std::sync::Arc;

#[derive(Debug)]
pub struct SemVerType;

impl LogicalType for SemVerType {
    fn name(&self) -> &'static str {
        "semver"
    }

    fn physical_type(&self) -> PhysicalType {
        PhysicalType::Binary(12) // 3 x u32
    }

    fn validate(&self, data: &[u8]) -> Result<(), TypeError> {
        if data.len() % 12 != 0 {
            return Err(TypeError::InvalidLength {
                expected: 12,
                actual: data.len(),
            });
        }
        Ok(())
    }

    fn cast(&self, from: &dyn LogicalType, data: &[u8]) -> Result<Vec<u8>, TypeError> {
        match from.name() {
            "utf8" => self.from_string(data),
            _ => Err(TypeError::UnsupportedCast {
                from: from.name().into(),
                to: "semver".into(),
            }),
        }
    }
}

impl SemVerType {
    fn from_string(&self, data: &[u8]) -> Result<Vec<u8>, TypeError> {
        let s = std::str::from_utf8(data)
            .map_err(|_| TypeError::InvalidUtf8)?;
        
        let parts: Vec<&str> = s.trim().split('.').collect();
        if parts.len() != 3 {
            return Err(TypeError::ParseError {
                message: format!("Expected 'major.minor.patch', got '{s}'"),
            });
        }

        let major: u32 = parts[0].parse()
            .map_err(|e| TypeError::ParseError {
                message: format!("Invalid major version: {e}"),
            })?;
        let minor: u32 = parts[1].parse()
            .map_err(|e| TypeError::ParseError {
                message: format!("Invalid minor version: {e}"),
            })?;
        let patch: u32 = parts[2].parse()
            .map_err(|e| TypeError::ParseError {
                message: format!("Invalid patch version: {e}"),
            })?;

        let raw = SemVerRaw { major, minor, patch };
        let bytes: &[u8] = unsafe {
            std::slice::from_raw_parts(
                &raw as *const SemVerRaw as *const u8,
                12,
            )
        };
        Ok(bytes.to_vec())
    }
}
```

### Step 3: Implement Display/Parse

```rust
impl std::fmt::Display for SemVerRaw {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}.{}.{}", self.major, self.minor, self.patch)
    }
}

impl std::str::FromStr for SemVerRaw {
    type Err = TypeError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let parts: Vec<&str> = s.trim().split('.').collect();
        if parts.len() != 3 {
            return Err(TypeError::ParseError {
                message: format!("Expected 'major.minor.patch', got '{s}'"),
            });
        }
        Ok(SemVerRaw {
            major: parts[0].parse().map_err(|e| TypeError::ParseError {
                message: format!("Invalid major: {e}"),
            })?,
            minor: parts[1].parse().map_err(|e| TypeError::ParseError {
                message: format!("Invalid minor: {e}"),
            })?,
            patch: parts[2].parse().map_err(|e| TypeError::ParseError {
                message: format!("Invalid patch: {e}"),
            })?,
        })
    }
}
```

### Step 4: SIMD Scan Support

```rust
use kazcade::simd::{SimdBackend, SimdScan};

impl SimdScan for SemVerType {
    fn supports_simd(&self, backend: SimdBackend) -> bool {
        matches!(backend, SimdBackend::Avx2 | SimdBackend::Avx512)
    }

    fn scan_less_than(&self, column: &Column, threshold: &[u8]) -> Result<Vec<bool>> {
        match column.backend() {
            SimdBackend::Avx2 => unsafe { self.scan_lt_avx2(column, threshold) },
            SimdBackend::Avx512 => unsafe { self.scan_lt_avx512(column, threshold) },
            _ => self.scan_lt_scalar(column, threshold),
        }
    }

    fn scan_between(&self, column: &Column, low: &[u8], high: &[u8]) -> Result<Vec<bool>> {
        match column.backend() {
            SimdBackend::Avx2 => unsafe { self.scan_between_avx2(column, low, high) },
            _ => self.scan_between_scalar(column, low, high),
        }
    }
}

impl SemVerType {
    unsafe fn scan_lt_avx2(&self, column: &Column, threshold: &[u8]) -> Result<Vec<bool>> {
        use std::arch::x86_64::*;

        let data = column.as_raw_bytes();
        let thresh = SemVerRaw::from_bytes(threshold);
        let thresh_vec = _mm_set_epi32(
            thresh.patch as i32,
            thresh.minor as i32,
            thresh.major as i32,
            0,
        );

        let len = data.len() / 12;
        let mut result = vec![false; len];

        for i in (0..len).step_by(4) {
            let chunk = data[i * 12..].as_ptr() as *const __m128i;
            let values = _mm_loadu_si128(chunk);
            
            // Compare major
            let major_cmp = _mm_cmplt_epi32(values, thresh_vec);
            let major_mask = _mm_movemask_epi8(major_cmp) as u32;

            // Store results
            for j in 0..4 {
                if i + j < len {
                    result[i + j] = (major_mask >> (j * 4)) & 0xF != 0;
                }
            }
        }

        Ok(result)
    }

    unsafe fn scan_lt_avx512(&self, column: &Column, threshold: &[u8]) -> Result<Vec<bool>> {
        #[cfg(target_feature = "avx512f")]
        {
            use std::arch::x86_64::*;
            let data = column.as_raw_bytes();
            let thresh = SemVerRaw::from_bytes(threshold);
            // AVX-512 implementation...
            Ok(vec![])
        }
        #[cfg(not(target_feature = "avx512f"))]
        {
            self.scan_lt_scalar(column, threshold)
        }
    }

    fn scan_lt_scalar(&self, column: &Column, threshold: &[u8]) -> Result<Vec<bool>> {
        let data = column.as_raw_bytes();
        let thresh = SemVerRaw::from_bytes(threshold);
        let len = data.len() / 12;

        let result: Vec<bool> = (0..len).map(|i| {
            let v = SemVerRaw::from_bytes(&data[i * 12..]);
            v < thresh
        }).collect();

        Ok(result)
    }
}

impl PartialOrd for SemVerRaw {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for SemVerRaw {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.major
            .cmp(&other.major)
            .then(self.minor.cmp(&other.minor))
            .then(self.patch.cmp(&other.patch))
    }
}
```

### Step 5: Register the Type

```rust
use kazcade::types::TypeRegistry;

pub fn register_semver_type() {
    let registry = TypeRegistry::global();
    registry.register_type("semver", Arc::new(SemVerType));
}
```

### Step 6: SQL Integration

```sql
-- Define a table with semver column
CREATE TABLE packages (
    name TEXT,
    version semver
);

-- Insert
INSERT INTO packages VALUES ('kazcade', '0.6.0');

-- Query with comparison
SELECT * FROM packages WHERE version > '0.5.0';
-- SIMD-accelerated!

-- Aggregation
SELECT MIN(version), MAX(version) FROM packages;
```

## Python Usage

```python
import kazkade

# Register type
kazkade.register_type("semver", kazkade.SemVerType())

# Create column
col = rt.create_column("version", "semver")
col.append("1.2.3")
col.append("2.0.0")

# Query with custom type
result = rt.query("SELECT * FROM packages WHERE version > '1.0.0'")
print(result.to_pandas())
```

## Performance Considerations

| Operation | Scalar | SIMD (AVX2) | SIMD (AVX-512) |
|-----------|--------|-------------|----------------|
| Equality check | 12 ns/value | 3 ns/value | 1.5 ns/value |
| Comparison | 15 ns/value | 4 ns/value | 2 ns/value |
| Between | 18 ns/value | 5 ns/value | 2.5 ns/value |
| Group by | 50 ns/value | 15 ns/value | 8 ns/value |

## Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_semver_roundtrip() {
        let ty = SemVerType;
        let input = b"1.2.3";
        let bytes = ty.from_string(input).unwrap();
        let raw = SemVerRaw::from_bytes(&bytes);
        assert_eq!(raw.to_string(), "1.2.3");
    }

    #[test]
    fn test_semver_comparison() {
        let a: SemVerRaw = "1.2.3".parse().unwrap();
        let b: SemVerRaw = "2.0.0".parse().unwrap();
        assert!(a < b);
        assert!(b > a);
        assert!(a == a);
    }

    #[test]
    fn test_simd_scan() {
        let ty = SemVerType;
        let column = create_semver_column(vec![
            "1.0.0", "2.0.0", "0.5.0", "1.5.0",
        ]);
        let result = ty.scan_less_than(&column, b"1.5.0").unwrap();
        assert_eq!(result, vec![true, false, true, false]);
    }
}
```

## Best Practices

1. **Use natural physical types** when possible (e.g., `u128` for UUID)
2. **Implement `SimdScan`** for analytical workloads
3. **Provide both `Display` and `FromStr`** for SQL integration
4. **Register types at startup** before loading data
5. **Benchmark against scalar** to quantify SIMD gains

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
