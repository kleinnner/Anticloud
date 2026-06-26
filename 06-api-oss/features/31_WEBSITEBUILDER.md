---
title: "31 — WEBSITE BUILDER"
sidebar_position: 99
description: "*Version:** 1.0 (May 2026)"
tags: [features]
---

# 31 — WEBSITE BUILDER

**Version:** 1.0 (May 2026)
**Feature:** Generate, preview, modify, and share single-page HTML websites — all local, all sovereign
**Files:** `protocol.rs`, `ws_server.rs`, `graph.rs`, `content.rs`, `WebsiteBuilderView.tsx`, `App.tsx`
**New deps:** None

---

## Overview

The Website Builder lets users generate a complete one-page HTML website from a natural language prompt. The AI outputs clean, responsive HTML with inline CSS. Users can preview it live, modify it with follow-up instructions, copy the code, download the file, or publish it to a shareable URL. Everything runs locally through the existing LLM, graph database, and tunnel.

**UX in one sentence:** Type "build a landing page for a cybersecurity startup" → get a live-previewed, copyable, downloadable, shareable HTML page in seconds.

---

## UX Flow (End to End)

```
Sidebar Tab: "Website"
│
├── [No website yet]
│   └── Prompt input + "Generate" button
│       └── "Describe the website you want to build..."
│
├── [Generating]
│   └── Loading spinner + "AI is building your website..."
│
├── [Generated — two-panel view]
│   ├── LEFT PANEL: Prompt + Modify input
│   │   ├── Original prompt (editable, with "Regenerate" button)
│   │   ├── Modify input: "Make the hero blue instead of dark"
│   │   └── "Modify" button
│   │
│   └── RIGHT PANEL: Preview + Code tabs
│       ├── TAB "Preview" — live iframe render (srcdoc, sandboxed)
│       └── TAB "Code" — syntax-highlighted HTML (read-only)
│
└── [Action bar — below right panel]
    ├── 📋 Copy HTML         → clipboard.writeText(html)
    ├── ⬇ Download .html     → Blob download
    ├── 🌐 Share Online       → toggles public/private, shows URL
    └── 📁 Add to Codex       → associates with active codex
```

---

## Wireframe (ASCII)

```
┌──────────────────────────────────────────────────────────────┐
│  Website Builder                                    [Codex ▼] │
├──────────────────────────┬───────────────────────────────────┤
│                          │  [Preview]  [Code]                │
│  Describe your website   │  ┌─────────────────────────────┐  │
│  ┌─────────────────────┐ │  │                             │  │
│  │ Landing page for a  │ │  │   My Startup                │  │
│  │ cybersecurity start │ │  │   ─────────────────         │  │
│  │ up...               │ │  │   We protect your           │  │
│  └─────────────────────┘ │  │   digital assets            │  │
│  [🔄 Generate]           │  │                             │  │
│                          │  │   [Get Started]             │  │
│  Modify the design       │  │                             │  │
│  ┌─────────────────────┐ │  └─────────────────────────────┘  │
│  │ Make the hero blue  │ │                                    │
│  └─────────────────────┘ │                                    │
│  [✨ Modify]              │                                    │
├──────────────────────────┴───────────────────────────────────┤
│  📋 Copy     ⬇ Download     🌐 Share (private)     📁 Add to Codex │
└──────────────────────────────────────────────────────────────┘
```

---

## Protocol — New Message Types

Add to `protocol.rs` under existing `ClientMessage` and `ServerMessage` enums.

### Client → Server

```rust
/// Regenerate an existing website with a modification instruction.
#[serde(rename = "regenerate_website")]
RegenerateWebsite {
    id: String,
    export_id: String,       // The generated_content ID to modify
    instruction: String,     // "Make the hero section blue"
}

/// Toggle public/private status of a published website.
#[serde(rename = "publish_website")]
PublishWebsite {
    id: String,
    export_id: String,
    public: bool,            // true = make public, false = make private
}

/// List all published websites in the current codex.
#[serde(rename = "get_published_websites")]
GetPublishedWebsites {
    id: String,
    codex_id: Option<String>,
}
```

### Server → Client

