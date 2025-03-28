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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let authorization = req.header('Authorization');
    if (!authorization) {
        return res.status(403).json({ status: "The Authorization header is required" });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'You have not sent a token' });
    }
    try {
        let decoded = jsonwebtoken_1.default.verify(token, process.env.KEY_TOKEN);
        req.body.user = { id_user: decoded.data.id, roles: decoded.data.roles };
        next();
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(403).json({ error: "Token inválido o expirado", details: error });
    }
});
exports.default = verifyToken;
