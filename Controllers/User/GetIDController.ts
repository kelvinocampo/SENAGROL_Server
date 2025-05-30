import { Request, Response } from "express";

async function getID(req: Request, res: Response) {
    try {
        return res.status(200).json({
            message: "Id del usuario",
            id_usuario: req.body.id_user,
        });
    } catch (error: any) {
        console.error("Error obteniendo id de usuario:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export default getID;
