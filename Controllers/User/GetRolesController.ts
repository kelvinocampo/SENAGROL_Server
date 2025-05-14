import { Request, Response } from "express";

async function getRole(req: Request, res: Response) {
    try {
        return res.status(200).json({
            message: "Roles del usuario",
            roles: req.body.roles,
        });
    } catch (error: any) {
        console.error("Error obteniendo roles:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export default getRole;
