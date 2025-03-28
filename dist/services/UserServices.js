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
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const generateHash_1 = __importDefault(require("../Helpers/generateHash"));
const generateToken_1 = __importDefault(require("../Helpers/generateToken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const BuyerRepository_1 = __importDefault(require("../repositories/BuyerRepository"));
class UserService {
    static register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.password = yield (0, generateHash_1.default)(user.password);
            const id_user = yield UserRepository_1.default.add(user);
            const registerBuyer = yield BuyerRepository_1.default.add(id_user);
            return { success: true, status: "Usuario registrado" };
        });
    }
    static getByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserRepository_1.default.getByID(id);
        });
    }
    static logIn(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield UserRepository_1.default.findByEmailOrUsername(user.identifier);
            if (!foundUser) {
                return { logged: false, status: "Usuario o contraseña incorrectos" };
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(user.password, foundUser.contraseña);
            if (!isPasswordValid) {
                return { logged: false, status: "Usuario o contraseña incorrectos" };
            }
            const userRoles = yield UserRepository_1.default.getUserRoles(foundUser.id_usuario);
            const TOKEN_DURATION = 60;
            const token = (0, generateToken_1.default)({ id: foundUser.id_usuario, roles: userRoles }, process.env.KEY_TOKEN, TOKEN_DURATION);
            return { logged: true, status: "Login exitoso", token: token };
        });
    }
}
exports.default = UserService;
