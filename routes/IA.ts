import express from "express";
import IARegisteredController from "../controllers/IA/IARegisteredController";
import verifyToken from "../middleware/VerifyToken";
import IAController from "../controllers/IA/IAController";
import IARegisteredMiddleware from "../middleware/IA/IARegistered"
const router = express.Router();

router.post('/registered_user', verifyToken, IARegisteredMiddleware.validatorParams, IARegisteredMiddleware.validator, IARegisteredController);
router.post('/', IAController);

export default router;