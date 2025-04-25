import { Request, Response, NextFunction, RequestHandler } from "express";

const verifyRole = (requiredRoles: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body);
            
            // Verificar que el usuario está autenticado
            if (!req.body.id_user) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            const { roles } = req.body;

            // Verificar cada rol requerido
            for (const role of requiredRoles) {
                if (!roles.includes(role)) {
                    return res.status(403).json({ error: "Acceso restringido" });
                }
            }

            // Si pasa todas las validaciones, continuar
            next();
        } catch (error) {
            return res.status(403).json({ error: "Token inválido o expirado" });
        }
    };
};

export default verifyRole;