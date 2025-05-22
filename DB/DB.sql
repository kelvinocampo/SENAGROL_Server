DROP DATABASE IF EXISTS senagrol;
CREATE DATABASE IF NOT EXISTS senagrol;
USE senagrol;

DROP TABLE IF EXISTS usuario;
CREATE TABLE IF NOT EXISTS usuario(
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    nombre_usuario VARCHAR(20) UNIQUE,
    correo VARCHAR(100) UNIQUE,
    contraseña VARCHAR(60),
    cara VARCHAR(255),
    telefono VARCHAR(15)
);

DROP TABLE IF EXISTS comprador;
CREATE TABLE IF NOT EXISTS comprador(
    id_comprador INT PRIMARY KEY,
    estado ENUM('Pendiente', 'Activo') DEFAULT 'Activo',

    FOREIGN KEY (id_comprador)
    REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
)engine=InnoDB;

DROP TABLE IF EXISTS vendedor;
CREATE TABLE IF NOT EXISTS vendedor(
    id_vendedor INT PRIMARY KEY,
    estado ENUM('Pendiente', 'Activo') DEFAULT 'Pendiente',
    FOREIGN KEY (id_vendedor)
    REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
)engine=InnoDB;

DROP TABLE IF EXISTS transportador;
CREATE TABLE IF NOT EXISTS transportador(
    id_transportador INT PRIMARY KEY,
    licencia_conduccion VARCHAR(50),
    soat VARCHAR(50),
    tarjeta_propiedad_vehiculo VARCHAR(50),
    tipo_vehiculo VARCHAR(50),
    peso_vehiculo DECIMAL(10, 2),
    estado ENUM('Pendiente', 'Activo') DEFAULT 'Pendiente',
    FOREIGN KEY (id_transportador)
    REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
)engine=InnoDB;

DROP TABLE IF EXISTS foto_vehiculo;
CREATE TABLE IF NOT EXISTS foto_vehiculo(
    id_foto_vehiculo INT PRIMARY KEY AUTO_INCREMENT,
    foto VARCHAR(255),

    id_transportador INT,
    FOREIGN KEY (id_transportador)
    REFERENCES transportador(id_transportador)
    ON DELETE CASCADE
)engine=InnoDB;

DROP TABLE IF EXISTS administrador;
CREATE TABLE IF NOT EXISTS administrador(
    id_administrador INT PRIMARY KEY,
    estado ENUM('Pendiente', 'Activo') DEFAULT "Activo",

    FOREIGN KEY (id_administrador)
    REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
)engine=InnoDB;

DROP TABLE IF EXISTS producto;
CREATE TABLE IF NOT EXISTS producto(
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    latitud DECIMAL(9, 6),
    longitud DECIMAL(9, 6),
    cantidad INT,
    cantidad_minima_compra INT,
    imagen VARCHAR(255),
    precio_unidad DECIMAL(10, 2),
    descuento DECIMAL(5, 2),
    despublicado BOOLEAN DEFAULT 0,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT 0,

    id_vendedor INT NULL,
    FOREIGN KEY (id_vendedor)
    REFERENCES vendedor(id_vendedor)
    ON DELETE SET NULL
    ON UPDATE CASCADE
)engine=InnoDB;

DROP TABLE IF EXISTS compra;
CREATE TABLE IF NOT EXISTS compra(
    id_compra INT PRIMARY KEY AUTO_INCREMENT,
    estado ENUM('Pendiente', 'Asignada', 'En Proceso', 'Completada'),
    precio_transporte DECIMAL(10, 2) NULL,
    precio_producto DECIMAL(10, 2),
    cantidad INT,
    fecha_compra DATETIME,
    fecha_entrega DATETIME NULL,
    nombre_comprador_eliminado VARCHAR(100) NULL,
    nombre_vendedor_eliminado VARCHAR(100) NULL,
    nombre_transportador_eliminado VARCHAR(100) NULL,
    latitud_comprador DECIMAL(9, 6) NOT NULL,
    longitud_comprador DECIMAL(9, 6) NOT NULL,

    id_producto INT,
    FOREIGN KEY (id_producto)
    REFERENCES producto(id_producto)
    ON UPDATE CASCADE,

    id_vendedor INT NULL,
    -- FOREIGN KEY (id_vendedor)
    -- REFERENCES producto(id_vendedor)
    -- ON DELETE SET NULL,

    id_comprador INT NULL,
    FOREIGN KEY (id_comprador)
    REFERENCES comprador(id_comprador)
    ON DELETE SET NULL,

    id_transportador INT NULL,
    FOREIGN KEY (id_transportador)
    REFERENCES transportador(id_transportador)
    ON DELETE SET NULL
)engine=InnoDB;

DROP TABLE IF EXISTS chat;
CREATE TABLE IF NOT EXISTS chat(
    id_chat INT PRIMARY KEY AUTO_INCREMENT,
    bloqueado_user1 BOOLEAN NULL,
    bloqueado_user2 BOOLEAN NULL,
    eliminado_user1 BOOLEAN NULL,
    eliminado_user2 BOOLEAN NULL,
    fecha_reciente DATETIME,

    id_user1 INT NULL,
    FOREIGN KEY (id_user1) 
    REFERENCES usuario(id_usuario)
    ON UPDATE CASCADE
    ON DELETE SET NULL,

    id_user2 INT NULL,
    FOREIGN KEY (id_user2) 
    REFERENCES usuario(id_usuario)
    ON UPDATE CASCADE
    ON DELETE SET NULL
)engine=InnoDB;

DROP TABLE IF EXISTS mensaje;
CREATE TABLE IF NOT EXISTS mensaje(
    id_mensaje INT PRIMARY KEY AUTO_INCREMENT,
    editado BOOLEAN DEFAULT FALSE,
    tipo ENUM('texto', 'audio', 'imagen') NOT NULL,
    contenido VARCHAR(255),  -- URL o texto
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,

    id_chat INT,
    FOREIGN KEY (id_chat) 
    REFERENCES chat(id_chat)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    id_user INT
)engine=InnoDB;