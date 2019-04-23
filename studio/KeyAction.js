var x = null;
var note = null;
var dcolor = null;
var ucolor = null;
var DKEYS = new Set();
var reso = false;
var isRec = false;
var mouseIsDown = false;
var keyIsDown = false;



  
function volFader(theNote) {
    var fadePoint = theNote.currentTime + 2;
    var first = false;
    var fadeAudio = setInterval(function () {
        if(theNote.volume == 1.0 && first == true){
            return false;
        }
        if ((theNote.currentTime <= fadePoint) && (theNote.volume >= 0.02)) {
            theNote.volume -= 0.02;
        }
        first = true;
        if (theNote.volume < 0.03) {
            clearInterval(fadeAudio);
        }
    }, 20);
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
    if(!event.type.includes("mouse") && !letterz.has(event.key.toLowerCase())) return false;
    var lastkey = document.getElementById("lastKey");
    if(event.key != "hellYeah"){
        lastkey.value = event.key;
        lastkey.val2 = event.type;
    }
    if(event.srcElement.id == "board") return false;
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
        if(event.key != "hellYeah"/* && reso == false*/){ //If we are sweeping the notes, a little sustain sounds nicer
            volFader(note);
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
            volFader(note);
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
    var lastk = document.getElementById("lastKey").val2;
    if(lastk == "mousedown") {
        var EV = {key:"hellYeah", type:"mousedown", srcElement:identifier};
        action(EV);
    }
}
function sweepout(identifier) {
    var lastk = document.getElementById("lastKey").val2;
    if(lastk == "mousedown") {
        var EV = {key:"hellYeah", type:"mouseup", srcElement:identifier};
        action(EV);
    }
}
var TRACKS = new Set();
var TrkNames = new Map();
TrkNames.set("Tname1", "Track 1");
TRACKS.add("1");
var TrackNum = 2;
function addTrack() {
    var newTrack = document.getElementById("TrackTemplate").cloneNode(true);
    var nTop = 40.1 + (8.1*(TRACKS.size));
    newTrack.id = TrackNum.toString();
    TRACKS.add(newTrack.id);
    newTrack.innerHTML += " <div id=\"TRK" + TrackNum + 
    "\"style=\"position:absolute;background-color:#1CD5BC;width:13vw;height:8vw;border-radius:1vw 0 0 1vw;\"> " + 
    " <input type=\"text\" id=\"Tname" + TrackNum + "\" class=\"TrackName\" value=\"Track " + TrackNum + "\" onkeypress=\"nameChange(event);\">" + 
    "<button id=\"PB" + TrackNum + "\" title=\"Play/Pause\" class=\"PlayButton\" onclick=\"togglePP(event)\"></button>" +
    "<button id=\"RB" + TrackNum + "\" title=\"Record/Stop\" class=\"RecButton\" onclick=\"toggleRS(event)\"></button>" + 
    "<button id=\"Mut" + TrackNum + "\" title=\"Mute\" class=\"MuteButton\" onclick=\"toggleMB(event)\">M</button>" + 
    "<button id=\"Sol" + TrackNum + "\" title=\"Solo\" class=\"SoloButton\" onclick=\"toggleSB(event)\">S</button></div>" + 
    "<div style=\"position:absolute;top: 6.5vw;left: 1.7vw;width:10vw;\">" + 
    "<input id=\"Pan" + TrackNum + "\" type=\"range\" title=\"Pan\" min=\"0\" max=\"100\" placeholder=\"50\" class=\"slider\" onmousemove=\"getPanVal(event)\" onmouseup=\"getPanVal(event)\" onkeydown=\"getPanVal(event)\" onkeyup=\"getPanVal(event)\">" +
    "<span id=\"PLB" + TrackNum + "\" class=\"PanNum\">0</span>" +
    "<button id=\"Ctr" + TrackNum + "\" class=\"zeroButton\" title=\"Zero Pan\" onclick=\"zero(event)\">0</button></div>" +
    "<div style=\"position:absolute;top: 4.5vw;left: 5.5vw;width:10vw;\">" +
    "<input id=\"Vol" + TrackNum + "\" type=\"range\" title=\"Volume\" min=\"0\" max=\"100\" placeholder=\"50\" class=\"slider Vol\" onmousemove=\"getVolVal(event)\" onmouseup=\"getVolVal(event)\" onkeydown=\"getVolVal(event)\" onkeyup=\"getVolVal(event)\">" + 
    "<span id=\"VLB" + TrackNum + "\" class=\"VolNum\">50<br>db</span></div>" + 
    "<div id=\"RecArea" + TrackNum + "\" class=\"RecArea extra\" onmousemove=\"Scrub(event)\" onmouseup=\"Scrub(event)\" onkeyup=\"Scrub(event)\" " + 
    "onkeydown=\"Scrub(event)\" onwheel=\"zoomTracks(event)\"><div id=\"pMarker" + TrackNum + "\" class=\"pmarker\"></div></div>"; 
    newTrack.style.cssText = "top: " + nTop + "vw;";
    var ID = "Tname" + TrackNum;
    var TN = "Track " + TrackNum;
    TrkNames.set(ID, TN);
    document.body.appendChild(newTrack);
    document.getElementById("AddTrack").style.cssText = "top: " + (nTop+10) + "vw;";
    document.getElementById("Export").style.cssText = "top: " + (nTop+10) + "vw;";
    TrackNum++;
}
var delType;
var popupEvent;
function deleteTrack() {
    var track = document.getElementById(popupEvent.srcElement.parentNode.id);
    var TN = "Tname" + track.id;
    TrkNames.delete(TN);
    TRACKS.delete(track.id);
    for(let item of trkSelected.keys()){
        if(item.includes("Recording" + track.id)) {
            trkSelected.delete(item);
            movingRecs.delete(item);
            recnums.delete(track.id);
        }
    }
    track.parentNode.removeChild(track);
    var nTop = 40.1;
    for(let item of TRACKS.keys()) {
        if(item == "1") continue;
        nTop += 8.1;
        var trk = document.getElementById(item);
        trk.style.cssText = "top: " + nTop + "vw;";
    }
    document.getElementById("AddTrack").style.cssText = "top: " + (nTop + 10) + "vw;";
    document.getElementById("Export").style.cssText = "top: " + (nTop + 10) + "vw;";
}
function nameChange(event){
    if(event.key == "Enter" || event.key == "Tab") return false;
    var TN = "Tname" + event.srcElement.parentElement.id.substr(3);
    var value = event.srcElement.value
    TrkNames.set(TN, value + event.key);
}
function PAPA() {
    var f = document.getElementsByClassName("PlayAll");
    var e = f.item(0);
    if(e.innerHTML == "Play All") {
        e.innerHTML = "Pause All";
        e.style.left = "-2vw";
        e.style.color = "#C293D6";
    }
    else if(e.innerHTML == "Pause All") {
        e.innerHTML = "Play All";
        e.style.left = "-1vw";
        e.style.color = "#1CD5BC";
    }
}
function togglePP(event) {
    // For use of main P/P button
    var stopRec = false;
    var btns = new Set();
    var rbtns = new Set();
    // add "RB1..." to rbtns and add "PB1..." to btns
    for(let item of TRACKS.keys()){
        var ident = "PB" + item;
        var pbutt = document.getElementById(ident);
        btns.add(ident);
        ident = "RB" + item;
        rbtns.add(ident);
        var rbutt = document.getElementById(ident);
        // if any buttons are recording, stop the recordings
        if(rbutt.classList.contains("StopButton")) {
            rbutt.classList.replace("StopButton", "RecButton");
            pbutt.classList.replace("PauseButton", "PlayButton");
            PauseTrack(rbutt.id);
            endRecording(pbutt.id);
            stopRec = true;
        }
    }
    // if were stopping the recording, run through all of the buttons and pause them all
    if(stopRec == true) {
        for(let item of btns.keys()){
            if(document.getElementById(item).classList.contains("PauseButton")){
                document.getElementById(item).classList.replace("PauseButton", "PlayButton");
                PauseTrack(item);
            }
        }
        if(document.getElementById("PB0").classList.contains("PauseButton")){
            document.getElementById("PB0").classList.replace("PauseButton", "PlayButton");
            PAPA();
        }
        return true;
    }
    if(event.keyCode == 32) {
        var button = document.getElementById("PB0");
        // if the spacebar was hit, check all of the buttons and pause the ones that are playing
        var Pausereturn = false;
        for(let item of btns.keys()) {
            if(button.classList.contains("PauseButton"))break;
            if(document.getElementById(item).classList.contains("PauseButton")){
                document.getElementById(item).classList.replace("PauseButton", "PlayButton");
                PauseTrack(item);
                Pausereturn = true;
            }
        }
        if(Pausereturn) return true;
        // if none of the other tracks were playing, 
        PAPA();
        if(button.classList.contains("PauseButton")){
            button.classList.replace("PauseButton", "PlayButton");
            for(let item of btns.keys()) {
                if(document.getElementById(item).classList.contains("PauseButton")){
                    document.getElementById(item).classList.replace("PauseButton", "PlayButton");
                    PauseTrack(item);
                }
            }
            for(let item of rbtns.keys()) {
                if(document.getElementById(item).classList.contains("StopButton")) {
                    document.getElementById(item).classList.replace("StopButton","RecButton");
                    endRecording(item);
                }
            }
        } else {
            button.classList.replace("PlayButton", "PauseButton");
            for(let item of btns.keys()) {
                document.getElementById(item).classList.replace("PlayButton", "PauseButton");
                PlayTrack(item);
            }
        }
        return true;
    }
    var element = document.getElementById(event.srcElement.id);
    var RB = "RB" + element.parentElement.id.substr(3);
    RB = document.getElementById(RB);
    if(element.classList.contains("Main")){
        for(let item of btns.keys()) {
            if(element.classList.contains("PauseButton"))break;
            if(document.getElementById(item).classList.contains("PauseButton")){
                document.getElementById(item).classList.replace("PauseButton", "PlayButton");
                PauseTrack(item);
                return true;
            }
        }
        PAPA();
        if(element.classList.contains("PauseButton")){
            element.classList.replace("PauseButton", "PlayButton");
            for(let item of btns.keys()) {
                if(document.getElementById(item).classList.contains("PauseButton")){
                    document.getElementById(item).classList.replace("PauseButton", "PlayButton");
                    PauseTrack(item);
                }
            }
        } else {
            element.classList.replace("PlayButton", "PauseButton");
            for(let item of btns.keys()) {
                if(document.getElementById(item).classList.contains("PlayButton")){
                    document.getElementById(item).classList.replace("PlayButton", "PauseButton");
                    PlayTrack(item);
                }
            }
        }
        return true;
    }
    if (element.className == "PauseButton") {
        if(RB.className == "StopButton") {
            RB.className="RecButton";
            endRecording(element.parentElement.id);
        }
        element.className = "PlayButton";
        for(let item of TRACKS.keys()){
            if(document.getElementById("PB" + item).classList.contains("PauseButton")) return true;
        }
        PauseTrack(element.id);
    }
    else {
        element.className = "PauseButton";
        PlayTrack(element.id);
    }
    return true;
}
// Toggle the record and stop button and call the start/stop recording functions
function toggleRS(event) {
    var element = document.getElementById(event.srcElement.id);
    var PPB = "PB" + element.parentElement.id.substr(3);
    PPB = document.getElementById(PPB);
    var hasOtherRec = false;
    for(let item of TRACKS.keys()) {
        if(document.getElementById("RB" + item).classList.contains("StopButton") && element.id != "RB" + item) hasOtherRec = true;
    }
    if (element.className == "RecButton" && !hasOtherRec) {
        // only let it record if none of the other tracks are recording
        element.className = "StopButton";
        Record(element.id);
        if(PPB.className == "PlayButton") {
            PPB.className="PauseButton";
            PlayTrack(element.id);
        }
    }
    else if(!hasOtherRec) {
        element.className = "RecButton";
        endRecording(element.id);
    }
}
function toggleMB(event) {
    var element = document.getElementById(event.srcElement.id);
    if(element.classList.contains("MBon")) {
        element.classList.remove("MBon");
    } else {
        element.classList.add("MBon");
    }
}
function toggleSB(event) {
    var element = document.getElementById(event.srcElement.id);
    if(element.classList.contains("SBon")) {
        element.classList.remove("SBon");
    } else {
        element.classList.add("SBon");
    }
}
function zero(event) {
    var element = document.getElementById(event.srcElement.id);
    var span = document.getElementById("PLB" + element.id.substr(3));
    var panner = document.getElementById("Pan" + element.id.substr(3));
    span.innerHTML = "0";
    panner.value = 50;
}
function getPanVal(event) {
    var element = document.getElementById(event.srcElement.id);
    var span = document.getElementById("PLB" + element.id.substr(3));
    var pan = element.value - 50;
    if(pan == 50) {
        span.innerHTML = "R";
    }
    else if(pan == -50) {
        span.innerHTML = "L";
    }
    else if(pan > 0) {
        span.innerHTML = pan + "R";
    }
    else if(pan < 0) {
        pan *= -1;
        span.innerHTML = pan + "L";
    }
    else {
        span.innerHTML = pan;
    }
}
function getVolVal(event) {
    var element = document.getElementById(event.srcElement.id);
    var span = document.getElementById("VLB" + element.id.substr(3));
    span.innerHTML = element.value + "<br>db"; 
}
var FinalTempo = 120;
function tempoChange() {
    if(trkSelected.size > 0) {
        document.getElementById("TEMPOOO").value = FinalTempo;
        document.getElementById("T").title = "You cannot change the tempo\n after having started a project";
        return false;
    }
    FinalTempo = document.getElementById("TEMPOOO").value;
    if(document.getElementById("TEMPOOO").value > 200) document.getElementById("TEMPOOO").value = 200;
}
var mouseIsDown = false;
function Scrub(event){
    var TimeSig = document.getElementById("TimeNumerator").value;
    var ruler = document.getElementById("Rul");
    var spot = ruler.value;
    var length = ruler.max;
    var measures = document.getElementById("Measures"); 
    var beats = document.getElementById("Beats");
    var pixelPosition = ruler.clientWidth * (spot/length);
    var pMarker;
    var spm = 30 * TimeSig;
    if(event.key == "ArrowLeft" && event.type == "keydown") {
        event.preventDefault();
        ruler.value -= 4;
    } else if(event.key == "ArrowRight" && event.type == "keydown") {
        event.preventDefault();
        ruler.value += 4;
    }
    spot = ruler.value;
    spot = spot / 1.003;
    pixelPosition = ruler.clientWidth * (spot/length);
    for(let item of TRACKS.keys()) {
        pMarker = document.getElementById("pMarker" + item);
        pMarker.style.cssText += "transform: translatey(" + pixelPosition + "px);";
    }
    measures.innerHTML = Math.floor(spot/spm);
    for(var i = 1; i <= TimeSig; i++) {
        if(spot%spm < (spm/TimeSig)*i) {
            beats.innerHTML = i;
            break;
        }
        else {
            beats.innerHTML = 1;
        }
    }
    if(mouseIsDown) {
        // we are dragging the ruler at the end extremities of the ruler, we want to scroll over to the side to see the other recordings 
        // the further to the extremity that the ruler is dragged, the faster it scrolls.
        var speed;
        var direction;
        if(ruler.value <= 30 && leftMostRec < ruler.max) {
            speed = ruler.value;
            direction = -5;
            scrollOver(speed, direction);
        }
        else if(ruler.value >= (ruler.max - 30) && leftMostRec < ruler.max) {
            speed = (ruler.max - ruler.value);
            direction = 5;
            scrollOver(speed, direction);
        }
        else clearInterval(scrollSpeed);
    }
}
var leftMostRec;
var farLeftRecording;
var scrollSpeed;
function scrollOver(speed, direction) {
    // we want to change the left value of each of the recordings at a specific speed
    for(let recc of trkSelected.keys()) {
        var top = document.getElementById(recc);
        movingRecs.set(top.id, top.style.top);
    }
    clearInterval(scrollSpeed);
    scrollSpeed = setInterval(function() {
        if(!mouseIsDown) {
            clearInterval(scrollSpeed);
            return false;
        }
        leftMostRec = doc.getElementById("Rul").max - 1;
        for(let item of movingRecs.keys()) {
            var tak = document.getElementById(item);
            var currentLeft = movingRecs.get(item);
            if(parseFloat(currentLeft) < parseFloat(leftMostRec)) {
                leftMostRec = currentRec;
                farLeftRecording = item;
            }
            tak.style.cssText += "top: calc(" + currentLeft + " - " + direction + "px);"; 
            movingRecs.set(item, tak.style.top)
        }
    }, speed + 10);
}
function zoomTracks(event) {
    var amount = -1;
    if(trkSelected.size > 0){
        if (event.wheelDelta){
            amount = event.wheelDelta;
        }else{
            amount = -1 * event.deltaY;
        }
        event.preventDefault();
    }
    amount = amount / 30;
    //document.getElementById("Rul").max += (amount - 1);
    for(let item of movingRecs.keys()) {
        if(item == farLeftRecording) continue;
        var rec = document.getElementById(item);
        var recTop = movingRecs.get(item);
        var recHeight = rec.style.height;
        rec.style.cssText +=    "top: calc(" + recTop + " - " + amount + "px);" + 
                                "height: calc(" + recHeight + " - " + amount + "px);";
        movingRecs.set(item, rec.style.top);
    }
}
var FinalTimeNum = 4;
var FinalTimeDen = 4;
function changeTimeSig() {
    var num = document.getElementById("TimeNumerator").value;
    var den = document.getElementById("TimeDenominator").value;
    if(den == 3) {
        if(FinalTimeDen == 2) den = 4;
        else den = 2;
    }
    else if(den > 4 && den < 8){
        if(FinalTimeDen < 6) den = 8;
        else den = 4;
    }
    else if(den > 8 && den < 16){
        if(FinalTimeDen < 12) den = 16
        else den = 8;
    }
    FinalTimeDen = den;
    document.getElementById("TimeDenominator").value = den;
    if(trkSelected.size > 0) {
        document.getElementById("TimeNumerator").value = FinalTimeNum;
        document.getElementById("TimeNumerator").title = "You cannot change the beat signature\n after having started a project";
        return false;
    }
    FinalTimeNum = num;
    document.getElementById("TimeNumerator").title = "";
    document.getElementById("Rul").max = (num * 30 * 4) - 1;
    var EV = {type:"none"};
    Scrub(EV);
}
var PlayTime;
var recnums = new Map();
var trkSelected = new Map();
function Record(ident) {
    isRec = true;
    ident = ident.substr(2);
    if(recnums.has(ident)){
        var idnum = recnums.get(ident);
        recnums.set(ident, idnum + 1);
    }
    else recnums.set(ident, 1);
    var recnum = recnums.get(ident);
    var Rec = document.getElementById("RecArea" + ident);
    Rec.innerHTML += "<div class=\"startedRec\" id=\"Recording" + ident + ":" + recnum + "\" " + 
                     "onmousedown=\"CheckMouseAction(event);dragRec(event);\"onmouseup=\"undragRec(event)\"></div>";
    trkSelected.set("Recording" + ident + ":" + recnum, false);
}
function endRecording(ident) {
    isRec = false;
    var finishedRec = document.getElementById("Recording" + ident.substr(2) + ":" + recnums.get(ident.substr(2)));
    finishedRec.className = "finishedRec";
    // we want to check if the track overlapped any other tracks, and delete the overlapped parts and possibly split one recoring into two
    checkOverlap(ident);
}
function PauseTrack(ident) {
    clearInterval(PlayTime);
}
var movingRecs = new Map();
function PlayTrack(ident){
    var ruler = document.getElementById("Rul");
    var tempo = document.getElementById("TEMPOOO").value;
    clearInterval(PlayTime);
    PlayTime = false;
    if(ruler.value == ruler.max) {
        ruler.value = 0;
    }
    var playClick = document.getElementById("PCC").checked;
    var hclick = document.getElementById("HClick");
    var lclick = document.getElementById("LClick");
    if(ruler.value == 0 && playClick) {
        hclick.load();
        hclick.play();
    }
    var click = 1;
    var TimeSig = document.getElementById("TimeNumerator").value;
    var w = 0;
    var Recordingz;
    var left = ruler.value-1;
    var lastId = -1;
    var first = true;
    var first2 = true;
    var Lholder = 0;
    for(let recc of trkSelected.keys()) {
        var top = document.getElementById(recc);
        movingRecs.set(top.id, top.style.top);
    }
    PlayTime = setInterval(function() {
        var EV = {type:"none"};
        Scrub(EV);
        if(isRec && ruler.value >= (ruler.max * 3/4)){
            ruler.value--;
            left--;
        }
        if(first) {
            for(let recc of trkSelected.keys()) {
                var top = document.getElementById(recc);
                movingRecs.set(top.id, top.style.top);
            }
        }
        ruler.value++;
        if(!isRec) {
            first = true;
            first2 = true;
        }
        else {
            if(first2) {
                for(let recc of trkSelected.keys()) {
                    var top = document.getElementById(recc);
                    movingRecs.set(top.id, top.style.top);
                }
                first2 = false;
            }
            var idee;
            for(let item of TRACKS.keys()) {
                if(document.getElementById("RB" + item).classList.contains("StopButton")) idee = item;
            }
            if(lastId != recnums.get(idee)) {
                lastId = recnums.get(idee);
                left = ruler.value-1;
                w = 0;
            }
            Recordingz = document.getElementById("Recording" + idee + ":" + recnums.get(idee));
            w++;
            Recordingz.style.height = w*(ruler.clientWidth/ruler.max) + "px";
            Recordingz.style.top = left * (ruler.clientWidth/ruler.max) + "px";
            // Move all of the other recordings over with it
            if(ruler.value >= (ruler.max * 3/4)) {
                if(first) {
                    first = false;
                    Lholder = left;
                }
                for(let recc of movingRecs.keys()) {
                    var leftness = movingRecs.get(recc)
                    if(leftness < leftMostRec){
                        leftMostRec = leftness;
                        farLeftRecording = recc;
                    }
                    if(recc == Recordingz.id) continue;
                    var recToMove = document.getElementById(recc);
                    recToMove.style.cssText += "top: calc(" + leftness + " - " + ((Lholder - left) * (ruler.clientWidth/ruler.max)) + "px);";
                }
            }
        }
        playClick = document.getElementById("PCC").checked;
        if(click%(30 * TimeSig) == 0 && playClick) {
            hclick.load();
            hclick.play();
        }
        else if(click%30 == 0 && playClick) {
            lclick.load();
            lclick.play();
        }
        click++;
        if(ruler.value == ruler.max) {
            for(let item of TRACKS.keys()) {
                if(document.getElementById("RB" + item).classList.contains("StopButton")) isRec = true;
            }
            if(!isRec){   
                PauseTrack(ident);
                for(let item of TRACKS.keys()) {
                    var x = document.getElementById("PB" + item);
                    if(x.classList.contains("PauseButton")) x.classList.replace("PauseButton", "PlayButton");
                }
                if(document.getElementById("PB0").classList.contains("PauseButton")){
                    document.getElementById("PB0").classList.replace("PauseButton", "PlayButton");
                    PAPA();
                }
            }
        }
        Scrub(EV);
    }, 2000/tempo );
}
function CheckMouseAction(event) {
    if(isRec) return false;
    var button = event.button;
    if(button == 0) {
        var RecTrack = document.getElementById(event.srcElement.id);
        RecTrack.className = "finishedRec";
        trkSelected.set(RecTrack.id, false);
        //ruler.value = 0;
    }
    else if(button == 2) {
        var RecTrack = document.getElementById(event.srcElement.id);
        RecTrack.className = "finishedRec1";
        trkSelected.set(RecTrack.id, true);
    }
}
function checkOverlap(ident) {
    for(var i = 1; i < recnums.get(ident); i++){
        var RecTrack = document.getElementById("Recording" + ident.substr(2) + ":" + i);
    }
}
var hasAlert = false;
var dsa1 = false;
var dsa2 = false;
var hasSelected = false;
function alertDeleteRec(type, event){
    hasSelected = false;
    delType = type;
    popupEvent = event;
    var theTrk;
    var rulerspot = document.getElementById("Rul").value;
    for(let item of trkSelected.keys()){
        if(trkSelected.get(item)){
            hasSelected = true;
            theTrk = item;
        }
    }
    if(!hasAlert && hasSelected && !dsa1 && type == "recording"){
        document.body.innerHTML += "<div id=\"RecDelAlert\"><strong>Warning:</strong> are you sure you want to delete this " + type + "? " + 
                      "<button onclick=\"deleteRecording();removeAlert(this.parentElement);\" class=\"Abutt\">Delete</button>" + 
                      "<button onclick=\"removeAlert(this.parentElement)\" class=\"Abutt\">Cancel</button>" + 
                      "<br>Don't show this warning again<input id=\"dsa1\" type=\"checkbox\" style=\"position:relative;width:1.5vw;height:1.5vw;top:.3vw;\"></div>";
        hasAlert = true;
    } else if(!hasAlert && !dsa2 && type == "track") {
        document.body.innerHTML += "<div id=\"RecDelAlert\"><strong>Warning:</strong> are you sure you want to delete this " + type + "? " + 
                      "<button onclick=\"deleteTrack();removeAlert(this.parentElement);\" class=\"Abutt trkdel\">Delete</button>" + 
                      "<button onclick=\"removeAlert(this.parentElement)\" class=\"Abutt trkcnl\">Cancel</button>" + 
                      "<br>Don't show this warning again<input id=\"dsa1\" type=\"checkbox\" style=\"position:relative;width:1.5vw;height:1.5vw;top:.3vw;\"></div>";
        hasAlert = true;
    } else if(dsa1 && hasSelected && type == "recording") {
        deleteRecording();
    } else if(dsa2 && type == "track"){
        deleteTrack();
    }
    // reset all of the tracknames
    for(let item of TrkNames.keys()) {
        document.getElementById(item).value = TrkNames.get(item);
    }
    // reset the time sig and the tempo to their original values because they're gonna flip out for whatever reason
    document.getElementById("TimeNumerator").value = FinalTimeNum;
    document.getElementById("TimeDenominator").value = FinalTimeDen;
    document.getElementById("TEMPOOO").value = FinalTempo;
    var thing;
    if(type == "recording"){
        thing = theTrk.substr(9);
        thing = thing.substr(0,1);
    } else {
        thing = event.srcElement.parentNode.id;
    }
    var i = 1;
    for(let item of TRACKS.keys()) {
        if(item == thing) {
            theTrk = Number(i);
        }
        i++;
    }
    document.getElementById("RecDelAlert").style.cssText += "top: " + (((theTrk-1) * 8.1) + 38) + "vw;";
    document.getElementById("Rul").value = rulerspot;
}
function removeAlert(a) {
    if(document.getElementById("dsa1").checked) {
        if(delType == "recording") dsa1 = true;
        else if(delType == "track") dsa2 = true;
    }
    a.parentElement.removeChild(a);
    hasAlert = false;
}
function deleteRecording(){
    for(let item of trkSelected.keys()){
        if(trkSelected.get(item)){
            var thing = document.getElementById(item);
            thing.parentElement.removeChild(thing);
            trkSelected.delete(item);
            movingRecs.delete(item);
            recnums.delete(item);
        }
    }
}
/* TODO: Allow these functions to do the following:
    - Drag a recording across its current track
    - Drag a recording to another track
    - If we drag on top of another recording, pop up a warning saying: 
        "warning: this track overlaps another one.  Would you like to overwrite this track?"
    - If the mouse leaves all of the recording areas completely, make the mouse a "not allowed" cursor
    - Allow us to drag and drop an external audio file into an empty track.  If dropping onto a track with existing recordings in it,
        pop up a warning saying that you're not allowed to do that and you must drop into an empty track.
*/
function dragRec(event){
    return false;
}
function undragRec(event){
    return false;
}
// To be used later: This is how to get the selected option from the dropbox
var y = document.getElementById("instrument");