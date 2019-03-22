function encrypt(pw, salt) {
    pw = pw + salt;
    return pw;
}

function write_Data_to_File(profile, fileName) {
    const fs = require('fs'); 
    fs.writeFile(fileName, profile, (err) => { if (err) throw err; });
}

function createAccount() {
    var p = document.getElementById("pass");
    var p2 = document.getElementById("pass2");
    var userName = document.getElementById("username");
    var email = document.getElementById("email");
    var salt = Math.random();
    encrypt(pw, salt);
    if(p != p2) {
        //display a doc element that points to the pverification, saying they dont match
        return false;
    }
    acct = new userAccount(userName, email, p, salt);
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