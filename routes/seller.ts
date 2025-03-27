import express from "express";
import VendedorController from "../controllers/Seller/SellerController";
import verifyToken from "../middleware/VerifyToken";

const router = express.Router();

router.post('/requestSeller',verifyToken, VendedorController.solicitarVendedor);
router.post('/approveRequest',verifyToken, VendedorController.aprobarSolicitud);


export default router;