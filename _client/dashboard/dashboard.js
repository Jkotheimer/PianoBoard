var account;
window.addEventListener("load", () => {
	// Get the account object from the server
	var xhr = new XMLHttpRequest();
	var ID = getCookie(resources.uid);
	xhr.open("GET", resources.api_user + "/" + ID, true);
	xhr.onload = function() {
		if(xhr.status == 200) {
			account = JSON.parse(xhr.response);
		}
		else {
			alert("Sorry, but we could not sign you in at this time");
		}
	}
	xhr.send();
});
function sign_out() {
	var xhr = new XMLHttpRequest();
	var link = getLink(account, "logout");
	xhr.open(link.method, link.url, true);
	xhr.onload = function() {
		if(xhr.status == 200) {
			document.cookie = null;
			window.location.href = "/";
		}
		else {
			// TODO implement error dialogue
			alert(xhr.response);
		}
	}
	xhr.send();
}
function getLink(item, action) {
	console.log(item);
	var value;
	item.links.forEach(element => {
		if(element.action == action) value = element;
	});
	if(value == undefined) throw Error("Link not found");
	else return value;
}
