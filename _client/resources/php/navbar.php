<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];
require_once "$ROOT/resources/php/auth.php";
?>
<style>
	<?php 
	echo fread(fopen("$ROOT/resources/css/navbar.css", "r"),
		filesize("$ROOT/resources/css/navbar.css"));
	?>
</style>
<div>
	<a class="logo_box" href="/">
		<img src="/images/logo.png" class="logo"/>
	</a>
	<form class="nav_link search_container" method="GET" action="/search">
		<input type="text" name="query" id="search_bar" placeholder="Search for users or projects"/>
		<input type="image" onclick="this.parentElement.submit();" class="icon search_icon" src="/images/search.png"/>
	</form>

	<form class="nav_link" onclick="this.submit()" method="POST" action="<? echo "/api/$current_user->Username/projects"; ?>">
		Create New Project
		<input type="image" class="icon" src="/images/create.png"/>
	</form>

</div>
