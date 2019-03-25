function encrypt(pw, salt) {
    for(var i = 0; i < salt.length; i++) {
        var temp = Number(salt.charCodeAt(i));
        if(temp + pw.charCodeAt(temp % pw.length) < 126) {
            //document.getElementById("demo").innerHTML += "WE FUCKIN MADE IT HERE";
            salt.charCodeAt(i) = temp + pw.charCodeAt(temp % pw.length);
        }
        else {
            //document.getElementById("demo").innerHTML += "IT MADE IT TO HEEEERRREEEE";
            salt.charCodeAt(i) = temp - pw.charCodeAt(temp % pw.length);
        }
    }
    return salt;
}

function write_Data_to_File(profile, fileName) {
    const fs = require('fs'); 
    fs.writeFile(fileName, profile, (err) => { if (err) throw err; });
}

function createAccount() {
    var p = document.getElementById("pass").value;
    var p2 = document.getElementById("pass2").value;
    var userName = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var salt = generateSalt();
    if(p == "" || p2 == "" || email == "" || userName == "" || !emailIsValid(email) || p != p2) {
        // display document element that shows whats wrong
        return false;
    } 
    p = encrypt(p, salt);
    acct = new userAccount(userName, email, p, salt);
    var IP = " ";
    $.getJSON("http://smart-ip.net/geoip-json?callback=?", function(data){
        IP = data.host;
    });
    CR = new creationRequest(userAccount, IP);
}

function emailIsValid(email) {
    var at = -1;
    var dot = -1;
    for(var i = 0; i < email.length; i++) {
        if(email.charAt(i) == '@') at = i + 1;
        if(email.charAt(i) == '.') dot = i + 1;
    }
    // if the domain or the site type is less than 2 characters, its not valid
    if((dot - at) < 2 || (email.length - dot) < 2 || at == -1 || dot == -1) return false;
    return true;
}

function generateSalt() {
    var tempSalt = "";
    var salt = "";
    for(var i = 0; i < 30; i++) {
        // generate a random number between 33 and 126
        tempSalt = Math.round(33 + Math.random() * 92).toString();
        // add this keycode's ascii member to the salt
        salt += String.fromCharCode(tempSalt);
    }
    return salt;
}

class userAccount {
    constructor(userName, email, password, salt) {
        // projects is a set of project objects
        this.projects = new Set();
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.salt = salt;
        this.loggedIn = true;
    }

    getUserName() {
        return this.userName;
    }

    getEmail() {
        return this.email;
    }

    verifyPassword(pass) {
        if(pass == this.password) return true;
        else return false;
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    addProject(project) {
        projects.add(project);
    }

    getProject(projectName) {
        // return the project object correlated with the name given
        return projects.get(projectName);
    }
}

class creationRequest {
    constructor(account, IPaddress) {
        this.account = account;
        this.IPaddress = IPaddress;
    }

    getUserName() {
        return this.account.getUserName();
    }

    getIP() {
        return this.IPaddress;
    }
}