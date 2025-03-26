import { Request, Response } from "express";
import ProductService from "../../services/ProductService";

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductService.getAll();
        return res.status(200).json({ status: "query ok", products });
    } catch (error: any) {
        console.error("Error al obtener productos:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export default getAllProducts;
