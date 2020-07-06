/**
 * API SPECIFIC RESOURCES
 */

var xhr = undefined;
const resources = {
	"token"		: "pb_token",
	"uid"		: "pb_uid",
	"api"		: "http://localhost/api",
	"host"		: "http://localhost"
}

/**
 * MESSAGE HANDLING
 * ____________________________________________________________________________
 */

// faders is an object containing the identifiers for all timeouts and intervals 
// that currently exist for messages. faders[id] is an object containing the
// timeout and interval tied to the element with the specified id.
var faders = {};
function fade(element) {
	element.style.opacity = '1';
	let id = element.id ? element.id : element.innerText;

	// If the element has been used before, ensure that the timeout and interval
	// have been supressed. Else, create a new object for it
	if(faders[id]) {
		clearInterval(faders[id].interval);
		clearTimeout(faders[id].timeout);
	} else faders[id] = {};

	// Wait 3 seconds before fading out the notification
	faders[id].timeout = setTimeout(() => {
		// Drop the opacity of the element every 10 ms until it is basically invisible
		faders[id].interval = setInterval(() => {
			let new_opacity = parseFloat(element.style.opacity) - 0.01;
			element.style.opacity = new_opacity.toString();
			// When it's gone, reset the opacity, remove any inner html, reset the
			// class list, and clear the interval
			if(parseFloat(element.style.opacity) < .02) {
				element.style.opacity = '1';
				element.innerHTML = '';
				element.className = element.classList[0];
				clearInterval(faders[id].interval);
			}
		}, 10);
	}, 3000);
}
function display_error(element, message, oldvalue) {
	element.classList.add('error');
	element.innerText = message;
	fade(element);
}
function display_success(element, message, newvalue) {
	element.classList.add('success');
	element.innerText = message;
	fade(element);
}
	

/**
 * FORM VALIDATION HANDLING AND LISTENING
 * ____________________________________________________________________________
 */

function check_all_complete_inputs(parent) {
	for(let element of parent.childNodes) {
		if(element.tagName && element.tagName.toLowerCase() == "input") {
			element.dispatchEvent(new Event("change"));
		}
		else check_all_complete_inputs(element);
	}
}

function check_validity(form, prefix) {
	const inputs = get_inputs(form);
	var errors = {};
	
	// Validity checkers for each data type
	var check_number = (key, num, notification) => {
		if(num > 255 || num < 0) 
			errors[notification] = `${key} is too ${inputs[key] < 0 ? 'small' : 'large'}`;
	}
	
	var check_string = (key, str, notification) => {
		if(str.length > 32 || str.length < 2)
			errors[notification] =  `${prefix} ${key} has too ${str.length < 2 ? 'few' : 'many'} characters`;
	}
	
	var check_array = (key, arr, notification) => {
		let err = {};
		inputs[key].forEach(item => {
			switch(typeof item) {
				case 'string':
					
			}
		});
	}

	// Generic validity checker allocates different datatypes to different functions
	var check_value = (key, value, notification) => {
		// In case if any errors went unnoticed by the individual check, this spans everything else
		if(value == undefined || value == null) {
			errors[notification] = 'You must provide a value here';
			return;
		}
		// If the value type was a boolean, there's no way that can be fucked up so ignore it
		switch(typeof value) {
			case 'object':
				check_array(key, value, notification);
				break;
			case 'string':
				check_string(key, value, notification);
				break;
			case 'number':
				check_number(key, value, notification);
				break;
		}
	}

	// Iterate through each key/value pair in the input dictionary and run them through the above functions
	for(key in inputs) {
		// Pre-emptively create the notification id string in case if an error is caught
		var notif = prefix ? `${prefix}_${key}_notification` : `${key}_notification`;
		check_value(key, inputs[key], notif);
	}

	// If errors were caught, display them and return
	if(Object.keys(errors).length > 0) {
		for(err in errors) display_error(document.getElementById(err), errors[err]);
		return null;
	}
	return inputs;
}

function check_complete_input(element, value, success_function, failure_function) {
	var validator = validators[element] || validators["attribute"];
	if(validator(value)) {
		if(success_function) success_function();
		return true;
	}
	else {
		if(failure_function) failure_function();
		return false;
	}
}

function check_valid_email(email) {
	const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!email_regex.test(email) || email.length < 3) return false;
	else return true;
}
function check_valid_attribute(attribute) {
	return (attribute.length > 1 && attribute.length < 32);
}
function check_valid_password(password) {
	return (password.length > 8);
}
function check_matching_password(confirm_password) {
	return (check_valid_password(confirm_password) && confirm_password == document.getElementById("password").value);
}

const validators = {
	"attribute": check_valid_attribute,
	"email": check_valid_email,
	"password": check_valid_password,
	"confirm_password": check_matching_password
}

function get_inputs(form) {
	var values = {};
	for(node of form.getElementsByTagName('INPUT')) {
		if(!node.name) continue;
		if(node.type == 'checkbox') values[node.name] = node.checked;
		else {
			let val = Number(node.value) > 0 ? Number(node.value) : node.value;
			if(values[node.name]) {
				if(typeof values[node.name] != 'object') {
					values[node.name] = [values[node.name], val];
				} else {
					values[node.name].push(val);
				}
			} else values[node.name] = val;
		}
	}
	return values;
}

