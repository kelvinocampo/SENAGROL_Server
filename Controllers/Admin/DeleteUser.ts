import { Request, Response } from "express";
import AdminService from "../../Services/AdminService";

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id_delete_user } = req.params;

    const result: any = await AdminService.deleteUser(parseInt(id_delete_user));
    return res.status(result ? 200 : 400).json({
      status: "user deleted",
      message: result.message
    });
  } catch (error) {
    console.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default deleteUser;
