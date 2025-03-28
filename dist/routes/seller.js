"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SellerController_1 = __importDefault(require("../controllers/Seller/SellerController"));
const VerifyToken_1 = __importDefault(require("../middleware/VerifyToken"));
const router = express_1.default.Router();
router.post('/requestSeller', VerifyToken_1.default, SellerController_1.default.solicitarVendedor);
router.post('/approveRequest', VerifyToken_1.default, SellerController_1.default.aprobarSolicitud);
exports.default = router;
