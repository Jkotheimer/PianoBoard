/**
 * API SPECIFIC RESOURCES
 */

var xhr = undefined;
const resources = {
	"account"	: "pianoboard_account",
	"token"		: "pianoboard_token",
	"uid"		: "pianoboard_uid",
	"api_root"	: "http://localhost/api",
	"api_user"	: "http://localhost/api/users",
	"api_auth"	: "http://localhost/api/authentication",
	"templates"	: "http://localhost/resources/html"
}

/**
 * ERROR HANDLING
 * ____________________________________________________________________________
 */
var fade;
function display_error(field_name, message) {
	const err_element = document.getElementById(field_name + "_notification");
	const input_element = document.getElementById(field_name);
	clearInterval(fade);
	err_element.style.opacity = 1;
	err_element.className = "notification";
	err_element.classList.add("error");
	err_element.innerHTML = message;
	var wait = function() {
		remove_notification(field_name);
		input_element.removeEventListener("keydown", wait);
	};
	input_element.addEventListener("keydown", wait);
	focus_on(input_element);
}

function display_notification(type, field_name, message) {
	clearInterval(fade);
	const element = document.getElementById(field_name + "_notification");
	element.style.opacity = 1;
	element.className = "notification";
	element.classList.add(type);
	element.innerHTML = message;
}

function fade_notification(field_name) {
	var wait = 0;
	fade = setInterval(function() {
		wait++;
		let element = document.getElementById(field_name + "_notification");
		if(wait < 100) wait++;
		else if(element.style.opacity > .03) {
			element.style.opacity -= .03;
		}
		else {
			element.className = "notification";
			element.innerHTML = null;
			element.style.opacity = 1;
			clearInterval(fade);
		}
	}, 50);
}

function remove_notification(field_name) {
	const element = document.getElementById(field_name + "_notification");
	element.innerHTML = null;
	element.className = "notification";

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

function check_complete_input(element, success_function, failure_function) {
	var validator = validators[element.id] || validators["attribute"];
	if(validator(element.value)) {
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

function submit_listener(event, submit_function) {
	if(event.keyCode == 13) {
		event.preventDefault();
		submit_function();
	}
}

function reset_form(prev_form) {
	for(let field_name in prev_form) {
		if(prev_form.hasOwnProperty(field_name))
			document.getElementById(field_name).value = prev_form[field_name];
	}
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
 * API HELPERS
 * ____________________________________________________________________________
 */

function get(url) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.send();
	return new Promise(resolve => {
		var wait = setInterval(() => {
			if(xhr.readyState == 4) {
				var response = xhr;
				xhr = null;
				resolve(response.response);
				clearInterval(wait);
			}
		}, 10);
	})
}

// Return the account object from the server from the cookies that are currently cached
function get_account(success_function, failure_function) {
	if(xhr) return;
	xhr = new XMLHttpRequest();
	var ID = get_cookie(resources.uid);
	xhr.open("GET", resources.api_user + "/" + ID, true);
	xhr.onload = function() {
		var response = xhr;
		xhr = undefined;
		if(response.status == 201) {
			if(success_function.length == 0) success_function();
			else success_function(JSON.parse(response.response));
		}
		else failure_function();
	}
	xhr.send();
}

// Push the provided data to the current account, writing to the specified action
function push_update(data, link, success_function, failure_function) {
	if(xhr) return;
	xhr = new XMLHttpRequest();
	xhr.open(link.method, link.url);
	xhr.onload = function() {
		var response = xhr;
		xhr = undefined;
		if(response.status == 200) {
			if(success_function.length == 0) success_function();
			else success_function(JSON.parse(response.response));
		}
		else {
			if(failure_function.length == 0) failure_function();
			else failure_function(JSON.parse(response.response));
		}
	}
	xhr.send(data);
	return xhr;
}

// Get the link object correlating with the specified action within the given item
function getLink(links, action) {
	var value;
	links.forEach(element => {
		if(element.action == action) value = element;
	});
	if(value == undefined) return undefined;
	else return value;
}

/**
 * OTHER HELPERS
 * ____________________________________________________________________________
 */

// Found this on THE WEB FLASH to deselect all input elements in the document.
// Credit: [https://www.thewebflash.com/select-or-deselect-text-inside-an-element-using-js/]
function deselect_all() {
	console.log("Deselecting all");
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

function contains(object, value) {
	return (typeof object == "string" && object == value  ||
			is_iterable(object) && object.includes(value))
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

async function appendHtml(element, url) {
	var html = await get(url);
	var parser = new DOMParser();
	element.appendChild(parser.parseFromString(html, "text/html").body);
}
