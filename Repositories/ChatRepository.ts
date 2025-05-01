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
                SELECT * 
                CASE 
                    WHEN id_user1 = ? AND bloqueado_user1 = 1 THEN "Bloqueado" AS estado
                    WHEN id_user2 = ? AND bloqueado_user2 = 1 THEN "Bloqueado" AS estado
                END
                FROM chat 
                WHERE (id_user1 = ? OR id_user2 = ?) AND
                CASE 
                    WHEN id_user1 = ? THEN eliminado_user1 = 0 
                    WHEN id_user2 = ? THEN eliminado_user2 = 0
                END
                ORDER BY fecha_reciente DESC
                `
            const values = Array(6).fill(id_user);
            const [rows]: any = await db.execute(
                query,
                values
            );
            return rows[0] || null;
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
}

export default ChatRepository;