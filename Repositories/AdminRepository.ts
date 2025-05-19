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
  static async CreateAdmin(userId: number) {
    try {
      // Desactivar otros roles si existen
      await db.execute(`UPDATE comprador SET estado = 'Pendiente' WHERE id_comprador = ?`, [userId]);
      await db.execute(`UPDATE transportador SET estado = 'Pendiente' WHERE id_transportador = ?`, [userId]);
      await db.execute(`UPDATE vendedor SET estado = 'Pendiente' WHERE id_vendedor = ?`, [userId]);

      // Verificar si ya existe una solicitud pendiente
      const [solicitud]: any = await db.execute(
        "INSERT INTO administrador (id_administrador, estado) VALUES (?, 'Activo') ON DUPLICATE KEY UPDATE estado = 'Activo'",
        [userId]
      );

      // Verificar si se modificó una fila
      if (solicitud.affectedRows > 0) {
        return { success: true, message: `El usuario ${userId} ahora es administrador.` };
      } else {
        return { success: false, message: `No se encontró el usuario.` };
      }
    } catch (error) {
      console.error("Error en AdminRepository.CreateAdmin:", error);
      throw error;
    }
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
    // Desactivar el rol especificado solo si está activo
    const query = `
      UPDATE ${role} 
      SET estado = "Pendiente" 
      WHERE id_${role} = ? AND estado = "Activo"
    `;
    const [result] = await db.execute(query, [id_deactivate_user]);

    // Verificar si el usuario tiene algún otro rol activo
    const [rolesActivos]: any = await db.execute(`
    SELECT 
      (SELECT estado FROM administrador WHERE id_administrador = ? AND estado = 'Activo') AS admin_activo,
      (SELECT estado FROM vendedor WHERE id_vendedor = ? AND estado = 'Activo') AS vendedor_activo,
      (SELECT estado FROM transportador WHERE id_transportador = ? AND estado = 'Activo') AS transportador_activo
    `,
      [id_deactivate_user, id_deactivate_user, id_deactivate_user]
    );

    const { admin_activo, vendedor_activo, transportador_activo } = rolesActivos[0];

    const tieneRolActivo = admin_activo || vendedor_activo || transportador_activo;

    // Si no tiene ningún otro rol activo, dejar el rol de comprador como activo
    if (!tieneRolActivo) {
      await db.execute(
        `UPDATE comprador SET estado = 'Activo' WHERE id_comprador = ?`,
        [id_deactivate_user]
      );
    }

    return result;
  }

}

export default AdminRepository;
