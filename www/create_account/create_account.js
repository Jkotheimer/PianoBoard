var switchedOver = false;

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

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
                var genres = [];
                var current = "";
                for(let i = 0; i < allText.length; i++) {
                    if(allText.charAt(i) != ',') {
                        current += allText.charAt(i);
                    }
                    else {
                        var nope = false
                        for(let j = 0; j < genres.length; j++) {
                            if(genres[j] == current){
                                nope = true;
                                break;
                            }
                        }
                        if(!nope) {
                            genres.push(current);
                        }
                        current = "";
                    }
                }
                genres.sort();
                // ALL FUNCTIONS USING genres MUST BE DECLARED WITHIN HERE
                document.getElementById("genre_input").addEventListener("keyup", function(event){
                    var infield = document.getElementById("genre_input");
                    var input = infield.value.toLowerCase();
                    if(event.keyCode == 13) {
                        addButtonToSelected(input);
                        infield.select();
                        infield.input = "";
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
                        if(document.getElementById("genre_autocomplete").textContent.includes(genres[i])) continue;
                        if(genres[i].toLowerCase().substr(0,input.length).includes(input)) {
                            addButtonToAutocomplete(genres[i]);
                            count++;
                        }
                        if(count > 30) break;
                    }
                    if(count < 30) {
                        for(let i = 0; i < genres.length; i++) {
                            if(document.getElementById("genre_autocomplete").textContent.includes(genres[i])) continue;
                            for(let j = 0; j < genres[i].length; j++) {
                                if(genres[i].charCodeAt(j) == 32) {
                                    if(genres[i].toLowerCase().substr(j+1, input.length).includes(input)) {
                                        addButtonToAutocomplete(genres[i]);
                                        count++;
                                    }
                                }
                            }
                            if(count > 17) break;
                        }
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
                        genres.sort();
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
                var intravle = setInterval(function() {
                    if(switchedOver) clearInterval(intravle);
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
                    // check the width of the window to resize the buttons
                    var abuttons = document.getElementById("genre_autocomplete").childNodes;
                    var sb = document.getElementById("selected_genres");
                    var sbuttons = sb.childNodes;
                    var lt = $(window).width() < 500;
                    if(abuttons != undefined) {
                        if(lt) {
                            for(let i = 0; i < abuttons.length; i++) {
                                abuttons[i].style.width = "95%";
                            }
                        }
                        else {
                            for(let i = 0; i < abuttons.length; i++) {
                                abuttons[i].style.width = "45%";
                            }
                        }
                    }
                    if(sb.getElementsByTagName('button').length > 0) {
                        if(lt) {
                            for(let i = 0; i < sbuttons.length; i++) {
                                sbuttons[i].style.width = "95%";
                            }
                        }
                        else {
                            for(let i = 0; i < sbuttons.length; i++) {
                                sbuttons[i].style.width = "45%";
                            }
                        }
                    }
                }, 30);
            }
        }
    }
    xhr.send();
}

var g = [];
function submitGenres() {
    var s = document.getElementById("selected_genres");
    if(s.textContent.includes('Genres')) {
        var inc = document.getElementById("g_incomplete");
        inc.style.visibility = "visible";
        inc.style.opacity = 1;
        clearInterval(wait);
        var n = 0;
        var wait = setInterval(function () {
            if (n > 200) {
                inc.style.opacity -= .01;
                if (inc.style.opacity <= .02) {
                    inc.style.visibility = "hidden";
                    inc.style.opacity = 1;
                    n = 0;
                    clearInterval(wait);
                }
            }
            n++;
        }, 20);
        return;
    }
    s = s.childNodes;
    for(let iter = 0; iter < s.length; iter++) {
        var node = s[iter];
        g.push(node.textContent);
    }
    document.getElementById("genreSelector").style.display = "none";
    document.getElementById("bandSelector").style.display = "block";
    writeData(g, '/preferences/Favorite Genres');
    artistPage();
}

var done = false;

