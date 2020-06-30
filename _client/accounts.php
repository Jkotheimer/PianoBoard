<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];

if($_GET['recording'] != NULL) {
	require "$ROOT/resources/php/recording.php";
} else if($_GET['track'] != NULL) {
	require "$ROOT/resources/php/track.php";
} else if($_GET['project'] != NULL) {
	require "$ROOT/resources/php/project.php";
} else if($_GET['account'] != NULL) {
	require "$ROOT/resources/php/user.php";
} else {
	exit(header("Location: http://" . $_SERVER['SERVER_NAME'], true, 301));
}
?>
