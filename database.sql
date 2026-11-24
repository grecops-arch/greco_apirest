
CREATE DATABASE IF NOT EXISTS greco_apirest;
USE greco_apirest;

-- 1. Categorías
CREATE TABLE categorias (
  id_categoria INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Clientes
CREATE TABLE clientes (
  id_cliente INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(25) DEFAULT NULL,
  direccion VARCHAR(255) DEFAULT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Empleados
CREATE TABLE empleados (
  id_empleado INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  puesto VARCHAR(80) NOT NULL,
  salario DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Productos
CREATE TABLE productos (
  id_producto INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT UNSIGNED NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_productos_categoria
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. Pedidos
CREATE TABLE pedidos (
  id_pedido INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT UNSIGNED NOT NULL,
  id_empleado INT UNSIGNED DEFAULT NULL,
  fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente', 'procesando', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_pedidos_cliente
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_pedidos_empleado
    FOREIGN KEY (id_empleado) REFERENCES empleados (id_empleado)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Detalle de pedido
CREATE TABLE detalle_pedido (
  id_detalle INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT UNSIGNED NOT NULL,
  id_producto INT UNSIGNED NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(12, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  CONSTRAINT fk_detalle_pedido
    FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;