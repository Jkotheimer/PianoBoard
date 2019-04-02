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
            auth.signInWithEmailAndPassword(email, password).then(function() {
                window.location.href = "./dashboard";
            })
            .catch(function(error) {
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
        showError("confirm_password_notification", "Passwords do not match");
        return;
    }
    if (!emailIsValid(email)) {
        showError("email_notification", "Invalid email address");
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
                showError("password_notification", "Password is too weak");
            } else if(errorCode == 'auth/email-already-in-use'){
                showError("email_notification", "Email is already in use");
            }
            console.log(error);
            return;
            // [END_EXCLUDE]
        }).then(T => {
            var i = 0;
            var hold = setInterval(function() {
                var user = auth.currentUser;
                if(user) {
                    document.getElementById("header").style.left += "120vw";
                    document.getElementById("loader").style.left += "30vw";
                    if(i > 500) {
                        user.updateProfile({
                            displayName: username
                        }).then(function() {
                            window.location.href = "../dashboard";
                            clearInterval(hold);
                        });
                    }
                }
                i++;
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
            // TODO unhide an invalid email element
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            // TODO unhide a user not found element
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

function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    auth.onAuthStateChanged(function(user) {
        if(user) {
            // User is signed in.
            displayName = user.displayName;
            email = user.email;
            emailVerified = user.emailVerified;
            if (!emailVerified) {
                // TODO have a verified email button to enable/disable
            }
        } else {
            // the user is signed out
        }
    });
    // [END authstatelistener]
}

window.onload = function() {
    initApp();
};


/**
 * Verify that the email provided is in a correct format
 */
var hold;
function showError(id, message) {
    if(hold) return;
    var error = document.getElementById(id);
    error.innerHTML = message;
    error.style.visibility = "visible";
    var i = 0;
    var opacity = 1;
    var left = true;
    hold = setInterval(function() {
        error.style.opacity = opacity;
        if(i > 500) opacity -= .01;
        if(error.style.opacity < .02) {
            error.style.visibility = "hidden";
            error.style.opacity = 1;
            clearInterval(hold);
            hold = false;
            return;
        }
        if(i <= 100 && i%20 == 0) {
            if(left) {
                error.style.cssText += "transform: translatex(5px) translatey(-1px);";
                left = false;
            } else {
                error.style.cssText += "transform: translatex(-5px) translatey(1px);";
                left = true;
            }
        }
        i++;
    }, 10);
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
            // sideBar.innerHTML = user.displayName + "<br><br>" + user.email;
            navBar.innerHTML = "Welcome, " + user.displayName + "!";
            projects.innerHTML = "You haven't started any projects yet";
            //TODO display all projects as little link items
            


            // retrieve the users profile picture to show in the lil thingy
            var dir = "/profilePics/" + user.uid + "/profilePic";
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
            //sideBar.innerHTML = "retrieving your information..";
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
    var dir = "/profilePics/" + user.uid + "/profilePic";
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

function updateProject(projectName) {
    var userId = auth.currentUser.uid;
    firebase.database().ref('users/' + userId + "/projects/" + projectName).set({
        // TODO write the project data to the database
    }, function(error) {
        if (error) {
            // The write failed...
            console.log(error);
        } else {
            // Data saved successfully!
            console.log("success");
        }
    });
}