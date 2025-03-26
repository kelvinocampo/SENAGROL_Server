import express from "express";
import verifyToken from "../middleware/VerifyToken";
import RegisterController from "../controllers/users/RegisterController";
import RegisterValidator from "../middleware/user/RegisterValidator";
import LoginValidator from '../middleware/user/LoginValidator';
import LoginController from '../controllers/users/loginController';
const router = express.Router();

//router.post('/register ', RegisterValidator.validatorParams, RegisterValidator.validator, RegisterController);
router.post('/register', RegisterValidator.validatorParams, RegisterValidator.validator, RegisterController);
router.post('/login', LoginValidator.validatorParams, LoginValidator.validator, LoginController);
router.post('/edit', verifyToken);
router.post('/profile', verifyToken);

export default router;  

