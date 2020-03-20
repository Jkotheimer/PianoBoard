const NULL = document.getElementById("NULL");
/**
 * LOAD FUNCTIONS
 * ____________________________________________________________________________
 */

function load() {
	var error = get_query_parameter("error");
	var prev_form = localStorage.getItem("prev_form");
	if(error && prev_form) {
		show_login(() => {
			error = JSON.parse(window.atob(error));
			display_error(error.context, error.message);
			reset_form(JSON.parse(prev_form));
		});
	}
	else if(error) {
		var url = window.location.href
		window.location.href = url.substring(0, url.indexOf('?'));
	}
	else {
		localStorage.removeItem("prev_form");
		auth_token();
	}
}

// Nothing is sent with this request because the token is a cookie
function auth_token() {
	if(xhr) return;
	xhr = new XMLHttpRequest();
	xhr.open("POST", resources.api_auth + "/token", true);
	xhr.onload = function() {
		var response = xhr;
		xhr = undefined;
		if(response.status == 201)
			get_account(
				(acc) => {show_dashboard(acc, false)},
				() => {show_login(() => {
							set_login_listeners();
							check_all_complete_inputs(content);
					})
				}
			);
		else show_login(() => {
			set_login_listeners();
			check_all_complete_inputs(content);
		});
	}
	xhr.send();
}

/**
 * LOGIN FUNCTIONS
 * ____________________________________________________________________________
 */

function show_login(load_function) {
	var content = document.getElementById("content");
	appendHtml(content, resources.templates + "/login.html");
	content.style.textAlign = "center";
	document.title = "Pianoboard Login";
	var wait = setInterval(function() {
		if(content.childElementCount == 1) {
			load_function();
			clearInterval(wait);
		}
	}, 10);
}

function set_login_listeners() {
	var email_element = document.getElementById("email");
	email_element.addEventListener("change", () => {
		check_complete_input(email_element,
							 () => {email_element.classList.add('complete_form_input')},
							 () => {email_element.classList.remove('complete_form_input')}
							);
	});
	email_element.addEventListener("keyup", () => {
		check_complete_input(email_element,
							 () => {email_element.classList.add('complete_form_input')},
							 () => {email_element.classList.remove('complete_form_input')}
		);
	});

	var password_element = document.getElementById("password");
	password_element.addEventListener("change", () => {
		check_complete_input(password_element,
							 () => {password_element.classList.add('complete_form_input')},
							 () => {password_element.classList.remove('complete_form_input')}
		);
	});
	password_element.addEventListener("keyup", () => {
		check_complete_input(password_element,
							 () => {password_element.classList.add('complete_form_input')},
							 () => {password_element.classList.remove('complete_form_input')}
		);
	});
}

function validate_login() {
	var email = document.getElementById("email").value
	if(!check_valid_email(email)) {
		display_error("email", "Invalid Email");
		return false;
	}
	if(!check_valid_password(document.getElementById("password").value)) {
		display_error("password", "Password too short");
		return false;
	}
	var form = JSON.stringify({
		"email" : email
	});
	localStorage.setItem("prev_form", form);
}

/**
 * DASHBOARD FUNCTIONS
 * ____________________________________________________________________________
 */

function show_dashboard(account, loaded) {
	var navbar, dash;
	if(!loaded) {
		var content = document.getElementById("content");
		appendHtml(content, resources.templates + "/navbar.html");
		appendHtml(content, resources.templates + "/dashboard.html");
		document.title = "Pianoboard Dashboard";
		var wait = setInterval(function() {
			if(content.childElementCount == 2) {
				remove_all_eventListeners(document.body);
				display_info(account);
				set_links(account);
				account = undefined; // Make sure account object is safe from cross site scripting
				clearInterval(wait);
			}
		}, 10);
	} else {
		remove_all_eventListeners(document.body);
		display_info(account);
		set_links(account);
		account = undefined; // Make sure account object is safe from cross site scripting
	}
}

// Display the user's info in the correct places
function display_info(account) {

	console.log(account);
	document.getElementById("username").value = account.username;

	var genre_container = document.getElementById("genre_container");
	var artist_container = document.getElementById("artist_container");
	if(account.favoriteGenres.length == 0) {
		genre_container.innerHTML = "<span style='color: var(--cream)'>You haven't shared any of your favorite music genres yet</span>";
	}
	else {
		genre_container.innerHTML = null;
		var link = getLink(account.links, 'removeFavoriteGenre');
		account.favoriteGenres.forEach(genre => {
			genre_container.appendChild(generate_favorite(genre, link));
		});
	}

	if(account.favoriteArtists.length == 0) {
		artist_container.innerHTML = "<span style='color: var(--cream)'>You haven't shared any of your favorite artists yet</span>";
	}
	else {
		artist_container.innerHTML = null;
		var link = getLink(account.links, 'removeFavoriteArtist');
		account.favoriteArtists.forEach(artist => {
			artist_container.appendChild(generate_favorite(artist, link));
		});
	}
}

