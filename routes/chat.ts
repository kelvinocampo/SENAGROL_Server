import express from "express";

import verifyToken from "../middleware/VerifyToken";

import textMessageController from "../controllers/Chat/TextMessage";
import textMessageMiddleware from "../middleware/Chat/TextMessage";

import UpdateTextMessageMiddleware from "../middleware/Chat/UpdateTextMessage";
import UpdateTextMessageController from "../controllers/Chat/UpdateTextMessage";

import DeleteMessageMiddleware from "../middleware/Chat/DeleteMessage";
import DeleteMessageController from "../controllers/Chat/DeleteMessage";

import DeleteChatMiddleware from "../middleware/Chat/DeleteChat";
import DeleteChatController from "../controllers/Chat/DeleteChat";
const router = express.Router();

router.delete('/:id_chat', verifyToken, DeleteChatMiddleware.validatorParams, DeleteChatMiddleware.validator, DeleteChatController);

router.post('/:id_chat/message/text', verifyToken, textMessageMiddleware.validatorParams, textMessageMiddleware.validator, textMessageController);
router.put('/:id_chat/message/:id_message', verifyToken, UpdateTextMessageMiddleware.validatorParams, UpdateTextMessageMiddleware.validator, UpdateTextMessageController);
router.delete('/:id_chat/message/:id_message', verifyToken, DeleteMessageMiddleware.validatorParams, DeleteMessageMiddleware.validator, DeleteMessageController);

export default router;