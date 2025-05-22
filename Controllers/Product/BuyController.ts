import { Request, Response } from "express";
import ProductService from "../../Services/ProductService";

let buy = async (req: Request, res: Response) => {
    try {
        const { id_user, cantidad, latitud, longitud } = req.body;
        const { id_producto } = req.params;

        const result = await ProductService.buy(
            parseInt(id_producto),
            parseInt(id_user),
            parseInt(cantidad),
            latitud, longitud
        );

        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        return res.status(201).json({ success: result.success, status: 'buy ok', message: result.message });

    } catch (error: any) {
        console.error("Error en realizar compra:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(500).json({ errorInfo: error.sqlMessage });
        }
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export default buy;
