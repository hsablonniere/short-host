# short-host

Represent any IPv4 based host like `A.B.C.D:P` as a short sequence of 1 to 10 chars:

- `A`, `B`, `C` and `D` are IPv4 numbers from `0` to `255`
- `P` is a network port number from `0` to `65535`
- Generated chars are lowercase letters or numbers (only `2`, `3`, `4`, `5`, `6` or `7`)

## Examples

- `192.168.0.15:8080` => `p`
- `192.168.0.27:8080` => `bw`
- `192.168.1.182:5173` => `3n`
- `192.168.0.27:4200` => `bwd`
- `192.168.1.85:3000` => `vkc`
- `192.168.1.111:443` => `w6os`
- `192.168.27.81:4444` => `dniqr`
- `192.168.27.81:7812` => `dnixuq`
- `4.15.167.243:8080` => `aqh2p4y`
- `4.15.167.243:123` => `aqh2p44s`
- `4.15.167.243:2345` => `aqh2p42j6`
- `4.15.167.243:56789` => `aqh2p4zxov`

## Why?

1. I wanted to have fun with a silly idea
2. I sometimes need to browse a local dev server on another device of my local network but it's very annoying to type the IP address and the port

## How to use?

- Use the bookmarklet below to generate the short host code from device A
- Add this [bookmark](https://hsablonniere.github.io/short-host) to browse the short host on device B

bookmarklet:

```
javascript:(function()%7Bvar%20url%20%3D%20new%20URL('https%3A%2F%2Fhsablonniere.github.io%2Fshort-host')%3B%0Aurl.searchParams.set('host'%2C%20location.host)%3B%0Alocation.href%20%3D%20url.toString()%3B%7D)()%3B
```

## npm library

You can use this in your projects to display short hosts.

### Installation

```
npm install short-host
```

### JavaScript usage

```js
import { toShortHost, fromShortHost } from 'short-host';

console.log(toShortHost('192.168.0.27:8080'));
// => "bw"

console.log(fromShortHost('bw'));
// => "192.168.0.27:8080"
```

## Details

The main goals and constraints were:

- Focus on local IPs starting with `192.168`, especially `192.168.0` and `192.168.1`.
- Favor HTTP ports often used in local dev like `8080`, `5173` or `3000`
- Be able to represent any IPv4 and port

You can have a look at [IMPLEMENTATION_DETAILS.md](./IMPLEMENTATION_DETAILS.md) to learn how the encoding/decoding works.
