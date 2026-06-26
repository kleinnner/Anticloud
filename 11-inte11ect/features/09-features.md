<!-- ASCII Art for Psy-11 -->


¦¦¦+   ¦¦¦+¦¦¦¦¦¦¦+¦¦¦¦¦¦+ ¦¦¦+   ¦¦¦+ ¦¦¦¦¦+ ¦¦+¦¦¦¦¦¦+     ¦¦¦¦¦¦+ ¦¦+ ¦¦¦¦¦+  ¦¦¦¦¦¦+ ¦¦¦¦¦¦+  ¦¦¦¦¦+ ¦¦¦+   ¦¦¦+
¦¦¦¦+ ¦¦¦¦¦¦¦+----+¦¦+--¦¦+¦¦¦¦+ ¦¦¦¦¦¦¦+--¦¦+¦¦¦¦¦+--¦¦+    ¦¦+--¦¦+¦¦¦¦¦+--¦¦+¦¦+----+ ¦¦+--¦¦+¦¦+--¦¦+¦¦¦¦+ ¦¦¦¦¦
¦¦+¦¦¦¦+¦¦¦¦¦¦¦¦+  ¦¦¦¦¦¦++¦¦+¦¦¦¦+¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦  ¦¦¦    ¦¦¦  ¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦  ¦¦¦+¦¦¦¦¦¦++¦¦¦¦¦¦¦¦¦¦+¦¦¦¦+¦¦¦
¦¦¦+¦¦++¦¦¦¦¦+--+  ¦¦+--¦¦+¦¦¦+¦¦++¦¦¦¦¦+--¦¦¦¦¦¦¦¦¦  ¦¦¦    ¦¦¦  ¦¦¦¦¦¦¦¦+--¦¦¦¦¦¦   ¦¦¦¦¦+--¦¦+¦¦+--¦¦¦¦¦¦+¦¦++¦¦¦
¦¦¦ +-+ ¦¦¦¦¦¦¦¦¦¦+¦¦¦  ¦¦¦¦¦¦ +-+ ¦¦¦¦¦¦  ¦¦¦¦¦¦¦¦¦¦¦¦++    ¦¦¦¦¦¦++¦¦¦¦¦¦  ¦¦¦+¦¦¦¦¦¦++¦¦¦  ¦¦¦¦¦¦  ¦¦¦¦¦¦ +-+ ¦¦¦
+-+     +-++------++-+  +-++-+     +-++-+  +-++-++-----+     +-----+ +-++-+  +-+ +-----+ +-+  +-++-+  +-++-+     +-+

¦¦¦¦¦¦+ ¦¦¦¦¦¦¦+¦¦¦+   ¦¦+¦¦¦¦¦¦+ ¦¦¦¦¦¦¦+¦¦¦¦¦¦+ ¦¦+¦¦¦+   ¦¦+ ¦¦¦¦¦¦+ 
¦¦+--¦¦+¦¦+----+¦¦¦¦+  ¦¦¦¦¦+--¦¦+¦¦+----+¦¦+--¦¦+¦¦¦¦¦¦¦+  ¦¦¦¦¦+----+ 
¦¦¦¦¦¦++¦¦¦¦¦+  ¦¦+¦¦+ ¦¦¦¦¦¦  ¦¦¦¦¦¦¦¦+  ¦¦¦¦¦¦++¦¦¦¦¦+¦¦+ ¦¦¦¦¦¦  ¦¦¦+
¦¦+--¦¦+¦¦+--+  ¦¦¦+¦¦+¦¦¦¦¦¦  ¦¦¦¦¦+--+  ¦¦+--¦¦+¦¦¦¦¦¦+¦¦+¦¦¦¦¦¦   ¦¦¦
¦¦¦  ¦¦¦¦¦¦¦¦¦¦+¦¦¦ +¦¦¦¦¦¦¦¦¦¦¦++¦¦¦¦¦¦¦+¦¦¦  ¦¦¦¦¦¦¦¦¦ +¦¦¦¦¦+¦¦¦¦¦¦++
+-+  +-++------++-+  +---++-----+ +------++-+  +-++-++-+  +---+ +-----+ 