```rust
/// Response after regeneration completes.
#[serde(rename = "website_regenerated")]
WebsiteRegenerated {
    id: String,
    export_id: String,
    content: String,         // The full new HTML
}

/// Response after publish/unpublish.
#[serde(rename = "website_published")]
WebsitePublished {
    id: String,
    url: String,             // The shareable URL (empty if private)
    public: bool,
}

/// List of all published websites.
#[serde(rename = "published_websites_list")]
PublishedWebsitesList {
    id: String,
    websites: Vec<PublishedWebsiteSummary>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PublishedWebsiteSummary {
    pub export_id: String,
    pub topic: String,
    pub created_at: String,
    pub public: bool,
    pub url: Option<String>,  // Present if public
}
```

---

## Content Prompt Template

In `content.rs`, the existing `build_format_prompt` function has an `"html-website"` case. Tighten it to guarantee consistent output:

```rust
"html-website" => {
    let system = r#"You are a senior frontend web developer. Generate a complete, single-page HTML website based on the topic and context provided.

REQUIREMENTS:
- Return ONLY valid HTML. Start with <!DOCTYPE html>.
- Include a single <style> tag in <head> with ALL CSS inline (no external files).
- Include a single <script> tag at the end of <body> if ANY interactivity is needed (smooth scroll, mobile menu toggle, form handling). Keep scripts minimal.
- Max ~1000 lines. Be concise but visually impressive.
- Responsive design (mobile-first, works on all screen sizes).
- Modern, clean aesthetic. Use a cohesive color palette. Good typography (system fonts or Google Fonts via @import).
- Include these sections in order: Navigation bar (sticky) → Hero → Features/Grid → About → Testimonials (optional) → Call to Action → Footer.
- Use realistic placeholder content. Generate real company names, product names, and feature descriptions relevant to the topic.
- All links should use href="#". Forms should not actually submit.
- DO NOT wrap the output in markdown code fences. Return raw HTML only."#;
    let user = format!("Topic: {}\n\nContext from knowledge base:\n{}\n\nGenerate the website now.", topic, context);
    (system, user)
}
```

---

## Message Handlers — `ws_server.rs`

### Handler 1: RegenerateWebsite

Located in `handle_client_message` match block. Add after existing `GenerateContent` handler:

```rust
ClientMessage::RegenerateWebsite { id, export_id, instruction } => {
    let state = state.clone();
    let sender = sender.clone();
    tokio::spawn(async move {
        // 1. Fetch the existing website content from the graph
        let existing = match state.graph.get_content(&export_id) {
            Ok(Some(c)) => c,
            Ok(None) => {
                send_msg(&sender, &ServerMessage::Error {
                    id: Some(id.clone()),
                    message: "Website not found".into(),
                    code: Some("NOT_FOUND".into()),
                }).await;
                return;
            }
            Err(e) => {
                send_msg(&sender, &ServerMessage::Error {
                    id: Some(id.clone()),
                    message: format!("Database error: {}", e),
                    code: Some("DB_ERROR".into()),
                }).await;
                return;
            }
        };

        // 2. Build a modification prompt
        let system = format!(
            r#"You are a senior frontend web developer. Below is an existing HTML website.
Modify it according to the user's instruction. Return the COMPLETE modified HTML.
Do NOT return a diff or partial markup — return the entire <!DOCTYPE html> document.
Keep all requirements: inline CSS, responsive, ~1000 lines max, no markdown fences.

EXISTING WEBSITE:
```html
{}
```

USER INSTRUCTION: {}"#,
            existing.content, instruction
        );

        // 3. Generate via LLM
        let llama = state.llama.lock().await;
        let mut stream = match llama.prompt(&system, "Modify the website as instructed.").await {
            Ok(s) => s,
            Err(e) => {
                send_msg(&sender, &ServerMessage::Error {
                    id: Some(id.clone()),
                    message: format!("Generation failed: {}", e),
                    code: Some("LLAMA_ERROR".into()),
                }).await;
                return;
            }
        };
        drop(llama);

        // 4. Collect full response
        let mut full = String::new();
        while let Some(event) = stream.next().await {
            if let TokenStreamEvent::Token(t) = event {
                full.push_str(&t);
            }
        }

        // 5. Clean output and update graph
        let cleaned = clean_html_output(&full);
        let _ = state.graph.update_content(&export_id, &cleaned);

        // 6. Save to disk
        let file_path = std::path::PathBuf::from(&state.config.data_dir)
            .join("exports").join(format!("{}.html", export_id));
        let _ = std::fs::write(&file_path, &cleaned);

        // 7. Log to ledger
        {
            let mut ledger = state.ledger.lock();
            let _ = ledger.append(
                "website_regenerated", "system", &state.config.user.name,
                serde_json::json!({ "export_id": export_id, "instruction": instruction }),
                &format!("Regenerated website {}", export_id),
            );
        }

        // 8. Return result
        send_msg(&sender, &ServerMessage::WebsiteRegenerated {
            id,
            export_id,
            content: cleaned,
        }).await;
    });
}
```

