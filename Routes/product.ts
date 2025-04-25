
import express from "express";

import GetAllProducts from "../Controllers/Product/GetAllController";
import getProductsBySeller from "../Controllers/Product/GetBySellerController";

import RegisterProducts from "../Controllers/Product/RegisterController";
import CreateValidator from "../Middleware/Product/CreateValidator";

import UpdateProducts from "../Controllers/Product/UpdateController";
import UpdateValidator from "../Middleware/Product/UpdateValidator";

import DeleteProducts from "../Controllers/Product/DeleteController";
import DeleteValidator from "../Middleware/Product/DeleteValidator";

import verifyToken from "../Middleware/VerifyToken";
import upload from "../Middleware/multerConfig";
import verifyRole from "../Middleware/VerifyTokenData";

const router = express.Router();

router.get('/', GetAllProducts);
router.get('/bySeller', getProductsBySeller);
router.post('/create',
    upload.single("imagen"),
    verifyToken,
    verifyRole(["vendedor"]),
    CreateValidator.validatorParams, CreateValidator.validator, RegisterProducts);
router.put('/edit/:id', verifyToken,  UpdateValidator.validatorParams, UpdateValidator.validator, UpdateProducts);
router.delete('/delete/:id', verifyToken, DeleteValidator.validatorParams, DeleteValidator.validator, DeleteProducts);


export default router;

