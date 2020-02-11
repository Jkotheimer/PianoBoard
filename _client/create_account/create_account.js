window.addEventListener('load', function() {
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
	var password = document.getElementById("password").value;
	var confirm_password = document.getElementById("confirm_password").value;

	const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!email_regex.test(email) || email.length < 3) {
		display_error("email", "Please enter a valid email address");
		return;
	}
	if(password.length < 8) {
		display_error("password", "Password is too short");
		return;
	}
	if(password != confirm_password) {
		display_error("confirm_password", "Passwords do not match");
		return;
	}

	var data = JSON.stringify({
		"email" : email,
		"password" : password
	});

	var xhr = new XMLHttpRequest();
	xhr.open("POST", resources.api_user, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function() {
		if(xhr.status == 201) {
			// The account has been created and the cookies have been set, so we just need to navigate to the dashboard
			window.location.href = "/dashboard";
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
