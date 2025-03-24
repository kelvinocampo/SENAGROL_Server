import { Request, Response } from "express";
import db from "../../config/database";

const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [product] = await db.query("SELECT * FROM producto WHERE id_producto = ?", [id]);

        if (!product.length) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json(product[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el producto" });
    }
};

export default getProductById;

//Busca un producto por su id.

//Si no existe, devuelve un error 404.
