var animationin;
var animation;
var width;
var isOpen = false;
var switches = document.getElementsByClassName("navLink");
for(let i = 0; i < switches.length; i++) {
    switches[i].addEventListener("mouseenter", function() {
        if(isOpen) return;
        isOpen = true;
        for(let j = 0; j < switches.length; j++) {
            switches[j].children[1].innerHTML = "";
        }
        var letter = this.classList[1];
        clearInterval(animation);
        var item = document.getElementById(letter);
        item.innerHTML = null;
        var title;
        if(letter == "P") title = "Create New Project";
        else if(letter == "T") title = "Tutorial";
        else title = "Settings";
        var i = 0;
        animation = setInterval(function() {
            item.innerText += title.charAt(i);
            i++;
            if(i == title.length) clearInterval(animation);
        }, 20);
    });
    switches[i].addEventListener("mouseleave", function() {
        if(!isOpen) return;
        isOpen = false;
        clearInterval(animation);
        var letter = this.classList[1];
        var item = document.getElementById(letter);
        var title = item.innerText;
        if(title.length < 5) {
            item.innerHTML = null;
            return;
        }
        animation = setInterval(function() {
            item.innerText = title;
            title = title.slice(1);
            if(title.length == 0) {
                item.innerHTML = null;
                clearInterval(animation);
            }
        }, 20)
    });
}

var fade;
function showProfilePicHint() {
    if(fade) return;
    var item = document.getElementById("drag_and_drop_info");
    item.style.opacity = 1;
    item.style.visibility = "visible";
    var opacity = 1;
    var ready = 0;
    fade = setInterval(function() {
        item.style.opacity = opacity;
        if(ready > 100) opacity -= .01;
        if(item.style.opacity < .02) {
            item.style.visibility = "hidden";
            item.style.opacity = 1;
            clearInterval(fade);
            fade = false;
            return;
        }
        ready++;
    }, 20);
}

function showCam(event) {
    event.preventDefault();
    var profPic = document.getElementById("profpic");
    var cam = document.getElementById("cam");
    profPic.style.opacity = .3;
    cam.style.visibility = "visible";
}

function hideCam() {
    var profPic = document.getElementById("profpic");
    var cam = document.getElementById("cam");
    profPic.style.opacity = 1;
    cam.style.visibility = "hidden";
}