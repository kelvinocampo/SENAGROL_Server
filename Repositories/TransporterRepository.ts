import db from '../Config/configDB';
import TransporterDto from '../Dto/User/TransporterDto';

class TransporterRepository {
    static async register(transporter: TransporterDto, imagesName: string[]) {
        // 0. Verificar si ya es transportador
        const checkSql = `SELECT * FROM transportador WHERE id_transportador = ? AND estado = `;
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
            u.cara,
            u.telefono,
            t.tipo_vehiculo,
            t.peso_vehiculo,
            GROUP_CONCAT(fv.foto SEPARATOR ',') AS fotos
        FROM transportador t
        JOIN usuario u ON u.id_usuario = t.id_transportador
        JOIN foto_vehiculo fv ON fv.id_transportador = t.id_transportador
        WHERE t.estado = 'Activo'
        GROUP BY u.id_usuario
        `;
        const result = await db.execute(query);
        return result[0];
    }
}

export default TransporterRepository;
