<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Hubungkan ke koneksi database yang sudah kita perbaiki kemarin
include 'koneksi.php';

// Membaca data JSON yang dikirim oleh app.js
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['nama_barang']) || !isset($data['harga'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "pesan" => "Data yang dikirim tidak lengkap."]);
    exit();
}

$id = $data['id'];
$nama = mysqli_real_escape_string($koneksi, $data['nama_barang']);
$harga = mysqli_real_escape_string($koneksi, $data['harga']);

// Proses update ke database
$query = "UPDATE barang SET nama_barang = '$nama', harga = '$harga' WHERE id = '$id'";

if (mysqli_query($koneksi, $query)) {
    echo json_encode(["status" => "success", "pesan" => "Barang berhasil diperbarui."]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "pesan" => "Gagal memperbarui database: " . mysqli_error($koneksi)]);
}
?>