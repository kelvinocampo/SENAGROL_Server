USE senagrol;

-- === USUARIOS GENERALES (20 usuarios) ===
-- PASSWORD: Password123!
INSERT INTO usuario (nombre, nombre_usuario, correo, contraseña, telefono) VALUES
("admin", "admin", "admin@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "1234567890"), -- id = 1
("Carlos Pérez", "carlosp", "carlos@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000001"), -- id = 2
("Luisa Gómez", "luisag", "luisa@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000002"), -- id = 3
("Pedro Ríos", "pedror", "pedro@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000003"), -- id = 4
("Sofía Díaz", "sofiad", "sofia@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000004"), -- id = 5
("Ana Vargas", "anav", "ana@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000005"), -- id = 6
("Ricardo Soto", "ricardos", "ricardo@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000006"), -- id = 7
("Mónica León", "monical", "monica@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000007"), -- id = 8
("Javier Torres", "javiert", "javier@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000008"), -- id = 9
("María Rodríguez", "mariar", "maria@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000010"), -- id = 10
("Andrés López", "andresl", "andres@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000011"), -- id = 11
("Laura Martínez", "lauram", "laura@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000012"), -- id = 12
("Daniel Ramírez", "danielr", "daniel@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000013"), -- id = 13
("Patricia Castro", "patriciac", "patricia@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000014"), -- id = 14
("Fernando Herrera", "fernandoh", "fernando@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000015"), -- id = 15
("Isabel Medina", "isabelm", "isabel@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000016"), -- id = 16
("Roberto Jiménez", "robertoj", "roberto@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000017"), -- id = 17
("Carmen Ruiz", "carmenr", "carmen@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000018"), -- id = 18
("Alberto Mendoza", "albertom", "alberto@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000019"), -- id = 19
("Lucía Vargas", "luciav", "lucia@example.com", "$2a$10$6TA.Dzr1jQ5yKivurwPdoeyUVkZPYr8icHm0i5axfPK6q9SXFRIWG", "3110000020"); -- id = 20

-- === ROLES ===
INSERT INTO administrador (id_administrador) VALUES (1);
INSERT INTO comprador (id_comprador, estado) VALUES 
(1, 'Pendiente'), (2, 'Activo'), (3, 'Pendiente'), (4, 'Pendiente'), 
(5, 'Pendiente'), (6, 'Activo'), (7, 'Pendiente'), (8, 'Pendiente'), 
(9, 'Activo'), (10, 'Pendiente'), (11, 'Pendiente'), (12, 'Activo'),
(13, 'Pendiente'), (14, 'Pendiente'), (15, 'Pendiente'), (16, 'Pendiente'),
(17, 'Activo'), (18, 'Pendiente'), (19, 'Pendiente'), (20, 'Pendiente');

INSERT INTO vendedor (id_vendedor, estado) VALUES 
(3, 'Activo'), (5, 'Activo'), (7, 'Activo'), (10, 'Activo'), 
(12, 'Pendiente'), (14, 'Activo'), (16, 'Activo'), (18, 'Activo'),
(20, 'Activo');

INSERT INTO transportador (id_transportador, licencia_conduccion, soat, tarjeta_propiedad_vehiculo, tipo_vehiculo, peso_vehiculo, estado) VALUES 
(5, 'ABC123456', 'SOAT123456', 'TPV123456', 'Camión', 3500.50, 'Activo'),
(4, 'ABC123456', 'SOAT123456', 'TPV123456', 'Camión', 3500.50, 'Activo'),
(8, 'DEF789012', 'SOAT789012', 'TPV789012', 'Camioneta', 1800.75, 'Activo'),
(11, 'GHI345678', 'SOAT345678', 'TPV345678', 'Furgón', 2800.00, 'Activo'),
(13, 'JKL901234', 'SOAT901234', 'TPV901234', 'Camión', 4000.00, 'Activo'),
(15, 'MNO567890', 'SOAT567890', 'TPV567890', 'Camioneta', 2000.00, 'Activo'),
(19, 'PQR123789', 'SOAT123789', 'TPV123789', 'Furgón', 3000.00, 'Activo');

-- === FOTOS DEL VEHÍCULO ===
INSERT INTO foto_vehiculo (foto, id_transportador) VALUES
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 4),
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 4),
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 8),
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 5),
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 11),
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 13),
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 15),
("https://www.comparaonline.com.co/blog-statics/co/uploads/2023/04/tipos-de-vehiculos-ComparaOnline-10_2024.webp", 19);

