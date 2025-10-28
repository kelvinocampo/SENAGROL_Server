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
            const [rows]: any = await db.query(
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
                SELECT 
                    c.id_chat,
                    c.bloqueado_user1,
                    c.bloqueado_user2,
                    c.eliminado_user1,
                    c.eliminado_user2,
                    c.fecha_reciente,
                    u1.nombre AS nombre_user1,
                    (
                        SELECT GROUP_CONCAT(role, ' ')
                        FROM (
                            SELECT 'vendedor' AS role FROM vendedor WHERE id_vendedor = c.id_user1 AND estado = 'Activo'
                            UNION ALL
                            SELECT 'administrador' AS role FROM administrador WHERE id_administrador = c.id_user1 AND estado = 'Activo'
                            UNION ALL
                            SELECT 'transportador' AS role FROM transportador WHERE id_transportador = c.id_user1 AND estado = 'Activo'
                            UNION ALL
                            SELECT 'comprador' AS role FROM comprador WHERE id_comprador = c.id_user1 AND estado = 'Activo'
                        ) AS roles_user1
                    ) AS rol_user1,
                    u2.nombre AS nombre_user2,
                    c.id_user2,
                    c.id_user1,
                    (
                        SELECT GROUP_CONCAT(role, ' ')
                        FROM (
                            SELECT 'vendedor' AS role FROM vendedor WHERE id_vendedor = c.id_user2 AND estado = 'Activo'
                            UNION ALL
                            SELECT 'administrador' AS role FROM administrador WHERE id_administrador = c.id_user2 AND estado = 'Activo'
                            UNION ALL
                            SELECT 'transportador' AS role FROM transportador WHERE id_transportador = c.id_user2 AND estado = 'Activo'
                            UNION ALL
                            SELECT 'comprador' AS role FROM comprador WHERE id_comprador = c.id_user2 AND estado = 'Activo'
                        ) AS roles_user2
                    ) AS rol_user2,
                    CASE 
                        WHEN (c.id_user1 = ? AND COALESCE(c.bloqueado_user1, FALSE) = TRUE) THEN 'Bloqueado'
                        WHEN (c.id_user2 = ? AND COALESCE(c.bloqueado_user2, FALSE) = TRUE) THEN 'Bloqueado'
                        ELSE 'Activo'
                    END AS estado
                FROM 
                    chat c
                JOIN 
                    usuario u1 ON c.id_user1 = u1.id_usuario
                JOIN 
                    usuario u2 ON c.id_user2 = u2.id_usuario
                WHERE 
                    (c.id_user1 = ? OR c.id_user2 = ?)
                    AND (
                        (c.id_user1 = ? AND COALESCE(c.eliminado_user1, FALSE) = FALSE) OR 
                        (c.id_user2 = ? AND COALESCE(c.eliminado_user2, FALSE) = FALSE)
                    )
                ORDER BY 
                    c.fecha_reciente DESC;
        `;

            const values = [id_user, id_user, id_user, id_user, id_user, id_user];
            const {rows} = await db.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error en ChatRepository.getChats:", error);
            throw new Error("No se pudieron obtener los chats");
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

            const [result]: any = await db.query(query, [
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
            const result = await db.query(query, values);
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
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            console.error("Error en ChatRepository.unblockChat:", error);
            throw error;
        }
    }

    /**
     * Inicializa un nuevo chat entre dos usuarios
     * @param id_user1 - ID del primer usuario
     * @param id_user2 - ID del segundo usuario
     * @returns Resultado de la operación
     */
    static async initChat(id_user1: number, id_user2: number) {
        try {
            const query = `
                INSERT INTO chat (id_user1, id_user2, fecha_reciente)
                VALUES (?, ?, ?);
            `;
            const values = [id_user1, id_user2, new Date()];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            console.error("Error en ChatRepository.initChat:", error);
            throw error;
        }
    }

    /**
     * Retrieves a chat between two users
     * @param id_user1 - ID of the first user
     * @param id_user2 - ID of the second user
     * @returns The chat object if found, otherwise null
     */
    static async getChatByUsers(id_user1: number, id_user2: number) {
        const query = `
            SELECT * FROM chat 
            WHERE (id_user1 = ? AND id_user2 = ?) OR (id_user1 = ? AND id_user2 = ?)
        `;
        const result = await db.query(query, [id_user1, id_user2, id_user2, id_user1]);
        return result;
    }

    /**
     * Updates the recent date of a chat
     * @param id_chat - ID of the chat to update
     * @returns Result of the update operation
     */
    static async updateDate(id_chat: number) {
        const query = `
            UPDATE chat
            SET fecha_reciente = ?
            WHERE id_chat = ?;
        `;
        const values = [new Date(), id_chat];
        const result = await db.query(query, values);
        return result;
    }

    /**
     * Restores a deleted chat for a user
     * @param id_user - ID of the user restoring the chat
     * @param id_chat - ID of the chat to restore
     * @returns Result of the restore operation
     */
    static async unDeleteChat(id_user: number, id_chat: number) {
        try {
            const query = `
                UPDATE chat
                SET 
                    eliminado_user1 = CASE 
                        WHEN id_user1 = ? THEN false
                        ELSE eliminado_user1
                    END,
                    eliminado_user2 = CASE 
                        WHEN id_user2 = ? THEN false
                        ELSE eliminado_user2
                    END
                WHERE id_chat = ?;
            `;
            const values = [id_user, id_user, id_chat];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            console.error("Error en ChatRepository.unDeleteChat:", error);
            throw error;
        }
    }
}

export default ChatRepository;