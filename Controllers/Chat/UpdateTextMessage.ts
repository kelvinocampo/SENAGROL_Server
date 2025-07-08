import { Request, Response } from "express";
import MessageService from "../../Services/MessageServices";
import Message from "../../Dto/Chat/MessageDTO";
import { getIO } from "../../Config/socket";

const UpdateTextMessageController = async (req: Request, res: Response) => {
    try {
        const { id_user, text } = req.body;
        const { id_chat, id_message } = req.params;

        const updatedMessage = await MessageService.updateTextMessage(
            new Message(true, "texto", text, new Date(), parseInt(id_chat), parseInt(id_user)),
            parseInt(id_message)
        );

        // 👇 Emitir mensaje actualizado por socket si tiene id_mensaje
        if (updatedMessage && updatedMessage.id_mensaje) {
            const io = getIO();
            io.to(`chat_${id_chat}`).emit("updated_message", updatedMessage);
        }

        return res.status(200).json({
            status: 'success',
            data: updatedMessage
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export default UpdateTextMessageController;
