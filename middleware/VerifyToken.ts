import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

interface Data {
    id: number,
    roles: "admin" | "vendedor" | "transportador" | "comprador" | "vendedor transportador"
}

interface JwtPayload {
    data: Data,
    exp: number,
    iat: number
}


interface AuthenticatedRequest extends Request {
    user?: { id_user: number, roles: string };
}

const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let authorization = req.header('Authorization');
   
    if (!authorization) {
        return res.status(403).json({ status: "The Authorization header is required" });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'You have not sent a token' });
    }

    try {
        let decoded = jwt.verify(token, process.env.KEY_TOKEN as string) as JwtPayload;
        req.body.user = { id_user: decoded.data.id, roles: decoded.data.roles };
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado", details: error });
    }
    
};

export default verifyToken;

