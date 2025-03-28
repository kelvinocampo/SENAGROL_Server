"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VerifyToken_1 = __importDefault(require("../middleware/VerifyToken"));
const RegisterTransporterController_1 = __importDefault(require("../controllers/transporters/RegisterTransporterController"));
const RegisterValidator_1 = __importDefault(require("../middleware/transporter/RegisterValidator"));
const router = express_1.default.Router();
router.post('/register', VerifyToken_1.default, RegisterValidator_1.default.transporterValidatorParams, RegisterValidator_1.default.transporterValidator, RegisterTransporterController_1.default);
router.post('/edit', VerifyToken_1.default);
router.post('/profile', VerifyToken_1.default);
exports.default = router;
