$(document).ready(function() {
	for(let e of document.getElementsByTagName("input")) {
		if(e.value.length > 0) e.classList.add("complete_form_input");
		e.addEventListener("keyup", function() {
			if(e.value.length > 0) e.classList.add("complete_form_input");
			else e.classList.remove("complete_form_input");
		});
	}
});

function create_account() {
	var email = document.getElementById("email").value;
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var confirm_password = document.getElementById("confirm_password").value;

	if(password != confirm_password) {
		// TODO show an error message that the passwords do not match
		return;
	}

	var data = JSON.stringify({
		"email" : email,
		"username" : username,
		"password" : password
	});

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost/api/", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function() {
		if(xhr.status == 201) {
			localStorage.setItem("pianoboard_token", xhr.response);
			window.location = "/dashboard";
		}
		else if(xhr.status == 409) {
			// TODO display user already exists
			var notification = document.getElementById("email_notification");
			notification.innerHTML = xhr.response;
			notification.style.display = "block";
			document.getElementById("email").addEventListener("keypress", () => {
				notification.innerHTML = "";
				notification.style.display = "none";
			});
			console.log("error " + xhr.status + ": " + xhr.response);
		} else {
			// TODO display server error
			console.log("error " + xhr.status + ": " + xhr.response);
		}
	}
	xhr.send(data);
}
