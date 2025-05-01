import { Request, Response } from "express";
import BuyerService from "../../Services/BuyerService";

let assignTransporter = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;
        const { precio_transporte } = req.body;
        const { id_compra, id_transportador } = req.params;
        const transports = await BuyerService.assignTransporter(id_user, parseInt(id_compra), parseInt(id_transportador), precio_transporte);

        return res.status(200).json({ success: true, transports });
    } catch (error: any) {
        console.error("🚨 Error en asignar transportador:", error);
        if (error && error.code === "ER_DUP_ENTRY") {
            return res.status(500).json({ errorInfo: error.sqlMessage });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default assignTransporter;
