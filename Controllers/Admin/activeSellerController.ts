import { Request, Response } from "express";
import AdminService from "../../Services/AdminService";


const activeSellerController = async (req: Request, res: Response) => {
  try {
    const { userId, id_user } = req.body;
    if (userId == id_user) { return res.status(403).json({ status: false, message: "No puedes editar los roles de tu usuario." }); }

    const result = await AdminService.ActiveSeller(userId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default activeSellerController;
