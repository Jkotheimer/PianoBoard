// Initialize Firebase
var config = {
    apiKey: "AIzaSyBwym8F4l5GlHDMQLHyZOY3dNWKMz_hxKI",
    authDomain: "pianoboard-d97c2.firebaseapp.com",
    databaseURL: "https://pianoboard-d97c2.firebaseio.com",
    projectId: "pianoboard-d97c2",
    storageBucket: "pianoboard-d97c2.appspot.com",
    messagingSenderId: "266279955938"
};
firebase.initializeApp(config);

/**
* Handles the sign in button press.
*/
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('pass').value;
        if (email.length < 4) {
            // TODO reveal html element asking for a valid email
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            // TODO reveal an html element asking for a valid password
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                // TODO reveal html element saying 'incorrect username/password'
                alert('Wrong password.');
            } else {
                // TODO reveal html element saying 'incorrect username/password'
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
}
/**
* Handles the sign up button press.
*/
function handleSignUp() {
    var email = document.getElementById('email').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('pass').value;
    var vpass = document.getElementById('pass2').value;
    if(password != vpass) {
        alert('Your passwords do not match');
        return;
    }
    if (!emailIsValid(email)) {
        alert('Please enter an email address.');
        return;
    }
    if (passwordStrength(password) < 2) {
        alert('Your password is too weak');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        return;
        // [END_EXCLUDE]
    });
    document.getElementById("header").style.left += "120vw";
    document.getElementById("loader").style.left += "30vw";
    var hold = setInterval(function () {
        var user = firebase.auth().currentUser;
        if(user) {
            user.updateProfile({displayName: username});
            window.location.href = "../userAccount/dashboard";
            clearInterval(hold);
        }
    }, 500);
    // [END createwithemail]
}

/**
* Sends an email verification to the user.
*/
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}

function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}
/**
* initApp handles setting up UI event listeners and registering Firebase auth listeners:
*  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
*    out, and that is where we update the UI.
*/
/*
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            document.getElementById('quickstart-sign-in').textContent = 'Sign out';
            document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            if (!emailVerified) {
                document.getElementById('quickstart-verify-email').disabled = false;
            }
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('quickstart-sign-in').textContent = 'Sign in';
            document.getElementById('quickstart-account-details').textContent = 'null';
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
    document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
    document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}

window.onload = function() {
    initApp();
};
*/

/**
 * Verify that the email provided is in a correct format
 */
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

/**
 * Verify that the user's password is strong
 * -1: horrible
 * 0: unacceptable
 * 1: needs more special characters and numbers
 * 2: try to spice things up a little more
 * 3: good
 * 4: great
 * 5: perfect!
 */
function passwordStrength(password) {
    if(password.length < 4) return -1;
    if(password.length < 8) return 0;
    var strength = Math.round(password.length/10);
    for(let i = 0; i < password.length; i++) {
        // if the character is a special character, add one to the strength
        var cc = password.charCodeAt(i);
        if(cc > 57 && cc < 65) strength++;
        if(cc < 48 || (cc > 90 && cc < 97) || cc > 122) strength+=2;
    }
    return strength;
}

function showInfo() {
    var user = firebase.auth().currentUser;
    var content = document.getElementById("info");
    if(user) {
        content.innerHTML = "Username: " + user.displayName + "<br>" + "Email: " + user.email;
    } else {
        content.innerHTML = "fucckkk";
    }
}