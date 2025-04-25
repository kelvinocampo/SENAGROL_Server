import { Request, Response } from "express";
import IAService from "../../Services/IAService";

const IARegisteredController = async (req: Request, res: Response) => {
    try {
        const { id_user, role } = req.body;
        const { prompt, history = [] } = req.body;

        const responseIA = await IAService.requestRegister(prompt, role, id_user, history);

        return res.status(200).json({
            status: 'response ok',
            response: responseIA,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ errorInfo: error.message });
        } else {
            return res.status(500).json({ errorInfo: "Ocurrió un error desconocido" });
        }
    }
}

export default IARegisteredController;