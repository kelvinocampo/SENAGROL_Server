import express from "express";

import verifyToken from "../Middleware/VerifyToken";
import verifyRole from "../Middleware/VerifyTokenData";

import assignTransporter from "../Controllers/Buy/AssignTransporter";
import AssignTransporterValidator from "../Middleware/Buy/AssignTransporterValidator";

import GenerateCode from "../Controllers/Buy/GenerateCode";

import ReceiveCodeBuy from "../Controllers/Buy/ReceiveCode";
const router = express.Router();

router.patch('/assign/:id_compra/:id_transportador',
    verifyToken, verifyRole(["comprador"]), AssignTransporterValidator.validatorParams, AssignTransporterValidator.validator,
    assignTransporter);
router.get("/code/:id_compra",
    verifyToken, verifyRole(["comprador", "vendedor"]), GenerateCode)
router.patch("/state/:code",
    verifyToken, verifyRole(["comprador", "vendedor"]), ReceiveCodeBuy)

export default router;
