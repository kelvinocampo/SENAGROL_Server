import db from "../Config/configDB";
import Message from "../Dto/Chat/MessageDTO";

class MessageRepository {
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
            console.error("Error en MessageRepository:", error);
            throw error;
        }
    }

    static async updateTextMessage(message: Message, id_message: number) {
        try {
            const query = `
            UPDATE message
            SET editado = ?,
                contenido = ?
            WHERE id_mensaje = ? AND tipo = "texto"
        `;

            // El resultado es un array donde el primer elemento contiene la información de la operación
            const [result]: any = await db.execute(query, [
                message.editado,
                message.contenido,
                id_message
            ]);

            // Verificar si se actualizó alguna fila
            if (result.affectedRows === 0) {
                throw new Error('No se encontró el mensaje para actualizar');
            }

            return { ...message };
        } catch (error) {
            console.error("Error en MessageRepository:", error);
            throw error;
        }
    }

    static async deleteMessage(id_user: number, id_message: number, id_chat: number) {
        try {
            const query = `
            DELETE FROM message
            WHERE id_user = ?
            AND id_mensaje = ?
            AND id_chat = ?
        `;

            // El resultado es un array donde el primer elemento contiene la información de la operación
            const [result]: any = await db.execute(query, [
                id_user, id_message, id_chat
            ]);

            // Verificar si se actualizó alguna fila
            if (result.affectedRows === 0) {
                throw new Error('No se encontró el mensaje para eliminar');
            }

            return { affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error en MessageRepository:", error);
            throw error;
        }
    }

    static async getMessages(id_chat: number) {
        try {
            const query = `SELECT * FROM message WHERE id_chat = ?`;

            // El resultado es un array donde el primer elemento contiene la información de la operación
            const [result]: any = await db.execute(query, [id_chat]);

            return result;
        } catch (error) {
            console.error("Error en MessageRepository:", error);
            throw error;
        }
    }
}

export default MessageRepository;