<?php
include "database_init.php";

function write($list) {
    echo "DATABASE:\n";
    foreach ($list as $elem) {
        echo $elem . "\n";
    }
    echo "\n\n";
}

$game = Game::db_create($conn, 1, 0);
echo $game->check_end();
echo $game->winner;

/*$p1 = User::db_create($conn, "velja", "velja@velja.velja", "velja");
echo $p1 . "\n";
$p2 = User::db_create($conn, "dva", "dva@dva.dva", "dva");
echo $p2 . "\n";
$p3 = User::db_create($conn, "tri", "tri@tri.tri", "tri");
echo $p3 . "\n";
$p4 = User::db_create($conn, "cetiri", "cetiri@cetiri.cetiri", "cetiri");
echo $p4 . "\n";
$p5 = User::db_create($conn, "", "pet@pet.pet", "pet");
echo $p5 . "\n";
$p6 = User::db_create($conn, "sest", "", "sest");
echo $p6 . "\n";
$p7 = User::db_create($conn, "sedam", "sedam@sedam.sedam", "");
echo $p7 . "\n";
write(User::db_select($conn));

$p1->username = "selja";
$p1->db_update($conn);
$p5->db_delete($conn);
write(User::db_select($conn));
echo User::db_exists($conn, "selja", "velja@velja.velja") ? "TRUE" : "FALSE";
echo User::db_exists($conn, "selja", "email@email.email") ? "TRUE" : "FALSE";
echo User::db_exists($conn, "name", "velja@velja.velja") ? "TRUE" : "FALSE";
echo User::db_exists($conn, "name", "email@email.email") ? "TRUE" : "FALSE";
echo "\n";

$g1 = Game::db_create($conn, $p1, $p2);
echo $g1 . "1\n";
$g2 = Game::db_create($conn, $p3, $p4);
echo $g2 . "2\n";
$g3 = Game::db_create($conn, $p5, $p6);
echo $g3 . "3\n";
$g4 = Game::db_create($conn, $p1, $p6);
echo $g4 . "4\n";
$g5 = Game::db_create($conn, $p1, User::ai());
echo $g5 . "5\n";
$g6 = Game::db_create($conn, User::ai(), $p6);
echo $g6 . "6\n";
write(Game::db_select($conn));

$g1->board = "xoxo__o_x";
$g1->db_update($conn);
$g4->winner = $g4->player1;
$g4->db_update($conn);
$g5->winner = $g5->player2;
$g5->db_update($conn);
$g2->db_delete($conn);
write(Game::db_select($conn));
write($p1->db_get_games($conn));
write(Game::db_select_player($conn, $p1->id));
write($p1->db_get_wins($conn));
write(Game::db_select_winner($conn, $p1->id));
echo Game::db_query($conn, 1) . "\n";*/