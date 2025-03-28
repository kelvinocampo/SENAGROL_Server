import express from "express";
import verifyToken from "../middleware/VerifyToken";
import activeSellerController from "../controllers/Admin/activeSellerController";
const router = express.Router();

router.post('/approveRequest',verifyToken, activeSellerController);

export default router;  