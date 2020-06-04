<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];
$file = $_GET['file'];
if(!isset($file)) {
	http_response_code(400);
	exit();
}
?>
<style>
	.blur {
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		text-align: center;
		background-color: rgba(130, 130, 130, .5);
		background-filter: blur(6px);
		backdrop-filter: blur(6px);
	}
	.foreground {
		position: relative;
		z-index: 1;
		margin: auto;
		background-filter: none;
		backdrop-filter: none;
		filter: none;
		top: calc(50vh / 2);
	}
</style>
<div class="blur" onclick="this.parentNode.removeChild(this)">
	<div class="foreground" onclick="event.stopPropagation()">
		<?php
			echo fread(fopen("./$file", "r"), filesize("./$file"));
		?>
	</div>
</div>
