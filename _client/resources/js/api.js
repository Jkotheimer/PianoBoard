function input_event(event, element, submit) {
	if(event.type == 'keypress') {
		if(event.keyCode == 13) {
			confirm(element, () => submit(element.id, element.value, update_callback, true));
		}
	}
}
function toggle(element, submit) {
	// This value is going to be an integer - the boolean conversion is necessary, trust me
	var value = element.dataset.value == 'true' ? false:true;

	confirm(element, () => submit(element.id, value, toggle_callback, false))
}

/* CREATE FUNCTIONS */
async function create_project(form) {
	if(form) api_call('POST', `/users/${user.Username}/projects`, form, () => window.location = '/studio/');
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


/* CALLBACKS*/
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

async function confirm(element, callback) {
	// This variable is null, but we need an assignment for the async to properly wait before trying to access the elements
	deselect_all();
	var submitter = function(event) {
		if(event.keyCode == 13) {
			event.preventDefault();
			document.body.removeChild(parent);
			callback();
			document.removeEventListener('keypress', submitter);
		}
	}
	var parent = await append_html('blur.php');
	parent.addEventListener('DOMNodeRemoved', (event) => {
		if(event.target.id == 'blur') {
			element.value = user[element.id];
			document.removeEventListener('keypress', submitter);
		}
	});
	var label = document.createElement('H');
	var action = element.id;
	switch(element.id) {
		case 'username':
		case 'email':
			action = `update your ${element.id}`;
			break;
		case 'is_private':
			var swap = element.dataset.value == 'true' ? 'public':'private';
			action = `make your account ${swap}`;
			break;
		case 'favorite_genres':
		case 'favorite_artists':
			action = `add a new favorite ${element.id.split('_', 2)[1]}`;
			break;
	}
	label.innerText = `Are you sure you want to ${action}?`;
	label.classList.add('panel_header');
	var confirm = document.createElement('BUTTON');
	confirm.innerText = 'Yes';
	confirm.onclick = () => {
		document.body.removeChild(parent);
		callback();
		document.removeEventListener('keypress', submitter);
	}
	document.addEventListener('keypress', submitter);
	confirm.classList.add('button', 'right', 'confirm');
	var deny = document.createElement('BUTTON');
	deny.innerText = 'No';
	deny.onclick = () => {
		document.body.removeChild(parent);
		element.value = user[element.id];
		document.removeEventListener('keypress', submitter);
	}
	deny.classList.add('button', 'left', 'dull');
	var panel = document.getElementById('foreground_panel');
	panel.appendChild(label);
	panel.appendChild(deny);
	panel.appendChild(confirm);
}

