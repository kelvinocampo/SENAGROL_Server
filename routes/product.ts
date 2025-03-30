
import express from "express";
import GetAllProducts from "../controllers/products/GetAllController";

import RegisterProducts from "../controllers/products/RegisterController";
import CreateValidator from "../middleware/Products/CreateValidator";

import UpdateProducts from "../controllers/products/Update-controller";
import UpdateValidator from "../middleware/Products/UpdateValidator";

import DeleteProducts from "../controllers/products/DeleteController";
import DeleteValidator from "../middleware/Products/DeleteValidator";

import verifyToken from "../middleware/VerifyToken";
import upload from "../middleware/multerConfig";
import verifyRole from "../middleware/VerifyTokenData";

const router = express.Router();

router.get('/', GetAllProducts);
router.post('/create',
    upload.single("imagen"),
    verifyToken,
    verifyRole(["vendedor"]),
    CreateValidator.validatorParams, CreateValidator.validator, RegisterProducts);
router.put('/edit/:id', verifyToken, UpdateValidator.validatorParams, UpdateValidator.validator, UpdateProducts);
router.delete('/delete/:id', verifyToken, DeleteValidator.validatorParams, DeleteValidator.validator, DeleteProducts.deleteProduct);


export default router;

