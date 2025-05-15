import { Request, Response } from "express";
import AdminService from "../../Services/AdminService";

const publishProduct = async (req: Request, res: Response) => {
  try {
    const { id_producto } = req.params
    const result = await AdminService.publishProduct(parseInt(id_producto));
    return res.status(result ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error en publicar producto:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default publishProduct;
