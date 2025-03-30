import express from "express";
import verifyToken from "../middleware/VerifyToken";
import RequestTransporterController from '../controllers/transporters/RequestTransporterController';
import RegisterValidator from '../middleware/transporter/RegisterValidator';
const router = express.Router();

router.post('/requestTransporter', verifyToken, RegisterValidator.transporterValidatorParams, RegisterValidator.transporterValidator, RequestTransporterController);
router.post('/edit', verifyToken);
router.post('/profile', verifyToken);

export default router;