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
class TransporterService {
    static register(transporter) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Verificar si el usuario ya es transportador
            const checkSql = `SELECT * FROM transportador WHERE id_transportador = ?`;
            const [existingTransporter] = yield configDB_1.default.execute(checkSql, [transporter.userId]);
            if (existingTransporter.length > 0) {
                throw new Error("El usuario ya está registrado como transportador");
            }
            // 2. Insertar en la tabla de transportadores
            const transporterSql = `
            INSERT INTO transportador (id_transportador, licencia_conduccion, soat, tarjeta_propiedad_vehiculo, tipo_vehiculo, peso_vehiculo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
            const transporterValues = [
                transporter.userId,
                transporter.license,
                transporter.soat,
                transporter.vehicleCard,
                transporter.vehicleType,
                transporter.vehicleWeight
            ];
            yield configDB_1.default.execute(transporterSql, transporterValues);
        });
    }
}
exports.default = TransporterService;
