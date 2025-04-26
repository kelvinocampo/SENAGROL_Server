import express from "express";

import verifyToken from "../Middleware/VerifyToken";

import GetUserById from '../Controllers/User/GetUsuarioController';

import UpdatePasswordController from '../Controllers/User/UpdatePasswordController';
import UpdatePasswordValidator from '../Middleware/User/UpdatePasswordValidator';

import RegisterController from '../Controllers/User/RegisterController';
import RegisterValidator from '../Middleware/User/RegisterValidator';

import LoginValidator from '../Middleware/User/LoginValidator';
import LoginController from "../Controllers/User/loginController";

import UpdateUserProfile from "../Controllers/User/UpdateController";

const router = express.Router();

router.post('/register', RegisterValidator.validatorParams, RegisterValidator.validator, RegisterController);
router.post('/login', LoginValidator.validatorParams, LoginValidator.validator, LoginController);
router.patch('/password', verifyToken, UpdatePasswordValidator.validatorParams, UpdatePasswordValidator.validator, UpdatePasswordController);

// Falta middleware
router.put('/edit', verifyToken, UpdateUserProfile);
router.get("/", verifyToken, GetUserById);

export default router;

