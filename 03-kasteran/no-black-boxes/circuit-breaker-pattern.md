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

# Kasteran* — Circuit Breaker Pattern
© Lois-Kleinner & 0-1.gg 2026

## Overview

The circuit breaker pattern prevents cascading failures in distributed systems by detecting failures and preventing calls to failing services. Kasteran* provides built-in circuit breaker support as a first-class language feature, enabling graceful degradation, rate limiting, and configurable fail-open or fail-closed behavior.

## Circuit Breaker States

A circuit breaker has three states:

```
                    ┌──────────────┐
                    │   CLOSED     │
                    │ (Normal op)  │
                    └──────┬───────┘
                           │ Failure threshold exceeded
                           ▼
                    ┌──────────────┐
                    │    OPEN      │
                    │ (Rejecting)  │
                    └──────┬───────┘
                           │ Timeout elapsed
                           ▼
                    ┌──────────────┐
                    │  HALF-OPEN   │
                    │  (Testing)   │
                    └──────┬───────┘
                     ╱          ╲
                    ╱            ╲
            Success              Failure
              ╱                      ╲
             ▼                        ▼
        ┌──────────┐            ┌──────────┐
        │  CLOSED  │            │   OPEN   │
        └──────────┘            └──────────┘
```

## Usage

### Basic Circuit Breaker
```
let cb = CircuitBreaker::new(
    name: "database",
    threshold: 5,        // Open after 5 failures
    timeout: Duration::seconds(30),  // Try again after 30s
    half_open_max: 3     // Allow 3 test requests
)

// Use circuit breaker to protect a call
let result = cb.call(|| database.query(user_id))
```

### Configuration
```
let cb = CircuitBreaker::config(
    name: "payment-service",
    failure_threshold: 5,
    success_threshold: 2,      // Close after 2 successes in half-open
    timeout: Duration::seconds(60),
    half_open_timeout: Duration::seconds(5),
    window_size: Duration::seconds(120)  // Rolling window
)
```

## Graceful Degradation

When the circuit is open, the system degrades gracefully:

```
let result = cb.call_or_fallback(
    || payment_service.charge(user, amount),
    || cached_balance(user)  // Return cached value
)
```

### Fallback Strategies
```
fallback:
  - cache: return cached/stale data
  - default: return default value
  - queue: queue request for later processing
  - degrade: return reduced functionality response
  - notify: alert operator of circuit open
```

## Rate Limiting

Circuit breakers integrate with rate limiting:

```
let rate_limiter = RateLimiter::new(
    max_requests: 100,
    window: Duration::seconds(60)
)

let cb = CircuitBreaker::new(...)
    .with_rate_limiter(rate_limiter)

// Calls are rate-limited AND circuit-broken
```

## Fail-Open vs Fail-Closed

### Fail-Closed (Default)
When the circuit is open, calls fail immediately:
```
cb.fail_closed(true)
// Returns error immediately when circuit is open
```

### Fail-Open
When the circuit is open, calls proceed anyway:
```
cb.fail_closed(false)
// Proceeds even when circuit is open (less safe)
```

### Smart Fail
```
cb.fail_strategy("smart")
// Non-critical: fail-open
// Critical: fail-closed
// Depends on request type, user, or context
```

## Monitoring

Circuit breakers provide monitoring:

```
cb.metrics()
```

Returns:
- Current state (closed, open, half-open)
- Failure count (current window)
- Success count (current window)
- Last failure timestamp
- Total calls protected
- Average response time

## Distributed Circuit Breaking

Kasteran* supports distributed circuit breaking:

```
let distributed_cb = DistributedCircuitBreaker::new(
    name: "global-db",
    consensus: "raft",  // Use consensus for state
    nodes: ["node1", "node2", "node3"]
)

// All nodes share circuit breaker state
```

## Integration

Circuit breakers integrate with:
- **HTTP clients**: Automatically protect outgoing requests
- **Database connections**: Protect against database failures
- **Service mesh**: Integrate with service mesh circuit breaking
- **Load balancers**: Coordinate with load balancer health checks

## Best Practices

1. Set appropriate thresholds based on normal failure rates
2. Use timeouts to allow recovery
3. Provide meaningful fallbacks
4. Monitor circuit breaker metrics
5. Test circuit breaker behavior
6. Document degradation behavior

## Conclusion

Kasteran* circuit breaker pattern provides built-in support for graceful degradation, rate limiting, and configurable fail-open/closed behavior. This prevents cascading failures and ensures system resilience.
