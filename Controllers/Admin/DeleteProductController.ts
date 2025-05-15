import { Request, Response } from "express";
import ProductService from "../../Services/ProductService";

async function deleteProductAdmin(req: Request, res: Response) {
    try {
        const { id_producto } = req.params;

        const result = await ProductService.deleteProductAdmin(parseInt(id_producto));
        return res.status(200).json(result);

    } catch (error: any) {
        return res.status(403).json({ error: error.message });
    }
}

export default deleteProductAdmin;
