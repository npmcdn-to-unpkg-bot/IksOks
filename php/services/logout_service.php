<?php
//usleep(rand(300000, 1000000));
session_start();
session_destroy();
echo json_encode("Izlogovan");