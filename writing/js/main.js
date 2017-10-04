document.getElementById('input_form').addEventListener('submit', analyze, false);

function analyze(e) {
    e.preventDefault();
    var input =  document.getElementById("input").value;
    console.log(input);
    // do stuff
    if (input != "")  {
      // document.getElementById("print_output").innerHTML = intersperse( dracula(input, false), "&emsp;").join("");
      inputarr = input.split(" ");
      outputarr = dracula(input, false);
      tableCreate( inputarr, outputarr );

  }
}


function intersperse(arr, el) {
    var res = [], i=0;
    if (i < arr.length)
        res.push(arr[i++]);
    while (i < arr.length)
        res.push(el, arr[i++]);
    return res;
}

function tableCreate( input, output ) {
    var tbl = document.getElementById('output_table');
    while (tbl.hasChildNodes()) {
      tbl.removeChild(tbl.lastChild);
    }
    // tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < 2; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < output.length; j++) {
              var td = document.createElement('td');
            if (i==1) {
              child = document.createTextNode(output[j]);
              td.className = ('output');
              td.appendChild(child);
            } else {
              child = document.createTextNode(input[j]);
              td.className = ('input');
              td.appendChild(child);
            }
            tr.appendChild(td)
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
}
