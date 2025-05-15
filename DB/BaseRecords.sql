USE senagrol;

-- === USUARIOS GENERALES ===
-- PASSWORD: Password123!
INSERT INTO usuario (nombre, nombre_usuario, correo, contraseña, cara, telefono) VALUES
("admin", "admin", "admin@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "cara.png", "1234567890"), -- id = 1
("Carlos Pérez", "carlosp", "carlos@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "cara1.png", "3110000001"), -- id = 2
("Luisa Gómez", "luisag", "luisa@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "cara2.png", "3110000002"), -- id = 3
("Pedro Ríos", "pedror", "pedro@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "cara3.png", "3110000003"), -- id = 4
("Sofía Díaz", "sofiad", "sofia@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "cara4.png", "3110000004"), -- id = 5
("Ana Vargas", "anav", "ana@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "cara5.png", "3110000005"), -- id = 6
("Ricardo Soto", "ricardos", "ricardo@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "cara6.png", "3110000006"), -- id = 7
("Mónica León", "monical", "monica@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "cara7.png", "3110000007"), -- id = 8
("Javier Torres", "javiert", "javier@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "cara8.png", "3110000008"); -- id = 9

-- === ROLES ===
INSERT INTO administrador (id_administrador) VALUES (1);
INSERT INTO comprador (id_comprador, estado) VALUES (2, 'Activo');
INSERT INTO vendedor (id_vendedor, estado) VALUES (3, 'Activo');
INSERT INTO transportador (id_transportador, licencia_conduccion, soat, tarjeta_propiedad_vehiculo, tipo_vehiculo, peso_vehiculo, estado)
VALUES (4, 'ABC123456', 'SOAT123456', 'TPV123456', 'Camión', 3500.50, 'Activo');
INSERT INTO comprador (id_comprador, estado) VALUES (6, 'Activo');
INSERT INTO vendedor (id_vendedor, estado) VALUES (7, 'Activo');
INSERT INTO transportador (id_transportador, licencia_conduccion, soat, tarjeta_propiedad_vehiculo, tipo_vehiculo, peso_vehiculo, estado)
VALUES (8, 'DEF789012', 'SOAT789012', 'TPV789012', 'Camioneta', 1800.75, 'Activo');

-- === FOTOS DEL VEHÍCULO ===
INSERT INTO foto_vehiculo (foto, id_transportador) VALUES
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 4),
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 4),
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 8);

-- === PRODUCTOS ===
INSERT INTO producto (nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, despublicado, id_vendedor) VALUES
("Tomates Orgánicos", "Tomates frescos y orgánicos cosechados localmente", 4.609710, -74.081750, 100, 5, "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg", 2.50, 0.10, 0, 3),
("Papas Criollas", "Papas criollas recién cosechadas", 4.609710, -74.081750, 200, 10, "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg", 1.80, 0.05, 0, 3),
("Café Arábica", "Café de altura con notas frutales", 4.550000, -75.680000, 50, 2, "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg", 5.00, 0.15, 0, 7),
("Aguacates Hass", "Aguacates maduros y cremosos", 4.500000, -75.700000, 120, 3, "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg", 3.20, 0.00, 0, 7),
("Mangos Tommy", "Mangos dulces y jugosos de la región", 4.450000, -75.720000, 80, 4, "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg", 2.00, 0.20, 1, 3); -- Despublicado

-- === COMPRAS ===
INSERT INTO compra (estado, precio_transporte, precio_producto, cantidad, fecha_compra, fecha_entrega, id_producto, id_vendedor, id_comprador, id_transportador)
VALUES
('Pendiente', 20.00, 50.00, 20, NOW(), NULL, 1, 3, 2, 4),
('Asignada', 15.00, 36.00, 20, NOW(), NOW(), 2, 3, 2, 4),
('En Proceso', 18.00, 45.00, 15, NOW(), DATE_ADD(NOW(), INTERVAL 2 DAY), 1, 7, 6, 8),
('Completada', 12.00, 64.00, 20, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 2, 7, 2, 4),
('Pendiente', NULL, 25.00, 10, NOW(), NULL, 3, 3, 6, NULL), -- Sin transportador asignado
('Asignada', 25.00, 80.00, 40, NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 1, 7, 2, 8);

-- === CHATS ===
INSERT INTO chat (bloqueado_user1, bloqueado_user2, eliminado_user1, eliminado_user2, fecha_reciente, id_user1, id_user2)
VALUES
(NULL, NULL, NULL, NULL, NOW(), 2, 3),
(NULL, NULL, NULL, NULL, NOW(), 2, 4),
(FALSE, TRUE, FALSE, FALSE, NOW(), 6, 7), -- user2 bloqueado
(TRUE, FALSE, FALSE, FALSE, NOW(), 2, 8), -- user1 bloqueado
(FALSE, FALSE, TRUE, FALSE, NOW(), 3, 6), -- user1 eliminado
(FALSE, FALSE, FALSE, TRUE, NOW(), 4, 7); -- user2 eliminado

-- === MENSAJES ===
INSERT INTO mensaje (editado, tipo, contenido, fecha_envio, id_chat, id_user) VALUES
(FALSE, 'texto', 'Hola, ¿aún tienes tomates?', NOW(), 1, 2),
(FALSE, 'texto', 'Sí, tengo disponibles.', NOW(), 1, 3),
(FALSE, 'texto', '¿Cuánto cuesta el envío?', NOW(), 2, 2),
(FALSE, 'texto', 'Serían $20 hasta Bogotá.', NOW(), 2, 4),
(FALSE, 'texto', '¿El café es recién tostado?', NOW(), 3, 7),
(FALSE, 'texto', 'Sí, de la última cosecha.', NOW(), 3, 6),
(TRUE, 'texto', 'Ya confirmé el pago del aguacate.', NOW(), 1, 6),
(FALSE, 'imagen', 'https://upload.wikimedia.org/wikipedia/commons/4/49/Mango_-_single.jpg', NOW(), 4, 7);