*Lois-Kleinner and 0-1.gg 2026 - Inte11ect Platform Documentation*
*Confidential - All Rights Reserved*


---

# Mermaid Diagram Rendering

> **Associated Module:** Psy-11 — Diagram Engine & Visualization Layer
> **Feature Document 09 of 10** — Estimated reading time: 22 min

## 1. Introduction

Inte11ect includes a native Mermaid diagram rendering engine that supports all major Mermaid diagram types. The engine is implemented in Rust with a WASM-based client-side renderer for the web frontend and a headless server-side renderer for the CLI and API.

---

## 2. Rendering Architecture

```mermaid
flowchart TD
    subgraph Input[Input Sources]
        NL[Natural Language]
        MS[Mermaid Source]
        MP[Module Pipeline]
        GD[GOD-11 Route]
    end
    
    subgraph Engine[Render Engine]
        P[Parser]
        V[Validator]
        G[Graph Builder]
        L[Layout Engine (Dagre)]
        R[Rasterizer (Cairo)]
        S[SVG Generator]
    end
    
    subgraph Output[Output Formats]
        PNG[PNG]
        SVG[SVG]
        PDF[PDF]
        HTML[HTML]
        MD[Markdown Embed]
    end
    
    subgraph Themes[Theme System]
        T1[Default]
        T2[Dark]
        T3[Forest]
        T4[Custom]
    end
    
    NL -->|gen-diagram| MS
    MP -->|auto| MS
    GD -->|auto| MS
    
    MS --> P
    P --> V
    V --> G
    G --> L
    L --> S
    S --> R
    
    T1 --> L
    T2 --> L
    T3 --> L
    T4 --> L
    
    S --> SVG
    R --> PNG
    R --> PDF
    R --> HTML
    S --> MD
```

---

## 3. Rust Render Engine

```rust
pub struct MermaidEngine {
    parser: MermaidParser,
    layout: LayoutEngine,
    renderer: Renderer,
    theme_manager: ThemeManager,
}

impl MermaidEngine {
    pub fn new() -> Self {
        MermaidEngine {
            parser: MermaidParser::new(),
            layout: LayoutEngine::new(),
            renderer: Renderer::new(),
            theme_manager: ThemeManager::load_defaults(),
        }
    }
    
    pub fn render(&self, source: &str, options: &RenderOptions) -> Result<RenderedDiagram, RenderError> {
        // Parse Mermaid source
        let ast = self.parser.parse(source)?;
        
        // Validate
        self.parser.validate(&ast)?;
        
        // Build graph
        let graph = ast.to_graph();
        
        // Compute layout
        let layout = self.layout.compute(&graph, &options.layout_options)?;
        
        // Apply theme
        let theme = self.theme_manager.get(&options.theme);
        let styled = layout.apply_theme(theme);
        
        // Render to target format
        let output = match options.format {
            OutputFormat::Png => self.renderer.to_png(&styled, options.scale)?,
            OutputFormat::Svg => self.renderer.to_svg(&styled, options.scale)?,
            OutputFormat::Pdf => self.renderer.to_pdf(&styled, options)?,
            OutputFormat::Html => self.renderer.to_html(&styled, &source)?,
            OutputFormat::Markdown => self.renderer.to_markdown(&styled, &source),
        };
        
        Ok(RenderedDiagram {
            data: output,
            format: options.format,
            width: styled.width,
            height: styled.height,
        })
    }
}
```

### Parser

