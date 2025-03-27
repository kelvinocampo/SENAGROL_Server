import { Request, Response } from 'express';

// Datos de prueba
const productos = [
    { id: 1, nombre: 'Bicicleta de Montaña', precio: 500, descuento: 10 },
    { id: 2, nombre: 'Casco de Seguridad', precio: 50, descuento: 5 },
    { id: 3, nombre: 'Guantes para Ciclismo', precio: 20, descuento: 0 },
];

// Controlador para obtener productos con descuento
export const getProductosConDescuento = async (req: Request, res: Response) => {
    try {
        const productosConDescuento = productos.filter(p => p.descuento > 0);
        res.json(productosConDescuento);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos con descuento' });
    }
};

// Controlador para obtener todos los productos (admin)
export const getProductos = async (req: Request, res: Response) => {
    try {
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// Controlador para obtener información de un producto específico
export const getProductoById = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        const producto = productos.find(p => p.id === productId);
        
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

