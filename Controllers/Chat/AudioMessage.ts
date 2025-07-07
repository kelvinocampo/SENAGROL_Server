import { Request, Response } from "express";
import MessageService from "../../Services/MessageServices";
import Message from "../../Dto/Chat/MessageDTO";
import { uploadToAzure } from "../../Helpers/uploadFile";
import { getIO } from "../../Config/socket"; // 👈 Importar socket

const audioMessageController = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;
        const { id_chat } = req.params;

        const { url: audio } = await uploadToAzure(req.file, "mensajes");

        const result = await MessageService.sendMessage(
            new Message(false, "audio", audio, new Date(), parseInt(id_chat), parseInt(id_user))
        );

        // ✅ Emitir mensaje por socket si se envió correctamente
        if (result.success && result.data?.id_mensaje) {
            const io = getIO();
            io.to(`chat_${id_chat}`).emit("new_message", result.data); // 👈 Envío en tiempo real
        }

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
};

export default audioMessageController;
