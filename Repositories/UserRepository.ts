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


}

export default UserRepository;
