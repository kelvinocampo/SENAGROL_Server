import ChatRepository from "../Repositories/ChatRepository";

class ChatService {
    static async deleteChat(id_user: number, id_chat: number) {
        try {
            // 1. Verificar que el chat existe y el usuario tiene acceso
            const chat = await ChatRepository.getChatById(id_chat);
            if (!chat) {
                throw new Error("Chat no encontrado");
            }

            if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
                throw new Error("No tienes permiso para enviar mensajes en este chat");
            }

            // 3. Eliminar en base de datos
            const deleteChat = await ChatRepository.deleteChat(id_user, id_chat);

            return deleteChat;
        } catch (error: any) {
            throw error;
        }
    }

    static async getChats(id_user: number) {
        try {
            const getChats = await ChatRepository.getChats(id_user);

            return getChats;
        } catch (error: any) {
            throw error;
        }
    }
}

export default ChatService;