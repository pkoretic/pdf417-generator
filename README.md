<div style="display: flex; justify-content: space-evenly; align-items: center; flex-wrap: wrap;
margin-bottom: 50px">
    <div>
        <textarea id="code" cols="30" rows="15" oninput="generate()" onchange="generate" style="display: block"></textarea>
        <label>Aspect Ratio
            <input id="aspectratio" type="number" oninput="generate()" onchange="generate"  style="display: block">
        </label>
    </div>
    <canvas id="barcode" ></canvas>
<div>

<script src="https://cdn.jsdelivr.net/gh/pkoretic/pdf417-generator@master/lib/pdf417.js" type="text/javascript"></script>
<script type="text/javascript">

window.onload = function()
{
    var code = HUB3.format({
        amount:        123.55,
        payerName:     "PETAR KORETIĆ",
        payerAddress:  "PREVOJ DD",
        payerCity:     "10000 Zagreb",
        recipientName: "FIRMA J.D.O.O",
        recipientAddr: "PREVOJ DD",
        recipientCity: "10000 ZAGREB",
        iban:          "HR1210010051863000160",
        model:         "HR01",
        callNumber:    "7336-68949637625-00001",
        purposeCode:   "COST",
        description:   "Uplata za 1. mjesec"
    })

    document.getElementById("code").value = code
    document.getElementById("aspectratio").value = 2
    generate()
}

function generate()
{
    var code = document.getElementById("code").value
    var aspectratio = Number(document.getElementById("aspectratio").value)
    var canvas = document.getElementById("barcode")
    PDF417.draw(code, canvas, aspectratio)
}
</script>
