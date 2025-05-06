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

        // Desactivar otros roles si existen
        const deactivateAdminSql = `UPDATE administrador SET estado = 'Pendiente' WHERE id_administrador = ?`;
        const deactivateBuyerSql = `UPDATE comprador SET estado = 'Pendiente' WHERE id_comprador = ?`;

        await db.execute(deactivateAdminSql, [userId]);
        await db.execute(deactivateBuyerSql, [userId]);

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

        // Desactivar otros roles si existen
        const deactivateAdminSql = `UPDATE administrador SET estado = 'Pendiente' WHERE id_administrador = ?`;
        const deactivateBuyerSql = `UPDATE comprador SET estado = 'Pendiente' WHERE id_comprador = ?`;

        await db.execute(deactivateAdminSql, [userId]);
        await db.execute(deactivateBuyerSql, [userId]);

        await db.execute(
            "UPDATE transportador SET estado = 'Activo' WHERE id_transportador = ?",
            [userId]
        );

        return { success: true, message: "Usuario aprobado como transportador." };
    }

    static async CreateAdmin(id_new_admin: number) {

        const [solicitud]: any = await db.execute(
            "SELECT * FROM administrador WHERE id_administrador = ? AND estado = 'Pendiente'",
            [id_new_admin]
        );

        if (solicitud.length === 0) {
            return { success: false, message: "No hay una solicitud pendiente para este usuario." };
        }

        // Desactivar otros roles si existen
        const deactivateBuyerSql = `UPDATE comprador SET estado = 'Pendiente' WHERE id_comprador = ?`;
        const deactivateTransporterSql = `UPDATE transportador SET estado = 'Pendiente' WHERE id_transportador = ?`;
        const deactivateSellerSql = `UPDATE vendedor SET estado = 'Pendiente' WHERE id_vendedor = ?`;

        await db.execute(deactivateBuyerSql, [id_new_admin]);
        await db.execute(deactivateTransporterSql, [id_new_admin]);
        await db.execute(deactivateSellerSql, [id_new_admin]);

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

    static async deactivateRole(id_deactivate_user: number, role: Omit<RequiredRoles, "comprador">) {
        const query = `
            UPDATE ${role} 
            SET estado = "Pendiente" 
            WHERE id_${role} = ?
            AND estado = "Activo"
        `;
        const values = [id_deactivate_user];

        const [result] = await db.execute(query, values);
        return result;
    }
}

export default AdminRepository;
