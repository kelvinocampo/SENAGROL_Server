import { Request, Response } from "express";
import ProductService from "../../services/ProductService";
import ProductRepository from "../../repositories/PruductRepository"; // Asegurar que el repositorio maneje la validación del vendedor

interface AuthenticatedRequest extends Request {
    user?: { id_usuario: number };
}

const getAll = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id_usuario;

        if (!userId) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        // Verificar si el usuario es un vendedor
        const isSeller = await ProductRepository.findSellerById(userId);
        if (!isSeller) {
            return res.status(403).json({ error: "Acceso denegado. Solo los vendedores pueden ver los productos." });
        }

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
