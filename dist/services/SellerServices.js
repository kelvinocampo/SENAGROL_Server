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
class VendedorService {
    static solicitarVendedor(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [existingVendor] = yield configDB_1.default.execute("SELECT estado FROM vendedor WHERE id_vendedor = ?", [userId]);
            if (existingVendor.length > 0) {
                if (existingVendor[0].estado === 'Pendiente') {
                    return { success: false, message: "Ya tienes una solicitud pendiente." };
                }
                return { success: false, message: "Ya eres vendedor." };
            }
            // Insertar una nueva solicitud de vendedor
            yield configDB_1.default.execute("INSERT INTO vendedor (id_vendedor, estado) VALUES (?, 'Pendiente')", [userId]);
            return { success: true, message: "Solicitud enviada correctamente." };
        });
    }
    static aprobarSolicitud(adminId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si el usuario que aprueba es administrador
            const [adminCheck] = yield configDB_1.default.execute("SELECT * FROM administrador WHERE id_administrador = ?", [adminId]);
            if (adminCheck.length === 0) {
                return { success: false, message: "No tienes permisos para aprobar solicitudes." };
            }
            // Verificar si la solicitud existe y está pendiente
            const [solicitud] = yield configDB_1.default.execute("SELECT * FROM vendedor WHERE id_vendedor = ? AND estado = 'Pendiente'", [userId]);
            if (solicitud.length === 0) {
                return { success: false, message: "No hay una solicitud pendiente para este usuario." };
            }
            // Aprobar la solicitud de vendedor
            yield configDB_1.default.execute("UPDATE vendedor SET estado = 'Activo' WHERE id_vendedor = ?", [userId]);
            return { success: true, message: "Usuario aprobado como vendedor." };
        });
    }
    static rechazarSolicitud(adminId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [adminCheck] = yield configDB_1.default.execute("SELECT * FROM administrador WHERE id_administrador = ?", [adminId]);
            if (adminCheck.length === 0) {
                return { success: false, message: "No tienes permisos para rechazar solicitudes." };
            }
            // Verificar si la solicitud existe y está pendiente
            const [solicitud] = yield configDB_1.default.execute("SELECT * FROM vendedor WHERE id_vendedor = ? AND estado = 'Pendiente'", [userId]);
            if (solicitud.length === 0) {
                return { success: false, message: "No hay una solicitud pendiente para este usuario." };
            }
            // Rechazar la solicitud eliminando el registro de vendedor
            yield configDB_1.default.execute("DELETE FROM vendedor WHERE id_vendedor = ?", [userId]);
            return { success: true, message: "Solicitud de vendedor rechazada." };
        });
    }
}
exports.default = VendedorService;
