<?
$ROOT = $_SERVER['DOCUMENT_ROOT'];
require "$ROOT/resources/php/auth.php";
$page = 'login';
if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login']) && isset($_POST['password'])) {
	// Attempt to login
	$result = login($_POST['login'], $_POST['password']);
	if($result['status'] == 200) $page = 'dashboard';
	else if($result['status'] == 404) $_GLOBALS['login_notification'] = $result['body']->message;
	else if($result['status'] == 403) $_GLOBALS['password_notification'] = $result['body']->message;
}
else if(auth_token()) $page = 'dashboard';

ob_start();
?>
<!DOCTYPE html>
<html>
	<? require "$ROOT/resources/php/head.php"; ?>
	<body>

		<?php
		require "$ROOT/resources/php/$page.php";
		?>

		<div class="info">
			Developed and maintained by Jack Kotheimer
			<br/>
			To learn more about me, visit my <a href="https://jackkotheimer.com">personal website</a>
		</div>
	</body>
</html>
<?
$page_contents = ob_get_contents();
ob_end_clean();

echo str_replace('<!--TITLE-->', $page, $page_contents);
?>
