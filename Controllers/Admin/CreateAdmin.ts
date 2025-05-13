import { Request, Response } from "express";
import AdminService from "../../Services/AdminService";

interface CreateAdminResult {
  success: boolean;
  message: string;
}

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result: CreateAdminResult = await AdminService.CreateAdmin(parseInt(userId));

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "new admin",
      message: result.message,
    });
  } catch (error) {
    console.error("Error en aprobarSolicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default createAdmin;
