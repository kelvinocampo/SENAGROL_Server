import express from "express";
import RequestTransporterController from '../Controllers/Transporter/RequestTransporterController';
import RegisterValidator from '../Middleware/Transporter/RegisterValidator';
import verifyToken from "../Middleware/VerifyToken";
import upload from "../Middleware/multerConfig";
import verifyRole from "../Middleware/VerifyTokenData";
const router = express.Router();

router.post('/requestTransporter',
    upload.single("imagen"),
    verifyToken,
    verifyRole(["vendedor","comprador"]),RegisterValidator.transporterValidatorParams, RegisterValidator.transporterValidator, RequestTransporterController);
router.post('/edit', verifyToken);
router.post('/profile', verifyToken);

export default router;