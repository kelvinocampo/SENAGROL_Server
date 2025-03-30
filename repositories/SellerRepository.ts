import db from "../config/configDB";

class SellerRepository {
    static async requestSeller(userId: number) {
        const [existingSeller]: any = await db.execute(
            "SELECT estado FROM vendedor WHERE id_vendedor = ?", 
            [userId]
        );

        if (existingSeller.length > 0) {
            if (existingSeller[0].estado === 'Pendiente') {
                return { success: false, message: "Ya tienes una solicitud pendiente." };
            }
            return { success: false, message: "Ya eres vendedor." };
        }

        // Insertar una nueva solicitud de vendedor
        await db.execute(
            "INSERT INTO vendedor (id_vendedor, estado) VALUES (?, 'Pendiente')", 
            [userId]
        );

        return { success: true, message: "Solicitud enviada correctamente." };
    }

    static async aprobarSolicitud(adminId: number, userId: number) {
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

    static async rechazarSolicitud(adminId: number, userId: number) {

        const [adminCheck]: any = await db.execute(
            "SELECT * FROM administrador WHERE id_administrador = ?", 
            [adminId]
        );

        if (adminCheck.length === 0) {
            return { success: false, message: "No tienes permisos para rechazar solicitudes." };
        }

        // Verificar si la solicitud existe y está pendiente
        const [solicitud]: any = await db.execute(
            "SELECT * FROM vendedor WHERE id_vendedor = ? AND estado = 'Pendiente'", 
            [userId]
        );

        if (solicitud.length === 0) {
            return { success: false, message: "No hay una solicitud pendiente para este usuario." };
        }

        // Rechazar la solicitud eliminando el registro de vendedor
        await db.execute(
            "DELETE FROM vendedor WHERE id_vendedor = ?", 
            [userId]
        );

        return { success: true, message: "Solicitud de vendedor rechazada." };
    }
}

export default SellerRepository;