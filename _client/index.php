<?
ob_start();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		<title>Pianoboard - <!--TITLE--></title>
		<style>
			<?
			echo fread(fopen("./resources/css/variables.css", 'r'), filesize("./resources/css/variables.css"));
			echo fread(fopen("./resources/css/logo.css", 'r'), filesize("./resources/css/logo.css"));
			echo fread(fopen("./resources/css/form_styles.css", 'r'), filesize("./resources/css/form_styles.css"));
			?>
		</style>
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
