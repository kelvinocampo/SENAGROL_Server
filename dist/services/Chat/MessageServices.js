"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageRepository_1 = __importDefault(require("../../repositories/Chat/MessageRepository"));
const ChatRepository_1 = __importDefault(require("../../repositories/Chat/ChatRepository"));
class MessageService {
    static sendTextMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Verificar que el chat existe y el usuario tiene acceso
                const chat = yield ChatRepository_1.default.getChatById(message.id_chat);
                if (!chat) {
                    throw new Error("Chat no encontrado");
                }
                if (chat.id_user1 !== message.id_user && chat.id_user2 !== message.id_user) {
                    throw new Error("No tienes permiso para enviar mensajes en este chat");
                }
                // 3. Guardar en base de datos
                const newMessage = yield MessageRepository_1.default.createTextMessage(message);
                return newMessage;
            }
            catch (error) {
                console.error("Error en MessageService:", error);
                throw error;
            }
        });
    }
    static updateTextMessage(message, id_message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Verificar que el chat existe y el usuario tiene acceso
                const chat = yield ChatRepository_1.default.getChatById(message.id_chat);
                if (!chat) {
                    throw new Error("Chat no encontrado");
                }
                if (chat.id_user1 !== message.id_user && chat.id_user2 !== message.id_user) {
                    throw new Error("No tienes permiso para enviar mensajes en este chat");
                }
                // 3. Editar en base de datos
                const updateMessage = yield MessageRepository_1.default.updateTextMessage(message, id_message);
                return updateMessage;
            }
            catch (error) {
                console.error("Error en MessageService:", error);
                throw error;
            }
        });
    }
    static deleteMessage(id_user, id_message, id_chat) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Verificar que el chat existe y el usuario tiene acceso
                const chat = yield ChatRepository_1.default.getChatById(id_chat);
                if (!chat) {
                    throw new Error("Chat no encontrado");
                }
                if (chat.id_user1 !== id_user && chat.id_user2 !== id_user) {
                    throw new Error("No tienes permiso para enviar mensajes en este chat");
                }
                // 3. Eliminar en base de datos
                const deleteMessage = yield MessageRepository_1.default.deleteMessage(id_user, id_message, id_chat);
                return deleteMessage;
            }
            catch (error) {
                console.error("Error en MessageService:", error);
                throw error;
            }
        });
    }
}
exports.default = MessageService;
