import express from "express";
import verifyToken from "../Middleware/VerifyToken";
import activeSellerController from "../Controllers/Admin/activeSellerController";
import activeTransporterController from "../Controllers/Admin/activeTransporterController";
const router = express.Router();

router.post('/approveRequestSeller', verifyToken, activeSellerController);
router.post('/approveRequestTransporter', verifyToken, activeTransporterController);

export default router;