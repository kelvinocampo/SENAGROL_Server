import { Request, Response } from "express";
import TransporterService from "../../services/TransporterService";
import TransporterDto from "../../Dto/User/Transporter/TransporterDto";

let register = async (req: Request, res: Response) => {
  try {
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

    // Registrar transportador (devuelve el id_transportador)
    const transporterId = await TransporterService.register(newTransporter);

    // Verificar que la imagen esté presente
    if (!req.file) {
      return res.status(400).json({ error: "Imagen del vehículo no proporcionada" });
    }

    const imageName = req.file.filename;

    // Guardar imagen en la tabla `foto_vehiculo`
    await db.execute(
      `INSERT INTO foto_vehiculo (foto, id_transportador) VALUES (?, ?)`,
      [imageName, transporterId]
    );

    return res.status(201).json({ status: "Transporter and image registered successfully" });

  } catch (error: any) {
    if (error && error.code === "ER_DUP_ENTRY") {
      return res.status(500).json({ errorInfo: error.sqlMessage });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default register;
