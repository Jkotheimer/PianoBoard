<?php
// THIS SCRIPT CREATES THE VARIABLE $logged_in WHICH IS A BOOLEAN DETERMINING IF THE CURRENT USER IS AUTHENTICATED
// IF THE CURRENT USER IS LOGGED IN, A SECOND VARIABLE, $user IS SET AS AN OBJECT REPRESENTING THE USER'S GENERAL INFO

// Check for cookie tokens, authenticate it, and retrieve the account info if authorized
function auth_token() {
	// Get the database connection and the resources
	require_once "database.phpsecret";
	include_once "resources.php";

	if(isset($_COOKIE[$session_cookie]) && isset($_COOKIE[$id_cookie])) {
		
		// Attempt to grab the expiration date of the token from the set cookies
		$Token = $_COOKIE[$session_cookie];
		$AccountID = $_COOKIE[$id_cookie];
		$query = "SELECT Expiration_date from Access_token WHERE Token='$Token' AND AccountID='$AccountID';";
		
		$Expiration_date = new DateTime($database->query($query)->fetch_row()[0]);
		$Expiration_date = $Expiration_date->getTimeStamp();

		mysqli_close($database); 
	
		// If the query returns an actual value, load the dashboard
		if($Expiration_date && time() < $Expiration_date) {
			return get_account($AccountID);
		} 
	}
	return null;
}

function login($login, $password) {
	include_once "resources.php";
	
	$body = array('login' => $login, 'password' => $password);
	$response = xhr('POST', "$API/auth/login", $body);

	http_response_code($response['status']);
	if($response['status'] == 200) {
		setcookie($session_cookie, $response['cookies'][$session_cookie], $expiration_date, '/', $domain);
		setcookie($id_cookie, $response['cookies'][$id_cookie], $expiration_date, '/', $domain);
		return get_account($response['cookies'][$id_cookie]);
	}
	else if($response['status'] == 404) $_GLOBALS['login_notification'] = $result['body']->message;
	else if($response['status'] == 403) $_GLOBALS['password_notification'] = $result['body']->message;
	return null;
}

$current_user = null;
if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login']) && isset($_POST['password'])) {
	// Attempt to login
	$current_user = login($_POST['login'], $_POST['password']);
}
if(!isset($current_user)) $current_user = auth_token();
?>
