const Canvas = require('canvas')
const PDF417 = require("../../lib/pdf417")

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

// create image which can be sent in an e-mail or similar
console.log('<img src="' + canvas.toDataURL() + '" />')