### Handler 2: PublishWebsite

```rust
ClientMessage::PublishWebsite { id, export_id, public } => {
    let state = state.clone();
    let sender = sender.clone();
    tokio::spawn(async move {
        // 1. Update is_public in graph
        if let Err(e) = state.graph.set_content_public(&export_id, public) {
            send_msg(&sender, &ServerMessage::Error {
                id: Some(id.clone()),
                message: format!("Failed to update: {}", e),
                code: Some("DB_ERROR".into()),
            }).await;
            return;
        }

        // 2. Build the share URL
        // Tunnel URL is stored in AppConfig or discovered from the bridge
        let base_url = get_public_base_url(&state.config);
        let url = if public {
            format!("{}/p/{}", base_url, export_id)
        } else {
            String::new()
        };

        // 3. Log to ledger
        {
            let mut ledger = state.ledger.lock();
            let _ = ledger.append(
                if public { "website_published" } else { "website_unpublished" },
                "system", &state.config.user.name,
                serde_json::json!({ "export_id": export_id, "url": url }),
                &format!("{} website {}", if public { "Published" } else { "Unpublished" }, export_id),
            );
        }

        send_msg(&sender, &ServerMessage::WebsitePublished { id, url, public }).await;
    });
}
```

### Handler 3: GetPublishedWebsites

```rust
ClientMessage::GetPublishedWebsites { id, codex_id } => {
    let state = state.clone();
    let sender = sender.clone();
    tokio::spawn(async move {
        let exports = match state.graph.list_content(codex_id.as_deref()) {
            Ok(e) => e,
            Err(e) => {
                send_msg(&sender, &ServerMessage::Error {
                    id: Some(id.clone()),
                    message: format!("Failed to list: {}", e),
                    code: Some("DB_ERROR".into()),
                }).await;
                return;
            }
        };

        // Filter to only html-website format and build summaries
        let mut websites = Vec::new();
        let base_url = get_public_base_url(&state.config);
        for exp in &exports {
            if exp.format != "html-website" { continue; }
            let is_public = state.graph.is_content_public(&exp.id).unwrap_or(false);
            websites.push(PublishedWebsiteSummary {
                export_id: exp.id.clone(),
                topic: exp.topic.clone(),
                created_at: exp.created_at.clone(),
                public: is_public,
                url: if is_public { Some(format!("{}/p/{}", base_url, exp.id)) } else { None },
            });
        }

        send_msg(&sender, &ServerMessage::PublishedWebsitesList { id, websites }).await;
    });
}
```

### Helper: Public Base URL

```rust
/// Get the public base URL for share links.
/// If tunnel is active, uses the tunnel URL. Otherwise uses localhost.
fn get_public_base_url(config: &AppConfig) -> String {
    // Try to read tunnel URL from a file written by the bridge
    let tunnel_file = std::path::PathBuf::from(&config.data_dir).join("tunnel_url.txt");
    if tunnel_file.exists() {
        if let Ok(url) = std::fs::read_to_string(&tunnel_file) {
            let url = url.trim().trim_end_matches('/').to_string();
            if !url.is_empty() { return url; }
        }
    }
    // Fallback: localhost with TLS port
    let port = if config.tls.enabled { config.tls.port } else { config.gateway.ui_port };
    let protocol = if config.tls.enabled { "https" } else { "http" };
    format!("{}://{}:{}", protocol, config.gateway.host, port)
}
```

### Helper: HTML Output Cleaner

