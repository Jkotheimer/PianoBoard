﻿<?
ob_start();
$servername = "localhost:3306";
$username = "root";
$password = "Dnt\$g2wndurwch";

// Create connection
$db = new mysqli($servername, $username, $password);
unset($servername, $username, $password);

// Check connection
if ($db->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		<title>Pianoboard - <!--TITLE--></title>
		<link rel="stylesheet" href="/resources/css/variables.css"/>
		<link rel="stylesheet" href="/resources/css/logo.css"/>
		<link rel="stylesheet" href="/resources/css/form_styles.css"/>
		<link rel="stylesheet" href="/landing_page.css"/>
	</head>
	<body>
		<?
		$page = "login";
		echo implode(" : ", $_POST);
		if(isset($_POST['email']) && isset($_POST['password'])) {
			
			$page = "dashboard";
		}
		$path = "./resources/html/" . $page . ".html";
		$template = fopen($path, "r") or die("Unable to open file!");
		echo fread($template,filesize($path));
		fclose($template);
		?>

		<div class="info">
			Developed and maintained by Jack Kotheimer
			<br/>
			To learn more about me, visit my <a href="http://67.162.86.57">personal website</a>
		</div>
	</body>
</html>
<?
$page_contents = ob_get_contents();
ob_end_clean();

echo str_replace('<!--TITLE-->', $page, $page_contents);
?>
