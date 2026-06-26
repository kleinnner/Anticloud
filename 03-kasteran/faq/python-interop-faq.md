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

# Kasteran* — Python Interop FAQ
© Lois-Kleinner & 0-1.gg 2026

## Can Kasteran* call Python code?

Yes, Kasteran* has a `#[python]` attribute that enables calling Python functions:
```
#[python]
fn pandas_read_csv(path: String) -> DataFrame
```

## How does the #[python] attribute work?

The `#[python]` attribute generates FFI bindings to the Python C API:
1. The function signature is checked at compile time
2. Python objects are automatically converted to Kasteran* types
3. The Python GIL is managed automatically
4. Errors are converted to Kasteran* result types

## Can Python call Kasteran*?

Yes, Kasteran* modules can be compiled to shared libraries callable from Python:
```
kasteran build --library my_module.krn
```

Then in Python:
```python
from my_module import my_function
result = my_function(42)
```

## How is data shared?

Data can be shared in several ways:
- **By value**: Python types are converted to Kasteran* types and vice versa
- **By pointer**: Memory buffers can be shared without copying
- **By serialization**: Complex data can be serialized (MessagePack, JSON)

## What types are supported for conversion?

| Python Type | Kasteran* Type |
|---|---|
| int | i32, i64 |
| float | f32, f64 |
| str | String |
| bool | bool |
| list | [T] |
| dict | Map<K, V> |
| bytes | [u8] |
| None | Optional::None |

## What is the performance overhead?

Python interop adds overhead:
- Function call: ~100ns (compared to ~1ns for native calls)
- Type conversion: 10-100ns depending on type
- GIL management: ~50ns
- Object reference counting: ~20ns

For performance-critical code, batch operations minimize overhead.

## Can I use Python libraries?

Yes, you can use any Python library:
```
#[python]
fn numpy_array(data: [f64]) -> PyObject

fn process_data(data: [f64]) -> [f64] {
    let np_array = numpy_array(data)
    let result = scipy_operation(np_array)
    return result
}
```

## Conclusion

Kasteran* Python interop enables seamless integration with the Python ecosystem, allowing you to use Python libraries while writing performance-critical code in Kasteran*.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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