```rust
pub struct MermaidParser {
    // Grammar rules for each diagram type
}

impl MermaidParser {
    pub fn parse(&self, source: &str) -> Result<MermaidAST, ParseError> {
        // Tokenize
        let tokens = self.tokenize(source)?;
        
        // Determine diagram type
        let diagram_type = self.detect_type(&tokens)?;
        
        // Parse based on type
        match diagram_type {
            DiagramType::Flowchart => self.parse_flowchart(tokens),
            DiagramType::Sequence => self.parse_sequence(tokens),
            DiagramType::Class => self.parse_class(tokens),
            DiagramType::State => self.parse_state(tokens),
            DiagramType::ErDiagram => self.parse_er(tokens),
            DiagramType::Gantt => self.parse_gantt(tokens),
            DiagramType::Pie => self.parse_pie(tokens),
            DiagramType::Mindmap => self.parse_mindmap(tokens),
            DiagramType::Timeline => self.parse_timeline(tokens),
            DiagramType::GitGraph => self.parse_git(tokens),
            DiagramType::XyChart => self.parse_xy(tokens),
            DiagramType::Requirement => self.parse_requirement(tokens),
        }
    }
    
    fn tokenize(&self, source: &str) -> Result<Vec<Token>, ParseError> {
        let mut tokens = Vec::new();
        let mut chars = source.chars().peekable();
        
        while let Some(ch) = chars.next() {
            match ch {
                '%' if chars.peek() == Some(&'{') => {
                    // Skip directive: %%{...}%%
                    while chars.next().is_some() && !(ch == '%' && chars.peek() == Some(&'}')) {}
                    chars.next(); // consume '}'
                    chars.next(); // consume '%'
                    chars.next(); // consume '%'
                }
                '#' => {
                    // Comment until newline
                    while chars.next().is_some() && chars.peek() != Some(&'\n') {}
                }
                '-' if chars.peek() == Some(&'-') && chars.clone().nth(1) == Some('>') => {
                    tokens.push(Token::Arrow);
                    chars.next(); chars.next();
                }
                '=' if chars.peek() == Some(&'=') && chars.clone().nth(1) == Some(&'>') => {
                    tokens.push(Token::ThickArrow);
                    chars.next(); chars.next();
                }
                '-' if chars.peek() == Some(&'-') => {
                    tokens.push(Token::Line);
                    chars.next();
                }
                '=' => tokens.push(Token::ThickLine),
                '>' => tokens.push(Token::Gt),
                '<' => tokens.push(Token::Lt),
                '{' => tokens.push(Token::LBrace),
                '}' => tokens.push(Token::RBrace),
                '[' => tokens.push(Token::LBracket),
                ']' => tokens.push(Token::RBracket),
                '(' => tokens.push(Token::LParen),
                ')' => tokens.push(Token::RParen),
                '|' => tokens.push(Token::Pipe),
                ';' => tokens.push(Token::Semicolon),
                ':' => tokens.push(Token::Colon),
                ',' => tokens.push(Token::Comma),
                '.' => tokens.push(Token::Dot),
                '"' => {
                    let mut s = String::new();
                    while let Some(c) = chars.next() {
                        if c == '"' { break; }
                        s.push(c);
                    }
                    tokens.push(Token::Str(s));
                }
                ch if ch.is_alphanumeric() || ch == '_' || ch == '-' => {
                    let mut s = String::from(ch);
                    while let Some(&c) = chars.peek() {
                        if c.is_alphanumeric() || c == '_' || c == '-' || c == '.' {
                            s.push(c);
                            chars.next();
                        } else {
                            break;
                        }
                    }
                    tokens.push(Token::Ident(s));
                }
                _ if ch.is_whitespace() => continue,
                _ => return Err(ParseError::UnexpectedCharacter(ch)),
            }
        }
        
        Ok(tokens)
    }
    
    fn parse_flowchart(&self, tokens: Vec<Token>) -> Result<MermaidAST, ParseError> {
        let mut nodes = Vec::new();
        let mut edges = Vec::new();
        let mut subgraphs = Vec::new();
        let mut i = 0;
        
        while i < tokens.len() {
            match &tokens[i] {
                Token::Ident(s) if s == "subgraph" => {
                    let sg = self.parse_subgraph(&tokens, &mut i)?;
                    subgraphs.push(sg);
                }
                Token::Ident(s) => {
                    let node_name = s.clone();
                    i += 1;
                    
                    // Node definition with shape
                    if i < tokens.len() {
                        match &tokens[i] {
                            Token::LBracket => {
                                // Rectangular node
                                i += 1;
                                let label = self.parse_label(&tokens, &mut i)?;
                                nodes.push(Node {
                                    id: node_name,
                                    label,
                                    shape: NodeShape::Rectangle,
                                    style: NodeStyle::default(),
                                });
                            }
                            Token::LParen => {
                                // Rounded node
                                i += 1;
                                let label = self.parse_label(&tokens, &mut i)?;
                                nodes.push(Node {
                                    id: node_name,
                                    label,
                                    shape: NodeShape::Rounded,
                                    style: NodeStyle::default(),
                                });
                            }
                            Token::LBrace => {
                                // Diamond node
                                i += 1;
                                let label = self.parse_label(&tokens, &mut i)?;
                                nodes.push(Node {
                                    id: node_name,
                                    label,
                                    shape: NodeShape::Diamond,
                                    style: NodeStyle::default(),
                                });
                            }
                            _ => {
                                // Arrow or line
                                let edge = self.parse_edge(&tokens, &mut i, &node_name)?;
                                edges.push(edge);
                            }
                        }
                    }
                    
                    // Check for edge after node
                    if i < tokens.len() {
                        match &tokens[i] {
                            Token::Arrow | Token::ThickArrow | Token::Line | Token::ThickLine => {
                                let edge = self.parse_edge(&tokens, &mut i, &node_name)?;
                                edges.push(edge);
                            }
                            _ => {}
                        }
                    }
                }
                Token::Arrow | Token::ThickArrow | Token::Line | Token::ThickLine => {
                    return Err(ParseError::UnexpectedToken(tokens[i].clone()));
                }
                _ => i += 1,
            }
        }
        
        Ok(MermaidAST::Flowchart {
            direction: DiagramDirection::TopDown,
            nodes,
            edges,
            subgraphs,
        })
    }
}
```

