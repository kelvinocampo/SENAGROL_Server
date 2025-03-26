import db from '../config/configDB';
import logIn from '../Dto/LoginDto';
import User from '../Dto/UserDto';
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
    
        return result[0].map((row: any) => row.role);
    }

    
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
        console.log("llegue");
        
        const sql = 'SELECT id_usuario, contraseña FROM usuario WHERE correo = ?';
        const values = [user.email];
        const result: any = await db.execute(sql, values);
    
        console.log("🔍 Resultado de la consulta:", result);
    
        if (!result[0] || result[0].length === 0) {
            return { logged: false, status: "Invalid username or password" };
        }
    
        const userRecord = result[0][0];
        if (!userRecord || !userRecord.contraseña) {
            return { logged: false, status: "Invalid username or password" };
        }
    
        const isPasswordValid = await bcrypt.compare(user.password, userRecord.contraseña);
        if (!isPasswordValid) {
            return { logged: false, status: "Invalid username or password" };
        }
    
        // Obtener roles
        const roleQuery = `
            SELECT 'vendedor' AS role FROM vendedor WHERE id_usuario = ?
            UNION
            SELECT 'administrador' AS role FROM administrador WHERE id_usuario = ?
            UNION
            SELECT 'transportador' AS role FROM transportador WHERE id_usuario = ?
            UNION
            SELECT 'comprador' AS role FROM comprador WHERE id_usuario = ?;
        `;
        const roleResult: any = await db.execute(roleQuery, [userRecord.id_usuario, userRecord.id_usuario, userRecord.id_usuario, userRecord.id_usuario]);
    
        let roles = roleResult[0].map((row: any) => row.role);
    
        return { 
            logged: true, 
            status: "Successful authentication", 
            data: userRecord,
            roles: roles.length ? roles : ["usuario"] 
        };
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
