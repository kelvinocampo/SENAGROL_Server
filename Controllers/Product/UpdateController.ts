import { Request, Response } from "express";
import ProductService from "../../Services/ProductService";
import { uploadToAzure } from "../../Helpers/uploadFile";
import Products from "../../Dto/Product/ProductsCreate";

const UpdateProducts = async (req: Request, res: Response) => {
    try {
        const { id_producto } = req.params;

        // Los campos de texto vienen en req.body
        const {
            descripcion,
            cantidad,
            cantidad_minima_compra,
            precio_unidad,
            descuento,
            latitud,
            longitud,
            id_user,
            imagen_url // URL de la imagen existente
        } = req.body;

        let imagenUrl = imagen_url;

        // Procesar nueva imagen si fue enviada (viene en req.file)
        if (req.file) {
            const { url } = await uploadToAzure(req.file, "producto");
            imagenUrl = url;
        }

        if (!imagenUrl) {
            return res.status(400).json({ error: "La imagen es requerida" });
        }

        // Crear DTO con los tipos correctos
        const updatedProduct = new Products(
            Number(id_user),
            "",
            Number(precio_unidad),
            descripcion,
            Number(latitud),
            Number(longitud),
            Number(cantidad),
            Number(cantidad_minima_compra),
            imagenUrl,
            Number(descuento)
        );

        console.log(updatedProduct);
        

        await ProductService.updateProduct(Number(id_producto), updatedProduct);

        return res.status(200).json({ status: "Producto actualizado correctamente" });

    } catch (error: any) {
        console.error("Error al actualizar el producto:", error);
        return res.status(500).json({
            error: error.message,
            details: error.stack // Solo para desarrollo
        });
    }
};

export default UpdateProducts;