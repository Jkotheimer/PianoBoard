<?
$ROOT = $_SERVER['DOCUMENT_ROOT'];
require "$ROOT/resources/php/auth.php";
$page = 'login';
if(isset($user)) $page = 'dashboard';

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
