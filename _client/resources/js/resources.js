var resources = {
	"api_root"	: "http://localhost/api",
	"api_user"	: "http://localhost/api/users",
	"api_auth"	: "http://localhost/api/authentication"
}

function display_error(field, message) {
	var notification = document.getElementById(field + "_notification");
	notification.innerHTML = message;
	notification.style.display = "block";
	document.addEventListener("keypress", () => {
		notification.innerHTML = "";
		notification.style.display = "none";
	});
	console.log("error: " + message);
}
