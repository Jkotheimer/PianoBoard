<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];
require_once "$ROOT/resources/php/auth.php";
?>
<div>
	<a class="logo_box" href="/">
		<img src="/images/logo.png" class="logo"/>
	</a>
	<form class="nav_link search_container" method="GET" action="/search">
		<input type="text" name="query" id="search_bar" placeholder="Search for users or projects"/>
		<input type="image" onclick="this.parentElement.submit();" class="icon search_icon" src="/images/search.png"/>
	</form>

	<a class="nav_link" href="/settings">
		Settings
		<img class="icon" src="/images/settings.png"/>
	</a>
	<a class="nav_link" href="/tutorial">
		Tutorial
		<img class="icon" src="/images/tutorial.png"/>
	</a>
	<form class="nav_link" method="POST" action="<? echo "/api/$user->Username/projects"; ?>">
		Create New Project
		<input type="image" onclick="this.parentElement.submit();" class="icon" src="/images/create.png"/>
	</form>

</div>