.------------------------------------------------------------------------------.
|                                                                              |
|   +----------------------------------------------------------------------+    |
|   ¦                                                                      ¦    |
|   ¦         HOW-TO-USE DEVELOPERS — DEBUGGING TOOLS                      ¦    |
|   ¦                                                                      ¦    |
|   ¦                    inte11ect — Community Intelligence                 ¦    |
|   ¦                                                                      ¦    |
|   +----------------------------------------------------------------------+    |
|                                                                              |
'------------------------------------------------------------------------------'

---

# inte11ect Developer: Debugging Tools

## Overview

Comprehensive debugging tools and techniques for troubleshooting inte11ect API integrations, SDK usage, and network issues.

## Debugging Commands

```bash
# Verbose API output
curl -v https://api.inte11ect.dev/v1/models \
  -H "Authorization: Bearer TOKEN"

# Trace requests
inte11ect api trace --endpoint /v1/chat

# Debug mode
inte11ect chat --debug --prompt "Hello"

# Log level
inte11ect config set log_level debug

# Inspect responses
inte11ect ask --json "Hello" | jq .

# Network diagnostics
inte11ect api diagnose

# Request replay
inte11ect api replay --request-id req_abc123
```

## API Debugging

### Request Inspection

```bash
# Verbose curl with timing
curl -w "\nTiming: %{time_total}s\nDNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTLS: %{time_appconnect}s\nFirst Byte: %{time_starttransfer}s\n" \
  -H "Authorization: Bearer TOKEN" \
  https://api.inte11ect.dev/v1/models

# Headers only
curl -I https://api.inte11ect.dev/v1/health

# Full response inspection
curl -s -D - https://api.inte11ect.dev/v1/models \
  -H "Authorization: Bearer TOKEN"
```

### Debug SDK Calls

```python
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)
logging.getLogger("inte11ect").setLevel(logging.DEBUG)

client = Inte11ect(api_key="key", debug=True)

# Will log:
# - Request URL and headers
# - Request body
# - Response status and headers
# - Response body
# - Timing information
```

### SDK Debug Middleware

```python
class DebugMiddleware:
    def __init__(self, client):
        self.client = client
        self.original_create = client.chat.completions.create
    
    def patch(self):
        original = self.original_create
        
        async def debug_create(*args, **kwargs):
            print(f"[DEBUG] Request: model={kwargs.get('model')}")
            print(f"[DEBUG] Messages: {len(kwargs.get('messages', []))}")
            
            import time
            start = time.time()
            
            try:
                response = await original(*args, **kwargs)
                duration = time.time() - start
                
                print(f"[DEBUG] Response received in {duration:.2f}s")
                print(f"[DEBUG] Token usage: {response.usage.total_tokens}")
                print(f"[DEBUG] Response: {response.choices[0].message.content[:100]}...")
                
                return response
            except Exception as e:
                duration = time.time() - start
                print(f"[DEBUG] Error after {duration:.2f}s: {e}")
                raise
        
        self.client.chat.completions.create = debug_create

# Usage
client = Inte11ect(api_key="key")
middleware = DebugMiddleware(client)
middleware.patch()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello"}]
)
```

---

## Common Debugging Scenarios

### Scenario 1: 401 Unauthorized

```bash
# Check token validity
curl -s https://api.inte11ect.dev/v1/me \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .

# Decode JWT to check expiry
echo "YOUR_TOKEN" | cut -d"." -f2 | base64 -d 2>/dev/null | jq .

# Expected output shows "exp" timestamp
```

**Troubleshooting**:
1. Verify API key is set correctly in environment
2. Check API key hasn't expired
3. Ensure no extra whitespace in the token
4. Confirm the API key has the correct permissions
5. Check if IP allowlisting is restricting access

### Scenario 2: 429 Rate Limited

```bash
# Check rate limit headers
curl -s -D - https://api.inte11ect.dev/v1/models \
  -H "Authorization: Bearer TOKEN" 2>&1 | grep -i rate

# Output shows:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 87
# Retry-After: 45
```

**Troubleshooting**:
1. Implement exponential backoff in your code
2. Reduce request frequency
3. Check if you need a higher rate limit plan
4. Batch requests instead of sending individually
5. Use gpt-4o-mini for high-volume tasks

### Scenario 3: Model Not Found

```bash
# List available models
inte11ect models list

# Check model availability
inte11ect models get --name gpt-4o

# If not found, check:
# 1. Tier restrictions
# 2. Regional availability
# 3. Provider status
inte11ect health --check models
```

