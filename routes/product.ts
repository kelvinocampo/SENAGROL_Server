
import express from "express";
import GetAllProducts from "../controllers/products/GetAll-controller";

import RegisterProducts from "../controllers/products/Register-controller";
import CreateValidator from "../middleware/Products/CreateValidator";

import UpdateProducts from "../controllers/products/Update-controller";
import UpdateValidator from "../middleware/Products/UpdateValidator";

import DeleteProducts from "../controllers/products/Delete-controller";
import DeleteValidator from "../middleware/Products/DeleteValidator";

import verifyToken from "../middleware/VerifyToken";

const router = express.Router();

router.get('/my_products', verifyToken, GetAllProducts);
router.post('/create', verifyToken, CreateValidator.validatorParams, CreateValidator.validator, RegisterProducts);
router.put('/edit/:id', verifyToken, UpdateValidator.validatorParams, UpdateValidator.validator, UpdateProducts);
router.delete('/delete/:id', verifyToken, DeleteValidator.validatorParams, DeleteValidator.validator, DeleteProducts.deleteProduct);


export default router;

