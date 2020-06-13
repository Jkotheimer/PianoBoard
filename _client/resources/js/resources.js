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
		else values[node.name] = node.value;
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

	if (element && /INPUT|TEXTAREA/i.test(element.tagName)) {
		if ('selectionStart' in element) {
			element.selectionEnd = element.selectionStart;
		}
		element.blur();
	}

	if (window.getSelection) { // All browsers, except IE <=8
		window.getSelection().removeAllRanges();
	} else if (document.selection) { // IE <=8
		document.selection.empty();
	}
}

function remove_all_eventListeners(parent) {
	for(let element of parent.childNodes) {
		if(element.childNodes.length > 0) remove_all_eventListeners(element);
		removeEventListener(element);
	}
}

// element: an HTML element
// listener: click, keypress, etc...
function removeEventListener(element, listener) {
	if(listener) {
		var listener_name = "on" + listener;
		element.removeEventListener(listener, element[listener_name]);
		element[listener_name] = null;
	} else {
		var clone = element.cloneNode(true);
		element.parentNode.replaceChild(clone, element);
	}
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

function separate_words(word) {
	var result = "";
	for(let i = 0; i < word.length; i++) {
		var c = word.charAt(i);
		if(c == c.toUpperCase()) result += ' ' + c.toLowerCase();
		else result += c;
	}
	return result;
}

// The timeout is required for some reason to make the focus work properly
function focus_on(element) {
	setTimeout(function() { element.focus() }, 1);
}

async function append_html(element, url) {
	var html = await get(url);
	var parser = new DOMParser();
	element.appendChild(parser.parseFromString(html, "text/html").body);
}
