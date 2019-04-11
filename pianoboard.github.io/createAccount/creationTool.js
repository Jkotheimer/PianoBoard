/**var genres = ["aleatoric music", "alternative country", "alternative dance", "alternative hip hop",
    "alternative metal", "alternative rock", "ambient", "ambient house", "ambient music", "americana", 
    "anarcho punk", "anime music", "anti-folk", "apala", "ape haters", "arab pop", "arabesque", "arabic pop", 
    "argentine rock", "ars antiqua", "ars nova", "art punk", "art rock"];
*/
var grabSimilarGenres = function(){}

function genrePage() {
    var xhr = new XMLHttpRequest();
    var file = "../samples/Data/genres.txt";
    if ("withCredentials" in xhr){
        xhr.open("GET", file, true);
    } else if (typeof XDomainRequest != "undefined"){
        xhr.open("GET", file);
    }
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4) {
            if(xhr.status === 200 || xhr.status == 0) {
                var allText = xhr.responseText;
                var genres = [" "];
                var current = "";
                for(let i = 0; i < allText.length; i++) {
                    if(allText.charAt(i) != ',') {
                        current += allText.charAt(i);
                    }
                    else {
                        genres.push(current);
                        current = "";
                    }
                }
                // ALL FUNCTIONS USING genres MUST BE DECLARED WITHIN HERE
                document.getElementById("genre_input").addEventListener("keyup", function(event){
                    var infield = document.getElementById("genre_input");
                    var input = infield.value.toLowerCase();
                    if(event.keyCode == 13) {
                        addButtonToSelected(input);
                        infield.select();
                        return;
                    }
                    var autocomplete = document.getElementById("genre_autocomplete");
                    autocomplete.innerHTML = "";
                    if(input == "") {
                        autocomplete.style.display = "none";
                        infield.style.borderRadius = "10px";
                        return;
                    }
                    else {
                        autocomplete.style.display = "block";
                        infield.style.borderRadius = "10px 10px 0 0";
                    }
                    var count = 0;
                    for(let i = 0; i < genres.length; i++) {
                        if(genres[i].substr(0,input.length).includes(input)) {
                            addButtonToAutocomplete(genres[i]);
                            count++;
                        }
                        if(count > 17) break;
                    }
                    
                    if(autocomplete.innerHTML == "") {
                        autocomplete.style.display = "none";
                        infield.style.borderRadius = "10px";
                    }
                });

                function addButtonToAutocomplete(name) {
                    // Declare a new button with the name within it
                    var b = document.createElement("button");
                    var node = document.createTextNode(name);
                    b.appendChild(node);
                    var au = document.getElementById("genre_autocomplete");
                    var input = document.getElementById("genre_input");

                    // add style to the button
                    b.style.border = "2px solid #444";
                    b.style.backgroundColor = "transparent";
                    b.style.color = "#444";
                    b.style.borderRadius = "5px";
                    b.style.width = "45%";
                    b.style.margin = "5px";
                    b.style.padding = "2px";
                    b.style.transition = ".15s";

                    // add a bunch of event listeners for interactivity
                    b.addEventListener("mousedown", function() {
                        b.style.borderColor = "#9263A6";
                        b.style.backgroundColor = "#07C0A7";
                    })
                    b.addEventListener("mouseup", function() {
                        b.parentElement.removeChild(b);
                        addButtonToSelected(name);
                        input.select();
                    });

                    b.addEventListener("mouseover", function() {
                        b.style.borderColor = "#C293D6";
                        b.style.backgroundColor = "transparent";
                        b.style.cursor = "pointer";
                    });
                    b.addEventListener("mouseout", function() {
                        b.style.borderColor = "#444";
                        b.style.backgroundColor = "transparent";
                        b.style.cursor = "initial";
                    });
                    b.addEventListener("focus", function() {
                        b.style.outline = "none";
                    });
                    // append the button into the autocomplete column
                    au.appendChild(b);
                }

                function addButtonToSelected(name) {
                    // declare new button
                    var b = document.createElement("button");
                    var node = document.createTextNode(name);
                    b.appendChild(node);
                    var s = document.getElementById("selected_genres");
                    var input = document.getElementById("genre_input");

                    // add some style to the button
                    b.style.border = " 2px solid #C293D6";
                    b.style.backgroundColor = "transparent";
                    b.style.color = "#C293D6";
                    b.style.borderRadius = "5px";
                    b.style.width = "45%";
                    b.style.margin = "5px";
                    b.style.padding = "2px";
                    b.style.transition = ".15s";

                    // remove the name from genres array, shift everything else over,
                    // then pop off the undefined element
                    for(let i = 0; i < genres.length; i++){
                        if(genres[i] == name) {
                            delete genres[i];
                            for(let j = i; j < genres.length-1; j++) {
                                genres[j] = genres[j+1];
                            }
                            genres.pop();
                        }
                    }
                    // invoke the event listener to re-recieve the genres
                    input.dispatchEvent(new Event('keyup'));
                    // append the button onto the selected column
                    s.appendChild(b);

                    // add some event listeners for interactivity
                    b.addEventListener("mousedown", function() {
                        b.style.borderColor = "red";
                        b.style.backgroundColor = "red";
                        b.style.color = "#444";
                    });
                    b.addEventListener("mouseup", function() {                 
                        // remove the button from the selected column
                        b.parentElement.removeChild(b);
                        // re-add the name to the genre list
                        genres.push(name);
                        // invoke the input event listener to re-recieve the genres
                        input.dispatchEvent(new Event('keyup'));
                        // add the title back to the selector column if its empty
                        if(s.innerHTML == "") s.innerHTML = "Genres you select will appear here"
                    })
                    b.addEventListener("mouseover", function() {
                        b.style.borderColor = "#1CD5BC";
                        b.style.color = "#1CD5BC";
                        b.style.backgroundColor = "transparent";
                        b.style.cursor = "pointer";
                    });
                    b.addEventListener("mouseout", function() {
                        b.style.borderColor = "#C293D6";
                        b.style.backgroundColor = "transparent";
                        b.style.color = "#C293D6";
                        b.style.cursor = "initial";
                    });
                    b.addEventListener("focus", function() {
                        b.style.outline = "none";
                    });
                    if(s.textContent.includes('Genres')) s.innerHTML = "";
                    s.appendChild(b);
                }
                
                var used = new Set([0]);
                var x = 0;
                var iput = document.getElementById("genre_input");
                var current = "Enter your genre";
                iput.placeholder = current;
                var addIter = 0;
                var interval = setInterval(function() {
                    // change the placeholder of the genre input box
                    // after 2 seconds, shred away the current placeholder
                    if(x > 100 && x < (100 + current.length)) {
                        iput.placeholder = iput.placeholder.substr(0, iput.placeholder.length-1);
                    }
                    // once the current placeholder is gone, generate a new random one and assign to current
                    if(x == (100 + current.length)) {
                        if(used.size >= genres.length) {
                            used.clear();
                            used.add(0);
                        }
                        var rand = 0;
                        while(used.has(rand)) rand = Math.floor(Math.random() * genres.length);
                        used.add(rand);
                        current = genres[rand];
                        iput.placeholder = "";
                        addIter = 0;
                    }
                    // start adding to the new placeholder
                    if(x > (100 + current.length)) {
                        iput.placeholder += current.charAt(addIter);
                        if(iput.placeholder == current) x = 0;
                        addIter++;
                    }
                    x++;

                    // determine the height of the loading box
                    var ibox = document.getElementById("genre_input").clientHeight + 110;
                    ibox += document.getElementById("genre_autocomplete").clientHeight;
                    var sbox = document.getElementById("selected_genres").clientHeight + 110;
                    var loader = document.getElementById("loader");
                    if(ibox > sbox) {
                        loader.style.cssText += "height: " + ibox + "px;";
                    } else {
                        loader.style.cssText += "height: " + sbox + "px;";
                    }
                }, 30);
            }
        }
    }
    xhr.send();
}

function submitGenres() {
    var s = document.getElementById("selected_genres");
    if(s.textContent.includes('Genres')) {
        // TODO show an element saying that I have to choose some genres
        return;
    }
    s = s.childNodes;
    var g = new Set();
    for(let iter = 0; iter < s.length; iter++) {
        var node = s[iter];
        g.add(node.textContent);
    }
}