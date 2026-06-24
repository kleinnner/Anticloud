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

# Kasteran* — Cloud-Native Deployment
© Lois-Kleinner & 0-1.gg 2026

## Overview

Kasteran* applications are designed for cloud-native deployment. The language compiles to native binaries that run on any existing x86 or ARM cloud instance, integrating seamlessly with container orchestration, service meshes, and cloud infrastructure.

## Cloud-Native Principles

Kasteran* supports the twelve-factor app methodology:

1. **Codebase**: One codebase tracked in version control
2. **Dependencies**: Explicitly declared and isolated
3. **Config**: Configuration stored in environment variables
4. **Backing services**: Treated as attached resources
5. **Build, release, run**: Strictly separated stages
6. **Processes**: Stateless, disposable processes
7. **Port binding**: Self-contained services
8. **Concurrency**: Scale out via the process model
9. **Disposability**: Fast startup and graceful shutdown
10. **Dev/prod parity**: Keep development, staging, and production similar
11. **Logs**: Treat logs as event streams
12. **Admin processes**: Run admin/maintenance tasks as one-off processes

## Containerization

Kasteran* produces small, efficient container images:

```
# Dockerfile
FROM scratch
COPY my_app /my_app
EXPOSE 8080
CMD ["/my_app"]
```

Binary size: ~2 MB for a typical HTTP service, resulting in minimal container images.

### Distroless Images
No base OS required:
- No shell, package manager, or utilities
- Minimal attack surface
- Fast pull and startup
- Small storage footprint

## Orchestration

### Kubernetes Integration
Kasteran* provides Kubernetes manifests:
```
apiVersion: v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: my-app:latest
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

### Health Checks
Built-in health endpoints:
```
GET /healthz  # Liveness probe
GET /readyz   # Readiness probe
GET /startupz # Startup probe
```

### Auto-Scaling
Efficient resource usage means:
- Higher density per node
- Faster scale-up (sub-millisecond startup)
- Lower resource requests (64-128MB typical)
- More efficient horizontal pod autoscaling

## Service Mesh

Kasteran* integrates with service meshes:

### mTLS
Mutual TLS for service-to-service communication:
```
let client = HTTP::client()
client.tls("service-a.default.svc.cluster.local")
```

### Observability
Built-in OpenTelemetry support:
- Distributed tracing
- Metrics collection
- Structured logging
- Request correlation

## Cloud Provider Support

Kasteran* deploys to any cloud provider:

### AWS
- **Compute**: EC2, ECS, EKS, Lambda (via WASM)
- **Storage**: S3, EBS, EFS
- **Database**: RDS, DynamoDB, Aurora
- **Networking**: VPC, ALB, API Gateway

### Azure
- **Compute**: VM, AKS, Container Instances, Functions
- **Storage**: Blob, Disk, Files
- **Database**: Cosmos DB, SQL Database, PostgreSQL
- **Networking**: VNet, Load Balancer, Front Door

### GCP
- **Compute**: Compute Engine, GKE, Cloud Run, Cloud Functions
- **Storage**: Cloud Storage, Persistent Disk, Filestore
- **Database**: Cloud SQL, Spanner, Bigtable
- **Networking**: VPC, Cloud LB, Cloud CDN

## Serverless

Kasteran* supports serverless deployment:

### AWS Lambda
- WASM runtime for Lambda
- Cold start: <10ms
- Memory: 128MB minimum
- Duration billing: Minimal per-invocation cost

### Cloudflare Workers
- WASM workers on edge
- Sub-millisecond cold start
- 128MB memory limit
- Global distribution

## Conclusion

Kasteran* cloud-native capabilities enable deployment on any existing cloud infrastructure — x86 or ARM — without requiring new hardware. Small binaries, fast startup, and efficient resource usage make Kasteran* ideal for modern cloud deployment.
