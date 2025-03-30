import express from "express";
import verifyToken from "../middleware/VerifyToken";
import RegisterTransporterController from '../controllers/transporters/RequestTransporterController';
import RegisterValidator from '../middleware/transporter/RegisterValidator';
const router = express.Router();

router.post('/register',verifyToken, RegisterValidator.transporterValidatorParams, RegisterValidator.transporterValidator, RegisterTransporterController);
router.post('/edit', verifyToken);
router.post('/profile', verifyToken);

export default router;