import { Request, Response } from "express";
import UserService from "../../Services/UserServices";
import AdminService from "../../Services/AdminService";

async function getUsersAdmin(req: Request, res: Response) {
    try {
        const users = await AdminService.getUsers();

        return res.status(200).json({
            message: "Lista de usuarios",
            user: users,
        });
    } catch (error: any) {
        console.error("Error obteniendo usuario:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export default getUsersAdmin;
