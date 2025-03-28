"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductoById = exports.getProductos = exports.getProductosConDescuento = void 0;
// Datos de prueba
const productos = [
    { id: 1, nombre: 'Bicicleta de Montaña', precio: 500, descuento: 10 },
    { id: 2, nombre: 'Casco de Seguridad', precio: 50, descuento: 5 },
    { id: 3, nombre: 'Guantes para Ciclismo', precio: 20, descuento: 0 },
];
// Controlador para obtener productos con descuento
const getProductosConDescuento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productosConDescuento = productos.filter(p => p.descuento > 0);
        res.json(productosConDescuento);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener productos con descuento' });
    }
});
exports.getProductosConDescuento = getProductosConDescuento;
// Controlador para obtener todos los productos (admin)
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(productos);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});
exports.getProductos = getProductos;
// Controlador para obtener información de un producto específico
const getProductoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        const producto = productos.find(p => p.id === productId);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});
exports.getProductoById = getProductoById;
