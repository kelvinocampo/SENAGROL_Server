import express from "express";

import verifyToken from "../Middleware/VerifyToken";
import verifyRole from "../Middleware/VerifyTokenData";

import assignTransporter from "../Controllers/Buy/AssignTransporter";
import AssignTransporterValidator from "../Middleware/Buy/AssignTransporterValidator";

import GenerateCode from "../Controllers/Buy/GenerateCode";

import ReceiveCodeBuy from "../Controllers/Buy/ReceiveCode";

import CancelTransport from "../Controllers/Buy/CancelTransport";

import GetLocation from "../Controllers/Buy/GetLocation";

import GetAddress from "../Controllers/Buy/GetAddress";
const router = express.Router();

router.patch('/assign/:id_compra/:id_transportador',
    verifyToken, verifyRole(["comprador"]), AssignTransporterValidator.validatorParams, AssignTransporterValidator.validator,
    assignTransporter);
router.get("/code/:id_compra",
    verifyToken, verifyRole(["comprador", "vendedor"]), GenerateCode)
router.patch("/state/:code",
    verifyToken, verifyRole(["transportador"]), ReceiveCodeBuy)
router.patch("/cancelTransport/:id_compra",
    verifyToken, verifyRole(["transportador", "comprador"]), CancelTransport)
router.get("/getLocation/:id_compra",
    verifyToken, verifyRole(["transportador", "comprador"]), GetLocation)
router.get("/getAddress", GetAddress)

export default router;
