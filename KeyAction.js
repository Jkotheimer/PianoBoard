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
        if(evkey == "Q") {
            x = document.getElementById("C2");
            note = document.getElementById("C2.mp3");
            dcolor = "#CCCCCC";
            ucolor = "#FFFFFF";
        }
        else if(evkey == "2" || evkey == "@") {
            x = document.getElementById("C#2");
            note = document.getElementById("C#2.mp3");
            dcolor = "#333333";
            ucolor = "#000000";
        }
        else if(evkey == "W") {
            x = document.getElementById("D2");
            note = document.getElementById("D2.mp3");
            dcolor = "#CCCCCC";
            ucolor = "#FFFFFF";
        }
        else if(evkey == "3" || evkey == "#") {
            x = document.getElementById("D#2");
            note = document.getElementById("D#2.mp3");
            dcolor = "#333333";
            ucolor = "#000000";
        }
        else if(evkey == "E") {
            x = document.getElementById("E2");
            note = document.getElementById("E2.mp3");
            dcolor = "#CCCCCC";
            ucolor = "#FFFFFF";
        }
        else if(evkey == "R") {
            x = document.getElementById("F2");
            note = document.getElementById("F2.mp3");
            dcolor = "#CCCCCC";
            ucolor = "#FFFFFF";
        }
        else if(evkey == "5" || evkey == "%") {
            x = document.getElementById("F#2");
            note = document.getElementById("F#2.mp3");
            dcolor = "#333333";
            ucolor = "#000000";
        }
        else if(evkey == "T") {
            x = document.getElementById("G2");
            note = document.getElementById("G2.mp3");
            dcolor = "#CCCCCC";
            ucolor = "#FFFFFF";
        }
        else if(evkey == "6" || evkey == "^") {
            x = document.getElementById("G#2");
            note = document.getElementById("G#2.mp3");
            dcolor = "#333333";
            ucolor = "#000000";
        }
        else if(evkey == "Y") {
            x = document.getElementById("A2");
            note = document.getElementById("A2.mp3");
            dcolor = "#CCCCCC";
            ucolor = "#FFFFFF";
        }
        else if(evkey == "7" || evkey == "&") {
            x = document.getElementById("A#2");
            note = document.getElementById("A#2.mp3");
            dcolor = "#333333";
            ucolor = "#000000";
        }
        else if(evkey == "U") {
            x = document.getElementById("B2");
            note = document.getElementById("B2.mp3");
            dcolor = "#CCCCCC";
            ucolor = "#FFFFFF";
        }
        else if(evkey == "I") {
            x = document.getElementById("C3");
            note = document.getElementById("C3.mp3");
            dcolor = "#CCCCCC";
            ucolor = "#FFFFFF";
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