.------------------------------------------------------------------------------.
|                                                                              |
|   ╔══════════════════════════════════════════════════════════════════════╗    |
|   ║                                                                      ║    |
|   ║         HOW-TO-USE DEVELOPERS — CUSTOM AUTOMATION                    ║    |
|   ║                                                                      ║    |
|   ║                    inte11ect — Community Intelligence                 ║    |
|   ║                                                                      ║    |
|   ╚══════════════════════════════════════════════════════════════════════╝    |
|                                                                              |
'------------------------------------------------------------------------------'

---

# inte11ect Developer: Custom Automation

## Overview

Build custom automation workflows using inte11ect APIs and SDKs. This guide covers common automation patterns including auto-responders, scheduled reports, CI/CD pipelines, event-driven systems, and data processing pipelines.

## Automation Scripts

### Auto-Responder Bot

```python
import asyncio
from inte11ect import Inte11ect

class AutoResponder:
    def __init__(self, api_key: str, webhook_url: str):
        self.client = Inte11ect(api_key=api_key)
        self.webhook_url = webhook_url
    
    async def handle_incoming(self, message: str, context: dict = None):
        messages = []
        if context:
            messages.append({"role": "system", "content": context})
        messages.append({"role": "user", "content": message})
        
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        
        return response.choices[0].message.content
    
    async def run_webhook_server(self):
        from fastapi import FastAPI, Request
        app = FastAPI()
        
        @app.post("/webhook")
        async def webhook(request: Request):
            data = await request.json()
            reply = await self.handle_incoming(data["message"])
            return {"reply": reply}
        
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8080)

    async def handle_batch(self, messages: list[str]) -> list[str]:
        tasks = [self.handle_incoming(msg) for msg in messages]
        return await asyncio.gather(*tasks)
```

### Customer Support Bot

```python
class SupportBot:
    def __init__(self, api_key: str, knowledge_base: dict = None):
        self.client = Inte11ect(api_key=api_key)
        self.kb = knowledge_base or {}
    
    async def handle_ticket(self, ticket: dict) -> str:
        # Check knowledge base first
        if ticket["issue"] in self.kb:
            return self.kb[ticket["issue"]]
        
        # Route to AI
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a support agent. Be helpful and concise."},
                {"role": "user", "content": f"Ticket #{ticket['id']}: {ticket['issue']}"}
            ]
        )
        
        return response.choices[0].message.content
    
    async def analyze_sentiment(self, messages: list[str]) -> dict:
        text = "\n".join(messages)
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": f"Analyze the sentiment of these messages as positive, negative, or neutral:\n{text}"
            }]
        )
        return {"analysis": response.choices[0].message.content}
```

### Scheduled Reports

```python
import schedule
import time
from inte11ect import Inte11ect

class ReportGenerator:
    def __init__(self, api_key: str):
        self.client = Inte11ect(api_key=api_key)
    
    def generate_daily_summary(self, conversations: list):
        text = "\n".join([c["title"] for c in conversations])
        
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": f"Summarize these conversations:\n{text}"
            }]
        )
        return response.choices[0].message.content
    
    def schedule_daily(self, hour: int = 9):
        schedule.every().day.at(f"{hour}:00").do(self.run_report)
        
        while True:
            schedule.run_pending()
            time.sleep(60)

    def generate_weekly_insights(self, conversations: list) -> dict:
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": f"Analyze these conversations and provide:\n1. Key topics discussed\n2. Decisions made\n3. Action items\n4. Trends\n\nConversations:\n{conversations}"
            }]
        )
        return {"report": response.choices[0].message.content}

reporter = ReportGenerator(api_key="your-key")
reporter.schedule_daily(9)
```

---

## CI/CD Automation

```yaml
# .github/workflows/inte11ect-automation.yml
name: Inte11ect Automation
on:
  schedule:
    - cron: "0 9 * * 1"  # Every Monday at 9 AM
  workflow_dispatch:

jobs:
  generate-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install inte11ect-sdk
      - name: Generate weekly report
        run: |
          python scripts/generate_weekly_report.py
        env:
          INTE11ECT_API_KEY: ${{ secrets.INTE11ECT_API_KEY }}
      - name: Commit report
        run: |
          git config user.name "Inte11ect Bot"
          git config user.email "bot@inte11ect.dev"
          git add reports/
          git commit -m "Weekly report $(date +%Y-%m-%d)"
          git push
```

### PR Review Automation