### Scenario 4: Slow Responses

```python
import time

class PerformanceDebugger:
    def __init__(self, client):
        self.client = client
    
    async def debug_slow_request(self, messages: list):
        timings = {}
        
        start = time.time()
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        timings["total"] = time.time() - start
        
        result = {
            "latency_seconds": timings["total"],
            "model": "gpt-4o-mini",
            "input_tokens": response.usage.prompt_tokens,
            "output_tokens": response.usage.completion_tokens,
            "tokens_per_second": response.usage.completion_tokens / timings["total"],
            "slow_threshold": 5.0
        }
        
        if result["latency_seconds"] > result["slow_threshold"]:
            result["suggestion"] = "Consider using a faster model or reducing prompt size"
        
        return result

    async def debug_streaming_performance(self, messages: list):
        import asyncio
        
        start = time.time()
        first_token_time = None
        token_times = []
        
        stream = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            stream=True
        )
        
        async for chunk in stream:
            if first_token_time is None:
                first_token_time = time.time() - start
            token_times.append(time.time())
        
        total_time = time.time() - start
        
        return {
            "time_to_first_token": first_token_time,
            "total_time": total_time,
            "tokens_received": len(token_times),
            "tokens_per_second": len(token_times) / total_time,
            "time_between_tokens_avg": sum(
                token_times[i] - token_times[i-1] 
                for i in range(1, len(token_times))
            ) / max(len(token_times) - 1, 1)
        }
```

### Scenario 5: Connection Errors

```bash
# Test basic connectivity
curl -v https://api.inte11ect.dev/v1/health

# Test DNS resolution
nslookup api.inte11ect.dev

# Test with explicit IP
curl -H "Host: api.inte11ect.dev" https://<ip-address>/v1/health

# Check firewall
telnet api.inte11ect.dev 443

# Test with different DNS
curl --resolve api.inte11ect.dev:443:<alternative-ip> \
  https://api.inte11ect.dev/v1/health
```

### Scenario 6: JSON Parse Errors

```python
class ResponseValidator:
    def validate_response(self, response_text: str) -> dict:
        import json
        
        # Try direct parse
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            pass
        
        # Try to extract JSON from markdown
        import re
        json_match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass
        
        # Try to find JSON object
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except json.JSONDecodeError:
                pass
        
        raise ValueError("Could not parse JSON from response")
```

---

## Monitoring Dashboard Setup

```javascript
// Custom monitoring dashboard
const dashboard = {
  metrics: [
    {
      name: 'API Error Rate',
      query: 'rate(inte11ect_requests_total{status=~"5.."}[5m])',
      threshold: 0.05,
      severity: 'critical'
    },
    {
      name: 'P99 Latency',
      query: 'histogram_quantile(0.99, rate(inte11ect_request_duration_seconds_bucket[5m]))',
      threshold: 5.0,
      severity: 'warning'
    },
    {
      name: 'Rate Limit Hits',
      query: 'rate(inte11ect_requests_total{status="429"}[5m])',
      threshold: 0.01,
      severity: 'warning'
    },
    {
      name: 'Token Usage',
      query: 'rate(inte11ect_tokens_total[5m])',
      threshold: 1000000,
      severity: 'info'
    },
    {
      name: 'Active Connections',
      query: 'inte11ect_active_connections',
      threshold: 100,
      severity: 'warning'
    }
  ]
};
```

### Prometheus Metrics

```prometheus
# inte11ect API metrics
# HELP inte11ect_requests_total Total API requests
# TYPE inte11ect_requests_total counter
inte11ect_requests_total{method="POST",endpoint="/v1/chat",status="200"} 15000

# HELP inte11ect_request_duration_seconds Request duration
# TYPE inte11ect_request_duration_seconds histogram
inte11ect_request_duration_seconds_bucket{le="0.1"} 5000
inte11ect_request_duration_seconds_bucket{le="1.0"} 12000
inte11ect_request_duration_seconds_bucket{le="5.0"} 14800
inte11ect_request_duration_seconds_bucket{le="+Inf"} 15000

# HELP inte11ect_tokens_total Token usage
# TYPE inte11ect_tokens_total counter
inte11ect_tokens_total{type="input"} 5000000
inte11ect_tokens_total{type="output"} 3000000

# HELP inte11ect_active_users Active users
# TYPE inte11ect_active_users gauge
inte11ect_active_users 847
```

---

