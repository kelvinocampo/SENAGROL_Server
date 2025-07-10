// Services/MessageService.ts
import Message from "../Dto/Chat/MessageDTO";
import MessageRepository from "../Repositories/MessageRepository";
import ChatRepository from "../Repositories/ChatRepository";
import { getIO } from "../Config/socket";
import { deleteFromAzure } from "../Helpers/DeleteFile";

class MessageService {
    static async sendMessage(message: Message) {
        try {
            const chat = await ChatRepository.getChatById(message.id_chat);
            if (!chat) {
                return {
                    code: 404,
                    success: false,
                    message: "Chat no encontrado"
                };
            }

            if (chat.id_user1 !== message.id_user && chat.id_user2 !== message.id_user) {
                return {
                    code: 403,
                    success: false,
                    message: "No tienes permiso para enviar mensajes en este chat"
                };
            }

            const new_message = await MessageRepository.createMessage(message);

            if (!new_message || !new_message.id_mensaje) {
                return {
                    code: 500,
                    success: false,
                    message: "Error al crear el mensaje: ID no generado"
                };
            }

            const io = getIO();
            io.to(`chat_${message.id_chat}`).emit("new_message", {
                id_mensaje: new_message.id_mensaje,
                tipo: new_message.tipo,
                contenido: new_message.contenido,
                fecha_envio: new_message.fecha_envio,
                id_user: new_message.id_user
            });

            return {
                code: 200,
                success: true,
                message: "Mensaje enviado correctamente",
                data: new_message
            };
        } catch (error: any) {
            return {
                code: 500,
                success: false,
                message: error.message || "Error interno del servidor"
            };
        }
    }

    static async updateTextMessage(message: Message, id_message: number) {
        const chat = await ChatRepository.getChatById(message.id_chat);
        if (!chat) throw new Error("Chat no encontrado");

        if (chat.id_user1 !== message.id_user && chat.id_user2 !== message.id_user) {
            throw new Error("No tienes permiso para modificar mensajes en este chat");
        }

        const updatedMessage = await MessageRepository.updateTextMessage(message, id_message);

        const io = getIO();
        io.to(`chat_${message.id_chat}`).emit("updated_message", {
            id_mensaje: id_message,
            tipo: message.tipo,
            contenido: message.contenido,
            fecha_envio: message.fecha_envio,
            usuario: message.id_user
        });

        return updatedMessage;
    }

    static async deleteMessage(id_user: number, id_message: number, id_chat: number) {
        const chat = await ChatRepository.getChatById(id_chat);
        if (!chat) throw new Error("Chat no encontrado");

        if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
            throw new Error("No tienes permiso para eliminar mensajes en este chat");
        }
        const deletedMessage = await MessageRepository.deleteMessage(id_user, id_message, id_chat);

        const message = await MessageRepository.getMessageById(id_message)
        console.log(message.tipo, message.contenido);
        if (message.tipo != "texto") {
            await deleteFromAzure(message.contenido, "mensajes")
        }

        const io = getIO();
        io.to(`chat_${id_chat}`).emit("deleted_message", {
            id_mensaje: id_message
        });

        return deletedMessage;
    }
}

export default MessageService;