import Message from "../Dto/Chat/MessageDTO";
import MessageRepository from "../Repositories/MessageRepository";
import ChatRepository from "../Repositories/ChatRepository";

class MessageService {
    static async sendTextMessage(message: Message) {
        try {
            // 1. Verificar que el chat existe y el usuario tiene acceso
            const chat = await ChatRepository.getChatById(message.id_chat);
            if (!chat) {
                throw new Error("Chat no encontrado");
            }

            if (chat.id_user1 !== message.id_user && chat.id_user2 !== message.id_user) {
                throw new Error("No tienes permiso para enviar mensajes en este chat");
            }

            // 3. Guardar en base de datos
            const newMessage = await MessageRepository.createTextMessage(message);

            return newMessage;
        } catch (error: any) {
            console.error("Error en MessageService:", error);
            throw error;
        }
    }

    static async updateTextMessage(message: Message, id_message: number) {
        try {
            // 1. Verificar que el chat existe y el usuario tiene acceso
            const chat = await ChatRepository.getChatById(message.id_chat);
            if (!chat) {
                throw new Error("Chat no encontrado");
            }

            if (chat.id_user1 !== message.id_user && chat.id_user2 !== message.id_user) {
                throw new Error("No tienes permiso para enviar mensajes en este chat");
            }

            // 3. Editar en base de datos
            const updateMessage = await MessageRepository.updateTextMessage(message, id_message);

            return updateMessage;
        } catch (error: any) {
            console.error("Error en MessageService:", error);
            throw error;
        }
    }

    static async deleteMessage(id_user: number, id_message: number, id_chat: number) {
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
            const deleteMessage = await MessageRepository.deleteMessage(id_user, id_message, id_chat);

            return deleteMessage;
        } catch (error: any) {
            console.error("Error en MessageService:", error);
            throw error;
        }
    }
}

export default MessageService;