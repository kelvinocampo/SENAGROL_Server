import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
  max: 10, // Máximo de conexiones simultáneas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

// Verificar conexión
pool.connect()
  .then(client => {
    console.log('✅ Conexión a la base de datos Supabase (PostgreSQL) establecida correctamente');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos Supabase:', err.message);
    process.exit(1);
  });

export default pool;
