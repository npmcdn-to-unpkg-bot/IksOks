<?php
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    return;
}
//usleep(rand(300000, 1000000));

$username = $_POST['username'];
$password = $_POST['password'];
$email = $_POST['email'];
if(!$username || !$password || !$email) {
    header("Error 400", true, 400);
    echo json_encode("Niste uneli sve podatke.");
    return;
}

$conn = mysqli_connect("localhost", "root", "", "iks_oks");
if (!$conn) {
    throw new mysqli_sql_exception(mysqli_connect_error());
}

include "../User.inc";
if(!User::db_exists($conn, $username, $email)) {
    $user = User::db_create($conn, $username, $email, $password);
    session_start();
    $_SESSION['token'] = $user->id;
    echo json_encode(array('username' => $user->username, 'token' => $user->id));
}
else {
    header("Error 401", true, 401);
    echo json_encode("Korisničko ime ili email već postoje.");
}