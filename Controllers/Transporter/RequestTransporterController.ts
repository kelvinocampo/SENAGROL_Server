import { Request, Response } from "express";
import TransporterService from "../../Services/TransporterService";
import TransporterDto from "../../Dto/User/TransporterDto";

let register = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const userId = req.body.id_user;
    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { license, soat, vehicleCard, vehicleType, vehicleWeight } = req.body;

    const newTransporter = new TransporterDto(
      userId,
      license,
      soat,
      vehicleCard,
      vehicleType,
      vehicleWeight
    );

    if (!req.file) {
      return res.status(400).json({ error: "Imagen del vehículo no proporcionada" });
    }

    const imageName = req.file.filename;

    const transporterId = await TransporterService.register(newTransporter, imageName);

    return res.status(201).json({ success: true, transporterId });
  } catch (error: any) {
    console.error("🚨 Error en register:", error); // Agrega esto
    if (error && error.code === "ER_DUP_ENTRY") {
      return res.status(500).json({ errorInfo: error.sqlMessage });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};


export default register;
