import db from "../config/configDB";

class Adminservice {
   static async ActiveSeller(adminId: number, userId: number) {
        const [adminCheck]: any = await db.execute(
            "SELECT * FROM administrador WHERE id_administrador = ?", 
            [adminId]
        );

        if (adminCheck.length === 0) {
            return { success: false, message: "No tienes permisos para aprobar solicitudes." };
        }

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
    static async ActiveTransporter(adminId: number, userId: number) {
        const [adminCheck]: any = await db.execute(
            "SELECT * FROM administrador WHERE id_administrador = ?", 
            [adminId]
        );

        if (adminCheck.length === 0) {
            return { success: false, message: "No tienes permisos para aprobar solicitudes." };
        }

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

export default Adminservice;
