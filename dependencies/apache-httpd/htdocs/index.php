<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		<title>Pianoboard</title>
		<link rel="stylesheet" href="/resources/css/variables.css"/>
		<link rel="stylesheet" href="/resources/css/logo.css"/>
		<link rel="stylesheet" href="/resources/css/form_styles.css"/>
		<link rel="stylesheet" href="/landing_page.css"/>
	</head>
	<body>
		<?php
		if(isset($_POST['submit'])) {
			//code for the php form
		}else {
			$myfile = fopen("./resources/html/login.html", "r") or die("Unable to open file!");
			echo fread($myfile,filesize("./resources/html/login.html"));
			fclose($myfile);
		}
		?>

		<div class="info">
			Developed and maintained by Jack Kotheimer
			<br/>
			To learn more about me, visit my <a href="http://67.162.86.57">personal website</a>
		</div>
	</body>
</html>
