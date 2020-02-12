var account;

window.addEventListener("load", get_account());

// Get the account object from the server
function get_account() {
	var xhr = new XMLHttpRequest();
	var ID = getCookie(resources.uid);
	xhr.open("GET", resources.api_user + "/" + ID, true);
	xhr.onload = function() {
		if(xhr.status == 200) {
			var account = JSON.parse(xhr.response);
			displayInfo(account);
			setLinks(account);
		}
		else {
			alert("Sorry, but we could not sign you in at this time");
			window.location.href = "/";
		}
	}
	xhr.send();
}

// Display the user's info in the correct places
function displayInfo(account) {
	document.getElementById("username").value = account.username;

	var genre_container = document.getElementById("favoriteGenres");
	var artist_container = document.getElementById("favoriteArtists");
	if(account.favoriteGenres == [] || account.favoriteGenres.length == 0) {
		genre_container.innerHTML = "<span style='color: var(--cream)'>You haven't shared any of your favorite music genres yet</span>";
	} else {
		genre_container.innerHTML = null;
		account.favoriteGenres.forEach(genre => {
			genre_container.innerHTML += "<span class='favorite_element'>" + genre + "</span>";
		});
	}
	setEventListeners(document.getElementById("addFavoriteGenre"), document.getElementById("genre_search"), getLink(account.links, "addFavoriteArtist"));
	if(account.favoriteArtists == [] || account.favoriteArtists.length == 0) {
		artist_container.innerHTML = "<span style='color: var(--cream)'>You haven't shared any of your favorite artists yet</span>";
	} else {
		artist_container.innerHTML = null;
		account.favoriteArtists.forEach(artist => {
			artist_container.innerHTML += "<span class='favorite_element'>" + artist + "</span>";
		});
	}
	setEventListeners(document.getElementById("addFavoriteArtist"), document.getElementById("artist_search"), getLink(account.links, "addFavoriteArtist"));
}

// Attach HATEOAS links to UI elements
function setLinks(account) {

}

// Add the event listeners to user inputs to send API requests to gather data to place in a search result area
function setEventListeners(input, output, link) {
	input.addEventListener("keypress", (event) => {
		if(event.keyCode == 13) {
			pushUpdate(input.value, link);
			return;
		}
		// TODO make an xhr request to get query matches to the genre
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://api.spotify.com/v1/search?q=the%20lines", true);

		xhr.onload = function() {
			console.log(xhr.response);
		}
		xhr.send();
	});
}

// Push the provided data to the current account, writing to the specified action
function pushUpdate(data, link) {
	var xhr = new XMLHttpRequest();
	xhr.open(element.method, element.url, true);
	xhr.onload = function() {
		if(xhr.status == 200) {
		}
	}
}

// Delete the token from the server and client, then redirect home
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

// Get the link object correlating with the specified action within the given item
function getLink(links, action) {
	console.log(links);
	var value;
	links.forEach(element => {
		if(element.action == action) value = element;
	});
	if(value == undefined) throw Error("Link not found");
	else return value;
}
