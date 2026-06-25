# Cookbook

## 1. Basic Chat

```python
from camus import Camus
app = Camus()
print(app.respond("What is 2+2?", use_stream=False))
```

## 2. API Integration

```python
import requests
resp = requests.post("http://localhost:8080/v1/chat/completions",
    json={"messages": [{"role": "user", "content": "Hello"}]})
print(resp.json()["choices"][0]["message"]["content"])
```

## 3. Web Search

```
/search quantum computing breakthroughs
```

## 4. Save and Load Sessions

```
/save research_session
/load research_session
```

## 5. Custom Config

Create `camus.json`:
```json
{"n_ctx": 4096, "temperature": 0.5, "max_tokens": 500}
```
