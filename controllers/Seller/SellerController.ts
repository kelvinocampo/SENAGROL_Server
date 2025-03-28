import { Request, Response } from "express";
import VendedorService from "../../services/SellerServices";

interface AuthenticatedRequest extends Request {
  user?: { id_user: number };
}
  const SellerController = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id_user;
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


export default SellerController;
