import { Request, Response } from "express";
import MessageService from "../../Services/MessageServices";
import Message from "../../Dto/Chat/MessageDTO";

const textMessageController = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;
        const { text } = req.body;
        const { id_chat } = req.params;

        const result:any = await MessageService.sendMessage(
            new Message(false, "texto", text, (new Date()), parseInt(id_chat), parseInt(id_user))
        );

        return res.status(result.code).json({
            status: result.success,
            message: result.message || null,
            data: result.data || null
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

export default textMessageController;