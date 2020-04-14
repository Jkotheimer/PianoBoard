<?php
// root directory for complete file paths
$ROOT = $_SERVER['DOCUMENT_ROOT'];

// If the request was a post, check if a user with the given email exists
// if not, create an account, create a token, set the cookies and redirect to the landing page
$error = NULL;
if( isset($_POST['submit']) && isset($_POST['email']) && 
	isset($_POST['password']) && isset($_POST['confirm_password'])) {
	
	// Get the database connection and the secret pepper
	require "$ROOT/resources/php/database.phpsecret";
	require "$ROOT/resources/php/pepper.phpsecret";
	
	$email = $_POST['email'];
	$password = $_POST['password'];
	$confirm_password = $_POST['confirm_password'];

	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		$error = ["email_notification", "Invalid email"];
	} else if(strlen($password) < 8) {
		$error = ["password_notification", "Invalid password"];
	} else if($password != $confirm_password) {
		$error =  ["confirm_password_notification", "Passwords do not match"];
	} else {
		// No error - try to push to the database
		$hashed_password = password_hash($password . $pepper, PASSWORD_BCRYPT);
		require "$ROOT/resources/php/resources.php";
		$username = gen_username($email);
		$query = "INSERT INTO Account (Email, Username, Password, Creation_date, Is_private)
				VALUES ('$email', '$username', '$hashed_password', " . time() . ", 0);";
		if($database->query($query)) {
			// Account successfully created - create a token, set it as a cookie, and redirect 

			// Grab the ID of the account that we just created
			$query = "SELECT AccountID FROM Account WHERE Email='$email' AND Username='$username';";
			$AccountID = $database->query($query)->fetch_row()[0];

			// Generate a random token and set the expiration date for a month from now
			$Token = bin2hex(random_bytes(32));
			$Expiration_date = time() + (86400 * 30);

			// Push the token to the database and set it as a cookie
			$query = "INSERT INTO Access_token (Token, AccountID, Expiration_date)
					VALUES ('$Token', '$AccountID', '$Expiration_date');";
			$database->query($query);
			setcookie($session_cookie, $Token, $Expiration_date, "/");
			setcookie($ID_cookie, $AccountID, $Expiration_date, "/");

			// Redirect back to the root directory to handle the newly set cookie
			exit(header("Location: http://" . $_SERVER['SERVER_NAME'], true, 301));
		} else {
			// Failure - account already exists
			$error = ["email_notification", "An account with this email address already exists"];
			http_response_code(400);
		}
	}
	mysqli_close($database); 
}
ob_start();
?>
<!DOCTYPE html>
<html>
	<?
	require "$ROOT/resources/php/head.php";
	?>
	<body>
		<a class="logo_box" href="/">
			<img src="/images/logo.png" class="logo"/>
		</a>
		<? require "$ROOT/resources/php/create_account.php"; ?>
	</body>
</html>	
<?
$html = ob_get_contents();
ob_end_clean();

if(isset($error)) {
	$html = str_replace("<!--$error[0]-->", 
		'<div id="' . $error[0] . '" class="notification error">' . $error[1] . '</div>', 
		$html);
	if(isset($email)) {
		$html = str_replace('placeholder="your.email@something.com"',
			'value="' . $email . '"',
			$html);
	}	
}
echo str_replace("<!--TITLE-->", "Create Account", $html);
?>
