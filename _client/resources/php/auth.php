<?php

// Check for cookie tokens, authenticate it, and retrieve the account info if authorized
function auth_token() {
	$ROOT = $_SERVER['DOCUMENT_ROOT'];

	// Get the database connection and the resources
	require_once "$ROOT/resources/php/database.phpsecret";
	require_once "$ROOT/resources/php/resources.php";
	
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
			$GLOBALS['uid'] = $AccountID;
			return true;
		} 
	}
	return false;
}

function login($login, $password) {
	$ROOT = $_SERVER['DOCUMENT_ROOT'];
	
	// Get the database connection and the resources
	require_once "$ROOT/resources/php/database.phpsecret";
	require_once "$ROOT/resources/php/resources.php";
	
	$body = array('login' => $login, 'password' => $password);
	$response = xhr('POST', "$API/auth/login", $body);

	http_response_code($response['status']);
	if($response['status'] == 200) {
		setcookie($session_cookie, $response['cookies'][$session_cookie], $expiration_date, '/', $domain);
		setcookie($id_cookie, $response['cookies'][$id_cookie], $expiration_date, '/', $domain);
		$GLOBALS['uid'] = $response['cookies'][$id_cookie];
	}
	return $response;
}
?>
