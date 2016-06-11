<?php
include_once "Game.inc";
class User
{
    const SQL_CREATE = "CREATE TABLE Users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(30) NOT NULL UNIQUE,
                        email VARCHAR(30) NOT NULL UNIQUE,
                        password VARCHAR(30) NOT NULL
                        )";

    const SQL_INSERT = "INSERT INTO Users (username, email, password)
                        VALUES ('%s', '%s', '%s')";

    const SQL_UPDATE = "UPDATE Users
                        SET username='%s', email='%s', password='%s'
                        WHERE id='%s'";

    const SQL_DELETE = "DELETE FROM Users
                        WHERE id='%s'";

    const SQL_SELECT = "SELECT * FROM Users";

    const SQL_QUERY  = "SELECT * FROM Users
                        WHERE %s='%s'
                        LIMIT 1";

    var $id;
    var $username;
    var $email;
    var $password;

    function __construct($id, $username, $email, $password) {
        $this->id = $id;
        $this->username = $username;
        $this->email = $email;
        $this->password = $password;
    }

    public function __toString()
    {
        if($this->id == 0) {
            return "[000] AI";
        }
        return sprintf("[%03d] %s (%s) - %s", $this->id, $this->username, $this->email, str_repeat('*', strlen($this->password)));
    }

    public static function ai() {
        return new User(0, 'AI', '', '');
    }

    public static function db_create($conn, $username, $email, $password) {
        $sql = sprintf(self::SQL_INSERT, $username, $email, $password);
        if (mysqli_query($conn, $sql)) {
            return new User(mysqli_insert_id($conn), $username, $email, $password);
        }
        return NULL;
    }

    public function db_delete($conn) {
        $sql = sprintf(self::SQL_DELETE, $this->id);
        return mysqli_query($conn, $sql);
    }

    public function db_update($conn) {
        $sql = sprintf(self::SQL_UPDATE, $this->username, $this->email, $this->password, $this->id);
        return mysqli_query($conn, $sql);
    }

    public static function db_select($conn) {
        $users = array();
        $result = mysqli_query($conn, self::SQL_SELECT);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $users[] = new User($row['id'], $row['username'], $row['email'], $row['password']);
            }
        }
        return $users;
    }

    public static function db_select_info($conn, $limit = NULL) {
        $users = array();
        $sql = self::SQL_SELECT;
        if($limit > 0) {
            $sql = $sql . " LIMIT " . $limit;
        }
        $result = mysqli_query($conn, $sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $users[] = array(
                    'id' => $row['id'],
                    'username' => $row['username'],
                    'played' => Game::db_count_player($conn, $row['id']),
                    'wins' => Game::db_count_winner($conn, $row['id'])
                );
            }
        }
        return $users;
    }

    public static function db_query($conn, $column, $value) {
        $sql = sprintf(self::SQL_QUERY, $column, $value);
        $result = mysqli_query($conn, $sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return new User($row['id'], $row['username'], $row['email'], $row['password']);
        }
        return NULL;
    }

    public static function db_exists($conn, $username, $email) {
        return self::db_query($conn, 'username', $username) || self::db_query($conn, 'email', $email);
    }

    public function db_get_games($conn) {
        return Game::db_select_player($conn, $this->id);
    }

    public function db_get_wins($conn) {
        return Game::db_select_winner($conn, $this->id);
    }

    public function db_count_games($conn) {
        return Game::db_count_player($conn, $this->id);
    }

    public function db_count_wins($conn) {
        return Game::db_count_winner($conn, $this->id);
    }

    public function db_get_info_array($conn) {
        return array(
            'id' => $this->id,
            'username' => $this->username ? $this->username : "DELETED",
            'played' => $this->db_count_games($conn),
            'wins' => $this->db_count_wins($conn)
        );
    }
}