import { Request, Response } from "express";
import IAService from "../../Services/IAService";

const IAController = async (req: Request, res: Response) => {
    try {
        const { prompt, history = [] } = req.body;

        const parsedHistory: any[] = history.map((item: any) => {
            return {
                role: item.role == "ia" ? "model" : "user",
                parts: [{ text: item.message }]
            }
        })

        const responseIA = await IAService.responseIA(prompt, parsedHistory);

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