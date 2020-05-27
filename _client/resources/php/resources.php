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

// Search for accounts based on the provided query
function search_account($q) {
	require "database.phpsecret";
	$query = "SELECT AccountID, Username, Is_private FROM Account
				WHERE Username LIKE '$q' or Email LIKE '$q';";
	$result = $database->query($query);
	$rows = [];
	while($row = $result->fetch_assoc()) { $rows[] = $row; }
	return $rows;
}

// Get an account ID from the provided vague account attribute and call gen_account with it
function gen_account_vague($account) {
	require "database.phpsecret";
	$query = "SELECT AccountID FROM Account WHERE
				AccountID='$account' OR Username='$account' OR Email='$account';";
	$AccountID = $database->query($query);
	if($AccountID) { return gen_account($AccountID->fetch_row()[0]); }
	else { return NULL; }
}

// Generate an account object based on the provided AccountID
function gen_account($AccountID) {
	require "database.phpsecret";
	// First, get the generic account information
	$query = "SELECT Email, Username, Creation_date, Is_private 
					FROM Account WHERE AccountID='$AccountID';";
	$account = $database->query($query)->fetch_object();
	
	// Next, get the favorite genres and artists
	$query = "SELECT Artist from Favorite_artists WHERE AccountID='$AccountID';";
	$result = $database->query($query);
	$account->Artists = [];
	while($row = $result->fetch_array()) { $account->Artists[] = $row[0]; }

	$query = "SELECT Genre FROM Favorite_genres WHERE AccountID='$AccountID';";
	$result = $database->query($query);
	$account->Genres = [];
	while($row = $result->fetch_array()) { $account->Genres[] = $row[0]; }

	$query = "SELECt ProjectID, Name, Genre FROM Project WHERE AccountID='$AccountID';";
	$result = $database->query($query);
	$account->Projects = [];
	while($row = $result->fetch_assoc()) { $account->Projects[] = $row; }

	return $account;
}

$_GLOBALS['session_cookie'] = "pb_token";
$ID_cookie = "pb_uid";
?>
