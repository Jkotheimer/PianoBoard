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
	<?php require "navbar.php"; ?>
</div>
<div class="panel left_panel">

	<img id="profile_picture" src="/images/default_profile_image_256.png"/>
	<div id="picture_hint">Drag and drop an image file here to set your profile picture</div>

	<div id="info">

		<div class="info_container">
			<input type="text" class="attribute" id="username" onkeypress="input_event(event, this, update_user);" value="<?php echo $current_user->username; ?>"/>
			<div id="username_notification" class="notification"></div>
		</div>

		<div class="info_container">
			<input type="text" class="attribute" id="email" onkeypress="input_event(event, this, update_user);" value="<?php echo $current_user->email; ?>"/>
			<div id="email_notification" class="notification"></div>
		</div>

		<div class="info_container">
			<div class="info_label">My Favorite Genres</div>
			<div class="favorite_container" id="genres_container" data-length="<?php echo count($current_user->favorite_genres); ?>">
				<!--The genres get listed here in the following form: -->
				<!--span class='favorite_element'> Genre </span-->
				<?php
				if(empty($current_user->favorite_genres)) {
					echo "<span class='message white'>You haven't added any of your favorite genres yet</span>";
				} else {
					foreach($current_user->favorite_genres as $genre) {
						echo "<span class='favorite_element' id='$genre' onclick='input_event(event, this, delete_favorite)'>$genre</span>";
					}
				}
				?>
			</div>
			<input type="text" id="favorite_genres" class="add_favorite" onkeypress="input_event(event, this, update_user);" placeholder="Add more favorite genres"/>
			<div id="genre_search">
				<!--As the user types in the above input bar, this populates with API search results-->
			</div>
			<div id="favorite_genres_notification" class="notification"></div>
		</div>

		<div class="info_container">
			<div class="info_label">My Favorite Artists</div>
			<div class="favorite_container" id="artists_container" data-length="<?php echo count($current_user->favorite_artists); ?>">
				<!--The artists get listed here in the following form: -->
				<!--span class='favorite_element'> Artist </span-->
				<?php
				if(empty($current_user->favorite_artists)) {
					echo "<span class='message white'>You haven't added any of your favorite artists yet</span>";
				} else {
					foreach($current_user->favorite_artists as $artist) {
						echo "<span class='favorite_element' id='$artist' onclick='input_event(event, this, delete_favorite)'>$artist</span>";
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

	<a id="sign_out" class="button" href="/logout/">Sign out</a>
	<?php
		$priv = false;
		if($current_user->is_private == 1) $priv = true;
	?>

	<span class="button toggle" data-true="Private" data-false="Public" data-value="<?php if($priv) echo 'true'; else echo 'false'; ?>" id="is_private" onclick="toggle(this, update_user);">
	<?php 
	if($priv) echo 'Private';
	else echo 'Public';
	?>
	</span>
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
					<span class='project_attribute button'></span>
					<span class='project_attribute'>Name</span>
					<span class='project_attribute'>Genre</span>
					<span class='project_attribute'>Tempo</span>
					<span class='project_attribute'>Time Signature</span>
				</div>";
			foreach($current_user->projects as $project) {
				echo "<div class='project' >
						<img src='/images/edit.png' class='project_attribute button green' onclick='window.location.href=`/studio/" . $project['id'] . "`'/>
						<span class='project_attribute'>" . $project['name'] . "</span>
						<span class='project_attribute'>" . $project['genre'] . "</span>
						<span class='project_attribute'>" . $project['tempo'] . " bpm</span>
						<span class='project_attribute'>" . $project['time_signature_num'] . '/' . $project['time_signature_den'] . "</span>
						<img src='/images/trash.png' class='project_attribute button right red' onclick='delete_project(" . $project['id'] . ")'/>
					</div>";
			}
		}
		?>
	</div>
</div>
