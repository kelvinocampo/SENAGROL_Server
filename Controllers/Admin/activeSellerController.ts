import { Request, Response } from "express";
import AdminService from "../../Services/AdminService";

interface AuthenticatedRequest extends Request {
  user?: { id_user: number };
}

const activeSellerController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.body;

    const result = await AdminService.ActiveSeller(userId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default activeSellerController;
