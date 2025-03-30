import db from "../config/configDB";

class AdminRepository {
    static async ActiveSeller( userId: number) {
        const [solicitud]: any = await db.execute(
            "SELECT * FROM vendedor WHERE id_vendedor = ? AND estado = 'Pendiente'",
            [userId]
        );

        if (solicitud.length === 0) {
            return { success: false, message: "No hay una solicitud pendiente para este usuario." };
        }

        await db.execute(
            "UPDATE vendedor SET estado = 'Activo' WHERE id_vendedor = ?",
            [userId]
        );

        return { success: true, message: "Usuario aprobado como vendedor." };
    }
    static async ActiveTransporter(userId: number) {
        const [solicitud]: any = await db.execute(
            "SELECT * FROM transportador WHERE id_transportador = ? AND estado = 'Pendiente'",
            [userId]
        );

        if (solicitud.length === 0) {
            return { success: false, message: "No hay una solicitud pendiente para este usuario." };
        }

        await db.execute(
            "UPDATE transportador SET estado = 'Activo' WHERE id_transportador = ?",
            [userId]
        );

        return { success: true, message: "Usuario aprobado como transportador." };
    }


}

export default AdminRepository;
