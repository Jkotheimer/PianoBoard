<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];
require_once "$ROOT/resources/php/auth.php";

ob_start();
?>
<!DOCTYPE html>
<html>
	<?php require "$ROOT/resources/php/head.php"; ?>
	<body>
		<?php
		if(isset($current_user)) {
			require "$ROOT/resources/php/navbar.php";
		}
		?>
		<style>
			.content {
				position: absolute;
				width: 100%;
				padding: 20px;
				text-align: center;
			}
			h {
				font-size: 40px;
			}
			#piano {
				vertical-align: top;
				margin: 25px;
			}
			.note {
				position: relative;
				display: inline-block;
				vertical-align: top;
				top: 0px;
				width: 65px;
				height: 300px;
				border: 1px solid black;
				border-radius: 5px;
				box-shadow: 0 0 10px grey;
				background: white;
			}
			.sharp {
				width: 50px;
				height: 150px;
				background-color: black; 
				margin: 0 -25px;
				z-index: 1;
			}
		</style>
		<div class="content">
			<h>404 <? echo $error; ?></h>
			<div id="piano">
				<div class="note"></div><div class="note sharp"></div><div class="note"></div><div class="note sharp"></div><div class="note"></div><div class="note"></div><div class="note sharp"></div><div class="note"></div><div class="note sharp"></div><div class="note"></div><div class="note sharp"></div><div class="note"></div>
			</div>
			(click anywhere to toggle scatter animation)
		</div>
		<script>
			var paused = false;
			var elements = document.getElementById('piano').children;
			var pieces = new Map();
			var neg = 0;
			for(element of elements) {
				let rand = Math.round((Math.random() * 50));
				if(neg % 3 == 0) rand *= -1;
				pieces.set(element, rand);
				neg++;
			}
			const winW = window.innerWidth;
			const winH = window.innerHeight;
			var move_piece = function(piece, percentX, percentY, amount) {
				var calculatedX = (amount/2) - (amount * percentX);
				var calculatedY = (amount/2) - (amount * percentY);
				piece.style.transform = piece.style.webkitTransform = piece.style.MozTransform = 
					"translate3d(" + calculatedX + "px, " + calculatedY + "px, 0)";
				var rot = calculatedY + calculatedX;
				piece.style.transform += piece.style.webkitTransform += piece.style.MozTransform += 
					"rotate(" + rot + "deg)"
				piece.style.boxShadow = calculatedX + "px " + calculatedY + "px 10px rgba(50,50,50,.4)";
			};
			window.onmousemove = function(e) {
				if(paused) return;
				var percentX = (e.clientX / winW).toFixed(4);
				var percentY = (e.clientY / winH).toFixed(4);
	
				pieces.forEach((amount, piece, map) => {
					move_piece(piece, percentX, percentY, amount);
				});
			}
			window.onclick = () => paused = !paused;
		</script>
	</body>
</html>
<?php
$page_contents = ob_get_contents();
ob_end_clean();

echo str_replace('<!--TITLE-->', $req_login, $page_contents);
?>
