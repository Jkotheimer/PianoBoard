<style>
	<?
	$ROOT = $_SERVER['DOCUMENT_ROOT'];
	echo fread(fopen("$ROOT/resources/css/form_styles.css", 'r'),
		filesize("$ROOT/resources/css/form_styles.css"));
	echo fread(fopen("$ROOT/landing_page.css", "r"),
		filesize("$ROOT/landing_page.css"));
	?>
</style>
<div id="nav_bar">
	<? echo fread(fopen("$ROOT/resources/html/navbar.html", 'r'),
			filesize("$ROOT/resources/html/navbar.html")); ?>
</div>
<div class="panel left_panel">

	<img id="profile_picture" src="/images/default_profile_image_256.png"/>
	<div id="picture_hint">Drag and drop an image file here to set your profile picture</div>

	<div id="info">

		<div class="info_container">
			<input type="text" id="username" value="<? echo $account->Username; ?>"/>
			<div id="username_notification" class="notification"></div>
		</div>

		<div class="info_container">
			<div class="info_label">My Favorite Genres</div>
			<div class="favorite_container" id="genre_container">
				<!--The genres get listed here in the following form: -->
				<!--span class='favorite_element'> Genre </span-->
				<?
				foreach($account->Genres as $genre) {
					echo "<span class='favorite_element'>$genre</span>";
				}
				?>
			</div>
			<input type="text" id="favoriteGenres" class="add_favorite" placeholder="Add more favorite genres"/>
			<div id="genre_search">
				<!--As the user types in the above input bar, this populates with API search results-->
			</div>
			<div id="favoriteGenres_notification" class="notification"></div>
		</div>

		<div class="info_container">
			<div class="info_label">My Favorite Artists</div>
			<div class="favorite_container" id="artist_container">
				<!--The artists get listed here in the following form: -->
				<!--span class='favorite_element'> Artist </span-->
				<?
				foreach($account->Artists as $artist) {
					echo "<span class='favorite_element'>$artist</span>";
				}
				?>
			</div>
			<input type="text" id="favoriteArtists" class="add_favorite" placeholder="Add more favorite artists"/>
			<div id="artist_search">
				<!--As the user types in the above input bar, this populates with API search results-->
			</div>
			<div id="favoriteArtists_notification" class="notification"></div>
		</div>

	</div>

	<a id="sign_out" href="/api/auth/logout/?platform=web">Sign out</a>
</div>

<div class="panel right_panel">
	<h class="panel_header">Your Projects</h>
	<div id="project_area">
		<div class="project_label">
			<span class="project_attribute">Project ID</span>
			<span class="project_attribute">Name</span>
			<span class="project_attribute">Genre</span>
		</div>
	<?
	foreach($account->Projects as $project) {
		echo "\n\t\t<div class='project'>\n" .
				"\t\t\t<span class='project_attribute'>" . $project['ProjectID'] . "</span>\n" .
				"\t\t\t<span class='project_attribute'>" . $project['Name'] . "</span>\n" .
				"\t\t\t<span class='project_attribute'>" . $project['Genre'] . "</span>\n" .
			"\t\t</div>\n";
	}
	?>
	</div>
</div>
