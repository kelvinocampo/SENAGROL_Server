import express from "express";
import verifyToken from "../middleware/VerifyToken";
import textMessageController from "../controllers/Chat/TextMessageController";
import textMessageMiddleware from "../middleware/Chat/TextMessageMiddleware";
const router = express.Router();

// router.post('/:id_chat/message/text', verifyToken, textMessageMiddleware.validatorParams, textMessageMiddleware.validator, textMessageController);
router.post('/:id_chat/message/text', textMessageMiddleware.validatorParams, textMessageMiddleware.validator, textMessageController);

export default router;