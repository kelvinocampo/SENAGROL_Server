import express from "express";
import SellerController from "../controllers/Seller/SellerController";
import verifyToken from "../middleware/VerifyToken";

const router = express.Router();

router.post('/requestSeller',verifyToken, SellerController);



export default router;