-- === PRODUCTOS (30 productos) ===
INSERT INTO producto (nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, despublicado, id_vendedor) VALUES
("Tomates Orgánicos", "Tomates frescos y orgánicos cosechados localmente", 4.618, -75.685, 100, 5, "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg", 2.50, 0.10, 0, 3),
("Papas Criollas", "Papas criollas recién cosechadas", 4.619, -75.686, 200, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZTiOEK8Rs5IYoQprQ3HMEOXq2pOVnn1lOWw&s", 1.80, 0.05, 0, 3),
("Café Arábica", "Café de altura con notas frutales", 4.620, -75.684, 50, 2, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQULPanQPlFjdkW8TI4pYN1pfsYoMyul3CjAQ&s", 5.00, 0.15, 0, 7),
("Aguacates Hass", "Aguacates maduros y cremosos", 4.617, -75.687, 120, 3, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX0_ccc6k8mv3gneWRRgDn8F8xOzPE7bW_Pg&s", 3.20, 0.00, 0, 7),
("Mangos Tommy", "Mangos dulces y jugosos de la región", 4.616, -75.688, 80, 4, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBd18EewuZjqdz42sXxAI1GZ0qAxczaWT6zg&s", 2.00, 0.20, 1, 3),
("Lechuga Hidropónica", "Lechuga cultivada sin pesticidas", 4.615, -75.689, 60, 2, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg1JSN4VznOWm34BYuqVtvyvaeCD03HNT-cGqOcKib5l3Jv39mUi3rkMcHAvYJo8THYO0&usqp=CAU", 1.50, 0.00, 0, 10),
("Zanahorias Orgánicas", "Zanahorias dulces y crujientes", 4.614, -75.690, 90, 5, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-_pUnLplCnOte65UAzR72GP0kdAFtNM4_QQ&s", 1.20, 0.10, 0, 10),
("Plátanos Maduros", "Plátanos maduros de excelente calidad", 4.613, -75.691, 150, 10, "https://www.laylita.com/recetas/wp-content/uploads/Platanos-maduros-para-freir1.jpg", 0.80, 0.00, 0, 14),
("Fresas Frescas", "Fresas recién cosechadas", 4.612, -75.692, 40, 2, "https://s2.abcstatics.com/abc/sevilla/media/gurme/2023/04/14/s/fresas-kLhD--1248x698@abc.jpg", 3.50, 0.15, 0, 14),
("Cebolla Cabezona", "Cebolla blanca de gran tamaño", 4.611, -75.693, 120, 5, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrQ0vkb1-h5lUoNDLUqHGOY5LZHi_ZKYoHkQ&s", 1.00, 0.05, 0, 16),
("Ajo Fresco", "Ajo cultivado orgánicamente", 4.610, -75.694, 80, 1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRvU1SJ3AkWh3yGhwjfweQOMX58u7zZxmkZw&s", 2.50, 0.00, 0, 16),
("Pimentón Rojo", "Pimentón rojo dulce", 4.609, -75.695, 70, 3, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj__4iKTJhMppvk5_tOXh0yuOrR-bYaWGw4A&s", 1.80, 0.10, 0, 18),
("Brócoli Orgánico", "Brócoli fresco y orgánico", 4.608, -75.696, 50, 2, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4MC94IpXKbY3C7Lc2SqLVQLootfMB21XxyQ&s", 2.20, 0.00, 0, 18),
("Espinaca Fresca", "Espinaca recién cosechada", 4.607, -75.697, 60, 2, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBRDm1zNIFyyOwQFPdN1-klSqXyUaBrX1GrA&s", 1.50, 0.05, 0, 20),
("Papa Pastusa", "Papa pastusa de primera calidad", 4.606, -75.698, 180, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHEkwJnbfrlFSvu7C0tNPdGgRMMMiWdObvSQ&s", 1.20, 0.00, 0, 20),
("Yuca Fresca", "Yuca seleccionada", 4.605, -75.699, 100, 5, "https://static.diariofemenino.com/media/22740/consejos-conservar-yuca.jpg", 1.00, 0.10, 0, 3),
("Limones Tahití", "Limones jugosos", 4.604, -75.700, 90, 3, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx7ieexoh6YmALZAoD-uHeqZ0FwDQ0x-LH-g&s", 0.50, 0.00, 0, 7),
("Naranjas Valencia", "Naranjas dulces y jugosas", 4.603, -75.701, 120, 5, "https://solofruver.com/wp-content/uploads/2020/06/mandarina-oneco.jpg", 0.80, 0.15, 0, 10),
("Mandarina Oneco", "Mandarina sin semillas", 4.602, -75.702, 110, 5, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDxFvjYBvl14hPfDvuwkLn3A0h6gVauylA3A&s", 0.70, 0.00, 0, 14),
("Piña Golden", "Piña dulce y jugosa", 4.601, -75.703, 40, 1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpln3xypTGK3QnZ7jxKbG3AA_zPpFLMn7DCA&s", 3.00, 0.20, 0, 16),
("Sandía Sin Semilla", "Sandía dulce y fresca", 4.600, -75.704, 30, 1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJJiI4SDWfqIqiGmsDcI0cFiUGtYy3xXAurQ&s", 4.50, 0.10, 0, 18),
("Melón Cantaloupe", "Melón de pulpa anaranjada", 4.599, -75.705, 35, 1, "https://upload.wikimedia.org/wikipedia/commons/2/28/Cantaloupes.jpg", 3.80, 0.00, 0, 20),
("Uva Isabella", "Uva de excelente calidad", 4.598, -75.706, 25, 1, "https://exitocol.vtexassets.com/arquivos/ids/25416489/Uva-Isabella-X-500gr-1823_a.jpg?v=638657248270470000", 4.00, 0.15, 0, 3),
("Banano Orgánico", "Banano cultivado sin químicos", 4.597, -75.707, 150, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8VzWg_rqe_uRC-gIgN4cav6TFXEL792FEsw&s", 0.60, 0.05, 0, 7),
("Cilantro Fresco", "Cilantro recién cortado", 4.596, -75.708, 50, 1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqkgMxbb_7PX8paZmUJaNX34MHKUGF_cEv6w&s", 0.30, 0.00, 0, 10),
("Perejil", "Perejil fresco", 4.595, -75.709, 45, 1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj3c_b3BrExtZAZ4K80GuylmECtbDthAk60Q&s", 0.40, 0.00, 0, 14),
("Cebollín", "Cebollín fresco", 4.594, -75.710, 40, 1, "https://agrosemval.com/wp-content/uploads/2020/05/cebollin-ipc-01.jpg", 0.50, 0.00, 0, 16),
("Maíz Tierno", "Maíz dulce y tierno", 4.593, -75.711, 80, 5, "https://media.istockphoto.com/id/1336478021/es/foto/mazorcas-de-ma%C3%ADz-crudas-cosecha-de-ma%C3%ADz-dulce-mazorcas-de-ma%C3%ADz-con-hojas-y-c%C3%A1scara-sobre-mesa.jpg?s=612x612&w=0&k=20&c=gXEfWL0Qrzp-_mV_6c9fTLqjVRlhcKsIC_aaaK7Uuw8=", 0.70, 0.10, 0, 18),
("Arveja Fresca", "Arveja verde y dulce", 4.592, -75.712, 60, 2, "https://agrosemval.com/wp-content/uploads/2020/05/arveja-ipc-01.jpg", 1.20, 0.00, 0, 20),
("Habichuela", "Habichuela tierna", 4.591, -75.713, 70, 3, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoh_9lZSqc0T7VIsNhw9Q9_JNeWTTyiFh7mw&s", 1.50, 0.05, 0, 3);

-- === COMPRAS ===
INSERT INTO compra (estado, precio_transporte, precio_producto, cantidad, fecha_compra, fecha_entrega, id_producto, id_vendedor, id_comprador, id_transportador, latitud_comprador, longitud_comprador)
VALUES
('Pendiente', 20.00, 50.00, 20, NOW(), NULL, 1, 3, 2, 4, 4.618, -75.685),
('Asignada', 15.00, 36.00, 20, NOW(), NOW(), 2, 3, 2, 4, 4.619, -75.686),
('En Proceso', 18.00, 45.00, 15, NOW(), DATE_ADD(NOW(), INTERVAL 2 DAY), 1, 7, 6, 8, 4.620, -75.684),
('Completada', 12.00, 64.00, 20, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 2, 7, 2, 4, 4.617, -75.687),
('Pendiente', NULL, 25.00, 10, NOW(), NULL, 3, 3, 6, NULL, 4.616, -75.688),
('Asignada', 25.00, 80.00, 40, NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 1, 7, 2, 8, 4.615, -75.689),
('Pendiente', NULL, 30.00, 20, NOW(), NULL, 6, 10, 9, NULL, 4.614, -75.690),
('Asignada', 22.00, 54.00, 30, NOW(), DATE_ADD(NOW(), INTERVAL 4 DAY), 7, 10, 12, 11, 4.613, -75.691),
('Completada', 18.00, 72.00, 40, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY), 8, 14, 13, 13, 4.612, -75.692),
('En Proceso', 20.00, 45.00, 25, NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 9, 14, 17, 15, 4.611, -75.693),
('Pendiente', NULL, 60.00, 50, NOW(), NULL, 10, 16, 19, NULL, 4.610, -75.694),
('Asignada', 25.00, 84.00, 70, NOW(), DATE_ADD(NOW(), INTERVAL 6 DAY), 11, 16, 20, 19, 4.609, -75.695),
('Completada', 15.00, 36.00, 30, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), 12, 18, 2, 4, 4.608, -75.696),
('En Proceso', 30.00, 120.00, 100, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 13, 18, 6, 8, 4.607, -75.697),
('Pendiente', NULL, 24.00, 20, NOW(), NULL, 14, 20, 9, NULL, 4.606, -75.698),
('Asignada', 28.00, 90.00, 75, NOW(), DATE_ADD(NOW(), INTERVAL 8 DAY), 15, 20, 12, 11, 4.605, -75.699),
('Completada', 22.00, 66.00, 55, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY), 16, 3, 13, 13, 4.604, -75.700),
('En Proceso', 35.00, 140.00, 70, NOW(), DATE_ADD(NOW(), INTERVAL 9 DAY), 17, 7, 17, 15, 4.603, -75.701),
('Pendiente', NULL, 48.00, 60, NOW(), NULL, 18, 10, 19, NULL, 4.602, -75.702),
('Asignada', 40.00, 160.00, 200, NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 19, 14, 20, 19, 4.601, -75.703);

-- === CHATS ===
INSERT INTO chat (bloqueado_user1, bloqueado_user2, eliminado_user1, eliminado_user2, fecha_reciente, id_user1, id_user2)
VALUES
(NULL, NULL, NULL, NULL, NOW(), 2, 3),
(NULL, NULL, NULL, NULL, NOW(), 2, 4),
(FALSE, TRUE, FALSE, FALSE, NOW(), 6, 7),
(TRUE, FALSE, FALSE, FALSE, NOW(), 2, 8),
(FALSE, FALSE, TRUE, FALSE, NOW(), 3, 6),
(FALSE, FALSE, FALSE, TRUE, NOW(), 4, 7),
(NULL, NULL, NULL, NULL, NOW(), 10, 2),
(NULL, NULL, NULL, NULL, NOW(), 11, 12),
(NULL, NULL, NULL, NULL, NOW(), 13, 14),
(NULL, NULL, NULL, NULL, NOW(), 15, 16),
(NULL, NULL, NULL, NULL, NOW(), 17, 18),
(NULL, NULL, NULL, NULL, NOW(), 19, 20),
(NULL, NULL, NULL, NULL, NOW(), 2, 10),
(NULL, NULL, NULL, NULL, NOW(), 3, 12),
(NULL, NULL, NULL, NULL, NOW(), 4, 14),
(NULL, NULL, NULL, NULL, NOW(), 5, 16),
(NULL, NULL, NULL, NULL, NOW(), 6, 18),
(NULL, NULL, NULL, NULL, NOW(), 7, 20),
(NULL, NULL, NULL, NULL, NOW(), 8, 10),
(NULL, NULL, NULL, NULL, NOW(), 9, 12);

-- === MENSAJES (más de 10 mensajes) ===
INSERT INTO mensaje (editado, tipo, contenido, fecha_envio, id_chat, id_user) VALUES
(FALSE, 'texto', 'Hola, ¿aún tienes tomates?', NOW(), 1, 2),
(FALSE, 'texto', 'Sí, tengo disponibles.', NOW(), 1, 3),
(FALSE, 'texto', '¿Cuánto cuesta el envío?', NOW(), 2, 2),
(FALSE, 'texto', 'Serían $20 hasta Bogotá.', NOW(), 2, 4),
(FALSE, 'texto', '¿El café es recién tostado?', NOW(), 3, 7),
(FALSE, 'texto', 'Sí, de la última cosecha.', NOW(), 3, 6),
(TRUE, 'texto', 'Ya confirmé el pago del aguacate.', NOW(), 1, 6),
(FALSE, 'imagen', 'https://upload.wikimedia.org/wikipedia/commons/4/49/Mango_-_single.jpg', NOW(), 4, 7),
(FALSE, 'texto', 'Buenas tardes, ¿tienen lechuga disponible?', NOW(), 7, 2),
(FALSE, 'texto', 'Sí, tenemos suficiente stock', NOW(), 7, 10),
(FALSE, 'texto', '¿Puedes llevar mi pedido mañana?', NOW(), 8, 12),
(FALSE, 'texto', 'Claro, sin problema', NOW(), 8, 11),
(FALSE, 'texto', '¿Cuál es el precio por kilo de plátano?', NOW(), 9, 13),
(FALSE, 'texto', 'Está a $800 el kilo', NOW(), 9, 14),
(FALSE, 'texto', '¿Tienen fresas orgánicas?', NOW(), 10, 15),
(FALSE, 'texto', 'Sí, cultivadas sin pesticidas', NOW(), 10, 16),
(FALSE, 'texto', 'Necesito 20 kilos de papa', NOW(), 11, 17),
(FALSE, 'texto', 'Perfecto, las tengo disponibles', NOW(), 11, 18),
(FALSE, 'texto', '¿Hacen envíos a Medellín?', NOW(), 12, 19),
(FALSE, 'texto', 'Sí, con costo adicional', NOW(), 12, 20),
(FALSE, 'texto', 'El producto llegó en perfecto estado, gracias', NOW(), 13, 2),
(FALSE, 'texto', 'Nos alegra que todo haya salido bien', NOW(), 13, 10),
(FALSE, 'texto', '¿Cuándo estarán disponibles más mangos?', NOW(), 14, 3),
(FALSE, 'texto', 'La próxima semana tendremos nueva cosecha', NOW(), 14, 12),
(FALSE, 'texto', '¿Aceptan pagos con tarjeta?', NOW(), 15, 4),
(FALSE, 'texto', 'Sí, aceptamos todas las tarjetas', NOW(), 15, 14),
(FALSE, 'texto', 'El pedido llegó incompleto', NOW(), 16, 5),
(FALSE, 'texto', 'Lo revisaremos inmediatamente', NOW(), 16, 16),
(FALSE, 'texto', '¿Tienen certificación orgánica?', NOW(), 17, 6),
(FALSE, 'texto', 'Sí, todos nuestros productos son certificados', NOW(), 17, 18),
(FALSE, 'texto', 'Quisiera hacer un pedido grande', NOW(), 18, 7),
(FALSE, 'texto', 'Con gusto le atendemos, ¿cuánto necesita?', NOW(), 18, 20),
(FALSE, 'texto', '¿Tienen descuento por cantidad?', NOW(), 19, 8),
(FALSE, 'texto', 'Sí, a partir de 50 kilos hay descuento', NOW(), 19, 10),
(FALSE, 'texto', 'El producto no cumplió con mis expectativas', NOW(), 20, 9),
(FALSE, 'texto', 'Lamentamos eso, ¿en qué podemos mejorar?', NOW(), 20, 12);