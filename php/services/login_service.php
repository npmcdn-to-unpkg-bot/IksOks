<?php
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    return;
}
//usleep(rand(300000, 1000000));

$username = $_POST['username'];
$password = $_POST['password'];
if(!$username || !$password) {
    header("Error 400", true, 400);
    echo json_encode("Niste uneli sve podatke.");
    return;
}

$conn = mysqli_connect("localhost", "root", "", "iks_oks");
if (!$conn) {
    throw new mysqli_sql_exception(mysqli_connect_error());
}

include "../User.inc";
$user = User::db_query($conn, 'username', $username);
if(!$user) {
    $user = User::db_query($conn, 'email', $username);
}
if(!$user) {
    header("Error 401", true, 401);
    echo json_encode("Korisnik sa tim imenom ne postoji.");
    return;
}

if($password == $user->password) {
    session_start();
    session_destroy();
    session_start();
    $_SESSION['token'] = $user->id;
    echo json_encode(array('username' => $user->username, 'token' => $user->id));
}
else {
    header("Error 401", true, 401);
    echo json_encode("Pogrešna šifra.");
}