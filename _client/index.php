<?
$ROOT = $_SERVER['DOCUMENT_ROOT'];
ob_start();
// If the request was a POST, verify the email and password
$page = "login";
if(isset($_POST['email']) && isset($_POST['password'])) {
	// Get the database connection and the secret pepper
	require $ROOT . "/resources/php/database.phpsecret";
	require $ROOT . "/resources/php/pepper.phpsecret";

	// TODO use this in the account creation to hash the password and store it in the database
	$email = $_POST['email'];
	$result = mysqli_query($database, "SELECT Password FROM Account WHERE Email='$email';");
	// get number of rows returned 
	if($result && mysqli_num_rows($result)) {
		$row = mysqli_fetch_array($result);
		$db_pass = $row['Password'];
		echo 'Password: ' . $db_pass . '<br>';
		if(password_verify($_POST['password'] . $pepper, $db_pass)) {
			echo "Verified";
			unset($_POST['password'], $db_pass, $row);	
			$page = "dashboard";
			// TODO get a token and set it as a cookie
		} else {
			echo "Invalid Password";
		}
	} else {
		echo "Account with email $email does not exist";
		// NO ACCOUNT WITH THIS EMAIL EXISTS
	}
	mysqli_close($database); 
}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		<title>Pianoboard - <!--TITLE--></title>
		<style>
			<?
			echo fread(fopen($ROOT . "/resources/css/variables.css", 'r'), 
				filesize($ROOT . "/resources/css/variables.css"));
			echo fread(fopen($ROOT . "/resources/css/logo.css", 'r'), 
				filesize($ROOT . "/resources/css/logo.css"));
			echo fread(fopen($ROOT . "/resources/css/form_styles.css", 'r'), 
				filesize($ROOT . "/resources/css/form_styles.css"));
			?>
		</style>
		<link rel="stylesheet" href="/landing_page.css"/>
	</head>
	<body>
		<?
		// Get the body html file and render it here
		$path = $ROOT . "/resources/html/" . $page . ".html";
		$template = fopen($path, "r") or die("Unable to open file!");
		echo fread($template, filesize($path));
		fclose($template);
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
