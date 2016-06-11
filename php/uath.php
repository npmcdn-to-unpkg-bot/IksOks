<?php
$conn = mysqli_connect("localhost", "root", "", "iks_oks");
if (!$conn) {
    throw new mysqli_sql_exception(mysqli_connect_error());
}
include "Game.inc";
//Game::db_create($conn, array('id' => 0), array('id' => 1));
$game = Game::db_query($conn, 41);
$game->play('x');
$game->db_update($conn);