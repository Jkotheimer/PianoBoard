var genres = ["aleatoric music", "alternative country", "alternative dance", "alternative hip hop",
    "alternative metal", "alternative rock", "ambient", "ambient house", "ambient music", "americana", "anarcho punk",
    "anime music", "anti-folk", "apala", "ape haters", "arab pop", "arabesque", "arabic pop", "argentine rock", 
    "ars antiqua", "ars nova", "art punk", "art rock"];

var used = new Set([-1]);
var pFade = setInterval(function() {
    // TODO get an API with a list of all the different genres
    // right here, add a part that 
    var rand = -1;
    while(used.has(rand)) rand = Math.floor(Math.random() * genres.length);

    document.getElementById("genres").placeholder = genres[rand];
}, 2000);

function grabSimilarGenres() {
    //var genres = readTextFile("../samples/Data/genres.txt");
    var input = document.getElementById("genres").nodeValue;
    var autocomplete = document.getElementById("genre_autocomplete");
    autocomplete.innerHTML = "FUCK";
    for(let item of genres.entries()) {
        if(item.includes(input)) {
            console.log("ass");
            autocomplete.innerHTML += item;
        }
    }
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
                return allText;
            }
        }
    }
    xhr.send();
}