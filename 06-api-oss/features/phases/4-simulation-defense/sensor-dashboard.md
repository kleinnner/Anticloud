---
title: "Sensor Dashboard"
sidebar_position: 99
description: "Ingests real-time sensor data, visualizes time-series streams, and"
tags: [features]
---

# Sensor Dashboard

## What It Does
Ingests real-time sensor data, visualizes time-series streams, and
triggers
alerts when values cross defined thresholds. Supports multiple
sensor types
and data formats. Every sensor event becomes a graph node that can
trigger
decisions, feed simulations, and link to other entities.

## How It Works
The sensor dashboard module in `ai-oss-gateway/src/sensor.rs`
implements a
real-time sensor data ingestion pipeline. Sensors are defined as
graph nodes
in the SQLite WAL-backed knowledge graph with metadata — type,
units,
location, sampling rate, calibration data. The ingestion pipeline
receives
sensor data via WebSocket on port 3030 (`sensor_data` messages),
REST
endpoints on port 8081, or file ingestion from configured
directories. Raw
time-series data is stored in a columnar format optimized for range
queries,
linked to the sensor's graph node. The threshold engine evaluates
incoming
data against user-defined alert rules — simple thresholds,
rate-of-change
limits, or composite conditions. Alerts are graph events that can
trigger
operations center threads, cascade into World Engine simulations, or
feed
the alert rules module for ML-based anomaly detection. The
SensorDashboardView renders real-time charts (line, bar, gauge)
using
streaming WebSocket data. The Qwen2-VL-2B-Instruct-Q4_K_M.gguf
model on
CUDA can detect complex anomaly patterns in multi-variate sensor
streams.
All sensor data is stored locally in `./data/` with Timescape
temporal
indexing for historical replay. Config is driven by `opencode.json`
under
the `sensors` section. The CLI includes 87 commands with `sensor`
subcommands.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the SensorDashboardView in the browser at port 8081
3. Register sensors in `opencode.json` under the `sensors` section — ID,
   type, units, location
4. Ingest sensor data via `sensor_data` WebSocket messages, REST POST, or
   file drops
5. Configure alert thresholds per sensor via `alert_rule_create` WS message
6. View real-time streaming charts in the dashboard
7. Monitor historical trends with Timescape temporal navigation
8. Review alerts and correlate with other graph events — decisions,
   intelligence, simulations
9. Use the CLI: `api-oss sensor list`, `api-oss sensor data`,
   `api-oss sensor stats`

## The Moat
- A sensor dashboard that operates entirely offline while integrating with a
  knowledge graph means sensor events are not just displayed —
they become
  graph nodes that trigger decisions, feed simulations, and link to
other
  entities
- The threshold engine is just the first line of detection; ML-based anomaly
  detection adds a second layer
- Every sensor event is recorded with full Timescape provenance for temporal
  analysis
- Sensor data can feed directly into Monte Carlo war games and scenario
  simulations
- No competitor offers a local-first, graph-integrated sensor dashboard that
  works in disconnected environments

## Why Choose API-OSS
Palantir has no standalone sensor dashboard product. Google's IoT
Core and
monitoring tools require cloud connectivity. Nvidia has no sensor
dashboard
product. API-OSS provides a complete real-time sensor dashboard that
operates entirely offline, with every sensor event becoming a graph
node
linked to intelligence, decisions, and simulations. For defense
customers,
this means field sensor monitoring in environments with no network
connectivity.

## Competitive Comparison
- **Palantir**: No standalone sensor dashboard product; cloud-dependent
- **Google**: Cloud IoT Core requires internet; per-message pricing; no
  offline operation
- **Nvidia**: No sensor dashboard product
- **Anthropic**: No sensor dashboard product

## Cost-Benefit Analysis
Google Cloud IoT Core charges $0.0045/message — a field deployment
of 1,000
sensors reporting every minute costs ~$2.4M/year in message fees
alone.
Custom SCADA systems cost $100K–$500K for setup plus $50K/year
maintenance.
API-OSS provides unlimited sensor ingestion at zero software cost
— one-time
hardware of ~$3,000. No per-message fees, no cloud infrastructure. A
defense
organization operating 5,000 field sensors saves $3M–$10M/year.
All sensor
data remains local — no cloud exposure of sensitive telemetry or
sensor
locations.

## Applications
- **Consumer**: Home sensor monitoring, IoT dashboard, weather station data
- **Government / Defense**: Field sensor monitoring, perimeter security,
  acoustic/seismic sensor fusion, environmental monitoring in
theater
- **Enterprise**: Industrial IoT monitoring, environmental sensing, facility
  management, process control monitoring
