import db from "../../config/configDB";

class ChatRepository {
    static async getChatById(chatID: number) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM chat WHERE id_chat = ?',
                [chatID]
            );
            return rows || null;
        } catch (error) {
            console.error("Error en ChatRepository:", error);
            throw error;
        }
    }

    static async updateChatTimestamp(chatID: number) {
        try {
            await db.execute(
                'UPDATE chat SET fecha_reciente = NOW() WHERE id_chat = ?',
                [chatID]
            );
        } catch (error) {
            console.error("Error actualizando timestamp del chat:", error);
            throw error;
        }
    }
}

export default ChatRepository;