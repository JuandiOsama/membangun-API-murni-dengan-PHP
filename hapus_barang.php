<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "pesan" => "ID tidak ditemukan."]);
    exit();
}

$id = $data['id'];

// Proses hapus dari database
$query = "DELETE FROM barang WHERE id = '$id'";

if (mysqli_query($koneksi, $query)) {
    echo json_encode(["status" => "success", "pesan" => "Barang berhasil dihapus."]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "pesan" => "Gagal menghapus data: " . mysqli_error($koneksi)]);
}
?>