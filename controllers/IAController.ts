import { Request, Response } from "express";
import IAService from "../services/IAService";

const IAController = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;

        const responseIA = await IAService.request(prompt);

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