```rust
/// Strip markdown code fences and trim whitespace from LLM HTML output.
fn clean_html_output(raw: &str) -> String {
    let mut cleaned = raw.to_string();
    // Remove ```html fences
    cleaned = cleaned.trim_start_matches("```html").trim_start_matches("```").to_string();
    cleaned = cleaned.trim_end_matches("```").to_string();
    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim().to_string();
    // Ensure it starts with <!DOCTYPE html> or <html
    if !cleaned.starts_with("<!DOCTYPE") && !cleaned.starts_with("<html") {
        cleaned = format!("<!DOCTYPE html>\n{}", cleaned);
    }
    cleaned
}
```

---

## Graph Methods — `graph.rs`

### get_content

Add after existing `list_content`:

```rust
/// Get a single generated_content entry by ID.
pub fn get_content(&self, id: &str) -> Result<Option<ContentResult>, anyhow::Error> {
    let conn = self.conn();
    let mut stmt = conn.prepare(
        "SELECT id, format, topic, content, file_path, created_at
         FROM generated_content WHERE id = ?1"
    )?;
    let result = stmt.query_row(params![id], |row| {
        Ok(ContentResult {
            id: row.get(0)?,
            format: row.get(1)?,
            topic: row.get(2)?,
            content: row.get(3)?,
            file_path: row.get(4)?,
            created_at: row.get(5)?,
        })
    });
    match result {
        Ok(content) => Ok(Some(content)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.into()),
    }
}
```

### update_content

```rust
/// Update the content of an existing generated_content entry.
pub fn update_content(&self, id: &str, content: &str) -> Result<(), anyhow::Error> {
    self.conn().execute(
        "UPDATE generated_content SET content = ?1 WHERE id = ?2",
        params![content, id],
    )?;
    Ok(())
}
```

### set_content_public / is_content_public

```rust
/// Set the public/private status of a generated_content entry.
pub fn set_content_public(&self, id: &str, public: bool) -> Result<(), anyhow::Error> {
    self.conn().execute(
        "UPDATE generated_content SET is_public = ?1 WHERE id = ?2",
        params![public as i32, id],
    )?;
    Ok(())
}

/// Check if a generated_content entry is public.
pub fn is_content_public(&self, id: &str) -> Result<bool, anyhow::Error> {
    let conn = self.conn();
    let result: Result<i32, _> = conn.query_row(
        "SELECT is_public FROM generated_content WHERE id = ?1",
        params![id],
        |row| row.get(0),
    );
    match result {
        Ok(val) => Ok(val != 0),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(false),
        Err(e) => Err(e.into()),
    }
}
```

---

## Static Route — Public Website Serving

Add to the Router in `ws_server.rs`:

```rust
// Serve published websites
.route("/p/:id", get(handle_published_website))
```

Handler:

```rust
async fn handle_published_website(
    axum::extract::Path(id): axum::extract::Path<String>,
    State(state): State<AppState>,
) -> Result<axum::response::Html<String>, (StatusCode, &'static str)> {
    let content = state.graph.get_content(&id)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "DB error"))?;

    match content {
        Some(c) => {
            // Check if public
            let is_public = state.graph.is_content_public(&id)
                .unwrap_or(false);
            if !is_public {
                return Err((StatusCode::NOT_FOUND, "Not found"));
            }
            Ok(axum::response::Html(c.content))
        }
        None => Err((StatusCode::NOT_FOUND, "Not found")),
    }
}
```

---

## Frontend — WebsiteBuilderView.tsx

This is the most important file. Full React component with no stubs, all functionality wired.

```tsx
// WebsiteBuilderView.tsx — Complete Implementation
// File: ai-oss-gateway/frontend/src/views/WebsiteBuilderView.tsx

import { useState, useRef, useEffect, useCallback } from 'react';

interface ContentResult {
  id: string;
  format: string;
  topic: string;
  content: string;
  file_path?: string;
  created_at: string;
}

interface Props {
  send: (msg: any) => void;
  onMessage: (handler: (msg: any) => void) => () => void;
  sessionData: any;
}

const INITIAL_PROMPT = 'Describe the website you want to build...';

