"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
let validatorParams = [
    (0, express_validator_1.check)('user.id_user')
        .trim()
        .notEmpty()
        .withMessage('El Token es requerido')
        .isInt({ min: 1 })
        .withMessage('El Token contiene datos invalidos')
        .toInt(), // Convierte el valor a entero
    (0, express_validator_1.check)('user.roles')
        .trim()
        .notEmpty()
        .withMessage('El Token es requerido')
        .isIn(["admin", "vendedor", "transportador", "comprador", "vendedor transportador"])
        .withMessage('El Token contiene datos invalidos'),
    (0, express_validator_1.check)('prompt')
        .trim()
        .notEmpty()
        .withMessage('El prompt se encuentra vacio')
];
function validator(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}
exports.default = {
    validatorParams,
    validator
};
