$(document).ready(function() {
	for(let e of document.getElementsByTagName("input")) {
		e.addEventListener("keyup", function() {
			if(e.value.length > 1) e.classList.add("complete_form_input");
		   else e.classList.remove("complete_form_input");
		});
	}
});

function create_account() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var confirm_password = document.getElementById("confirm_password").value;

	if(password != confirm_password) {
		// TODO show an error message that the passwords do not match
		return;
	}

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8081?username=" + username + "&password=" + password, true);
	xhr.onload = function() {
		if(xhr.status != 201) {
			// TODO display error
		}
		else {
			localStorage.setItem("account", xhr.response);

		}
	}
	xhr.send();
}
