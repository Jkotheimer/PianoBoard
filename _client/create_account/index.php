<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];

// If a post request was made, call the registration API and redirect if successful
if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email']) 
	&& isset($_POST['password']) && isset($_POST['confirm_password'])) {
	require_once "$ROOT/resources/php/resources.php";
	$body = array('email' => $_POST['email'], 'password' => $_POST['password'], 
		'confirm_password' => $_POST['confirm_password']);
	$response = xhr('POST', "$API/auth/register", $body);

	if($response['status'] == 201) {
		setcookie($session_cookie, $response['cookies'][$session_cookie], $expiration_date, '/', $domain);
		setcookie($id_cookie, $response['cookies'][$id_cookie], $expiration_date, '/', $domain);
		header("Location: $host");
		exit;
	}
	http_response_code($response['status']);
	$notifications = $response['body']->message;
}

ob_start();
?>
<!DOCTYPE html>
<html>
	<?php
	$ROOT = $_SERVER['DOCUMENT_ROOT'];
	require "$ROOT/resources/php/head.php";
	?>
	<body>
		<style>
			<?php
			echo fread(fopen($ROOT . "/resources/css/form_styles.css", 'r'),
				filesize($ROOT . "/resources/css/form_styles.css"));
			echo fread(fopen($ROOT . "/create_account/create_account.css", "r"),
				filesize($ROOT . "/create_account/create_account.css"));
			?>
		</style>
		
		<a class="logo_box" href="/">
			<img src="/images/logo.png" class="logo"/>
		</a>
		<div class="panel form_panel">
			<h class="form_header">Create An Account</h>
	
			<form class="form_area" method="POST" action="">
				<div class="form_section">
					<div class="form_label">Email</div>
					<input type="text" id="email" name="email" class="form_input" placeholder="your.email@something.com"
						autocapitalize="off" spellcheck="false" autocorrect="off" required
						<?php
						# If an email address was passed in the parameters, set it as the value of this input
						if(isset($_POST['email'])) 
							echo 'value="' . $_POST['email'] . '"';
						?>
					/>

					<?php
					# If an email notification was sent in the parameters, display it here
					if(isset($notifications->email_notification)) {
						echo '<div id="email_notification" class="notification error">' . 
							$notifications->email_notification . '</div>';
					}
					?>
				</div>
				<div class="form_section">
					<div class="form_label">Password</div>
					
					<input type="password" id="password" name="password" 
						class="form_input" placeholder="Choose a password" 
						autocomplete="new-password" required/>

					<?php
					# If a password notification was sent in the parameters, display it here
					if(isset($notifications->password_notification)) {
						echo '<div id="password_notification" class="notification error">' . 
							$notifications->password_notification . '</div>';
					}
					?>
				</div>
				<div class="form_section">
					<div class="form_label">Confirm Password</div>
					
					<input type="password" id="confirm_password" name="confirm_password" 
						class="form_input" placeholder="Confirm Password" 
						autocomplete="new-password" required/>

					<?php
					# If a password confirmation notification was sent in the parameters, display it here
					if(isset($notifications->confirm_password_notification)) {
						echo '<div id="confirm_password_notification" class="notification error">' . 
							$notifications->confirm_password_notification . '</div>';
					}
					?>
				</div>
				<input type="submit" id="submit" name="submit" value="Create Account"/>
			</form>
		</div>
	</body>
</html>	
<?php
$page_contents = ob_get_contents();
ob_end_clean();

echo str_replace('<!--TITLE-->', 'Create Account', $page_contents);
?>
