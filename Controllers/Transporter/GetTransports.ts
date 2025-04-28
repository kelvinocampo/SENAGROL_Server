import { Request, Response } from "express";
import TransporterService from "../../Services/TransporterService";

let getTransports = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body;
        const transports = await TransporterService.getTransports(id_user);

        return res.status(200).json({ success: true, transports });
    } catch (error: any) {
        console.error("🚨 Error en consultar transportes:", error);
        if (error && error.code === "ER_DUP_ENTRY") {
            return res.status(500).json({ errorInfo: error.sqlMessage });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};


export default getTransports;
