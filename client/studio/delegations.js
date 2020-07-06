var letterz = new Set(["tab","1","q","2","w","e","4","r","5","t","6","y","u","8","i","9","o","p","-","[",
                        "=","]","backspace","\\","z","s","x","d","c","v","g","b","h","n","j","m",","]);
document.addEventListener("keydown", function(event) {
    keyIsDown = true;
    var key = event.key.toLowerCase();
    if(event.keyCode == 32 && !event.srcElement.id.includes("Tname") && !event.srcElement.id.includes("TEMPOOO")) {
        event.preventDefault();
    }
    else if(key == "Shift") {
        reso = true;
        event.preventDefault();
    }
    else if(letterz.has(key) && !event.srcElement.id.includes("Tname") && 
            !event.srcElement.id.includes("TEMPOOO") && !event.srcElement.id.includes("Numerator")){
        action(event);
    }
    else if(event.key.includes("Arrow")) {
        Scrub(event);
    }
});
document.addEventListener("keyup", function(event) {
    keyIsDown = false;
    var evkey = event.key.toLowerCase();
    if (event.keyCode == 32) {
        if(!event.srcElement.id.includes("Tname")) {
            event.preventDefault();
            togglePP(event);
        }
    }
    else if(event.key == "Shift") {
        reso = false;
        event.preventDefault();
    }
    else if(event.key == "Delete") {
        alertDeleteRec("recording", event);
    }
    if(!event.srcElement.id.includes("Tname") && !event.srcElement.id.includes("TEMPOOO")){
        action(event);
    }
});
document.addEventListener("mousedown", function() {mouseIsDown = true;});
document.addEventListener("mouseup", function() {mouseIsDown = false;});
window.addEventListener("contextmenu", e => {
    e.preventDefault();
});