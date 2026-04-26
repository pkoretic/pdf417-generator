<div style="display: flex; justify-content: space-evenly; align-items: center; flex-wrap: wrap;
margin-bottom: 50px">
    <div>
        <textarea id="code" cols="30" rows="15" oninput="generate()" onchange="generate" style="display: block"></textarea>
        <label style="display: block; margin-top: 6px">Aspect Ratio &nbsp; 1 : <input id="aspectratio" type="number" oninput="generate()" onchange="generate" style="width: 4em"></label>
    </div>
    <canvas id="barcode" ></canvas>
<div>

<script src="https://cdn.jsdelivr.net/gh/pkoretic/pdf417-generator@master/lib/pdf417.js" type="text/javascript"></script>
<script type="text/javascript">

window.onload = function()
{
    var code = "HRVHUB30\nEUR\n" +
        "000000000012355\n" +
        "PETAR KORETIĆ\n" +
        "PREVOJ DD\n" +
        "10000 Zagreb\n" +
        "FIRMA J.D.O.O\n" +
        "PREVOJ DD\n" +
        "10000 ZAGREB\n" +
        "HR1210010051863000160\n" +
        "HR01\n" +
        "7336-68949637625-00001\n" +
        "COST\n" +
        "Uplata za 1. mjesec\n";

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
