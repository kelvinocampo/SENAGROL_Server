"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const IARegisteredController_1 = __importDefault(require("../controllers/IA/IARegisteredController"));
const VerifyToken_1 = __importDefault(require("../middleware/VerifyToken"));
const IAController_1 = __importDefault(require("../controllers/IA/IAController"));
const IARegistered_1 = __importDefault(require("../middleware/IA/IARegistered"));
const router = express_1.default.Router();
router.post('/registered_user', VerifyToken_1.default, IARegistered_1.default.validatorParams, IARegistered_1.default.validator, IARegisteredController_1.default);
router.post('/', IAController_1.default);
exports.default = router;
