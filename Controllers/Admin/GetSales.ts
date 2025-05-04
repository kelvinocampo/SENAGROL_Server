import { Request, Response } from "express";
import AdminService from "../../Services/AdminService";

const getSales = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getSales();
    return res.status(result ? 200 : 400).json({
      status:"query ok",
      sales: result
    });
  } catch (error) {
    console.error("Error en consultar ventas:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default getSales;
