import { Request, Response } from "express";
import BuyService from "../../Services/BuyService";

let generateCode = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;
        const { id_compra } = req.params;
        const code = await BuyService.generateCode(parseInt(id_compra), parseInt(id_user));

        return res.status(200).json({ success: true, code: code.codigo });
    } catch (error: any) {
        console.error("🚨 Error en generar codigo unico de compra:", error);
        if (error && error.code === "ER_DUP_ENTRY") {
            return res.status(500).json({ errorInfo: error.sqlMessage });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default generateCode;
