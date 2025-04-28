import express from "express";

import verifyToken from "../Middleware/VerifyToken";
import verifyRole from "../Middleware/VerifyTokenData";

import GetBuys from "../Controllers/Buyer/GetBuys";
const router = express.Router();

router.get('/buys', verifyToken, verifyRole(["comprador"]), GetBuys);

export default router;