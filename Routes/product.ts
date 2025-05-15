
import express from "express";

import GetAllProducts from "../Controllers/Product/GetAllController";

import GetProductsBySeller from "../Controllers/Product/GetBySellerController";

import GetProductsWithDiscount from "../Controllers/Product/GetWithDiscountController";

import GetInfoProduct from "../Controllers/Product/GetController";

import RegisterProducts from "../Controllers/Product/RegisterController";
import CreateValidator from "../Middleware/Product/CreateValidator";

import UpdateProducts from "../Controllers/Product/UpdateController";
import UpdateValidator from "../Middleware/Product/UpdateValidator";

import DeleteProducts from "../Controllers/Product/DeleteController";
import DeleteValidator from "../Middleware/Product/DeleteValidator";

import verifyToken from "../Middleware/VerifyToken";
import upload from "../Middleware/multerConfig";
import verifyRole from "../Middleware/VerifyTokenData";
import Buy from "../Controllers/Product/BuyController";

const router = express.Router();

router.post("/buy/:id_producto", verifyToken, verifyRole(["comprador"]), Buy)
router.get('/', GetAllProducts);
router.get('/my_products', verifyToken, verifyRole(["vendedor"]), GetProductsBySeller);
router.get('/discount', GetProductsWithDiscount);
router.get('/get/:id', GetInfoProduct);
router.post('/create',
    upload.single("imagen"),
    verifyToken,
    verifyRole(["vendedor"]),
    CreateValidator.validatorParams, CreateValidator.validator, RegisterProducts);
router.put('/edit/:id_producto', upload.single("imagen"), verifyToken, verifyRole(["vendedor"]),
    UpdateValidator.validatorParams, UpdateValidator.validator, UpdateProducts);
router.delete('/delete/:id', verifyToken, verifyRole(["vendedor"]), DeleteValidator.validatorParams, DeleteValidator.validator, DeleteProducts);


export default router;

