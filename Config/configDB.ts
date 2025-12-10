import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const { SUPABASE_DB_URL: supabaseUrl = "", SUPABASE_ANON_KEY: supabaseAnonKey = "" } = process.env;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error de configuración: Las variables SUPABASE_DB_URL o SUPABASE_ANON_KEY no están definidas en el archivo .env.');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verificar conexión al iniciar
(async () => {
  try {
    // Test simple de conexión
    const { error } = await supabase.from('usuario').select('id_usuario').limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 = tabla vacía, es OK
      console.error(`❌ Error de conexión a Supabase: ${error.message}`);
    } else {
      console.log('✅ Conexión a Supabase establecida correctamente.');
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`❌ Error con mensaje: ${err.message}`);
    } else {
      console.error(`❌ Error desconocido: ${String(err)}`);
    }
  }
})();

export default supabase;