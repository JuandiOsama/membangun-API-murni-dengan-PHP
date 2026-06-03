<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$user = "root";
$pass = ""; 
$db   = "db_toko";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    http_response_code(500);
    die(json_encode([
        "status" => "error", 
        "pesan" => "Koneksi Database Gagal: " . mysqli_connect_error()
    ]));
}
?>