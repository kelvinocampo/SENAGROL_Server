import { Request, Response } from "express";
import VendedorService from "../../services/SellerServices";

interface AuthenticatedRequest extends Request {
  user?: { id_usuario: number };
}

class VendedorController {
  static async solicitarVendedor(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id_usuario;

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const result = await VendedorService.solicitarVendedor(userId);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error("Error en solicitarVendedor:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  static async aprobarSolicitud(req: AuthenticatedRequest, res: Response) {
    try {
      const adminId = req.user?.id_usuario;
      const { userId } = req.body;

      if (!adminId) {
        return res.status(401).json({ error: "No autorizado" });
      }

      if (!userId) {
        return res.status(400).json({ error: "ID de usuario requerido" });
      }

      const result = await VendedorService.aprobarSolicitud(adminId, userId);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Error en aprobarSolicitud:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
}

export default VendedorController;
