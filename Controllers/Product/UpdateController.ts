import { Request, Response } from "express";
import ProductService from "../../Services/ProductService";

const UpdateProducts = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Falta el ID del producto" });
        }

        await ProductService.updateProduct(Number(id), req.body);

        return res.status(200).json({ status: "Producto actualizado correctamente" });

    } catch (error: any) {
        console.error("Error al actualizar el producto:", error);
        return res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

export default UpdateProducts;
