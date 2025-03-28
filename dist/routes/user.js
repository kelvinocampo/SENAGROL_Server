"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VerifyToken_1 = __importDefault(require("../middleware/VerifyToken"));
const RegisterController_1 = __importDefault(require("../controllers/users/RegisterController"));
const RegisterValidator_1 = __importDefault(require("../middleware/user/RegisterValidator"));
const LoginValidator_1 = __importDefault(require("../middleware/user/LoginValidator"));
const loginController_1 = __importDefault(require("../controllers/users/loginController"));
const router = express_1.default.Router();
router.post('/register', RegisterValidator_1.default.validatorParams, RegisterValidator_1.default.validator, RegisterController_1.default);
router.post('/login', LoginValidator_1.default.validatorParams, LoginValidator_1.default.validator, loginController_1.default);
router.post('/edit', VerifyToken_1.default);
router.post('/profile', VerifyToken_1.default);
exports.default = router;
