import { Request, Response } from "express";
import BuyerService from "../../Services/BuyerService";

let getBuys = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;
        const transports = await BuyerService.getBuys(id_user);

        return res.status(200).json({ success: true, transports });
    } catch (error: any) {
        console.error("🚨 Error en consultar compras:", error);
        if (error && error.code === "ER_DUP_ENTRY") {
            return res.status(500).json({ errorInfo: error.sqlMessage });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default getBuys;
