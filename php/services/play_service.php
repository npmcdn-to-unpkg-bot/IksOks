<?php
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    return;
}
//usleep(rand(300000, 1000000));

if(!isset($_POST['id']) || !isset($_POST['index'])) {
    header("Error 400", true, 400);
    echo json_encode("Niste uneli sve podatke.");
    return;
}

$id = $_POST['id'];
$index = $_POST['index'];
$conn = mysqli_connect("localhost", "root", "", "iks_oks");
if (!$conn) {
    throw new mysqli_sql_exception(mysqli_connect_error());
}

include "../Game.inc";
$game = Game::db_query($conn, $id);
if(!$game) {
    header("Error 400", true, 400);
    echo json_encode("Ne postoji igra sa tim ID.");
    return;
}
if($game->winner != -2) {
    header("Error 400", true, 400);
    echo json_encode("Ova igra je već završena.");
    return;
}

session_start();
if(isset($_SESSION['token'])) {
    $user_id = $_SESSION['token'];
}
else {
    $user_id = -1;
}

if($user_id == $game->player1['id']) {
    $sign = 'x';
    $opponent_sign = 'o';
    $opponent_id = $game->player2['id'];
}
else if($user_id == $game->player2['id']) {
    $sign = 'o';
    $opponent_sign = 'x';
    $opponent_id = $game->player1['id'];
}
else {
    header("Error 401", true, 401);
    echo json_encode("Vi niste igrač.");
    return;
}

$count_x = substr_count($game->board, 'x');
$count_o = substr_count($game->board, 'o');
if(($sign == 'x' && $count_x > $count_o) || ($sign == 'o' && $count_o >= $count_x)) {
    header("Error 400", true, 400);
    echo json_encode("Nije vaš red.");
    return;
}

if($game->board[$index] != '_') {
    header("Error 400", true, 400);
    echo json_encode("Polje je već popunjeno.");
    return;
}

$game->board[$index] = $sign;
$end = $game->check_end();
$game->db_update($conn);
echo json_encode(array('board' => $game->board, 'end' => $end));

if($opponent_id == 0 && !$end) {
    usleep(1000000);
    $game->play($opponent_sign);
    $game->check_end();
    $game->db_update($conn);
}
