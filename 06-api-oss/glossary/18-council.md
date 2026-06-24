---
title: "Glossary 18: Council Glossary"
sidebar_position: 18
description: "Documentation for Glossary 18: Council Glossary"
tags: [glossary]
---

# Glossary 18: Council Glossary

## Terms

### Council Engine
- Multi-agent orchestration system
- Routes sub-tasks to specialized agents, aggregates results

### Agent
- An AI entity with defined capabilities and role
- API-OSS agents can use tools, access knowledge, make decisions

### Agent Role
- Defined purpose and responsibility of an agent
- Examples: Researcher, Writer, Critic, Coder, Reviewer

### Agent Orchestration
- Coordinating multiple agents to complete a task
- Council Engine manages agent communication

### Voting
- Agents vote on answers to reach consensus
- Supports: majority, weighted, unanimous, ranked-choice

### Consensus
- Agreement among agents on a response
- Configurable threshold (e.g., 3/5 agents agree)

### Debate
- Agents argue different positions
- Council Engine synthesizes strongest arguments

### Specialization
- Each agent has domain expertise
- Examples: legal agent, medical agent, code agent, data agent

### Task Decomposition
- Breaking complex requests into sub-tasks
- Council Engine routes sub-tasks to appropriate agents

### Agent Communication
- How agents share information
- Messages, shared context, voting results

### Aggregation
- Combining agent outputs into final response
- Strategies: vote, merge, summarize, conflict resolution

### Sub-agent
- An agent called by another agent
- Creates hierarchical agent structure

### Agent Pool
- Available agents that can be assigned to tasks
- Dynamically scaled based on workload

### Agent Configuration
- Settings defining agent behavior
- Includes: model, temperature, tools, knowledge base

### Fallback Agent
- Agent used when primary agent fails
- Ensures graceful degradation

### Agent Metrics
- Performance tracking per agent
- Accuracy, latency, usage count, error rate

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
