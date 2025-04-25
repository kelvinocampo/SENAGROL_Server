import express from "express";
import RequestSeller from "../Controllers/Seller/RequestSeller";
import verifyToken from "../Middleware/VerifyToken";

const router = express.Router();

router.post('/requestSeller', verifyToken, RequestSeller);

export default router;