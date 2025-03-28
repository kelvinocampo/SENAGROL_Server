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
const configDB_1 = __importDefault(require("../../config/configDB"));
class MessageRepository {
    static createTextMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO mensaje 
                (editado, tipo, contenido, fecha_envio, id_chat, id_user)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
                const result = yield configDB_1.default.execute(query, [
                    message.editado,
                    message.tipo,
                    message.contenido,
                    message.fecha_envio,
                    message.id_chat,
                    message.id_user
                ]);
                return Object.assign({}, message);
            }
            catch (error) {
                console.error("Error en MessageRepository:", error);
                throw error;
            }
        });
    }
    static updateTextMessage(message, id_message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
            UPDATE message
            SET editado = ?,
                contenido = ?
            WHERE id_mensaje = ?
        `;
                // El resultado es un array donde el primer elemento contiene la información de la operación
                const [result] = yield configDB_1.default.execute(query, [
                    message.editado,
                    message.contenido,
                    id_message
                ]);
                // Verificar si se actualizó alguna fila
                if (result.affectedRows === 0) {
                    throw new Error('No se encontró el mensaje para actualizar');
                }
                return Object.assign({}, message);
            }
            catch (error) {
                console.error("Error en MessageRepository:", error);
                throw error;
            }
        });
    }
    static deleteMessage(id_user, id_message, id_chat) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
            DELETE FROM message
            WHERE id_user = ?
            AND id_mensaje = ?
            AND id_chat = ?
        `;
                // El resultado es un array donde el primer elemento contiene la información de la operación
                const [result] = yield configDB_1.default.execute(query, [
                    id_user, id_message, id_chat
                ]);
                // Verificar si se actualizó alguna fila
                if (result.affectedRows === 0) {
                    throw new Error('No se encontró el mensaje para eliminar');
                }
                return { affectedRows: result.affectedRows };
            }
            catch (error) {
                console.error("Error en MessageRepository:", error);
                throw error;
            }
        });
    }
}
exports.default = MessageRepository;
