import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

// Creación del pool de conexiones
const db = mysql.createPool({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    ssl: {
        rejectUnauthorized: true,
    },
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0 // Número máximo de solicitudes en cola (0 significa sin límite)
});

// Verificación de la conexión
db.getConnection((err, conn) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Detener la aplicación si no se puede conectar
    } else {
        console.log('Conexión a la base de datos establecida correctamente');
        conn.release(); // Liberar la conexión de vuelta al pool
    }
});

// Exportar el pool de conexiones con soporte para Promesas
export default db.promise();