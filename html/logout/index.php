<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];
require_once "$ROOT/resources/php/resources.php";
	
// Call the API for logout to weed out any database details regarding the request
$response = xhr('GET', "$API/auth/logout");
if($response['status'] == 200) {
	setcookie($session_cookie, '', time()-3600);
	setcookie($id_cookie, '', time()-3600);
	header("Location: $host");
	exit;
}
?>
