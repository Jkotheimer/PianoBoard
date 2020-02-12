var resources = {
	"account"	: "pianoboard_account",
	"token"		: "pianoboard_token",
	"uid"		: "pianoboard_uid",
	"api_root"	: "http://localhost/api",
	"api_user"	: "http://localhost/api/users",
	"api_auth"	: "http://localhost/api/authentication",
}

function display_error(field, message) {
	var notification = document.getElementById(field + "_notification");
	notification.innerHTML = message;
	notification.style.display = "block";
	document.addEventListener("keypress", () => {
		notification.innerHTML = "";
		notification.style.display = "none";
	});
	throw Error(message);
}

// This function comes from StackOverflow...
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function deleteCookie(name) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
