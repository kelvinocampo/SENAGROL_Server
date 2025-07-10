import { Request, Response } from "express";
import UserService from "../../Services/UserServices";

async function getUsers(req: Request, res: Response) {
    try {

        const id_user = req.body.id_user
        const users = await UserService.getAll(id_user);

        return res.status(200).json({
            message: "Lista de usuarios",
            user: users,
        });
    } catch (error: any) {
        console.error("Error obteniendo usuario:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export default getUsers;
