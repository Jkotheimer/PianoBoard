function input_event(event, element, submit) {
	if(event.keyCode == 13) submit(element.id, element.value);

}


// Update the provided attribute with the given value
function update_user(attribute, value) {
	const valid = check_complete_input(attribute, value);
	if(!valid) {
		display_error(attribute, 'Invalid entry');
		return;
	}
	var data = {};
	data[attribute] = value;
	api_call('PUT', `/users/${user.Username}/`, data, update_callback);
}

function update_callback(xhr) {
	if(xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
		// The request was successful
		const message = JSON.parse(xhr.response).message;
		console.log(message);
	} else {
		// There was an error - handle it here
		const message = JSON.parse(xhr.response).message;
		console.log(message);
	}
}

function api_call(method, path, data, callback) {
	const xhr = new XMLHttpRequest();
	xhr.open(method, `${resources.api}/${path}`, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onload = () => callback(xhr);
	xhr.send(JSON.stringify(data));
}
