import { Request, Response } from "express";
import ProductService from "../../Services/ProductService";
import { uploadToAzure } from "../../Helpers/uploadFile";
import Products from "../../Dto/Product/ProductsCreate";

const UpdateProducts = async (req: Request, res: Response) => {
    try {
        const { id_producto } = req.params;
        const {
            Nombre,
            Precio,
            Description,
            latitud,
            longitud,
            quantity,
            MinimumQuantity,
            Discount,
            id_user,
            imagen // Agregamos este campo para recibir la URL actual
        } = req.body;
        
        let imagenUrl = imagen; // Mantenemos la imagen actual por defecto

        // Solo subir nueva imagen si se proporciona
        if (req.file) {
            const { url } = await uploadToAzure(req.file, "producto");
            imagenUrl = url;
        }

        if (!imagenUrl) {
            return res.status(400).json({ error: "La imagen es requerida" });
        }

        const updatedProduct = new Products(
            id_user, 
            Nombre, 
            Precio, 
            Description, 
            latitud, 
            longitud, 
            quantity, 
            MinimumQuantity, 
            imagenUrl, 
            Discount
        );

        if (!id_producto) {
            return res.status(400).json({ error: "Falta el ID del producto" });
        }

        await ProductService.updateProduct(Number(id_producto), updatedProduct);

        return res.status(200).json({ status: "Producto actualizado correctamente" });

    } catch (error: any) {
        console.error("Error al actualizar el producto:", error);
        return res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

export default UpdateProducts;