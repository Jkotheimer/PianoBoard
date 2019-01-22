var x = null;
var note = null;
var dcolor = null;
var ucolor = null;
function volFader() {
    var fadePoint = note.currentTime + 1;
    var first = false;
    var fadeAudio = setInterval(function () {
        if(note.volume == 1.0 && first == true){
            return false;
        }
        if ((note.currentTime <= fadePoint) && (note.volume >= 0.03)) {
            note.volume -= 0.01;
        }
        first = true;
        if (note.volume < 0.03) {
            clearInterval(fadeAudio);
        }
    }, 10);
    return false;
}
function action(event) {
    var lastkey = document.getElementById("lastKey");
    if(lastkey.value == event.key && lastkey.val2 == event.type && event.key != "hellYeah"){
        return false;
    }
    else if(event.key != "hellYeah"){
        lastkey.value = event.key;
        lastkey.val2 = event.type;
    }
    if(event.type == "mousedown") {
        var K;
        if(event.key == "hellYeah"){
            K = event.srcElement;
        }
        else {
            K = event.srcElement.id;
        }
        if(K.includes("#")){
            document.getElementById(K).style.background = "#333333"
        }
        else {
            document.getElementById(K).style.background = "#CCCCCC"
        }
        note = document.getElementById(K + ".mp3");
        note.volume = 1.0;
        note.load();
        note.play();
    }
    else if(event.type == "mouseup") {
        var K;
        if(event.key == "hellYeah"){
            K = event.srcElement;
        }
        else {
            K = event.srcElement.id;
        }
        if(K.includes("#")){
            document.getElementById(K).style.background = "#000000"
        }
        else {
            document.getElementById(K).style.background = "#FFFFFF"
        }
        note = document.getElementById(K + ".mp3");
        if(event.key != "hellYeah"){
            volFader();
        }
    }
    else if(event.type.includes("key")){
         //if the event is a keystroke, take note of which key was used
        var evkey = event.key.toUpperCase();
        switch(evkey) {
            case "TAB": getNote("C2"); break;
            case "1" || "!": getSharpNote("C#2"); break;
            case "Q": getNote("D2"); break;
            case "2" || "@": getSharpNote("D#2"); break;
            case "W": getNote("E2"); break;
            case "E": getNote("F2"); break;
            case "4" || "$": getSharpNote("F#2"); break;
            case "R": getNote("G2"); break;
            case "5" || "%": getSharpNote("G#2"); break;
            case "T": getNote("A2"); break;
            case "6" || "^": getSharpNote("A#2"); break;
            case "Y": getNote("B2"); break;
            case "U": getNote("C3"); break;
            case "8" || "*": getSharpNote("C#3"); break;
            case "I": getNote("D3"); break;
            case "9" || "(": getSharpNote("D#3"); break;
            case "O": getNote("E3"); break;
            case "P": getNote("F3"); break;
            case "-" || "_": getSharpNote("F#3"); break;
            case "[": getNote("G3"); break;
            case "=" || "+": getSharpNote("G#3"); break;
            case "]": getNote("A3"); break;
            case "BACKSPACE" || "^": getSharpNote("A#3"); break;
            case "\\": getNote("B3"); break;
            case "Z": getNote("C4"); break;
            case "S": getSharpNote("C#4"); break;
            case "X": getNote("D4"); break;
            case "D": getSharpNote("D#4"); break;
            case "C": getNote("E4"); break;
            case "V": getNote("F4"); break;
            case "G": getSharpNote("F#4"); break;
            case "B": getNote("G4"); break;
            case "H": getSharpNote("G#4"); break;
            case "N": getNote("A4"); break;
            case "J": getSharpNote("A#4"); break;
            case "M": getNote("B4"); break;
            case ",": getNote("C5"); break;
        }
        
        if(event.type == "keydown") {
            x.style.background = dcolor;
            note.volume = 1.0;
            note.load();
            note.play();
        }
        if(event.type == "keyup") {
            x.style.background = ucolor;
            volFader();
        }                        
    }
    return false;
}

function getNote(N) {
    x = document.getElementById(N);
    note = document.getElementById(N + ".mp3");
    dcolor = "#CCCCCC";
    ucolor = "#FFFFFF";
}
function getSharpNote(N) {
    x = document.getElementById(N);
    note = document.getElementById(N + ".mp3");
    dcolor = "#333333";
    ucolor = "#000000";
}
function sweep(identifier) {
    if(document.getElementById("lastKey").val2 == "mousedown") {
        var EV = {key:"hellYeah", type:"mousedown", srcElement:identifier};
        action(EV);
    }
}
function sweepout(identifier) {
    if(document.getElementById("lastKey").val2 == "mousedown") {
        var EV = {key:"hellYeah", type:"mouseup", srcElement:identifier};
        action(EV);
    }
}