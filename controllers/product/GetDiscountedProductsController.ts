import { Request, Response } from "express";
import db from "../../config/database";

const getDiscountedProducts = async (req: Request, res: Response) => {
    try {
        const [products] = await db.query("SELECT * FROM producto WHERE descuento > 0");

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener productos con descuento" });
    }
};

export default getDiscountedProducts;

