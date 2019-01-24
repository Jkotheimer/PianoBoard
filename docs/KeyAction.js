var x = null;
var note = null;
var dcolor = null;
var ucolor = null;
var DKEYS = new Set();
/*
volFader() is a function called when a pianokey is being released.
It would sound awfully shitty if the piano sound was immediately cut off, so we need to fade
the volume out. Of course this fading needs to be faster than the natural fade of the piano note,
so it only takes a second to be faded out. The volume does not fade all the way to zero because
for some reason the setInterval function bugs out if I try to do it, but 3% volume is good enough.
*/
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
/*
The action() function is used to play and release the piano keys. An input event is sent in as the
parameters (either keyup, keydown, mouseup, or mousedown). A connection is made between the input
source and a key on the virtual piano, and a sound is put out through the speakers as a result.
*/
function action(event) {
    // When a key is held down, it continually pushes input, so we check the last key and event type
    // to ensure that the sound of the note doesn't continue reloading and spaz out.
    var lastkey = document.getElementById("lastKey");
    if(event.srcElement.id == "board") return false;
    if(event.key != "hellYeah"){
        lastkey.value = event.key;
        lastkey.val2 = event.type;
    }
    //If the mouse is clicked on a note, play that note
    if(event.type == "mousedown") {
        var K;
        if(event.key == "hellYeah"){ //This is added for the sweeping function of the mouse
            K = event.srcElement;
        }
        else {
            K = event.srcElement.id;
        }
        if(K.includes("#")){
            document.getElementById(K).style.background = "#333333";
        }
        else {
            document.getElementById(K).style.background = "#CCCCCC";
        }
        document.getElementById(K).style.boxShadow = "0 .2vw .2vw black";
        note = document.getElementById(K + ".mp3");
        note.volume = 1.0;
        note.load();
        note.play();
    }
    //If the mouse is unclicked, reset the keys back to their original colors and fade out the sounds
    else if(event.type == "mouseup") {
        var K;
        if(event.key == "hellYeah"){
            K = event.srcElement;
        }
        else {
            K = event.srcElement.id;
        }
        if(K.includes("#")){
            document.getElementById(K).style.background = "#000000";
        }
        else {
            document.getElementById(K).style.background = "#FFFFFF";
        }
        document.getElementById(K).style.boxShadow = "0vw .5vw .5vw black";
        note = document.getElementById(K + ".mp3");
        if(event.key != "hellYeah"){ //If we are sweeping the notes, a little sustain sounds nicers
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
        //If it was a keyup event, change the color back, and fade the soundfile out
        if(event.type == "keyup") {
            volFader();
            x.style.background = ucolor;
            DKEYS.delete(x.id);
            x.style.boxShadow = "0vw .5vw .5vw black";
        }   
        //If the input is a keydown event, but that key is already down, chillax and don't do anything
        if(DKEYS.has(x.id)){
            return false;
        }
        //If it was a keydown event, change the color, turn up the volume, load the soundfile, and jam out!
        if(event.type == "keydown") {
            x.style.background = dcolor;
            x.style.boxShadow = "0vw .2vw .2vw black";
            DKEYS.add(x.id);
            note.volume = 1.0;
            note.load();
            note.play();
        }                     
    }
    return false;
}

//Set all of the important variables to the correct values based on whether the note is sharp or not
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
/*  
    These functions are used for when the user clicks on a key and sweeps the mouse across the piano.
    These functions give the piano the ability to ring out all of the notes that the mouse runs over
    between the time the mouse is clicked and unclicked. 
*/
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

var TRACKS = new Set();
function addTrack() {
    var init = document.getElementById("initTrack");
    var newTrack = document.getElementById("TrackTemplate").cloneNode(true);
    document.body.appendChild(newTrack);
    var TrackNum = Number(init.title);
    TrackNum++;
    newTrack.id = TrackNum.toString();
    TRACKS.add(newTrack.id);
    newTrack.style.cssText = "display: block;";
    init.title = TrackNum.toString();
    var nTop = 40 + (8*(TrackNum-1));
    newTrack.style.cssText = "top: " + nTop + "vw;";
    document.getElementById("AddTrack").style.cssText = "top: " + (nTop+10) + "vw;";
    document.getElementById("Export").style.cssText = "top: " + (nTop+10) + "vw;";
    return true;
}
function deleteTrack(event) {
    var init = document.getElementById("initTrack");
    var track = document.getElementById(event.srcElement.parentElement.id);
    track.parentNode.removeChild(track);
    var TrackNum = Number(init.title);
    TrackNum--;
    init.title = TrackNum.toString();
    TRACKS.remove(track);
    //iterate through the set by order of id#
    var arr = new Array();
    var min = 1000;
    var T1 = TRACKS;
    var iter = TRACKS.values();
    //iterate, find the smallest id in the set, then add it to the end of the array
    //if we're at the end of 1 iteration, we found the first min, then its time to 
    //delete that val from the set, and reset the iterator.
    //if there is only 1 id left in the set, push it onto the array, and exit the loop.
    for(var i = 0; i < T1.size; i++) {
        var next = iter.next().value;
        if(T1.size == 1){
            arr.push(next);
            continue;
        }
        if(next < min){
            min = next;
        }
        if(i == T1.size-1){
            arr.push(min);
            T1.delete(min);
            i = 0;
            iter = T1.values();
        }
    }
    var nTop = 40 + (8*(TrackNum-1));
    document.getElementById("AddTrack").style.cssText = "top: " + (nTop+10) + "vw;";
    document.getElementById("Export").style.cssText = "top: " + (nTop+10) + "vw;";
}
// To be used later: This is how to get the selected option from the dropbox
var y = document.getElementById("instrument");
var selection = y.options[y.selectedIndex].value;