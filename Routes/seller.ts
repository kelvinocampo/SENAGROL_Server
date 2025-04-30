import express from "express";
import RequestSeller from "../Controllers/Seller/RequestSeller";
import verifyToken from "../Middleware/VerifyToken";
import GetSells from "../Controllers/Seller/GetSells";

const router = express.Router();

router.post('/requestSeller', verifyToken, RequestSeller);
router.post('/my_sells', verifyToken, GetSells);

export default router;