import express from "express";
import verifyToken from "../Middleware/VerifyToken";
import activeSellerController from "../Controllers/Admin/activeSellerController";
import activeTransporterController from "../Controllers/Admin/activeTransporterController";
import verifyRole from "../Middleware/VerifyTokenData";
import CreateAdmin from "../Controllers/Admin/CreateAdmin";
import DeleteUser from "../Controllers/Admin/DeleteUser";
import DeactivateRole from "../Controllers/Admin/DeactivateRole";
import DeactivateRoleValidator from "../Middleware/Admin/DeactivateRoleValidator";
import GetProducts from "../Controllers/Admin/GetProducts";
import GetSales from "../Controllers/Admin/GetSales";
import UnpublishProduct from "../Controllers/Admin/UnpublishProduct";
import GetUsersAdmin from "../Controllers/Admin/GetAllUsersController";
import DeleteProductAdmin from "../Controllers/Admin/DeleteProductController";
import PublishProduct from "../Controllers/Admin/PublishProduct";
const router = express.Router();

router.post('/approveRequestSeller', verifyToken, verifyRole(["administrador"]), activeSellerController);
router.post('/approveRequestTransporter', verifyToken, verifyRole(["administrador"]), activeTransporterController);
router.post('/usuarios/:userId', verifyToken, verifyRole(["administrador"]), CreateAdmin);
router.delete('/usuarios/:id_delete_user', verifyToken, verifyRole(["administrador"]), DeleteUser);
router.patch('/usuarios/:role/:id_deactivate_user',
    verifyToken, verifyRole(["administrador"]), DeactivateRoleValidator.validatorParams, DeactivateRoleValidator.validator,
    DeactivateRole);
router.get('/products', verifyToken, verifyRole(["administrador"]), GetProducts);
router.get('/sales', verifyToken, verifyRole(["administrador"]), GetSales);
router.get('/usuarios', verifyToken, verifyRole(["administrador"]), GetUsersAdmin);
router.patch('/products/unpublish/:id_producto', verifyToken, verifyRole(["administrador"]), UnpublishProduct);
router.patch('/products/publish/:id_producto', verifyToken, verifyRole(["administrador"]), PublishProduct);
router.delete('/products/delete/:id_producto', verifyToken, verifyRole(["administrador"]), DeleteProductAdmin);

export default router;