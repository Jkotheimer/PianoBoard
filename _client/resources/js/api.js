function input_event(event, element, submit) {
	if(event.type == 'keypress') {
		if(event.keyCode == 13) submit(element.id, element.value, update_callback, true);
	}
}
function toggle(element, submit) {
	// This value is going to be an integer - the boolean conversion is necessary, trust me
	var value = element.dataset.value;

	if(value == 'true') value = false;
	else value = true;

	submit(element.id, value, toggle_callback, false);
}

/* CREATE FUNCTIONS */
async function create_project(form) {
	if(form) api_call('POST', `/users/${user.Username}/projects`, form, () => window.location = '/studio/');
	else {
		var project_init = await get_html('/resources/html/blur.php/?file=project_init.html');
		var element = document.createElement('div').innerHTML = project_init;
		document.body.innerHTML += element;
	}
}

/* READ FUNCTIONS */


/* UPDATE FUNCTIONS */

// Update the provided attribute with the given value
function update_user(attribute, value, callback, notify) {
	if(notify) {
		const valid = check_complete_input(attribute, value);
		if(!valid) {
			display_error(attribute, 'Invalid entry');
			return;
		}
	}
	var data = {};
	data[attribute] = value;
	api_call('PUT', `/users/${user.username}/`, data, callback);
}

function update_callback(xhr) {
	const message = JSON.parse(xhr.response);
	if(xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
		// The request was successful
		for(notification in message) {
			if(notification.includes('notification')) display_success(document.getElementById(notification), message[notification]);
			else {
				var element = document.getElementById(notification);
				element.blur();
				if(element.tagName == 'INPUT') element.value = message[notification];
				else element.innerHTML = message[notification];
				user[notification] = message[notification];
			}
		}
	} else {
		// There was an error - handle it here
		for(notification in message) {
			if(notification.includes('notification')) display_error(document.getElementById(notification), message[notification]);
			else {
				var element = document.getElementById(notification);
				element.blur();
			}
		}
	}
}

function toggle_callback(xhr) {
	const message = JSON.parse(xhr.response);

	if(xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
		// The request was successful
		for(notification in message) {
			if(!notification.includes('notification')) {
				var element = document.getElementById(notification);
				element.dataset.value = message[notification];
				var value = '';
				if(message[notification]) value = element.dataset.true;
				else value = element.dataset.false;
				element.innerHTML = value;
				user[notification] = message[notification] ? 1:0;
			}
		}
	}
	else {
		// Something went wrong
	}
}

function api_call(method, path, data, callback) {
	const xhr = new XMLHttpRequest();
	xhr.open(method, `${resources.api}${path}`, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onload = () => callback(xhr);
	xhr.send(JSON.stringify(data));
}

async function get_html(path) {
	var response = null;
	const xhr = new XMLHttpRequest();
	xhr.open('GET', `${resources.host}${path}`, true);
	var promise = new Promise((resolve, reject) => {
		xhr.onload = () => resolve(xhr.response);
	});
	xhr.send();
	response = await promise;
	return response;
}
