var pFade = setInterval(function() {
    // TODO get an API with a list of all the different genres
    // right here, add a part that 
    document.getElementById("genres").placeholder = null
}, 2000);

function grabSimilarGenres() {
    var genres = readTextFile("../samples/Data/genres.txt");
    console.log(genres);
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