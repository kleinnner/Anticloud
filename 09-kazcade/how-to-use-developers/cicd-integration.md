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

# CI/CD Integration

This guide covers integrating Kazkade into CI/CD pipelines with automated benchmarking and data quality checks.

## CI Workflows

### GitHub Actions

#### Benchmark on PR

```yaml
# .github/workflows/benchmark.yml
name: Benchmark
on:
  pull_request:
    paths:
      - 'src/**'
      - 'Cargo.*'

jobs:
  benchmark:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4

      - name: Install Kazkade
        run: |
          curl -LO https://releases.kazcade.io/v0.6.0/kazcade-linux-x86_64.tar.gz
          tar xzf kazcade-linux-x86_64.tar.gz
          echo "$PWD" >> $GITHUB_PATH

      - name: Run benchmarks
        run: |
          kazkade bench --ci --record --output bench-results.json

      - name: Compare with baseline
        run: |
          kazkade bench compare \
            --baseline baseline.json \
            --current bench-results.json \
            --threshold 0.05  # 5% regression threshold

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: benchmark-results-${{ matrix.os }}
          path: bench-results.json

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('bench-results.json', 'utf8'));
            const summary = results.map(r => 
              `| ${r.name} | ${r.throughput_gbps} GB/s | ${r.latency_us} μs |`
            ).join('\n');
            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Benchmark Results\n\n| Benchmark | Throughput | Latency |\n|-----------|-----------|---------|\n${summary}`
            });
```

#### Data Quality Pipeline

```yaml
name: Data Quality
on:
  push:
    paths:
      - 'data/**/*.acol'
      - 'data/**/*.aioss'

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Kazkade
        run: |
          curl -LO https://releases.kazcade.io/v0.6.0/kazcade-linux-x86_64.tar.gz
          tar xzf kazcade-linux-x86_64.tar.gz
          echo "$PWD" >> $GITHUB_PATH

      - name: Verify ledger integrity
        run: |
          for f in data/**/*.aioss; do
            kazkade ledger verify "$f"
          done

      - name: Run data quality checks
        run: |
          kazkade query \
            "SELECT COUNT(*) as cnt FROM data/**/*.acol" \
            --assert "cnt > 0"

          kazkade query \
            "SELECT column_name, null_count FROM pragma_column_stats('data/sales.acol')" \
            --assert "null_count < 0.1 * total_rows"

      - name: Schema validation
        run: |
          kazkade inspect data/sales.acol --assert-schema schema.yml

      - name: Upload verification report
        uses: actions/upload-artifact@v4
        with:
          name: data-quality-report
          path: kazcade-quality-report.json
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - build
  - bench
  - verify
  - deploy

variables:
  KAZCADE_VERSION: "0.6.0"

before_script:
  - curl -LO "https://releases.kazcade.io/v${KAZCADE_VERSION}/kazcade-linux-x86_64.tar.gz"
  - tar xzf "kazcade-linux-x86_64.tar.gz"
  - export PATH="$PWD:$PATH"

bench:
  stage: bench
  script:
    - kazkade bench --ci --record --output bench-results.json
    - kazkade bench compare --baseline baseline.json --current bench-results.json
  artifacts:
    paths:
      - bench-results.json
    reports:
      metrics: bench-results.json

verify-data:
  stage: verify
  script:
    - kazkade ledger verify --batch data/**/*.aioss
    - kazkade query "SELECT COUNT(*) FROM pipeline_events" --assert "COUNT(*) > 0"
```

### Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        KAZCADE_VERSION = '0.6.0'
    }

    stages {
        stage('Install Kazkade') {
            steps {
                sh '''
                    curl -LO https://releases.kazcade.io/v${KAZCADE_VERSION}/kazcade-linux-x86_64.tar.gz
                    tar xzf kazcade-linux-x86_64.tar.gz
                    export PATH="$PWD:$PATH"
                '''
            }
        }

        stage('Benchmark') {
            steps {
                sh 'kazcade bench --ci --record --output bench-results.json'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'bench-results.json'
                    junit 'bench-results-junit.xml'
                }
                regression {
                    unstable('Performance regression detected')
                }
            }
        }

        stage('Data Integrity') {
            steps {
                sh 'kazcade ledger verify --batch data/**/*.aioss'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                sh 'kazcade deploy --target production'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
```

## `kazkade bench --ci` Mode

The `--ci` flag optimizes benchmarking for CI environments:

```bash
kazkade bench --ci [options]
```

