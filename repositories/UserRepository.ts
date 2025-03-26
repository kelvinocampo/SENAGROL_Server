import db from '../config/configDB';
import logIn from '../Dto/LoginDto';
import User from '../Dto/UserDto';
import bcrypt from 'bcryptjs';

class UserRepository {

    static async add(user: User) {
        const sql = `INSERT INTO usuario (nombre, nombre_usuario, correo, contraseña, cara, telefono) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            user.name, 
            user.username, 
            user.email, 
            user.password, 
            user.faceScan, 
            user.phoneNumber
        ];
        return db.execute(sql, values);
    }

    static async getByID(id: number) {
        const sql = 'SELECT * FROM usuario WHERE id_usuario = ?';
        const values = [id];
        return db.execute(sql, values);
    }
    
    static async logIn(user: logIn) {
        const sql = 'SELECT id_usuario, contraseña FROM usuario WHERE correo = ?';
        const values = [user.email];
        const result: any = await db.execute(sql, values);
        console.log("🔍 Resultado de la consulta:", result);

        if (result[0].length > 0) {
            const isPasswordValid = await bcrypt.compare(user.password, result[0][0].contraseña);

            if (isPasswordValid) {
                return { logged: true, status: "Successful authentication", data: result[0][0] }
            }
            return { logged: false, status: "Invalid username or password" };
        }
        return { logged: false, status: "Invalid username or password" };
    }
    static async findByEmailOrUsername(identifier: string) {
        const [rows]: any = await db.execute(
            "SELECT id_usuario, nombre, nombre_usuario, correo, contraseña FROM usuario WHERE correo = ? OR nombre_usuario = ? LIMIT 1",
            [identifier, identifier]
        );
        return rows.length ? rows[0] : null;
    }
}

export default UserRepository;
