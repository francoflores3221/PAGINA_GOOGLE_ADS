<?php
// Configuración de la base de datos
$host = "localhost";
$usuario = "root";
$contrasena = "sofimiamor";
$base_datos = "vital_salud";

// Crear conexión
$conn = new mysqli($host, $usuario, $contrasena, $base_datos);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener y sanitizar los datos del formulario
$nombre = $conn->real_escape_string($_POST['nombre']);
$email = $conn->real_escape_string($_POST['email']);
$telefono = $conn->real_escape_string($_POST['telefono']);
$edades = $conn->real_escape_string($_POST['edades']);
$localidad = $conn->real_escape_string($_POST['localidad']);
$tipo_trabajo = $conn->real_escape_string($_POST['tipo-trabajo']);
$llamada = $conn->real_escape_string($_POST['llamada']);

// Manejar los beneficios (checkboxes)
$beneficios = isset($_POST['beneficios']) ? implode(", ", $_POST['beneficios']) : 'Ninguno';

// Insertar en la base de datos
$sql = "INSERT INTO leads (nombre_completo, email, telefono, edades, localidad, tipo_trabajo, preferencia_contacto, beneficios)
        VALUES ('$nombre', '$email', '$telefono', '$edades', '$localidad', '$tipo_trabajo', '$llamada', '$beneficios')";

if ($conn->query($sql) === TRUE) {
    // Respuesta JSON para el éxito
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => '¡Datos guardados con éxito!']);
} else {
    // Respuesta JSON para el error
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Error: ' . $sql . '<br>' . $conn->error]);
}

$conn->close();
?>