<?php
$ROOT = $_SERVER['DOCUMENT_ROOT'];
require_once "auth.php";
require_once "resources.php";
if(!isset($current_user)) {
	// Something is seriously wrong - redirect home
	header("Location: $domain");
	exit();
}
?>
<style>
	<?php
	echo fread(fopen("$ROOT/resources/css/form_styles.css", 'r'),
		filesize("$ROOT/resources/css/form_styles.css"));
	echo fread(fopen("$ROOT/resources/css/landing_page.css", "r"),
		filesize("$ROOT/resources/css/landing_page.css"));
	?>
</style>
<script>
	<?php
	echo fread(fopen("$ROOT/resources/js/resources.js", "r"),
		filesize("$ROOT/resources/js/resources.js"));
	echo fread(fopen("$ROOT/resources/js/api.js", "r"),
		filesize("$ROOT/resources/js/api.js"));
	?>
</script>
<div id="nav_bar">
	<? require "navbar.php"; ?>
</div>
<div class="panel left_panel">

	<img id="profile_picture" src="/images/default_profile_image_256.png"/>
	<div id="picture_hint">Drag and drop an image file here to set your profile picture</div>

	<div id="info">

		<div class="info_container">
			<input type="text" id="username" onkeypress="input_event(event, this, update_user);" value="<? echo $current_user->username; ?>"/>
			<div id="username_notification" class="notification"></div>
		</div>

		<div class="info_container">
			<div class="info_label">My Favorite Genres</div>
			<div class="favorite_container" id="genre_container">
				<!--The genres get listed here in the following form: -->
				<!--span class='favorite_element'> Genre </span-->
				<?
				if(empty($current_user->genres)) {
					echo "<span class='message white'>You haven't added any of your favorite genres yet</span>";
				} else {
					foreach($current_user->genres as $genre) {
						echo "<span class='favorite_element'>$genre</span>";
					}
				}
				?>
			</div>
			<input type="text" id="favorite_genres" class="add_favorite" onkeypress="input_event(event, this, update_user);" placeholder="Add more favorite genres"/>
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
				if(empty($current_user->artists)) {
					echo "<span class='message white'>You haven't added any of your favorite artists yet</span>";
				} else {
					foreach($current_user->artists as $artist) {
						echo "<span class='favorite_element'>$artist</span>";
					}
				}
				?>
			</div>
			<input type="text" id="favorite_artists" class="add_favorite" onkeypress="input_event(event, this, update_user);" placeholder="Add more favorite artists"/>
			<div id="artist_search">
				<!--As the user types in the above input bar, this populates with API search results-->
			</div>
			<div id="favorite_artists_notification" class="notification"></div>
		</div>

	</div>

	<a id="sign_out" href="/logout/">Sign out</a>
</div>

<div class="panel right_panel">
	<h class="panel_header">Your Projects</h>
	<div id="project_area">
		<?php
		if(empty($current_user->projects)) {
			echo "<div class='project_label center'>
					<span class='project_attribute long'>You haven't started any projects yet</span>
					<button class='round_button spaced' onclick='create_project(null)'>Create Your First Project</button>
				<div>";
		} else {
			echo "<div class='project_label'>
					<span class='project_attribute'>Project ID</span>
					<span class='project_attribute'>Name</span>
					<span class='project_attribute'>Genre</span>
				</div>";
			foreach($current_user->projects as $project) {
				echo "<div class='project'>
						<span class='project_attribute'>" . $project['ProjectID'] . "</span>
						<span class='project_attribute'>" . $project['Name'] . "</span>
						<span class='project_attribute'>" . $project['Genre'] . "</span>
					</div>";
			}
		}
		?>
	</div>
</div>