## Log Analysis Tools

```python
class LogAnalyzer:
    def __init__(self, client):
        self.client = client
    
    async def analyze_error_logs(self, logs: list[str]) -> dict:
        log_text = "\n".join(logs[-100:])  # Last 100 log lines
        
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": f"Analyze these logs and identify:\n1. Error patterns\n2. Root causes\n3. Suggested fixes\n\nLogs:\n{log_text}"
            }]
        )
        
        return {"analysis": response.choices[0].message.content}
    
    async def detect_anomalies(self, metrics: list[dict]) -> list[dict]:
        anomalies = []
        
        for metric in metrics:
            values = [m["value"] for m in metric["data"]]
            avg = sum(values) / len(values)
            std = (sum((v - avg)**2 for v in values) / len(values))**0.5
            
            for point in metric["data"]:
                if abs(point["value"] - avg) > 3 * std:
                    anomalies.append({
                        "metric": metric["name"],
                        "timestamp": point["timestamp"],
                        "value": point["value"],
                        "expected_range": f"{avg - 3*std:.2f} to {avg + 3*std:.2f}"
                    })
        
        return anomalies
```

---

## Debugging Configuration

```yaml
# ~/.inte11ect/config.yaml
debug:
  enabled: true
  log_level: debug  # debug, info, warning, error
  log_format: json  # json, text
  log_file: /var/log/inte11ect/debug.log
  
  tracing:
    enabled: true
    sample_rate: 0.1  # Sample 10% of requests
    export_endpoint: "http://localhost:4318/v1/traces"
  
  metrics:
    enabled: true
    export_endpoint: "http://localhost:9090/metrics"
  
  profiling:
    enabled: false
    duration: 30  # Profile for 30 seconds
```

---

## Debugging Checklist

```markdown
## Debugging Checklist

### Authentication Issues
- [ ] API key is set in environment variable
- [ ] API key has not expired
- [ ] API key has correct permissions
- [ ] No extra whitespace in token header
- [ ] IP is not blocked by allowlist

### Network Issues
- [ ] DNS resolves correctly
- [ ] Port 443 is open
- [ ] No firewall blocking outbound traffic
- [ ] Proxy is configured correctly
- [ ] TLS/SSL certificate is valid

### API Issues
- [ ] Request format matches API spec
- [ ] Content-Type header is correct
- [ ] Rate limits are respected
- [ ] Required parameters are provided
- [ ] Model name is correct

### SDK Issues
- [ ] SDK version is up to date
- [ ] Dependencies are installed
- [ ] Timeout is set appropriately
- [ ] Retry logic is implemented
- [ ] Error handling is in place
```

---

## Performance Benchmarking

```bash
# Basic benchmark
inte11ect benchmark --requests 50 --concurrency 5

# Model comparison benchmark
inte11ect benchmark --models gpt-4o-mini,gpt-4o,claude-3-haiku \
  --requests 100 --concurrency 10

# Custom prompt benchmark
inte11ect benchmark --prompt "Write a short story" \
  --model gpt-4o-mini --requests 20

# Streaming benchmark
inte11ect benchmark --stream --requests 10 --concurrency 2

# Export benchmark results
inte11ect benchmark --output benchmark_results.json \
  --format json
```

### Benchmark Output

```json
{
  "benchmark": {
    "model": "gpt-4o-mini",
    "requests": 50,
    "concurrency": 5,
    "timestamp": "2026-06-19T10:30:00Z",
    "results": {
      "avg_latency_ms": 1250,
      "p50_latency_ms": 1100,
      "p95_latency_ms": 2100,
      "p99_latency_ms": 3500,
      "error_rate": 0.02,
      "throughput_req_per_sec": 8.3,
      "avg_tokens_per_response": 245,
      "tokens_per_second": 196
    }
  }
}
```

---

## Debugging Tools Reference

| Tool | Command | Description |
|---|---|---|
| Health check | `inte11ect health --check` | Verify API status |
| Trace | `inte11ect api trace --endpoint /v1/chat` | Trace API requests |
| Diagnose | `inte11ect api diagnose` | Network diagnostics |
| Benchmark | `inte11ect benchmark` | Performance testing |
| Replay | `inte11ect api replay --request-id req_abc123` | Replay requests |
| Logs | `inte11ect api logs --request-id req_abc123` | View request logs |
| Metrics | `inte11ect api metrics` | View API metrics |

```
Lois-Kleinner and 0-1.gg 2026 — Confidential
```

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com