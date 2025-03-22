import express from "express";
import IARegisteredController from "../controllers/IA/IARegisteredController";
import verifyToken from "../middleware/VerifyToken";
import IAController from "../controllers/IA/IAController";
const router = express.Router();

// router.post('/registered_user', verifyToken, IARegisteredController);
router.post('/registered_user', IARegisteredController);
router.post('/', IAController);

export default router;