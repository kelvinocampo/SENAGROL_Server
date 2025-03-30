import express from "express";
import verifyToken from "../middleware/VerifyToken";
import activeSellerController from "../controllers/Admin/activeSellerController";
import activeTransporterController from "../controllers/Admin/activeTransporterController";
const router = express.Router();

router.post('/approveRequestSeller', verifyToken, activeSellerController);
router.post('/approveRequestTransporter', verifyToken, activeTransporterController);

export default router;