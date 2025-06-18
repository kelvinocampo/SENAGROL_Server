// Controllers/textMessageController.ts
import { Request, Response } from "express";
import MessageService from "../../Services/MessageServices";
import Message from "../../Dto/Chat/MessageDTO";

const textMessageController = async (req: Request, res: Response) => {
    try {
        const { id_user, text } = req.body;
        const { id_chat } = req.params;

        const result = await MessageService.sendMessage(
            new Message(
                false, // editado
                "texto", // tipo
                text, // contenido
                new Date(), // fecha_envio
                parseInt(id_chat),
                parseInt(id_user)
            )
        );

        if (!result.success || !result.data?.id_mensaje) {
            return res.status(result.code || 500).json({
                status: 'error',
                message: result.message || "Error al enviar el mensaje"
            });
        }

        return res.status(result.code).json({
            status: 'success',
            message: result.message,
            data: result.data
        });

    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export default textMessageController;