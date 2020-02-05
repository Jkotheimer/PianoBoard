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
	xhr.open("POST", resources.api_root, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function() {
		if(xhr.status == 201) {
			localStorage.setItem(resources.token, xhr.response);
			window.location = "/dashboard";
		}
		else if(xhr.status == 409) {
			// display user already exists error
			display_error("email", xhr.response);
		} else {
			// display server error
			display_error("confirm_password", "There was a server error :/<br/>Try again later.");
		}
	}
	xhr.send(data);
}

function display_error(field, message) {
	var notification = document.getElementById(field + "_notification");
	notification.innerHTML = message;
	notification.style.display = "block";
	document.getElementById(field).addEventListener("keypress", () => {
		notification.innerHTML = "";
		notification.style.display = "none";
	});
	console.log("error: " + message);
}