```yaml
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Get diff
        id: diff
        run: |
          git fetch origin ${{ github.base_ref }}
          git diff origin/${{ github.base_ref }}...HEAD > diff.txt
      - name: AI Review
        run: |
          pip install inte11ect-sdk
          python scripts/ai_review.py diff.txt
        env:
          INTE11ECT_API_KEY: ${{ secrets.INTE11ECT_API_KEY }}
      - name: Post review comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              ...context.repo,
              issue_number: context.issue.number,
              body: review
            });
```

### Automated Release Notes

```bash
#!/bin/bash
# generate_release_notes.sh

set -euo pipefail

PREV_TAG=${1:-$(git describe --tags --abbrev=0 HEAD~1)}
CURRENT_TAG=${2:-$(git describe --tags --abbrev=0)}

echo "Generating release notes for $PREV_TAG -> $CURRENT_TAG"

COMMITS=$(git log --oneline "$PREV_TAG..$CURRENT_TAG" | head -50)

inte11ect ask --model gpt-4o-mini --json "
Generate release notes in markdown from these commits:
$COMMITS

Format:
## Features
## Bug Fixes
## Improvements
## Breaking Changes
" > RELEASE_NOTES_$CURRENT_TAG.md

echo "Release notes written to RELEASE_NOTES_$CURRENT_TAG.md"
```

---

## Event-Driven Automation

```python
class EventDrivenAutomation:
    def __init__(self, client, event_bus):
        self.client = client
        self.event_bus = event_bus
        self.handlers = {}
    
    def on(self, event_type: str):
        def decorator(func):
            self.handlers[event_type] = func
            self.event_bus.subscribe(event_type, func)
            return func
        return decorator
    
    async def process_event(self, event: dict):
        handler = self.handlers.get(event["type"])
        if handler:
            return await handler(event["data"])

automation = EventDrivenAutomation(client, event_bus)

@automation.on("message.created")
async def on_message(data):
    content = data["content_preview"]
    if "urgent" in content.lower():
        await notify_team(data["conversation_id"])

@automation.on("export.completed")
async def on_export(data):
    download_url = data["download_url"]
    await process_export(download_url)

@automation.on("error.occurred")
async def on_error(data):
    if data.get("retryable"):
        await retry_operation(data)
    else:
        await escalate_to_team(data)
```

### Webhook-Driven Automation

```python
from fastapi import FastAPI, BackgroundTasks

app = FastAPI()
automation_engine = EventDrivenAutomation(client, event_bus)

@app.post("/automation-webhook")
async def handle_automation_event(data: dict, background_tasks: BackgroundTasks):
    background_tasks.add_task(automation_engine.process_event, data)
    return {"status": "processing"}
```

---

## Data Pipeline Automation

```python
class DataPipeline:
    def __init__(self, client):
        self.client = client
    
    async def process_incoming_data(self, data: list[dict]):
        batch_size = 10
        results = []
        
        for i in range(0, len(data), batch_size):
            batch = data[i:i+batch_size]
            prompt = f"Process this data batch:\n{json.dumps(batch, indent=2)}"
            
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )
            results.append(response.choices[0].message.content)
        
        return results

    async def classify_documents(self, documents: list[str], categories: list[str]) -> list[dict]:
        results = []
        for doc in documents:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{
                    "role": "user",
                    "content": f"Classify this document into one of: {categories}\n\n{doc}"
                }]
            )
            classification = response.choices[0].message.content.strip()
            results.append({"document": doc[:50], "category": classification})
        return results

    async def extract_structured_data(self, text: str, schema: dict) -> dict:
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": f"Extract structured data from this text following this schema: {json.dumps(schema)}\n\nText: {text}"
            }]
        )
        return json.loads(response.choices[0].message.content)
```

### Email Processing Automation

```python
class EmailAutomation:
    def __init__(self, client, email_client):
        self.client = client
        self.email = email_client
    
    async def process_incoming_email(self, email: dict):
        # Summarize long emails
        if len(email["body"]) > 1000:
            summary = await self.summarize(email["body"])
        else:
            summary = email["body"]
        
        # Classify email
        classification = await self.classify_email(email)
        
        # Generate draft reply
        draft = await self.generate_reply(email, classification)
        
        return {
            "summary": summary,
            "classification": classification,
            "draft_reply": draft
        }
    
    async def summarize(self, text: str) -> str:
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": f"Summarize this in 2-3 sentences:\n{text}"}]
        )
        return response.choices[0].message.content
    
    async def classify_email(self, email: dict) -> str:
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": f"Classify this email as: question, complaint, request, or spam\nSubject: {email['subject']}\nBody: {email['body'][:200]}"
            }]
        )
        return response.choices[0].message.content.strip().lower()
    
    async def generate_reply(self, email: dict, classification: str) -> str:
        system_prompts = {
            "question": "Answer the question helpfully and concisely.",
            "complaint": "Apologize and offer a solution. Be empathetic.",
            "request": "Acknowledge and explain how you will handle it.",
            "spam": "Do not respond."
        }
        
        prompt = system_prompts.get(classification, "Respond professionally.")
        if classification == "spam":
            return "No reply needed"
        
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"Original email:\nSubject: {email['subject']}\nBody: {email['body']}\n\nWrite a draft reply."}
            ]
        )
        return response.choices[0].message.content
```

