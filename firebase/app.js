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

var auth = firebase.auth();
/**
* Handles the sign in button press.
*/
function toggleSignIn() {
    if (auth.currentUser) {
        // [START signout]
        auth.signOut();
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
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
            auth.signInWithEmailAndPassword(email, password).catch(function(error) {
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
            }).then(function() {
                window.location.href = "./dashboard";
            })
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
    // Sign in with email and pass.
    // [START createwithemail]
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
        auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
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
        }).then(T => {
            document.getElementById("header").style.left += "120vw";
            document.getElementById("loader").style.left += "30vw";
            var hold = setInterval(function() {
                var user = auth.currentUser;
                if(user) {
                    user.updateProfile({
                        displayName: username
                    }).then(function() {
                        window.location.href = "../dashboard";
                        clearInterval(hold);
                    });
                }
            }, 10);
        })
    });
    // [END createwithemail]
}

/**
* Sends an email verification to the user.
*/
function sendEmailVerification() {
    // [START sendemailverification]
    auth.currentUser.sendEmailVerification().then(function() {
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
    auth.sendPasswordResetEmail(email).then(function() {
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

function signOut() {
    auth.signOut().then(function() {
        window.location.href = "../";
    }).catch(function(error) {
        // An error happened.
        alert("An error occurred: " + error);
    });
}
/**
* initApp handles setting up UI event listeners and registering Firebase auth listeners:
*  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
*    out, and that is where we update the UI.
*/
var displayName;
var email;
var emailVerified;
var photoURL;

function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    auth.onAuthStateChanged(function(user) {
        if(user) {
            // User is signed in.
            displayName = user.displayName;
            email = user.email;
            emailVerified = user.emailVerified;
            photoURL = user.photoURL;
            if (!emailVerified) {
                // TODO have a verified email button to enable/disable
            }
            // [END_EXCLUDE]
        } else {
            // User is signed out, so go to the login page
        }
    });
}

window.onload = function() {
    initApp();
};


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

function showInfo() {
    var user = auth.currentUser;
    var sideBar = document.getElementById("info");
    var navBar = document.getElementById("welcomeUser");
    var projects = document.getElementById("projectArea");
    var profilePicture = document.getElementById("profpic");
    var j = 0;
    var wait = setInterval(function() {
        user = auth.currentUser;
        if(user) {
            sideBar.innerHTML = user.displayName + "<br><br>" + user.email;
            navBar.innerHTML = "Welcome, " + user.displayName + "!";
            projects.innerHTML = "You haven't started any projects yet";
            //TODO display all projects as little link items

            // retrieve the users profile picture to show in the lil thingy
            var dir = "/profilePics/" + user.displayName + "/profilePic";
            var child = firebase.storage().ref().child(dir);
            var i = 0;
            var hold = setInterval(function() {
                child.getDownloadURL().then(function(url) {
                    profilePicture.src = url;
                    clearInterval(hold);
                }).catch(function(error) {
                    profilePicture.src = "../images/Piano.jpg";
                });
                if(i > 500) clearInterval(hold);
                i++;
            }, 10);
            clearInterval(wait);
        } else {
            sideBar.innerHTML = "retrieving your information..";
            navBar.innerHTML = "Welcome, user!";
            projects.innerHTML = "You're not signed in";
        }
        if(j > 1000) clearInterval(wait);
        j++
    }, 10);
}

function uploadProfilePic(event) {
    event.preventDefault();
    var profPic = document.getElementById("profpic");
    var cam = document.getElementById("cam");
    profPic.style.opacity = 1;
    cam.style.visibility = "hidden";
    let dt = event.dataTransfer;
    if(dt == null) return;
    let file = dt.files[0];
    var user = auth.currentUser;
    var dir = "/profilePics/" + user.displayName + "/profilePic";
    var child = firebase.storage().ref().child(dir);
    child.put(file).then(function(snapshot) {
        console.log(file);
    }).catch(function(error) {
        console.error(error);
    });
    var hold = setInterval(function() {
        child.getDownloadURL().then(function(url) {
            // Insert url into an <img> tag to "download"
            profPic.src = url;
            clearInterval(hold);
        }).catch(function(error) {/**wait*/});
    }, 10);
}