<?php
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    return;
}
//usleep(rand(300000, 1000000));

if(!isset($_POST['id'])) {
    header("Error 400", true, 400);
    echo json_encode("Niste uneli id.");
    return;
}

$id = $_POST['id'];
$conn = mysqli_connect("localhost", "root", "", "iks_oks");
if (!$conn) {
    throw new mysqli_sql_exception(mysqli_connect_error());
}

include "../User.inc";
if($id) {
    $user = User::db_query($conn, 'id', $id);
}
else {
    $user = User::ai();
}
if($user) {
    echo json_encode($user->db_get_info_array($conn));
}
else {
    header("Error 400", true, 400);
    echo json_encode("Ne postoji korisnik sa tim ID.");
    return;
}