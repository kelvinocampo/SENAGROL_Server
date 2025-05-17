import db from '../Config/configDB';
import User from '../Dto/User/UserDto';

class UserRepository {

    static async getUserRoles(userId: number) {
        const sql = `
            SELECT 'vendedor' AS role FROM vendedor WHERE id_vendedor = ? AND estado = 'Activo'
            UNION
            SELECT 'administrador' AS role FROM administrador WHERE id_administrador = ? AND estado = 'Activo'
            UNION
            SELECT 'transportador' AS role FROM transportador WHERE id_transportador = ? AND estado = 'Activo'
            UNION
            SELECT 'comprador' AS role FROM comprador WHERE id_comprador = ? AND estado = 'Activo';
        `;
        const result: any = await db.execute(sql, [userId, userId, userId, userId]);

        const roles = (result[0].map((row: any) => row.role)).join(" ");
        return roles;
    }


    static async add(user: User) {
        const sql = `
            INSERT INTO usuario (nombre, nombre_usuario, correo, contraseña, telefono) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [user.name, user.username, user.email, user.password, user.phoneNumber];
        const [result]: any = await db.execute(sql, values);
        return result.insertId;
    }

    static async getByID(id: number) {
        const sql = 'SELECT * FROM usuario WHERE id_usuario = ?';
        const values = [id];
        const [result]: any = await db.execute(sql, values);
        return result;
    }

    static async getByEmail(email: string) {
        const sql = 'SELECT * FROM usuario WHERE correo = ?';
        const values = [email];
        const [result]: any = await db.execute(sql, values);
        return result;
    }

    static async getAll() {
        const sql = `
            SELECT 
                u.*,
                GROUP_CONCAT(DISTINCT 
                    CASE 
                        WHEN a.id_administrador IS NOT NULL AND a.estado = 'Activo' THEN 'Administrador'
                        WHEN c.id_comprador IS NOT NULL AND c.estado = 'Activo' THEN 'Comprador'
                        WHEN v.id_vendedor IS NOT NULL AND v.estado = 'Activo' THEN 'Vendedor'
                        WHEN t.id_transportador IS NOT NULL AND t.estado = 'Activo' THEN 'Transportador'
                    END
                SEPARATOR ', ') AS roles
            FROM usuario u
            LEFT JOIN administrador a ON u.id_usuario = a.id_administrador AND a.estado = 'Activo'
            LEFT JOIN comprador c ON u.id_usuario = c.id_comprador AND c.estado = 'Activo'
            LEFT JOIN vendedor v ON u.id_usuario = v.id_vendedor AND v.estado = 'Activo'
            LEFT JOIN transportador t ON u.id_usuario = t.id_transportador AND t.estado = 'Activo'
            WHERE (a.id_administrador IS NOT NULL)
            OR (c.id_comprador IS NOT NULL)
            OR (v.id_vendedor IS NOT NULL)
            OR (t.id_transportador IS NOT NULL)
            GROUP BY u.id_usuario;
        `;
        const [result] = await db.execute(sql)
        return result;
    }

    static async getAllAdmin() {
        const sql = `
            SELECT 
                u.*,
                IF(a.id_administrador IS NOT NULL, 
                    IF(a.estado = 'Activo', 'Activo', 'Inactivo'), 
                    'No disponible') AS rol_administrador,
                IF(c.id_comprador IS NOT NULL, 
                    IF(c.estado = 'Activo', 'Activo', 'Inactivo'), 
                    'No disponible') AS rol_comprador,
                IF(v.id_vendedor IS NOT NULL, 
                    IF(v.estado = 'Activo', 'Activo', 'Inactivo'), 
                    'No disponible') AS rol_vendedor,
                IF(t.id_transportador IS NOT NULL, 
                    IF(t.estado = 'Activo', 'Activo', 'Inactivo'), 
                    'No disponible') AS rol_transportador
            FROM usuario u
            LEFT JOIN administrador a ON u.id_usuario = a.id_administrador
            LEFT JOIN comprador c ON u.id_usuario = c.id_comprador
            LEFT JOIN vendedor v ON u.id_usuario = v.id_vendedor
            LEFT JOIN transportador t ON u.id_usuario = t.id_transportador
            WHERE (a.id_administrador IS NOT NULL)
               OR (c.id_comprador IS NOT NULL)
               OR (v.id_vendedor IS NOT NULL)
               OR (t.id_transportador IS NOT NULL)
            GROUP BY u.id_usuario;
        `;
        const [result] = await db.execute(sql);
        return result;
    }

    static async UpdatePassword(password: string, id_user: number,) {
        const sql = 'UPDATE usuario SET contraseña = ? WHERE id_usuario = ?';
        const values = [password, id_user];
        return await db.execute(sql, values);
    }

    static async findByEmailOrUsername(identifier: string) {
        const sql = `
            SELECT * FROM usuario 
            WHERE correo = ? OR nombre_usuario = ?
        `;
        const values = [identifier, identifier];

        const result: any = await db.execute(sql, values);

        if (result[0].length > 0) {
            return result[0][0];
        }

        return null;
    }

    static async update(id: number, updatedData: User) {

        const fields = [];
        const values = [];

        if (updatedData.name) {
            fields.push("nombre = ?");
            values.push(updatedData.name);
        }

        if (updatedData.username) {
            fields.push("nombre_usuario = ?");
            values.push(updatedData.username);
        }

        if (updatedData.email) {
            fields.push("correo = ?");
            values.push(updatedData.email);
        }

        if (updatedData.phoneNumber) {
            fields.push("telefono = ?");
            values.push(updatedData.phoneNumber);
        }

        if (fields.length === 0) {
            throw new Error("No se proporcionaron datos para actualizar");
        }

        const sql = `UPDATE usuario SET ${fields.join(", ")} WHERE id_usuario = ?`;
        values.push(id);

        const [result]: any = await db.execute(sql, values);

        if (result.affectedRows > 0) {
            return { success: true, status: "Perfil actualizado correctamente" };
        } else {
            return { success: false, status: "No se encontraron cambios o usuario no encontrado" };
        }
    }
}

export default UserRepository;
