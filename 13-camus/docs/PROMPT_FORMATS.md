# Prompt Formats

## System Prompt (default)

```
You are Camus, a concise AI assistant.
```

## Chat Template (ChatML)

```
<|im_start|>system
You are Camus, a concise AI assistant.<|im_end|>
<|im_start|>user
User message<|im_end|>
<|im_start|>assistant
Response<|im_end|>
```

## Vision Input

```json
{"role": "user", "content": [
  {"type": "image_url", "image_url": {"url": "data:image/png;base64,..."}},
  {"type": "text", "text": "Describe this image."}
]}
```

## Four-Bar Output Format

```
┌──────────────────────────────────────┐
│ Accuracy      ████████████████░░░  80% │
│ Confidence    ██████████░░░░░░░░░  50% │
│ Contradiction ██░░░░░░░░░░░░░░░░░  10% │
│ Humanity      █████████████░░░░░░  65% │
├──────────────────────────────────────┤
│ Composite     ████████████████░░░  75% │
└──────────────────────────────────────┘
```
