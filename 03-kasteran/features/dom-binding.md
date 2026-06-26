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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com