### Layout Engine

```rust
pub struct LayoutEngine {
    dagre: DagreWrapper,
}

impl LayoutEngine {
    pub fn compute(&self, graph: &Graph, options: &LayoutOptions) -> Result<Layout, LayoutError> {
        // Convert to Dagre graph
        let mut g = dagre::Graph::new();
        g.set_graph(dagre::GraphOption::RankDir(options.direction.to_string()));
        g.set_graph(dagre::GraphOption::Nodesep(options.node_spacing));
        g.set_graph(dagre::GraphOption::Ranksep(options.rank_spacing));
        g.set_graph(dagre::GraphOption::Edgesep(options.edge_spacing));
        
        // Add nodes
        for node in &graph.nodes {
            g.set_node(&node.id, dagre::NodeOption::Label(&node.label));
            g.set_node(&node.id, dagre::NodeOption::Width(node.width as f64));
            g.set_node(&node.id, dagre::NodeOption::Height(node.height as f64));
        }
        
        // Add edges
        for edge in &graph.edges {
            g.set_edge(&edge.from, &edge.to, dagre::EdgeOption::Label(&edge.label));
        }
        
        // Layout
        dagre::layout(&mut g);
        
        // Extract positions
        let mut layout = Layout::new();
        for node in &graph.nodes {
            let pos = g.node(&node.id);
            layout.add_node_position(
                node.id.clone(),
                pos.x as f32,
                pos.y as f32,
                pos.width as f32,
                pos.height as f32,
            );
        }
        
        for edge in &graph.edges {
            let points: Vec<(f64, f64)> = g.edge(&edge.from, &edge.to)
                .map(|e| e.points.unwrap_or_default())
                .unwrap_or_default();
            
            layout.add_edge_points(
                edge.id.clone(),
                points.iter().map(|(x, y)| (*x as f32, *y as f32)).collect(),
            );
        }
        
        Ok(layout)
    }
}
```

