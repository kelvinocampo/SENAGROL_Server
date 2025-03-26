import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

interface Data {
    id: number,
    role: "admin" | "vendedor" | "transportador" | "comprador" | "vendedor transportador"
}

interface JwtPayload {
    data: Data,
    exp: number,
    iat: number
}

// Extender Request para incluir `user`
interface AuthenticatedRequest extends Request {
    user?: { id_usuario: number };
}

const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let authorization = req.header('Authorization');
    console.log("Authorization Header:", authorization);

    if (!authorization) {
        return res.status(403).json({ status: "The Authorization header is required" });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'You have not sent a token' });
    }
    console.log("JWT Secret Key:", process.env.KEY_TOKEN);

    try {
        let decoded = jwt.verify(token, process.env.KEY_TOKEN as string) as JwtPayload;
        console.log("Decoded Token:", decoded);

        // ✅ Asignar `req.user` en lugar de `req.body`
        req.user = { id_usuario: decoded.data.id };

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(403).json({ error: "Token inválido o expirado", details: error });
    }
};

export default verifyToken;
