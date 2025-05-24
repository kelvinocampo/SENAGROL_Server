import Message from "../Dto/Chat/MessageDTO";
import MessageRepository from "../Repositories/MessageRepository";
import ChatRepository from "../Repositories/ChatRepository";
import { getIO } from "../Config/socket";

class MessageService {
    static io = getIO();
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

        if ((chat.id_user1 && chat.eliminado_user1) || (chat.id_user2 && chat.eliminado_user2)) {
            await ChatRepository.unDeleteChat(message.id_user, message.id_chat);
        }

        await ChatRepository.updateDate(chat.id_chat);

        const new_message: any = await MessageRepository.createMessage(message);

        this.io.to(`chat_${message.id_chat}`).emit("new_message", {
            tipo: message.tipo,
            contenido: message.contenido,
            fecha_envio: message.fecha_envio,
            usuario: message.id_user
        });

        return new_message
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

        const updatedMessage = await MessageRepository.updateTextMessage(message, id_message);

        this.io.to(`chat_${message.id_chat}`).emit("updated_message", {
            id_mensaje: id_message,
            tipo: message.tipo,
            contenido: message.contenido,
            fecha_envio: message.fecha_envio,
            usuario: message.id_user
        });

        return updatedMessage
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

        const deletedMessage = await MessageRepository.deleteMessage(id_user, id_message, id_chat);

        this.io.to(`chat_${id_chat}`).emit("deleted_message", {
            id_mensaje: id_message
        });

        return deletedMessage;
    }
}

export default MessageService;