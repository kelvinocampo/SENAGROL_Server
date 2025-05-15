import { Request, Response } from "express";
import BuyService from "../../Services/BuyService";

let receiveCodeBuy = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;
        const { code } = req.params;
        const result: any = await BuyService.receiveCodeBuy(code, parseInt(id_user));
        if (!result.success) {
            return res.status(400).json({ success: false, error: result.message });
        }
        return res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
        console.error("🚨 Error en generar codigo unico de compra:", error);
        if (error && error.code === "ER_DUP_ENTRY") {
            return res.status(500).json({ errorInfo: error.sqlMessage });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default receiveCodeBuy;
