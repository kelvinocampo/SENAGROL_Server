import { Request, Response } from "express";
import Adminservice from "../../services/AdminService";

interface AuthenticatedRequest extends Request {
  user?: { id_usuario: number };
}

const activeSellerController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = req.user?.id_usuario;
    const { userId } = req.body;

    if (!adminId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    if (!userId) {
      return res.status(400).json({ error: "ID de usuario requerido" });
    }

    const result = await Adminservice.ActiveSeller(adminId, userId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default activeSellerController;