/**
 * COOKIE AND URI HELPERS
 * ____________________________________________________________________________
 */

// This function comes from StackOverflow...
function get_cookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return null;
}
function delete_cookie(name) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function get_query_parameter(name) {
	const params = new URLSearchParams(window.location.search);
	if(params.has(name)) return params.get(name);
	else return null;
}

/**
 * OTHER HELPERS
 * ____________________________________________________________________________
 */

// Found this on THE WEB FLASH to deselect all input elements in the document.
// Credit: [https://www.thewebflash.com/select-or-deselect-text-inside-an-element-using-js/]
function deselect_all() {
	var element = document.activeElement;

	if(element) element.blur();
	if(element.selectionStart && element.selectionEnd) element.selectionEnd = element.selectionStart;

	if (window.getSelection) window.getSelection().removeAllRanges();
	else if (document.selection) document.selection.empty();
}

function remove_all_eventListeners(parent) {
	for(let element of parent.childNodes) {
		if(element.childNodes.length > 0) remove_all_eventListeners(element);
		removeEventListener(element);
	}
}

function input_event(event, element, submit) {
	if(event.type == 'keypress' && event.keyCode == 13) {
		if(!element) submit();
		else confirm(element, () => submit(element.id, element.value, update_callback, true));
	} else if(event.type == 'click') {
		var type = element.parentNode.id.includes('genre') ? 'favorite_genres':'favorite_artists';
		confirm(element, () => submit(type, element.innerHTML, delete_callback, false));
	}
}
function toggle(element, submit) {
	// This value is going to be an integer - the boolean conversion is necessary, trust me
	var value = element.dataset.value == 'true' ? false:true;

	confirm(element, () => submit(element.id, value, toggle_callback, false))
}


function create_keyboard_event(type, key, keycode) {
	return new KeyboardEvent(type, {
		bubbles : true,
		cancelable : true,
		char : key,
		key : key,
		keyCode : keycode
	});
}

function is_iterable(object) {
	return typeof object == "symbol" || typeof object == "object";
}

// The timeout is required for some reason to make the focus work properly
function focus_on(element) { setTimeout(() => element.focus(), 50); }

/** 
 * This is a fucked up function and I apologize for it's spaghettification
 * Allow me to try to explain how it works:
 * - If the user has changed something and submitted it, this function creates a pop-up that confirms
 * whether or not the user actually wants to do that.
 *
 * - First, we deselect everything
 *
 * - Next, we declare a submitter function - this gets attached to multiple event listeners and
 * removes itself when the user confirms whether or not they wish to submit their changes
 *
 * - Finally, we get the blank blur page from the serer and append an appropriate header, a 
 * cancel button, and a submit button and wait for the user to do something
 */

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
	
	// Append the blank blur page and get the element in a variable
	var parent = await append_html('blur.php');
	
	// When the user clicks outside of the focus box, the whole blur page deletes itself - this listens for that
	parent.addEventListener('DOMNodeRemoved', (event) => {
		if(event.target.id == 'blur') {
			element.value = user[element.id];
			document.removeEventListener('keypress', submitter);
		}
	});

	// Create a header element - we will append an action statement to it as a prompt for the user
	// example: 'Are you sure you want to update your email?'
	var label = document.createElement('H');
	var action = element.id;

	// This is where it get's fucked up - we need a switch case for each different action prompt
	switch(action) {
		case 'username':
		case 'email':
			action = `update your ${action}`;
			break;
		case 'is_private':
			var swap = element.dataset.value == 'true' ? 'public':'private';
			action = `make your account ${swap}`;
			break;
		case 'favorite_genres':
		case 'favorite_artists':
			action = `add a new favorite ${action.split('_', 2)[1]}`;
			break;
		case 'project_init':
			action = `create a new project`;
			break;
	}
	// And a separate one for class names in class if we adding favorites
	switch(element.className) {
		case 'favorite_element':
			action = `delete ${element.innerHTML} from favorites`;
			break;
	}
	label.innerText = `Are you sure you want to ${action}?`;
	label.classList.add('panel_header');

	// Now that the label is done, we create buttons
	// First is the confirmation button - when clicked, submit the changes
	var confirmation = document.createElement('BUTTON');
	confirmation.innerText = 'Yes';
	confirmation.onclick = () => {
		document.body.removeChild(parent);
		callback();
		document.removeEventListener('keypress', submitter);
	}
	document.addEventListener('keypress', submitter);
	confirmation.classList.add('button', 'right', 'confirm');

	// Next is the deny button - when clicked, remove the prompt and reset the UI attributes
	var deny = document.createElement('BUTTON');
	deny.innerText = 'No';
	deny.onclick = () => {
		document.body.removeChild(parent);
		element.value = user[element.id];
		document.removeEventListener('keypress', submitter);
	}
	deny.classList.add('button', 'left', 'dull');

	// Finally, append all of the elements we created onto the blank panel
	var panel = document.getElementById('foreground_panel');
	panel.appendChild(label);
	panel.appendChild(deny);
	panel.appendChild(confirmation);
}
