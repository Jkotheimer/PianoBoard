function encrypt(pw, salt) {
    var encryption = "";
    for(var i = 0; i < salt.length; i++) {
        var currentSaltCode = Number(salt.charCodeAt(i));
        var randomPassCode = Number(pw.charCodeAt(currentSaltCode % pw.length));
        var newCode = Math.round((currentSaltCode + randomPassCode) / 2);
        encryption += String.fromCharCode(newCode);
    }
    return encryption;
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
    var acct = new userAccount(userName, email, p, salt);
    var IP = document.getElementById("demo").innerHTML;
    // verify that the ip address hasn't attempted to make more than 10 requests in the past 24 hours.
    //verifyIP(IP);
    var data = "We fuckin did it, broski!";
    write('./fs.js', data, (err) => { if (err) throw err;});
    // verify that there are no accounts with the current username/email address
    // create the account
}

function verifyIP(IP) {
    $.getJSON( "requests.js", function( json ) {
        console.log( "JSON Data: " + json.users[ 3 ].name );
    });
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
        // This is a map of ip addresses to the number of requests.
        this.requests = new Map();
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

    verifyRequest(IPAddress){
        if(this.requests.has(IPAddress)){
            if(this.requests.get(IPAddress) > 10) return false;
            else {
                var requestAmount = this.requests.get(IPAddress) + 1;
                this.requests.set(IPAddress, requestAmount);
                return true;
            }
        }
        else {
            this.requests.set(IPAddress, 1);
            return true;
        }
    }

    addProject(project) {
        projects.add(project);
    }

    getProject(projectName) {
        // return the project object correlated with the name given
        return projects.get(projectName);
    }
}