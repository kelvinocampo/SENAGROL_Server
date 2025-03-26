import { Request, Response } from "express";
import MessageService from "../../services/Chat/MessageServices";
import Message from "../../Dto/Chat/MessageDTO";

const deleteMessageController = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body.user;
        const { id_chat, id_message } = req.params;

        const result = await MessageService.deleteMessage(
            parseInt(id_user),
            parseInt(id_message),
            parseInt(id_chat)
        );

        return res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

export default deleteMessageController;