### What `--ci` Changes

| Setting | Default | CI Mode |
|---------|---------|---------|
| Warmup iterations | 5 | 2 |
| Measurement iterations | 10 | 3 |
| Dataset size | 100M rows | 10M rows |
| Timeout per bench | 300s | 60s |
| Output format | Human | JSON |
| Error on regression | No | Yes (exit code 1) |

### CI Output (JSON)

```json
{
  "ci": true,
  "timestamp": "2026-06-19T12:00:00Z",
  "runner": "GitHub Actions",
  "commit": "abc123def456",
  "branch": "feature/my-change",
  "benchmarks": [
    {
      "name": "scan_i64",
      "throughput_gbps": 1.25,
      "latency_us": 0.8,
      "cpu": "AMD EPYC 7763",
      "simd": "AVX2",
      "regression": false,
      "baseline_gbps": 1.28,
      "change_pct": -2.3
    }
  ],
  "regression_detected": false,
  "summary": {
    "total": 12,
    "passed": 11,
    "regressed": 1,
    "improved": 0
  }
}
```

## Baseline Management

### Creating a Baseline

```bash
# Record baseline on main branch
kazkade bench --record --output baseline.json
git add baseline.json
git commit -m "bench: update baseline"
```

### Comparing

```bash
kazkade bench compare \
  --baseline baseline.json \
  --current bench-results.json \
  --threshold 0.05  # Alert on 5% regression
```

### Baseline Storage

```yaml
# .github/baseline.yml
version: 1
baselines:
  linux-x86_64-avx2:
    created: 2026-06-01
    commit: abc123
    benchmarks:
      scan_i64: { throughput_gbps: 1.28, std: 0.02 }
      filter_eq: { throughput_gbps: 0.89, std: 0.01 }
      aggregation: { throughput_gbps: 1.10, std: 0.03 }
      join_hash: { throughput_gbps: 0.72, std: 0.02 }
      sort: { throughput_gbps: 0.65, std: 0.02 }
      rasterize: { throughput_gbps: 0.34, std: 0.01 }
      mlp_infer: { throughput_gbps: 1.80, std: 0.04 }

  darwin-arm64-neon:
    created: 2026-06-01
    commit: def456
    benchmarks:
      scan_i64: { throughput_gbps: 0.95, std: 0.02 }
      # ...
```

## Data Quality in CI

### Schema Assertions

```yaml
# schema.yml
files:
  - path: "data/sales.acol"
    columns:
      - name: "id"
        type: "i64"
        nullable: false
        min: 0
      - name: "amount"
        type: "f64"
        nullable: false
        min: 0
        max: 1000000
      - name: "category"
        type: "utf8"
        nullable: false
        cardinality:
          min: 1
          max: 100
      - name: "timestamp"
        type: "i64"
        nullable: false
        recency_max_days: 30
```

### Quality Checks

```bash
# Run assertions
kazkade query --assert "
  SELECT COUNT(*) as null_count
  FROM data/sales.acol
  WHERE amount IS NULL
  HAVING null_count = 0
"

# Check referential integrity
kazkade query --assert "
  SELECT COUNT(*) as orphans
  FROM data/orders.acol o
  LEFT JOIN data/customers.acol c ON o.customer_id = c.id
  WHERE c.id IS NULL
  HAVING orphans = 0
"
```

## Automated Deployment

### Blue/Green Deploy

```yaml
deploy:
  stage: deploy
  script:
    - kazkade deploy blue-green \
        --blue current.acol \
        --green new.acol \
        --health-check "http://localhost:8742/api/v1/health" \
        --rollback-on-failure
```

### Canary Release

```bash
kazkade deploy canary \
  --new-version v0.7.0 \
  --canary-percent 10 \
  --metrics-interval 60 \
  --promote-after "5m" \
  --rollback-on-regression
```

## Environment Matrix

```yaml
bench:
  strategy:
    matrix:
      os: [ubuntu-latest, windows-latest, macos-latest]
      simd: [avx2, avx512, neon]
    exclude:
      - os: macos-latest
        simd: avx512
      - os: windows-latest
        simd: neon
```

## Notifications

```yaml
# Slack notification on regression
- name: Notify on Regression
  if: steps.bench.outputs.regression == 'true'
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "⚠️ Performance regression detected in ${{ github.repository }}@${{ github.ref }}",
        "blocks": [
          { "type": "section", "text": "View details: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}" }
        ]
      }
```

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

