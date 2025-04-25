import { Request, Response } from "express";
import SellerServices from "../../Services/SellerServices";

const SellerController = async (req: Request, res: Response) => {
  try {
    const userId = req.body.id_user;
    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const result = await SellerServices.requestSeller(userId);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error("Error en solicitarVendedor:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}


export default SellerController;
