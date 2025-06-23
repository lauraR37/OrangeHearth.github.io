<?php
header('Content-Type: application/json');

// Datos de conexión
$host = "localhost";
$user = "root";
$pass = "";
$db = "orange_hearth";

// Conectar
$conn = new mysqli($host, $user, $pass, $db);

// Revisar conexión
if ($conn->connect_error) {
  die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

// Obtener datos JSON del frontend
$data = json_decode(file_get_contents("php://input"), true);

// Validar datos
if (!$data) {
  echo json_encode(["error" => "No se recibieron datos válidos"]);
  exit;
}

// Insertar en base de datos
$stmt = $conn->prepare("INSERT INTO registros 
  (nombre, cedula, direccion, telefono, mascota_nombre, mascota_especie, mascota_edad)
  VALUES (?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param("sssssss", 
  $data['nombre'], $data['cedula'], $data['direccion'], $data['telefono'],
  $data['mascota']['nombre'], $data['mascota']['especie'], $data['mascota']['edad']
);

if ($stmt->execute()) {
  echo json_encode(["mensaje" => "Registro guardado correctamente."]);
} else {
  echo json_encode(["error" => "Error al guardar: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
