import express from "express";
import RequestSeller from "../controllers/Seller/RequestSeller";
import verifyToken from "../middleware/VerifyToken";

const router = express.Router();

router.post('/requestSeller', verifyToken, RequestSeller);

export default router;