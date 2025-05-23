import { Request, Response } from "express";
import ChatService from "../../Services/ChatServices";

const initChat = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;
        const { id_user2 } = req.params;

        const result:any = await ChatService.initChat(
            parseInt(id_user),
            parseInt(id_user2)
        );

        return res.status(result.code).json({
            status: result.status,
            message: result.message,
            chat: result.chat || null
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

export default initChat;