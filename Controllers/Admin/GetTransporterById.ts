// src/Controllers/Transporter/GetTransporterById.ts
import { Request, Response } from "express";
import TransporterService from "../../Services/TransporterService";

const GetTransporterById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const transporter = await TransporterService.getTransporterById(id);

    if (!transporter) {
      return res
        .status(404)
        .json({ success: false, message: "Transportador no encontrado" });
    }

    return res.status(200).json({ success: true, transporter });
  } catch (error) {
    console.error("🚨 Error al obtener transportador por ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default GetTransporterById;
