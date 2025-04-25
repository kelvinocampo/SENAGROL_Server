import { Request, Response } from "express";
import ProductService from "../../Services/ProductService";

const getBySeller = async (req: Request, res: Response) => {
    try {
        const { id_user } = req.body
        const products = await ProductService.getBySeller(id_user);

        return res.status(200).json({
            status: "query ok",
            total: products.length,
            products
        });

    } catch (error: any) {
        console.error("Error al obtener productos:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export default getBySeller;
