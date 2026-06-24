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

# Kasteran* — Structs

© Lois-Kleinner & 0-1.gg 2026

## Defining Structs

Use `$$` (Struct) to define a struct type:

```
$$ Point = (x: f32, y: f32)
$$ Person = (name: string, age: i32)
```

## Struct Literals

Create struct instances with named fields:

```
origin := Point(x: 0.0, y: 0.0)
alice := Person(name: "Alice", age: 30)
```

## Field Access

Access fields with dot notation:

```
print(origin.x)
print(alice.name)
```

## Mutable Fields

Struct fields are immutable by default. Declare mutable fields with `:~`:

```
$$ Counter = (value :~ i32)

c := Counter(value :~ 0)
c.value = c.value + 1
```

## Nested Structs

```
$$ Address = (street: string, city: string)
$$ Employee = (name: string, addr: Address)

emp := Employee(name: "Bob", addr: Address(street: "123 Main", city: "NYC"))
print(emp.addr.city)
```

## Struct Methods

Define methods on structs with `|+` and the struct type:

```
$$ Vec2 = (x: f32, y: f32)

|+ length(v: Vec2) -> f32 {
    => sqrt(v.x * v.x + v.y * v.y)
}

v := Vec2(x: 3.0, y: 4.0)
l := length(v)  // 5.0
```

## Example

```
|+ main() -> i32 {
    $$ Book = (title: string, author: string, year: i32)
    
    book := Book(title: "1984", author: "Orwell", year: 1949)
    print(book.title + " by " + book.author)
    => 0
}
```
</```
