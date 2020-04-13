<style>
	<?
	$ROOT = $_SERVER['DOCUMENT_ROOT'];
	echo fread(fopen($ROOT . "/resources/css/form_styles.css", 'r'),
		filesize($ROOT . "/resources/css/form_styles.css"));
	echo fread(fopen($ROOT . "/create_account/create_account.css", "r"),
		filesize($ROOT . "/create_account/create_account.css"));
	?>
</style>
<div class="panel form_panel">
	<h>Create An Account</h>

	<form class="form_area" method="POST" action="/create_account/">
		<div class="form_section">
			<div class="form_label">Email</div>
			<input type="text" id="email" name="email" class="form_input" placeholder="your.email@something.com"
				autocapitalize="off" spellcheck="false" autocorrect="off"/>
			<!--email_notification-->
		</div>
		<div class="form_section">
			<div class="form_label">Password</div>
			<input type="password" id="password" name="password" class="form_input" placeholder="Choose a password"/>
			<!--password_notification-->
		</div>
		<div class="form_section">
			<div class="form_label">Confirm Password</div>
			<input type="password" id="confirm_password" name="confirm_password" class="form_input" placeholder="Confirm Password"/>
			<!--confirm_password_notification-->
		</div>
		<input type="submit" id="submit" name="submit" value="Create Account"/>
	</form>
</div>
