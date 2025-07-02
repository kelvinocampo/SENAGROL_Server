import db from '../Config/configDB';
import TransporterDto from '../Dto/User/TransporterDto';

class TransporterRepository {
    static async register(transporter: TransporterDto, imagesName: string[]) {
        // 0. Verificar si ya es transportador
        const checkSql = `SELECT * FROM transportador WHERE id_transportador = ?`;
        const [existingTransporter]: any = await db.execute(checkSql, [transporter.userId]);

        if (existingTransporter.length > 0) {
            throw new Error("El usuario ya está registrado como transportador");
        }

        // 2. Insertar en la tabla de transportadores
        const transporterSql = `
            INSERT INTO transportador (id_transportador, licencia_conduccion, soat, tarjeta_propiedad_vehiculo, tipo_vehiculo, peso_vehiculo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const transporterValues = [
            transporter.userId,
            transporter.license,
            transporter.soat,
            transporter.vehicleCard,
            transporter.vehicleType,
            transporter.vehicleWeight
        ];

        const [result] = await db.execute(transporterSql, transporterValues);

        imagesName.forEach(async (imageName) => {
            await this.registerImage(imageName, transporter.userId);
        });

        return result
    }

    static async update(dataTransporter: TransporterDto, imagesName: string[]) {
        const fields = [];
        const values = [];

        if (dataTransporter.license) {
            fields.push("licencia_conduccion = ?");
            values.push(dataTransporter.license);
        }
        if (dataTransporter.soat) {
            fields.push("soat = ?");
            values.push(dataTransporter.soat);
        }
        if (dataTransporter.vehicleCard) {
            fields.push("tarjeta_propiedad_vehiculo = ?");
            values.push(dataTransporter.vehicleCard);
        }
        if (dataTransporter.vehicleType) {
            fields.push("tipo_vehiculo = ?");
            values.push(dataTransporter.vehicleType);
        }
        if (dataTransporter.vehicleWeight) {
            fields.push("peso_vehiculo = ?");
            values.push(dataTransporter.vehicleWeight);
        }

        if (fields.length === 0) {
            throw new Error("No se proporcionaron datos para actualizar");
        }

        const sql = `UPDATE transportador SET ${fields.join(", ")} WHERE id_transportador = ?`;
        values.push(dataTransporter.userId);

        imagesName.forEach(async (imageName) => {
            await this.registerImage(imageName, dataTransporter.userId);
        });

        const [result]: any = await db.execute(sql, values);

        if (result.affectedRows > 0) {
            return { success: true, status: "Perfil actualizado correctamente" };
        } else {
            return { success: false, status: "No se encontraron cambios o usuario no encontrado" };
        }
    }

    static async registerImage(imageName: string, id_user: number) {
        // 3. Insertar imagen del vehículo en la tabla foto_vehiculo
        const imageSql = `
                INSERT INTO foto_vehiculo (foto, id_transportador)
                VALUES (?, ?)
            `;
        const imageValues = [imageName, id_user];

        return await db.execute(imageSql, imageValues);
    }

    static async getTransporters() {
        const query = `
        SELECT 
            u.id_usuario,
            u.nombre,
            u.nombre_usuario,
            u.correo,
            u.telefono,
            t.tipo_vehiculo,
            t.peso_vehiculo,
            GROUP_CONCAT(f.foto SEPARATOR ',') AS fotos_vehiculo
        FROM transportador t
        JOIN usuario u ON u.id_usuario = t.id_transportador
        LEFT JOIN foto_vehiculo f ON f.id_transportador = t.id_transportador
        WHERE t.estado = 'Activo'
        GROUP BY u.id_usuario;
        `;
        const result = await db.execute(query);
        return result[0];
    }

    static async getById(id_transporter: number) {
        const query = `
        SELECT
            t.licencia_conduccion,
            t.soat,
            t.tarjeta_propiedad_vehiculo,
            t.tipo_vehiculo,
            t.peso_vehiculo,
            GROUP_CONCAT(f.foto SEPARATOR ',') AS fotos_vehiculo
        FROM transportador t
        LEFT JOIN foto_vehiculo f ON f.id_transportador = t.id_transportador
        WHERE t.estado = 'Activo' AND t.id_transportador = ?
        GROUP BY t.id_transportador;
        `;
        const result = await db.execute(query, [id_transporter]);
        return result[0];
    }

    static async getByIdSAdmin(id_transporter: number) {
        const query = `
        SELECT
            t.licencia_conduccion,
            t.soat,
            t.tarjeta_propiedad_vehiculo,
            t.tipo_vehiculo,
            t.peso_vehiculo,
            t.estado,  -- Incluye el estado en los resultados
            GROUP_CONCAT(f.foto SEPARATOR ',') AS fotos_vehiculo
        FROM transportador t
        LEFT JOIN foto_vehiculo f ON f.id_transportador = t.id_transportador
        WHERE t.id_transportador = ?
        GROUP BY t.id_transportador;
    `;
        const result = await db.execute(query, [id_transporter]);
        return result[0]; // Asegúrate de que esto no es un array vacío
    }


}

export default TransporterRepository;
