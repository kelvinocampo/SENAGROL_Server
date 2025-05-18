import { Request, Response } from "express";
import UserService from "../../Services/UserServices";

async function recoverUser(req: Request, res: Response) {
    try {
        const { email } = req.body;

        const result: any = await UserService.recoverUser(email);

        return res.status(result.code).json({
            success: result.success,
            message: result.message,
        });
    } catch (error: any) {
        console.error("Error enviando correo de recuperacion:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export default recoverUser;
