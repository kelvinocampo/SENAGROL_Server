import express from "express";
import IARegisteredController from "../Controllers/IA/IARegisteredController";
import verifyToken from "../Middleware/VerifyToken";
import IAController from "../Controllers/IA/IAController";
import IARegisteredMiddleware from "../Middleware/IA/IARegistered"
const router = express.Router();

router.post('/registered_user', verifyToken, IARegisteredMiddleware.validatorParams, IARegisteredMiddleware.validator, IARegisteredController);
router.post('/', IAController);

export default router;