import express from "express";
import verifyToken from "../middleware/VerifyToken";
import textMessageController from "../controllers/Chat/TextMessage";
import textMessageMiddleware from "../middleware/Chat/TextMessage";
import UpdateTextMessageMiddleware from "../middleware/Chat/UpdateTextMessage";
import UpdateTextMessageController from "../controllers/Chat/UpdateTextMessage";
import DeleteMessageMiddleware from "../middleware/Chat/DeleteMessage";
const router = express.Router();

// router.post('/:id_chat/message/text', verifyToken, textMessageMiddleware.validatorParams, textMessageMiddleware.validator, textMessageController);
router.post('/:id_chat/message/text', textMessageMiddleware.validatorParams, textMessageMiddleware.validator, textMessageController);
router.put('/:id_chat/message/:id_message', UpdateTextMessageMiddleware.validatorParams, UpdateTextMessageMiddleware.validator, UpdateTextMessageController);
router.delete('/:id_chat/message/:id_message', DeleteMessageMiddleware.validatorParams, DeleteMessageMiddleware.validator, DeleteTextMessageController);

export default router;