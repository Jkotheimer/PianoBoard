<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];
require_once "auth.php";

if(!isset($current_user)) {
	echo "You are not logged in";
}

include_once "resources.php";
$req_login = $_GET['account'];
$req_user = get_account_vague($req_login);
if(!isset($req_user)) {
	$error = "User $req_login does not exist";
	require "$ROOT/error/404.php";
}
?>