function artistPage() {
    var artists = [];
    var allArtists = [];
    var artInput = document.getElementById("artists");
    var loader = document.getElementById("loader");
    switchedOver = true;
    $.getJSON( "../samples/Data/music.json", function( data ) {
        $.each( data, function( key, val ) {
            var gtg = true
            for(let j = 0; j < allArtists.length; j++) {
                if(allArtists[j] == val.artist.name) {
                    gtg = false;
                    break;
                }
            }
            if(gtg) allArtists.push(val.artist.name);
            var has = false;
            if(val.artist.name.length > 20) has = true;
            for(let j = 0; j < artists.length; j++) {
                if(artists[j] == val.artist.name) has = true;
            }
            if(!has) {
                for(let i = 0; i < g.length; i++) {
                    if(g[i] == val.artist.terms) {
                        artists.push(val.artist.name);
                    }
                }
            }
        });
    })
    .done(function() {
        if(artists.length > 0) {
            document.getElementById("recommended_bands").style.display = "block";
            artists.sort();
        }
        for(let i = 0; i < artists.length; i++) {
            addButtonToSuggestions(artists[i]);
        }
    });
    function readdSuggestions(name) {
        artists.push(name);
        artists.sort();
        document.getElementById("recommendations").innerHTML = "";
        for(let i = 0; i < artists.length; i++) {
            addButtonToSuggestions(artists[i]);
        }
    }
    artInput.addEventListener("keyup", function(event) {
        var input = artInput.value;
        if(event.keyCode == 13) {
            addButtonToSelected(input);
            artInput.select();
            artInput.value = "";
            return;
        }
        var autocomplete = document.getElementById("band_autocomplete");
        var rec = document.getElementById("recommended_bands");
        autocomplete.innerHTML = "";
        if(input == "") {
            autocomplete.style.display = "none";
            if(artists.length > 0) rec.style.display = "block";
            artInput.style.borderRadius = "10px";
            return;
        }
        else {
            rec.style.display = "none";
            autocomplete.style.display = "block";
            artInput.style.borderRadius = "10px 10px 0 0";
        }
        for(let i = 0; i < allArtists.length; i++) {
            if(allArtists[i].toLowerCase().substr(0,input.length).includes(input)) {
                addButtonToAutocomplete(allArtists[i]);
            }
        }
    });
    function addButtonToAutocomplete(name) {
        // Declare a new button with the name within it
        var b = document.createElement("button");
        var node = document.createTextNode(name);
        b.appendChild(node);
        var au = document.getElementById("band_autocomplete");
        var input = document.getElementById("artists");

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
            delete allArtists 
            addButtonToSelected(name, "a");
            input.select();
        });

        b.addEventListener("mouseover", function() {
            b.style.backgroundColor = "transparent";
            b.style.borderColor = "#C293D6";
            b.style.color = "#C293D6";
            b.style.cursor = "pointer";
        });
        b.addEventListener("mouseout", function() {
            b.style.backgroundColor = "transparent";
            b.style.borderColor = "#444";
            b.style.color = "#444";
            b.style.cursor = "initial";
        });
        b.addEventListener("focus", function() {
            b.style.outline = "none";
        });
        // append the button into the autocomplete column
        au.appendChild(b);
    }
    function addButtonToSuggestions(name) {
        // Declare a new button with the name within it
        var b = document.createElement("button");
        var node = document.createTextNode(name);
        b.appendChild(node);
        var re = document.getElementById("recommendations");
        var input = document.getElementById("artists");

        // add style to the button
        b.style.border = "2px solid #1CD5BC";
        b.style.backgroundColor = "#1CD5BC";
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
            addButtonToSelected(name, "s");
            input.select();
        });

        b.addEventListener("mouseover", function() {
            b.style.backgroundColor = "#C293D6";
            b.style.cursor = "pointer";
        });
        b.addEventListener("mouseout", function() {
            b.style.backgroundColor = "#1CD5BC";
            b.style.cursor = "initial";
        });
        b.addEventListener("focus", function() {
            b.style.outline = "none";
        });
        // append the button into the autocomplete column
        re.appendChild(b);
    }

    function addButtonToSelected(name, from) {
        // declare new button
        var b = document.createElement("button");
        var node = document.createTextNode(name);
        b.appendChild(node);
        var s = document.getElementById("selected_bands");
        var input = document.getElementById("artists");

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
        for(let i = 0; i < allArtists.length; i++){
            if(allArtists[i] == name) {
                delete allArtists[i];
                for(let j = i; j < allArtists.length-1; j++) {
                    allArtists[j] = allArtists[j+1];
                }
                allArtists.pop();
                break;
            }
        }
        for(let i = 0; i < artists.length; i++) {
            if(artists[i] == name) {
                delete artists[i];
                for(let j = i; j < artists.length-1; j++) {
                    artists[j] = artists[j + 1];
                }
                artists.pop();
                break;
            }
        }
        // invoke the event listener to re-recieve the artists
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
            allArtists.push(name);
            if(from == "s") {
                readdSuggestions(name);
            }
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
        if(s.textContent.includes('The bands you select')) s.innerHTML = "";
        s.appendChild(b);
    }
    var used = new Set([0]);
    var x = 0;
    var iput = document.getElementById("artists");
    var current = "Enter an artist";
    iput.placeholder = current;
    var addIter = 0;
    var intravle = setInterval(function() {
        if(done) clearInterval(intravle);
        else {
            if(x > 100 && x < (100 + current.length)) {
                iput.placeholder = iput.placeholder.substr(0, iput.placeholder.length-1);
            }
            // once the current placeholder is gone, generate a new random one and assign to current
            if(x == (100 + current.length)) {
                if(used.size >= allArtists.length) {
                    used.clear();
                    used.add(0);
                }
                var rand = 0;
                while(used.has(rand)) rand = Math.floor(Math.random() * allArtists.length);
                used.add(rand);
                current = allArtists[rand];
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
            var ibox = document.getElementById("bib").clientHeight + 130;
            var sbox = document.getElementById("selected_bands").clientHeight + 110;
            if(ibox > sbox) {
                loader.style.cssText += "height: " + ibox + "px;";
            } else {
                loader.style.cssText += "height: " + sbox + "px;";
            }
        }
    }, 30);
}

