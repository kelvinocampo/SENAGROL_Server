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
const TransporterService_1 = __importDefault(require("../../services/TransporterService"));
const TransporterDto_1 = __importDefault(require("../../Dto/User/Transporter/TransporterDto"));
let register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id_usuario;
        if (!userId) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }
        const { license, soat, vehicleCard, vehicleType, vehicleWeight } = req.body;
        const newTransporter = new TransporterDto_1.default(userId, license, soat, vehicleCard, vehicleType, vehicleWeight);
        yield TransporterService_1.default.register(newTransporter);
        return res.status(201).json({ status: "Transporter registered successfully" });
    }
    catch (error) {
        if (error && error.code === "ER_DUP_ENTRY") {
            return res.status(500).json({ errorInfo: error.sqlMessage });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = register;
