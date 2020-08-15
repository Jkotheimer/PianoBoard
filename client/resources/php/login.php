<style>
	<?php
	$ROOT = $_SERVER['DOCUMENT_ROOT'];
	echo fread(fopen("$ROOT/resources/css/form_styles.css", 'r'),
		filesize("$ROOT/resources/css/form_styles.css"));
	echo fread(fopen("$ROOT/resources/css/landing_page.css", "r"),
		filesize("$ROOT/resources/css/landing_page.css"));
	?>
</style>
<div id="login_panel">
	<script src="/resources/js/api.js" type="text/javascript"></script>
	<script src="/resources/js/resources.js" type="text/javascript"></script>
	<form class="panel form_panel login_panel" onsubmit="event.preventDefault(); pb_login()">
		<div class="login_logo">
			<img src="/images/logo.png"/>
		</div>
		<div class="form_area login_form_area">
			<div class="form_section login_form_section">
				<div class="form_label">Email or Username</div>
				<input type="text" id="login" name="login" class="form_input" placeholder="Enter your Email or Username"
					autocapitalize="off" spellcheck="false" autocorrect="off" required
					<?php
					if(isset($_POST['login'])) echo 'value="' . $_POST['login'] . '"';
					?>
				/>
				<div id="login_notification" class="notification"></div> 
			</div>
			<div class="form_section login_form_section">
				<div class="form_label">Password</div>
				<input type="password" id="password" name="password" class="form_input" placeholder="Enter your password"
					autocomplete="new-password" required/>
				<div id="password_notification" class="notification"></div>
			</div>
		</div>
		<div class="link_area">
			<a href="./create_account/" class="link create_account_link">Create a new Account</a>
			<a href="./reset_password/" class="link reset_password_link">Forgot password?</a>
			<input type="submit" id="submit" name="submit" class="link submit_link" value="Sign In"/>
		</div>
	</form>
</div>
