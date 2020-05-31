<?php
$session_cookie = "pb_token";
$id_cookie = "pb_uid";
$expiration_date = time() + (86400 * 30);
$domain = 'localhost';
$host = 'http://localhost';
$API = 'http://localhost/api';

// Generate a unique username based on the given unique email address
function gen_username($email) {
	require_once 'database.phpsecret';

	// Get the string before the @ sign in the email
	$at_pos = strpos($email, '@');
	$username = substr($email, 0, $at_pos);

	return username_recursion($username, 0);
}

function username_recursion($prefix, $tag) {
	$username = $prefix . $tag;
	mysql.query("SELECT AccountID FROM Account WHERE Username = $username;",
		function(err, data) {
			if(err || !data) {
				// Nothing exists with this username -  it is unique
				return $username;
			} else return username_recursion($prefix, $tag + 1);
		}
	);
	
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
	$query = "SELECT AccountID, Email, Username, Creation_date, Is_private 
					FROM Account WHERE AccountID='$AccountID';";
	$account = $database->query($query)->fetch_object();
	if(!isset($account)) return null;
	
	// Next, get the favorite genres and artists
	$query = "SELECT Artist from Favorite_artists WHERE AccountID='$AccountID';";
	$result = $database->query($query);
	$account->Artists = [];
	while($row = $result->fetch_array()) { $account->Artists[] = $row[0]; }

	$query = "SELECT Genre FROM Favorite_genres WHERE AccountID='$AccountID';";
	$result = $database->query($query);
	$account->Genres = [];
	while($row = $result->fetch_array()) { $account->Genres[] = $row[0]; }

	$query = "SELECT ProjectID, Name, Genre FROM Project WHERE AccountID='$AccountID';";
	$result = $database->query($query);
	$account->Projects = [];
	while($row = $result->fetch_assoc()) { $account->Projects[] = $row; }

	return $account;
}

function xhr($method, $url, $data = false) {

    $curl = curl_init();

    switch ($method) {

        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
            break;

        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;

        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query(json_encode($data)));
    }

	// Optional Authentication: 
	$token = $_COOKIE['pb_token'];
	$uid = $_COOKIE['pb_uid'];
	$headers = ['Content-Type:application/json', "Cookie:pb_token=$token; pb_uid=$uid"];
    curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HEADER, true);
	curl_setopt($curl, CURLOPT_VERBOSE, true);

    $response = curl_exec($curl);
	$header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
	$header = substr($response, 0, $header_size);
	$body = json_decode(substr($response, $header_size));

	$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
	$cookies = extract_cookies($header);
	$uid = null;
	if(isset($cookies[$id_cookie])) $uid = $cookies[$id_cookie];

    curl_close($curl);

    return array('body' => $body, 'status' => $status, 'cookies' => $cookies, 'uid' => $uid);
}

function extract_cookies($headers) {

	preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $headers, $matches);
	
	$cookies = array();
	foreach($matches[1] as $item) {
    	parse_str($item, $cookie);
    	$cookies = array_merge($cookies, $cookie);
	}

	return $cookies;
}
?>
