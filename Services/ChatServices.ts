import ChatRepository from "../Repositories/ChatRepository";
import MessageRepository from "../Repositories/MessageRepository";
import UserRepository from "../Repositories/UserRepository";

class ChatService {
    /**
     * Deletes a chat if the user has permission
     * @param id_user User ID requesting the deletion
     * @param id_chat Chat ID to be deleted
     * @throws Error if chat not found or user lacks permission
     */
    static async deleteChat(id_user: number, id_chat: number) {
        const chat = await ChatRepository.getChatById(id_chat);
        if (!chat) throw new Error("Chat no encontrado");

        if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
            throw new Error("No tienes permiso para eliminar este chat");
        }

        return await ChatRepository.deleteChat(id_user, id_chat);
    }

    /**
     * Blocks a chat if the user has permission
     * @param id_user User ID requesting the block
     * @param id_chat Chat ID to be blocked
     * @throws Error if chat not found or user lacks permission
     */
    static async blockChat(id_user: number, id_chat: number) {
        const chat = await ChatRepository.getChatById(id_chat);
        if (!chat) throw new Error("Chat no encontrado");

        if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
            throw new Error("No tienes permiso para bloquear este chat");
        }

        return await ChatRepository.blockChat(id_user, id_chat);
    }

    /**
     * Unblocks a chat if the user has permission
     * @param id_user User ID requesting the unblock
     * @param id_chat Chat ID to be unblocked
     * @throws Error if chat not found or user lacks permission
     */
    static async unblockChat(id_user: number, id_chat: number) {
        const chat = await ChatRepository.getChatById(id_chat);
        if (!chat) throw new Error("Chat no encontrado");

        if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
            throw new Error("No tienes permiso para desbloquear este chat");
        }

        return await ChatRepository.unblockChat(id_user, id_chat);
    }

    /**
     * Gets all chats for a user
     * @param id_user User ID to retrieve chats for
     */
    static async getChats(id_user: number) {
        return await ChatRepository.getChats(id_user);
    }

    /**
     * Gets a specific chat and its messages if user has permission
     * @param id_user User ID requesting the chat
     * @param id_chat Chat ID to retrieve
     * @throws Error if chat not found or user lacks permission
     */
    static async getChat(id_user: number, id_chat: number) {
        const chat = await ChatRepository.getChatById(id_chat);
        if (!chat) throw new Error("Chat no encontrado");

        if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
            throw new Error("No tienes permiso para acceder a este chat");
        }

        return await MessageRepository.getMessages(id_chat);
    }

    /**
     * Initializes a chat between two users
     * @param id_user1 First user ID
     * @param id_user2 Second user ID
     * @throws Error if chat already exists or users are the same
     */
    static async initChat(id_user1: number, id_user2: number) {
        if (id_user1 === id_user2) {
            return { code: 400, status: false, message: "No puedes iniciar un chat contigo mismo" };
        }

        const existUser2 = await UserRepository.getByID(id_user2)
        if (!existUser2) {
            return { code: 404, status: false, message: "El usuario para iniciar conversacion no existe" };
        }

        const existingChat: any = await ChatRepository.getChatByUsers(id_user1, id_user2);
        if (existingChat) {
            await ChatRepository.unDeleteChat(id_user1, existingChat[0].id_chat);
            return { code: 200, status: true, message: "Chat ya existe", chat: existingChat[0].id_chat };
        }

        const result: any = await ChatRepository.initChat(id_user1, id_user2);
        if (result.insertId) {
            return { code: 200, status: true, message: "Chat creado", chat: result.insertId };
        } else {
            return { code: 500, status: false, message: "Error al crear el chat" };
        }
    }
}

export default ChatService;