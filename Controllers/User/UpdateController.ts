import { Request, Response } from "express";
import UserService from "../../Services/UserServices";
import User from "../../Dto/User/UserDto";
import TransporterDto from "../../Dto/User/TransporterDto";

async function updateUserProfile(req: Request, res: Response) {
    try {
        const { name, username, email, phone, password, id_user,
            license, soat, vehicleCard, vehicleType, vehicleWeight // data transporter
        } = req.body;

        const newTransporter = new TransporterDto(
            id_user,
            license || "",
            soat || "",
            vehicleCard || "",
            vehicleType || "",
            vehicleWeight || 0
        );
        const updatedUser = await UserService.updateUserProfile(id_user, new User(name, username, email, password, phone), newTransporter);

        if (!updatedUser.success) {
            return res.status(404).json({ error: updatedUser.status });
        }

        return res.status(200).json({
            message: updatedUser.status,
            user: updatedUser.user,
        });
    } catch (error: any) {
        console.error("Error al actualizar el perfil:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export default updateUserProfile;
