import db from '../Config/configDB';
import logIn from '../Dto/User/LoginDto';
import User from '../Dto/User/UserDto';
import bcrypt from 'bcryptjs';

class UserRepository {

    static async getUserRoles(userId: number) {
        const sql = `
        SELECT 'vendedor' AS role FROM vendedor WHERE id_vendedor = ?
        UNION
        SELECT 'administrador' AS role FROM administrador WHERE id_administrador = ?
        UNION
        SELECT 'transportador' AS role FROM transportador WHERE id_transportador = ?
        UNION
        SELECT 'comprador' AS role FROM comprador WHERE id_comprador = ?;
    `;
        const result: any = await db.execute(sql, [userId, userId, userId, userId]);

        const roles = (result[0].map((row: any) => row.role)).join(" ");
        return roles;
    }


    static async add(user: User) {
        const sql = `INSERT INTO usuario (nombre, nombre_usuario, correo, contraseña, telefono) 
                     VALUES (?, ?, ?, ?, ?)`;
        const values = [user.name, user.username, user.email, user.password, user.phoneNumber];

        const [result]: any = await db.execute(sql, values);

        return result.insertId;
    }

    static async getByID(id: number) {
        const sql = 'SELECT * FROM usuario WHERE id_usuario = ?';
        const values = [id];
        return db.execute(sql, values);
    }

    static async UpdatePassword(password: string, id_user: number,) {
        const sql = 'UPDATE usuario SET contraseña = ? WHERE id_usuario = ?';
        const values = [password, id_user];
        return db.execute(sql, values);
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
