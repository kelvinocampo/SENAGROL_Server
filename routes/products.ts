import express from "express";
import getDiscountedProducts from "../controllers/product/GetDiscountedProductsController";
import getAllProducts from "../controllers/product/GetAllProductsController"; // Nuevo controlador
import getProductById from "../controllers/product/GetProductByIdController"; // Nuevo controlador

const router = express.Router();

router.get("/discount", getDiscountedProducts);
router.get("/", getAllProducts); // Obtener todos los productos
router.get("/:id", getProductById); // Obtener producto por ID

export default router;

