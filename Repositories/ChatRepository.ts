import { query } from "express";
import db from "../Config/configDB";

class ChatRepository {
    static async getChatById(chatID: number) {
        try {
            const [rows]: any = await db.execute(
                'SELECT * FROM chat WHERE id_chat = ?',
                [chatID]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error en ChatRepository:", error);
            throw error;
        }
    }

    static async getChats(id_user: number) {
        try {
            const query = `
                SELECT chat.* ,
                CASE 
                    WHEN id_user1 = ? AND bloqueado_user1 = 1 THEN "Bloqueado"
                    WHEN id_user2 = ? AND bloqueado_user2 = 1 THEN "Bloqueado"
                    ELSE "Activo"
                END AS estado
                FROM chat 
                WHERE
                (id_user1 = ? OR id_user2 = ?) AND
                (
                    (id_user1 = ? AND eliminado_user1 = 0) OR
                    (id_user2 = ? AND eliminado_user2 = 0)
                )
                ORDER BY fecha_reciente DESC
                `
            const values = Array(6).fill(id_user);
            const [rows]: any = await db.execute(
                query,
                values
            );
            return rows;
        } catch (error) {
            console.error("Error en ChatRepository:", error);
            throw error;
        }
    }

    static async deleteChat(id_user: number, id_chat: number) {
        try {
            const query = `
                UPDATE chat
                SET 
                    eliminado_user1 = CASE 
                        WHEN id_user1 = ? THEN true
                        ELSE eliminado_user1
                    END,
                    eliminado_user2 = CASE 
                        WHEN id_user2 = ? THEN true
                        ELSE eliminado_user2
                    END
                WHERE id_chat = ?;
        `;

            // El resultado es un array donde el primer elemento contiene la información de la operación
            const [result]: any = await db.execute(query, [
                id_user,
                id_user,
                id_chat
            ]);

            // Verificar si se actualizó alguna fila
            if (result.affectedRows === 0) {
                throw new Error('No se encontró el chat para eliminar');
            }

            return { affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error en MessageRepository:", error);
            throw error;
        }
    }

    static async blockChat(id_user: number, id_chat: number) {
        const query = `
            UPDATE chat
            SET 
                bloqueado_user1 = CASE 
                    WHEN id_user1 = ? THEN true
                    ELSE bloqueado_user1
                END,
                bloqueado_user2 = CASE 
                    WHEN id_user2 = ? THEN true
                    ELSE bloqueado_user2
                END
            WHERE id_chat = ?;
        `
        const values = [id_user, id_user, id_chat]
        const [result] = await db.execute(query, values)
        return result
    }

    static async unblockChat(id_user: number, id_chat: number) {
        const query = `
            UPDATE chat
            SET 
                bloqueado_user1 = CASE 
                    WHEN id_user1 = ? THEN false
                    ELSE bloqueado_user1
                END,
                bloqueado_user2 = CASE 
                    WHEN id_user2 = ? THEN false
                    ELSE bloqueado_user2
                END
            WHERE id_chat = ?;
        `
        const values = [id_user, id_user, id_chat]
        const [result] = await db.execute(query, values)
        return result
    }
}

export default ChatRepository;