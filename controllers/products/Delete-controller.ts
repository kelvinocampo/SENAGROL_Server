import { Request, Response } from "express";
import db from "../../config/configDB"; 

let deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Falta el ID del producto" });
        }


        const deleteSql = `DELETE FROM producto WHERE id_producto = ?`;
        const [result]: any = await db.execute(deleteSql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        return res.status(200).json({ status: "Producto eliminado correctamente" });

    } catch (error: any) {
        console.error("Error al eliminar el producto:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export default deleteProduct;
