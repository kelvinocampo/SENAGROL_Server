import { Request, Response } from "express";
import AdminService from "../../Services/AdminService";


const createAdmin = async (req: Request, res: Response) => {
  try {
    const { id_new_admin } = req.params;

    const result: any = await AdminService.CreateAdmin(parseInt(id_new_admin));
    return res.status(result ? 200 : 400).json({
      status: "new admin",
      message: result.message
    });
  } catch (error) {
    console.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default createAdmin;