var a = [];
function bandDone() {
    var s = document.getElementById("selected_bands");
    if(s.textContent.includes('The bands you select')) {
        var inc = document.getElementById("b_incomplete");
        inc.style.visibility = "visible";
        inc.style.opacity = 1;
        clearInterval(wait);
        var n = 0;
        var wait = setInterval(function () {
            if (n > 200) {
                inc.style.opacity -= .01;
                if (inc.style.opacity <= .02) {
                    inc.style.visibility = "hidden";
                    inc.style.opacity = 1;
                    n = 0;
                    clearInterval(wait);
                }
            }
            n++;
        }, 20);
        return;
    }
    done = true;
    var l = document.getElementById("loader");
    s = s.childNodes;
    for(let int = 0; int < s.length; int++) {
        a.push(s[int].textContent);
    }
    writeData(a, '/preferences/Favorite Artists');
    document.getElementById("bandSelector").style.display = "none";
    document.getElementById("experience").style.display = "block";
    var h = l.clientHeight;
    var ratio = h / 100;
    var hold = setInterval(function() {
        l.style.cssText += "height: " + h + "px;";
        h-=ratio;
        if(h <= 300) ratio = 5;
        if(h < 250) {
            experiencePage();
            clearInterval(hold);
        }
    }, 10);
}

function experiencePage() {
    var yi = document.getElementById("yearsIn");
    window.addEventListener("click", function(e) {
        var cont = true;
        if(!yi.classList.contains("open") && e.target == yi) {
            yi.classList.add("open");
            cont = false;
        }
        if(yi.classList.contains("open") && cont) yi.classList.remove("open");
    })
    yi.addEventListener("click", function() {
        var sel = yi.options[yi.selectedIndex];
        var allOptions = yi.children;
        for(let i = 0; i < allOptions.length; i++) {
            if(allOptions[i].classList.contains("InSelected")) allOptions[i].classList.remove("InSelected");
        }
        if(sel.value.length > 1) sel.classList.add("InSelected");
    });
}

function Years_Done() {
    var yi = document.getElementById("yearsIn");
    var val = yi.options[yi.selectedIndex].value;
    if(val != "error") {
        document.getElementById("e_incomplete").style.display = "none";
        document.getElementById("years").style.display = "none";
        writeData(val, "/preferences/Experience");
        window.location.href = "../dashboard";
    }
    else {
        var inc = document.getElementById("e_incomplete");
        inc.style.visibility = "visible";
        inc.style.opacity = 1;
        clearInterval(wait);
        var n = 0;
        var wait = setInterval(function () {
            if (n > 200) {
                inc.style.opacity -= .01;
                if (inc.style.opacity <= .02) {
                    inc.style.visibility = "hidden";
                    inc.style.opacity = 1;
                    n = 0;
                    clearInterval(wait);
                }
            }
            n++;
        }, 20);
    }
}

function Inst_Done() {
    console.log("it worked");
}