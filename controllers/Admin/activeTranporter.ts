import { Request, Response } from "express";
import Adminservice from "../../services/AdminService";

interface AuthenticatedRequest extends Request {
  user?: { id_user: number };
}

const activeTransporterController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userIdAdmin = req.user?.id_user;
    const { userId } = req.body;
    console.log(req.user);
    if (!userIdAdmin) {
      return res.status(401).json({ error: "No autorizado" });
    }

    if (!userId) {
      return res.status(400).json({ error: "ID de usuario requerido" });
    }

    const result = await Adminservice.ActiveTransporter(userIdAdmin, userId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default activeTransporterController;
