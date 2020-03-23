<?
$servername = "127.0.0.1";
$username = "pb";
$password = "PASSWORD";
$database = "Pianoboard";

// Create connection
$db = mysqli_connect($servername, $username, $password, $database);
unset($servername, $username, $password);

// Check connection
if ($db->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}

?>
