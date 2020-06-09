<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];
if(isset($_GET['file'])) $file = $_GET['file'];
?>
<style>
	.blur {
		position: fixed;
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
		display: inline-block;
		z-index: 1;
		margin: auto;
		background-filter: none;
		backdrop-filter: none;
		filter: none;
		top: calc(25vh / 4);
	}
</style>
<div class="blur" id='blur' onclick="this.parentNode.removeChild(this)">
	<div class="foreground" onclick="event.stopPropagation()">
		<?php
			if(isset($file)) echo fread(fopen("./$file", "r"), filesize("./$file"));
			else echo fread(fopen("./blank.html", "r"), filesize("./blank.html"));
		?>
	</div>
</div>
