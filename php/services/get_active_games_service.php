<?php
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    return;
}
//usleep(rand(300000, 1000000));

session_start();
if(!isset($_SESSION['token'])) {
    header("Error 401", true, 401);
    echo json_encode("Niste ulogovani.");
    return;
}
$user_id = $_SESSION['token'];

$what = 0;
if(isset($_POST['what'])) {
    if($_POST['what'] == 'count') {
        $what = 1;
    }
    else if($_POST['what'] == 'last') {
        $what = 2;
    }
}

$conn = mysqli_connect("localhost", "root", "", "iks_oks");
if (!$conn) {
    throw new mysqli_sql_exception(mysqli_connect_error());
}

include "../Game.inc";
$games = Game::db_select_player_active($conn, $user_id);
if($what == 1) {
    echo json_encode(count($games));
}
else if($what == 2) {
    echo json_encode($games[0]);
}
else {
    echo json_encode($games);
}
