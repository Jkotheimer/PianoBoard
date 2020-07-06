function load() {
	var email = document.getElementById("email");
	email.addEventListener("change", () => {
		check_complete_input(email, () => {email.classList.add('complete_form_input')}, () => {email.classList.remove('complete_form_input')})
	});
	email.addEventListener("keyup", () => {
		check_complete_input(email, () => {email.classList.add('complete_form_input')}, () => {email.classList.remove('complete_form_input')})
	});
	var password = document.getElementById("password");
	password.addEventListener("change", () => {
		check_complete_input(password, () => {password.classList.add('complete_form_input')}, () => {password.classList.remove('complete_form_input')})
	});
	password.addEventListener("keyup", () => {
		check_complete_input(password, () => {password.classList.add('complete_form_input')}, () => {password.classList.remove('complete_form_input')})
	});
	var confirm_password = document.getElementById("confirm_password");
	confirm_password.addEventListener("change", () => {
		check_complete_input(confirm_password, () => {confirm_password.classList.add('complete_form_input')}, () => {confirm_password.classList.remove('complete_form_input')})
	});
	confirm_password.addEventListener("keyup", () => {
		check_complete_input(confirm_password, () => {confirm_password.classList.add('complete_form_input')}, () => {confirm_password.classList.remove('complete_form_input')})
	});
	var error = get_query_parameter("error");
	var prev_form = localStorage.getItem("prev_form");
	if(error && prev_form) {
		error = JSON.parse(window.atob(error));
		display_error(error.context, error.message);
		reset_form(JSON.parse(prev_form));
	}
	else if(error) {
		var url = window.location.href
		window.location.href = url.substring(0, url.indexOf('?'));
	}
	else {
		localStorage.removeItem("prev_form");
	}
	check_all_complete_inputs(document.body);
}

function validate_create_account() {
	var email = document.getElementById("email").value;
	if(!check_valid_email(email)) {
		display_error("email", "Invalid Email");
		return false;
	}
	var password = document.getElementById("password").value;
	if(!check_valid_password(password)) {
		display_error("password", "Password too weak");
		return false;
	}
	var confirm_password = document.getElementById("confirm_password").value;
	if(!check_matching_password(confirm_password)) {
		display_error("confirm_password", "Passwords do not match");
		return false;
	}
	var form = JSON.stringify({
		"email" : email
	});
	localStorage.setItem("prev_form", form);
}
