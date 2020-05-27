<?php
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
			$ROOT = $_SERVER['DOCUMENT_ROOT'];
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
			<h>Create An Account</h>
	
			<form class="form_area" method="POST" action="/api/auth/register">
				<input type="hidden" id="platform" name="platform" value="web"/>
				<div class="form_section">
					<div class="form_label">Email</div>
					<input type="text" id="email" name="email" class="form_input" placeholder="your.email@something.com"
						autocapitalize="off" spellcheck="false" autocorrect="off" required
						<?php
						# If an email address was passed in the parameters, set it as the value of this input
						if(isset($_GET['email'])) echo 'value="' . $_GET['email'] . '"';
						?>
					/>

					<?php
					# If an email notification was sent in the parameters, display it here
					if(isset($_GET['email_notification'])) {
						echo '<div id="email_notification" class="notification error">' . 
							$_GET['email_notification'] . '</div>';
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
					if(isset($_GET['password_notification'])) {
						echo '<div id="password_notification" class="notification error">' . 
							$_GET['password_notification'] . '</div>';
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
					if(isset($_GET['confirm_password_notification'])) {
						echo '<div id="confirm_password_notification" class="notification error">' . 
							$_GET['confirm_password_notification'] . '</div>';
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
