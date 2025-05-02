import db from "../Config/configDB";
import { RequiredRoles } from "../Middleware/VerifyTokenData";

class AdminRepository {
    static async ActiveSeller(userId: number) {
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

    static async CreateAdmin(id_new_admin: number) {
        const query = `
            INSERT INTO administrador(id_administrador) VALUES (?)
        `;
        const values = [id_new_admin];

        const [result] = await db.execute(query, values);
        return result;
    }

    static async deleteUser(id_delete_user: number) {
        const query = `
            DELETE FROM usuario WHERE id_usuario = ?
        `;
        const values = [id_delete_user];

        const [result] = await db.execute(query, values);
        return result;
    }

    static async deactivateRole(id_deactivate_user: number, role: RequiredRoles) {
        const query = `
            DELETE FROM ${role} WHERE id_${role} = ?
        `;
        const values = [id_deactivate_user];

        const [result] = await db.execute(query, values);
        return result;
    }
}

export default AdminRepository;
