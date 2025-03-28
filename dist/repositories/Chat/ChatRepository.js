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
class ChatRepository {
    static getChatById(chatID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield configDB_1.default.execute('SELECT * FROM chat WHERE id_chat = ?', [chatID]);
                return rows[0] || null;
            }
            catch (error) {
                console.error("Error en ChatRepository:", error);
                throw error;
            }
        });
    }
    static deleteChat(id_user, id_chat) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                UPDATE chat
                SET 
                    eliminado_user1 = CASE 
                        WHEN id_user1 = ? THEN true
                        ELSE eliminado_user1
                    END,
                    eliminado_user2 = CASE 
                        WHEN id_user2 = ? THEN true
                        ELSE eliminado_user2
                    END
                WHERE id_chat = ?;
        `;
                // El resultado es un array donde el primer elemento contiene la información de la operación
                const [result] = yield configDB_1.default.execute(query, [
                    id_user,
                    id_user,
                    id_chat
                ]);
                // Verificar si se actualizó alguna fila
                if (result.affectedRows === 0) {
                    throw new Error('No se encontró el chat para eliminar');
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
exports.default = ChatRepository;
