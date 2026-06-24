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
