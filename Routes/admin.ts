import express from "express";
import verifyToken from "../Middleware/VerifyToken";
import activeSellerController from "../Controllers/Admin/activeSellerController";
import activeTransporterController from "../Controllers/Admin/activeTransporterController";
import verifyRole from "../Middleware/VerifyTokenData";
import CreateAdmin from "../Controllers/Admin/CreateAdmin";
import DeleteUser from "../Controllers/Admin/DeleteUser";
const router = express.Router();

router.post('/approveRequestSeller', verifyToken, activeSellerController);
router.post('/approveRequestTransporter', verifyToken, activeTransporterController);
router.post('/usuarios/:id_new_admin', verifyToken, verifyRole(["administrador"]), CreateAdmin);
router.delete('/usuarios/:id_delete_user', verifyToken, verifyRole(["administrador"]), DeleteUser);

export default router;