import express from "express";
import RequestTransporterController from '../controllers/transporters/RequestTransporterController';
import RegisterValidator from '../middleware/transporter/RegisterValidator';
import verifyToken from "../middleware/VerifyToken";
import upload from "../middleware/multerConfig";
import verifyRole from "../middleware/VerifyTokenData";
const router = express.Router();

router.post('/requestTransporter',
    upload.single("imagen"),
    verifyToken,
    verifyRole(["Transporter"]),RegisterValidator.transporterValidatorParams, RegisterValidator.transporterValidator, RequestTransporterController);
router.post('/edit', verifyToken);
router.post('/profile', verifyToken);

export default router;