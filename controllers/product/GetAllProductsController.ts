import { Request, Response } from "express";
import db from "../../config/database";

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const [products] = await db.query("SELECT * FROM producto");

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener productos" });
    }
};

export default getAllProducts;

//Obtiene todos los productos de la base de datos.

//Devuelve la lista en formato JSON
