import express from "express";

import verifyToken from "../Middleware/VerifyToken";

import textMessageController from "../Controllers/Chat/TextMessage";
import textMessageMiddleware from "../Middleware/Chat/TextMessage";

import UpdateTextMessageMiddleware from "../Middleware/Chat/UpdateTextMessage";
import UpdateTextMessageController from "../Controllers/Chat/UpdateTextMessage";

import DeleteMessageMiddleware from "../Middleware/Chat/DeleteMessage";
import DeleteMessageController from "../Controllers/Chat/DeleteMessage";

import DeleteChatMiddleware from "../Middleware/Chat/DeleteChat";
import DeleteChatController from "../Controllers/Chat/DeleteChat";
const router = express.Router();

router.delete('/:id_chat', verifyToken, DeleteChatMiddleware.validatorParams, DeleteChatMiddleware.validator, DeleteChatController);

router.post('/:id_chat/message/text', verifyToken, textMessageMiddleware.validatorParams, textMessageMiddleware.validator, textMessageController);
router.put('/:id_chat/message/:id_message', verifyToken, UpdateTextMessageMiddleware.validatorParams, UpdateTextMessageMiddleware.validator, UpdateTextMessageController);
router.delete('/:id_chat/message/:id_message', verifyToken, DeleteMessageMiddleware.validatorParams, DeleteMessageMiddleware.validator, DeleteMessageController);

export default router;