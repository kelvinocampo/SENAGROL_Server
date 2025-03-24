import db from "../../config/configDB";
import Message from "../../Dto/Chat/MessageDTO";

class MessageRepository {
    static async createTextMessage(message: Message) {
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
}

export default MessageRepository;