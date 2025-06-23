CREATE DATABASE orange_hearth;
USE orange_hearth;

CREATE TABLE registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  cedula VARCHAR(20),
  direccion VARCHAR(150),
  telefono VARCHAR(20),
  mascota_nombre VARCHAR(100),
  mascota_especie VARCHAR(50),
  mascota_edad VARCHAR(20),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
