---
title: "API Reference 05: JavaScript SDK"
sidebar_position: 5
description: "npm install @your-org/sdk"
tags: [api]
---

# API Reference 05: JavaScript SDK

## Installation

```bash
npm install @your-org/sdk
# or
yarn add @your-org/sdk
# or
pnpm add @your-org/sdk
```

## Client Initialization

```javascript
import { APIOSS } from '@your-org/sdk';

// Basic
const client = new APIOSS({
  apiKey: 'sk-aioss-xxxxxxxxxxxx',
  baseURL: 'http://localhost:8080/v1'
});

// With config
const client = new APIOSS({
  apiKey: process.env.AIOSS_API_KEY,
  baseURL: process.env.AIOSS_BASE_URL || 'http://localhost:8080/v1',
  timeout: 30000,
  maxRetries: 3,
  defaultHeaders: {
    'X-Codex-Id': 'project-alpha'
  }
});
```

## Chat

```javascript
// Basic
const response = await client.chat.completions.create({
  model: 'qwen2.5-7b-q4',
  messages: [{ role: 'user', content: 'Hello!' }]
});
console.log(response.choices[0].message.content);

// With system prompt
const response = await client.chat.completions.create({
  model: 'qwen2.5-7b-q4',
  messages: [
    { role: 'system', content: 'You are a legal assistant specialized in EU contract law.' },
    { role: 'user', content: 'Analyze this clause for GDPR compliance' }
  ],
  temperature: 0.3,
  max_tokens: 4096
});

// Streaming
const stream = await client.chat.completions.create({
  model: 'qwen2.5-7b-q4',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true
});

for await (const chunk of stream) {
  if (chunk.choices[0]?.delta?.content) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
}
```

## Function Calling

```javascript
// Define tools
const tools = [{
  type: 'function',
  function: {
    name: 'graph_search',
    description: 'Search the knowledge graph',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'number', default: 10 }
      },
      required: ['query']
    }
  }
}];

// Execute
const response = await client.chat.completions.create({
  model: 'qwen2.5-7b-q4',
  messages: [{ role: 'user', content: 'Find contradictions in the contract' }],
  tools
});

// Handle tool call
if (response.choices[0].message.tool_calls) {
  const toolCall = response.choices[0].message.tool_calls[0];
  const args = JSON.parse(toolCall.function.arguments);
  
  // Execute the tool
  const result = await graphSearch(args.query);
  
  // Send result back
  const finalResponse = await client.chat.completions.create({
    model: 'qwen2.5-7b-q4',
    messages: [
      { role: 'user', content: 'Find contradictions in the contract' },
      response.choices[0].message,
      { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(result) }
    ]
  });
}
```

## Graph Operations

```javascript
// Search
const results = await client.graph.search('liability cap', { limit: 10 });

// CRUD
const node = await client.graph.get('uuid_insurance_policy');
const newNode = await client.graph.create({
  nodeType: 'Concept',
  label: 'New Clause',
  content: 'Clause 4.3 text here...'
});
await client.graph.link(newNode.id, 'uuid_policy', 'REFERENCES');

// Neighbors
const neighbors = await client.graph.neighbors('uuid_sarah', { depth: 2 });
```

## File Upload

```javascript
import fs from 'fs';

// Ingest a file
const result = await client.documents.ingest('./contract.pdf');
console.log(`Created ${result.nodes_created} nodes`);

// Upload with metadata
const result = await client.documents.ingest('./contract.pdf', {
  codexId: 'project-alpha',
  tags: ['contract', 'msa', '2026'],
  metadata: { department: 'legal' }
});
```

## Event Source / Server-Sent Events

```javascript
// Native EventSource for streaming
const source = new EventSource(
  'http://localhost:8080/v1/chat/completions?stream=true',
  { headers: { Authorization: 'Bearer sk-aioss-xxxxxxxxxxxx' } }
);

source.onmessage = (event) => {
  if (event.data === '[DONE]') {
    source.close();
    return;
  }
  const chunk = JSON.parse(event.data);
  if (chunk.choices[0]?.delta?.content) {
    console.log(chunk.choices[0].delta.content);
  }
};
```

## WebSocket Direct

```javascript
const ws = new WebSocket('ws://localhost:3030/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    api_key: 'sk-aioss-xxxxxxxxxxxx'
  }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  switch (msg.type) {
    case 'token':
      process.stdout.write(msg.content);
      break;
    case 'done':
      console.log('\n--- Done ---');
      break;
    case 'error':
      console.error('Error:', msg.message);
      break;
  }
};
```

## Error Handling

```javascript
import { APIOSSError, RateLimitError, AuthError } from '@your-org/sdk';

try {
  const response = await client.chat.completions.create({...});
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter}s`);
    setTimeout(retry, error.retryAfter * 1000);
  } else if (error instanceof AuthError) {
    console.error('Authentication failed. Check your API key.');
  } else if (error instanceof APIOSSError) {
    console.error(`API Error: ${error.code} - ${error.message}`);
  }
}
```

## TypeScript

```typescript
import { APIOSS, type ChatCompletion, type GraphNode } from '@your-org/sdk';

interface ContractNode extends GraphNode {
  metadata: {
    contract_value: number;
    jurisdiction: string;
  };
}

const client = new APIOSS({ apiKey: 'sk-aioss-xxxxxxxxxxxx' });
const response: ChatCompletion = await client.chat.completions.create({
  model: 'qwen2.5-7b-q4',
  messages: [{ role: 'user', content: 'Hello' }]
});
```

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
