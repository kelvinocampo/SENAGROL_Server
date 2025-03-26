import { Request, Response } from "express";
import productDto from "../../Dto/Products/ProductsCreate";
import ProductService from "../../services/ProductService";

/* interface AuthenticatedRequest extends Request {
    user?: { id_usuario: number };
} */

let registerProducts = async (req: Request, res: Response) => {
    try {

        const userId = 1; // valor por defecto, asegurándote de que exista en la tabla "vendedor"
       

        const {
            
            Nombre,
            Precio,
            Description,
            latitud,
            longitud,
            quantity,
            MinimumQuantity,
            imagen,
            Discount
        } = req.body;

        if (!Nombre || !Precio || !Description) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const newProduct = new productDto( userId,Nombre, Precio, Description, latitud, longitud, quantity, MinimumQuantity, imagen, Discount);
        await ProductService.register(newProduct);

        return res.status(201).json({ status: 'register ok' });

    } catch (error: any) {
        console.error("Error en registerProducts:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(500).json({ errorInfo: error.sqlMessage });
        }
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export default registerProducts;
