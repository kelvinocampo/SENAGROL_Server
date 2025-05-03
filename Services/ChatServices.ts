import ChatRepository from "../Repositories/ChatRepository";
import MessageRepository from "../Repositories/MessageRepository";

class ChatService {
    static async deleteChat(id_user: number, id_chat: number) {
        try {
            // 1. Verificar que el chat existe y el usuario tiene acceso
            const chat = await ChatRepository.getChatById(id_chat);
            if (!chat) {
                throw new Error("Chat no encontrado");
            }

            if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
                throw new Error("No tienes permiso para eliminar este chat");
            }

            // 3. Eliminar en base de datos
            const deleteChat = await ChatRepository.deleteChat(id_user, id_chat);

            return deleteChat;
        } catch (error: any) {
            throw error;
        }
    }

    static async blockChat(id_user: number, id_chat: number) {
        try {
            // 1. Verificar que el chat existe y el usuario tiene acceso
            const chat = await ChatRepository.getChatById(id_chat);
            if (!chat) {
                throw new Error("Chat no encontrado");
            }

            if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
                throw new Error("No tienes permiso para bloquear este chat");
            }

            // 3. Bloquear en base de datos
            const blockChat = await ChatRepository.blockChat(id_user, id_chat);

            return blockChat;
        } catch (error: any) {
            throw error;
        }
    }

    static async unblockChat(id_user: number, id_chat: number) {
        try {
            // 1. Verificar que el chat existe y el usuario tiene acceso
            const chat = await ChatRepository.getChatById(id_chat);
            if (!chat) {
                throw new Error("Chat no encontrado");
            }

            if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
                throw new Error("No tienes permiso para bloquear este chat");
            }

            // 3. Desbloquear en base de datos
            const unblockChat = await ChatRepository.unblockChat(id_user, id_chat);

            return unblockChat;
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

    static async getChat(id_user: number, id_chat: number) {
        try {
            // 1. Verificar que el chat existe y el usuario tiene acceso
            const chat = await ChatRepository.getChatById(id_chat);
            if (!chat) {
                throw new Error("Chat no encontrado");
            }

            if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
                throw new Error("No tienes permiso para acceder a este chat");
            }

            const getChats = await MessageRepository.getMessages(id_chat);

            return getChats;
        } catch (error: any) {
            throw error;
        }
    }
}

export default ChatService;