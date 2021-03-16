<head>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1"/>
	<title>Pianoboard - <!--TITLE--></title>
	<style>
	<?php
	$ROOT = $_SERVER['DOCUMENT_ROOT'];
	echo fread(fopen($ROOT . "/resources/css/variables.css", 'r'), 
		filesize($ROOT . "/resources/css/variables.css"));
	echo fread(fopen($ROOT . "/resources/css/logo.css", 'r'), 
		filesize($ROOT . "/resources/css/logo.css"));
	?>
	</style>
	<?php

	require_once "$ROOT/resources/php/auth.php";
	if(isset($current_user)) {
		echo "<script type='text/javascript'>";
		echo "var user = " . json_encode((array)$current_user) . ";</script>";
	}
	?>
</head>
