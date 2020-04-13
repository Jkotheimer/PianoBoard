<?
// Get the document root directory for complete file paths
$ROOT = $_SERVER['DOCUMENT_ROOT'];
ob_start()
// If the request was a post, check if a user with the given email exists
// if not, create an account, create a token, set the cookies and redirect to the landing page
$status = 1;
$error = NULL;

if(isset($_POST['submit']) && $_POST['submit'] == "Create Account") {
	// Get the database connection and the secret pepper
	require $ROOT . "/resources/php/database.phpsecret";
	require $ROOT . "/resources/php/pepper.phpsecret";
	
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
		$status = 0;
	}
}
?>

<!DOCTYPE html>
<html>
	<?
	echo fread(fopen($ROOT . "/resources/php/head.php", "r"),
		filesize($ROOT . "/resources/php/head/php"));
	?>
	<body>
		<a class="logo_box" href="/">
			<img src="/images/logo.png" class="logo"/>
		</a>
		<?
		// Get the create account html file and render it here
		if($status > 0) {
			$path = $ROOT . "/resources/html/create_account.html";
			$template = fopen($path, "r") or die("Unable to open file!");
			$html = fread($template, filesize($path));
			fclose($template);
			if(isset($error)) {
				$html = str_replace("<!--$error[0]-->", 
					'<div id="email_notification" class="notification error">' . $error[1] . '</div>', 
					$html);
				if(isset($email)) {
					$html = str_replace('placeholder="your.email@something.com"',
						'value="' . $email . '"',
						$html);
				}	
			}
			echo $html;
		} else {
			// TODO Create an account
			$hashed_password = password_hash($_POST['password'] . $pepper, PASSWORD_BCRYPT);
			// TODO Push email and hashed password to database along with timestamp
			$query = "INSERT INTO Account (Email, Username, Password, Creation_date, Is_private)
					VALUES ('$email', '$email', '$hashed_password', 122, 0);";
			$result = mysqli_query($database, $query);
			if($result) {
				// Success - redirect to home page
				echo "Account created";
			} else {
				echo "Something went wrong";
				// Error - something went wrong (
			}
			$status = 0;
		}
		?>
	</body>
</html>	
<?
$page_contents = ob_get_contents();
ob_end_clean();

echo str_replace("<!--TITLE-->", "Create Account", $page_contents);
?>
