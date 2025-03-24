import { Request, Response } from "express";
import MessageService from "../../services/Chat/MessageServices";
import Message from "../../Dto/Chat/MessageDTO";

const UpdateTextMessageController = async (req: Request, res: Response) => {
    try {
        const { id: userID, text } = req.body;
        const { id_chat, id_message } = req.params;

        const result = await MessageService.updateTextMessage(
            new Message(true, "texto", text, (new Date()), parseInt(id_chat), parseInt(userID)),
            parseInt(id_message)
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

export default UpdateTextMessageController;