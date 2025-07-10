// Repositories/MessageRepository.ts
import db from "../Config/configDB";
import Message from "../Dto/Chat/MessageDTO";

class MessageRepository {
    static async createMessage(message: Message) {
        try {
            const query = `
                INSERT INTO mensaje 
                (contenido, tipo, fecha_envio, id_chat, id_user, editado) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const values = [
                message.contenido,
                message.tipo,
                message.fecha_envio,
                message.id_chat,
                message.id_user,
                message.editado ? 1 : 0
            ];

            const [result]: any = await db.execute(query, values);
            const id_mensaje = result.insertId;

            return {
                id_mensaje,
                contenido: message.contenido,
                tipo: message.tipo,
                fecha_envio: message.fecha_envio,
                id_chat: message.id_chat,
                id_user: message.id_user,
                editado: message.editado
            };

        } catch (error) {
            console.error("Error en MessageRepository.createMessage:", error);
            throw error;
        }
    }

    static async updateTextMessage(message: Message, id_message: number) {
        try {
            const query = `
                UPDATE mensaje
                SET editado = ?,
                    contenido = ?
                WHERE id_mensaje = ? AND tipo = "texto"
            `;

            const [result]: any = await db.execute(query, [
                message.editado ? 1 : 0,
                message.contenido,
                id_message
            ]);

            if (result.affectedRows === 0) {
                throw new Error('No se encontró el mensaje de texto para actualizar');
            }

            return { ...message, id_mensaje: id_message };
        } catch (error) {
            console.error("Error en MessageRepository.updateTextMessage:", error);
            throw error;
        }
    }

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

    static async getMessageById(id_message: number) {
        try {
            const query = `SELECT * FROM mensaje WHERE id_mensaje = ?`;
            const [result]: any = await db.execute(query, [id_message]);
            return result;
        } catch (error) {
            console.error("Error en MessageRepository.getMessages:", error);
            throw error;
        }
    }
}

export default MessageRepository;