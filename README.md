<div style="display: flex; justify-content: space-evenly; align-items: center; flex-wrap: wrap;
margin-bottom: 50px">
    <textarea id="code" cols="30" rows="15" oninput="generate()" onchange="generate"></textarea>
    <canvas id="barcode" ></canvas>
<div>

<script src="https://cdn.rawgit.com/qaap/pdf417-generator/master/lib/libbcmath.js" type="text/javascript"></script>
<script src="https://cdn.rawgit.com/qaap/pdf417-generator/master/lib/bcmath.js" type="text/javascript"></script>
<script src="https://cdn.rawgit.com/qaap/pdf417-generator/master/lib/pdf417.js" type="text/javascript"></script>
<script type="text/javascript">

window.onload = function()
{
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

    document.getElementById("code").value = code
    generate()
}

function generate()
{
    var code = document.getElementById("code").value
    var canvas = document.getElementById("barcode")
    PDF417.draw(code, canvas)
}
</script>
