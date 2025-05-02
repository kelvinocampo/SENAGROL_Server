import { Request, Response } from "express";
import AdminService from "../../Services/AdminService";

const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getProducts();
    return res.status(result ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error en consultar productos:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default getProducts;
