import express from "express";
import verifyToken from "../middleware/VerifyToken";
const router = express.Router();

router.post('/:id/message/text');

export default router;