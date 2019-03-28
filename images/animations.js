function showBackArrow(event) {

}

function colorFade(objects) {
    clearInterval(colorFader);
    var teal = [28,213,188]; // 166, 
    var purple = [194,147,214];
    var TR = teal[0];
    var TG = teal[1];
    var TB = teal[2]; 
    var PR = purple[0];
    var PG = purple[1];
    var PB = purple[2];
    var goingUp = true;

    var colorFader = setInterval(function() {
        for(let element of objects.keys()) {
            if(element == "border") {
                document.getElementById(objects.get(element)).style.borderColor = 
                "rgb(" + TR + ", " + TG + ", " + TB + ")";
            }
            if(element == "color") {
                document.getElementById(objects.get(element)).style.color = 
                "rgb(" + TR + ", " + TG + ", " + TB + ")";
            }
            if(element == "gradient") {
                document.getElementById(objects.get(element)).style.backgroundImage = 
                "linear-gradient(to bottom, rgb(" + TR + ", " + TG + ", " + TB + "), " + 
                                            "rgb(" + PR + ", " + PG + ", " + PB + "))";
            }
            if(element == "shadow") {
                document.getElementById(objects.get(element)).style.boxShadow = 
                "0 1vw 1vw rgb(" + PR + ", " + PG + ", " + PB + ")";
            }
        }

        if(goingUp) {
            TR +=6.385; TG -=2.54; TB++;
            PR -=6.385; PG +=2.54; PB--; 
        }
        else {
            TR -=6.385; TG +=2.54; TB--;
            PR +=6.385; PG -=2.54; PB++; 
        }

        if(TR >= 194) goingUp = false;
        else if(TR <= 28) goingUp = true;
    }, 125);
}