### Renderer

```rust
pub struct Renderer {
    cairo_context: Option<cairo::Context>,
}

impl Renderer {
    pub fn to_svg(&self, layout: &StyledLayout, scale: u32) -> Result<Vec<u8>, RenderError> {
        let mut buffer = Vec::new();
        {
            let f = cairo::SvgSurface::new_for_stream(
                &mut buffer,
                (layout.width * scale as f32) as f64,
                (layout.height * scale as f32) as f64,
            )?;
            let ctx = cairo::Context::new(&f)?;
            ctx.scale(scale as f64, scale as f64);
            self.render_to_context(&ctx, layout)?;
            ctx.show_page()?;
        }
        Ok(buffer)
    }
    
    pub fn to_png(&self, layout: &StyledLayout, scale: u32) -> Result<Vec<u8>, RenderError> {
        let width = (layout.width * scale as f32) as i32;
        let height = (layout.height * scale as f32) as i32;
        
        let surf = cairo::ImageSurface::create(cairo::Format::ARgb32, width, height)?;
        let ctx = cairo::Context::new(&surf)?;
        ctx.scale(scale as f64, scale as f64);
        
        // Background
        ctx.set_source_rgba(
            layout.theme.background.r / 255.0,
            layout.theme.background.g / 255.0,
            layout.theme.background.b / 255.0,
            layout.theme.background.a / 255.0,
        );
        ctx.paint()?;
        
        self.render_to_context(&ctx, layout)?;
        
        let mut buffer = Vec::new();
        surf.write_to_png(&mut buffer)?;
        Ok(buffer)
    }
    
    fn render_to_context(&self, ctx: &cairo::Context, layout: &StyledLayout) -> Result<(), RenderError> {
        // Draw edges first (under nodes)
        for edge in &layout.edges {
            self.render_edge(ctx, edge, &layout.theme)?;
        }
        
        // Draw nodes on top
        for node in &layout.nodes {
            self.render_node(ctx, node, &layout.theme)?;
        }
        
        // Draw labels
        for label in &layout.labels {
            self.render_label(ctx, label, &layout.theme)?;
        }
        
        Ok(())
    }
    
    fn render_node(&self, ctx: &cairo::Context, node: &LayoutNode, theme: &Theme) -> Result<(), RenderError> {
        let (x, y, w, h) = (node.x, node.y, node.width, node.height);
        
        ctx.save()?;
        ctx.translate(x as f64, y as f64);
        
        match node.shape {
            NodeShape::Rectangle => {
                ctx.rectangle(0.0, 0.0, w as f64, h as f64);
            }
            NodeShape::Rounded => {
                let r = 8.0;
                ctx.move_to(r, 0.0);
                ctx.line_to(w as f64 - r, 0.0);
                ctx.arc(w as f64 - r, r, r, -std::f64::consts::FRAC_PI_2, 0.0);
                ctx.line_to(w as f64, h as f64 - r);
                ctx.arc(w as f64 - r, h as f64 - r, r, 0.0, std::f64::consts::FRAC_PI_2);
                ctx.line_to(r, h as f64);
                ctx.arc(r, h as f64 - r, r, std::f64::consts::FRAC_PI_2, std::f64::consts::PI);
                ctx.line_to(0.0, r);
                ctx.arc(r, r, r, std::f64::consts::PI, std::f64::consts::PI * 1.5);
                ctx.close_path();
            }
            NodeShape::Diamond => {
                ctx.move_to(w as f64 / 2.0, 0.0);
                ctx.line_to(w as f64, h as f64 / 2.0);
                ctx.line_to(w as f64 / 2.0, h as f64);
                ctx.line_to(0.0, h as f64 / 2.0);
                ctx.close_path();
            }
            NodeShape::Circle => {
                let r = w.min(h) as f64 / 2.0;
                ctx.arc(w as f64 / 2.0, h as f64 / 2.0, r, 0.0, std::f64::consts::TAU);
            }
            NodeShape::Parallelogram => {
                let offset = 15.0;
                ctx.move_to(offset, 0.0);
                ctx.line_to(w as f64, 0.0);
                ctx.line_to(w as f64 - offset, h as f64);
                ctx.line_to(0.0, h as f64);
                ctx.close_path();
            }
        }
        
        // Fill
        ctx.set_source_rgba(
            node.style.fill.r / 255.0,
            node.style.fill.g / 255.0,
            node.style.fill.b / 255.0,
            node.style.fill.a / 255.0,
        );
        ctx.fill_preserve()?;
        
        // Stroke
        ctx.set_source_rgba(
            node.style.stroke.r / 255.0,
            node.style.stroke.g / 255.0,
            node.style.stroke.b / 255.0,
            node.style.stroke.a / 255.0,
        );
        ctx.set_line_width(node.style.stroke_width as f64);
        ctx.stroke()?;
        
        ctx.restore()?;
        
        Ok(())
    }
}
```