// Attach HATEOAS links to UI elements
function set_links(account) {

	// Handle all blur events. If the element value is different from the respective value in the account object,
	// Prompt the user to press enter to commit that changed value
	var blur_function = function(element) {
		var field_name = element.id;
		var isIterable = is_iterable(account[field_name]);
		var separated_name = separate_words(element.id);
		if(isIterable) separated_name.substring(0, separated_name.length - 1);
		if(!isIterable && !contains(account[field_name], element.value) ||
			isIterable && element.value.length > 1 && !contains(account[field_name], element.value)) {
			display_notification("neutral", field_name, "Press enter to commit new " + separated_name);
			document.onkeyup = function(ev) {
				submit_listener(ev, () => {
					removeEventListener(document, "keyup");
					element.dispatchEvent(create_keyboard_event("keyup", ev.key, ev.keyCode));
					remove_notification(field_name);
				});
			};
			if(typeof account[field_name] == "string") {
				document.onmousedown = function() {
					element.value = account[field_name];
					remove_notification(field_name);
					removeEventListener(document, "mousedown");
				}
			}
		}
	};

	var keyup_function = function(event, element) {
		var separated_name = separate_words(element.id);
		var link_name = element.id.charAt(0).toUpperCase() + element.id.substring(1);
		var link;
		var isIterable = is_iterable(account[element.id]);
		if(isIterable) {
			link = getLink(account.links, "add" + link_name.substring(0, link_name.length - 1));
			separated_name = separated_name.substring(0, separated_name.length - 1);
		}
		else link = getLink(account.links, "update" + link_name);

		if(validators["attribute"](element.value) && !contains(account[element.id], element.value)) {
			submit_listener(event, () => {
				push_update(element.value,
							link,
							(acc) => {
								display_notification("success", element.id, separated_name + " updated successfully!");
								fade_notification(element.id);
								show_dashboard(acc, true);
								if(!isIterable) deselect_all();
								else {
									let el = document.getElementById(element.id);
									el.value = null;
									focus_on(el);
								}
							},
							(err) => {display_error(element.id, err)}
				)
			});
		} else if(!isIterable && !contains(account[element.id], element.value) || isIterable && element.value.length > 0){
			display_error(element.id, "Invalid " + separated_name);
		}
	}

	var username_element = document.getElementById("username");
	username_element.addEventListener("keyup", (event) => { keyup_function(event, username_element) });
	username_element.addEventListener("blur", () => { blur_function(username_element) });

	var genre_element = document.getElementById("favoriteGenres");
	genre_element.addEventListener("keyup", (event) => { keyup_function(event, genre_element) });
	genre_element.addEventListener("blur", () => { blur_function(genre_element) });

	var artist_element = document.getElementById("favoriteArtists");
	artist_element.addEventListener("keyup", (event) => { keyup_function(event, artist_element) });
	artist_element.addEventListener("blur", () => { blur_function(artist_element) });

	document.getElementById("sign_out").addEventListener("click", () => {
		push_update(null, getLink(account.links, "logout"), () => {location.reload()}, () => {location.reload()});
	});
}

// Add the event listeners to user inputs to send API requests to gather data to place in a search result area
function favorite_listener(input, output, _event, link) {
	input.addEventListener(_event, (event) => {
		if(input.value.length > 32) {
			output.innerHTML = "Entry length too long";
			return;
		}
		if(input.value.length < 1) {
			output.innerHTML = "Entry not long enough";
			return;
		}
		if(event.keyCode == 13) {
			push_update(input.value, link, display_info, log);
			input.value = "";
			output.innerHTML = "";
			return;
		}
		else {
			// TODO make a query for genres/artist names to put in the recommendation
			if(input.value == "") {
				output.innerHTML = "";
				return;
			}
			output.innerHTML = "Making a query for " + input.value;
		}
	});
}

/**
 * HTML GENERATORS
 * ____________________________________________________________________________
 */

function generate_favorite(value, link) {
	var result = document.createElement("span");
	result.className = "favorite_element";
	result.addEventListener("click", () => {push_update(value, link, display_info, display_error)});
	result.appendChild(document.createTextNode(value));
	return result;
}














// Handle the keypress event on a search
function presearch(event, query) {
	if(event.keyCode == 13) {
		event.preventDefault();
		search(query);
	}
	else {
		// TODO get any pre-emptive search results in a drop box
	}
}

// Perform a search query with the given string
function search(query) {
	if(xhr) return;
	// Show the results container panel and hide all others
	for(let panel of document.getElementsByClassName("panel")) {
		if(panel.id == "search_results_container") {
			panel.style.display = "block";
		}
		else panel.style.display = "none";
	}

	// Make a search request to the api
	xhr = new XMLHttpRequest();
	xhr.open("GET", resources.api_user + "/?search=" + query, true);
	xhr.onload = function() {
		if(xhr.status == 200) {
			var results = JSON.parse(xhr.response);
			var result_area = document.getElementById("search_results");
			document.getElementById("search_header").innerHTML = "Search results matching " + query;
			result_area.innerHTML = "";
			for(const key in results) {
				result_area.innerHTML +=
				"<div class='search_result'>" +
					"<span class='search_result_key'>" + key + "</span>" +
					"<span class='search_result_attribute'>" + results[key] + "</span>" +
				"</div>";
			}
		}
		else {
			console.error(xhr.response);
		}
	}
	xhr.send();
}
