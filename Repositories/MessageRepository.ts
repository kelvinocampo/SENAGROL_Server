import db from "../Config/configDB";
import Message from "../Dto/Chat/MessageDTO";

class MessageRepository {
    /**
     * Crea un nuevo mensaje en la base de datos
     * @param message - Objeto MessageDTO con los datos del mensaje
     * @returns El mensaje creado
     * @throws Error si falla la creación del mensaje
     */
    static async createMessage(message: Message) {
        try {
            const query = `
                INSERT INTO mensaje 
                (editado, tipo, contenido, fecha_envio, id_chat, id_user)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const result = await db.execute(query, [
                message.editado,
                message.tipo,
                message.contenido,
                message.fecha_envio,
                message.id_chat,
                message.id_user
            ]);

            return { ...message };
        } catch (error) {
            console.error("Error en MessageRepository.createMessage:", error);
            throw error;
        }
    }

    /**
     * Actualiza el texto de un mensaje existente
     * @param message - Objeto MessageDTO con los nuevos datos
     * @param id_message - ID del mensaje a actualizar
     * @returns El mensaje actualizado
     * @throws Error si el mensaje no existe o no es de tipo texto
     */
    static async updateTextMessage(message: Message, id_message: number) {
        try {
            const query = `
                UPDATE mensaje
                SET editado = ?,
                    contenido = ?
                WHERE id_mensaje = ? AND tipo = "texto"
            `;

            const [result]: any = await db.execute(query, [
                message.editado,
                message.contenido,
                id_message
            ]);

            if (result.affectedRows === 0) {
                throw new Error('No se encontró el mensaje de texto para actualizar');
            }

            return { ...message };
        } catch (error) {
            console.error("Error en MessageRepository.updateTextMessage:", error);
            throw error;
        }
    }

    /**
     * Elimina un mensaje de la base de datos
     * @param id_user - ID del usuario que solicita la eliminación
     * @param id_message - ID del mensaje a eliminar
     * @param id_chat - ID del chat donde está el mensaje
     * @returns Objeto con el número de filas afectadas
     * @throws Error si el mensaje no existe o no pertenece al usuario/chat
     */
    static async deleteMessage(id_user: number, id_message: number, id_chat: number) {
        try {
            const query = `
                DELETE FROM mensaje
                WHERE id_user = ?
                AND id_mensaje = ?
                AND id_chat = ?
            `;

            const [result]: any = await db.execute(query, [
                id_user, 
                id_message, 
                id_chat
            ]);

            if (result.affectedRows === 0) {
                throw new Error('No se encontró el mensaje para eliminar');
            }

            return { affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error en MessageRepository.deleteMessage:", error);
            throw error;
        }
    }

    /**
     * Obtiene todos los mensajes de un chat específico
     * @param id_chat - ID del chat del que se quieren obtener los mensajes
     * @returns Array con todos los mensajes del chat
     * @throws Error si hay problemas al recuperar los mensajes
     */
    static async getMessages(id_chat: number) {
        try {
            const query = `SELECT * FROM mensaje WHERE id_chat = ?`;
            const [result]: any = await db.execute(query, [id_chat]);
            return result;
        } catch (error) {
            console.error("Error en MessageRepository.getMessages:", error);
            throw error;
        }
    }
}

export default MessageRepository;