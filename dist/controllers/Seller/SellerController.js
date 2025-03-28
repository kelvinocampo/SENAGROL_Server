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
const SellerServices_1 = __importDefault(require("../../services/SellerServices"));
class VendedorController {
    static solicitarVendedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id_usuario;
                if (!userId) {
                    return res.status(401).json({ error: "Usuario no autenticado" });
                }
                const result = yield SellerServices_1.default.solicitarVendedor(userId);
                return res.status(result.success ? 201 : 400).json(result);
            }
            catch (error) {
                console.error("Error en solicitarVendedor:", error);
                return res.status(500).json({ error: "Error interno del servidor." });
            }
        });
    }
    static aprobarSolicitud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id_usuario;
                const { userId } = req.body;
                if (!adminId) {
                    return res.status(401).json({ error: "No autorizado" });
                }
                if (!userId) {
                    return res.status(400).json({ error: "ID de usuario requerido" });
                }
                const result = yield SellerServices_1.default.aprobarSolicitud(adminId, userId);
                return res.status(result.success ? 200 : 400).json(result);
            }
            catch (error) {
                console.error("Error en aprobarSolicitud:", error);
                return res.status(500).json({ error: "Error interno del servidor." });
            }
        });
    }
}
exports.default = VendedorController;
