var animationin;
var animation;
var width
function show(letter) {
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
    }, 30);
}
function hide(letter) {
    clearInterval(animation);
    var item = document.getElementById(letter);
    var title = item.innerText;
    if(letter == "P" && title.length < 5) {
        item.innerHTML = null;
        return;
    }
    else if(title.length < 3) {
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
    }, 15)
}