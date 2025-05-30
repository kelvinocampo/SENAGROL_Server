import express from "express";

import verifyToken from "../Middleware/VerifyToken";

import GetUserById from '../Controllers/User/GetController';

import UpdatePasswordController from '../Controllers/User/UpdatePasswordController';
import UpdatePasswordValidator from '../Middleware/User/UpdatePasswordValidator';

import RegisterController from '../Controllers/User/RegisterController';
import RegisterValidator from '../Middleware/User/RegisterValidator';

import LoginValidator from '../Middleware/User/LoginValidator';
import LoginController from "../Controllers/User/LoginController";

import UpdateUserProfile from "../Controllers/User/UpdateController";
import UpdateValidator from '../Middleware/User/UpdateValidator';

import GetUsers from "../Controllers/User/GetAllController";

import RefreshAccessToken from "../Controllers/User/RefreshTokenController";

import GetRole from "../Controllers/User/GetRolesController";

import RecoverUser from "../Controllers/User/RecoverController";
import RecoverValidator from "../Middleware/User/RecoverValidator";
import GetID from "../Controllers/User/GetIDController";

const router = express.Router();

router.post('/register', RegisterValidator.validatorParams, RegisterValidator.validator, RegisterController);
router.post('/login', LoginValidator.validatorParams, LoginValidator.validator, LoginController);
router.post('/refresh', RefreshAccessToken);
router.patch('/password', verifyToken, UpdatePasswordValidator.validatorParams, UpdatePasswordValidator.validator, UpdatePasswordController);
router.get("/", verifyToken, GetUserById);
router.get("/all", verifyToken, GetUsers);
router.put('/edit', verifyToken, UpdateValidator.validatorParams, UpdateValidator.validator, UpdateUserProfile);
router.get('/role', verifyToken, GetRole);
router.get('/id', verifyToken, GetID);
router.post('/recover', RecoverValidator.validatorParams, RecoverValidator.validator, RecoverUser);

export default router;

