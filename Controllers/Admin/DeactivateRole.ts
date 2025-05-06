import { Request, Response } from "express";
import AdminService from "../../Services/AdminService";

const deactivateRole = async (req: Request, res: Response) => {
  try {
    const { role, id_deactivate_user } = req.params;
    const { id_user } = req.body;
    if (parseInt(id_deactivate_user) == parseInt(id_user)) { return res.status(403).json({ status: false, message: "No puedes editar los roles de tu usuario." }); }

    const result: any = await AdminService.deactivateRole(parseInt(id_deactivate_user), role);
    return res.status(result ? 200 : 400).json({
      status: "Role desactivado",
      message: result.message
    });
  } catch (error) {
    console.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default deactivateRole;
