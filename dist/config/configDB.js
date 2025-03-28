"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;
// Creación del pool de conexiones
const db = mysql2_1.default.createPool({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0 // Número máximo de solicitudes en cola (0 significa sin límite)
});
// Verificación de la conexión
db.getConnection((err, conn) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Detener la aplicación si no se puede conectar
    }
    else {
        console.log('Conexión a la base de datos establecida correctamente');
        conn.release(); // Liberar la conexión de vuelta al pool
    }
});
// Exportar el pool de conexiones con soporte para Promesas
exports.default = db.promise();
