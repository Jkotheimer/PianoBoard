const NULL = document.getElementById("NULL");

// Add the event listeners to user inputs to send API requests to gather data to place in a search result area

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

