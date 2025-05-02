import { Request, Response } from "express";
import AdminService from "../../Services/AdminService";

const deactivateRole = async (req: Request, res: Response) => {
  try {
    const { role, id_deactivate_user } = req.params;

    const result = await AdminService.deactivateRole(parseInt(id_deactivate_user), role);
    return res.status(result ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default deactivateRole;
