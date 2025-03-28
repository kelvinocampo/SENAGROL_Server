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
const configDB_1 = __importDefault(require("../config/configDB"));
class UserRepository {
    static getUserRoles(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
        SELECT 'vendedor' AS role FROM vendedor WHERE id_vendedor = ?
        UNION
        SELECT 'administrador' AS role FROM administrador WHERE id_administrador = ?
        UNION
        SELECT 'transportador' AS role FROM transportador WHERE id_transportador = ?
        UNION
        SELECT 'comprador' AS role FROM comprador WHERE id_comprador = ?;
    `;
            const result = yield configDB_1.default.execute(sql, [userId, userId, userId, userId]);
            const roles = (result[0].map((row) => row.role)).join(" ");
            return roles;
        });
    }
    static add(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `INSERT INTO usuario (nombre, nombre_usuario, correo, contraseña, cara, telefono) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
            const values = [user.name, user.username, user.email, user.password, user.faceScan, user.phoneNumber];
            const [result] = yield configDB_1.default.execute(sql, values);
            return result.insertId;
        });
    }
    static getByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = 'SELECT * FROM usuario WHERE id_usuario = ?';
            const values = [id];
            return configDB_1.default.execute(sql, values);
        });
    }
    static findByEmailOrUsername(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
            SELECT * FROM usuario 
            WHERE correo = ? OR nombre_usuario = ?
        `;
            const values = [identifier, identifier];
            const result = yield configDB_1.default.execute(sql, values);
            if (result[0].length > 0) {
                return result[0][0];
            }
            return null;
        });
    }
}
exports.default = UserRepository;
