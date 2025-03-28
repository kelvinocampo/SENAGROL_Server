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
const UserServices_1 = __importDefault(require("../../services/UserServices"));
const LoginDto_1 = __importDefault(require("../../Dto/User/LoginDto"));
let login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, password } = req.body;
        const login = yield UserServices_1.default.logIn(new LoginDto_1.default(identifier, password));
        if (login.logged) {
            return res.status(200).json({ status: login.status, token: login.token });
        }
        return res.status(401).json({ status: login.status });
    }
    catch (error) {
        return res.status(500).json({ error: "Error en el servidor" });
    }
});
exports.default = login;
