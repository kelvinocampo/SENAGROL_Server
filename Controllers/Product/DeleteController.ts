import { Request, Response } from "express";
import ProductService from "../../Services/ProductService";

interface AuthenticatedRequest extends Request {
    user?: { id_usuario: number };
}

class DeleteProducts {
    static async deleteProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.body.id_user;
            const { id } = req.params;

            const result = await ProductService.deleteProduct(userId, parseInt(id));
            return res.status(200).json(result);

        } catch (error: any) {
            return res.status(403).json({ error: error.message });
        }
    }
}

export default DeleteProducts;
