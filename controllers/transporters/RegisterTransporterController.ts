import { Request, Response } from "express";
import TransporterService from "../../services/TransporterService";
import TransporterDto from "../../Dto/User/Transporter/TransporterDto";

let register = async (req: Request, res: Response) => {
  try {
  
    const userId = req.User?.id_usuario; 

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { license, soat, vehicleCard, vehicleType, vehicleWeight } = req.body;

 
    const newTransporter = new TransporterDto(userId, license, soat, vehicleCard, vehicleType, vehicleWeight);
    await TransporterService.register(newTransporter);

    return res.status(201).json({ status: "Transporter registered successfully" });
  } catch (error: any) {
    if (error && error.code === "ER_DUP_ENTRY") {
      return res.status(500).json({ errorInfo: error.sqlMessage });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default register;
