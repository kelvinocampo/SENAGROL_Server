import { Request, Response } from "express";
import productDto from "../../Dto/Products/ProductsCreate";
import ProductService from "../../services/ProductService";
import { uploadToAzure } from "../../Helpers/AzureFileStorage/uploadFile";

interface AuthenticatedRequest extends Request {
    user?: { id_usuario: number, roles: string[] }; // Agregar roles
}

let registerProducts = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.body.user?.id_user;

        // Extraer datos del cuerpo de la petición
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

        const imagenUrl = await uploadToAzure(imagen, "producto")

        // Crear DTO y registrar producto
        const newProduct = new productDto(userId, Nombre, Precio, Description, latitud, longitud, quantity, MinimumQuantity, imagenUrl, Discount);
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
