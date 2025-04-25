import { Request, Response } from "express";
import ProductService from "../../Services/ProductService";

const getWithDiscount = async (req: Request, res: Response) => {
    try {
        const products = await ProductService.getWithDiscount();

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

export default getWithDiscount;