---

## Scheduling and Cron Jobs

```python
# schedule_tasks.py
import schedule
import time
from datetime import datetime

class TaskScheduler:
    def __init__(self, client):
        self.client = client
        self.tasks = []
    
    def add_daily_task(self, time_str: str, func, *args, **kwargs):
        schedule.every().day.at(time_str).do(func, *args, **kwargs)
    
    def add_weekly_task(self, day: str, time_str: str, func, *args, **kwargs):
        getattr(schedule.every(), day).at(time_str).do(func, *args, **kwargs)
    
    def add_hourly_task(self, func, *args, **kwargs):
        schedule.every().hour.do(func, *args, **kwargs)
    
    def run(self):
        while True:
            schedule.run_pending()
            time.sleep(60)

# Usage
scheduler = TaskScheduler(client)
scheduler.add_daily_task("09:00", generate_morning_summary)
scheduler.add_weekly_task("monday", "10:00", generate_weekly_report)
scheduler.add_hourly_task(check_system_health)
scheduler.run()
```

### Cron Examples

```bash
# Daily summary at 9 AM
0 9 * * * /usr/bin/python3 /scripts/daily_summary.py

# Weekly report on Monday at 10 AM
0 10 * * 1 /usr/bin/python3 /scripts/weekly_report.py

# Hourly health check
0 * * * * /usr/bin/python3 /scripts/health_check.py

# Monthly archive
0 0 1 * * /usr/bin/python3 /scripts/monthly_archive.py

# Export conversations every 6 hours
0 */6 * * * /usr/bin/inte11ect export --all --format json --output /backups/
```

---

## Error Handling and Retry Logic

```python
class RetryHandler:
    def __init__(self, max_retries: int = 3, base_delay: float = 1.0):
        self.max_retries = max_retries
        self.base_delay = base_delay
    
    async def execute_with_retry(self, func, *args, **kwargs):
        last_exception = None
        
        for attempt in range(self.max_retries):
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                if attempt < self.max_retries - 1:
                    delay = self.base_delay * (2 ** attempt)
                    print(f"Attempt {attempt + 1} failed. Retrying in {delay}s...")
                    await asyncio.sleep(delay)
        
        raise last_exception

# Usage
retry = RetryHandler(max_retries=3)
result = await retry.execute_with_retry(
    client.chat.completions.create,
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello"}]
)
```

---

## Automation Monitoring

```python
class AutomationMonitor:
    def __init__(self):
        self.runs = []
    
    def record_run(self, automation_name: str, success: bool, duration: float):
        self.runs.append({
            "name": automation_name,
            "success": success,
            "duration": duration,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    def get_stats(self, name: str = None) -> dict:
        filtered = self.runs
        if name:
            filtered = [r for r in filtered if r["name"] == name]
        
        total = len(filtered)
        if total == 0:
            return {"total_runs": 0}
        
        successful = sum(1 for r in filtered if r["success"])
        avg_duration = sum(r["duration"] for r in filtered) / total
        
        return {
            "total_runs": total,
            "successful": successful,
            "failed": total - successful,
            "success_rate": successful / total * 100,
            "avg_duration_s": avg_duration
        }
```

---

## Automation Best Practices

```yaml
automation_best_practices:
  design:
    - "Start with idempotent operations"
    - "Implement proper error handling"
    - "Add logging at each step"
    - "Use configuration files for parameters"
    - "Test automation in staging first"
  
  reliability:
    - "Implement retry logic with exponential backoff"
    - "Add dead-letter queues for failed items"
    - "Monitor automation success rates"
    - "Set up alerts for failures"
    - "Version control all automation scripts"
  
  security:
    - "Store secrets in environment variables"
    - "Use least-privilege API keys"
    - "Validate all external inputs"
    - "Audit automation actions"
    - "Implement rate limiting"
```

```
Lois-Kleinner and 0-1.gg 2026 — Confidential
```
