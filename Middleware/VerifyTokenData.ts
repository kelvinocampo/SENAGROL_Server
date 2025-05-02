import { Request, Response, NextFunction, RequestHandler } from "express";

export type RequiredRoles = "comprador" | "vendedor" | "administrador" | "transportador";

const verifyRole = (requiredRoles: RequiredRoles[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Verificar que el usuario está autenticado
            if (!req.body.id_user) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            const { roles } = req.body;

            const hasRequiredRole = requiredRoles.some(role =>
                roles.includes(role.trim().toLowerCase())
            );

            if (!hasRequiredRole) {
                return res.status(403).json({ error: "Acceso restringido" });
            }

            // Si pasa todas las validaciones, continuar
            next();
        } catch (error) {
            return res.status(403).json({ error: "Token inválido o expirado" });
        }
    };
};

export default verifyRole;