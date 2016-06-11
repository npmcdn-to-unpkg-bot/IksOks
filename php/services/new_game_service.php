<?php
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    return;
}
//usleep(rand(300000, 1000000));

session_start();
if(isset($_SESSION['token'])) {
    $user_id = $_SESSION['token'];
}
else {
    header("Error 401", true, 401);
    echo json_encode("Niste ulogovani.");
    return;
}

if(!isset($_POST['sign']) || !isset($_POST['player2_id'])) {
    header("Error 400", true, 400);
    echo json_encode("Niste uneli sve podatke.");
    return;
}
$sign = $_POST['sign'];
$p2_id = $_POST['player2_id'];

if($user_id == $p2_id) {
    header("Error 400", true, 400);
    echo json_encode("Ne možete izazvati samog sebe.");
    return;
}

$conn = mysqli_connect("localhost", "root", "", "iks_oks");
if (!$conn) {
    throw new mysqli_sql_exception(mysqli_connect_error());
}

include "../User.inc";
$p1 = User::db_query($conn, 'id', $user_id);
$p2 = $p2_id ? User::db_query($conn, 'id', $p2_id) : User::ai();
if(!$p1 || !$p2) {
    header("Error 400", true, 400);
    echo json_encode("Igrač sa tim ID ne postoji.");
    return;
}

$game = Game::db_create($conn, $sign == 'x' ? $p1->id : $p2->id, $sign == 'x' ? $p2->id : $p1->id);
echo json_encode($game);

if($game->player1['id'] == 0) {
    $game->play('x');
    $game->db_update($conn);
}