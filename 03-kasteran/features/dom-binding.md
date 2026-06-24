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

# Kasteran* — DOM Binding

© Lois-Kleinner & 0-1.gg 2026

## Overview

The `<>` anchor rune connects Kasteran* programs running in WebAssembly to the browser DOM. It provides a shared memory buffer abstraction that synchronizes data between the WASM linear memory and JavaScript/Web API objects.

## Basic DOM Binding

```
<> "#app"
```

This binds to the DOM element with `id="app"`. After binding, text content can be set:

```
<> "Hello from Kasteran*!"
```

## Shared Memory Buffer

Under the hood, `<>` allocates a shared memory buffer using `SharedArrayBuffer` (or falls back to copying for compatibility). The buffer layout is:

```
| Offset | Size | Content |
|--------|------|---------|
| 0      | 4    | Length of string |
| 4      | N    | UTF-8 encoded string data |
```

## Bidirectional Binding

DOM bindings can be bidirectional:

```
<> ".counter"    // read/write binding
count :~ 0
count = count + 1
<> count.to_string()
```

When the DOM element changes (e.g., input field), the value is written back to the WASM buffer.

## Graph

```
graphify {
    <> "selector" -> DOMManager
    DOMManager -> {SharedBuffer, JSGlue, EventBridge}
    SharedBuffer -> {WASMMem, ArrayBuffer, TextEncoder}
    JSGlue -> {WebAssembly.Instance, ImportObject}
    EventBridge -> {onclick, oninput, onchange}
}
```

## Event Handling

```
<> "#button"
<> "Click me"

// The `<>` binding can wire events:
<> handle_click => |_ event {
    print("Button clicked!")
}
```

## Integration with web-sys

The WASM backend uses `wasm-bindgen` and `web-sys` under the hood:

```javascript
// Generated glue code
const selector = document.querySelector("#app");
const buffer = new Uint8Array(instance.exports.memory.buffer);
// TextDecoder for WASM -> DOM
// TextEncoder for DOM -> WASM
```

## Example: Interactive Counter

```
|+ main() -> i32 {
    count :~ 0

    <> "#counter-display"
    <> count.to_string()

    <> "#increment-btn"
    <> handle_click => || {
        count = count + 1
        <> count.to_string()
    }

    => 0
}
```

## Example: Todo List

```
|+ render(items: [string]) {
    html :~ ""
    i := 0
    while i < items.len {
        html = html + "<li>" + items[i] + "</li>"
        i = i + 1
    }
    <> "#todo-list"
    <> html
}

|+ add_todo(items: [string], new_item: string) -> [string] {
    items.push(new_item)
    render(items)
    => items
}
```

## Limitations

- Requires browser with `SharedArrayBuffer` support
- Falls back to copying for older browsers
- Text-only by default; raw HTML requires opt-in via `<> raw`
- Event handling requires explicit binding call
- No direct Canvas/WebGL access — use `!@` unsafe for that
</```