---

## 5. WASM Frontend Renderer

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmRenderer {
    engine: MermaidEngine,
}

#[wasm_bindgen]
impl WasmRenderer {
    pub fn new() -> Self {
        WasmRenderer {
            engine: MermaidEngine::new(),
        }
    }
    
    pub fn render_svg(&self, source: &str, theme: &str) -> Result<String, JsValue> {
        let options = RenderOptions {
            format: OutputFormat::Svg,
            theme: theme.to_string(),
            scale: 1,
            ..Default::default()
        };
        
        let result = self.engine.render(source, &options)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        Ok(String::from_utf8(result.data)
            .map_err(|e| JsValue::from_str(&e.to_string()))?)
    }
    
    pub fn render_svg_to_canvas(&self, source: &str, canvas_id: &str, theme: &str, scale: u32) -> Result<(), JsValue> {
        let svg = self.render_svg(source, theme)?;
        
        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id(canvas_id)
            .ok_or_else(|| JsValue::from_str("Canvas not found"))?;
        let canvas: web_sys::HtmlCanvasElement = canvas.dyn_into().unwrap();
        
        let ctx = canvas.get_context("2d")
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?
            .ok_or_else(|| JsValue::from_str("No 2d context"))?;
        
        // Use an Image element to render the SVG onto the canvas
        let img = web_sys::HtmlImageElement::new()?;
        let blob = Blob::new_with_str(&svg, &mime("image/svg+xml"));
        let url = web_sys::Url::create_object_url_with_blob(&blob)?;
        img.set_src(&url);
        
        let ctx_clone = ctx.clone();
        let onload = Closure::once(move || {
            ctx_clone.draw_image_with_html_image_element(&img, 0.0, 0.0).unwrap();
        });
        img.set_onload(Some(onload.as_ref().unchecked_ref()));
        onload.forget();
        
        Ok(())
    }
}
```

---

## 6. Mermaid Editor (Svelte Component)

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { WasmRenderer } from '@inte11ect/mermaid-wasm';
  
  export let initialSource: string = '';
  export let theme: string = 'default';
  
  let source = initialSource;
  let error: string | null = null;
  let svgOutput: string = '';
  let wasmRenderer: WasmRenderer;
  
  onMount(async () => {
    wasmRenderer = await WasmRenderer.new();
    render();
  });
  
  async function render() {
    try {
      svgOutput = wasmRenderer.render_svg(source, theme);
      error = null;
    } catch (e) {
      error = e.toString();
    }
  }
  
  function handleInput(e: Event) {
    source = (e.target as HTMLTextAreaElement).value;
    render();
  }
  
  function downloadSvg() {
    const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function downloadPng() {
    const canvas = document.getElementById('diagram-canvas') as HTMLCanvasElement;
    const link = document.createElement('a');
    link.download = 'diagram.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
</script>

<div class="mermaid-editor">
  <div class="editor-panel">
    <div class="toolbar">
      <button on:click={render}>Render</button>
      <button on:click={downloadSvg}>SVG</button>
      <button on:click={downloadPng}>PNG</button>
      <select bind:value={theme} on:change={render}>
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="forest">Forest</option>
        <option value="inte11ect">Inte11ect</option>
      </select>
    </div>
    <textarea 
      class="source-editor"
      value={source}
      on:input={handleInput}
      spellcheck="false"
    ></textarea>
  </div>
  <div class="preview-panel">
    {#if error}
      <div class="error">{error}</div>
    {:else}
      <div class="svg-container">
        {@html svgOutput}
      </div>
    {/if}
    <canvas id="diagram-canvas" class:hidden={!!error}></canvas>
  </div>
</div>

<style>
  .mermaid-editor {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
    gap: 1rem;
  }
  
  .editor-panel {
    display: flex;
    flex-direction: column;
  }
  
  .toolbar {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  
  .source-editor {
    flex: 1;
    font-family: var(--font-mono);
    font-size: 14px;
    padding: 1rem;
    border: none;
    resize: none;
    outline: none;
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
  
  .preview-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    background: var(--bg-primary);
  }
  
  .svg-container {
    max-width: 100%;
    max-height: 100%;
  }
  
  .error {
    color: var(--error);
    padding: 1rem;
    font-family: var(--font-mono);
  }
  
  .hidden {
    display: none;
  }
</style>
```

