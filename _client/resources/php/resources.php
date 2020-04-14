<?php
// Generate a unique username based on the given unique email address
function gen_username($email) {

	// Get the string before the @ sign in the email
	$at_pos = strpos($email, '@');
	$username = substr($email, 0, $at_pos);

	// Sum up the ascii values of each character after the @ sign
	$postfix = 0;
	$arr = str_split(substr($email, $at_pos, -1));
	foreach ($arr as $char) {$postfix += ord($char);}
	
	// Divide that value by the length of the email, round it down, and stringify it
	$postfix = strval(round($postfix/strlen($email)));

	// Append the postfix to the username and return the unique username
	return ($username . $postfix);
}
$session_cookie = "Pianoboard_Token";
$ID_cookie = "Pianoboard_ID";
?>
