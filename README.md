## PDF417 HUB3 Barcode Generator

This library provides you with the ability to generate PDF417 HUB3 Barcodes in browser or Node.js
apps. The final barcode is drawn into a canvas element and can be used for many different use cases.
The code is based on the [bcmath-js](https://sourceforge.net/projects/bcmath-js) and
[pdf417-js](https://github.com/bkuzmic/pdf417-js).

### Browser

You can find a complete example at [examples/browser](examples/browser).

The usage is as simple as providing a canvas element and a text that should be used for barcode generation:

```
<script src="https://cdn.rawgit.com/qaap/pdf417-generator/master/lib/libbcmath.js" type="text/javascript"></script>
<script src="https://cdn.rawgit.com/qaap/pdf417-generator/master/lib/bcmath.js" type="text/javascript"></script>
<script src="https://cdn.rawgit.com/qaap/pdf417-generator/master/lib/pdf417.js" type="text/javascript"></script>
```

**HTML**
```
<canvas id="barcode" ></canvas>
```

**JS**
```
var code = "HRVHUB30\nHRK\n" +
"000000000012355\n"+
"PETAR KORETIĆ\n"+
"PREVOJ DD\n"+
"10000 Zagreb\n"+
"QAAP J.D.O.O\n"+
"PREVOJ DD\n"+
"10000 ZAGREB\n"+
"HR5041240000000000\n"+
"HR01\n"+
"7336-68949637625-00001\n"+
"COST\n"+
"Uplata za 1. mjesec\n";

var canvas = document.getElementById("barcode")
PDF417.draw(code, canvas)

```

### Node.js

You can find a complete example at [examples/node](examples/node).

Install the library:

```
npm install pdf417-generator
```

Use it as:

```
const Canvas = require("canvas")
const PDF417 = require("pdf417-generator")

const code = "HRVHUB30\nHRK\n" +
    "000000000012355\n"+
    "PETAR KORETIĆ\n"+
    "PREVOJ DD\n"+
    "10000 Zagreb\n"+
    "QAAP J.D.O.O\n"+
    "PREVOJ DD\n"+
    "10000 ZAGREB\n"+
    "HR5041240000000000\n"+
    "HR01\n"+
    "7336-68949637625-00001\n"+
    "COST\n"+
    "Uplata za 1. mjesec\n";

let canvas = new Canvas()
PDF417.draw(code, canvas)

// create an image which can be sent in an e-mail or similar
console.log('<img src="' + canvas.toDataURL() + '" />')
```

### Support

You can always open a new issue or [contact us](https://qaap.io) and we’ll help you sort it out.
