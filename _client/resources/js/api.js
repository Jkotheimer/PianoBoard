/* CREATE FUNCTIONS */
async function create_project(form) {
	if(form) {
		let values = check_validity(form, 'project');
		if(values) {
			api_call('POST', `/users/${user.username}/projects`, values, (xhr) => console.log(xhr));
		} 
	}
	else {
		append_html('blur.php/?file=project_init.html');
		await get_script('extra', 'load_project_init');
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
				var parent = element.parentNode;
				parent.removeChild(element);
				parent.dataset.length--;
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
				
				// If the notification is from a favorite, it must be handled differently
				if(notification.includes('favorite')) {
					// First, clear the input field but keep it focused 
					element.value = '';
					focus_on(element);

					// Now change the element to the container to add the new addition to it
					element = document.getElementById(notification.split('_', 2)[1] + '_container');

					// Begin creating the new element
					var new_element = document.createElement('SPAN');
					new_element.className = 'favorite_element';
					new_element.id = message[notification];
					new_element.onclick = () => input_event(event, new_element, delete_favorite);
					new_element.innerText = message[notification];
					
					// If there was nothing in the container, remove the message
					if(element.dataset.length == 0) element.innerHTML = '';

					// Append the element to the UI, change it in the user object, and increment the counter
					element.appendChild(new_element);
					user[notification].push(message[notification]);
					element.dataset.length++;
				} else {
					// If the change came from any other attribute, just blur the input field and set the new values
					element.blur();
					element.value = message[notification];
					user[notification] = message[notification];
				}
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

// Make an api call and execute a callback with the response when it's complete
function api_call(method, path, data, callback) {
	const xhr = new XMLHttpRequest();
	xhr.open(method, `${resources.api}${path}`, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onload = () => callback(xhr);
	xhr.send(JSON.stringify(data));
}

// Get the resource at the given path and return it asynchronously
function get(path) {
	var response = null;
	const xhr = new XMLHttpRequest();
	xhr.open('GET', `${resources.host}${path}`, true);
	var promise = new Promise((resolve, reject) => {
		xhr.onload = () => resolve(xhr.response);
	});
	xhr.send();
	return promise;
}

// Get the html file and append it to the document
async function append_html(file) {
	deselect_all();
	var element = document.createElement('DIV');
	element.innerHTML = await get(`/resources/html/${file}`);
	document.body.appendChild(element);
	return element;
}

// If there are any scripts you want to grab on the fly, get it here and call the function you need
// when it's finished loading
function get_script(file, callback) {
	var script = document.createElement('script');
	script.setAttribute('src', `${resources.host}/resources/js/${file}.js`);
	script.onload = () => eval(callback)();
	document.body.appendChild(script);
}
