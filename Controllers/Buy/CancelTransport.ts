import { Request, Response } from "express";
import BuyerService from "../../Services/BuyerService";
import BuyService from "../../Services/BuyService";

let cancelTransport = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;
        const { id_compra } = req.params;
        const result: any = await BuyService.cancelTransport(id_user, parseInt(id_compra));

        return res.status(result.code).json({ success: result.success, message: result.message });
    } catch (error: any) {
        console.error("🚨 Error en cancelar transporte:", error);
        if (error && error.code === "ER_DUP_ENTRY") {
            return res.status(500).json({ errorInfo: error.sqlMessage });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default cancelTransport;
