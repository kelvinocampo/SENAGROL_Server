import { Request, Response } from "express";
import UserService from "../../Services/UserServices";
import User from "../../Dto/User/UserDto";

async function updateUserProfile(req: Request, res: Response) {
    try {
        const { name, username, email, phone, password } = req.body;

        const userId = req.body.id_user;

        const updatedUser = await UserService.updateUserProfile(userId, new User(name, username, email, password, phone));

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
