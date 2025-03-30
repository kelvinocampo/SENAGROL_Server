import { Request, Response } from "express";
import ProductService from "../../services/ProductService";
import ProductRepository from "../../repositories/ProductRepository"; // Asegurar que el repositorio maneje la validación del vendedor

const getAll = async (req: Request, res: Response) => {
    try {
        // Obtener todos los productos
        const products = await ProductService.getAll();

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

export default getAll;
