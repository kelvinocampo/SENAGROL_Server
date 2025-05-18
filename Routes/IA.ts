import express from "express";
import IARegisteredController from "../Controllers/IA/IARegisteredController";
import verifyToken from "../Middleware/VerifyToken";
import IAController from "../Controllers/IA/IAController";
import IAMiddleware from "../Middleware/IA/IARegistered"
const router = express.Router();

router.post('/registered_user', verifyToken, IAMiddleware.validatorParams, IAMiddleware.validator, IARegisteredController);
router.post('/', IAMiddleware.validatorParams, IAMiddleware.validator, IAController);

export default router;