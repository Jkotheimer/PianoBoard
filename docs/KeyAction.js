var x = null;
var note = null;
var dcolor = null;
var ucolor = null;
function volFader(event) {
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
    if(lastkey.value == event.key && lastkey.val2 == event.type){
        return false;
    }
    else{
        lastkey.value = event.key;
        lastkey.val2 = event.type;
    }
    if(event.type == "mousedown") {
        note = document.getElementById(event.srcElement.id + ".mp3");
        note.volume = 1.0;
        note.load();
        note.play();
    }
    else if(event.type == "mouseup") {
        note = document.getElementById(event.srcElement.id + ".mp3");
        volFader(event);
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
        }
        
        if(event.type == "keydown") {
            document.getElementById("lastKey").innerHTML = event.key;
            x.style.background = dcolor;
            note.volume = 1.0;
            note.load();
            note.play();
        }
        if(event.type == "keyup") {
            x.style.background = ucolor;
            volFader(event);
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