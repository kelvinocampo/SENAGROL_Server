import express from "express";
import getDiscountedProducts from "../controllers/product/GetDiscountedProductsController";

const router = express.Router();

router.get("/discount", getDiscountedProducts);

export default router;

