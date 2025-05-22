import { Request, Response } from "express";
import ChatService from "../../Services/ChatServices";

const getChats = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;

        const result = await ChatService.getChats(parseInt(id_user));

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

export default getChats;