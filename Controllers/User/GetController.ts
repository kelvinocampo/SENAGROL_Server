import { Request, Response } from "express";
import UserService from "../../Services/UserServices";

async function getUserById(req: Request, res: Response) {
    try {
        const userId = req.body.id_user;

        const userProfile = await UserService.getByID(parseInt(userId));

        if (!userProfile) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.status(200).json({
            message: "Perfil del usuario obtenido correctamente",
            user: userProfile,
        });
    } catch (error: any) {
        console.error("Error obteniendo usuario:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export default getUserById;
