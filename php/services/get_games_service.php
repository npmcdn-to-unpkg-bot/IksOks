<?php
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    return;
}
//usleep(rand(300000, 1000000));

$conn = mysqli_connect("localhost", "root", "", "iks_oks");
if (!$conn) {
    throw new mysqli_sql_exception(mysqli_connect_error());
}

include "../Game.inc";
if(isset($_POST['player_id'])) {
    $games = Game::db_select_player($conn, $_POST['player_id']);
}
else {
    $limit = 0;
    if(isset($_POST['limit'])) {
        $limit = $_POST['limit'];
    }
    $games = Game::db_select($conn, $limit);
}

if($games) {
    echo json_encode($games);
}
else {
    echo json_encode(array());
}