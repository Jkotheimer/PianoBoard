<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];

// Get the database connection and the secret pepper
require "$ROOT/resources/php/database.phpsecret";
require "$ROOT/resources/php/pepper.phpsecret";
require "$ROOT/resources/php/resources.php";

// Check for cookie tokens, authenticate it, and retrieve the account info if authorized
function auth_token() {
	echo $_GLOBALS['session_cookie'];
	if(isset($_COOKIE[$session_cookie]) && isset($_COOKIE[$ID_cookie])) {
		
		// Attempt to grab the expiration date of the token from the set cookies
		$Token = $_COOKIE[$session_cookie];
		$AccountID = $_COOKIE[$ID_cookie];
		$query = "SELECT Expiration_date from Access_token WHERE Token='$Token' AND AccountID='$AccountID';";
		
		$Expiration_date = new DateTime($database->query($query)->fetch_row()[0]);
		$Expiration_date = $Expiration_date->getTimeStamp();

		mysqli_close($database); 
	
		// If the query returns an actual value, load the dashboard
		if($Expiration_date && time() < $Expiration_date) {
			$GLOBALS['account'] = gen_account($AccountID);
			return true;
		} 
	}
	return false;
}	
?>
