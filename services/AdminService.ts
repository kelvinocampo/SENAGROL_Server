import db from "../config/configDB";

class Adminservice {
   static async ActiveSeller(adminId: number, userId: number) {
        // Verificar si el usuario que aprueba es administrador
        const [adminCheck]: any = await db.execute(
            "SELECT * FROM administrador WHERE id_administrador = ?", 
            [adminId]
        );

        if (adminCheck.length === 0) {
            return { success: false, message: "No tienes permisos para aprobar solicitudes." };
        }

        // Verificar si la solicitud existe y está pendiente
        const [solicitud]: any = await db.execute(
            "SELECT * FROM vendedor WHERE id_vendedor = ? AND estado = 'Pendiente'", 
            [userId]
        );

        if (solicitud.length === 0) {
            return { success: false, message: "No hay una solicitud pendiente para este usuario." };
        }

        // Aprobar la solicitud de vendedor
        await db.execute(
            "UPDATE vendedor SET estado = 'Activo' WHERE id_vendedor = ?", 
            [userId]
        );

        return { success: true, message: "Usuario aprobado como vendedor." };
    }

   
}

export default Adminservice;