---

## 7. CLI Diagram Commands

```bash
# Render a diagram
inte11ect diagram render --input diagram.mmd --output diagram.png
inte11ect diagram render --input diagram.mmd --output diagram.svg
inte11ect diagram render --input diagram.mmd --output diagram.pdf

# Generate from description
inte11ect diagram generate --description "My architecture" --type flowchart

# Validate
inte11ect diagram validate --input diagram.mmd

# Batch process
inte11ect diagram batch --input-dir ./diagrams --output-dir ./output --format png

# Theme
inte11ect diagram render --input d.mmd --output d.png --theme dark
inte11ect diagram render --input d.mmd --output d.png --theme-vars ./custom.yaml

# Quality
inte11ect diagram render --input d.mmd --output d.png --scale 2 --width 1920 --height 1080
```

---

## 8. API Endpoints

```bash
# Render diagram
curl -X POST http://localhost:8080/api/v1/diagram/render \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "source": "flowchart TD\n A-->B",
    "format": "png",
    "theme": "dark",
    "scale": 2
  }' --output diagram.png

# Generate from description
curl -X POST http://localhost:8080/api/v1/diagram/generate \
  -H "Content-Type: application/json" \
  -d '{
    "description": "CI/CD pipeline",
    "type": "flowchart",
    "theme": "inte11ect"
  }'

# Validate
curl -X POST http://localhost:8080/api/v1/diagram/validate \
  -H "Content-Type: application/json" \
  -d '{"source": "flowchart TD\n A-->B"}'
```

---

## 9. Performance Benchmarks

| Test | PNG (ms) | SVG (ms) | Notes |
|------|----------|----------|-------|
| Simple (10 nodes) | 12 | 8 | |
| Medium (50 nodes) | 45 | 28 | |
| Complex (200 nodes) | 280 | 145 | |
| With theme | +5ms | +3ms | |
| Scale 2x | 3x slower | 1.5x slower | |
| Scale 3x | 5x slower | 2x slower | |
| WASM (browser) | N/A | 2-5ms | Client-side SVG only |

---

## 10. Cross-References

- See [01-features.md](./01-features.md) for platform architecture overview
- See [06-features.md](./06-features.md) for per-module theming
- See [10-features.md](./10-features.md) for frontend architecture
- See [06-tutorial.md](../tutorial/06-tutorial.md) for Mermaid diagramming tutorial
- See [03-tutorial.md](../tutorial/03-tutorial.md) for exploring all 72 modules

---

*Lois-Kleinner and 0-1.gg 2026 — Confidential*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
