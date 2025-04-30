import { Request, Response } from "express";
import productDto from "../../Dto/Product/ProductsCreate";
import ProductService from "../../Services/ProductService";
import { uploadToAzure } from "../../Helpers/uploadFile";

let registerProducts = async (req: Request, res: Response) => {
    try {
        const userId = req.body.id_user;

        // Extraer datos del cuerpo de la petición
        const {
            Nombre,
            Precio,
            Description,
            latitud,
            longitud,
            quantity,
            MinimumQuantity,
            Discount
        } = req.body;

        const { url: imagenUrl } = await uploadToAzure(req.file, "producto")

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
