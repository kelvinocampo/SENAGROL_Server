import express from "express";

import RequestTransporterController from '../Controllers/Transporter/RequestTransporterController';
import RegisterValidator from '../Middleware/Transporter/RegisterValidator';

import verifyToken from "../Middleware/VerifyToken";
import verifyRole from "../Middleware/VerifyTokenData";

import upload from "../Middleware/multerConfig";

import GetTransports from "../Controllers/Transporter/GetTransports";

const router = express.Router();

router.post('/requestTransporter',
    upload.single("imagen"),
    verifyToken,
    verifyRole(["vendedor", "comprador"]), RegisterValidator.transporterValidatorParams, RegisterValidator.transporterValidator, RequestTransporterController);
router.get("/transports", verifyToken, verifyRole(["transportador"]), GetTransports)

export default router;