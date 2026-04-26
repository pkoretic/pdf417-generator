## PDF417 HUB3 Barcode Generator

This library provides you with the ability to generate PDF417 HUB3 Barcodes in browser or Node.js
apps. The final barcode is drawn into a canvas element and can be used for many different use cases.
The code is based on [pdf417-js](https://github.com/bkuzmic/pdf417-js).


### Browser

You can find a complete example at [examples/browser](examples/browser) and a running demo [here](https://pkoretic.github.io/pdf417-generator).

The usage is as simple as providing a canvas element and a text that should be used for barcode generation:

```html
<script src="https://cdn.jsdelivr.net/gh/pkoretic/pdf417-generator@master/lib/pdf417.js" type="text/javascript"></script>
```

**HTML**
```html
<canvas id="barcode"></canvas>
```

**JS**
```js
var code = HUB3.format({
    amount: 12355,                        // amount in euro cents
    sender: {
        name: "PETAR KORETIĆ",
        street: "PREVOJ DD",
        city: "10000 Zagreb"
    },
    receiver: {
        name: "pkoretic J.D.O.O",
        street: "PREVOJ DD",
        city: "10000 ZAGREB",
        iban: "HR1210010051863000160",
        model: "HR01",
        reference: "7336-68949637625-00001"
    },
    purpose: "COST",
    description: "Uplata za 1. mjesec"
})

var canvas = document.getElementById("barcode")
PDF417.draw(code, canvas)
```

### Node.js

You can find a complete example at [examples/node](examples/node).

The [node-canvas](https://github.com/Automattic/node-canvas) library is used for drawing. Requires Node.js 18.12+ or 20.9+.

Install the library:

```
npm install pdf417-generator
```

Use it as:

```js
const { createCanvas } = require("canvas")
const { PDF417, HUB3 } = require("pdf417-generator")

const code = HUB3.format({
    amount: 12355,                        // amount in euro cents
    sender: {
        name: "PETAR KORETIĆ",
        street: "PREVOJ DD",
        city: "10000 Zagreb"
    },
    receiver: {
        name: "FIRMA J.D.O.O",
        street: "PREVOJ DD",
        city: "10000 ZAGREB",
        iban: "HR1210010051863000160",
        model: "HR01",
        reference: "7336-68949637625-00001"
    },
    purpose: "COST",
    description: "Uplata za 1. mjesec"
})

const canvas = createCanvas(1, 1)
PDF417.draw(code, canvas)

// create an image which can be sent in an e-mail or similar
console.log(`<img src="${canvas.toDataURL()}" />`)
```


### TypeScript
```ts
import { PDF417, HUB3 } from 'pdf417-generator';

PDF417.draw(code, canvas);
```


### draw arguments

**code** - (string) code to encode as PDF417

**canvas** - (Canvas) Canvas instance

**aspectRatio** - (float) the width to height of the symbol (excluding quiet zones); default 2

**ecl** - (int) error correction level (0-8); default -1 = automatic correction level

**devicePixelRatio** - (int) extra pixel density for sharp rendering on retina screens; default `window.devicePixelRatio` if available

`draw()` throws an `Error` if the input exceeds PDF417's maximum capacity (925 data codewords, roughly 1850 text characters or 1108 bytes).


### HUB3.format arguments

`HUB3.format(options)` builds and validates a HUB-3A (HRVHUB30) payment slip string ready to pass to `PDF417.draw()`.

**amount** - (int) payment amount in euro cents (e.g. `12355` = 123.55 EUR)

**sender.name** - (string) payer name, max 30 chars

**sender.street** - (string) payer street, max 27 chars

**sender.city** - (string) payer city, max 27 chars

**receiver.name** - (string) recipient name, max 25 chars

**receiver.street** - (string) recipient street, max 25 chars

**receiver.city** - (string) recipient city, max 27 chars

**receiver.iban** - (string) recipient IBAN, must be 21 chars starting with `HR`

**receiver.model** - (string) payment model, e.g. `HR01`

**receiver.reference** - (string) payment reference

**purpose** - (string) 4-letter purpose code (e.g. `COST`)

**description** - (string) payment description, max 35 chars
