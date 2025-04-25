import { Request, Response } from "express";
import Adminservice from "../../Services/AdminService";

const activeTransporterController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const result = await Adminservice.ActiveTransporter(userId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default activeTransporterController;