export default function WebsiteBuilderView({ send, onMessage, sessionData }: Props) {
  const [prompt, setPrompt] = useState('');
  const [modifyInput, setModifyInput] = useState('');
  const [html, setHtml] = useState('');
  const [exportId, setExportId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [generated, setGenerated] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for WebSocket responses
  useEffect(() => {
    return onMessage((msg: any) => {
      switch (msg.type) {
        case 'content_result_data':
          if (msg.result?.format === 'html-website') {
            setHtml(msg.result.content);
            setExportId(msg.result.id);
            setLoading(false);
            setGenerated(true);
            setTab('preview');
          }
          break;

        case 'website_regenerated':
          setHtml(msg.content);
          setLoading(false);
          setTab('preview');
          break;

        case 'website_published':
          setIsPublic(msg.public);
          setShareUrl(msg.url || '');
          break;

        case 'error':
          if (loading) setLoading(false);
          break;
      }
    });
  }, [onMessage, loading]);

  const generate = useCallback(() => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    send({
      type: 'generate_content',
      id: `web_${Date.now()}`,
      format: 'html-website',
      topic: prompt.trim(),
      context: '',
    });
  }, [prompt, loading, send]);

  const modify = useCallback(() => {
    if (!modifyInput.trim() || !exportId || loading) return;
    setLoading(true);
    send({
      type: 'regenerate_website',
      id: `web_mod_${Date.now()}`,
      export_id: exportId,
      instruction: modifyInput.trim(),
    });
    setModifyInput('');
  }, [modifyInput, exportId, loading, send]);

  const copyHtml = useCallback(() => {
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [html]);

  const downloadHtml = useCallback(() => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportId || 'website'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [html, exportId]);

  const toggleShare = useCallback(() => {
    if (!exportId) return;
    send({
      type: 'publish_website',
      id: `pub_${Date.now()}`,
      export_id: exportId,
      public: !isPublic,
    });
  }, [exportId, isPublic, send]);

  // Auto-refresh iframe when HTML changes
  useEffect(() => {
    if (iframeRef.current && html) {
      iframeRef.current.srcdoc = html;
    }
  }, [html]);

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌐</span>
          <span className="font-semibold text-sm">Website Builder</span>
        </div>
        <div className="text-xs text-neutral-500">
          {sessionData?.activeCodexName
            ? `Codex: ${sessionData.activeCodexName}`
            : 'No codex selected'}
        </div>
      </div>

      {!generated ? (
        /* Initial state: prompt only */
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-xl space-y-4">
            <p className="text-sm text-neutral-400 text-center">
              Describe the website you want to build. The AI will generate a complete, responsive one-page HTML site.
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={INITIAL_PROMPT}
              rows={4}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm
                         placeholder-neutral-600 focus:outline-none focus:border-blue-500 resize-none"
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate(); }}
            />
            <div className="flex justify-center">
              <button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700
                           disabled:text-neutral-500 rounded-lg text-sm font-medium transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
                    Building...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">🔄 Generate</span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Two-panel view */
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-1 min-h-0">
            {/* Left panel: Prompt + Modify */}
            <div className="w-80 flex-shrink-0 border-r border-neutral-800 flex flex-col p-3 gap-3 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Original Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs
                             placeholder-neutral-600 focus:outline-none focus:border-blue-500 resize-none"
                />
                <button
                  onClick={generate}
                  disabled={loading}
                  className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50
                             rounded text-xs font-medium transition-colors"
                >
                  {loading ? 'Regenerating...' : '🔄 Regenerate'}
                </button>
              </div>

              <div className="border-t border-neutral-800 pt-3 space-y-1">
                <label className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Modify</label>
                <textarea
                  value={modifyInput}
                  onChange={(e) => setModifyInput(e.target.value)}
                  placeholder="Make the hero blue..."
                  rows={2}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs
                             placeholder-neutral-600 focus:outline-none focus:border-purple-500 resize-none"
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) modify(); }}
                />
                <button
                  onClick={modify}
                  disabled={loading || !modifyInput.trim()}
                  className="w-full py-1.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50
                             rounded text-xs font-medium transition-colors"
                >
                  {loading ? 'Applying...' : '✨ Modify'}
                </button>
              </div>
            </div>

            {/* Right panel: Preview + Code */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Tabs */}
              <div className="flex border-b border-neutral-800">
                <button
                  onClick={() => setTab('preview')}
                  className={`px-4 py-2 text-xs font-medium transition-colors ${
                    tab === 'preview'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setTab('code')}
                  className={`px-4 py-2 text-xs font-medium transition-colors ${
                    tab === 'code'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Code ({html.split('\n').length} lines)
                </button>
                {loading && (
                  <div className="flex items-center gap-1.5 ml-auto mr-3 text-xs text-neutral-400">
                    <span className="animate-spin inline-block w-2.5 h-2.5 border-2 border-neutral-500 border-t-neutral-200 rounded-full" />
                    Generating...
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-h-0">
                {tab === 'preview' ? (
                  <iframe
                    ref={iframeRef}
                    title="Website Preview"
                    sandbox="allow-same-origin"
                    className="w-full h-full bg-white"
                    srcDoc={html}
                  />
                ) : (
                  <pre className="w-full h-full overflow-auto p-4 text-xs font-mono text-neutral-300 bg-neutral-900">
                    <code>{html}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-800 bg-neutral-900/50">
            <div className="flex items-center gap-2">
              <button
                onClick={copyHtml}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700
                           rounded text-xs transition-colors"
              >
                {copied ? '✅ Copied!' : '📋 Copy HTML'}
              </button>
              <button
                onClick={downloadHtml}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700
                           rounded text-xs transition-colors"
              >
                ⬇ Download .html
              </button>
              <button
                onClick={toggleShare}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${
                  isPublic
                    ? 'bg-green-800 hover:bg-green-700'
                    : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
              >
                🌐 {isPublic ? 'Public' : 'Private'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500">
              {isPublic && shareUrl && (
                <span className="text-green-400 truncate max-w-xs" title={shareUrl}>
                  {shareUrl}
                </span>
              )}
              <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-xs transition-colors">
                📁 Save to Codex
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Register in App.tsx

```typescript
// In App.tsx, add to the view render section:
case 'website':
  return (
    <WebsiteBuilderView
      send={send}
      onMessage={onMessage}
      sessionData={sessionData}
    />
  );
```

Add import:
```typescript
import WebsiteBuilderView from './views/WebsiteBuilderView';
```

Add to tab navigation:
```typescript
// In the tabs array or sidebar:
{ label: 'Website', id: 'website', icon: '🌐' }
```

---

## Tunnel URL File

The bridge writes the tunnel URL to a file so the website builder can construct share links:

In `bridge.rs` after tunnel starts successfully:

```rust
// Write tunnel URL for website builder share links
let tunnel_file = std::path::PathBuf::from(&self.config.data_dir).join("tunnel_url.txt");
let _ = std::fs::write(&tunnel_file, &url);
```

On bridge shutdown:

```rust
// Clean up
let _ = std::fs::write(&tunnel_file, "");
```

---

## Full File Change Summary

| File | Change | Lines |
|------|--------|-------|
| `protocol.rs` | Add 5 new message types + 1 struct | ~30 |
| `content.rs` | Tighten "html-website" prompt template | ~20 |
| `graph.rs` | Add `get_content`, `update_content`, `set_content_public`, `is_content_public` | ~40 |
| `ws_server.rs` | Add 3 handlers + public route + 2 helpers | ~120 |
| `bridge.rs` | Write tunnel URL to file for share links | ~3 |
| `WebsiteBuilderView.tsx` | Complete new view (new file) | ~260 |
| `App.tsx` | Import + register view + add tab | ~5 |
| **Total** | | **~478** |

Zero new dependencies. Every pattern already exists in the codebase.

---

## Verification Checklist

- [ ] `api-oss start` → Website tab appears in sidebar
- [ ] Click Website → prompt input visible, no stubs
- [ ] Type "Build a landing page for a fintech startup" → click Generate → loading spinner
- [ ] After 3-8 seconds → two-panel view appears with Preview tab showing live rendered HTML
- [ ] Switch to Code tab → shows full HTML with line count
- [ ] Type "Make the hero section use a gradient background" → click Modify → regenerates, preview updates
- [ ] Click "Copy HTML" → clipboard has the full HTML
- [ ] Click "Download .html" → file downloads
- [ ] Click "Share" → toggles to Public, URL appears
- [ ] Open the URL in another browser → full page renders
- [ ] Click "Share" again → toggles to Private, URL returns 404
- [ ] Bridge active → share URL uses the tunnel domain
- [ ] Bridge inactive → share URL falls back to localhost
- [ ] Every generate/modify/publish logged in .aioss ledger

---

*API-OSS — The Anti-Cloud*

## See Also

Related features, architecture, and roadmap documentation.

- [Features Overview](../features/README.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [API Reference](../api-reference/01-overview.md)
- [Roadmap](../roadmap/01-product-vision.md)

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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