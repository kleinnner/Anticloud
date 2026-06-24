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

# Kasteran* — Data Portability
© Lois-Kleinner & 0-1.gg 2026

## Overview

Data portability — the ability to transfer data between systems — is a fundamental user right and a key requirement for avoiding vendor lock-in. Kasteran* provides comprehensive data portability through standardized export formats, API access, and vendor-neutral data representations.

## Export Formats

Kasteran* supports multiple export formats for data portability.

### Standard Formats

#### JSON
```
let exporter = DataExporter::new(user_data)
exporter.to_json("export.json")
// Standard JSON, human-readable
```

#### CSV
```
exporter.to_csv("export.csv")
// Tabular data, spreadsheet-compatible
```

#### Parquet
```
exporter.to_parquet("export.parquet")
// Columnar format, analytics-optimized
```

#### Avro
```
exporter.to_avro("export.avro")
// Row-based, schema-embedded
```

### Machine-Readable Formats

#### Protocol Buffers
```
exporter.to_protobuf("export.pb", schema)
// Compact binary, schema-defined
```

#### FlatBuffers
```
exporter.to_flatbuffers("export.bfbs")
// Zero-copy deserialization
```

### Open Formats
All exports use open, documented formats:
- No proprietary encodings
- Standard schema definitions
- Self-describing where possible
- Versioned format specifications

## API Access

Kasteran* provides RESTful APIs for data access:

### Export API
```
GET /api/v1/users/{id}/export
?format=json|csv|parquet
&scope=profile|documents|settings|all
&since=2026-01-01
```

Response includes:
- Requested data in specified format
- Metadata about the export
- Schema documentation
- Verification hash

### Import API
```
POST /api/v1/users/{id}/import
Content-Type: application/json
Body: [user data in standard format]

Response:
- Import status
- Records processed
- Validation errors
- Rollback capability
```

## Bulk Operations

For large-scale data portability:

```
// Export all users
let job = DataPortability::export_bulk(
    format: "parquet",
    scope: ["profile", "documents"],
    filter: "last_login > 2025-01-01"
)

// Monitor progress
job.status()  // progress percentage
job.download_url()  // When complete
```

## Data Migration

Kasteran* supports data migration between systems:

### Migration Workflow
1. **Extract**: Export data in standard format
2. **Transform**: Convert to target system format
3. **Validate**: Verify data integrity
4. **Load**: Import to target system
5. **Verify**: Confirm successful migration

### Migration Tools
```
kasteran data migrate \
    --source postgres://localhost/mydb \
    --target kasteran-storage:///data \
    --format parquet \
    --verify
```

## Vendor Freedom

Kasteran* ensures vendor freedom through:

### Standard Data Models
- Data models follow industry standards
- No Kasteran*-specific data formats
- Interoperability with other systems
- Forward compatibility

### No Lock-In
- All data is accessible through standard APIs
- No proprietary storage formats
- No exclusive features that prevent migration
- Full data access without Kasteran* runtime (raw data export)

## Verification

Data portability includes integrity verification:

```
// Hash verification
let source_hash = hash(data)
let export_hash = hash(exported_data)
assert source_hash == export_hash

// Schema validation
let schema = Schema::from_file("schema.json")
exported_data.validate(schema)

// Record count verification
assert source.count() == exported.count()
```

## Compliance

Data portability meets regulatory requirements:
- **GDPR Article 20**: Right to data portability
- **CCPA**: Right to know and access
- **LGPD**: Data portability rights
- **California Privacy Rights Act**: Enhanced portability

## Conclusion

Kasteran* provides comprehensive data portability through standardized export formats, API access, and vendor-neutral data representations. Organizations and users can transfer their data freely without lock-in or compatibility concerns.
