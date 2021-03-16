<?php
$expiration_date = time() + (86400 * 30);
$domain = 'localhost';
$host = 'http://localhost';
$API = 'http://localhost/api';

// Search for accounts based on the provided query
function search_account($q) {
	require "database.phpsecret";
	$query = "SELECT id, username, is_private FROM user
				WHERE username LIKE '$q' or email LIKE '$q';";
	$result = $database->query($query);
	$rows = [];
	while($row = $result->fetch_assoc()) { $rows[] = $row; }
	mysqli_close($database); 
	return $rows;
}

// Get an account ID from the provided vague account attribute and call gen_account with it
function get_account_vague($account) {
	require "database.phpsecret";
	$query = "SELECT id FROM user WHERE
				id = '$account' OR username = '$account' OR email = '$account';";
	$id = $database->query($query);
	mysqli_close($database); 
	if($id) { return get_account($id->fetch_row()[0]); }
	else { return NULL; }
}

// Generate an account object based on the provided id
function get_account($id) {
	require "database.phpsecret";
	// First, get the generic account information
	$query = "SELECT id, email, username, creation_date, is_private 
					FROM user WHERE id = '$id';";
	$account = $database->query($query)->fetch_object();
	if(!isset($account)) return null;
	
	// Next, get the favorite genres and artists
	$query = "SELECT value from favorite_artists WHERE user_id='$id';";
	$result = $database->query($query);
	$account->favorite_artists = [];
	while($row = $result->fetch_array()) { $account->favorite_artists[] = $row[0]; }

	$query = "SELECT value FROM favorite_genres WHERE user_id='$id';";
	$result = $database->query($query);
	$account->favorite_genres = [];
	while($row = $result->fetch_array()) { $account->favorite_genres[] = $row[0]; }

	// Finally, get the name, genre, and id of all projects owned by the user
	$query = "SELECT * FROM project WHERE user_id='$id';";
	$result = $database->query($query);
	$account->projects = [];
	while($row = $result->fetch_assoc()) { $account->projects[] = $row; }
	
	mysqli_close($database); 

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
	if(isset($_COOKIE['pb_token']) && isset($_COOKIE['pb_uid'])) {
		$token = $_COOKIE['pb_token'];
		$uid = $_COOKIE['pb_uid'];
		$headers = ['Content-Type:application/json', "Cookie:pb_token=$token; pb_uid=$uid"];
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
	}
    curl_setopt($curl, CURLOPT_URL, $url);
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
	if(isset($cookies['pb_uid'])) $uid = $cookies['pb_uid'];

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
