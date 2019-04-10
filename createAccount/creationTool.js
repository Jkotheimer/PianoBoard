/**var genres = ["aleatoric music", "alternative country", "alternative dance", "alternative hip hop",
    "alternative metal", "alternative rock", "ambient", "ambient house", "ambient music", "americana", 
    "anarcho punk", "anime music", "anti-folk", "apala", "ape haters", "arab pop", "arabesque", "arabic pop", 
    "argentine rock", "ars antiqua", "ars nova", "art punk", "art rock"];
*/

var genres = readTextFile("../samples/Data/genres.txt");
var used = new Set([-1]);
var pFade = setInterval(function() {
    if(used.size == genres.length) {
        used.clear();
        used.add(-1);
    }
    var rand = -1;
    while(used.has(rand)) rand = Math.floor(Math.random() * genres.length);
    used.add(rand);
    document.getElementById("genre_input").placeholder = genres[rand];
}, 2000);

function grabSimilarGenres(event) {
    var infield = document.getElementById("genre_input");
    var input = infield.value;
    if(event.keyCode > 64 && event.keyCode < 91) input += event.key;
    else if(event.keyCode == 8) input = input.substring(0, input.length - 1);
    var autocomplete = document.getElementById("genre_autocomplete");
    autocomplete.innerHTML = "";
    if(input == "") {
        autocomplete.style.visibility = "hidden";
        infield.style.borderRadius = "10px";
        return;
    }
    else {
        autocomplete.style.visibility = "visible";
        infield.style.borderRadius = "10px 10px 0 0";
    }
    var count = 0;
    for(let item of genres.entries()) {
        if(item[1].substr(0,input.length).includes(input)) {
            var newButton = createNewButton(item[1]);
            autocomplete.appendChild(newButton);
        }
        count++;
        if(count > 17) break;
    }
    
    console.log(document.getElementById("loader").style.height);
    if(autocomplete.innerHTML == "") {
        autocomplete.style.visibility = "hidden";
        infield.style.borderRadius = "10px";
    }
}

function createNewButton(name) {
    var b = document.createElement("button");
    b.addEventListener("mousedown", function() {
        b.style.borderColor = "#9263A6";
        b.style.backgroundColor = "#07C0A7"
    })
    b.addEventListener("mouseup", function() {
        b.style.borderColor = "#C293D6";
        b.style.backgroundColor = "transparent"
        //TODO add the genre to the genres panel
    });
    b.addEventListener("mouseover", function() {
        b.style.borderColor = "#C293D6";
    });
    b.addEventListener("mouseout", function() {
        b.style.borderColor = "#444";
    });
    b.addEventListener("focus", function() {
        b.style.outline = "none";
    });
    
    var node = document.createTextNode(name);
    b.appendChild(node);
    b.style.border = "2px solid #444";
    b.style.backgroundColor = "transparent";
    b.style.color = "#444";
    b.style.borderRadius = "5px";
    b.style.width = "45%";
    b.style.margin = "5px";
    b.style.padding = "2px";
    b.style.transition = ".2s ease";
    return b
}

function readTextFile(file) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr){
        xhr.open("GET", file, true);
    } else if (typeof XDomainRequest != "undefined"){
        console.log("Second one");
        xhr.open("GET", file);
    }
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4) {
            if(xhr.status === 200 || xhr.status == 0) {
                var allText = xhr.responseText;
                console.log(allText);
                return allText;
            }
        }
    }
    xhr.send();
}