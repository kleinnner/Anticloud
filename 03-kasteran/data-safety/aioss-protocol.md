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

# Kasteran* — .aioss Protocol
© Lois-Kleinner & 0-1.gg 2026

## Overview

The `.aioss` protocol — Autonomous Immutable Object Storage System — is Kasteran* native storage protocol for secure, immutable, sovereign data storage. It combines object storage semantics with cryptographic guarantees, data sovereignty controls, and autonomous operation.

## Core Concepts

### Objects
Everything in `.aioss` is an object:
- Objects are identified by content-addressed hashes
- Objects are immutable once written
- Objects have metadata and data payloads
- Objects can reference other objects

### Immutability
Once written, objects cannot be modified:
- New versions create new objects
- Version chains track object history
- Deletion is explicit and cryptographic
- Integrity is verified on every read

### Autonomy
Storage nodes operate autonomously:
- No central coordination required
- Peer-to-peer replication
- Automatic conflict resolution
- Self-healing through replication

## Protocol Architecture

```
┌──────────────┐
│  Application │
└──────┬───────┘
       │ .aioss API
┌──────┴───────┐
│  Object Layer│  ───  Content addressing, immutability
├──────────────┤
│  Storage     │  ───  Replication, erasure coding
├──────────────┤
│  Network     │  ───  P2P transport, DHT routing
├──────────────┤
│  Crypto      │  ───  Encryption, signatures, proofs
└──────────────┘
```

## Object Structure

Each `.aioss` object has:
- **Hash**: SHA-256 content hash
- **Type**: Object type identifier
- **Data**: Binary payload
- **Metadata**: Key-value metadata (encrypted)
- **Signature**: Creator signature
- **Timestamp**: Creation time
- **References**: Links to other objects

## Data Sovereignty

`.aioss` provides data sovereignty at the protocol level:

### Region Control
Objects can be tagged with jurisdiction requirements:
```
object.metadata.region = "EU"
object.metadata.jurisdiction = "GDPR"
```

### Replication Policies
```
object.replication = {
    min_copies: 3,
    regions: ["US-EAST", "EU-WEST", "AP-SOUTHEAST"],
    jurisdiction_restricted: true
}
```

### Access Control
Fine-grained access control on every object:
```
object.acl = {
    owner: user_id,
    read: [user_ids...],
    write: [user_ids...],
    admin: [user_ids...]
}
```

## Cryptographic Guarantees

### Integrity
- Content-addressed hashing ensures integrity
- Merkle tree verification for object collections
- Proof of retrievability for storage verification

### Confidentiality
- Objects are encrypted with user keys
- Metadata is encrypted separately
- Access keys are managed through key wrapping

### Non-Repudiation
- Objects are signed by their creator
- Signatures are verifiable by any party
- Timestamps are certified

## Storage Operations

### Write
```
let object = aioss::Object::new(data)
object.encrypt(user_key)
object.sign(user_private_key)
object.set_region("EU")
storage.write(object)
```

### Read
```
let hash = "sha256:abc123..."
let object = storage.read(hash)
object.verify_signature()
let data = object.decrypt(user_key)
```

### Delete
```
storage.delete(hash)
// Cryptographic proof of deletion returned
```

### List
```
storage.list(prefix: "user/123/")
storage.list_by_type(type: "document")
storage.list_by_region(region: "EU")
```

## Replication

- **Erasure coding**: Reed-Solomon for efficient redundancy
- **Geo-replication**: Automatic cross-region replication
- **Consistency**: Eventual consistency with vector clocks
- **Conflict resolution**: Last-writer-wins with history

## Integration

`.aioss` integrates with Kasteran* storage layer:
- Works as a backing store for the file system API
- Provides object storage semantics for databases
- Supports streaming for large objects
- WebDAV interface for compatibility

## Conclusion

The `.aioss` protocol provides autonomous, immutable, sovereign object storage as a native Kasteran* feature. It ensures data integrity, confidentiality, and sovereignty through cryptographic guarantees and programmable replication policies.
