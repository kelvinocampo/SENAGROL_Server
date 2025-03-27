import { Router } from 'express';
import * as productoController from '../controllers/Producto/productoController';

const router = Router();

// Endpoint para obtener productos con descuento
router.get('/discount', productoController.getProductosConDescuento);

// Endpoint para obtener todos los productos (admin)
router.get('/', productoController.getProductos);

// Endpoint para obtener información de un producto específico
router.get('/:id', productoController.getProductoById);

export default router;

