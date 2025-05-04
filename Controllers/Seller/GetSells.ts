import { Request, Response } from "express";
import SellerServices from "../../Services/SellerServices";

const getSells = async (req: Request, res: Response) => {
  try {
    const id_user = req.body.id_user;
    const result = await SellerServices.getSells(id_user);
    return res.status(result ? 200 : 400).json({
      status: "register ok",
      my_sells: result
    });
  } catch (error) {
    console.error("Error en solicitarVendedor:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}


export default getSells;
