<?
$ROOT = $_SERVER['DOCUMENT_ROOT'];

// Get the database connection and the secret pepper
require "$ROOT/resources/php/database.phpsecret";
require "$ROOT/resources/php/pepper.phpsecret";
require "$ROOT/resources/php/resources.php";

$page = "login";
$error = NULL;
$account = NULL;
if(isset($_COOKIE[$session_cookie]) && isset($_COOKIE[$ID_cookie])) {
	$Token = $_COOKIE[$session_cookie];
	$AccountID = $_COOKIE[$ID_cookie];
	$query = "SELECT Expiration_date from Access_token WHERE Token='$Token' AND AccountID='$AccountID';";
	$Expiration_date = new DateTime($database->query($query)->fetch_row()[0]);
	$Expiration_date = $Expiration_date->getTimeStamp();
	if($Expiration_date && time() < $Expiration_date) {
		// Token exists and is valid - load the account into the dashboard
		$page = "dashboard";
		$GLOBALS['account'] = gen_account($AccountID);
	} else {
		// Token does not exist for given account or token is expired
	}
}
// If the request was a POST, verify the email and password
else if(isset($_POST['submit']) && isset($_POST['email']) && isset($_POST['password'])) {

	$email = $_POST['email'];
	$password = $_POST['password'];
	$query = "SELECT AccountID, Password FROM Account WHERE Email='$email';";
	$result = $database->query($query)->fetch_row();
	$AccountID = $result[0];
	$db_pass = $result[1];
	if($db_pass) {
		if(password_verify($password . $pepper, $db_pass)) {
			// Successfully logged in - refresh token and load the dashboard

			// Delete any tokens that may exist for this user
			$query = "DELETE FROM Access_token WHERE AccountID='$AccountID'";
			$database->query($query);

			// Generate a new token and set the expiration date for a month from now
			$Token = bin2hex(random_bytes(32));
			$Expiration_date = time() + (86400 * 30);

			// Push the token to the database and set it as a cookie
			$query = "INSERT INTO Access_token (Token, AccountID, Expiration_date)
					VALUES ('$Token', '$AccountID', '$Expiration_date');";
			$database->query($query);
			setcookie($session_cookie, $Token, $Expiration_date, "/");
			setcookie($ID_cookie, $AccountID, $Expiration_date, "/");

			$page = "dashboard";
			$GLOBALS['account'] = gen_account($AccountID);
		} else {
			$error = ["password_notification", "Incorrect password"];			
		}
	} else {
		$error = ["email_notification", "Account with email $email does not exist"];
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

		<? require "$ROOT/resources/php/$page.php";?>

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
echo str_replace('<!--TITLE-->', $page, $page_contents);
?>
