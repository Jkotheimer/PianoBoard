<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];
$login = null;
if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])) {
	$login = $_POST['login'];
	echo 'Resetting password';
	exit();
}
ob_start();
?>
<!DOCTYPE html>
<html>
	<? require "$ROOT/resources/php/head.php"; ?>
	<body>
		<style>
			<?php
			echo fread(fopen("$ROOT/resources/css/form_styles.css", 'r'),
				filesize("$ROOT/resources/css/form_styles.css"));
			echo fread(fopen("$ROOT/resources/css/reset_password.css", "r"),
				filesize("$ROOT/resources/css/reset_password.css"));
			?>
		</style>
		<a class="logo_box" href="/">
			<img src="/images/logo.png" class="logo"/>
		</a>
		<div class="panel">
			<h class="panel_header">Reset Password</h>
			<form action="/reset_password" method="GET">
				<div class="form_label">Enter your E-mail address</div>
				<input type="text" name="email" class="form_input" placeholder="your.email@something.com" required/>
				<div id="email_notification"></div>
				<input type="submit" class="submit" value="Send Reset Link"/>
			</form>
		</div>
		<div id="complete">Password reset link has been sent!<br><div id="timer"></div></div>
		
		<script type="text/javascript">
			for(let e of document.getElementsByTagName("input")) {
				e.addEventListener("keyup", function() {
					if(e.value.length > 1) e.classList.add("complete_form_input");
					else e.classList.remove("complete_form_input");
				});
			}
		</script>
	</body>
</html>
<?php
$page_contents = ob_get_contents();
ob_end_clean();

echo str_replace('<!--TITLE--', 'reset password', $page_contents);
?>
