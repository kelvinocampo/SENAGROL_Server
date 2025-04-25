import express from "express";
import verifyToken from "../Middleware/VerifyToken";
import RegisterController from '../Controllers/User/RegisterController';
import RegisterValidator from '../Middleware/User/RegisterValidator';
import LoginValidator from '../Middleware/User/LoginValidator';
import LoginController from "../Controllers/User/loginController";
const router = express.Router();

router.post('/register', RegisterValidator.validatorParams, RegisterValidator.validator, RegisterController);
router.post('/login', LoginValidator.validatorParams, LoginValidator.validator, LoginController);
router.post('/edit', verifyToken);
router.post('/profile', verifyToken);

export default router;

