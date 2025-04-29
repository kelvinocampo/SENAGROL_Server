import db from '../Config/configDB';
import TransporterDto from '../Dto/User/TransporterDto';

class TransporterRepository {
    static async register(transporter: TransporterDto, imageName: string) {
        // 0. Verificar si ya es transportador
        const checkSql = `SELECT * FROM transportador WHERE id_transportador = ?`;
        const [existingTransporter]: any = await db.execute(checkSql, [transporter.userId]);

        if (existingTransporter.length > 0) {
            throw new Error("El usuario ya está registrado como transportador");
        }

        // 1. Eliminar otros roles si existen
        const deleteAdminSql = `DELETE FROM administrador WHERE id_administrador = ?`;
        const deleteBuyerSql = `DELETE FROM comprador WHERE id_comprador = ?`;
        const deleteSellerSql = `DELETE FROM vendedor WHERE id_vendedor = ?`;

        await db.execute(deleteAdminSql, [transporter.userId]);
        await db.execute(deleteBuyerSql, [transporter.userId]);
        await db.execute(deleteSellerSql, [transporter.userId]);

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

        await db.execute(transporterSql, transporterValues);

        // 3. Insertar imagen del vehículo en la tabla foto_vehiculo
        const imageSql = `
            INSERT INTO foto_vehiculo (foto, id_transportador)
            VALUES (?, ?)
        `;
        const imageValues = [imageName, transporter.userId];

        await db.execute(imageSql, imageValues);
    }

    static async getTransporters() {
        const query = `
        SELECT u.* FROM transportador t
        JOIN usuario u ON u.id_usuario = t.id_usuario
        WHERE t.estado = 'Activo';
        `;
        const result = await db.execute(query);
        return result[0];
    }
}

export default TransporterRepository;
