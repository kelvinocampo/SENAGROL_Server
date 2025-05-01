import express from "express";

import verifyToken from "../Middleware/VerifyToken";
import verifyRole from "../Middleware/VerifyTokenData";

import assignTransporter from "../Controllers/Buy/AssignTransporter";
import AssignTransporterValidator from "../Middleware/Buy/AssignTransporterValidator";
const router = express.Router();

router.patch('/assign/:id_compra/:id_transportador',
    verifyToken, verifyRole(["comprador"]), AssignTransporterValidator.validatorParams, AssignTransporterValidator.validator,
    assignTransporter);

export default router;
