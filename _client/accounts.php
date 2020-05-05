<?
$ROOT = $_SERVER['DOCUMENT_ROOT'];
require "$ROOT/resources/php/resources.php";

if($_GET['recording'] != NULL) {
	recording();
} else if($_GET['track'] != NULL) {
	track();
} else if($_GET['project'] != NULL) {
	project();
} else if($_GET['account'] != NULL) {
	account();
} else {
	exit(header("Location: http://" . $_SERVER['SERVER_NAME'], true, 301));
}

function account() {
	$account = $_GET['account'];
	$account = gen_account_vague($account);
	if(isset($account)) {
		print_r($account);
	} else {
		echo "404 not found";
	}
}

function project() {

}

function track() {

}

function recording() {

}
?>
