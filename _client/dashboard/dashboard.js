var token, account;
window.addEventListener("load", () => {
	token = JSON.parse(localStorage.getItem(resources.token));
	if(token == null) window.location.href = "/";
	else {
		// Performe an authentication get request
		var accountXHR = new XMLHttpRequest();
		var link = getLink(token, "get_account");
		console.log(JSON.stringify(link));
		accountXHR.open(link.method, link.url, true);
		accountXHR.setRequestHeader("authentication", token.token);
		accountXHR.setRequestHeader("Content-Type", "application/json");
		accountXHR.onload = function() {
			if(accountXHR.status == 200) {
				account = accountXHR.response;
				localStorage.setItem(resources.account, account);
				console.log("account: " + account);
			}
			else if(accountXHR.status == 404) {
				// TODO display error that for whatever reason, an account with your ID cannot be found
				// We panic if any of this code executes
				console.log("There is no account with this ID");
			}
		}
		accountXHR.send();
	}
})
function sign_out() {
	localStorage.removeItem(resources.token);
	localStorage.removeItem(resources.account);
	var xhr = new XMLHttpRequest();
	var link = getLink("logout");
	xhr.open()
}
function getLink(item, action) {
	var value;
	item.links.forEach(element => {
		if(element.action == action) value = element;
	});
	if(value == undefined) throw Error("Link not found");
	else return value;
}
