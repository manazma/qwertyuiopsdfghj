<?php
// api_tokens.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Agar bisa diakses dari frontend

// Konfigurasi Database (Sesuai data Anda)
$host = 'localhost';
$db   = 'orionzer_orion';
$user = 'orionzer_manaz';
$pass = 'Alif@2003';

// Koneksi ke MySQL
$conn = new mysqli($host, $user, $pass, $db);

// Cek Koneksi
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Ambil data token
$sql = "SELECT contract_address, name, symbol, logo, decimals FROM prc20_contracts ORDER BY symbol ASC";
$result = $conn->query($sql);

$tokens = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $tokens[] = $row;
    }
}

// Output JSON
echo json_encode($tokens);

$conn->close();
?>