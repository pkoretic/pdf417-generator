const { createCanvas } = require("canvas")
const { PDF417, HUB3 } = require("../../lib/pdf417")
const fs = require("fs")

const code = HUB3.format({
    amount:        123.55,
    payerName:     "PETAR KORETIĆ",
    payerAddress:  "PREVOJ DD",
    payerCity:     "10000 Zagreb",
    recipientName: "FIRMA J.D.O.O",
    recipientAddr: "PREVOJ DD",
    recipientCity: "10000 ZAGREB",
    iban:          "HR5041240000000000000",
    model:         "HR01",
    callNumber:    "7336-68949637625-00001",
    purposeCode:   "COST",
    description:   "Uplata za 1. mjesec"
})

let canvas = createCanvas(1, 1)
PDF417.draw(code, canvas)

// create image which can be sent in an e-mail or similar
console.log(`<img src="${canvas.toDataURL()}" />`)

// save as PNG file
fs.writeFileSync("barcode.png", canvas.toBuffer("image/png"))
