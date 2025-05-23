import Message from "../Dto/Chat/MessageDTO";
import MessageRepository from "../Repositories/MessageRepository";
import ChatRepository from "../Repositories/ChatRepository";

class MessageService {
    /**
     * Sends a new message in a chat
     * @param message Message object containing chat and user information
     * @throws Error if chat not found or user lacks permission
     * @returns The created message
     */
    static async sendMessage(message: Message) {
        const chat = await ChatRepository.getChatById(message.id_chat);
        if (!chat) throw new Error("Chat no encontrado");
        
        if (chat.id_user1 !== message.id_user && chat.id_user2 !== message.id_user) {
            throw new Error("No tienes permiso para enviar mensajes en este chat");
        }

        await ChatRepository.UpdateDate(chat.id_chat);

        return await MessageRepository.createMessage(message);
    }

    /**
     * Updates the text of an existing message
     * @param message Updated message content
     * @param id_message ID of the message to update
     * @throws Error if chat not found, user lacks permission, or message doesn't exist
     * @returns The updated message
     */
    static async updateTextMessage(message: Message, id_message: number) {
        const chat = await ChatRepository.getChatById(message.id_chat);
        if (!chat) throw new Error("Chat no encontrado");
        
        if (chat.id_user1 !== message.id_user && chat.id_user2 !== message.id_user) {
            throw new Error("No tienes permiso para modificar mensajes en este chat");
        }

        return await MessageRepository.updateTextMessage(message, id_message);
    }

    /**
     * Deletes a message from a chat
     * @param id_user ID of user requesting deletion
     * @param id_message ID of message to delete
     * @param id_chat ID of chat containing the message
     * @throws Error if chat not found, user lacks permission, or message doesn't exist
     * @returns Result of deletion operation
     */
    static async deleteMessage(id_user: number, id_message: number, id_chat: number) {
        const chat = await ChatRepository.getChatById(id_chat);
        if (!chat) throw new Error("Chat no encontrado");
        
        if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
            throw new Error("No tienes permiso para eliminar mensajes en este chat");
        }

        return await MessageRepository.deleteMessage(id_user, id_message, id_chat);
    }
}

export default MessageService;