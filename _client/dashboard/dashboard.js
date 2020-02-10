window.addEventListener("load", () => {
	if(localStorage.getItem(resources.token) == null) window.location.href = "/";
	else {
		// Performe an authentication get request
		var token = JSON.parse(localStorage.getItem(resources.token));
		console.log("token: " + token.token);
		console.log("exp_date: " + token.expirationDate);
		console.log("links: " + token.links);
	}
})
