<?php
$conn = mysqli_connect("localhost", "root", "", "iks_oks");
if (!$conn) {
    throw new mysqli_sql_exception(mysqli_connect_error());
}
include "User.inc";
mysqli_query($conn, User::SQL_CREATE);
mysqli_query($conn, Game::SQL_CREATE);