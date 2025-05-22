import db from "../Config/configDB";

class ChatRepository {
    /**
     * Obtiene un chat por su ID
     * @param chatID - ID del chat a buscar
     * @returns El objeto del chat encontrado o null si no existe
     * @throws Error si ocurre un problema en la consulta
     */
    static async getChatById(chatID: number) {
        try {
            const [rows]: any = await db.execute(
                'SELECT * FROM chat WHERE id_chat = ?',
                [chatID]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error en ChatRepository.getChatById:", error);
            throw error;
        }
    }

    /**
     * Obtiene todos los chats de un usuario, incluyendo su estado (Activo/Bloqueado)
     * @param id_user - ID del usuario cuyos chats se quieren obtener
     * @returns Array de chats con su información y estado
     * @throws Error si ocurre un problema en la consulta
     */
    static async getChats(id_user: number) {
        try {
            const query = `
                SELECT chat.*,
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
            `;
            const values = Array(6).fill(id_user);
            const [rows]: any = await db.execute(query, values);
            return rows;
        } catch (error) {
            console.error("Error en ChatRepository.getChats:", error);
            throw error;
        }
    }

    /**
     * Marca un chat como eliminado para un usuario específico (eliminación lógica)
     * @param id_user - ID del usuario que está eliminando el chat
     * @param id_chat - ID del chat a marcar como eliminado
     * @returns Objeto con el número de filas afectadas
     * @throws Error si no se encuentra el chat o hay un problema en la consulta
     */
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

            const [result]: any = await db.execute(query, [
                id_user,
                id_user,
                id_chat
            ]);

            if (result.affectedRows === 0) {
                throw new Error('No se encontró el chat para eliminar');
            }

            return { affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error en ChatRepository.deleteChat:", error);
            throw error;
        }
    }

    /**
     * Bloquea un chat para un usuario específico
     * @param id_user - ID del usuario que está bloqueando el chat
     * @param id_chat - ID del chat a bloquear
     * @returns Resultado de la operación
     */
    static async blockChat(id_user: number, id_chat: number) {
        try {
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
            `;
            const values = [id_user, id_user, id_chat];
            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            console.error("Error en ChatRepository.blockChat:", error);
            throw error;
        }
    }

    /**
     * Desbloquea un chat para un usuario específico
     * @param id_user - ID del usuario que está desbloqueando el chat
     * @param id_chat - ID del chat a desbloquear
     * @returns Resultado de la operación
     */
    static async unblockChat(id_user: number, id_chat: number) {
        try {
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
            `;
            const values = [id_user, id_user, id_chat];
            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            console.error("Error en ChatRepository.unblockChat:", error);
            throw error;
        }
    }
}

export default ChatRepository;