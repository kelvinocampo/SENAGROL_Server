import db from '../config/configDB';
import TransporterDto from '../Dto/User/Transporter/TransporterDto';

class TransporterRepository {
    static async register(transporter: TransporterDto) {
        // 1. Verificar si el usuario ya es transportador
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

        await db.execute(transporterSql, transporterValues);
    }
}

export default TransporterRepository;

