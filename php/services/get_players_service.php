<?php
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    return;
}
//usleep(rand(300000, 1000000));

$conn = mysqli_connect("localhost", "root", "", "iks_oks");
if (!$conn) {
    throw new mysqli_sql_exception(mysqli_connect_error());
}


$sort = NULL;
if(isset($_POST['sort_by'])) {
    $sort = $_POST['sort_by'];
}
$limit = 0;
if(isset($_POST['limit'])) {
    $limit = $_POST['limit'];
}

include "../User.inc";
switch ($sort) {
    case 'wins':
        $users = Game::db_top_list($conn, $limit);
        break;
    default:
        $users = User::db_select_info($conn, $limit);
        break;
}
if($users) {
    echo json_encode($users);
}
else {
    echo json_encode(array());
}