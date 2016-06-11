<?php
include_once "User.inc";
class Game
{
    const SQL_CREATE = "CREATE TABLE Games (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        player1 INT,
                        player2 INT,
                        board VARCHAR(9) NOT NULL,
                        winner INT
                        )";

    const SQL_INSERT = "INSERT INTO Games (player1, player2, board, winner)
                        VALUES ('%s', '%s', '%s', '%s')";

    const SQL_UPDATE = "UPDATE Games
                        SET player1='%s', player2='%s', board='%s', winner='%s'
                        WHERE id='%s'";

    const SQL_DELETE = "DELETE FROM Games
                        WHERE id='%s'";

    const SQL_SELECT = "SELECT * from Games
                        ORDER BY id DESC";

    const SQL_SELECT_PLAYER = "SELECT * from Games
                               WHERE (player1='%s') or (player2='%s')
                               ORDER BY id DESC";

    const SQL_SELECT_PLAYER_ACTIVE = "SELECT * from Games
                                      WHERE ((player1='%s') or (player2='%s')) and (winner=-2)
                                      ORDER BY id DESC";

    const SQL_SELECT_WINNER = "SELECT * from Games
                               WHERE winner='%s'
                               ORDER BY id DESC";

    const SQL_COUNT_PLAYER = "SELECT COUNT(*) AS i FROM Games
                              WHERE (player1='%s') or (player2='%s')";

    const SQL_COUNT_WINNER = "SELECT COUNT(*) AS i FROM Games
                              WHERE winner='%s'";

    const SQL_QUERY  = "SELECT * from Games
                        WHERE id='%s'
                        LIMIT 1";

    const SQL_TOP_LIST =   "SELECT winner FROM Games
                            WHERE winner > 0
                            GROUP BY winner
                            ORDER BY COUNT(winner) DESC";

    var $id;
    var $player1;
    var $player2;
    var $board;
    var $winner;

    function __construct($conn, $id, $player1_id, $player2_id, $board = "_________", $winner = -2) {
        $this->id = $id;
        if($player1_id) {
            $this->player1 = User::db_query($conn, 'id', $player1_id);
            if(!$this->player1) {
                $this->player1 = new User($player1_id, "", "", "");
            }
        }
        else {
            $this->player1 = User::ai();
        }
        $this->player1 = $this->player1->db_get_info_array($conn);

        if($player2_id) {
            $this->player2 = User::db_query($conn, 'id', $player2_id);
            if(!$this->player2) {
                $this->player2 = new User($player2_id, "", "", "");
            }
        }
        else {
            $this->player2 = User::ai();
        }
        $this->player2 = $this->player2->db_get_info_array($conn);
        
        $this->board = $board;
        $this->winner = $winner;
    }

    public function __toString()
    {
        $p1 = sprintf("%03d", $this->player1['id']);
        $p2 = sprintf("%03d", $this->player2['id']);
        if($this->player1->id == $this->winner) {
            $p1 = $p1 . "(WINNER)";
        }
        else if($this->player2->id == $this->winner) {
            $p2 = $p2 . "(WINNER)";
        }
        return sprintf("[%05d] %s vs %s - %s", $this->id, $p1, $p2, $this->board);
    }

    public static function db_create($conn, $player1_id, $player2_id) {
        $sql = sprintf(self::SQL_INSERT, $player1_id, $player2_id, "_________", -2);
        if (mysqli_query($conn, $sql)) {
            return new Game($conn, mysqli_insert_id($conn), $player1_id, $player2_id);
        }
        return NULL;
    }

    public function db_delete($conn) {
        $sql = sprintf(self::SQL_DELETE, $this->id);
        return mysqli_query($conn, $sql);
    }

    public function db_update($conn) {
        $sql = sprintf(self::SQL_UPDATE, $this->player1['id'], $this->player2['id'], $this->board, $this->winner, $this->id);
        return mysqli_query($conn, $sql);
    }

    private static function db_select_multiple($conn, $sql) {
        $games = array();
        $result = mysqli_query($conn, $sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $games[] = new Game($conn, $row['id'], $row['player1'], $row['player2'], $row['board'], $row['winner']);
            }
        }
        return $games;
    }

    public static function db_select($conn, $limit = 0) {
        $sql = self::SQL_SELECT;
        if($limit > 0) {
            $sql = $sql . " LIMIT " . $limit;
        }
        return self::db_select_multiple($conn, $sql);
    }

    public static function db_select_player($conn, $player_id) {
        return self::db_select_multiple($conn, sprintf(self::SQL_SELECT_PLAYER, $player_id, $player_id));
    }

    public static function db_select_player_active($conn, $player_id) {
        return self::db_select_multiple($conn, sprintf(self::SQL_SELECT_PLAYER_ACTIVE, $player_id, $player_id));
    }

    public static function db_select_winner($conn, $player_id) {
        return self::db_select_multiple($conn, sprintf(self::SQL_SELECT_WINNER, $player_id));
    }

    private static function db_count($conn, $sql) {
        $result = mysqli_query($conn, $sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return $row['i'];
        }
        return 0;
    }

    public static function db_count_player($conn, $player_id) {
        return self::db_count($conn, sprintf(self::SQL_COUNT_PLAYER, $player_id, $player_id));
    }

    public static function db_count_winner($conn, $player_id) {
        return self::db_count($conn, sprintf(self::SQL_COUNT_WINNER, $player_id));
    }

    public static function db_query($conn, $id) {
        $sql = sprintf(self::SQL_QUERY, $id);
        $result = mysqli_query($conn, $sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return new Game($conn, $row['id'], $row['player1'], $row['player2'], $row['board'], $row['winner']);
        }
        return NULL;
    }

    public static function db_top_list($conn, $limit = NULL) {
        $sql = self::SQL_TOP_LIST;
        if($limit > 0) {
            $sql = $sql . " LIMIT " . $limit;
        }
        $players = array();
        $result = mysqli_query($conn, $sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $p = User::db_query($conn, 'id', $row['winner']);
                if($p) {
                    $players[] = $p->db_get_info_array($conn);
                }
            }
        }
        return $players;
    }

    public function board_full() {
        for($i = 0; $i < 9; $i++) {
            if($this->board[$i] == '_') {
                return 0;
            }
        }
        return 1;
    }

    public function check_end() {
        $b = $this->board;
        $win = '_';

        if($b[0] != '_' &&
            (($b[0] == $b[1] && $b[0] == $b[2]) ||
            ($b[0] == $b[3] && $b[0] == $b[6]) ||
            ($b[0] == $b[4] && $b[0] == $b[8]))) {
            $win = $b[0];
        }
        else if($b[1] != '_' &&
            ($b[1] == $b[4] && $b[1] == $b[7])) {
            $win = $b[1];
        }
        else if($b[2] != '_' &&
            (($b[2] == $b[4] && $b[2] == $b[6]) ||
            ($b[2] == $b[5] && $b[2] == $b[8]))) {
            $win = $b[2];
        }
        else if($b[3] != '_' &&
            ($b[3] == $b[4] && $b[3] == $b[5])) {
            $win = $b[3];
        }
        else if($b[6] != '_' &&
            ($b[6] == $b[7] && $b[6] == $b[8])) {
            $win = $b[6];
        }

        if($win == 'x') {
            $this->winner = $this->player1['id'];
        }
        else if($win == 'o') {
            $this->winner = $this->player2['id'];
        }
        else if($this->board_full()) {
            $this->winner = -1;
        }
        return $this->winner != -2;
    }

    public function play($sign) {
        if($this->board_full()) {
            return;
        }
        $index = $this->find_possible_win($sign);
        if($index == -1) {
            $index = $this->find_possible_win($sign == 'x' ? 'o' : 'x');
        }
        if($index == -1) {
            do {
                $index = rand(0, 8);
            } while($this->board[$index] != '_');
        }
        $this->board[$index] = $sign;
    }

    private function find_possible_win($sign) {
        $b = $this->board;
        // dijagonala 1
        if($b[0 * 3 + 0] == '_' && $b[1 * 3 + 1] == $sign && $b[2 * 3 + 2] == $sign) {
            return 0 * 3 + 0;
        }
        if($b[1 * 3 + 1] == '_' && $b[0 * 3 + 0] == $sign && $b[2 * 3 + 2] == $sign) {
            return 1 * 3 + 1;
        }
        if($b[2 * 3 + 2] == '_' && $b[0 * 3 + 0] == $sign && $b[1 * 3 + 1] == $sign) {
            return 2 * 3 + 2;
        }
        // dijagonala 2
        if($b[0 * 3 + 2] == '_' && $b[1 * 3 + 1] == $sign && $b[2 * 3 + 0] == $sign) {
            return 0 * 3 + 2;
        }
        if($b[1 * 3 + 1] == '_' && $b[0 * 3 + 2] == $sign && $b[2 * 3 + 0] == $sign) {
            return 1 * 3 + 1;
        }
        if($b[2 * 3 + 0] == '_' && $b[0 * 3 + 2] == $sign && $b[1 * 3 + 1] == $sign) {
            return 2 * 3 + 0;
        }
        for($i = 0; $i < 3; $i++) {
            // redovi
            if($b[$i * 3 + 0] == '_' && $b[$i * 3 + 1] == $sign && $b[$i * 3 + 2] == $sign) {
                return $i * 3 + 0;
            }
            if($b[$i * 3 + 1] == '_' && $b[$i * 3 + 0] == $sign && $b[$i * 3 + 2] == $sign) {
                return $i * 3 + 1;
            }
            if($b[$i * 3 + 2] == '_' && $b[$i * 3 + 0] == $sign && $b[$i * 3 + 1] == $sign) {
                return $i * 3 + 2;
            }
            // kolone
            if($b[$i + 0 * 3] == '_' && $b[$i + 1 * 3] == $sign && $b[$i + 2 * 3] == $sign) {
                return $i + 0 * 3;
            }
            if($b[$i + 1 * 3] == '_' && $b[$i + 0 * 3] == $sign && $b[$i + 2 * 3] == $sign) {
                return $i + 1 * 3;
            }
            if($b[$i + 2 * 3] == '_' && $b[$i + 0 * 3] == $sign && $b[$i + 1 * 3] == $sign) {
                return $i + 2 * 3;
            }
        }
        return -1;
    }
}