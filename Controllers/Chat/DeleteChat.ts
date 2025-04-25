import { Request, Response } from "express";
import ChatService from "../../Services/ChatServices";

const deleteChatController = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;
        const { id_chat } = req.params;

        const result = await ChatService.deleteChat(
            parseInt(id_user),
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

export default deleteChatController;