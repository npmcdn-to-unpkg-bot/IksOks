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

include "../Game.inc";
$game = Game::db_query($conn, $id);
if($game) {
    echo json_encode($game);
}
else {
    header("Error 400", true, 400);
    echo json_encode("Ne postoji igra sa tim ID.");
    return;
}