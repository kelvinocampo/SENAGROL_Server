-- Eliminar la base de datos si existe
DROP DATABASE IF EXISTS senagrol;
CREATE DATABASE senagrol;
\c senagrol;

-- Tabla usuario
DROP TABLE IF EXISTS usuario CASCADE;
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    nombre_usuario VARCHAR(20) UNIQUE,
    correo VARCHAR(100) UNIQUE,
    contraseña VARCHAR(60),
    telefono VARCHAR(15)
);

-- Tabla comprador
DROP TABLE IF EXISTS comprador CASCADE;
CREATE TABLE comprador (
    id_comprador INT PRIMARY KEY,
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Pendiente', 'Activo')),
    FOREIGN KEY (id_comprador) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla vendedor
DROP TABLE IF EXISTS vendedor CASCADE;
CREATE TABLE vendedor (
    id_vendedor INT PRIMARY KEY,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Activo')),
    FOREIGN KEY (id_vendedor) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla transportador
DROP TABLE IF EXISTS transportador CASCADE;
CREATE TABLE transportador (
    id_transportador INT PRIMARY KEY,
    licencia_conduccion VARCHAR(50),
    soat VARCHAR(50),
    tarjeta_propiedad_vehiculo VARCHAR(50),
    tipo_vehiculo VARCHAR(50),
    peso_vehiculo NUMERIC(10, 2),
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Activo')),
    FOREIGN KEY (id_transportador) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla foto_vehiculo
DROP TABLE IF EXISTS foto_vehiculo CASCADE;
CREATE TABLE foto_vehiculo (
    id_foto_vehiculo SERIAL PRIMARY KEY,
    foto VARCHAR(255),
    id_transportador INT,
    FOREIGN KEY (id_transportador) REFERENCES transportador(id_transportador) ON DELETE CASCADE
);

-- Tabla administrador
DROP TABLE IF EXISTS administrador CASCADE;
CREATE TABLE administrador (
    id_administrador INT PRIMARY KEY,
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Pendiente', 'Activo')),
    FOREIGN KEY (id_administrador) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla producto
DROP TABLE IF EXISTS producto CASCADE;
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    latitud NUMERIC(9, 6),
    longitud NUMERIC(9, 6),
    cantidad INT,
    cantidad_minima_compra INT,
    imagen VARCHAR(255),
    precio_unidad NUMERIC(10, 2),
    descuento NUMERIC(5, 2),
    despublicado BOOLEAN DEFAULT FALSE,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    id_vendedor INT NULL,
    FOREIGN KEY (id_vendedor) REFERENCES vendedor(id_vendedor)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Tabla compra
DROP TABLE IF EXISTS compra CASCADE;
CREATE TABLE compra (
    id_compra SERIAL PRIMARY KEY,
    estado VARCHAR(20) CHECK (estado IN ('Pendiente', 'Asignada', 'En Proceso', 'Completada')),
    precio_transporte NUMERIC(10, 2) NULL,
    precio_producto NUMERIC(10, 2),
    cantidad INT,
    fecha_compra TIMESTAMP,
    fecha_entrega TIMESTAMP NULL,
    nombre_comprador_eliminado VARCHAR(100) NULL,
    nombre_vendedor_eliminado VARCHAR(100) NULL,
    nombre_transportador_eliminado VARCHAR(100) NULL,
    latitud_comprador NUMERIC(9, 6) NOT NULL,
    longitud_comprador NUMERIC(9, 6) NOT NULL,
    id_producto INT,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON UPDATE CASCADE,
    id_vendedor INT NULL,
    id_comprador INT NULL,
    FOREIGN KEY (id_comprador) REFERENCES comprador(id_comprador) ON DELETE SET NULL,
    id_transportador INT NULL,
    FOREIGN KEY (id_transportador) REFERENCES transportador(id_transportador) ON DELETE SET NULL
);

-- Tabla chat
DROP TABLE IF EXISTS chat CASCADE;
CREATE TABLE chat (
    id_chat SERIAL PRIMARY KEY,
    bloqueado_user1 BOOLEAN DEFAULT FALSE,
    bloqueado_user2 BOOLEAN DEFAULT FALSE,
    eliminado_user1 BOOLEAN DEFAULT FALSE,
    eliminado_user2 BOOLEAN DEFAULT FALSE,
    fecha_reciente TIMESTAMP,
    id_user1 INT NULL,
    id_user2 INT NULL,
    FOREIGN KEY (id_user1) REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY (id_user2) REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- Tabla mensaje
DROP TABLE IF EXISTS mensaje CASCADE;
CREATE TABLE mensaje (
    id_mensaje SERIAL PRIMARY KEY,
    editado BOOLEAN DEFAULT FALSE,
    tipo VARCHAR(10) CHECK (tipo IN ('texto', 'audio', 'imagen')),
    contenido VARCHAR(255),
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_chat INT,
    FOREIGN KEY (id_chat) REFERENCES chat(id_chat)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    id_user INT
);
