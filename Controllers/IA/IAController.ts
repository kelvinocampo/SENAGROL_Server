import { Request, Response } from "express";
import IAService from "../../Services/IAService";

const IAController = async (req: Request, res: Response) => {
    try {
        const { prompt, history = [] } = req.body;

        const responseIA = await IAService.responseIA(prompt, history);

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

export default IAController;