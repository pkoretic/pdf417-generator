const Canvas = require("canvas")
const PDF417 = require("pdf417-generator")

const code =
`HRVHUB30
HRK
000000000012355
PETAR KORETIĆ
PREVOJ DD
10000 Zagreb
QAAP J.D.O.O
PREVOJ DD
10000 ZAGREB
HR5041240000000000
HR01
7336-68949637625-00001
COST
Uplata za 1. mjesec`

let canvas = new Canvas()
PDF417.draw(code, canvas)

// create image which can be sent in an e-mail or similar
console.log(`<img src="${canvas.toDataURL()}" />`)
