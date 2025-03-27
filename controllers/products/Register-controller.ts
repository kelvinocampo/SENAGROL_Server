import { Request, Response } from "express";
import productDto from "../../Dto/Products/ProductsCreate";
import ProductService from "../../services/ProductService";

interface AuthenticatedRequest extends Request {
    user?: { id_usuario: number, roles: string[] }; // Agregar roles
}

let registerProducts = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id_usuario;
        const userRoles = req.user?.roles || [];

        // Validar que el usuario está autenticado
        if (!userId) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        // Validar que el usuario es un vendedor
        if (!userRoles.includes("vendedor") && !userRoles.includes("vendedor ")) {
            return res.status(403).json({ error: "Acceso denegado. Solo los vendedores pueden registrar productos." });
        }

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

        if (!Nombre || !Precio || !Description) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // Crear DTO y registrar producto
        const newProduct = new productDto(userId, Nombre, Precio, Description, latitud, longitud, quantity, MinimumQuantity, imagen, Discount);
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
