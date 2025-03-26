import { Request, Response } from "express";
import db from "../../config/configDB";

let UpdateProducts = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
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

        if (!id) {
            return res.status(400).json({ error: "Falta el ID del producto" });
        }

        // Verificar si el producto existe antes de actualizar
        const checkSql = `SELECT * FROM producto WHERE id_producto = ?`;
        const [existingProduct]: any = await db.execute(checkSql, [id]);

        if (existingProduct.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Validar que todos los campos requeridos están en el body
        if (!Nombre || !Precio || !latitud || !longitud || !quantity || !MinimumQuantity || Discount === undefined) {
            return res.status(400).json({ error: "Todos los campos son obligatorios para una actualización completa." });
        }

        // Query de actualización
        const updateSql = `
            UPDATE producto 
            SET nombre = ?, precio_unidad = ?, descripcion = ?, latitud = ?, longitud = ?, 
                cantidad = ?, cantidad_minima_compra = ?, imagen = ?, descuento = ?
            WHERE id_producto = ?
        `;
        const values = [Nombre, Precio, Description, latitud, longitud, quantity, MinimumQuantity, imagen, Discount, id];

        await db.execute(updateSql, values);

        return res.status(200).json({ status: "Producto actualizado correctamente" });

    } catch (error: any) {
        console.error("Error al actualizar el producto:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export default UpdateProducts;
