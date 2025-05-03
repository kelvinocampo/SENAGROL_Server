import express from "express";

import verifyToken from "../Middleware/VerifyToken";

import TextMessageController from "../Controllers/Chat/TextMessage";
import TextMessageMiddleware from "../Middleware/Chat/TextMessage";

import UpdateTextMessageMiddleware from "../Middleware/Chat/UpdateTextMessage";
import UpdateTextMessageController from "../Controllers/Chat/UpdateTextMessage";

import DeleteMessageController from "../Controllers/Chat/DeleteMessage";

import DeleteChatController from "../Controllers/Chat/DeleteChat";

import GetChats from "../Controllers/Chat/GetAll";

import GetChat from "../Controllers/Chat/Get";

import ImageMessageController from "../Controllers/Chat/ImageMessage";
import upload from "../Middleware/multerConfig";
import AudioMessageController from "../Controllers/Chat/AudioMessage";

const router = express.Router();

router.get('/', verifyToken, GetChats);
router.get('/:id_chat', verifyToken, GetChat);
router.delete('/:id_chat', verifyToken, DeleteChatController);
router.post('/:id_chat/message/text', verifyToken, TextMessageMiddleware.validatorParams, TextMessageMiddleware.validator, TextMessageController);
router.post('/:id_chat/message/image', upload.single("imagen"), verifyToken, ImageMessageController);
router.post('/:id_chat/message/image', upload.single("audio"), verifyToken, AudioMessageController);
router.put('/:id_chat/message/:id_message', verifyToken, UpdateTextMessageMiddleware.validatorParams, UpdateTextMessageMiddleware.validator, UpdateTextMessageController);
router.delete('/:id_chat/message/:id_message', verifyToken, DeleteMessageController);

export default router;