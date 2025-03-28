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
const IAService_1 = __importDefault(require("../../services/IAService"));
const IAController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt, history = [] } = req.body;
        const responseIA = yield IAService_1.default.responseIA(prompt, history);
        return res.status(200).json({
            status: 'response ok',
            response: responseIA,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ errorInfo: error.message });
        }
        else {
            return res.status(500).json({ errorInfo: "Ocurrió un error desconocido" });
        }
    }
});
exports.default = IAController;
