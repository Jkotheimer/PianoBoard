/* CREATE FUNCTIONS */
async function create_project(form) {
	if(form) {
		const values = get_inputs(form);
		var errors = {};
		for(key in values) {
			// If the value type was a boolean, there's no way that can be fucked up so ignore it
			if(typeof values[key] == 'boolean') continue;

			// Pre-emptively create the notification id string in case if an error is caught
			var notif = `project_${key}_notification`;

			// If the input is from the time signature, change the notification since there are 2 different time signature values 
			if(key.includes('time_signature')) {
				notif = `project_time_signature_notification`;
				// If any of the time signature values are outside the range 2-16, throw an error
				if(values[key] > 16 || values[key] < 2) errors[notif] = 'Project time signature is invalid';
				continue;
			} else if(!values[key]) errors[notif] = 'You must provide a value here';
			// If any string inputs are outside the range 2-32, throw an error or if it's a number and it's larger than 255, throw an error
			if(typeof values[key] == 'string' && values[key].length > 32 || values[key].length < 2)
				errors[notif] = `Project ${key} has too ${values[key].length < 2 ? 'few' : 'many'} characters`;
			else if(values[key] > 255 || values[key] < 0) errors[notif] = `${key} is too ${values[key] < 0 ? 'small' : 'large'}`;
		}

		// If errors were caught, display them and return
		if(Object.keys(errors).length > 0) {
			for(err in errors) {
				console.log(err);
				display_error(document.getElementById(err), errors[err]);
			}
			return;
		}
		api_call('POST', `/users/${user.username}/projects`, values, (xhr) => console.log(xhr));
	}
	else append_html('blur.php/?file=project_init.html');
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

/* DELETE FUNCTIONS */
function delete_favorite(attribute, value, callback) {
	var data = {};
	data[attribute] = value;
	api_call('DELETE', `/users/${user.username}/`, data, callback);
}


/* CALLBACKS*/
function delete_callback(xhr) {
	const message = JSON.parse(xhr.response);
	if(xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
		for(notification in message) {
			if(notification.includes('notification')) display_success(document.getElementById(notification), message[notification]);
			else {
				var element = document.getElementById(message[notification]);	
				console.log(message[notification]);
				console.log(element);
				var parent = element.parentNode;
				parent.removeChild(element);
				parent.dataset.length--;
				console.log(typeof parent.dataset.length);
				if(parent.dataset.length == 0) parent.innerHTML = `<span class='message white'>
							You haven't added any of your favorite ${notification.split('_', 2)[1]} yet
							</span>`;
				user[notification].splice(user[notification].indexOf(message[notification]), 1);
			}
		}
	} else {
		console.log(xhr);
	}
}
function update_callback(xhr) {
	const message = JSON.parse(xhr.response);
	if(xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
		// The request was successful
		for(notification in message) {
			if(notification.includes('notification')) display_success(document.getElementById(notification), message[notification]);
			else {
				var container = notification
				var element = document.getElementById(container);
				if(container.includes('favorite')) {
					element.value = '';
					element.focus()
				}
				else element.blur();
				if(notification.includes('favorite')) element = document.getElementById(notification.split('_', 2)[1] + '_container');

				if(element.tagName == 'INPUT') element.value = message[notification];
				else {
					var new_element = document.createElement('SPAN');
					new_element.className = 'favorite_element';
					new_element.id = message[notification];
					new_element.onclick = () => input_event(event, new_element, delete_favorite);
					new_element.innerText = message[notification];
					if(element.dataset.length == 0) element.innerHTML = '';
					element.appendChild(new_element);
				}
				user[notification].push(message[notification]);
				element.dataset.length++;
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
function get(path) {
	var response = null;
	const xhr = new XMLHttpRequest();
	xhr.open('GET', `${resources.host}/${path}`, true);
	var promise = new Promise((resolve, reject) => {
		xhr.onload = () => resolve(xhr.response);
	});
	xhr.send();
	return promise;
}
async function append_html(file) {
	var element = document.createElement('div');
	element.innerHTML = await get(`/resources/html/${file}`);
	document.body.appendChild(element);
	return element;
}

