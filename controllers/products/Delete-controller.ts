import { Request, Response } from "express";
import ProductService from "../../services/ProductService";

interface AuthenticatedRequest extends Request {
    user?: { id_usuario: number };
}

class DeleteProducts {
    static async deleteProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id_usuario;
            const { id } = req.params;

            if (!userId) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            if (!id) {
                return res.status(400).json({ error: "Falta el ID del producto" });
            }

            const result = await ProductService.deleteProduct(userId, parseInt(id));
            return res.status(200).json(result);

        } catch (error: any) {
            return res.status(403).json({ error: error.message });
        }
    }
}

export default DeleteProducts;
