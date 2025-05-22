import { Request, Response } from "express";
import BuyService from "../../Services/BuyService";

let getAddress = async (req: Request, res: Response) => {
    try {
        const { lat, lon } = req.query;
        const result: any = await BuyService.getAddress(parseFloat(lat as string), parseFloat(lon as string));

        return res.status(result.code).json({ success: result.success, message: result.message });
    } catch (error: any) {
        console.error("🚨 Error en cancelar transporte:", error);
        if (error && error.code === "ER_DUP_ENTRY") {
            return res.status(500).json({ errorInfo: error.sqlMessage });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default getAddress;
